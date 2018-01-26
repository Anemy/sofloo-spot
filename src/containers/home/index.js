import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Home from '../../components/home';

const mapStateToProps = state => ({
  backgroundColor: state.canvas.present.backgroundColor,
  isBuilding: state.canvas.isBuilding,
  radialBackground: state.canvas.present.radialBackground,
  radialBackgroundColor: state.canvas.present.radialBackgroundColor
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about')
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Home);
