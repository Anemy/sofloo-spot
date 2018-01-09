import _ from 'lodash';
import React from 'react';

import './index.css';

const ClipPath = props => {
  const {
    // id,
    // overMasks,
    points
  } = props;

  let pathDString = '';

  _.each(points, (point, index) => {
    if (point.type === 'C') {
      const cp = point.cp;
      pathDString += `C${cp[0].x} ${cp[0].y} ${cp[1].x} ${cp[1].y} ${point.x} ${point.y}`;
    } else if (index === 0) {
      pathDString += `M${point.x} ${point.y}`;
    } else {
      pathDString += `L${point.x} ${point.y}`;
    }
  });

  return (
    // <clipPath id={id}>
      <path d={pathDString} />
    //   {overMasks}
    // </clipPath>
  );
};

export default ClipPath;
