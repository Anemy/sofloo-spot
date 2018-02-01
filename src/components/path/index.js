import _ from 'lodash';
import React from 'react';

import './index.css';

// TODO: This can be plugged into redux and a lot less hacky.
const Path = props => {
  const {
    clipId,
    hasShadow,
    id,
    pathPoints,
    shadowPathPoints,
    shadowId,
    shadowStyle,
    style
  } = props;


  let shadowPathDString = '';

  if (hasShadow) {
    _.each(shadowPathPoints, (point, index) => {
      shadowPathDString += `${point.type} `;
      if (point.type === 'C') {
        const cp = point.cp;
        shadowPathDString += `${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} `;
      } else if (point.type === 'S') {
        const cp = point.cp;
        shadowPathDString += `${cp[1].x} ${cp[1].y} `;
      }
      shadowPathDString += `${point.x} ${point.y} `;
    });
  }

  let pathDString = '';

  _.each(pathPoints, (point, index) => {
    pathDString += `${point.type} `;
    if (point.type === 'C') {
      const cp = point.cp;
      pathDString += `${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} `;
    } else if (point.type === 'S') {
      const cp = point.cp;
      pathDString += `${cp[1].x} ${cp[1].y} `;
    }
    pathDString += `${point.x} ${point.y} `;
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
      {hasShadow && 
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
