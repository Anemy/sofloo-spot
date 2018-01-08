import _ from 'lodash';
import React from 'react';

import './index.css';

const Path = props => {
  const {
    clip,
    clipId,
    id,
    points,
    shadowId,
    style
  } = props;

  let pathDString = '';

  _.each(points, point => {
    if (point.type === 'C') {
      const cp = point.cp;
      pathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    } else {
      pathDString += `${point.type || 'L'}${point.x} ${point.y}`;
    }
  });

  pathDString += 'Z';

  // Maybe end with a 'z'?

  if (clip) {
    return (
      <clipPath id={id}>
        <path
          d={pathDString}
          style={style}
        />
      </clipPath>
    );
  }

  return (
    <g
      id={id}
    >
      <path
        className={`step-path path-${id}`}
        clipPath={clipId ? `url(#${clipId})` : ''}
        d={pathDString}
        style={style}
      />
      {shadowId && 
        <path
          clipPath={clipId ? `url(#${clipId})` : ''}
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
