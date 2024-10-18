import BaseApp from "./BaseApp.js";
import Utils from "./Utils.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.time = 0;
    this.amplitude = 25;
    this.frequency = 0.015;
    this.angle = 0;

    Utils.loadSVG("letter.svg").then((letterPoints) => {
      this.letter = letterPoints;
      this.animate();
    });
  }

  animate() {
    this.time += 0.01;
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.beginPath();
    this.letter.forEach(this.drawPath.bind(this));
    // for (let i = 0; i < this.letter.length; i++) {
    //   this.drawPath(this.letter[i]);
    // }
    this.ctx.fill();
    requestAnimationFrame(this.animate.bind(this));
  }

  drawPath(path) {
    for (let i = 0; i < path.length; i++) {
      const point = path[i];

      const angle = this.time + i * this.frequency;

      const x = point.x + Math.cos(angle) * this.amplitude;
      const y = point.y + Math.sin(angle) * this.amplitude;

      if (i !== 0) {
        this.ctx.lineTo(x, y);
      } else {
        this.ctx.moveTo(x, y);
      }
    }
  }
}
