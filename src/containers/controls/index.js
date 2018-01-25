import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  historyBack,
  historyForward,
  randomizeVizual
} from '../../modules/canvas';

import Controls from '../../components/controls';

import { createColorString, getContrastingBinaryColor } from '../../utils';

// const defaultButtonColor = {
//   r: 0,
//   g: 0,
//   b: 0
// };

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

const mapDispatchToProps = dispatch => bindActionCreators({
  historyBack: () => historyBack(),
  historyForward: () => historyForward(),
  randomizeVizual: () => randomizeVizual()
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Controls);
