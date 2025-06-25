import { symbols, stocksymbol, cryptosymbol } from '../routes';
import * as stock from '../stock';
import * as crypto from '../crypto';

let pricesCache: number[] = [];

//Gathers latest stock and crypto trade prices
export async function initprices() {
  const [stockprices, cryptoprices] = await Promise.all([
    stock.lasttrade(stocksymbol),
    crypto.lasttrade(cryptosymbol)
  ]);
  let stockIndex = 0;
  let cryptoIndex = 0;
  pricesCache = symbols.map(entry => {
    return entry.type === 'stock' ? stockprices[stockIndex++] : cryptoprices[cryptoIndex++];
  });
}

export function updateprices(symbol: string, price: number) {
  const index = symbols.findIndex(entry => entry.symbol === symbol);
  if (index !== -1) {
    pricesCache[index] = price;
  } else {
    console.warn(`Symbol "${symbol}" not found in symbols array`);
  }
}

export {pricesCache};






  
