import {
  buildSteps
} from './steps';

// const galaxyColorPallete = [{
//   r: 255,
//   g: 255,
//   b: 255,
//   a: 1
// }, {
//   r: 153,
//   g: 153,
//   b: 153,
//   a: 1
// }, {
//   r: 51,
//   g: 51,
//   b: 51,
//   a: 1
// }, {
//   r: 243,
//   g: 156,
//   b: 18,
//   a: 1
// }, {
//   r: 123,
//   g: 76,
//   b: 10,
//   a: 1
// }];

// const galaxyColors = amt => {
//   const colors = [];

//   for(let i = 0; i < amt; i++) {
//     const color = Math.min(floorRandom(galaxyColorPallete.length), galaxyColorPallete.length - 1);
//     console.log('color', color);
//     colors[i] = galaxyColorPallete[color];
//   }

//   console.log('colors', colors);

//   return colors;
// };

// const logoColors = [{
//   r: 245,
//   g: 245,
//   b: 255
// }, {
//   r: 2,
//   g: 167,
//   b: 254
// }];

// const logo = {
//   innerRadius: -3,
//   colors: logoColors,
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

export const blackToWhite = [{
  r: 255,
  g: 255,
  b: 255,
  a: 1
}, {
  r: 0,
  g: 0,
  b: 0,
  a: 1
}];

export const whiteToBlack = [{
  r: 0,
  g: 0,
  b: 0,
  a: 1
}, {
  r: 255,
  g: 255,
  b: 255,
  a: 1
}];

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
}