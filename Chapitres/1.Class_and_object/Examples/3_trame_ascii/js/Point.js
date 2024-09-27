export default class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx) {
    // Use an elegant serif font
    ctx.font = `${this.radius * 2}px "Georgia", "Times New Roman", serif`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Define letters for different densities
    const densityChars = ["a", "c", "e", "o", "A", "C", "E", "O"];

    // Calculate the index based on the radius
    const maxRadius = 4; // Adjust this value based on your Utils.calculateRadialGradientRadius implementation
    const index = Math.min(
      Math.floor((this.radius / maxRadius) * (densityChars.length - 1)),
      densityChars.length - 1
    );

    // Get the corresponding letter
    const char = densityChars[index];

    ctx.fillText(char, this.x, this.y);
  }
}
