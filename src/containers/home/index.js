import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { randomizeVizual } from '../../modules/canvas';

import Home from '../../components/home';

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about'),
  randomizeVizual: () => randomizeVizual()
}, dispatch);

export default connect(
  null, 
  mapDispatchToProps
)(Home);
