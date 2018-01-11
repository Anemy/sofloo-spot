import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { randomizeVizual } from '../../modules/canvas';

import Controls from '../../components/controls';

import { createColorString, getContrastingBinaryColor } from '../../utils';

const mapStateToProps = state => ({
  randomizeButtonBackgroundColor: createColorString(state.canvas.colors[state.canvas.colors.length - 1]),
  randomizeButtonLabelColor: getContrastingBinaryColor(state.canvas.colors[state.canvas.colors.length - 1])
});

const mapDispatchToProps = dispatch => bindActionCreators({
  randomizeVizual: () => randomizeVizual()
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Controls);
