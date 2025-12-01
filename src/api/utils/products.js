import { Random } from 'random-js';
const random = new Random();

const TOTAL_PRODUCTS = 1500;
const productPool = new Set();

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateProductName = () => {
  const length = random.integer(8, 10);
  let name = '';

  for (let letterIndex = 0; letterIndex < length; letterIndex++) {
    const randomLetter = random.pick(LETTERS);
    name += randomLetter;
  }

  return name;
};

while (productPool.size < TOTAL_PRODUCTS) {
  productPool.add(generateProductName());
}

export const products = Array.from(productPool);