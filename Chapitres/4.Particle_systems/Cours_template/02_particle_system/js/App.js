import BaseApp from "./BaseApp";
import ParticleSystem from "./ParticleSystem";

export default class App extends BaseApp {
  constructor() {
    super();

    this.draw();
  }

  handleClick(event) {}

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particle system

    // Continue animation
    requestAnimationFrame(() => this.draw());
  }
}
