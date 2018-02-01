import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ClipPath from '../../clip-path';
import ColorGradient from '../../svg-color-gradient';
import SvgShadow from '../../../containers/svg-shadow';

class ShapeDefs extends Component {
  render() {
    const {
      gradientColor,
      hasShadow,
      id,
      isCurve,
      randomShadow,
      steps
    } = this.props;

    const defs = [];

    const shadowId = 'svg-shadow';

    if (hasShadow && !randomShadow) {
      defs.push(
        <SvgShadow
          key="svg-shadow"
          shadowId={shadowId}
        />
      );
    }

    if (gradientColor) {
      defs.push(
        <ColorGradient
          key={`${id}-color-gradient`}
          shapeId={id}
        />
      );
    }
      
    for(let i = 0; i < steps.length; i++) {
      const step = steps[i];

      const pathId = `step-${step.id}`;
      const clipId = `clip-${pathId}`;

      if (hasShadow && randomShadow) {
        defs.push(
          <SvgShadow
            key={`${shadowId}-${pathId}`}
            shadowId={shadowId}
          />
        );
      }

      if (step.clipPoints && step.clipPoints.length > 0) {
        if (isCurve) {
          // TODO: Use this technique for everything.
          defs.push(
            <clipPath
              clipPath={i === 0 ? '' : `url(#clip-step-${steps[i - 1].id})`}
              id={clipId}
              key={clipId}
            >
              <ClipPath
                points={step.clipPoints}
              />
            </clipPath>
          );
        } else {
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
        }
      }
    }

    return defs;
  }
};

const mapStateToProps = (state, ownProps) => {
  const layout = state.canvas.present;
  const shape = layout.shapes[ownProps.id];

  return {
    gradientColor: shape.gradientColor,
    hasShadow: shape.hasShadow,
    isCurve: shape.isCurve,
    randomShadow: shape.randomShadow,
    steps: shape.steps
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ShapeDefs);
