// src/websocket.ts
import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { getinitprices } from './streaming/current';
import { getClosesFromCache } from './streaming/closingcache';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  // Push prices every minute
  setInterval(async () => {
    const prices = getinitprices();     
    const closes = getClosesFromCache(); 

    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        console.log(JSON.stringify({prices, closes}));
        client.send(JSON.stringify({prices, closes})); 
      }
    });
  }, 60000);

  // Handle new client connections
  wss.on('connection', (ws) => {
    console.log('🌐 Client connected');

    ws.on('close', () => {
      console.log('❌ Client disconnected');
    });
  });
}
