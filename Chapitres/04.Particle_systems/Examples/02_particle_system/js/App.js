import BaseApp from "./BaseApp";
import ParticleSystem from "./ParticleSystem";

export default class App extends BaseApp {
  constructor() {
    super();
    this.particleSystem = new ParticleSystem();

    // Add click event listener
    this.canvas.addEventListener("click", this.handleClick.bind(this));

    this.draw();
  }

  handleClick(event) {
    // Get mouse position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create particles at click position
    this.particleSystem.createParticles(x, y);
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particle system
    this.particleSystem.update();
    this.particleSystem.draw(this.ctx);

    // Continue animation
    requestAnimationFrame(() => this.draw());
  }
}
