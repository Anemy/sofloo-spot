import {
  getStepColor
} from '../color';

import {
  createStartPoint
} from './points';

const createPathPoint = (radius, point, points, rotate, deviation, firstDeviation) => {
  const stopAngle = 2 * Math.PI * ((point + 1) / points) + rotate;

  const isLastPoint = point === points - 1;

  const stopx = (Math.cos(stopAngle) * radius) + (isLastPoint ? firstDeviation.x : deviation.x);
  const stopy = (Math.sin(stopAngle) * radius) + (isLastPoint ? firstDeviation.y : deviation.y);

  return {
    type: 'L',
    x: stopx,
    y: stopy
  };
};

// TODO: Clean this up - it's ugly code XD
export function buildSteps({
  amountOfSteps,
  centerX,
  centerY,
  colors,
  innerRadius,
  pointDeviationChance,
  pointDeviationMaxX,
  pointDeviationMaxY,
  points,
  previousPointDeviationInfluence,
  rotateEachStep,
  shadowOpacity,
  shapeRotation,
  sharedPointDeviation,
  stepCenterDeviationDropOff,
  stepCenterDeviationX,
  stepCenterDeviationY,
  stepLength,
  stepLengthDropOff
}, seeder) {
  const steps = [];

  let futureElementsAreHidden = false;

  const pointDeviations = [];

  const buildStep = (x, y, step) => {
    const thisStepLengthDropoff = 1 - (((amountOfSteps - step) / amountOfSteps) * stepLengthDropOff);
    const thisStepLength = stepLength * thisStepLengthDropoff;

    const radius = (step + 1) * thisStepLength + innerRadius;

    const isFirstStep = step === amountOfSteps - 1;

    const pathPoints = [];

    const firstDeviation = {
      x: 0,
      y: 0
    };

    const previousDeviation = {
      x: 0,
      y: 0
    };

    const rotate = rotateEachStep * step + shapeRotation;

    for (let i = 0; i < points; i++) {
      const pointDeviationX = seeder.rnd() * pointDeviationMaxX - seeder.rnd() * pointDeviationMaxX;
      const pointDeviationY = seeder.rnd() * pointDeviationMaxY - seeder.rnd() * pointDeviationMaxY;

      // TODO: Move the deviation code into another function.
      // &: Write something that helps make sure it doesn't generatie shapes which overlap on themselves.
      // ^ Maybe just simplify the polygon later.
      const hasDeviation = Math.floor(seeder.rnd() * pointDeviationChance) === 0;
      const deviation = {
        x: hasDeviation ? pointDeviationX : 0,
        y: hasDeviation ? pointDeviationY : 0
      };

      if (previousPointDeviationInfluence) {
        deviation.x += previousDeviation.x;
        deviation.y += previousDeviation.y;

        // Come back to the origin when we're past the half point.
        // This prevents it making a sharp edge back to the starting location when it goes full circle.
        if (i > points - (points / 4)) {
          const realClose = i > points - (points / 12);

          if (Math.abs(pointDeviationMaxX) > 0 &&
            ((pointDeviationX < 0 && previousDeviation.x > 0) || (pointDeviationX > 0 && previousDeviation.x < 0))) {
            const undeviateX = pointDeviationX / 2;

            deviation.x += undeviateX * (realClose ? 4 : 1);
          }

          if (Math.abs(pointDeviationMaxY) > 0 &&
            ((pointDeviationY < 0 && previousDeviation.y > 0) || (pointDeviationY > 0 && previousDeviation.y < 0))) {
            const undeviateY = pointDeviationY / 2;

            deviation.y += undeviateY * (realClose ? 4 : 1);
          }
        }
      }

      if (sharedPointDeviation && isFirstStep) {
        pointDeviations.push(deviation);
      }

      if (i === 0) {
        firstDeviation.x = deviation.x;
        firstDeviation.y = deviation.y;

        pathPoints.push(createStartPoint(radius, rotate, sharedPointDeviation ? pointDeviations[0] : deviation));
      }

      if (sharedPointDeviation) {
        // NOTE: `createPathPoint` is a local function.
        pathPoints.push(createPathPoint(
          radius,
          i,
          points,
          rotate,
          pointDeviations[i],
          pointDeviations[0]
        ));
      } else {
        // NOTE: `createPathPoint` is a local function.
        pathPoints.push(createPathPoint(
          radius,
          i,
          points,
          rotate,
          deviation,
          firstDeviation
        ));
      }

      previousDeviation.x = deviation.x;
      previousDeviation.y = deviation.y;
    }

    // Translate the step to the center.
    for (let i = 0; i < pathPoints.length; i++) {
      pathPoints[i].x += x;
      pathPoints[i].y += y;

      pathPoints[i].x = Math.floor(pathPoints[i].x);
      pathPoints[i].y = Math.floor(pathPoints[i].y);
    }

    const pathPointsForClip = [];

    for (let i = pathPoints.length - 1; i >= 0; i--) {
      const point = pathPoints[i];

      pathPointsForClip.push({
        type: i === pathPoints.length - 1 ? 'M' : 'L',
        x: point.x,
        y: point.y
      });
    }

    steps.push({
      clipPoints: pathPointsForClip,
      color: getStepColor(step, amountOfSteps, colors),
      hasShadow: shadowOpacity > 0.1,
      id: step,
      pathPoints: pathPoints
    });
  };

  for (let i = amountOfSteps - 1; i >= 0; i--) {
    const stepCenterDeviationDropOffAmount = 1 - (((amountOfSteps - i) / amountOfSteps) * stepCenterDeviationDropOff);

    const stepCenterX = centerX + (((amountOfSteps - i) * stepCenterDeviationX) * stepCenterDeviationDropOffAmount);
    const stepCenterY = centerY + (((amountOfSteps - i) * stepCenterDeviationY) * stepCenterDeviationDropOffAmount);

    buildStep(stepCenterX, stepCenterY, i);

    if (futureElementsAreHidden) {
      break;
    }
  }

  return steps;
}
