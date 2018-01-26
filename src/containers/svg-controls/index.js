import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  updateBackground,
  updateVisual
} from '../../modules/canvas';

import SVGControls from '../../components/svg-controls';

import { createColorString, getContrastingBinaryColor } from '../../utils';

const mapStateToProps = state => {
  const layout = state.canvas.present;

  const shape = layout.shapes[0];

  const shapeOuterColor = shape.colors[shape.colors.length - 1];

  return {
    backgroundColor: layout.backgroundColor,
    primarySVGColor: createColorString(shapeOuterColor),
    contrastPrimarySVGColor: getContrastingBinaryColor(shapeOuterColor),
    radialBackground: layout.radialBackground,
    radialBackgroundColor: layout.radialBackgroundColor,
    svgRef: state.canvas.svgRef
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBackground: newBackground => dispatch(updateBackground(newBackground)),
  updateVisual: change => dispatch(updateVisual(change))
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SVGControls);
