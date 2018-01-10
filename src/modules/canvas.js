import { createRandomSeed } from '../utils';

// export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED';
// export const INCREMENT = 'counter/INCREMENT';
// export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED';
// export const DECREMENT = 'counter/DECREMENT';

export const RANDOMIZE = 'svg/RANDOMIZE';

// colors https://github.com/arcticicestudio/nord

// export class Color {
//   constructor(r, g, b, a) {
//     this.r = r;
//     this.g = g;
//     this.b = b;
//     this.a = a === undefined ? 1 : a;
//   }

//   getRGBAColorString() {
//     return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
//   }
// };

const colors = [{
  r: 255,
  b: 255,
  g: 255
}, {
  r: 0,
  b: 0,
  g: 0
}];

// const fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;

// Color Bound.
// const cb = color => Math.min(Math.max(Math.floor(color), 0), 255);

// 1 halfway through steps.
// const halfVarience = 1 - (Math.abs(((step - (steps / 2)) / steps)) * 2);



const randomFloor = range => Math.floor(Math.random() * range); 

const initialState = {
  centerX: window.innerWidth / 2,
  centerY: window.innerHeight / 2,
  colors,
  height: window.innerHeight,
  innerRadius: 0,
  pointDeviationMaxX: randomFloor(40),
  pointDeviationMaxY: randomFloor(40),
  points: 4,
  randomSeed: createRandomSeed(),
  rotateEachStep: 0,
  rotation: 0,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${0.5})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowOpacity: 1,
  stepLength: 20,
  steps: 5,
  stepVariance: 10,
  width: window.innerWidth
};

const getRandomState = () => ({
  colors,
  innerRadius: randomFloor(window.innerHeight / 8),
  pointDeviationMaxX: randomFloor(40),
  pointDeviationMaxY: randomFloor(40),
  points: 3 + (randomFloor(10) > 3 ? randomFloor(10) : randomFloor(500)), // randomFloor(30) + 3,
  randomSeed: createRandomSeed(),
  rotateEachStep: randomFloor(40),// + randomFloor(-40),
  rotation: 0,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${0.5})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 0,
  shadowOffsetY: 10,
  shadowOpacity: 1,
  stepLength: 2 + randomFloor(5),
  steps: 30,
  stepVariance: 10
});

export const randomizeVizual = () => ({
  type: RANDOMIZE
});

/* Things to add:
- Steps
- step width
- 4 sides? - HOW MANY SIDES!?
- Shadows
- Random
- Color gradient - 2 color - many color

Future:
- Interior things
- Combinations
- Custom import shape
- Multiple scattered

Array elements:
- Shadows - Color & direction
- Color steps
*/

export default (state = initialState, action) => {
  switch (action.type) {
    case RANDOMIZE:
      return {
        ...state,
        ...getRandomState()
      }

    default:
      return state;
  }
}

// export const increment = () => {
//   return dispatch => {
//     dispatch({
//       type: INCREMENT_REQUESTED
//     })

//     dispatch({
//       type: INCREMENT
//     })
//   }
// };
