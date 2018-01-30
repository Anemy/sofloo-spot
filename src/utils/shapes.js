import {
  createColorString,
  createRandomColors,
  createRandomColor,
  whiteToBlack
} from './color';

import { buildSteps } from './steps';

export const generateRandomShapeConfig = (width, height, seeder) => {  
  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range); 

  const maxPoints = 1000;
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
    blackAndWhite: floorRandom(20) === 1
  };

  // 1/10 random colors, else nice gradient.
  const amountOfColors = floorRandom(10) === 1 ? amountOfSteps : 1 + floorRandom(5);

  const stepCenterMaxDeviationX = floorRandom(4) === 1 ? 0 : 30;
  const stepCenterMaxDeviationY = floorRandom(4) === 1 ? 0 : 30;

  // 1 / 2 chance for no deviation.
  const maxPointDeviation = floorRandom(3) === 1 ? 0 : Math.max(60 - (points / 30), 0);

  const blackBasedShadow = floorRandom(2) === 1;
  const shadowColor = blackBasedShadow ? `rgba(${0}, ${0}, ${0}, ${1})` : createColorString(createRandomColor(seeder));

  // console.log('colors', createRandomColors(1 + floorRandom(steps), maxColorRandom));
  // Open street map for data.

  const innerRadius = floorRandom(window.innerHeight / 8);

  return {
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors: createRandomColors(amountOfColors, randomColorOptions, seeder),
    innerRadius,
    pointDeviationMaxX: floorRandom(maxPointDeviation),
    pointDeviationMaxY: floorRandom(maxPointDeviation),
    points,
    previousPointDeviationInfluence: floorRandom(3) === 1, // 1 out of 3
    randomShadow: false, // true, // floorRandom(10) === 1,
    rotateEachStep: floorRandomNegate(Math.PI),
    rotation: floorRandom(Math.PI * 2),
    shadowBlur: floorRandom(10),
    shadowColor,
    shadowInset: true,
    shadowOffsetX: floorRandomNegate(40),
    shadowOffsetY: floorRandomNegate(40),
    shadowOpacity: seeder.rnd() * 10 === 0 ? 0 : seeder.rnd().toFixed(4),
    sharedPointDeviation: floorRandom(2) === 1,
    stepCenterDeviationX: floorRandomNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: floorRandomNegate(stepCenterMaxDeviationY),
    stepCenterDeviationDropOff: 1, // (seeder.rnd() * 2) - 1,
    stepLength: 1 + floorRandom(((Math.min(height, width) - innerRadius) / 3) / amountOfSteps),
    stepLengthDropOff: floorRandom(12) === 0 ? 1 : ((seeder.rnd() * 4) - 2),
    strokePath: floorRandom(8) === 1 // 1/8 chance for a stroke instead of a fill.
  };
};

export function generateRandomShape(width, height, seeder) {
  const shape = generateRandomShapeConfig(width, height, seeder);

  shape.steps = buildSteps(shape, seeder);

  return shape;
};

// const logo = {
//   innerRadius: -3,
//   colors: logoColors, // From ./color
//   pointDeviationMaxX: 0,
//   pointDeviationMaxY: 0,
//   points: 500,
//   rotateEachStep: 0,
//   rotation: Math.PI / 4,
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

  const initialShapeConfig = {
    amountOfSteps: 8,
    centerX: width / 2,
    centerY: height / 2,
    colors: startColors,
    innerRadius: 0,
    pointDeviationMaxX: floorRandom(50),
    pointDeviationMaxY: floorRandom(50),
    points: 3 + floorRandom(6),
    previousPointDeviationInfluence: false,
    radialBackground: false,
    radialBackgroundColor: `#333`,
    randomShadow: false,
    rotateEachStep: floorRandomNegate(Math.PI),
    rotation: Math.PI / 8,
    shadowBlur: 5,
    shadowColor: `rgba(${0}, ${0}, ${0}, ${1})`,
    shadowId: 'svg-shadow',
    shadowInset: true,
    shadowOffsetX: 0,
    shadowOffsetY: 10,
    shadowOpacity: 1,
    stepLength: 30,
    stepLengthDropOff: (seeder.rnd() * 2) - 1,
    stepCenterDeviationDropOff: 1,// (seeder.rnd() * 2) - 1,
    stepCenterDeviationX: floorRandomNegate(30),
    stepCenterDeviationY: floorRandomNegate(30),
    strokePath: false
  };

  return {
    ...initialShapeConfig,
    steps: buildSteps(initialShapeConfig, seeder)
  };
};
