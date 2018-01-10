import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './index.css';

import SVG from '../../containers/svg';

const Home = props => (
  <div className="concentric-js-home">
    {/* import { Link } from 'react-router-dom';
    <header>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </header> */}
    <div className="concentric-js-home-background" />
    <div className="concentric-js-dotted-background" />

    <h1 className="concentric-js-home-title">Concentric js</h1>
    <p>A tool for building 🔥 visuals.</p>
    {/* <button onClick={() =>  props.changePage()}>Go to about page via redux</button> */}
    {/* <Canvas /> */}
    <SVG />
    <p>Get HTML &lt;svg&gt; code</p>
    <p>Choose a gallery</p>
    <button
      onClick={() => props.randomizeVizual()}
    >
      RANDOMIZE
    </button>
  </div>
);

export default Home;
