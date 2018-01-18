// import '../../utils/clipper';

import _ from 'lodash';
// import Bezier from 'bezier-js';
import React, { Component } from 'react';

import './index.css';

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
// - prog gen art

class SVG extends Component {
  componentDidMount() {
    this.props.setSvgRef(this.svgRef);
  }

  renderSteps() {
    const {
      applyShadowOnTopStep,
      amountOfSteps,
      shadowId,
      steps,
      strokePath
    } = this.props;

    const stepComponenets = [];
    const defs = [
      <SvgShadow key="svg-shadow"/>
    ];
      
    _.each(steps, (step, index) => {
      const pathId = `step-${step.id}`;
      const clipId = `clip-${pathId}`;

      defs.push(
        <clipPath
          id={clipId}
          key={clipId}
        >
          <ClipPath
            points={step.clipPoints}
          />
        </clipPath>
      );

      const shadow = !(applyShadowOnTopStep && (index === amountOfSteps - 1));

      const pathStyle = {
        fill: !strokePath ? step.color : 'none',
        stroke: strokePath ? step.color : 'none',
        strokeWidth: strokePath ? '1px' : '0px'
      };

      stepComponenets.push(
        <Path
          clipId={clipId}
          key={pathId}
          id={pathId}
          pathPoints={step.pathPoints}
          shadowPathPoints={shadow && strokePath ? step.pathPoints : step.clipPoints}
          shadowId={shadow && shadowId}
          shadowStyle={pathStyle}
          step={step}
          style={pathStyle}
        />
      );
    });

    return [
      <defs key="svg-defs">
        {defs}
      </defs>,
      stepComponenets
    ];
  }

  render() {
    const {
      backgroundColor,
      height,
      radialBackground,
      radialBackgroundColor,
      width
    } = this.props;
    
    return (
      <svg
        className="visual-container"
        height={height}
        ref={ref => { this.svgRef = ref; }}
        style={{
          background: radialBackground ?
            `radial-gradient(${radialBackgroundColor}, ${backgroundColor})` : backgroundColor
        }}
        width={width}
      >
        {this.renderSteps()}
      </svg>
    );
  }
};

export default SVG;
