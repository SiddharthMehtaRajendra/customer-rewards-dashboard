import { Random } from 'random-js';
const random = new Random();

export const CUSTOMERS = 15;
export const TXNS_PER_CUSTOMER = 1000;

export const firstNames = ['John','Jane','Alex','Emma','Mike','Sophia','Will','Olivia','James','Isabella'];
export const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson'];

export const randomDate = () => {
  const y = random.integer(2020, 2025);
  const m = random.integer(10, 12);
  const d = random.integer(1, 28);
  return `${String(d).padStart(2,'0')}-${String(m).padStart(2,'0')}-${y}`;
};

export const randomPrice = () => {
  const p = random.real(10, 200, true);
  return random.bool(0.1) ? + p.toFixed(2) : Math.floor(p * 100) / 100;
};

export const randomTxnId = () => {
  return 'TXN' + random.uuid4().replace(/-/g,'').slice(0,12).toUpperCase();
};