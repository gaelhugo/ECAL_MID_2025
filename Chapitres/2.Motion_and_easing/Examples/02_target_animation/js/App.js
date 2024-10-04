import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer un cercle
    this.letter = new Letter(100, 100, 100);
    // initialiser l'interaction click
    this.initInteraction();
    // dessiner le canvas
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

  initInteraction() {
    document.addEventListener("click", (e) => {
      // récupérer la position du click
      // et l'appliquer au cercle
      // this.letter.targetx = e.x;
      // this.letter.targety = e.y;
      this.letter.reset(e.x, e.y);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // dessiner le cercle
    this.letter.update();
    this.letter.dessine(this.ctx);
    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
