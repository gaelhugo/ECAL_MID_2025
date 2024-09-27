import Point from "./Point.js";
import Utils from "./Utils.js";

export default class App {
  constructor() {
    // Create a canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    // Set the background to white
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Create a grid of points
    const spacing = 15;
    const columns = Math.floor(this.canvas.width / spacing);
    const rows = Math.floor(this.canvas.height / spacing);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Calculate the position of each point
        const x = col * spacing;
        const y = row * spacing;

        // Calculate the radius using the Utils class
        const radius = Utils.calculateRadialGradientRadius(x, y);

        // Create a new point and draw it
        const point = new Point(x, y, radius);
        point.draw(this.ctx);
      }
    }
  }
}
