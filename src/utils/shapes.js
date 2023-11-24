import {
  createColorString,
  createRandomColors,
  createRandomColor,
  getRandomGradientPackColors,
  whiteToBlack
} from './color';

import {
  buildSteps,
  buildTopologySteps
} from './steps';

function generateRandomGradientDirection(seeder) {
  const floorRandom = rnd => Math.floor(seeder.rnd() * (rnd ? rnd : 1));

  const x1 = 100 * floorRandom(2);
  const y1 = 100 * floorRandom(2);
  let y2 = 100 * floorRandom(2);
  const x2 = 100 * floorRandom(2);

  // When a gradient wasn't really made we just make it vertical.
  if (x1 === x2 && y1 === y2) {
    y2 = 100 - y1;
  }

  return {
    x1,
    y1,
    x2,
    y2
  };
}

function generateRandomShadowConfig(seeder, shapeOptions) {
  const options = { ...shapeOptions };

  if (options.disableShadow) {
    return {
      hasShadow: false
    };
  }

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range);

  const blackBasedShadow = options.blackAndWhite || floorRandom(2) === 1;
  const shadowColor = blackBasedShadow ? `rgba(${0}, ${0}, ${0}, ${1})` : createColorString(createRandomColor(seeder));

  let shadowOpacity = Math.floor(seeder.rnd() * 4) === 0 ? 0 : seeder.rnd().toFixed(2);

  return {
    hasShadow: shadowOpacity > 0,
    randomShadow: false,
    shadowBlur: floorRandom(10),
    shadowColor,
    shadowInset: true,
    shadowOffsetX: floorRandomNegate(40),
    shadowOffsetY: floorRandomNegate(40),
    shadowOpacity
  };
};

const generateRandomShapeConfig = (width, height, seeder, shapeOptions) => {
  const options = {
    ...shapeOptions
  };

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range);

  const maxPoints = 500;
  let points = 3 + floorRandom(floorRandom(3) === 1 ? maxPoints : 9); // 1 / 5 chance for possibly many points.
  if (options.triangleMode) {
    points = 3;
    options.gradientColor = floorRandom(4) === 0;
    options.gradientPack = floorRandom(4) === 0;
  }
  const amountOfSteps = 2 + (100 - Math.floor(Math.pow(100, seeder.rnd())));

  const maxColorRandom = {
    r: floorRandom(12) === 1 ? 0 : 255,
    g: floorRandom(12) === 1 ? 0 : 255,
    b: floorRandom(12) === 1 ? 0 : 255,
    a: 1
  };

  const randomColorOptions = {
    maxColorRandom,
    blackAndWhite: options.blackAndWhite || floorRandom(20) === 1
  };

  // 1/10 random color for each step, otherwise gradient a few colors.
  const amountOfColors = floorRandom(10) === 1 ? amountOfSteps : 2 + floorRandom(3);

  const stepCenterMaxDeviationX = floorRandom(4) === 1 ? 0 : 30;
  const stepCenterMaxDeviationY = floorRandom(4) === 1 ? 0 : 30;

  // 1 / 2 chance for no deviation.
  const maxPointDeviation = floorRandom(3) === 1 ? 0 : Math.max(60 - (points / 20), 0);

  const innerRadius = floorRandom(window.innerHeight / 8);

  const colors = options.gradientPack ? getRandomGradientPackColors(seeder) : createRandomColors(amountOfColors, randomColorOptions, seeder);

  return {
    ...generateRandomShadowConfig(seeder, options),
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors,
    gradientColor: options.gradientColor,
    gradientDirection: generateRandomGradientDirection(seeder),
    innerRadius,
    isCurve: false,
    pointDeviationChance: 1, // 1 out of this.
    pointDeviationMaxX: floorRandom(maxPointDeviation),
    pointDeviationMaxY: floorRandom(maxPointDeviation),
    points,
    previousPointDeviationInfluence: floorRandom(3) === 1, // 1 out of 3
    rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: floorRandom(3) === 0 ? 0 : floorRandom(Math.PI * 2),
    sharedPointDeviation: floorRandom(2) === 1,
    stepCenterDeviationX: floorRandomNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: floorRandomNegate(stepCenterMaxDeviationY),
    stepCenterDeviationDropOff: 1, // (seeder.rnd() * 2) - 1,
    stepLength: 1 + floorRandom(((Math.min(height, width) - innerRadius) / 3) / amountOfSteps),
    stepLengthDropOff: floorRandom(12) === 0 ? 1 : ((seeder.rnd() * 4) - 2),
    strokePath: floorRandom(8) === 1 // 1/8 chance for a stroke instead of a fill.
  };
};

