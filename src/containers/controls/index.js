import { connect } from 'react-redux';

import {
  historyBack,
  historyForward,
  randomizeVizual,
  startBuildingVisual
} from '../../modules/canvas';

import Controls from '../../components/controls';

import { createColorString, getContrastingBinaryColor } from '../../utils/color';

const mapStateToProps = state => {
  const layout = state.canvas.present;
  const outerColor = layout.shapes[0].colors[layout.shapes[0].colors.length - 1];

  const baseURL = `${window.location.origin}${window.location.pathname}#/`;
  const shareableString = `${baseURL}?shared=${layout.seed}&v=${layout.version}`;

  return {
    randomizeButtonBackgroundColor: createColorString(outerColor),
    randomizeButtonLabelColor: getContrastingBinaryColor(outerColor),
    shareableString,
    svgRef: state.canvas.svgRef
  }
};

const mapDispatchToProps = dispatch => {
  let aboutToUpdate = false;

  return {
    // TODO: This is hacky, clean up.
    historyBack: () => {
      if (!aboutToUpdate) {
        aboutToUpdate = true;
        dispatch(startBuildingVisual());
        setTimeout(() => {
          dispatch(historyBack());
          aboutToUpdate = false;
        }, 5);
      }
    },
    historyForward: () => {
      if (!aboutToUpdate) {
        aboutToUpdate = true;
        dispatch(startBuildingVisual());
        setTimeout(() => {
          dispatch(historyForward());
          aboutToUpdate = false;
        }, 5);
      }
    },
    randomizeVizual: () => {
      if (!aboutToUpdate) {
        aboutToUpdate = true;
        dispatch(startBuildingVisual());
        setTimeout(() => {
          dispatch(randomizeVizual());
          aboutToUpdate = false;
        }, 5);
      }
    }
  };
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Controls);
