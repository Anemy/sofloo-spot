import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './index.css';

import SVG from '../../containers/svg';

const Home = props => (
  <div>
    <h1>Concentric js</h1>
    <p>A tool for building visuals.</p>
    {/* <button onClick={() =>  props.changePage()}>Go to about page via redux</button> */}
    {/* <Canvas /> */}
    <SVG />
    <p>Export in PNG</p>
    <p>Choose a gallery</p>
  </div>
);

export default Home;
