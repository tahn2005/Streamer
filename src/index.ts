import express from 'express';
import http from 'http';
import cors from 'cors';
import router from './routes';
import { initializeClosesCache } from './streaming/closingcache';
import { initprices } from './streaming/current';
import { cryptostream } from './streaming/cryptosocket';
import { stockstream } from './streaming/stocksocket';
import { setupWebSocket } from './websocket'; 
import { getNews } from './news';

// Stream services
stockstream();
cryptostream();

const app = express();
const server = http.createServer(app);

// CORS options with domain restriction
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? ['https://www.buegr.com'] // Production domain
      : ['http://localhost:5173']; // Local dev domains

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow if no origin (e.g., testing locally)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
      console.log('not allowed');
    }
  },
};

app.use(cors(corsOptions));  // Use the restricted CORS options

// Middlewares
app.use(express.json());
app.use('/api', router);

// WebSocket setup
setupWebSocket(server);

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS policy: Access denied' });
  } else {
    next(err);  // Forward other errors
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeClosesCache(); // ensures cache is ready at boot
  await initprices(); // fetches latest prices at server start
  await getNews(); // gathers news
});
