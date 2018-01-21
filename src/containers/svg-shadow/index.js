import { connect } from 'react-redux';

import SvgShadow from '../../components/svg-shadow';

const mapStateToProps = state => {
  const layout = state.canvas.present;
  const shape = layout.shapes[0];

  return {
    randomShadow: shape.randomShadow,
    shadowBlur: shape.shadowBlur,
    shadowColor: shape.shadowColor,
    shadowInset: shape.shadowInset,
    shadowOffsetX: shape.shadowOffsetX,
    shadowOffsetY: shape.shadowOffsetY,
    shadowOpacity: shape.shadowOpacity
  }
};

export default connect(
  mapStateToProps, 
  null // mapDispatchToProps
)(SvgShadow);