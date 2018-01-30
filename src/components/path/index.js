import _ from 'lodash';
import React from 'react';

import './index.css';

const Path = props => {
  const {
    clipId,
    id,
    pathPoints,
    shadowPathPoints,
    shadowId,
    shadowStyle,
    style
  } = props;

  let shadowPathDString = '';

  // TODO: Make this not ugly.
  _.each(shadowPathPoints, (point, index) => {
    if (point.type === 'C') {
      const cp = point.cp;
      shadowPathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    } else if (index === 0) {
      shadowPathDString += `M${point.x} ${point.y} `;
    } else {
      shadowPathDString += `L${point.x} ${point.y} `;
    }
  });

  let pathDString = '';

  _.each(pathPoints, (point, index) => {
    if (point.type === 'C') {
      const cp = point.cp;
      pathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    } else if (index === 0) {
      pathDString += `M${point.x} ${point.y} `;
    } else {
      pathDString += `L${point.x} ${point.y} `;
    }
  });

  return (
    <g
      clipPath={clipId ? `url(#${clipId})` : ''}
      id={id}
    >
      <path
        className={`step-path path-${id}`}
        d={pathDString}
        style={style}
      />
      {shadowId && 
        <path
          d={shadowPathDString}
          style={{
            ...shadowStyle,
            filter: `url(#${shadowId})`
          }}
        />
      }
    </g>
  );
};

export default Path;
