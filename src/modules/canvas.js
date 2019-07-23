import {
  generateInitialLayout,
  generateLayoutBySeedAndVersion,
  generateRandomLayout
} from '../utils/layouts';

import {
  VERSIONS
} from '../constants';

const DONE_BUILDING = 'svg/DONE_BUILDING';
const HISTORY_BACK = 'svg/HISTORY_BACK';
const HISTORY_FORWARD = 'svg/HISTORY_FORWARD';
const RANDOMIZE = 'svg/RANDOMIZE';
const SET_RANDOMIZE_ALGORITHM = 'svg/SET_RANDOMIZE_ALGORITHM';
const SET_SVG = 'svg/SET_SVG';
const SET_SVG_REF = 'svg/SET_SVG_REF';
const START_BUILDING = 'svg/START_BUILDING';
const TOGGLE_RENDER_ASPECT_RATIO = 'svg/TOGGLE_RENDER_ASPECT_RATIO';
const UPDATE_BACKGROUND = 'svg/UPDATE_BACKGROUND';
const UPDATE_SVG = 'svg/UPDATE_SVG';

const maxHistoryLength = 1000;

const heightOfHeader = 0; // 80;

const minHeight = 200;
const minWidth = 200;

const clientWidth = window.innerWidth || document.body.clientWidth;
const clientHeight = document.body.clientHeight || window.innerHeight;

export const height = Math.max(Math.floor(clientHeight - heightOfHeader), minHeight) - 4;
export const width = Math.max(Math.floor(clientWidth), minWidth) - 4;

export function randomizeVizual() {
  return {
    type: RANDOMIZE
  };
}

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

export function togglePreserveAspectRatio() {
  return {
    type: TOGGLE_RENDER_ASPECT_RATIO
  };
}

export const updateBackground = newBackground => ({
  newBackground,
  type: UPDATE_BACKGROUND
});

export function updateRenderHeight(newHeight) {
  return {
    type: SET_SVG,
    payload: {
      renderHeight: newHeight
    }
  };
}

export function setStreamSofloo() {
  return {
    type: RANDOMIZE
  };
}

export function updateRenderWidth(newWidth) {
  return {
    type: SET_SVG,
    payload: {
      renderWidth: newWidth
    }
  };
}

export const updateVisual = update => ({
  update,
  type: UPDATE_SVG
});

export const startBuildingVisual = () => {
  return {
    type: START_BUILDING
  };
};

export const doneBuildingVisual = () => {
  return {
    type: DONE_BUILDING
  };
};

export const setRandomizeAlgorithm = algorithm => {
  return {
    algorithm,
    type: SET_RANDOMIZE_ALGORITHM
  };
};

// We default to rendering the pic at 5k pixels for the greater
// aspect ratio number (or the screensize if bigger).
const defaultMinMaxSize = 5000;
let initialRenderHeight;
let initialRenderWidth;
if (height > width) {
  initialRenderHeight = Math.round(Math.max(height, defaultMinMaxSize));
  initialRenderWidth = Math.round((initialRenderHeight / height) * width);
} else {
  initialRenderWidth = Math.round(Math.max(width, defaultMinMaxSize));
  initialRenderHeight = Math.round((initialRenderWidth / width) * height);
}
const initialRenderAspectRatio = initialRenderWidth / initialRenderHeight;

const initialState = {
  height,
  history: [],
  future: [],
  isBuilding: false,
  present: generateInitialLayout(width, height),
  preserveRenderAspectRatio: true,
  randomizeAlgorithm: VERSIONS.FULL_RANDOM,
  svgRef: null,
  width,
  renderAspectRatio: initialRenderAspectRatio,
  renderHeight: initialRenderHeight,
  renderWidth: initialRenderWidth
};


export default (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_BACK: {
      if (state.history && state.history.length > 0) {
        const newState = {
          ...state,
          isBuilding: false
        };

        newState.future.unshift({
          version: state.present.version,
          seed: state.present.seed
        });

        const newPresent = newState.history.shift();

        newState.present = {
          ...state.present,
          ...generateLayoutBySeedAndVersion(width, height, newPresent.seed, newPresent.version)
        };

        if (newState.future.length > maxHistoryLength) {
          newState.future.pop();
        }

        return newState;
      } else {
        return {
          ...state
        };
      }
    }

    case HISTORY_FORWARD: {
      if (state.future && state.future.length > 0) {
        const newState = {
          ...state,
          isBuilding: false
        };

        newState.history.unshift({
          version: state.present.version,
          seed: state.present.seed
        });

        const newPresent = newState.future.shift();

        newState.present = {
          ...state.present,
          ...generateLayoutBySeedAndVersion(width, height, newPresent.seed, newPresent.version)
        };

        if (newState.history.length > maxHistoryLength) {
          newState.history.pop();
        }

        return newState;
      } else {
        return {
          ...state
        };
      }
    }

    case START_BUILDING: {
      return {
        ...state,
        isBuilding: true
      };
    }

    case DONE_BUILDING:
      return {
        ...state,
        isBuilding: false
      };

    case RANDOMIZE: {
      // Note: Not a deep copy.
      const newState = {
        ...state,
        isBuilding: false
      };

      newState.history.unshift({
        version: state.present.version,
        seed: state.present.seed
      });

      newState.present = {
        ...state.present,
        ...generateRandomLayout(width, height, newState.randomizeAlgorithm)
      };

      if (newState.history.length > maxHistoryLength) {
        newState.history.pop();
      }

      return newState;
    }

    case SET_RANDOMIZE_ALGORITHM:
      return {
        ...state,
        randomizeAlgorithm: action.algorithm
      };

    case SET_SVG_REF:
      return {
        ...state,
        svgRef: action.svgRef
      };

    case TOGGLE_RENDER_ASPECT_RATIO: {
      return {
        ...state,
        preserveRenderAspectRatio: !state.preserveRenderAspectRatio
      };
    }

    case UPDATE_BACKGROUND: {
      const theNewState = {
        ...state
      };

      theNewState.present = {
        ...theNewState.present,
        ...action.newBackground
      };

      return theNewState;
    }

    case SET_SVG: {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return state;
  }
};
