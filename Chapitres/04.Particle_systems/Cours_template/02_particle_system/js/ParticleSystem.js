import Particle from "./Particle";

export default class ParticleSystem {
  constructor() {
    this.particles = [];
    this.particlesPerClick = 10; // Number of particles to create per click
  }

  createParticles(x, y) {}

  update() {}

  draw(ctx) {}
}
