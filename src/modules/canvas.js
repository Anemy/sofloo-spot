import { createRandomSeed } from '../utils';

// export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED';
// export const INCREMENT = 'counter/INCREMENT';
// export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED';
// export const DECREMENT = 'counter/DECREMENT';

// colors https://github.com/arcticicestudio/nord

const initialState = {
  height: 600,
  points: 3,
  randomSeed: createRandomSeed(),
  rotation: 0,
  shadowBlur: 0,
  shadowColor: `rgb(${0}, ${0}, ${0})`,
  shadowId: 'svg-shadow',
  shadowInset: true,
  shadowOffsetX: 0,
  shadowOffsetY: 3,
  shadowOpacity: 0.7,
  steps: 40,
  stepVariance: 0,
  width: 600
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
