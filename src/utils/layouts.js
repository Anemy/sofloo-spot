import MersenneTwister from 'mersennetwister';

import {
  createRandomSeed
} from './seeds';

import {
  generateInitialShape,
  generateRandomShape,
  generateRandomTopologyShape
} from './shapes';

import { VERSIONS } from '../constants';

import {
  getSharingSeedFromURL,
  getSharingVersionFromURL
} from './url';

export const generateRandomLayout = (width, height, version) => {
  const seed = createRandomSeed();

  return generateLayoutBySeedAndVersion(width, height, seed, version);
};

export const generateLayoutBySeedAndVersion = (width, height, seed, version) => {
  const layout = {
    height,
    seed,
    version,
    width
  };

  const seeder = new MersenneTwister(seed);

  switch(version) {
    case VERSIONS.BASIC_FIRST_GEN:
      layout.shapes = [generateRandomShape(width, height, seeder)];
      break;

    case VERSIONS.BASIC_FIRST_GEN_BW:
      layout.shapes = [generateRandomShape(width, height, seeder, { blackAndWhite: true })];
      break;

    case VERSIONS.INIT_FIRST_GEN:
      layout.shapes = [generateInitialShape(width, height, seeder)];
      break;

    case VERSIONS.TOPOLOGY:
      layout.shapes = [generateRandomTopologyShape(width, height, seeder)];
      break;

    default:
      layout.shapes = [generateRandomShape(width, height, seeder)];
      break;
  }

  return layout;
};

export const generateInitialLayout = (width, height) => {
  const sharedUrlSeed = getSharingSeedFromURL();
  const sharedUrlVersion = getSharingVersionFromURL();

  const seed = sharedUrlSeed ? sharedUrlSeed : createRandomSeed();
  const version = sharedUrlVersion ? sharedUrlVersion : VERSIONS.INIT_FIRST_GEN;
  
  return generateLayoutBySeedAndVersion(width, height, seed, version);
};
