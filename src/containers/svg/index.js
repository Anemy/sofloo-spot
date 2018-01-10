import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setSvgRef } from '../../modules/canvas';

import SVG from '../../components/svg';

const mapStateToProps = state => ({
  applyShadowOnTopStep: state.canvas.applyShadowOnTopStep,
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
  stepCenterDeviationX: state.canvas.stepCenterDeviationX,
  stepCenterDeviationY: state.canvas.stepCenterDeviationY,
  stepLength: state.canvas.stepLength,
  steps: state.canvas.steps,
  strokePath: state.canvas.strokePath,
  width: state.canvas.width
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setSvgRef: () => setSvgRef()
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SVG);