import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import canvas from './canvas';

export default combineReducers({
  routing: routerReducer,
  canvas: canvas
});
