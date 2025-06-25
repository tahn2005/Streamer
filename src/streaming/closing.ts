import { DateTime } from 'luxon';
import * as stock from '../stock';
import * as crypto from '../crypto';

const symbols = [
  "SPY:stock", "QQQ:stock", "IWM:stock", "AAPL:stock", "MSFT:stock",
  "BTC/USD:crypto", "ETH/USD:crypto", "NVDA:stock", "META:stock", "AMZN:stock",
  "TSLA:stock", "GOOGL:stock", "DIA:stock", "VTI:stock", "GLD:stock",
  "SOL/USD:crypto", "DOGE/USD:crypto"
];

// Determine if market has closed (4PM ET)
export function isAfterMarketClose(): boolean {
  const now = DateTime.now().setZone('America/New_York');
  const marketClose = now.set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
  return now >= marketClose;
}

// Generate ISO strings for 4PM ET stock close
export function stockTargetDate(): [string, string] {
  const now = DateTime.now().setZone('America/New_York');
  const target = isAfterMarketClose()
    ? now.set({ hour: 15, minute: 59, second: 0, millisecond: 0 })
    : now.minus({ days: 1 }).set({ hour: 15, minute: 59, second: 0, millisecond: 0 });

  return [target.toUTC().toISO(), target.plus({ minutes: 1 }).toUTC().toISO()];
}

// Determine if past 00:00 UTC (new crypto day)
export function isAfterCryptoClose(): boolean {
  const nowUTC = DateTime.utc();
  return nowUTC >= nowUTC.startOf('day');
}

// Generate ISO strings for 00:00 UTC crypto close
export function cryptoTargetDate(): [string, string] {
  const target = isAfterCryptoClose()
    ? DateTime.utc().startOf('day')
    : DateTime.utc().minus({ days: 1 }).startOf('day');
  return [target.toISO(), target.plus({ minutes: 1 }).toISO()];
}

// Split symbols by type
export function splitSymbolsByType() {
  const cryptosymbol: string[] = [];
  const stocksymbol: string[] = [];
  for (const item of symbols) {
    const [symbol, type] = item.split(':');
    if (type === 'crypto') cryptosymbol.push(symbol);
    else if (type === 'stock') stocksymbol.push(symbol);
  }
  return { cryptosymbol, stocksymbol };
}

const { cryptosymbol, stocksymbol } = splitSymbolsByType();

//gets closing prices for a list of stocks
export async function closingstocks() {
  const [stockStart, stockEnd] = stockTargetDate();
  const stockclose = await Promise.all(
    stocksymbol.map(symbol =>
      stock.getclose([symbol], [stockStart, stockEnd]).then(res => res[0])
    )
  );
  return stockclose;
}

//gets closing prices for a list of crypto
export async function closingcrypto() {
  const [cryptoStart, cryptoEnd] = cryptoTargetDate();
  const cryptoclose = await Promise.all(
    cryptosymbol.map(symbol =>
      crypto.getclose([symbol], [cryptoStart, cryptoEnd]).then(res => res[0])
    )
  );
  return cryptoclose
}

export {symbols, stocksymbol, cryptosymbol};


