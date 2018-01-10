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
      stepCenterDeviationX,
      stepCenterDeviationY,
      stepLength,
      steps,
      strokePath
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
        // TODO: This will have to be integrated with the store somehow.
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

      // Translate the step to the center.
      for (let i = 0; i < interiorPathPoints.length; i++) {
        interiorPathPoints[i].x += x;
        interiorPathPoints[i].y += y;
        exteriorPathPoints[i].x += x;
        exteriorPathPoints[i].y += y;
      }

      // Outer is 0. Inner is 1
      const percentage = (step / (steps - 1));

      const pathStyle = {
        fill: !strokePath ? getStepColor(step, steps, colors) : 'none',
        stroke: strokePath ? getStepColor(step, steps, colors) : 'none'
      };

      const pathId = `step-${step}`;
      const clipId = `clip-${pathId}`;

      const pathPointsForClip = [];

      if (step !== steps - 1) {
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
          pathPoints={exteriorPathPoints}
          shadowPathPoints={pathPointsForClip}
          shadowId={step !== steps-1 ? shadowId : ''}
          shadowStyle={pathStyle}
          step={step}
          style={pathStyle}
        />
      );
    };

    for (let i = steps - 1; i >= 0; i--) {
      buildStep(centerX + (steps - i) * stepCenterDeviationX, centerY + (steps - i) * stepCenterDeviationY, i);
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
