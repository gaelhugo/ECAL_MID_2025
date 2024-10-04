import Circle from "./Circle.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer un cercle
    this.circle = new Circle(100, 100, 50);
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
    // dessiner le cercle
    this.circle.draw(this.ctx);
    // bouger le cercle
    this.circle.x += 1;
    // si le cercle est en dehors de la canvas, le remettre à l'intérieur
    if (this.circle.x > this.width) {
      this.circle.x = 0;
    }
    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
