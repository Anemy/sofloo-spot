import { createRandomSeed } from '../utils';

// export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED';
// export const INCREMENT = 'counter/INCREMENT';
// export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED';
// export const DECREMENT = 'counter/DECREMENT';

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
  innerRadius: randomFloor(window.innerHeight / 8),
  points: randomFloor(30) + 3,
  randomSeed: createRandomSeed(),
  rotation: 0,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${0.5})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 0,
  shadowOffsetY: 10,
  shadowOpacity: 1,
  steps: 30,
  stepVariance: 10,
  width: window.innerWidth
}

const initialStates = {
  centerX: 550,
  centerY: 680,
  colors,
  height: 800,
  innerRadius: randomFloor(100),
  points: 3,
  randomSeed: createRandomSeed(),
  rotation: 0,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${0.4})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 0,
  shadowOffsetY: 10,
  shadowOpacity: 1,
  steps: 30,
  stepVariance: 10,
  width: 800
};

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
    // case INCREMENT:
    //   return {
    //     ...state,
    //     count: state.count + 1,
    //     isIncrementing: !state.isIncrementing
    //   }

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
