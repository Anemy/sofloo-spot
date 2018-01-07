
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

export const buildBezierControlPointsForCircleAt = (oX, oY, radius, x1, y1, x2, y2) => {
    // Visual to help understand bezier curves:
    // https://doc.babylonjs.com/how_to/how_to_use_curve3

    // https://en.wikipedia.org/wiki/Composite_B%C3%A9zier_curve#Approximating_circular_arcs

    // https://math.stackexchange.com/questions/873224/calculate-control-points-of-cubic-bezier-curve-approximating-a-part-of-a-circle
  
    let startAngle = Math.atan2(y1 - oY, x1 - oX);
    let stopAngle = Math.atan2(y2 - oY, x2 - oX);

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

    const controlPointDistance = Math.sqrt((zeroedCP1X * zeroedCP1X) + (zeroedCP1Y * zeroedCP1Y)); // + Math.random() * 50;

    return [{
      x: oX + Math.cos(cp1xAngle) * controlPointDistance,
      y: oY + Math.sin(cp1xAngle) * controlPointDistance
    }, {
      x: oX + Math.cos(cp2xAngle) * controlPointDistance,
      y: oY + Math.sin(cp2xAngle) * controlPointDistance
    }];
}