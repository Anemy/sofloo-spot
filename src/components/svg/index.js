// import '../../utils/clipper';

// import _ from 'lodash';
// import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

import { createPathPoint, createStartPoint, getStepColor } from '../../utils';

import SvgShadow from '../../containers/svg-shadow';

import ClipPath from '../clip-path';
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
      centerX,
      centerY,
      colors,
      innerRadius,
      pointDeviationMaxX,
      pointDeviationMaxY,
      points,
      rotateEachStep,
      rotation,
      shadowId,
      stepLength,
      steps
    } = this.props;

    const circles = [];
    const defs = [
      <SvgShadow key="svg-shadow"/>
    ];

    const circleBase = false;

    // https://sourceforge.net/p/jsclipper/wiki/documentation/#clipperlibcliptype
    const ClipperLib = window.ClipperLib;
    const clippingFilterPoints = ClipperLib.Paths();

    let elementsAreHidden = false;

    const randomFloor = range => Math.floor(Math.random() * range); 

    const buildStep = (x, y, step) => {
      if (elementsAreHidden) {
        return;
      }

      const radius = step * stepLength + innerRadius;

      const interiorRadius = step * stepLength + innerRadius;
      const exteriorRadius = (step + 1) * stepLength + innerRadius;

      const interiorPathPoints = [];
      const exteriorPathPoints = [];

      const firstDeviation = {
        x: 0,
        y: 0
      };

      const previousDeviation = {};

      const rotate = rotateEachStep * step + rotation;

      for (let i = 0; i < points; i++) {
        const pointDeviationX = Math.random() * pointDeviationMaxX - Math.random() * pointDeviationMaxX;
        const pointDeviationY = Math.random() * pointDeviationMaxY - Math.random() * pointDeviationMaxY;    

        const deviation = {
          x: pointDeviationX,
          y: pointDeviationY
        };

        if (i === 0) {
          firstDeviation.x = deviation.x;
          firstDeviation.y = deviation.y;

          exteriorPathPoints.push(createStartPoint(exteriorRadius, rotate, deviation));
          interiorPathPoints.push(createStartPoint(interiorRadius, rotate, deviation));
        }

        // createPathPoint(radius, point, points, rotate, previousDeviation, deviation, firstDeviation)
        interiorPathPoints.push(createPathPoint(
          interiorRadius,
          i,
          points,
          rotate,
          circleBase,
          previousDeviation,
          deviation,
          firstDeviation
        ));
        exteriorPathPoints.push(createPathPoint(
          exteriorRadius,
          i,
          points,
          rotate,
          circleBase,
          previousDeviation,
          deviation,
          firstDeviation
        ));

        previousDeviation.x = deviation.x;
        previousDeviation.y = deviation.y;
      }

      // Translate to the center.
      for (let i = 0; i < interiorPathPoints.length; i++) {
        interiorPathPoints[i].x += x;
        interiorPathPoints[i].y += y;
        exteriorPathPoints[i].x += x;
        exteriorPathPoints[i].y += y;
      }

      // Outer is 0. Inner is 1
      const percentage = (step / (steps - 1));

      const pathStyle = {
        fill: getStepColor(step, steps, colors)
        // fill: 'none',
        // stroke: step % 2 === 0 ? fillColor : 'none'
      };

      const pathId = `step-${step}`;

      // Here we create a clip mask so that only the step shows up when filled.
      // This ensures we only draw the layer.
      // We use a zero pixel tunnel: https://css-tricks.com/cutting-inner-part-element-using-clip-path/
      
      let maskedPathPoints = [];
      
      if (step === 0) {
        maskedPathPoints = exteriorPathPoints;
      } else {
        for (let i = 0; i < interiorPathPoints.length; i++) {
          const point = interiorPathPoints[i];

          maskedPathPoints.push({
            type: point.type,
            x: point.x,
            y: point.y
          });
        }

        for (let i = exteriorPathPoints.length - 1; i >= 0; i--) {
          const point = exteriorPathPoints[i];
  
          maskedPathPoints.push({
            type: point.type,
            x: point.x,
            y: point.y
          });
        }

        maskedPathPoints.push({
          type: 'L',
          x: interiorPathPoints[0].x,
          y: interiorPathPoints[0].y
        });
      }

      const clipId = `clip-${pathId}`;

      if (step !== steps - 1) {
        const pathPointsForClip = [];

        for (let i = clippingFilterPoints.length - 1; i >= 0; i--) {
          const point = clippingFilterPoints[i];
  
          pathPointsForClip.push({
            x: point.X,
            y: point.Y
          });
        }
        
        defs.push(
          <clipPath
            id={`clip-step-${step}`}
            key={`clip-step-${step}`}
            style={{fill: '#FFF'}}
          >
            <ClipPath
              key={clipId}
              id={clipId}
              points={pathPointsForClip}
            />
          </clipPath>
        );

        const pointsToAddToClip = [];

        for (let i = interiorPathPoints.length - 1; i >= 0; i--) {
          const point = interiorPathPoints[i];
  
          pointsToAddToClip.push({
            X: point.x,
            Y: point.y
          });
        }

        const clipSolution = new ClipperLib.Paths();
        const c = new ClipperLib.Clipper();
        // NOTE: If these arrays contain NaN then it will infinite loop.
        c.AddPath(pointsToAddToClip, ClipperLib.PolyType.ptSubject, true);
        c.AddPath(clippingFilterPoints, ClipperLib.PolyType.ptClip, true);
        c.Execute(ClipperLib.ClipType.ctIntersection, clipSolution);

        if (clipSolution && clipSolution.length > 0) {
          clippingFilterPoints.length = 0;
          for(let i = 0; i < clipSolution[0].length; i++) {
            clippingFilterPoints[i] = {
              X: clipSolution[0][i].X,
              Y: clipSolution[0][i].Y
            };
          }
        } else {
          elementsAreHidden = true;
        }
      } else {
        for (let i = interiorPathPoints.length - 1; i >= 0; i--) {
          const point = interiorPathPoints[i];
  
          clippingFilterPoints.push({
            X: point.x,
            Y: point.y
          });
        }
      }

      circles.push(
        <Path
          clipId={`clip-step-${step}`}
          key={pathId}
          id={pathId}
          maskedPathPoints={exteriorPathPoints}
          points={exteriorPathPoints}
          shadowId={step !== steps-1 ? shadowId : ''}
          step={step}
          style={pathStyle}
        />
      );
    };

    const maxDeviationX = 30;
    const maxDeviationY = 30;

    const deviationX = Math.random() * maxDeviationX - Math.random() * maxDeviationX;
    const deviationY = Math.random() * maxDeviationY - Math.random() * maxDeviationY;
    // const deviationY = -14;

    for (let i = steps - 1; i >= 0; i--) {
      buildStep(centerX + (steps - i) * deviationX, centerY + (steps - i) * deviationY, i);
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
      centerX,
      centerY,
      height,
      width
    } = this.props;

      // console.log('here')

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



        // const b = cb(Math.floor(200 * percentage)); // red
        // const g = 225 - cb(Math.floor(30 * percentage) + Math.floor(105 * halfVarience)); // green
        // const r = cb(30 + Math.floor(240 * percentage) + Math.floor(200 * halfVarience));// 255 - Math.floor(255 * percentage); // blue
        
        // const r = cb(Math.floor(200 * percentage)); // red
        // const g = 225 - cb(Math.floor(30 * percentage) + Math.floor(105 * halfVarience)); // green
        // const b = cb(30 + Math.floor(240 * percentage) + Math.floor(200 * halfVarience));// 255 - Math.floor(255 * percentage); // blue
        