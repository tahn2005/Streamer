import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { pricesCache} from './streaming/current';
import { closesCache} from './streaming/closingcache';
import { newsCache } from './news';
dotenv.config();

const router = express.Router();
router.use(verifyToken);
let symbols = JSON.parse(process.env.SYMBOLS);

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token || token !== process.env.TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
  next();
}
const split = splitSymbolsByType(symbols);
let cryptosymbol = split.cryptosymbol;
let stocksymbol = split.stocksymbol;

// Split symbols by type
function splitSymbolsByType(input: { symbol: string, type: string }[]) {
  const crypto: string[] = [];
  const stock: string[] = [];
  for (const { symbol, type } of input) {
    if (type === 'crypto') crypto.push(symbol);
    else if (type === 'stock') stock.push(symbol);
  }
  return { cryptosymbol: crypto, stocksymbol: stock };
}

//Endpoint: initialzes default values
router.get('/init', async (req: Request, res: Response) => {
  try {
    const prices = pricesCache;     
    const closes = closesCache;    
    const news = newsCache;         
    res.json({ prices, closes, news });
  } catch (error) {
    console.error('Error in /init:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

//Endpoint: subscribes to certain stocks
// router.post('/sub', async (req: Request, res: Response) => {
//   try {
//     symbols = req.body;
//     const split = splitSymbolsByType(symbols);
//     cryptosymbol = split.cryptosymbol;
//     stocksymbol = split.stocksymbol;
//     await initializeClosesCache(); // ensures cache is ready at boot
//     await initprices(); //fetches latest prices at server start
//     const prices = getinitprices();     
//     const closes = getClosesFromCache();             

//     res.json({ prices, closes });
//   } catch (error) {
//     console.error('Error in /init:', error);
//     res.status(500).json({ error: 'Failed to fetch prices' });
//   }
// });

// Ping endpoint
router.get('/ping', (_req, res) => {
  res.status(200).send('pong');
});

export { symbols, stocksymbol, cryptosymbol };
export default router;
