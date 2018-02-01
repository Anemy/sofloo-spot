import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Path from '../../path';

class Shape extends Component {
  render() {
    const {
      randomShadow,
      steps,
      strokePath
    } = this.props;

    const stepComponenets = [];

    _.each(steps, (step, index) => {
      const pathId = `step-${step.id}`;
      const clipId = `clip-${pathId}`;
      const shadowId = 'svg-shadow';

      const hasShadow = true;

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
          shadowPathPoints={hasShadow && (strokePath ? step.pathPoints : step.clipPoints)}
          shadowId={hasShadow && (randomShadow ? `${shadowId}-${pathId}` : shadowId)}
          shadowStyle={pathStyle}
          step={step}
          style={pathStyle}
        />
      );
    });
  
    return stepComponenets;
  }
};

const mapStateToProps = (state, ownProps) => {
  const layout = state.canvas.present;
  const shape = layout.shapes[ownProps.id];

  return {
    randomShadow: shape.randomShadow,
    steps: shape.steps,
    strokePath: shape.strokePath
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Shape);
