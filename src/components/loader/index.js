import React from 'react';

import './index.css';

import {
  createColorString
} from '../../utils/color';

export const createRandomColor = () => ({
  r: Math.floor(Math.random() * 255),
  g: Math.floor(Math.random() * 255),
  b: Math.floor(Math.random() * 255)
});

export default () => {
  return (
    <div className="concentric-loader">
      <div
        className="concentric-loader-outer-box"
        style={{
          backgroundColor: createColorString(createRandomColor())
        }}
      />
      <div
        className="concentric-loader-inner-box"
        style={{
          backgroundColor: createColorString(createRandomColor())
        }}
      />
    </div>
  );
}