function generateMugShape(config, seeder) { // previousShapes
  // const options = {
  //   // ...shapeOptions
  // };

  // TODO: randomize
  const shapeSize = Math.min(config.width, config.height) / 5;

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  // const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range);

  const maxPoints = 500;
  let points = 3 + floorRandom(floorRandom(3) === 1 ? maxPoints : 9); // 1 / 5 chance for possibly many points.

  const amountOfSteps = 2 + (100 - Math.floor(Math.pow(100, seeder.rnd())));

  // const stepCenterMaxDeviationX = floorRandom(4) === 1 ? 0 : 30;
  // const stepCenterMaxDeviationY = floorRandom(4) === 1 ? 0 : 30;

  // // 1 / 2 chance for no deviation.
  // const maxPointDeviation = floorRandom(3) === 1 ? 0 : Math.max(60 - (points / 20), 0);

  const innerRadius = floorRandom(window.innerHeight / 8);

  return {
    ...config,
    // ...generateRandomShadowConfig(seeder, options),

    amountOfSteps,
    // TODO: Avoid shape overlap.
    centerX: (shapeSize / 2) + (config.width - shapeSize) * Math.random(),
    centerY: (shapeSize / 2) + (config.height - shapeSize) * Math.random(),
    innerRadius,
    isCurve: false,
    // pointDeviationChance: 1, // 1 out of this.
    // pointDeviationMaxX: floorRandom(maxPointDeviation),
    // pointDeviationMaxY: floorRandom(maxPointDeviation),
    points,
    // previousPointDeviationInfluence: floorRandom(3) === 1, // 1 out of 3
    // rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: floorRandom(3) === 0 ? 0 : floorRandom(Math.PI * 2)
    // sharedPointDeviation: floorRandom(2) === 1,
    // stepCenterDeviationX: floorRandomNegate(stepCenterMaxDeviationX),
    // stepCenterDeviationY: floorRandomNegate(stepCenterMaxDeviationY),
    // stepCenterDeviationDropOff: 1, // (seeder.rnd() * 2) - 1,
    // stepLength: 1 + floorRandom(((Math.min(config.height, config.width) - innerRadius) / 3) / amountOfSteps),
    // stepLengthDropOff: floorRandom(12) === 0 ? 1 : ((seeder.rnd() * 4) - 2),
    // strokePath: floorRandom(8) === 1 // 1/8 chance for a stroke instead of a fill.
  };
}

export function generateRandomMug(width, height, seeder) {
  const eachShapeSize = Math.min(width, height) / 10;
  const baseShapeConfig = {
    width,
    height,
    // ...generateRandomShapeConfig(width, height, seeder)
    ...generateRandomShapeConfig(eachShapeSize, eachShapeSize, seeder)
  };

  const shapes = [];

  const amountOfShapes = Math.floor(2 + (Math.random() * 5));
  for (let i = 0; i < amountOfShapes; i++) {
    shapes.push(generateMugShape(baseShapeConfig, seeder, shapes));
  }

  // TODO: Get the basic properties.
  // TODO: Run through how many shapes we make and spread them.

  // const shape = generateRandomShapeConfig(width, height, seeder);

  // shape.steps = buildSteps(shape, seeder);

  // return [shape];

  shapes.forEach(shape => shape.steps = buildSteps(shape, seeder));

  return shapes;
}

export function generateRandomShape(width, height, seeder, options) {
  const shape = generateRandomShapeConfig(width, height, seeder, options);

  shape.steps = buildSteps(shape, seeder);

  return shape;
};

