import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  createColorString
} from '../../utils/color';

class SvgColorGradient extends Component {
  render() {
    const {
      colors,
      gradientDirection,
      shapeId
    } = this.props;

    const stops = [];

    for (let i = 0; i < colors.length; i++) {
      stops.push(<stop
        key={`stop-${i}-shape-${shapeId}`}
        offset={`${Math.floor(100 * (i / (colors.length - 1)))}%`}
        stopColor={createColorString(colors[i])}
      />);
    }

    return (
      <linearGradient
        id={`gradient-${shapeId}`}
        x1={`${gradientDirection.x1}%`}
        y1={`${gradientDirection.y1}%`}
        x2={`${gradientDirection.x2}%`}
        y2={`${gradientDirection.y2}%`}
        gradientUnits="userSpaceOnUse"
      >
        {stops}
      </linearGradient>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const layout = state.canvas.present;

  const shape = layout.shapes[ownProps.shapeId];

  return {
    colors: shape.colors,
    gradientDirection: shape.gradientDirection
  };
};

const mapDispatchToProps = null;

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SvgColorGradient);
