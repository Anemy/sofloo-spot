import { connect } from 'react-redux';

import SvgShadow from '../../components/svg-shadow';

const mapStateToProps = state => ({
  shadowBlur: state.canvas.present.shadowBlur,
  shadowColor: state.canvas.present.shadowColor,
  shadowId: state.canvas.present.shadowId,
  shadowInset: state.canvas.present.shadowInset,
  shadowOffsetX: state.canvas.present.shadowOffsetX,
  shadowOffsetY: state.canvas.present.shadowOffsetY,
  shadowOpacity: state.canvas.present.shadowOpacity
});

export default connect(
  mapStateToProps, 
  null // mapDispatchToProps
)(SvgShadow);