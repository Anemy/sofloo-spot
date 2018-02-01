export function createStartPoint(radius, rotate, deviation) {
  const startAngle = rotate;

  const startx = Math.cos(startAngle) * radius + deviation.x;
  const starty = Math.sin(startAngle) * radius + deviation.y;

  return {
    type: 'M',
    x: startx,
    y: starty
  }
}

// TODO: Remove? Unused?
export function pointInPolyon(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  
  const x = point.x;
  const y = point.y;
  
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x;
    const yi = vs[i].y;
    const xj = vs[j].x;
    const yj = vs[j].y;
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  
  return inside;
}

export function copyPoint(toCopy) {
  const copy = {
    x: toCopy.x,
    y: toCopy.y
  };

  if (toCopy.cp) {
    copy.cp = [{
      x: toCopy.cp[0].x,
      y: toCopy.cp[0].y
    }, {
      x: toCopy.cp[1].x,
      y: toCopy.cp[1].y
    }];
  }

  return copy;
}

export function copyPoints(toCopy) {
  const copy = [];
  
  for (let i = toCopy.length - 1; i >= 0; i--) {
    const point = toCopy[i];

    copy[i] = {
      x: point.x,
      y: point.y
    };

    if (point.type) {
      copy[i].type = point.type;
    }

    if (point.cp) {
      copy[i].cp = [{
        x: point.cp[0].x,
        y: point.cp[0].y
      }, {
        x: point.cp[1].x,
        y: point.cp[1].y
      }];
    }
  }

  return copy;
}

// TODO: We should bring in first deviation and allow a smooth transfer from the last point back to first.
export function getPointDeviation(config, step, previousDeviation, seeder) {
  const {
    pointDeviationMaxX,
    pointDeviationMaxY,
    previousPointDeviationInfluence
  } = config;

  const pointDeviationX = seeder.rnd() * pointDeviationMaxX - seeder.rnd() * pointDeviationMaxX;
  const pointDeviationY = seeder.rnd() * pointDeviationMaxY - seeder.rnd() * pointDeviationMaxY;    

  const deviation = {
    x: pointDeviationX,
    y: pointDeviationY
  };

  if (previousPointDeviationInfluence && previousDeviation) {
    deviation.x += previousDeviation.x;
    deviation.y += previousDeviation.y;
  }

  return deviation;
}

// TODO: This can be sped up.
function createBezierControlPointsForCircleAt (radius, x1, y1, x2, y2) {
  // Visual to help understand bezier curves:
  // https://doc.babylonjs.com/how_to/how_to_use_curve3

  // https://en.wikipedia.org/wiki/Composite_B%C3%A9zier_curve#Approximating_circular_arcs

  // https://math.stackexchange.com/questions/873224/calculate-control-points-of-cubic-bezier-curve-approximating-a-part-of-a-circle

  let startAngle = Math.atan2(y1, x1);
  let stopAngle = Math.atan2(y2, x2);

  const circleOffset = startAngle > stopAngle ? (Math.PI * 2) : 0;
  const halfOfAngle = Math.abs(circleOffset + (stopAngle - startAngle)) / 2;

  const calculatedRadius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) / 2;
  const otherR = calculatedRadius;
  const normalizedP1X = otherR * Math.cos(halfOfAngle);
  const normalizedP1Y = otherR * Math.sin(halfOfAngle);

  const zeroedCP1X = (4 * otherR - normalizedP1X) / 3;
  const zeroedCP1Y = -((1 * otherR - normalizedP1X) * (3 * otherR - normalizedP1X)) / (3 * normalizedP1Y);

  const zeroedCP2X = zeroedCP1X;
  const zeroedCP2Y = -zeroedCP1Y;

  // Rotate the control points to their offset.
  let cp1xAngle = Math.atan2(zeroedCP1Y, zeroedCP1X);
  let cp2xAngle = Math.atan2(zeroedCP2Y, zeroedCP2X);

  cp1xAngle += startAngle + halfOfAngle;
  cp2xAngle += startAngle + halfOfAngle;

  const randomNess = 0;
  const deviation = Math.random() * randomNess + Math.random() * -randomNess;
  const controlPointDistance = Math.sqrt((zeroedCP1X * zeroedCP1X) + (zeroedCP1Y * zeroedCP1Y)) + deviation;

  return [{
    x: Math.cos(cp1xAngle) * controlPointDistance,
    y: Math.sin(cp1xAngle) * controlPointDistance
  }, {
    x: Math.cos(cp2xAngle) * controlPointDistance,
    y: Math.sin(cp2xAngle) * controlPointDistance
  }];
}

export function createPathPoint(config, previousPoint, radius, point, rotation, deviation, nextDeviation) {
  const {
    points,
    isCurve
  } = config;

  const stopAngle = 2 * Math.PI * ((point + 1) / points) + rotation;

  const isLastPoint = point === points - 1;

  const xDeviation = isLastPoint ? nextDeviation.x : deviation.x;
  const x = (Math.cos(stopAngle) * radius) + xDeviation;
  const yDeviation = isLastPoint ? nextDeviation.y : deviation.y;
  const y = (Math.sin(stopAngle) * radius) + yDeviation;

  if (isCurve) {
    // TODO: Use `S` to mirror the control point!
    const controlPoints = createBezierControlPointsForCircleAt(radius, previousPoint.x, previousPoint.y, x, y);

    // controlPoints[0].x += xDeviation;
    // controlPoints[0].y += yDeviation;
    // controlPoints[1].x += xDeviation;
    // controlPoints[1].y += yDeviation;

    return {
      cp: controlPoints,
      type: 'C',
      x,
      y
    };
  }

  return {
    type: 'L',
    x,
    y
  };
}