// This is seperate from the regular shape config because it doesn't have
// inset shadows and therefore can use bezier curves in rendering.
function generateRandomTopologyShapeConfig(width, height, seeder, shapeOptions) {
  const options = {
    ...shapeOptions,
    disableShadow: false
  };

  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range);

  const maxPoints = 30;
  const points = 3 + floorRandom(floorRandom(3) === 1 ? maxPoints : 9); // 1 / 5 chance for possibly many points.
  const amountOfSteps = 2 + (20 - Math.floor(Math.pow(20, seeder.rnd())));

  const maxColorRandom = {
    r: floorRandom(12) === 1 ? 0 : 255,
    g: floorRandom(12) === 1 ? 0 : 255,
    b: floorRandom(12) === 1 ? 0 : 255,
    a: 1
  };

  const randomColorOptions = {
    maxColorRandom,
    blackAndWhite: options.blackAndWhite || floorRandom(20) === 1
  };

  // 1/10 random color for each step, otherwise gradient a few colors.
  const amountOfColors = floorRandom(10) === 1 ? amountOfSteps : 2 + floorRandom(3);

  const stepCenterMaxDeviationX = floorRandom(4) === 1 ? 0 : 30;
  const stepCenterMaxDeviationY = floorRandom(4) === 1 ? 0 : 30;

  const minSize = Math.min(width, height);

  // 1 / 2 chance for no deviation between points.
  const deviationPossible = minSize / 4;
  const maxPointDeviation = floorRandom(5) === 1 ? 0 : Math.max(deviationPossible - (points / (deviationPossible / 3)), 0);

  const innerRadius = floorRandom(minSize / 8);
  const stepLength = 3 + floorRandom(((minSize - innerRadius) / 3) / amountOfSteps);

  const colors = options.gradientPack ? getRandomGradientPackColors(seeder) : createRandomColors(amountOfColors, randomColorOptions, seeder);

  return {
    ...generateRandomShadowConfig(seeder, options),
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors,
    gradientColor: options.gradientColor,
    gradientDirection: generateRandomGradientDirection(seeder),
    innerRadius,
    isCurve: true,
    pointDeviationChance: floorRandom(points), // 1 out of this.
    pointDeviationMaxX: floorRandom(maxPointDeviation),
    pointDeviationMaxY: floorRandom(maxPointDeviation),
    points,
    previousPointDeviationInfluence: floorRandom(3) === 1,
    rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: floorRandom(Math.PI * 2),
    sharedPointDeviation: floorRandom(5) < 3,
    stepCenterDeviationDropOff: floorRandom(5) === 1 ? (seeder.rnd() * 2) - 1 : 1,
    stepCenterDeviationX: floorRandomNegate(stepCenterMaxDeviationX),
    stepCenterDeviationY: floorRandomNegate(stepCenterMaxDeviationY),
    stepLength,
    stepLengthDropOff: floorRandom(12) === 0 ? 1 : ((seeder.rnd() * 4) - 2),
    strokePath: floorRandom(8) === 1 // 1/8 chance for a stroke instead of a fill.
  };
}

export function generateRandomTopologyShape(width, height, seeder, options) {
  const shape = generateRandomTopologyShapeConfig(width, height, seeder, options);

  shape.steps = buildTopologySteps(shape, seeder);

  return shape;
}

// const logo = {
//   innerRadius: -3,
//   colors: logoColors, // From ./color
//   pointDeviationMaxX: 0,
//   pointDeviationMaxY: 0,
//   points: 500,
//   rotateEachStep: 0,
//   shapeRotation: Math.PI / 4,
//   shadowOffsetX: 0,
//   shadowOffsetY: 0,
//   stepCenterDeviationX: 0,
//   stepCenterDeviationY: 0,
//   stepLength: 20,
//   steps: 10,
//   strokePath: false
// };

const startColors = whiteToBlack;

export const generateInitialShape = (width, height, seeder) => {
  const floorRandom = max => Math.floor(seeder.rnd() * max);
  const floorRandomNegate = range => Math.floor(seeder.rnd() * range) - Math.floor(seeder.rnd() * range);

  const minSize = Math.min(width, height);

  const amountOfSteps = 5 + floorRandom(7);

  const initialShapeConfig = {
    amountOfSteps,
    centerX: width / 2,
    centerY: height / 2,
    colors: startColors,
    hasShadow: true,
    innerRadius: 0,
    isCurve: false,
    pointDeviationChance: floorRandom(2), // 1 out of this.
    pointDeviationMaxX: floorRandom(minSize / 10),
    pointDeviationMaxY: floorRandom(minSize / 10),
    points: floorRandom(3) === 0 ? 3 : 3 + floorRandom(6),
    previousPointDeviationInfluence: false,
    radialBackground: false,
    radialBackgroundColor: '#333',
    randomShadow: false,
    rotateEachStep: floorRandomNegate(Math.PI),
    shapeRotation: Math.PI / 8,
    shadowBlur: 4 + floorRandom(8),
    shadowColor: `rgba(${0}, ${0}, ${0}, ${1 - (0.1 * floorRandom(8))})`,
    shadowId: 'svg-shadow',
    shadowInset: true,
    shadowOffsetX: 0,
    shadowOffsetY: 2 + floorRandom(minSize / 10),
    shadowOpacity: 1,
    stepLength: 5 + ((minSize / amountOfSteps) / 3),
    stepLengthDropOff: (seeder.rnd() * 2) - 1,
    stepCenterDeviationDropOff: 1,
    stepCenterDeviationX: floorRandomNegate(minSize / 10),
    stepCenterDeviationY: floorRandomNegate(minSize / 10),
    strokePath: false
  };

  return {
    ...initialShapeConfig,
    steps: buildSteps(initialShapeConfig, seeder)
  };
};


