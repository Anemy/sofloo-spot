import { connect } from 'react-redux';

import SvgShadow from '../../components/svg-shadow';

const mapStateToProps = state => ({
  shadowBlur: state.canvas.shadowBlur,
  shadowColor: state.canvas.shadowColor,
  shadowId: state.canvas.shadowId,
  shadowInset: state.canvas.shadowInset,
  shadowOffsetX: state.canvas.shadowOffsetX,
  shadowOffsetY: state.canvas.shadowOffsetY,
  shadowOpacity: state.canvas.shadowOpacity
});

export default connect(
  mapStateToProps, 
  null // mapDispatchToProps
)(SvgShadow);