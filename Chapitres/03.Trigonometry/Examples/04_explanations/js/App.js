import Circle from "./Circle.js";
import DrawingTool from "./DrawingTool.js";
import Line from "./Line.js";
import BaseApp from "./BaseApp.js";

/**
 * @class App
 * @extends BaseApp
 * @description This class is the main application class. It extends the BaseApp class and initializes the components and starts the drawing loop.
 * @param {boolean} startFromZeroX - If true, the circle will start from zero on the x-axis.
 * @param {boolean} startFromZeroY - If true, the circle will start from zero on the y-axis.
 */
export default class App extends BaseApp {
  constructor() {
    super();
    this.initializeComponents(false, false);
    this.draw();
  }

  initializeComponents(startFromZeroX = false, startFromZeroY = false) {
    this.initializeCircle(startFromZeroX, startFromZeroY);
    this.drawingTool = new DrawingTool(this.ctx);
    this.initializeReferenceLines();
  }

  initializeCircle(startFromZeroX, startFromZeroY) {
    this.circle = new Circle(this.width / 2, this.height / 2, 10);
    this.circle.color = "white";

    if (startFromZeroX) {
      this.circle.center.x = 0;
      this.circle.motion_radiusX = 0;
      this.incrementCenterX = true;
    }

    if (startFromZeroY) {
      this.circle.center.y = 0;
      this.circle.motion_radiusY = 0;
      this.incrementCenterY = true;
    }
  }

  initializeReferenceLines() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.verticalLine = new Line(centerX, centerY, 0, 0);
    this.verticalLine.color = "rgb(0, 255, 0)";

    this.horizontalProjection = new Line(centerX, centerY, 0, 0);
    this.horizontalProjection.color = "rgb(0, 255, 0)";

    this.horizontalLine = new Line(centerX, centerY, 0, 0);
    this.horizontalLine.color = "yellow";

    this.verticalProjection = new Line(centerX, centerY, 0, 0);
    this.verticalProjection.color = "yellow";
  }

  updateAndDrawComponents() {
    this.updateCircle();
    this.updateDrawingTool();
    this.updateReferenceLines();
  }

  updateCircle() {
    if (this.incrementCenterX) this.circle.center.x++;
    if (this.incrementCenterY) this.circle.center.y++;
    this.circle.move();
    this.circle.draw(this.ctx);
  }

  updateDrawingTool() {
    this.drawingTool.addPoint(this.circle.x, this.circle.y);
    this.drawingTool.draw();
  }

  updateReferenceLines() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.updateLine(this.verticalLine, this.circle.x, centerY);
    this.updateLine(
      this.horizontalProjection,
      this.circle.x,
      this.circle.y,
      this.circle.x,
      centerY
    );
    this.updateLine(this.horizontalLine, centerX, this.circle.y);
    this.updateLine(
      this.verticalProjection,
      this.circle.x,
      this.circle.y,
      centerX,
      this.circle.y
    );
  }

  updateLine(line, x2, y2, x1 = line.x1, y1 = line.y1) {
    line.x1 = x1;
    line.y1 = y1;
    line.x2 = x2;
    line.y2 = y2;
    line.draw(this.ctx);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateAndDrawComponents();
    requestAnimationFrame(this.draw.bind(this));
  }
}
