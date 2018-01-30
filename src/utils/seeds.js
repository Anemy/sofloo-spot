// Only 10 million possible shapes right now... I think that's ok.
// We can just increase if we need more.
const defaultSeedRange = 9999999;
export const createRandomSeed = (range, existingSeed) => {
  let randomRange = (range === undefined) ? defaultSeedRange : range;

  let seed = 1 + Math.floor(Math.random() * randomRange);

  // To avoid repeating seeds.
  if (existingSeed !== undefined) {
    while (seed === existingSeed && range > 2) {
      seed = 1 + Math.floor(Math.random() * randomRange);
    }
  }

  return seed;
}
