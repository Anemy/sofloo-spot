import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Canvas from '../../components/canvas';

const mapStateToProps = state => ({
  height: state.canvas.height,
  points: state.canvas.points,
  shadowBlur: state.canvas.shadowBlur,
  shadowColor: state.canvas.shadowColor,
  shadowInset: state.canvas.shadowInset,
  shadowOffsetX: state.canvas.shadowOffsetX,
  shadowOffsetY: state.canvas.shadowOffsetY,
  steps: state.canvas.steps,
  width: state.canvas.width
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/')
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Canvas);
