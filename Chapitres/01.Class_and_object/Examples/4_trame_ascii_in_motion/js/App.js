import Point from "./Point.js";
import Canvas from "./Canvas.js";
import Utils from "./Utils.js";

export default class App {
  constructor() {
    // Create a canvas using our new Canvas class
    const canvas = new Canvas();
    this.ctx = canvas.getContext();

    // Set the background to black
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());

    // Calculate how many rows and columns of points we can fit
    const spacing = 20;
    const columns = Math.floor(canvas.getWidth() / spacing);
    const rows = Math.floor(canvas.getHeight() / spacing);

    // Create an array to store all our points
    const points = [];
    let radius = 10;
    // Create points in a grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Calculate the position of each point
        const x = (col * canvas.getWidth()) / (columns - 1);
        const y = (row * canvas.getHeight()) / (rows - 1);

        radius = Utils.calculateRadialGradientRadius(x, y);
        // radius = Utils.calculateHorizontalGradientRadius(col / (columns - 1));
        // radius = Utils.calculateVerticalGradientRadius(row / (rows - 1));

        // Create a new point and add it to our array
        const point = new Point(x, y, radius);
        points.push(point);
      }
    }

    // Draw all the points
    points.forEach((point) => {
      point.draw(this.ctx);
    });

    this.points = points; // Array to store Point instances

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    // Fill the canvas with black instead of clearing it
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Update and draw all points
    for (const point of this.points) {
      point.update();
      point.draw(this.ctx);
    }

    // Request the next animation frame
    requestAnimationFrame(this.animate);
  }

  // ... other existing methods ...
}
