import 'inset.js'

// import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

import { buildBezierControlPointsForCircleAt } from '../../utils';

import SvgShadow from '../../containers/svg-shadow';
import Path from '../path';

// TODO: https://tympanus.net/Development/CreativeGooeyEffects/send.html

class SVG extends Component {
  buildSVGCircles() {
    const {
      points,
      shadowId,
      steps
    } = this.props;

    let circles = [];

    const centerX = 300;
    const centerY = 300;

    const stepLength = 30;

    const drawBeziersOfCircleRecursively = (x, y, step) => {
      const radius = (step + 1) * stepLength;

      let pathPoints = [];

      for (let i = 0; i < points; i++) {
        const startAngle = (i === 0) ? 0 : (2 * Math.PI * (i / points));
        const stopAngle = 2 * Math.PI * ((i + 1) / points);

        const startx = x + (Math.cos(startAngle) * radius);
        const starty = y + (Math.sin(startAngle) * radius);

        if (i === 0) {
          pathPoints.push({
            x: startx,
            y: starty
          });
        }

        const stopx = x + (Math.cos(stopAngle) * radius);
        const stopy = y + (Math.sin(stopAngle) * radius);

        const cp = buildBezierControlPointsForCircleAt(x, y, radius, startx, starty, stopx, stopy);

        pathPoints.push({
          type: 'C',
          cp: cp,
          x: stopx,
          y: stopy
        });
      }

      const r = 30; // 255 - Math.floor(255 * (step / steps)); // red
      const g = 255 - Math.floor(255 * (step / steps)); // green
      const b = Math.floor(255 * (step / steps)); // blue
      const a = 1; // 1 - (step / steps); // alpha

      const fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;

      const pathStyle = {
        fill: fillColor// ,
        // filter: `url(#${shadowId})`
      };

      const pathId = `step-${step}`;

      circles.push(
        <Path
          key={pathId}
          pathId={pathId}
          points={pathPoints}
          shadowId={step !== steps-1 ? shadowId : ''}
          style={pathStyle}
        />
      );
    };

    for (let i = steps-1; i >= 0; i--) {
      drawBeziersOfCircleRecursively(centerX, centerY, i);
    }

    return circles;
  }

  render() {
    const {
      height,
      width
    } = this.props;

    return (
      <svg
        className="visual-container"
        height={height}
        ref={ref => {this.svgRef = ref;}}
        width={width}
      >
        {<SvgShadow />}
        {this.buildSVGCircles()}
      </svg>
    );
  }
};

export default SVG;
