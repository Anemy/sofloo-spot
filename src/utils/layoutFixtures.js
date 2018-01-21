import {
  createRandomSeed
} from './index';

import {
  generateInitialShape
} from './shapeFixtures';

export const generateInitialLayout = (width, height) => {
  if (!width || !height) {
    console.log('NEED WIDTH N HEIGHT');
    return;
  }

  const initialShape = generateInitialShape(width, height);

  return {
    height,
    layoutSeed: createRandomSeed(),
    shapes: [initialShape],
    width
  }
};
