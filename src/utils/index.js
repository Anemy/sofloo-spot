
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