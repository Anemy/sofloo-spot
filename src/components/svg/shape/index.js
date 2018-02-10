import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Path from '../../path';

class Shape extends Component {
  render() {
    const {
      gradientColor,
      id,
      isCurve,
      randomShadow,
      steps,
      strokePath
    } = this.props;

    const stepComponenets = [];

    _.each(steps, (step, index) => {
      const pathId = `step-${step.id}-shape-${id}`;
      const clipId = `clip-${pathId}`;
      const shadowId = 'svg-shadow';

      const stepColor = gradientColor ? `url(#gradient-${id})` : step.color;

      const pathStyle = {
        fill: !strokePath ? stepColor : 'none',
        stroke: strokePath ? stepColor : 'none',
        strokeWidth: strokePath ? '1px' : '0px'
      };

      if (gradientColor) {
        pathStyle.fillOpacity = (index / steps.length);
      }

      if (isCurve) {
        // TODO: I was lazy and did gradient shadows hacky, fix.
        stepComponenets.push(
          <Path
            clipId={clipId}
            key={pathId}
            hasShadow={false}
            id={pathId}
            pathPoints={step.pathPoints}
            shadowPathPoints={step.pathPoints}
            shadowId={randomShadow ? `${shadowId}-${pathId}` : shadowId}
            shadowStyle={pathStyle}
            step={step}
            style={pathStyle}
          />
        );
      } else {
        stepComponenets.push(
          <Path
            clipId={clipId}
            key={pathId}
            hasShadow={step.hasShadow}
            id={pathId}
            pathPoints={step.pathPoints}
            shadowPathPoints={strokePath ? step.pathPoints : step.clipPoints}
            shadowId={randomShadow ? `${shadowId}-${pathId}` : shadowId}
            shadowStyle={pathStyle}
            step={step}
            style={pathStyle}
          />
        );
      }
    });

    if (isCurve) {
      _.each(steps, (step, index) => {
        if (step.hasShadow) {
          const pathId = `step-${step.id}-shape-${id}`;
          const clipId = `clip-${pathId}`;
          const shadowId = 'svg-shadow';
    
          const stepColor = gradientColor ? `url(#gradient-${id})` : step.color;
    
          const pathStyle = {
            fill: !strokePath ? stepColor : 'none',
            stroke: strokePath ? stepColor : 'none',
            strokeWidth: strokePath ? '1px' : '0px'
          };
    
          if (gradientColor) {
            pathStyle.fillOpacity = (index / steps.length);
          }

          stepComponenets.push(
            <Path
              clipId={clipId}
              key={`${pathId}-shadow`}
              hasShadow={step.hasShadow}
              // TODO: I was lazy and did gradient shadows hacky, fix.
              hidePath
              id={pathId}
              pathPoints={step.pathPoints}
              shadowPathPoints={step.pathPoints}
              shadowId={randomShadow ? `${shadowId}-${pathId}` : shadowId}
              shadowStyle={pathStyle}
              step={step}
              style={pathStyle}
            />
          );
        }
      });
    }
  
    return stepComponenets;
  }
};

const mapStateToProps = (state, ownProps) => {
  const layout = state.canvas.present;
  const shape = layout.shapes[ownProps.id];

  return {
    gradientColor: shape.gradientColor,
    isCurve: shape.isCurve,
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
