import {
  createRandomSeed,
  floorRandomNegate
} from '../utils';

import {
  generateRandomShapeConfig
} from './shapes';

import {
  buildSteps
} from './steps';

const getXYPointsfromxyPoints = points => {
  const newPoints = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    newPoints.push({
      X: point.x,
      Y: point.y
    });
  }

  return newPoints;
};

const getxyPointsfromXYPoints = points => {
  const newPoints = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    newPoints.push({
      x: point.X,
      y: point.Y
    });
  }

  return newPoints;
};

const ClipperLib = window.ClipperLib;
const combinePaths = (firstPath, secondPath, excecutionType) => {
  const clipSolution = new ClipperLib.Paths();
  const clipper = new ClipperLib.Clipper();

  // NOTE: If these arrays contain NaN then it will infinite loop.
  clipper.AddPath(firstPath, ClipperLib.PolyType.ptSubject, true);
  clipper.AddPath(secondPath, ClipperLib.PolyType.ptClip, true);
  // ClipperLib.ClipType.ctIntersection ctUnion ctDifference ctXor
  clipper.Execute(excecutionType, clipSolution);

  return clipSolution;
};

export const generateRandomLayout = (width, height) => {
  const amountOfShapes = 4;

  const shapesToCombine = [];

  const baseShape = generateRandomShapeConfig(width, height);

  const shapeSteps = [];
  if (amountOfShapes > 1) {
    for (let i = 0; i < amountOfShapes; i++) {
      const shapeConfig = {
        ...baseShape,
        centerX: baseShape.centerX + floorRandomNegate(width / 8),
        centerY: baseShape.centerY + floorRandomNegate(height / 8)
      };
  
      const steps = buildSteps(shapeConfig);
  
      shapesToCombine.push(steps);

      // TODO: Do the shape additions here to be performant. ?
    }
    // let pathPoints = shapesToCombine[0][i].pathPoints;
    // let clipPoints = shapesToCombine[0][i].clipPoints;
    // TODO: We could speed up this algo a lot.
    let step = 0;
    while(true) {
      // Stored in XY for use in with clipper lib.
      let aggregateClipPoints = [];
      let aggregatePathPoints = [];
      let stepColor = '';

      for(let i = 0; i < amountOfShapes; i++) {
        if (aggregateClipPoints.length === 0 && shapesToCombine[i][step] && shapesToCombine[i][step].clipPoints) {
          // const clipPointsToAdd = getXYPointsfromxyPoints(shapesToCombine[i][step].clipPoints);
          aggregateClipPoints = getXYPointsfromxyPoints(shapesToCombine[i][step].clipPoints);

          // const pathPointsToAdd = getXYPointsfromxyPoints(shapesToCombine[i][step].pathPoints);
          aggregatePathPoints = getXYPointsfromxyPoints(shapesToCombine[i][step].pathPoints);
          console.log('color wtf', shapesToCombine[i][step].color);
          stepColor = shapesToCombine[i][step].color;

          continue;
        } else if (shapesToCombine[i][step] && shapesToCombine[i][step].clipPoints) {
          // Combine the points!
          const clipPointsToAdd = getXYPointsfromxyPoints(shapesToCombine[i][step].clipPoints);
          const newClipPoints = combinePaths(aggregateClipPoints, clipPointsToAdd, ClipperLib.ClipType.ctUnion);

          const pathPointsToAdd = getXYPointsfromxyPoints(shapesToCombine[i][step].pathPoints);
          const newPathPoints = combinePaths(aggregatePathPoints, pathPointsToAdd, ClipperLib.ClipType.ctUnion);
        
          // TODO: This might mess up...
          aggregateClipPoints = newClipPoints[0];
          aggregatePathPoints = newPathPoints[0]; // 2d array?!
        }
      }

      if (!aggregateClipPoints || aggregateClipPoints.length === 0) {
        // No path was found to draw - let's get out!
        break;
      }

      const xyClipPoints = getxyPointsfromXYPoints(aggregateClipPoints);
      const xyPathPoints = getxyPointsfromXYPoints(aggregatePathPoints);

      shapeSteps.push({
        clipPoints: xyClipPoints,
        color: stepColor,
        id: step,
        pathPoints: xyPathPoints
      });

      step++;
    }
  }

  const shapes = [{
    ...baseShape,
    steps: (amountOfShapes > 1) ? shapeSteps : buildSteps(baseShape)
  }];

  return {
    height,
    layoutSeed: createRandomSeed(),
    shapes,
    width
  }
};