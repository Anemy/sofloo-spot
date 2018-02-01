import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  doneBuildingVisual,
  setSvgRef
} from '../../modules/canvas';

import SVG from '../../components/svg';

const mapStateToProps = state => {
  const layout = state.canvas.present;

  return {
    backgroundColor: layout.backgroundColor,
    height: layout.height,
    isBuilding: state.canvas.isBuilding,
    radialBackground: layout.radialBackground,
    radialBackgroundColor: layout.radialBackgroundColor,
    shapes: layout.shapes,
    width: layout.width
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  doneBuildingVisual: () => doneBuildingVisual(),
  setSvgRef: ref => setSvgRef(ref)
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SVG);