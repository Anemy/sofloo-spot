import MersenneTwister from 'mersennetwister';

import {
  createRandomSeed
} from './index';

import {
  generateInitialShape
} from './shapeFixtures';

import {
  generateRandomShape
} from './shapes';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const generateInitialLayout = (width, height) => {
  // Check for something on the url saying we should load from it.
  // TODO: Put this in a smarter place.
  const sharedShapeString = getParameterByName('shared');

  let layoutSeed = createRandomSeed();
  let hasSharedSeed = false;

  if (sharedShapeString && isNumeric(sharedShapeString)) {
    layoutSeed = Number(sharedShapeString);
    hasSharedSeed = true;
    if (getParameterByName('v1')) {
      hasSharedSeed = false;
    }
  }
  
  const seeder = new MersenneTwister(layoutSeed);

  const initialShape = hasSharedSeed ? generateRandomShape(width, height, seeder)
    : generateInitialShape(width, height, seeder);

  return {
    isFirstGen: !hasSharedSeed,
    height,
    layoutSeed,
    shapes: [initialShape],
    width
  }
};
