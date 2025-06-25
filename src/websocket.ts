// src/websocket.ts
import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { pricesCache } from './streaming/current';
import { closesCache } from './streaming/closingcache';
import { newsCache, getNews } from './news';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  // Push prices every minute
  setInterval(async () => {
    const prices = pricesCache;     
    const closes = closesCache; 
    const type = 'p';

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({type, prices, closes})); 
      }
    });
  }, 60000);

  //update news every ten minutes
  setInterval(async () => {
    await getNews();
    const news = newsCache;
    const type = 'n';     
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({type, news})); 
      }
    });
  }, 600000);

  // Handle new client connections
  wss.on('connection', (ws) => {
    console.log('🌐 Client connected');

    ws.on('close', () => {
      console.log('❌ Client disconnected');
    });
  });
}
