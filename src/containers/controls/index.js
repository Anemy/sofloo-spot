import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { randomizeVizual } from '../../modules/canvas';

import Controls from '../../components/controls';

const mapStateToProps = state => ({
  centerX: state.canvas.centerX,
  centerY: state.canvas.centerY,
  height: state.canvas.height,
  innerRadius: state.canvas.innerRadius,
  points: state.canvas.points,
  rotate: state.canvas.rotate,
  shadowId: state.canvas.shadowId,
  steps: state.canvas.steps,
  width: state.canvas.width
});

const mapDispatchToProps = dispatch => bindActionCreators({
  randomizeVizual: () => randomizeVizual()
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Controls);
