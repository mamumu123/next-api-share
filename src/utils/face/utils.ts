export function randomFromInterval(min: number, max: number, rng: () => number) {
  // min and max included
  return rng() * (max - min) + min;
}

export function cubicBezier(P0: number[], P1: number[], P2: number[], P3: number[], t: number) {
  var x = (1 - t) ** 3 * P0[0] + 3 * (1 - t) ** 2 * t * P1[0] + 3 * (1 - t) * t ** 2 * P2[0] + t ** 3 * P3[0];
  var y = (1 - t) ** 3 * P0[1] + 3 * (1 - t) ** 2 * t * P1[1] + 3 * (1 - t) * t ** 2 * P2[1] + t ** 3 * P3[1];
  return [x, y];
}
