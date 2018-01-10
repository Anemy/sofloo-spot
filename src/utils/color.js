import { floorRandom } from "./index";

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


  const a = cb(previousColor.a + ((nextColor.a - previousColor.a) * (1 - ((percentage * (amountOfColors - 1)) % 1))));

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Possible options and defaults:
// - maxColorRandom - a color object used for giving a max random for each possible color.
export const createRandomColors = (amountOfColors, setOptions) => {
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
    colors.push({
      r: Math.floor(Math.random() * (options.maxColorRandom.r)),
      g: Math.floor(Math.random() * (options.maxColorRandom.g)),
      b: Math.floor(Math.random() * (options.maxColorRandom.b)),
      a: options.maxColorRandom.a
    });
  }

  return colors;
};