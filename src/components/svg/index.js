import 'inset.js'

// import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

import { buildBezierControlPointsForCircleAt/*, toDeg*/ } from '../../utils';

import SvgShadow from '../../containers/svg-shadow';
import Path from '../path';

// TODO: https://tympanus.net/Development/CreativeGooeyEffects/send.html

// Zero width tunnel:
// https://css-tricks.com/cutting-inner-part-element-using-clip-path/

// Things to write about:
// - inset shadows in canvas
// - inset shadows in svg
// - draw circle with bezier curves

class SVG extends Component {
  buildSVGCircles() {
    const {
      points,
      shadowId,
      steps
    } = this.props;

    const defs = [
      <SvgShadow key="svg-shadow"/>
    ];
    const circles = [];

    const centerX = 300;
    const centerY = 400;

    const stepLength = 5;

    const circleBase = false;

    const rotateEach = 0; // Math.PI / 8;

    const buildStep = (x, y, step) => {
      const exteriorRadius = (step + 1) * stepLength;
      const interiorRadius = (step) * stepLength;

      const exteriorPathPoints = [];
      const interiorPathPoints = [];

      for (let i = 0; i < points; i++) {
        let firstDeviation = {
          x: 0,
          y: 0
        };
        let previousDeviation = {
          x: 0,
          y: 0
        };

        const createPathPoints = (radius, interior) => {
          const startAngle = (i === 0) ? 0 : (2 * Math.PI * (i / points)) + rotateEach * step;
          const stopAngle = 2 * Math.PI * ((i + 1) / points) + rotateEach * step;
  
          const startx = x + (Math.cos(startAngle) * radius) + previousDeviation.x;
          const starty = y + (Math.sin(startAngle) * radius) + previousDeviation.y;
  
          if (i === 0) {
            const startPoint = {
              type: 'M',
              x: startx,
              y: starty
            };

            if (interior) {
              interiorPathPoints.push(startPoint);
            } else {
              exteriorPathPoints.push(startPoint);
            }
          }
  
          const deviationAmount = 4;
          const deviation = {
            x: Math.random() * deviationAmount - Math.random() * deviationAmount,
            y: Math.random() * deviationAmount - Math.random() * deviationAmount
          };
          previousDeviation = deviation;

          const stopx = x + (Math.cos(stopAngle) * radius) + ((i === points - 1) ? firstDeviation.x : deviation.x);
          const stopy = y + (Math.sin(stopAngle) * radius) + ((i === points - 1) ? firstDeviation.y : deviation.y);

          if (circleBase) {
            const cp = buildBezierControlPointsForCircleAt(x, y, radius, startx, starty, stopx, stopy);

            return {
              type: 'C',
              cp: cp,
              x: stopx,
              y: stopy
            };
          } else {
            return {
              type: 'L',
              x: stopx,
              y: stopy
            }
          }
        };

        if (exteriorRadius > 0) {
          exteriorPathPoints.push(createPathPoints(exteriorRadius, false));
        }
        if (interiorRadius > 0 && step !== 0) {
          interiorPathPoints.push(createPathPoints(interiorRadius, true));
        }
      }

      const percentage = (step / (steps - 1));

      // Color Bound.
      const cb = color => Math.min(Math.max(color, 0), 255);

      const halfVarience = Math.abs((step / (steps/2)));

      const g = 255 - cb(Math.floor(70 * percentage) + Math.floor(50 * halfVarience)); // red
      const b = 225 - cb(Math.floor(30 * percentage) - Math.floor(105 * halfVarience)); // green
      const r = 255 - cb(30 + Math.floor(240 * percentage) + Math.floor(100 * halfVarience));// 255 - Math.floor(255 * percentage); // blue
      const a = 1; // 1 - percentage; // alpha

      const fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;

      const pathStyle = {
        fill: fillColor
      };

      const pathId = `step-${step}`;
      if (step !== 0) {
        const clipId = `clip-step-${step}`;

        defs.push(
          <Path
            clip
            key={clipId}
            id={clipId}
            points={interiorPathPoints}
          />
        );
      }

      circles.push(
        <Path
          key={pathId}
          id={pathId}
          points={exteriorPathPoints}
          clipId={step !== steps - 1 ? `clip-step-${step + 1}` : ''}
          shadowId={step !== steps - 1 ? shadowId : ''}
          style={pathStyle}
        />
      );
    };

    for (let i = steps - 1; i >= 0; i--) {
      const centerDeviation = -4;
      buildStep(centerX, centerY + i * centerDeviation, i);
    }

    return [
      <defs key="svg-defs">
        {defs}
      </defs>,
      circles
    ];
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
        {this.buildSVGCircles()}
      </svg>
    );
  }
};

export default SVG;
