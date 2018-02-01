import {
  getStepColor
} from '../color';

import {
  copyPoint,
  copyPoints,
  createPathPoint,
  createStartPoint,
  getPointDeviation
} from './points';

function createTopologyStep(config, x, y, step, firstStepDeviation, previousStepClip, seeder) {
  const {
    amountOfSteps,
    colors,
    innerRadius,
    points,
    rotateEachStep,
    shapeRotation,
    sharedPointDeviation,
    stepLength,
    stepLengthDropOff
  } = config;

  const thisStepLengthDropoff = 1 - (((amountOfSteps - step) / amountOfSteps) * stepLengthDropOff);
  const thisStepLength = stepLength * thisStepLengthDropoff;

  const stepRadius = (step + 1) * thisStepLength + innerRadius;

  const isFirstStep = step === amountOfSteps - 1;

  const pathPoints = [];

  let firstDeviation;
  let nextDeviation; // We need a next to build basic bezier curves between points.
  let previousDeviation;

  const stepRotation = rotateEachStep * step + shapeRotation;

  for (let i = 0; i < points; i++) {
    const isFirstPoint = i === 0;

    const deviation = isFirstPoint ? getPointDeviation(config, step, previousDeviation, seeder) : copyPoint(nextDeviation);
    nextDeviation = i === points - 1 ? firstDeviation : getPointDeviation(config, step, previousDeviation, seeder);

    if (sharedPointDeviation && isFirstStep) {
      firstStepDeviation.push(deviation);
    }

    if (isFirstPoint) {
      pathPoints.push(createStartPoint(stepRadius, stepRotation, deviation, x, y));
      firstDeviation = deviation;
    }

    const pathPoint = createPathPoint(config, pathPoints[pathPoints.length - 1], stepRadius, i, stepRotation, deviation, nextDeviation, x, y);
    pathPoints.push(pathPoint);
  }

  // Translate the step to the center.
  for (let i = 0; i < pathPoints.length; i++) {
    pathPoints[i].x += x;
    pathPoints[i].y += y;

    if (i !== 0) {
      pathPoints[i].cp[0].x += x;
      pathPoints[i].cp[0].y += y;
      pathPoints[i].cp[1].x += x;
      pathPoints[i].cp[1].y += y;
    }
  }

  return {
    // When it isn't the first step we want to use the last step as the clip layer mask.
    clipPoints: isFirstStep ? [] : copyPoints(previousStepClip),
    color: getStepColor(step, amountOfSteps, colors),
    hasShadow: false,
    id: step,
    pathPoints: pathPoints
  };
}

export function buildTopologySteps(config, seeder) {
  const {
    amountOfSteps,
    centerX,
    centerY,
    stepCenterDeviationDropOff,
    stepCenterDeviationX,
    stepCenterDeviationY
  } = config;

  const steps = [];

  const firstStepDeviation = [];
  let previousStepClip = [];
  
  for (let i = amountOfSteps - 1; i >= 0; i--) {
    const stepCenterDeviationDropOffAmount = 1 - (((amountOfSteps - i) / amountOfSteps) * stepCenterDeviationDropOff);

    const stepX = centerX + (((amountOfSteps - i) * stepCenterDeviationX) * stepCenterDeviationDropOffAmount);
    const stepY = centerY + (((amountOfSteps - i) * stepCenterDeviationY) * stepCenterDeviationDropOffAmount);

    const step = createTopologyStep(config, stepX, stepY, i, firstStepDeviation, previousStepClip, seeder);
    
    if (!step) {
      break;
    }

    previousStepClip = step.pathPoints;
    
    steps.push(step);
  }

  console.log('built topology steps', steps);

  return steps;
}
