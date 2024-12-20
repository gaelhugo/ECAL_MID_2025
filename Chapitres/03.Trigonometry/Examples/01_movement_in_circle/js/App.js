import Circle from "./Circle.js";
import Axe from "./Axe.js";
export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer un cercle
    this.circle = new Circle(this.width / 2, this.height / 2, 10);
    this.circle.color = "white";
    // deuxième étape : dessiner le canvas

    // créer un axe
    this.axe = new Axe(this.width / 2, this.height / 2);
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
    // this.ctx.clearRect(0, 0, this.width, this.height);
    this.axe.draw(this.ctx);
    this.circle.move();
    this.circle.draw(this.ctx);
    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
