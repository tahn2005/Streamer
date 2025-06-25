import axios from 'axios';

//takes a list of crypto symbols as an argument, returns last trade prices in order of origonal list
export async function lasttrade(symbols: string[]): Promise<(number | null)[]> {
  const format = symbols.map(s => encodeURIComponent(s)).join(',');
  const options = {
    method: 'GET'as const,
    url: 'https://data.alpaca.markets/v1beta3/crypto/us/latest/trades?symbols=' + format,
    headers: { accept: 'application/json' }
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

//gets closing price of crypto
export async function getclose(
  symbols: string[],
  times: string[],
): Promise<(number | null)[]> {
  const baseURL = 'https://data.alpaca.markets/v1beta3/crypto/us/bars';
  const encodedSymbols = symbols.map(s => encodeURIComponent(s)).join(',');
  const [start, end] = times;

  const options = {
    method: 'GET' as const,
    url: `${baseURL}?symbols=${encodedSymbols}` +
      `&timeframe=1T` +
      `&start=${start}` +
      `&end=${end}` +
      `&limit=1` +
      `&sort=asc`,
    headers: {
      accept: 'application/json'
    }
  };

  try {
    const res = await axios.request(options);
    const bars = res.data.bars;

    const close = symbols.map(symbol => {
      const bar = bars?.[symbol]?.[0];
      return bar?.c ?? null;
    });

    return close;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
