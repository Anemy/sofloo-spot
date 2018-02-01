import _ from 'lodash';
import React, { Component } from 'react';

import './index.css';

import Shape from './shape';
import ShapeDef from './shape-def';

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

  componentDidUpdate() {
    if (this.props.isBuilding) {
      this.props.doneBuildingVisual();
    }
  }

  renderDefs() {
    const {
      shapes
    } = this.props;

    const renderedDefs = [];

    _.each(shapes, (shape, index) => {
      renderedDefs.push(
        <ShapeDef
          id={index}
          key={index}
        />
      );
    });

    return renderedDefs;
  }

  renderShapes() {
    const {
      shapes
    } = this.props;

    const renderedShapes = [];

    _.each(shapes, (shape, index) => {
      renderedShapes.push(
        <Shape
          id={index}
          key={index}
        />
      );
    });

    return renderedShapes;
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
        className="concentric-js-visual-container"
        height={height}
        ref={ref => { this.svgRef = ref; }}
        style={{
          background: radialBackground ?
            `radial-gradient(${radialBackgroundColor}, ${backgroundColor})` : backgroundColor
        }}
        width={width}
      >
        <defs key="svg-defs">
          {this.renderDefs()}
        </defs>
        {this.renderShapes()}
      </svg>
    );
  }
};

export default SVG;
