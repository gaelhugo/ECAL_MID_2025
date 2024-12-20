import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer une lettre
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
    document.addEventListener(
      "click",

      (evenement) => {
        // function (evenement) {
        // récupérer la position du click
        // et l'appliquer au cercle
        this.letter.x = evenement.x;
        this.letter.y = evenement.y;
      }
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // dessiner le cercle
    this.letter.dessine(this.ctx);
    // this.letter.x += 1;
    // this.letter.y += 1;
    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
