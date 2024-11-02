import BaseApp from "./BaseApp";
import Particle from "./Particle";

export default class App extends BaseApp {
  constructor() {
    super();
    this.collection = [];
    // for (let i = 0; i < 10; i++) {
    //   const particule = new Particle(this.width / 2, this.height / 2);
    //   this.collection.push(particule);
    // }
    // this.particule = new Particle(this.width / 2, this.height / 2);

    document.addEventListener("mousemove", (event) => {
      for (let i = 0; i < 10; i++) {
        const particule = new Particle(event.x, event.y);
        this.collection.push(particule);
      }
    });

    this.draw();
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.collection.forEach((particule) => {
      // Update particle
      particule.update();
      particule.gererBordsEcran();
      particule.limiterVitesse();
      particule.draw(this.ctx);
    });

    // Update particle
    // this.particule.update();
    // this.particule.gererBordsEcran();
    // this.particule.draw(this.ctx);
    // Continue animation
    requestAnimationFrame(() => this.draw());
  }
}
