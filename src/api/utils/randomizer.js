import { Random } from 'random-js';
const random = new Random();

export const CUSTOMERS = 15;
export const TXNS_PER_CUSTOMER = 1000;

export const firstNames = ['John','Jane','Alex','Emma','Mike','Sophia','Will','Olivia','James','Isabella'];
export const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson'];

export const randomDate = () => {
  const year = random.integer(2020, 2025);
  const month = random.integer(10, 12);
  const day = random.integer(1, 28);
  return `${String(day).padStart(2,'0')}-${String(month).padStart(2,'0')}-${year}`;
};

export const randomPrice = () => {
  const price = random.real(10, 200, true);
  return random.bool(0.1) ? + price.toFixed(2) : Math.floor(price * 100) / 100;
};

export const randomTxnId = () => {
  return 'TXN' + random.uuid4().replace(/-/g,'').slice(0,12).toUpperCase();
};