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

  return {
    // TODO: This looks bad.
    randomizeButtonBackgroundColor: createColorString(outerColor),
    randomizeButtonLabelColor: getContrastingBinaryColor(outerColor),
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
