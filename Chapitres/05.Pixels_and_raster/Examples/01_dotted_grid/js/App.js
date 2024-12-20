import BaseApp from "./BaseApp";
import Letter from "./Letter";
import Webcam from "./Webcam";

export default class App extends BaseApp {
  constructor() {
    super();
    this.ctx.willReadFrequently = true;
    this.ctx.font = `14px monospace`;
    this.letters = [];
    this.pixelColors = [];
    this.init();
  }

  loadImage(src) {
    return new Promise((resolve) => {
      this.image = new Image();
      this.image.onload = resolve;
      this.image.src = src;
    });
  }

  async init() {
    await this.loadImage("./image/andy.jpg");
    // this.loadWebcam();
    // store the letters in an array
    // it must be an array of 100 letters "O"
    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 80; j++) {
        this.letters.push(new Letter(this.ctx, "X", i * 10, j * 10));
      }
    }
    this.draw();
  }

  loadWebcam() {
    this.webcam = new Webcam();
  }

  draw() {
    // this.ctx.drawImage(this.image, 0, 0, 800, 800);
    this.ctx.drawImage(this.webcam.video, 0, 0, 800, 800);
    const pixels = this.ctx.getImageData(0, 0, 800, 800).data;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.letters.forEach((letter) => {
      const i = (letter.y * 800 + letter.x) * 4;
      letter.color = `rgb(${pixels[i]}, ${pixels[i + 1]}, ${pixels[i + 2]})`;
      letter.scale = this.getLuminance([
        pixels[i],
        pixels[i + 1],
        pixels[i + 2],
      ]);
      letter.draw();
    });

    requestAnimationFrame(this.draw.bind(this));
  }

  // get luminosity calculated from rgb of a color
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  getLuminance(rgb) {
    // 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }
}
