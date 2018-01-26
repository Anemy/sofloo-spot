import _ from 'lodash';
import MersenneTwister from 'mersennetwister';

// TODO: Use this lib and not clipper for polygon boolean operation.
// import greinerHormann from 'greiner-hormann';

import {
  createRandomSeed,
  // floorRandomNegate
} from '../utils';

import {
  generateRandomShapeConfig
} from './shapes';

import {
  generateInitialShape
} from '../utils/shapeFixtures';

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
  if (points && _.isArray(points[0])) {
    const newPoints = [];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      newPoints[i] = [];

      for (let k = 0; k < points[i].length; k++) {
        newPoints[i][k].push({
          x: point.X,
          y: point.Y
        });
      }
    }

    return newPoints;
  } else {
    const newPoints = [];

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      newPoints.push({
        x: point.X,
        y: point.Y
      });
    }

    return newPoints;
  }
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

// TODO: This is a hack that can be used to draw two polygons using one path...
// Maybe we should use it for the many shapes?
export const createPixelBridges = (pathArray) => {
  // console.log('pathArray len', pathArray.length);
  if (!pathArray) {
    // console.log('!');
    return [];
  }

  if (pathArray.length <= 1) {
    // console.log('1');
    return pathArray[0];
  }

  const newPathArray = [];
  let connectIndex = [];
  for(let i = 0; i < pathArray.length; i++) {
    // console.log('i', i, pathArray[i]);
    for (let k = 0; k < pathArray[i].length; k++) {
      // if (i !== 0 && k === 0) {
      //   // Perform initial bridge
      //   newPathArray.push();
      // }

      // console.log(i, k, ':', pathArray[i][k]);

      newPathArray.push(pathArray[i][k]);
      
      if (k === pathArray[i].length - 1) {
        if (i === 0) {
          connectIndex = pathArray[i][k];
        } else {
          // Connect bridge to end.
          newPathArray.push(connectIndex);
        }
      }
    }
  }

  return newPathArray;
}

export const generateRandomLayout = (width, height, layoutOptions) => {
  const options = layoutOptions || {};

  const layoutSeed = options.layoutSeed ? options.layoutSeed : createRandomSeed();
  const seeder = new MersenneTwister(layoutSeed);

  const amountOfShapes = 1;

  // TODO: We want to allow more shapes to help build one big view.

  const shapesToCombine = [];

  const baseShape = options.isFirstGen ? generateInitialShape(width, height, seeder) : generateRandomShapeConfig(width, height, seeder);

  const shapeSteps = [];
  // This part of the if is expiremental (broken ;)
  if (amountOfShapes > 1) {
    for (let i = 0; i < amountOfShapes; i++) {
      const shapeConfig = {
        ...baseShape,
        centerX: baseShape.centerX + Math.floor(seeder.rnd() * (width / 6)),
        centerY: baseShape.centerY + Math.floor(seeder.rnd() * (height / 6))
      };
  
      const steps = buildSteps(shapeConfig, seeder);
  
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
          stepColor = shapesToCombine[i][step].color;

          continue;
        } else if (shapesToCombine[i][step] && shapesToCombine[i][step].clipPoints) {
          // Combine the points!
          const clipPointsToAdd = getXYPointsfromxyPoints(shapesToCombine[i][step].clipPoints);
          const newClipPoints = combinePaths(aggregateClipPoints, clipPointsToAdd, ClipperLib.ClipType.ctIntersection);// ClipperLib.ClipType.ctUnion);

          const pathPointsToAdd = getXYPointsfromxyPoints(shapesToCombine[i][step].pathPoints);
          const newPathPoints = combinePaths(aggregatePathPoints, pathPointsToAdd, ClipperLib.ClipType.ctIntersection);// ClipperLib.ClipType.ctUnion);
        
          console.log('newClipPoints', newClipPoints);
          console.log('newPathPoints', newPathPoints);

          // TODO: This might mess up...
          aggregateClipPoints = newClipPoints[0];
          aggregatePathPoints = newPathPoints[0]; // 2d array?!
        
          if (!aggregateClipPoints) {
            break;
          }

          console.log('aggregateClipPoints', aggregateClipPoints);
          console.log('aggregatePathPoints', aggregatePathPoints);
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
    steps: (amountOfShapes > 1) ? shapeSteps : buildSteps(baseShape, seeder)
  }];

  return {
    height,
    isFirstGen: false,
    layoutSeed,
    shapes,
    width
  }
};