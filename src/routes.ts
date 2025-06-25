import express, { Request, Response } from 'express';
import { getinitprices } from './streaming/current';
import  { getClosesFromCache } from './streaming/closingcache';

const router = express.Router();

// Endpoint: fetches prices and stored closing prices
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

router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});


export default router;