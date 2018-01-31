import React from 'react';

import './index.css';

import Controls from '../../containers/controls';
import Loader from '../loader';
import SVG from '../../containers/svg';

const Home = props => {
  return (
    <div className="concentric-js-home">
      <div
        className="concentric-js-home-background"
      />
      <SVG />
      {props.isBuilding && <Loader />}
      <Controls />
    </div>
  );
};

export default Home;
