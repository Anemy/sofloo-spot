import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setSvgRef } from '../../modules/canvas';

import SVG from '../../components/svg';

const mapStateToProps = state => ({
  applyShadowOnTopStep: state.canvas.present.applyShadowOnTopStep,
  amountOfSteps: state.canvas.amountOfSteps,
  backgroundColor: state.canvas.present.backgroundColor,
  centerX: state.canvas.present.centerX,
  centerY: state.canvas.present.centerY,
  height: state.canvas.height,
  radialBackground: state.canvas.present.radialBackground,
  radialBackgroundColor: state.canvas.present.radialBackgroundColor,
  shadowId: state.canvas.present.shadowId,
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