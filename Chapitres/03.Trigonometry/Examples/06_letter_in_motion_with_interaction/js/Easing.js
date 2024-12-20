class Easing {
  constructor() {}
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  elasticOut(t) {
    return Math.sin(((-13 * Math.PI) / 2) * (t + 1)) * Math.pow(2, -10 * t) + 1;
  }
  elasticIn(t) {
    return Math.sin(((13 * Math.PI) / 2) * t) * Math.pow(2, 10 * (t - 1));
  }
}

export default new Easing();
