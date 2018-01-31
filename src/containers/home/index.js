import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Home from '../../components/home';

const mapStateToProps = state => ({
  isBuilding: state.canvas.isBuilding
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about')
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Home);
