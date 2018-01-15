import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setSvgRef } from '../../modules/canvas';

import SVG from '../../components/svg';

const mapStateToProps = state => ({
  applyShadowOnTopStep: state.canvas.present.applyShadowOnTopStep,
  centerX: state.canvas.present.centerX,
  centerY: state.canvas.present.centerY,
  colors: state.canvas.present.colors,
  height: state.canvas.height,
  innerRadius: state.canvas.present.innerRadius,
  pointDeviationMaxX: state.canvas.present.pointDeviationMaxX,
  pointDeviationMaxY: state.canvas.present.pointDeviationMaxY,
  points: state.canvas.present.points,
  previousPointDeviationInfluence: state.canvas.present.previousPointDeviationInfluence,
  rotation: state.canvas.present.rotation,
  rotateEachStep: state.canvas.present.rotateEachStep,
  shadowId: state.canvas.present.shadowId,
  stepCenterDeviationX: state.canvas.present.stepCenterDeviationX,
  stepCenterDeviationY: state.canvas.present.stepCenterDeviationY,
  stepLength: state.canvas.present.stepLength,
  steps: state.canvas.present.steps,
  strokePath: state.canvas.present.strokePath,
  width: state.canvas.width
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setSvgRef: ref => setSvgRef(ref)
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SVG);