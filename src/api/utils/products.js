import { Random } from 'random-js';
const random = new Random();

const TOTAL_PRODUCTS = 1500;
const productPool = new Set();

// All uppercase letters A–Z
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Creates a random product name like 'XJDKSLAQ'
 * Length = 8 to 10 letters
 */
export const generateProductName = () => {
  const length = random.integer(8, 10); // pick 8, 9 or 10
  let name = '';

  for (let i = 0; i < length; i++) {
    const randomLetter = random.pick(LETTERS); // pick one random letter
    name += randomLetter;
  }

  return name;
};

// Generate unique products
while (productPool.size < TOTAL_PRODUCTS) {
  productPool.add(generateProductName());
}

export const products = Array.from(productPool);