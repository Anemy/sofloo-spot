import {
  createColorString,
  createRandomColors,
  createRandomColor,
  getRandomGradientPackColors,
  whiteToBlack
} from './color';

import {
  buildSteps,
  buildTopologySteps
} from './steps';

function generateRandomGradientDirection(seeder) {
  const floorRandom = rnd => Math.floor(seeder.rnd() * (rnd ? rnd : 1));

  const x1 = 100 * floorRandom(2);
  const y1 = 100 * floorRandom(2);
  let y2 = 100 * floorRandom(2);
  const x2 = 100 * floorRandom(2);

  // When a gradient wasn't really made we just make it vertical.
  if (x1 === x2 && y1 === y2) {
    y2 = 100 - y1;
  }

  return {
    x1,
    y1,
    x2,
    y2
  };
}

function generateRandomShadowConfig(seeder, shapeOptions) {
  const options = { ...shapeOptions };

  if (options.disableShadow) {
    return {
      hasShadow: false
    };
  }

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range); 

  const blackBasedShadow = options.blackAndWhite || floorRandom(2) === 1;
  const shadowColor = blackBasedShadow ? `rgba(${0}, ${0}, ${0}, ${1})` : createColorString(createRandomColor(seeder));
  const shadowOpacity = seeder.rnd() * 4 === 0 ? 0 : seeder.rnd().toFixed(4);

  return {
    hasShadow: shadowOpacity > 0,
    randomShadow: false,
    shadowBlur: floorRandom(10),
    shadowColor,
    shadowInset: true,
    shadowOffsetX: floorRandomNegate(40),
    shadowOffsetY: floorRandomNegate(40),
    shadowOpacity,
  };
};

const generateRandomShapeConfig = (width, height, seeder, shapeOptions) => {
  const options = {
    ...shapeOptions
  };

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range); 

  const maxPoints = 500;
  const points = 3 + floorRandom(floorRandom(3) === 1 ? maxPoints : 9); // 1 / 5 chance for possibly many points.
  const amountOfSteps = 2 + (100 - Math.floor(Math.pow(100, seeder.rnd())));

  const maxColorRandom = {
    r: floorRandom(12) === 1 ? 0 : 255,
    g: floorRandom(12) === 1 ? 0 : 255,
    b: floorRandom(12) === 1 ? 0 : 255,
    a: 1
  };

  const randomColorOptions = {
    maxColorRandom,
    blackAndWhite: options.blackAndWhite || floorRandom(20) === 1
  };

  // 1/10 random color for each step, otherwise gradient a few colors.
  const amountOfColors = floorRandom(10) === 1 ? amountOfSteps : 2 + floorRandom(3);

  const stepCenterMaxDeviationX = floorRandom(4) === 1 ? 0 : 30;
  const stepCenterMaxDeviationY = floorRandom(4) === 1 ? 0 : 30;

  // 1 / 2 chance for no deviation.
  const maxPointDeviation = floorRandom(3) === 1 ? 0 : Math.max(60 - (points / 20), 0);

  const innerRadius = floorRandom(window.innerHeight / 8);

  const colors = options.gradientPack ? getRandomGradientPackColors(seeder) : createRandomColors(amountOfColors, randomColorOptions, seeder);

  return {
    ...generateRandomShadowConfig(seeder, options),
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors,
    gradientColor: options.gradientColor,
    gradientDirection: generateRandomGradientDirection(seeder),
    innerRadius,
    isCurve: false,
    pointDeviationChance: 1, // 1 out of this.
    pointDeviationMaxX: floorRandom(maxPointDeviation),
    pointDeviationMaxY: floorRandom(maxPointDeviation),
    points,
    previousPointDeviationInfluence: floorRandom(3) === 1, // 1 out of 3
    rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: floorRandom(3) === 0 ? 0 : floorRandom(Math.PI * 2),
    sharedPointDeviation: floorRandom(2) === 1,
    stepCenterDeviationX: floorRandomNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: floorRandomNegate(stepCenterMaxDeviationY),
    stepCenterDeviationDropOff: 1, // (seeder.rnd() * 2) - 1,
    stepLength: 1 + floorRandom(((Math.min(height, width) - innerRadius) / 3) / amountOfSteps),
    stepLengthDropOff: floorRandom(12) === 0 ? 1 : ((seeder.rnd() * 4) - 2),
    strokePath: floorRandom(8) === 1 // 1/8 chance for a stroke instead of a fill.
  };
};

export function generateRandomShape(width, height, seeder, options) {
  const shape = generateRandomShapeConfig(width, height, seeder, options);

  shape.steps = buildSteps(shape, seeder);

  return shape;
};

