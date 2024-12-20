import Circle from "./Circle.js";
import DrawingTool from "./DrawingTool.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer un cercle
    this.circle = new Circle(this.width / 2, this.height / 2, 10);
    this.circle.color = "white";
    // créer un outil de dessin
    this.drawingTool = new DrawingTool(this.ctx);
    // deuxième étape : dessiner le canvas
    this.draw();
  }
  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.circle.move();

    this.drawingTool.addPoint(this.circle.x, this.circle.y);
    this.drawingTool.draw();

    this.circle.draw(this.ctx);

    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
