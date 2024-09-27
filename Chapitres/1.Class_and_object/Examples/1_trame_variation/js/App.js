import Point from "./Point.js";
import Canvas from "./Canvas.js";
import Utils from "./Utils.js";

export default class App {
  constructor() {
    // Create a canvas using our new Canvas class
    const canvas = new Canvas();
    const ctx = canvas.getContext();

    // Calculate how many rows and columns of points we can fit
    const spacing = 20;
    const columns = Math.floor(canvas.getWidth() / spacing);
    const rows = Math.floor(canvas.getHeight() / spacing);

    // Create an array to store all our points
    const points = [];
    let radius; // tbd in the loop
    // Create points in a grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Calculate the position of each point
        const x = (col * canvas.getWidth()) / (columns - 1);
        const y = (row * canvas.getHeight()) / (rows - 1);

        // radius = Utils.calculateRadialGradientRadius(x, y);
        // radius = Utils.calculateHorizontalGradientRadius(col / (columns - 1));
        // radius = Utils.calculateVerticalGradientRadius(row / (rows - 1));
        // radius = Utils.calculateDiagonalGradientRadius(
        //   col / (columns - 1),
        //   row / (rows - 1)
        // );
        radius = Utils.calculateDiagonalInverseGradientRadius(
          col / (columns - 1),
          row / (rows - 1)
        );

        // Create a new point and add it to our array
        const point = new Point(x, y, radius);
        points.push(point);
      }
    }

    // Draw all the points
    points.forEach((point) => {
      point.draw(ctx);
    });
  }
}
