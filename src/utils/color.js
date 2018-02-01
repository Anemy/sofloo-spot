import gradientPack from './gradients';

// Nice blue backgorund
// rgb(162, 198, 221)

// Color Bound.
export const cb = color => Math.min(Math.max(Math.floor(color), 0), 255);
export const colorBound = cb;

export const getStepColor = (step, steps, colors) => {
  const amountOfColors = colors.length;

  const percentage = step / (steps - 1);

  const previousColor = colors[Math.min(Math.ceil(percentage * (amountOfColors - 1)), amountOfColors - 1)];
  const nextColor = colors[Math.floor(percentage * (amountOfColors - 1))]; // Maybe - 1

  const r = cb(previousColor.r + ((nextColor.r - previousColor.r) * (1 - ((percentage * (amountOfColors - 1)) % 1))));
  const g = cb(previousColor.g + ((nextColor.g - previousColor.g) * (1 - ((percentage * (amountOfColors - 1)) % 1))));
  const b = cb(previousColor.b + ((nextColor.b - previousColor.b) * (1 - ((percentage * (amountOfColors - 1)) % 1))));

  const a = cb(previousColor.a + ((nextColor.a - previousColor.a) * (1 - ((percentage * (amountOfColors - 1)) % 1)))) || 1;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// export const logoColors = [{
//   r: 245,
//   g: 245,
//   b: 255
// }, {
//   r: 2,
//   g: 167,
//   b: 254
// }];

export const whiteToBlack = [{
  r: 0,
  g: 0,
  b: 0,
  a: 1
}, {
  r: 255,
  g: 255,
  b: 255,
  a: 1
}];

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b};
}

export function getRandomGradientPackColors(seeder) {
  const gradient = gradientPack[Math.floor(seeder.rnd() * gradientPack.length)];

  const rgbGradient = [];

  for (let i = 0; i < gradient.colors.length; i++) {
    rgbGradient.push(hexToRgb(gradient.colors[i].slice(1)));
  }
  
  return rgbGradient;
};

export const createRandomColor = (seeder) => ({
  r: Math.floor(seeder.rnd() * 255),
  g: Math.floor(seeder.rnd() * 255),
  b: Math.floor(seeder.rnd() * 255)
});

// Possible options and defaults:
// - maxColorRandom - a color object used for giving a max random for each possible color.
// - blackAndWhite
export const createRandomColors = (amountOfColors, setOptions, seeder) => {
  const options = {
    maxColorRandom: {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    },
    ...setOptions
  };

  const colors = [];

  for (let i = 0; i < amountOfColors; i++) {
    const blackAndWhiteColor = options.blackAndWhite ? Math.floor(seeder.rnd() * (options.maxColorRandom.r)) : 0;

    colors.push({
      r: options.blackAndWhite ? blackAndWhiteColor : Math.floor(seeder.rnd() * (options.maxColorRandom.r)),
      g: options.blackAndWhite ? blackAndWhiteColor : Math.floor(seeder.rnd() * (options.maxColorRandom.g)),
      b: options.blackAndWhite ? blackAndWhiteColor : Math.floor(seeder.rnd() * (options.maxColorRandom.b)),
      a: options.maxColorRandom.a
    });
  }

  return colors;
};

export const getContrastingBinaryColor = color => {
  let d = 0;

  // Counting the perceptive luminance - human eye favors green color... 
  const a = 1 - (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;

  if (a < 0.5) {
    d = 0; // bright colors - black font
  } else {
    d = 255; // dark colors - white font
  }

  return `rgb(${d}, ${d}, ${d})`;
};

export const createColorString = c => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a || 1})`;
