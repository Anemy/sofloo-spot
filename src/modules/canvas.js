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

const randomFloor = range => Math.floor(Math.random() * range); 

const firstLoadGraphic = {
  centerX: window.innerWidth / 2,
  centerY: window.innerHeight / 2,
  height: window.innerHeight,
  innerRadius: randomFloor(window.innerHeight / 8),
  points: randomFloor(40) + 3,
  randomSeed: createRandomSeed(),
  rotation: 0,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${0.5})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: -4,
  shadowOffsetY: -10,
  shadowOpacity: 0.7,
  steps: 30,
  stepVariance: 10,
  width: window.innerWidth
}

const initialState = {
  centerX: 550,
  centerY: 680,
  height: 800,
  innerRadius: 50,
  points: 5,
  randomSeed: createRandomSeed(),
  rotation: 0,
  shadowBlur: 0,// 0.4,
  shadowColor: `rgba(${0}, ${0}, ${0}, ${0.4})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 1,
  shadowOffsetY: 6,
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