// This is seperate from the regular shape config because it doesn't have
// inset shadows and therefore can use bezier curves in rendering.
function generateRandomTopologyShapeConfig(width, height, seeder, shapeOptions) {
  const options = {
    ...shapeOptions,
    disableShadow: true
  };

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range); 

  const maxPoints = 30;
  const points = 3 + floorRandom(floorRandom(3) === 1 ? maxPoints : 9); // 1 / 5 chance for possibly many points.
  const amountOfSteps = 2 + (20 - Math.floor(Math.pow(20, seeder.rnd())));

  const maxColorRandom = {
    r: floorRandom(12) === 1 ? 0 : 255,
    g: floorRandom(12) === 1 ? 0 : 255,
    b: floorRandom(12) === 1 ? 0 : 255,
    a: 1
  };

  const randomColorOptions = {
    maxColorRandom,
    blackAndWhite: options.blackAndWhite || floorRandom(20) === 1
  };

  // 1/10 random color for each step, otherwise gradient a few colors.
  const amountOfColors = floorRandom(10) === 1 ? amountOfSteps : 2 + floorRandom(3);

  const stepCenterMaxDeviationX = floorRandom(4) === 1 ? 0 : 30;
  const stepCenterMaxDeviationY = floorRandom(4) === 1 ? 0 : 30;

  const minSize = Math.min(width, height);

  // 1 / 2 chance for no deviation between points.
  const deviationPossible = minSize / 4;
  const maxPointDeviation = floorRandom(5) === 1 ? 0 : Math.max(deviationPossible - (points / (deviationPossible / 3)), 0);

  const innerRadius = floorRandom(minSize / 8);
  const stepLength = 3 + floorRandom(((minSize - innerRadius) / 3) / amountOfSteps);

  const colors = options.gradientPack ? getRandomGradientPackColors(seeder) : createRandomColors(amountOfColors, randomColorOptions, seeder);

  return {
    ...generateRandomShadowConfig(seeder, options),
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors,
    gradientColor: options.gradientColor,
    gradientDirection: generateRandomGradientDirection(seeder),
    innerRadius,
    isCurve: true,
    pointDeviationChance: floorRandom(points), // 1 out of this.
    pointDeviationMaxX: floorRandom(maxPointDeviation),
    pointDeviationMaxY: floorRandom(maxPointDeviation),
    points,
    previousPointDeviationInfluence: floorRandom(3) === 1,
    rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: floorRandom(Math.PI * 2),
    sharedPointDeviation: floorRandom(5) < 3,
    stepCenterDeviationDropOff: floorRandom(5) === 1 ? (seeder.rnd() * 2) - 1 : 1,
    stepCenterDeviationX: floorRandomNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: floorRandomNegate(stepCenterMaxDeviationY),
    stepLength,
    stepLengthDropOff: floorRandom(12) === 0 ? 1 : ((seeder.rnd() * 4) - 2),
    strokePath: floorRandom(8) === 1 // 1/8 chance for a stroke instead of a fill.
  };
}

export function generateRandomTopologyShape(width, height, seeder, options) {
  const shape = generateRandomTopologyShapeConfig(width, height, seeder, options);

  shape.steps = buildTopologySteps(shape, seeder);

  return shape;
}

// const logo = {
//   innerRadius: -3,
//   colors: logoColors, // From ./color
//   pointDeviationMaxX: 0,
//   pointDeviationMaxY: 0,
//   points: 500,
//   rotateEachStep: 0,
//   shapeRotation: Math.PI / 4,
//   shadowOffsetX: 0,
//   shadowOffsetY: 0,
//   stepCenterDeviationX: 0,
//   stepCenterDeviationY: 0,
//   stepLength: 20,
//   steps: 10,
//   strokePath: false
// };

const startColors = whiteToBlack;

export const generateInitialShape = (width, height, seeder) => {
  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range); 

  const minSize = Math.min(width, height);

  const amountOfSteps = 5 + floorRandom(7);

  const initialShapeConfig = {
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors: startColors,
    hasShadow: true,
    innerRadius: 0,
    isCurve: false,
    pointDeviationChance: floorRandom(2), // 1 out of this.
    pointDeviationMaxX: floorRandom(minSize / 10),
    pointDeviationMaxY: floorRandom(minSize / 10),
    points: floorRandom(3) === 0 ? 3 : 3 + floorRandom(6),
    previousPointDeviationInfluence: false,
    radialBackground: false,
    radialBackgroundColor: `#333`,
    randomShadow: false,
    rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: Math.PI / 8,
    shadowBlur: 4 + floorRandom(8),
    shadowColor: `rgba(${0}, ${0}, ${0}, ${1 - (0.1 * floorRandom(8))})`,
    shadowId: 'svg-shadow',
    shadowInset: true,
    shadowOffsetX: 0,
    shadowOffsetY: 2 + floorRandom(minSize / 10),
    shadowOpacity: 1,
    stepLength: 5 + ((minSize / amountOfSteps) / 3),
    stepLengthDropOff: (seeder.rnd() * 2) - 1,
    stepCenterDeviationDropOff: 1,
    stepCenterDeviationX: floorRandomNegate(minSize / 10),
    stepCenterDeviationY: floorRandomNegate(minSize / 10),
    strokePath: false
  };

  return {
    ...initialShapeConfig,
    steps: buildSteps(initialShapeConfig, seeder)
  };
};
