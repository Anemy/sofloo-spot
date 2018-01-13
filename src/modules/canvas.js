import {
  createColorString,
  createRandomColors,
  createRandomSeed,
  floorRandom,
  createRandomColor
} from '../utils';

export const RANDOMIZE = 'svg/RANDOMIZE';
export const SET_SVG_REF = 'svg/SET_SVG_REF';
export const HISTORY_BACK = 'svg/HISTORY_BACK';
export const HISTORY_FORWARD = 'svg/HISTORY_FORWARD';

// colors https://github.com/arcticicestudio/nord

const randomFloor = range => Math.floor(Math.random() * range);
const randomFloorNegate = range => Math.floor(Math.random() * range) - Math.floor(Math.random() * range); 

// const blackToWhite = [{
//   r: 255,
//   g: 255,
//   b: 255,
//   a: 1
// }, {
//   r: 0,
//   g: 0,
//   b: 0,
//   a: 1
// }];

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
//     const color = Math.min(randomFloor(galaxyColorPallete.length), galaxyColorPallete.length - 1);
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

const maxHistoryLength = 100;

const startColors = whiteToBlack;

const heightOfHeader = 80;

const minHeight = 200;
const minWidth = 200;

const height = Math.max(Math.floor(window.innerHeight - heightOfHeader), minHeight);
const width = Math.max(Math.floor(window.innerWidth), minWidth);

const initialState = {
  height,
  history: [],
  future: [],
  present: {
    applyShadowOnTopStep: true,
    centerX: width / 2,
    centerY: height / 2,
    colors: startColors,
    innerRadius: 0,
    pointDeviationMaxX: randomFloor(50),
    pointDeviationMaxY: randomFloor(50),
    points: 3 + randomFloor(6),
    previousPointDeviationInfluence: false,
    randomSeed: createRandomSeed(),
    rotateEachStep: randomFloorNegate(Math.PI),
    rotation: Math.PI / 8,
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
    strokePath: false
  },
  width
  // ...logo
};

const getRandomState = () => {
  const maxPoints = 1000;
  const points = 3 + randomFloor(randomFloor(3) === 1 ? maxPoints : 7); // 1 / 5 chance for possibly many points.
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
  const amountOfColors = randomFloor(10) === 1 ? steps : 1 + randomFloor(4);
  
  const stepCenterMaxDeviationX = 30;
  const stepCenterMaxDeviationY = 30;

  // 1 / 2 chance for no deviation.
  const maxPointDeviation = randomFloor(2) === 1 ? 0 : 50 - (maxPoints / 25);

  const blackBasedShadow = randomFloor(2) === 1;
  const shadowColor = blackBasedShadow ? `rgba(${0}, ${0}, ${0}, ${1})` : createColorString(createRandomColor());

  // console.log('colors', createRandomColors(1 + randomFloor(steps), maxColorRandom));
  // Open street map for data.

  return {
    applyShadowOnTopStep: floorRandom(2) === 0,
    colors: createRandomColors(amountOfColors, randomColorOptions),
    innerRadius: randomFloor(window.innerHeight / 8),
    pointDeviationMaxX: randomFloor(maxPointDeviation),
    pointDeviationMaxY: randomFloor(maxPointDeviation),
    points,
    previousPointDeviationInfluence: randomFloor(3) === 1, // 1 out of 3
    randomSeed: createRandomSeed(),
    rotateEachStep: randomFloorNegate(Math.PI),
    rotation: randomFloor(Math.PI * 2),
    shadowBlur: randomFloor(5),
    shadowColor,
    shadowId: 'svg-shadow',
    shadowInset: true,
    shadowOffsetX: randomFloorNegate(10),
    shadowOffsetY: randomFloorNegate(20),
    shadowOpacity: Math.random().toFixed(4),
    stepCenterDeviationX: randomFloorNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: randomFloorNegate(stepCenterMaxDeviationY),
    stepLength: 2 + randomFloor(10),
    steps,
    stepVariance: 10,
    strokePath: randomFloor(10) === 1 // 1/20 chance for a stroke instead of a fill.
  };
};

export const randomizeVizual = () => ({
  type: RANDOMIZE
});

/* Things to add:
- past future
- controls

Future:
- Interior things
- Combinations
- Custom import shape
- Multiple scattered
- Locked layers dont change

Array elements:
- Shadows - Color & direction ?
- Color steps - done
- Step points
*/

export default (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_BACK:
      if (state.history && state.history.length > 0) {
        const newState = {
          ...state
        };

        newState.future.unshift({
          ...state.present
        });

        newState.present = {
          ...state.present,
          ...newState.history.shift()
        };

        if (newState.future.length > maxHistoryLength) {
          newState.future.pop();
        }

        return newState;
      } else {
        return state;
      }

    case HISTORY_FORWARD:
      if (state.future && state.future.length > 0) {
        const newState = {
          ...state
        };

        newState.history.unshift({
          ...state.present
        });

        newState.present = {
          ...state.present,
          ...newState.future.shift()
        };

        if (newState.history.length > maxHistoryLength) {
          newState.history.pop();
        }

        return newState;
      } else {
        return state;
      }

    case RANDOMIZE:
      const newState = {
        ...state
      };

      newState.history.unshift({
        ...state.present
      });

      newState.present = {
        ...state.present,
        ...getRandomState()
      };

      if (newState.history.length > maxHistoryLength) {
        newState.history.pop();
      }

      return newState;

    case SET_SVG_REF:
      return {
        ...state,
        svgRef: action.svgRef
      }

    default:
      return state;
  }
};

export const setSvgRef = svgRef => ({
  svgRef,
  type: SET_SVG_REF
});

export const historyBack = () => ({
  type: HISTORY_BACK
});

export const historyForward = () => ({
  type: HISTORY_FORWARD
});
