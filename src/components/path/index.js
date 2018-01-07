import _ from 'lodash';
import React from 'react';

const Path = props => {
  const {
    pathId,
    points,
    shadowId,
    style
  } = props;

  let pathDString = '';

  _.each(points, point => {
    if (!point.type || point.type === 'M') {
      pathDString += `M${point.x} ${point.y}`;
    } else if (point.type === 'C') {
      const cp = point.cp;
      pathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    }
    
  });

  // Maybe end with a 'z'?

  return (
    <g
      id={pathId}
    >
      <path
        d={pathDString}
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
