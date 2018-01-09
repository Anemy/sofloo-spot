// import '../../utils/clipper';

// import _ from 'lodash';
// import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

import { createPathPoint, createStartPoint, pointInPolyon } from '../../utils';

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
      innerRadius,
      points,
      rotation,
      shadowId,
      steps
    } = this.props;

    const circles = [];
    const defs = [
      <SvgShadow key="svg-shadow"/>
    ];
    const clipPaths = [];

    const stepLength = 10;

    const circleBase = false;

    const rotateEach = -Math.PI / 40;

    let outerStepInteriorPoints = [];

    // https://sourceforge.net/p/jsclipper/wiki/documentation/#clipperlibcliptype

    const ClipperLib = window.ClipperLib;

    const clipSolution = new ClipperLib.Paths();
    const clipType = 0;

    // ClipperLib.Clipper.Execute(clipType, clipSolution, );
    // {ctIntersection: 0, ctUnion: 1, ctDifference: 2, ctXor: 3};

    // const subj = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
    //               [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]]; 
    // const clip = [[{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150}],
    //               [{X:60,Y:60},{X:60,Y:140},{X:140,Y:140},{X:140,Y:60}]];

    // const solution = new ClipperLib.Paths();
    // const c = new ClipperLib.Clipper();
    // c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
    // c.AddPaths(clip, ClipperLib.PolyType.ptClip, true);
    // c.Execute(ClipperLib.ClipType.ctIntersection, solution);
    // console.log('c', solution);

    const clippingFilterPoints = ClipperLib.Paths();

    let elementsAreHidden = false;

    const buildStep = (x, y, step) => {
      if (elementsAreHidden) {
        return;
      }

      const radius = step * stepLength + innerRadius;

      const interiorRadius = step * stepLength + innerRadius;
      const exteriorRadius = (step + 1) * stepLength + innerRadius;

      const interiorPathPoints = [];
      const exteriorPathPoints = [];

      let firstDeviation = {
        x: 0,
        y: 0
      };
      
      let previousDeviation = {
        x: 0,
        y: 0
      };

      const rotate = rotateEach * step + rotation;

      for (let i = 0; i < points; i++) {
        const deviationAmount = 0;
        const deviation = {
          x: Math.random() * deviationAmount - Math.random() * deviationAmount,
          y: Math.random() * deviationAmount - Math.random() * deviationAmount
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

      // Color Bound.
      const cb = color => Math.min(Math.max(Math.floor(color), 0), 255);

      // 1 halfway through steps.
      const halfVarience = 1 - (Math.abs(((step - (steps / 2)) / steps)) * 2);

      // console.log(step, 'halfVarience', halfVarience.toFixed(3));
      console.log(percentage);

      // const r = cb(12 * percentage + 30 * halfVarience);
      // const g = cb(125 * percentage + 100 * halfVarience);
      // const b = cb(194 * percentage - 10 * halfVarience);

      // const b = cb(255 * percentage); // 8, 105, 114
      // const g = cb(100 * percentage);
      // const r = cb(150 * halfVarience + 20 * percentage);

      const r = cb(Math.random() * 255);
      const g = cb(Math.random() * 255);
      const b = cb(Math.random() * 255);

      const a = 1;// 1 - percentage; // alpha

      const fillColor = `rgba(${r}, ${g}, ${b}, ${a})`;

      const pathStyle = {
        fill: fillColor
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

        // TODO ? Push a connector to build a tunnel.

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

      // if (clipPaths.length < 1) {
        clipPaths.push(
          <ClipPath
            key={`outer-${clipId}`}
            points={interiorPathPoints}
          />
        );
      // }

      // console.log((steps - step) - 1, clipPaths)
      // console.log(step, clipPaths[(steps - step) - 1] && clipPaths[(steps - step) - 1]);

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
            {/* { clipPaths[0] } */}
            {/* {/* { clipPaths[(steps - step) - 1] && clipPaths[(steps - step) - 1] } */} */}
            {/* { clipPaths[1] && clipPaths[1] } */}
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

        // console.log('pointsToAddToClip', pointsToAddToClip);
        // console.log('clippingFilterPoints', clippingFilterPoints);

        // clippingFilterPoints

        const clipSolution = new ClipperLib.Paths();
        const c = new ClipperLib.Clipper();
        c.AddPath(pointsToAddToClip, ClipperLib.PolyType.ptSubject, true);
        c.AddPath(clippingFilterPoints, ClipperLib.PolyType.ptClip, true);
        const excecuteSuccess = c.Execute(ClipperLib.ClipType.ctIntersection, clipSolution);

        // const clip

        // console.log(excecuteSuccess, 'solution:', clipSolution);

        if (clipSolution && clipSolution.length > 0) {
          clippingFilterPoints.length = 0;
          for(let i = 0; i < clipSolution[0].length; i++) {
            clippingFilterPoints[i] = {
              X: clipSolution[0][i].X,
              Y: clipSolution[0][i].Y
            };

            // console.log(i, 'clippingFilterPoints', clippingFilterPoints)
          }
        } else {
          console.log('No clip!');
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
          maskedPathPoints={exteriorPathPoints} // maskedPathPoints}
          points={exteriorPathPoints}
          shadowId={step !== steps-1 ? shadowId : ''}
          step={step}
          style={pathStyle}
        />
      );
    };

    for (let i = steps - 1; i >= 0; i--) {
      const centerDeviation = -11;
      buildStep(centerX + i * (centerDeviation / 2), centerY + i * centerDeviation, i);
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
        