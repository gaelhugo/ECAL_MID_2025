import BaseApp from "./BaseApp";
import Particle from "./Particle";

export default class App extends BaseApp {
  constructor() {
    super();

    // create a particle
    this.p = new Particle(this.width / 2, this.height / 2);

    this.draw();
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // this.p.applyForce({ x: 0.01, y: 0 });
    this.p.update();
    this.p.draw(this.ctx);

    // Continue animation
    requestAnimationFrame(() => this.draw());
  }
}
