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
  componentDidMount() {
    this.props.setSvgRef(this.svgRef);
  }

  buildSVGCircles() {
    const {
      applyShadowOnTopStep,
      centerX,
      centerY,
      colors,
      innerRadius,
      pointDeviationMaxX,
      pointDeviationMaxY,
      points,
      previousPointDeviationInfluence,
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

    const buildStep = (x, y, step) => {
      const interiorRadius = step * stepLength + innerRadius;
      const exteriorRadius = (step + 1) * stepLength + innerRadius;

      const interiorPathPoints = [];
      const exteriorPathPoints = [];

      const firstDeviation = {
        x: 0,
        y: 0
      };

      const previousDeviation = {
        x: 0,
        y: 0
      };

      const rotate = rotateEachStep * step + rotation;

      for (let i = 0; i < points; i++) {
        // TODO: This will have to be integrated with the store somehow.
        const pointDeviationX = Math.random() * pointDeviationMaxX - Math.random() * pointDeviationMaxX;
        const pointDeviationY = Math.random() * pointDeviationMaxY - Math.random() * pointDeviationMaxY;    

        const deviation = {
          x: pointDeviationX,
          y: pointDeviationY
        };

        if (previousPointDeviationInfluence) {
          deviation.x += previousDeviation.x;
          deviation.y += previousDeviation.y;

          // Come back to the origin when we're past the half point.
          // This prevents it making a sharp edge back to the starting location when it goes full circle.
          if (i > points - (points / 2)) {
            if (Math.abs(pointDeviationMaxX) > 0 && 
              ((pointDeviationX < 0 && previousDeviation.x > 0) || (pointDeviationX > 0 && previousDeviation.x < 0)))
            {
              const undeviateX = pointDeviationX / 2;

              deviation.x += undeviateX;
            }

            if (Math.abs(pointDeviationMaxY) > 0 && 
              ((pointDeviationY < 0 && previousDeviation.y > 0) || (pointDeviationY > 0 && previousDeviation.y < 0)))
            {
              const undeviateY = pointDeviationY / 2;

              deviation.y += undeviateY;
            }
          }
        }

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

      const pathPointsForClip = [];

      if (step === steps - 1) {
        for (let i = interiorPathPoints.length - 1; i >= 0; i--) {
          const point = interiorPathPoints[i];
  
          pathPointsForClip.push({
            x: point.x,
            y: point.y
          });
        }
      } else {
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

        for (let i = clippingFilterPoints.length - 1; i >= 0; i--) {
          const point = clippingFilterPoints[i];

          pathPointsForClip.push({
            x: point.X,
            y: point.Y
          });
        }
      }

      for (let i = 0; i < pathPointsForClip.length; i++) {
        const point = (step === steps - 1) ? interiorPathPoints[i] : pathPointsForClip[i];

        clippingFilterPoints[i] = {
          X: point.x,
          Y: point.y
        }
      }
      
      const pathId = `step-${step}`;
      const clipId = `clip-${pathId}`;

      defs.push(
        <clipPath
          id={clipId}
          key={clipId}
        >
          <ClipPath
            points={pathPointsForClip}
          />
        </clipPath>
      );

      const shadow = !(applyShadowOnTopStep && (step === steps - 1));

      const pathStyle = {
        fill: !strokePath ? getStepColor(step, steps, colors) : 'none',
        stroke: strokePath ? getStepColor(step, steps, colors) : 'none',
        strokeWidth: strokePath ? '1px' : '0px'
      };

      const shadowStyle = {
        fill: !strokePath ? getStepColor(step, steps, colors) : 'none',
        stroke: strokePath ? getStepColor(step, steps, colors) : 'none'
      }

      circles.push(
        <Path
          clipId={`clip-step-${step}`}
          key={pathId}
          id={pathId}
          pathPoints={strokePath ? interiorPathPoints : exteriorPathPoints}
          shadowPathPoints={strokePath ? (shadow && exteriorPathPoints) : (shadow && pathPointsForClip)}
          shadowId={shadow && shadowId}
          shadowStyle={shadowStyle}
          step={step}
          style={pathStyle}
        />
      );
    };

    for (let i = steps - 1; i >= 0; i--) {
      if (elementsAreHidden) {
        break;
      }

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
