import { DateTime } from 'luxon';
import * as stock from '../stock';
import * as crypto from '../crypto';
import {stocksymbol, cryptosymbol} from '../routes';

// Determine if market has closed (4PM ET)
export function isAfterMarketClose(): boolean {
  const now = DateTime.now().setZone('America/New_York');
  const marketClose = now.set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
  return now >= marketClose;
}

// Generate ISO strings for 4PM ET stock close
export function stockTargetDate(): [string, string] {
  const now = DateTime.now().setZone('America/New_York');
  const day = now.weekday; // 1 = Monday, 7 = Sunday
  const hour = now.hour;
  const minute = now.minute;

  // Weekend or before market close on Monday (Fri 4PM to Mon 4PM)
  const isExtendedWeekend =
    (day === 5 && hour >= 16) || // Friday after 4PM
    day === 6 || // Saturday
    day === 7 || // Sunday
    (day === 1 && (hour < 16 || (hour === 16 && minute === 0))); // Monday before 4PM

  let target: DateTime;

  if (isExtendedWeekend) {
    // Backtrack to last Friday at 3:59 PM ET
    const daysToFriday = (day >= 5 ? day - 5 : 2 + day);
    target = now.minus({ days: daysToFriday }).set({ hour: 15, minute: 59, second: 0, millisecond: 0 });
  } else if (isAfterMarketClose()) {
    // Use today at 3:59 PM ET
    target = now.set({ hour: 15, minute: 59, second: 0, millisecond: 0 });
  } else {
    // Use yesterday at 3:59 PM ET
    target = now.minus({ days: 1 }).set({ hour: 15, minute: 59, second: 0, millisecond: 0 });
  }

  return [target.toUTC().toISO(), target.plus({ minutes: 15 }).toUTC().toISO()];
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

//gets closing prices for a list of stocks
export async function closingstocks() {
  const [stockStart, stockEnd] = stockTargetDate();
  return Promise.all(
    stocksymbol.map(symbol =>
      stock.getclose([symbol], [stockStart, stockEnd]).then(res => res[0])
    )
  );
}

//gets closing prices for a list of crypto
export async function closingcrypto() {
  const [cryptoStart, cryptoEnd] = cryptoTargetDate();
  return Promise.all(
    cryptosymbol.map(symbol =>
      crypto.getclose([symbol], [cryptoStart, cryptoEnd]).then(res => res[0])
    )
  );
}


