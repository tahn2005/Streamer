import {closingcrypto, closingstocks} from './closing';
import { symbols } from '../routes';
import cron from 'node-cron';

//caches storing closing prices
let stockcache: number[] = [];
let cryptocache: number[] = [];
let closesCache: number[] = [];

//merges the seperate caches into order or original array
function rebuildMergedCache() {
  let stockIndex = 0;
  let cryptoIndex = 0;
  closesCache = symbols.map(entry => {
    return entry.type === 'stock' ? stockcache[stockIndex++] : cryptocache[cryptoIndex++];
  });
}

//initializes a cache of closing prices at server start
export async function initializeClosesCache() {
  stockcache = await closingstocks();
  cryptocache = await closingcrypto();
  rebuildMergedCache();
}

//returns initialized cache
export function getClosesFromCache(): number[] {
  return closesCache;
}

//updates stock cache with new closing prices at daily market close
export async function updateStockCache() {
  stockcache = await closingstocks();
  rebuildMergedCache();
}

//udates crypto cache with new closing prices at dailu 00:00 UTC
export async function updateCryptoCache() {
  cryptocache = await closingcrypto();
  rebuildMergedCache();
}

// Schedule daily updates
cron.schedule('15 16 * * *', updateStockCache, { timezone: 'America/New_York' });
cron.schedule('0 0 * * *', updateCryptoCache, { timezone: 'UTC' });