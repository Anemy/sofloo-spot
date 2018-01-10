// import { push } from 'react-router-redux';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SVG from '../../components/svg';

const mapStateToProps = state => ({
  centerX: state.canvas.centerX,
  centerY: state.canvas.centerY,
  colors: state.canvas.colors,
  height: state.canvas.height,
  innerRadius: state.canvas.innerRadius,
  pointDeviationMaxX: state.canvas.pointDeviationMaxX,
  pointDeviationMaxY: state.canvas.pointDeviationMaxY,
  points: state.canvas.points,
  rotation: state.canvas.rotation,
  rotateEachStep: state.canvas.rotateEachStep,
  shadowId: state.canvas.shadowId,
  stepLength: state.canvas.stepLength,
  steps: state.canvas.steps,
  width: state.canvas.width
});

// const mapDispatchToProps = dispatch => bindActionCreators({
//   changePage: () => push('/')
// }, dispatch);

export default connect(
  mapStateToProps, 
  null // mapDispatchToProps
)(SVG);