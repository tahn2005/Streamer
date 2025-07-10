import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


//takes a list of stock symbols as an argument, returns last trade prices in order of origonal list
export async function lasttrade(symbols: string[]): Promise<(number | null)[]> {
  const format = symbols.map(s => encodeURIComponent(s)).join(',');
  const options = {
    method: 'GET' as const,
    url: 'https://data.alpaca.markets/v2/stocks/trades/latest?symbols=' + format,
    params: {feed: 'iex'},
    headers: {
      accept: 'application/json',
      'APCA-API-KEY-ID': process.env.ALPACA_KEY_ID,
      'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY
    }
  };
  try {
    const res = await axios.request(options);
    const trades = res.data.trades;
    const prices = symbols.map(symbol => {
      const trade = trades?.[symbol];
      return trade?.p ?? null;
    });
    return prices;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//gets closing price of stock
export async function getclose(symbols: string[], times: string[]): Promise<(number | null)[]> {
  const baseURL = 'https://data.alpaca.markets/v2/stocks/bars?';
  const encodedSymbols = encodeURIComponent(symbols.join(','));
  const start = encodeURIComponent(times[0]);
  const end = encodeURIComponent(times[1]);

  const options = {
    method: 'GET' as const,
    url: `${baseURL}symbols=${encodedSymbols}` +
      `&timeframe=1T` +
      `&start=${start}` +
      `&end=${end}` +
      `&limit=1` +
      `&adjustment=raw` +
      `&feed=iex` +
      `&sort=asc`,
    headers: {
      accept: 'application/json',
      'APCA-API-KEY-ID': process.env.ALPACA_KEY_ID,
      'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY
    }
  };

  try {
    const res = await axios.request(options);
    const bars = res.data.bars;

    const close = symbols.map(symbol => {
      const bar = bars?.[symbol]?.[0];  // bars[symbol] is an array of bar objects
      return bar?.c ?? null;  // use .c for "close"
    });

    return close;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

