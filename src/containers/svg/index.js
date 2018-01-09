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
  points: state.canvas.points,
  rotation: state.canvas.rotation,
  shadowId: state.canvas.shadowId,
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