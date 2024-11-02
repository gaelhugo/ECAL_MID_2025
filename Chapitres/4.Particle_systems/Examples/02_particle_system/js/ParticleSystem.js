import Particle from "./Particle";

export default class ParticleSystem {
  constructor() {
    this.particles = [];
    this.particlesPerClick = 10; // Number of particles to create per click
  }

  createParticles(x, y) {
    for (let i = 0; i < this.particlesPerClick; i++) {
      const particle = new Particle(x, y);

      // Give each particle a random initial velocity
      const angle = Math.random() * Math.PI * 2;
      const magnitude = Math.random() * 20; // Random initial speed

      particle.velocity.x = Math.cos(angle) * magnitude;
      particle.velocity.y = Math.sin(angle) * magnitude;

      this.particles.push(particle);
    }
  }

  update() {
    for (const particle of this.particles) {
      // Add some gravity or other forces here if desired
      particle.applyForce({ x: 0.01, y: 0 }); // Example: gravity
      particle.update();
    }
  }

  draw(ctx) {
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }
}
