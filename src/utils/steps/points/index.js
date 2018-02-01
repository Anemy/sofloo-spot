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
    pointDeviationChance,
    pointDeviationMaxX,
    pointDeviationMaxY,
    previousPointDeviationInfluence
  } = config;

  const pointDeviationX = seeder.rnd() * pointDeviationMaxX - seeder.rnd() * pointDeviationMaxX;
  const pointDeviationY = seeder.rnd() * pointDeviationMaxY - seeder.rnd() * pointDeviationMaxY;    

  const hasDeviation = Math.floor(seeder.rnd() * pointDeviationChance) === 0;

  const deviation = {
    x: hasDeviation ? pointDeviationX : 0,
    y: hasDeviation ? pointDeviationY : 0
  };

  if (previousPointDeviationInfluence) {
    deviation.x += previousDeviation.x;
    deviation.y += previousDeviation.y;
  }

  return deviation;
}

function createBezierControlPointsForCircleAt (radius, x1, y1, x2, y2) {
  let startAngle = Math.atan2(y1, x1);
  let stopAngle = Math.atan2(y2, x2);

  const circleOffset = startAngle > stopAngle ? (Math.PI * 2) : 0;
  let halfOfAngle = Math.abs(circleOffset + (stopAngle - startAngle)) / 2;

  halfOfAngle = halfOfAngle % (Math.PI * (3 / 4));

  const normalizedP1X = radius * Math.cos(halfOfAngle);
  const normalizedP1Y = -(radius * Math.sin(halfOfAngle));

  const zeroedCP1X = ((4 * radius) - normalizedP1X) / 3;
  const zeroedCP1Y = ((radius - normalizedP1X) * ((3 * radius) - normalizedP1X)) / (3 * normalizedP1Y);

  const zeroedCP2X = zeroedCP1X;
  const zeroedCP2Y = -zeroedCP1Y;

  // Rotate the control points to their offset.
  let cp1Angle = Math.atan2(zeroedCP1Y, zeroedCP1X);
  let cp2Angle = Math.atan2(zeroedCP2Y, zeroedCP2X);

  cp1Angle += startAngle + halfOfAngle;
  cp2Angle += startAngle + halfOfAngle;

  const cp1Distance = Math.sqrt((zeroedCP1X * zeroedCP1X) + (zeroedCP1Y * zeroedCP1Y));
  const cp2Distance = Math.sqrt((zeroedCP2X * zeroedCP2X) + (zeroedCP2Y * zeroedCP2Y));

  return [{
    x: Math.cos(cp1Angle) * cp1Distance,
    y: Math.sin(cp1Angle) * cp1Distance
  }, {
    x: Math.cos(cp2Angle) * cp2Distance,
    y: Math.sin(cp2Angle) * cp2Distance
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
    return {
      cp: createBezierControlPointsForCircleAt(radius, previousPoint.x, previousPoint.y, x, y),
      type: point === 0 ? 'C' : 'S',
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
