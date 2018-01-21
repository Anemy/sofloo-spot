import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ClipPath from '../../clip-path';
import SvgShadow from '../../../containers/svg-shadow';

class ShapeDefs extends Component {
  render() {
    const {
      randomShadow,
      steps
    } = this.props;

    const stepComponenets = [];
    const defs = [];

    const shadowId = 'svg-shadow';

    if (!randomShadow) {
      console.log('random shadow', randomShadow);
      defs.push(
        <SvgShadow
          key="svg-shadow"
          shadowId={shadowId}
        />
      );
    }
      
    _.each(steps, (step, index) => {
      const pathId = `step-${step.id}`;
      const clipId = `clip-${pathId}`;

      if (randomShadow) {
        console.log('new svg shadow');
        defs.push(
          <SvgShadow
            key={`${shadowId}-${pathId}`}
            shadowId={shadowId}
          />
        );
      }

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
    });

    return defs;
  }
};

const mapStateToProps = (state, ownProps) => {
  const layout = state.canvas.present;
  const shape = layout.shapes[ownProps.id];

  return {
    randomShadow: shape.randomShadow,
    steps: shape.steps
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ShapeDefs);
