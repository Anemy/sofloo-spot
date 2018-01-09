import _ from 'lodash';
import React from 'react';

import './index.css';

const Path = props => {
  const {
    clipId,
    id,
    maskedPathPoints,
    points,
    shadowId,
    step,
    style
  } = props;

  let pathDString = '';

  _.each(points, (point, index) => {
    if (point.type === 'C') {
      const cp = point.cp;
      pathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    } else if (index === 0) {
      pathDString += `M${point.x} ${point.y} `;
    } else {
      pathDString += `L${point.x} ${point.y} `;
    }
  });

  let maskedPathDString = '';

  _.each(maskedPathPoints, (point, index) => {
    if (point.type === 'C') {
      const cp = point.cp;
      maskedPathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    } else if (index === 0) {
      maskedPathDString += `M${point.x} ${point.y} `;
    } else {
      maskedPathDString += `L${point.x} ${point.y} `;
    }
  });

  // console.log('masked:', maskedPathPoints);
  // console.log('string:', maskedPathDString)

  return (
    <g
      clipPath={clipId ? `url(#${clipId})` : ''}
      id={id}
      // style={{
      //   zIndex: step
      // }}
    >
      <path
        className={`step-path path-${id}`}
        d={maskedPathDString}
        style={style}
      />
      {shadowId && 
        <path
          d={pathDString}
          style={{
            ...style,
            filter: `url(#${shadowId})`
          }}
        />
      }
    </g>
  );
};

export default Path;
