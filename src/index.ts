import express from 'express';
import http from 'http';
import cors from 'cors';
import router from './routes';
import {initializeClosesCache} from './streaming/closingcache';
import {initprices} from './streaming/current';
import { cryptostream } from './streaming/cryptosocket';
import { stockstream} from './streaming/stocksocket';
import { setupWebSocket } from './websocket'; 
import { getNews } from './news';

stockstream();
cryptostream();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.use('/api', router);

setupWebSocket(server); 

const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeClosesCache(); // ensures cache is ready at boot
  await initprices(); //fetches latest prices at server start
  await getNews(); //gathers news
});
