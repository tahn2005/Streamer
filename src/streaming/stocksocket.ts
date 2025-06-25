import WebSocket from 'ws';
import dotenv from 'dotenv';
import {stocksymbol} from '../routes';
import { updateprices } from './current';
dotenv.config();

const API_KEY = process.env.ALPACA_KEY_ID || 'PKEWVTHE7H08E493KMDF';
const SECRET_KEY = process.env.ALPACA_SECRET_KEY || 'QqxoAc4DW4UcyqfoiLeNYTRfhCe6g2h9h6AAL6Ay';
const WS_URL = 'wss://stream.data.alpaca.markets/v2/delayed_sip';

export function stockstream() {
  const socket = new WebSocket(WS_URL);

  socket.on('open', () => {
    console.log('Connected to Alpaca Stock WebSocket');

    // Authenticate
    socket.send(JSON.stringify({
      action: 'auth',
      key: API_KEY,
      secret: SECRET_KEY,
    }));
  });

  socket.on('message', (data: WebSocket.RawData) => {
    const messages = JSON.parse(data.toString());

    for (const msg of messages) {
      if (msg.T === 'success' && msg.msg === 'authenticated') {
        console.log('✅ Authenticated successfully');

        // Subscribe to AAPL trades
        socket.send(JSON.stringify({
          action: 'subscribe',
          trades: stocksymbol,
        }));
      } else if (msg.T === 'subscription') {
        console.log('📡 Subscribed to:', msg);
      } else if (msg.T === 't') {
        updateprices(msg.S, msg.p);
      } else {
        console.log('📩 Other message:', msg);
      }
    }
  });

  socket.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
  });

  socket.on('close', () => {
    console.log('🔌 Connection closed stock');
  });
}
