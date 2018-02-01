import _ from 'lodash';
import React from 'react';

import './index.css';

const ClipPath = props => {
  const {
    points
  } = props;

  let pathDString = '';

  _.each(points, (point, index) => {
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

  return <path d={pathDString} />;
};

export default ClipPath;
