import MersenneTwister from 'mersennetwister';

import {
  createRandomSeed
} from './seeds';

import {
  generateInitialShape,
  generateRandomMug,
  generateRandomShape,
  generateRandomTopologyShape,
  generateRandomTriangles,
  generateRandomWaterColorShape
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

export const generateLayoutBySeedAndVersion = (width, height, seed, layoutVersion) => {
  let version = layoutVersion;
  if (version === VERSIONS.FULL_RANDOM) {
    const versionKeys = Object.keys(VERSIONS);
    while (version === VERSIONS.FULL_RANDOM || version === VERSIONS.INIT_FIRST_GEN || version === VERSIONS.TRIANGLES_MULTI || version === VERSIONS.BASIC_FIRST_GEN_GRADIENTS) {
      version = VERSIONS[versionKeys[Math.floor(Math.random() * versionKeys.length)]];
    }
  }

  const layout = {
    height,
    seed,
    version,
    width
  };

  const seeder = new MersenneTwister(seed);

  switch (version) {
    case VERSIONS.BASIC_FIRST_GEN:
      layout.shapes = [generateRandomShape(width, height, seeder)];
      break;

    case VERSIONS.BASIC_FIRST_GEN_BW:
      layout.shapes = [generateRandomShape(width, height, seeder, { blackAndWhite: true })];
      break;

    case VERSIONS.BASIC_FIRST_GEN_GRADIENT_PACK:
      layout.shapes = [generateRandomShape(width, height, seeder, { gradientPack: true })];
      break;

    case VERSIONS.MUG: {
      layout.shapes = generateRandomMug(width, height, seeder);
      break;
    }

    case VERSIONS.BASIC_FIRST_GEN_GRADIENTS: {
      const shapeOptions = {
        colorDropWithDepth: true,
        gradientPack: true,
        gradientColor: true
      };
      layout.shapes = [generateRandomShape(width, height, seeder, shapeOptions)];
      break;
    }

    case VERSIONS.INIT_FIRST_GEN:
      layout.shapes = [generateInitialShape(width, height, seeder)];
      break;

    case VERSIONS.TOPOLOGY:
      layout.shapes = [generateRandomTopologyShape(width, height, seeder)];
      break;

    case VERSIONS.TOPOLOGY_GRADIENTS: {
      const options = {
        colorDropWithDepth: true,
        gradientPack: true,
        gradientColor: true
      };
      layout.shapes = [generateRandomTopologyShape(width, height, seeder, options)];
      break;
    }

    case VERSIONS.TOPOLOGY_GRADIENT_PACK:
      layout.shapes = [generateRandomTopologyShape(width, height, seeder, { gradientPack: true })];
      break;

    case VERSIONS.TRIANGLES:
      layout.shapes = [generateRandomShape(width, height, seeder, { triangleMode: true })];
      break;

    case VERSIONS.TRIANGLES_MULTI:
      layout.shapes = generateRandomTriangles(width, height, seeder);
      break;

    case VERSIONS.WATER_COLOR:
      layout.shapes = [generateRandomWaterColorShape(width, height, seeder)];
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

  return {
    ...generateLayoutBySeedAndVersion(width, height, seed, version),
    backgroundColor: '#FFFFFF'
  };
};
