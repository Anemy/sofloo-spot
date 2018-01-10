export * from './color';

export const floorRandom = max => Math.floor(Math.random() * max);

const defaultSeedRange = 5000;
export const createRandomSeed = (range, existingSeed) => {
  let randomRange = (range === undefined) ? defaultSeedRange : range;

  let seed = floorRandom(randomRange);

  if (existingSeed !== undefined) {
    while (seed === existingSeed && range > 2) {
      seed = floorRandom(randomRange);
    }
  }

  return seed;
}

export const toDeg = angle => angle * (180/Math.PI);

export const buildBezierControlPointsForCircleAt = (radius, x1, y1, x2, y2) => {
    // Visual to help understand bezier curves:
    // https://doc.babylonjs.com/how_to/how_to_use_curve3

    // https://en.wikipedia.org/wiki/Composite_B%C3%A9zier_curve#Approximating_circular_arcs

    // https://math.stackexchange.com/questions/873224/calculate-control-points-of-cubic-bezier-curve-approximating-a-part-of-a-circle
  
    let startAngle = Math.atan2(y1, x1);
    let stopAngle = Math.atan2(y2, x2);

    // console.log('start, stop angles', toDeg(startAngle), toDeg(stopAngle));

    const circleOffset = startAngle > stopAngle ? (Math.PI * 2) : 0;
    const halfOfAngle = Math.abs(circleOffset + (stopAngle - startAngle)) / 2;

    // console.log('difference:', toDeg(halfOfAngle) * 2);

    const otherR = radius;
    const normalizedP1X = otherR * Math.cos(halfOfAngle);
    const normalizedP1Y = otherR * Math.sin(halfOfAngle);

    // console.log('zeroed points:', normalizedP1X, normalizedP1Y);

    const zeroedCP1X = (4 * otherR - normalizedP1X) / 3;
    const zeroedCP1Y = -((1 * otherR - normalizedP1X) * (3 * otherR - normalizedP1X)) / (3 * normalizedP1Y);

    const zeroedCP2X = zeroedCP1X;
    const zeroedCP2Y = -zeroedCP1Y;

    // Rotate the control points to their offset.
    let cp1xAngle = Math.atan2(zeroedCP1Y, zeroedCP1X);
    let cp2xAngle = Math.atan2(zeroedCP2Y, zeroedCP2X);

    // TODO: We might have to normalize the negative degree created from ^

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

export const createStartPoint = (radius, rotate, deviation) => {
  const startAngle = rotate;

  const startx = Math.cos(startAngle) * radius + deviation.x;
  const starty = Math.sin(startAngle) * radius + deviation.y;

  return {
    x: startx,
    y: starty
  }
}

export const createPathPoint = (radius, point, points, rotate, circleBase, previousDeviation, deviation, firstDeviation) => {
  const startAngle = 2 * Math.PI * (point / points) + rotate;
  const stopAngle = 2 * Math.PI * ((point + 1) / points) + rotate;

  const startx = (Math.cos(startAngle) * radius) + previousDeviation.x || 0;
  const starty = (Math.sin(startAngle) * radius) + previousDeviation.y || 0;

  const isLastPoint = point === points - 1;

  const stopx = (Math.cos(stopAngle) * radius) + (isLastPoint ? firstDeviation.x : deviation.x);
  const stopy = (Math.sin(stopAngle) * radius) + (isLastPoint ? firstDeviation.y : deviation.y);

  if (circleBase) {
    const cp = buildBezierControlPointsForCircleAt(radius, startx, starty, stopx, stopy);

    return {
      type: 'C',
      cp: cp,
      x: stopx,
      y: stopy
    };
  } else {
    return {
      type: 'L',
      x: stopx,
      y: stopy
    }
  }
};

export const pointInPolyon = (point, vs) => {
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
};

// Color Bound.
const cb = color => Math.min(Math.max(Math.floor(color), 0), 255);

// export const getStepColor = (step, steps, colors) => {
//   // let r = 0;
//   // let b = 0;
//   // let g = 0;
//   // let a = 0;

//   const amountOfColors = colors.length;

//   // const transition = 

//   // const r = cb(Math.random() * 255);
//   // const g = cb(Math.random() * 255);
//   // const b = cb(Math.random() * 255);

//   const percentage = step / (steps - 1);

//   console.log(step, 'colors:', colors, Math.max(Math.floor(percentage * amountOfColors) - 1, 0), Math.min(Math.ceil(percentage * amountOfColors), amountOfColors - 1), percentage)

//   const previousColor = colors[Math.max(Math.floor(percentage * amountOfColors) - 1, 0)];
//   const nextColor = colors[Math.min(Math.ceil(percentage * amountOfColors), amountOfColors - 1)]; // Maybe - 1

//   console.log('prev', previousColor, 'next', nextColor);

//   console.log('dif', ((nextColor.r - previousColor.r) * (percentage % 1)));
//   console.log('per', percentage % 1);

//   const r = cb(previousColor.r + ((nextColor.r - previousColor.r) * (percentage % 1)));
//   const g = cb(previousColor.g + ((nextColor.g - previousColor.g) * (percentage % 1)));
//   const b = cb(previousColor.b + ((nextColor.b - previousColor.b) * (percentage % 1)));


//   const a = cb(previousColor.a + ((nextColor.a - previousColor.a) * (percentage % 1)));

//   console.log('color:', `rgba(${r}, ${b}, ${g}, ${a})`);

//   return `rgba(${r}, ${b}, ${g}, ${a})`;
// }