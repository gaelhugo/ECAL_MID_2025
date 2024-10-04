class Easing {
  constructor() {}

  elasticOut(t) {
    return Math.sin(((-13 * Math.PI) / 2) * (t + 1)) * Math.pow(2, -10 * t) + 1;
  }

  bounceOut(t) {
    if (t >= 1) {
      return 1;
    }
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  linear(t) {
    return Math.min(t, 1);
  }

  expoOut(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}

export default new Easing();
