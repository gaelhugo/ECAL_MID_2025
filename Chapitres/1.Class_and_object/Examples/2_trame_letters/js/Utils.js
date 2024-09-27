export default class Utils {
  static calculateRadialGradientRadius(x, y) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxDistance = this.calculateDistance(centerX, centerY, 0, 0);
    const distance = this.calculateDistance(x, y, centerX, centerY);
    const ratio = 1 - distance / maxDistance;

    const minRadius = 2;
    const maxRadius = 30;
    return minRadius + (maxRadius - minRadius) * ratio;
  }

  static calculateHorizontalGradientRadius(xRatio) {
    const minRadius = 2;
    const maxRadius = 10;
    return minRadius + (maxRadius - minRadius) * xRatio;
  }

  static calculateVerticalGradientRadius(yRatio) {
    const minRadius = 2;
    const maxRadius = 10;
    return minRadius + (maxRadius - minRadius) * yRatio;
  }

  // Calculate the distance between two points
  static calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
}
