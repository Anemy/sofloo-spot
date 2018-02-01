import {
  getStepColor
} from '../color';

import {
  createStartPoint
} from './points';

// TODO: Don't use this lib.
// https://sourceforge.net/p/jsclipper/wiki/documentation/#clipperlibcliptype
const ClipperLib = window.ClipperLib;

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

function getXYPointsfromxyPoints(points) {
  const newPoints = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    newPoints.push({
      X: point.x,
      Y: point.y
    });
  }

  return newPoints;
}

// TODO: Clean this up - it's ugly code XD
export function buildSteps({
  amountOfSteps,
  centerX,
  centerY,
  colors,
  innerRadius,
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

  let clippingFilterPoints = ClipperLib.Paths();

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

      const deviation = {
        x: pointDeviationX,
        y: pointDeviationY
      };

      if (previousPointDeviationInfluence) {
        deviation.x += previousDeviation.x;
        deviation.y += previousDeviation.y;

        // Come back to the origin when we're past the half point.
        // This prevents it making a sharp edge back to the starting location when it goes full circle.
        if (i > points - (points / 4)) {
          const realClose = i > points - (points / 12);

          if (Math.abs(pointDeviationMaxX) > 0 && 
            ((pointDeviationX < 0 && previousDeviation.x > 0) || (pointDeviationX > 0 && previousDeviation.x < 0)))
          {
            const undeviateX = pointDeviationX / 2;

            deviation.x += undeviateX * (realClose ? 4 : 1);
          }

          if (Math.abs(pointDeviationMaxY) > 0 && 
            ((pointDeviationY < 0 && previousDeviation.y > 0) || (pointDeviationY > 0 && previousDeviation.y < 0)))
          {
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
    }

    const pathPointsForClip = [];

    if (isFirstStep) {
      for (let i = pathPoints.length - 1; i >= 0; i--) {
        const point = pathPoints[i];

        pathPointsForClip.push({
          type: i === pathPoints.length - 1 ? 'M' : 'L',
          x: point.x,
          y: point.y
        });
      }
    } else {
      const pointsToAddToClip = getXYPointsfromxyPoints(pathPoints);

      const clipSolution = new ClipperLib.Paths();
      const c = new ClipperLib.Clipper();

      // NOTE: If these arrays contain NaN then it will infinite loop.
      c.AddPath(pointsToAddToClip, ClipperLib.PolyType.ptSubject, true);
      c.AddPath(clippingFilterPoints, ClipperLib.PolyType.ptClip, true);
      c.Execute(ClipperLib.ClipType.ctIntersection, clipSolution);

      if (clipSolution && clipSolution.length > 0) {
        clippingFilterPoints.length = 0;
        for(let i = 0; i < clipSolution[0].length; i++) {
          clippingFilterPoints[i] = {
            X: clipSolution[0][i].X,
            Y: clipSolution[0][i].Y
          };
        }
      } else {
        futureElementsAreHidden = true;
      }

      // TODO: Simplify polygons and account for splitting.
      // const after = ClipperLib.Clipper.SimplifyPolygons([clippingFilterPoints], ClipperLib.PolyFillType.pftNonZero)[0];
      // pftNonZero or pftEvenOdd

      for (let i = clippingFilterPoints.length - 1; i >= 0; i--) {
        const point = clippingFilterPoints[i];

        pathPointsForClip.push({
          type: i === clippingFilterPoints.length - 1 ? 'M' : 'L',
          x: point.X,
          y: point.Y
        });
      }
    }

    for (let i = 0; i < pathPointsForClip.length; i++) {
      const point = isFirstStep ? pathPoints[i] : pathPointsForClip[i];

      clippingFilterPoints[i] = {
        X: point.x,
        Y: point.y
      }
    }

    steps.push({
      clipPoints: pathPointsForClip,
      color: getStepColor(step, amountOfSteps, colors),
      hasShadow: shadowOpacity > 0,
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
