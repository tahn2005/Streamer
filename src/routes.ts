import express, { Request, Response } from 'express';
import { getinitprices, initprices} from './streaming/current';
import { getClosesFromCache, initializeClosesCache} from './streaming/closingcache';

const router = express.Router();

let symbols = [
  { symbol: "SPY", type: 'stock' },
  { symbol: "QQQ", type: 'stock' },
  { symbol: "IWM", type: 'stock' },
  { symbol: "AAPL", type: 'stock' },
  { symbol: "MSFT", type: 'stock' },
  { symbol: "BTC/USD", type: 'crypto' },
  { symbol: "ETH/USD", type: 'crypto' },
  { symbol: "NVDA", type: 'stock' },
  { symbol: "META", type: 'stock' },
  { symbol: "AMZN", type: 'stock' },
  { symbol: "TSLA", type: 'stock' },
  { symbol: "GOOGL", type: 'stock' },
  { symbol: "DIA", type: 'stock' },
  { symbol: "VTI", type: 'stock' },
  { symbol: "GLD", type: 'stock' },
  { symbol: "SOL/USD", type: 'crypto' },
  { symbol: "DOGE/USD", type: 'crypto' }
];

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
    const prices = getinitprices();     
    const closes = getClosesFromCache();             

    res.json({ prices, closes });
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
