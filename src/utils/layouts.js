import {
  createRandomSeed
} from '../utils';

import { generateRandomShape } from './shapes';

export const generateRandomLayout = (width, height) => {
  const amountOfShapes = 1;

  const shapes = [];

  for (let i = 0; i < amountOfShapes; i++) {
    const shape = generateRandomShape(width, height);

    shapes.push(shape);
  }

  return {
    height,
    layoutSeed: createRandomSeed(),
    shapes,
    width
  }
};