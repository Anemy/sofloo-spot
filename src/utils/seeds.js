// Only 10 million possible shapes right now... I think that's ok.
// We can just increase if we need more.
const defaultSeedRange = 9999999;
export function createRandomSeed(range) {
  const randomRange = !range ? defaultSeedRange : range;
  const seed = 1 + Math.floor(Math.random() * randomRange);

  return seed;
}
