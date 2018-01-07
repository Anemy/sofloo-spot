import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import Canvas from '../canvas';
import SVG from '../svg';

const Home = props => (
  <div>
    <h1>Home</h1>
    <p>Welcome home!</p>
    <button onClick={() => props.changePage()}>Go to about page via redux</button>
    {/* <Canvas /> */}
    <SVG />
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about')
}, dispatch);

export default connect(
  null, 
  mapDispatchToProps
)(Home);
