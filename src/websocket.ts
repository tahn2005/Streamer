
import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import dotenv from 'dotenv';

import { pricesCache } from './streaming/current';
import { closesCache } from './streaming/closingcache';
import { newsCache, getNews } from './news';

dotenv.config();

const prod = process.env.PROD.split(',').map(o => o.trim());
const dev = process.env.DEV.split(',').map(o => o.trim());

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true }); // use manual upgrade handling

  // Push prices every minute
  setInterval(() => {
    const prices = pricesCache;
    const closes = closesCache;
    const type = 'p';

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type, prices, closes }));
      }
    });
  }, 60000);

  // Update news every ten minutes
  setInterval(async () => {
    await getNews();
    const news = newsCache;
    const type = 'n';
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type, news }));
      }
    });
  }, 600000);

  // Handle verified connections
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Intercept and authenticate upgrade requests
  server.on('upgrade', (req, socket, head) => {
    const requestUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const token = requestUrl.searchParams.get('token');
    const origin = req.headers.origin;
  
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? prod
      : dev;
  
    // Token check
    if (token !== process.env.TOKEN) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
  
    // Origin domain restriction
    if (origin && !allowedOrigins.includes(origin)) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
  
    // If all checks pass, allow WebSocket upgrade
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });
}

