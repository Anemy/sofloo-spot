import { createRandomColors, createRandomSeed, floorRandom } from '../utils';

export const RANDOMIZE = 'svg/RANDOMIZE';

// colors https://github.com/arcticicestudio/nord

const randomFloor = range => Math.floor(Math.random() * range);
const randomFloorNegate = range => Math.floor(Math.random() * range) - Math.floor(Math.random() * range); 

const blackToWhite = [{
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

const whiteToBlack = [{
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

const galaxyColorPallete = [{
  r: 255,
  g: 255,
  b: 255,
  a: 1
}, {
  r: 153,
  g: 153,
  b: 153,
  a: 1
}, {
  r: 51,
  g: 51,
  b: 51,
  a: 1
}, {
  r: 243,
  g: 156,
  b: 18,
  a: 1
}, {
  r: 123,
  g: 76,
  b: 10,
  a: 1
}]

const galaxyColors = amt => {
  const colors = [];

  for(let i = 0; i < amt; i++) {
    const color = Math.min(randomFloor(galaxyColorPallete.length), galaxyColorPallete.length - 1);
    console.log('color', color);
    colors[i] = galaxyColorPallete[color];
  }

  console.log('colors', colors);

  return colors;
}


const startColors = whiteToBlack;

// const fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;

// Color Bound.
// const cb = color => Math.min(Math.max(Math.floor(color), 0), 255);

const initialState = {
  applyShadowOnTopStep: true,
  centerX: window.innerWidth / 2,
  centerY: window.innerHeight / 2,
  colors: startColors,
  height: window.innerHeight,
  innerRadius: 0,
  pointDeviationMaxX: randomFloor(60),
  pointDeviationMaxY: randomFloor(60),
  points: 3 + randomFloor(6),
  randomSeed: createRandomSeed(),
  rotateEachStep: randomFloorNegate(Math.PI),
  rotation: 30,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${1})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 0,
  shadowOffsetY: 10,
  shadowOpacity: 1,
  stepLength: 30,
  steps: 8,
  stepCenterDeviationX: randomFloorNegate(30),
  stepCenterDeviationY: randomFloorNegate(30),
  stepVariance: 10,
  width: window.innerWidth
};

const getRandomState = () => {
  const steps = 2 + randomFloor(40);

  const maxColorRandom = {
    r: 255,
    g: 255,
    b: 255,
    a: 1
  };

  const randomColorOptions = {
    maxColorRandom
  };

  // 1/10 random colors, else nice gradient.
  const amountOfColors = randomFloor(10) === 1 ? steps : 2 + randomFloor(3);
  
  const stepCenterMaxDeviationX = 30;
  const stepCenterMaxDeviationY = 30;

  // 1 / 2 chance for no deviation.
  const maxPointDeviation = randomFloor(2) === 1 ? 0 : 50;

  // console.log('colors', createRandomColors(1 + randomFloor(steps), maxColorRandom));

  return {
    applyShadowOnTopStep: floorRandom(2) === 0,
    colors: createRandomColors(amountOfColors, randomColorOptions),
    innerRadius: randomFloor(window.innerHeight / 8),
    pointDeviationMaxX: randomFloorNegate(maxPointDeviation),
    pointDeviationMaxY: randomFloorNegate(maxPointDeviation),
    points: 3 + randomFloor(randomFloor(5) === 1 ? 1000 : 7), // 1 / 5 chance for possibly many points.
    randomSeed: createRandomSeed(),
    rotateEachStep: randomFloorNegate(180),
    rotation: randomFloor(Math.PI * 2),
    shadowBlur: randomFloor(5),// 0.4,
    shadowColor: `rgba(${0}, ${0}, ${0}, ${Math.random()})`,
    shadowId: 'svg-shadow',
    shadowInset: true,
    shadowOffsetX: randomFloorNegate(10),
    shadowOffsetY: randomFloorNegate(20),
    shadowOpacity: 1,
    stepCenterDeviationX: randomFloorNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: randomFloorNegate(stepCenterMaxDeviationX),
    stepLength: 2 + randomFloor(10),
    steps,
    stepVariance: 10,
    strokePath: randomFloor(20) === 1 // 1/20 chance for a stroke instead of a fill.
  };
};

export const randomizeVizual = () => ({
  type: RANDOMIZE
});

/* Things to add:
- gradients on step

Future:
- Interior things
- Combinations
- Custom import shape
- Multiple scattered

Array elements:
- Shadows - Color & direction ?
- Color steps - done
- Step points
*/

export default (state = initialState, action) => {
  switch (action.type) {
    case RANDOMIZE:
      return {
        ...state,
        ...getRandomState()
        // TODO: Allow locked layers to not change.
      }

    default:
      return state;
  }
};
