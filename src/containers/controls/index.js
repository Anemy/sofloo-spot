import { connect } from 'react-redux';

import {
  historyBack,
  historyForward,
  randomizeVizual,
  startBuildingVisual
} from '../../modules/canvas';

import Controls from '../../components/controls';

import { createColorString, getContrastingBinaryColor } from '../../utils';

const mapStateToProps = state => {
  const layout = state.canvas.present;
  let outerColor = layout.shapes[0].colors[layout.shapes[0].colors.length - 1];

  // TODO: This only supports 1 shape sharing - allow more.
  let shareableString = `http://anemy.github.io/concentric/#/?shared=${layout.layoutSeed}`;
  if (layout.isFirstGen) {
    shareableString += `&v1=1`;
  }

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
    historyBack: () => {
      if (!aboutToUpdate) {
        aboutToUpdate = true;
        dispatch(startBuildingVisual());
        setTimeout(() => {
          dispatch(historyBack());
          aboutToUpdate = false;
        }, 15);
      }
    },
    historyForward: () => {
      if (!aboutToUpdate) {
        aboutToUpdate = true;
        dispatch(startBuildingVisual());
        setTimeout(() => {
          dispatch(historyForward());
          aboutToUpdate = false;
        }, 15);
      }
    },
    randomizeVizual: () => {
      if (!aboutToUpdate) {
        aboutToUpdate = true;
        dispatch(startBuildingVisual());
        setTimeout(() => {
          dispatch(randomizeVizual());
          aboutToUpdate = false;
        }, 15);
      }
    }
  };
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Controls);