export function doesTriangleIntersectsOtherTriangles(triangle, triangles) {
  for (let i = 0; i < triangles.length; i++) {
    if (Math.abs(triangle.centerX - triangles[i].centerX) < triangle.triangleSize + triangles[i].triangleSize + 2 ||
        Math.abs(triangle.centerY - triangles[i].centerY) < triangle.triangleSize + triangles[i].triangleSize + 2
    ) {
      return true;
    }
  }

  return false;
}

export function generateRandomTriangles(width, height, seeder) {
  const triangles = [];

  const floorRandom = max => Math.floor(seeder.rnd() * max);

  const minSize = Math.min(width, height);

  // TODO: This is coupled and could be done in a nicer way.
  const baseTriangleShapeConfig = generateRandomShapeConfig(width, height, seeder, { triangleMode: true });
  baseTriangleShapeConfig.amountOfSteps = 3 + Math.floor(Math.pow(30, seeder.rnd()));
  baseTriangleShapeConfig.stepCenterDeviationDropOff = 0;

  const amountOfTriangles = 3 + floorRandom(3);
  const maxTriangleSize = floorRandom((minSize / 2) / (amountOfTriangles + 1));

  const coreCenterX = floorRandom(width);
  const coreCenterY = floorRandom(height);

  for (let i = 0; i < amountOfTriangles; i++) {
    const triangleConfig = {
      ...baseTriangleShapeConfig
    };

    triangleConfig.triangleSize = 10 + floorRandom(maxTriangleSize) + baseTriangleShapeConfig.innerRadius;
    // This step length may be wrong? ^ before size should be.
    triangleConfig.stepLength = 1 + floorRandom(triangleConfig.triangleSize / (triangleConfig.amountOfSteps + 1));
    triangleConfig.shapeRotation = seeder.rnd() * Math.PI * 2;

    let counter = 0;

    do {
      // Position the triangle in a random location.
      triangleConfig.centerX = floorRandom(width);
      triangleConfig.centerY = floorRandom(height);

      // Ensure they don't go over boundaries.
      triangleConfig.centerX = Math.min(Math.max(triangleConfig.centerX, triangleConfig.triangleSize), width - triangleConfig.triangleSize);
      triangleConfig.centerY = Math.min(Math.max(triangleConfig.centerY, triangleConfig.triangleSize), height - triangleConfig.triangleSize);
      counter++;
    } while (doesTriangleIntersectsOtherTriangles(triangleConfig, triangles) && counter < 20);

    const adjacent = coreCenterX - triangleConfig.centerX;
    const opposite = coreCenterY - triangleConfig.centerY;
    // const hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));

    const size = (triangleConfig.amountOfSteps * triangleConfig.stepLength);
    triangleConfig.stepCenterDeviationX = adjacent / size;
    triangleConfig.stepCenterDeviationY = opposite / size;

    triangles.push({
      ...triangleConfig,
      steps: buildSteps(triangleConfig, seeder)
    });
  }

  triangles.push({
    ...baseTriangleShapeConfig,
    steps: buildSteps(baseTriangleShapeConfig, seeder)
  });

  return triangles;
}

export function generateRandomWaterColorShape(width, height, seeder) {
  const basicRandomShape = generateRandomShapeConfig(width, height, seeder);

  const floorRandom = max => Math.floor(seeder.rnd() * max);

  const minSize = Math.min(width, height);

  const maxPointDeviation = minSize / (1920 / 20);

  const waterColorShape = {
    ...basicRandomShape,
    pointDeviationMaxX: seeder.rnd() * maxPointDeviation,
    pointDeviationMaxY: seeder.rnd() * maxPointDeviation,
    points: 50 + floorRandom(250),
    previousPointDeviationInfluence: true
  };

  waterColorShape.steps = buildSteps(waterColorShape, seeder);

  return waterColorShape;
}
