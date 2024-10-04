import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();
    //créer une serie de lettres
    this.letters = [];
    const spacing = 75; // Space between letters
    const size = 50; // Size of each letter
    const rows = Math.ceil(this.height / spacing);
    const cols = Math.floor(this.width / spacing);

    // for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + spacing / 2;
      // const y = row * spacing + spacing / 2;
      const y = this.height / 2;
      this.letters.push(new Letter(x, y, size));
    }
    // }
    // initialiser l'interaction click
    this.initInteraction();
    // dessiner le canvas
    this.draw();
  }
  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    // this.ctx.fillStyle = "white";
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  initInteraction() {
    document.addEventListener("mousemove", (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    // this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    this.letters.forEach((letter) => {
      letter.checkHover(this.mouseX, this.mouseY);
      letter.update();
      letter.draw(this.ctx);
    });
    // transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}
