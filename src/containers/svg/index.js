// import { push } from 'react-router-redux';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SVG from '../../components/svg';

const mapStateToProps = state => ({
  height: state.canvas.height,
  points: state.canvas.points,
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