export default class Particle {
  constructor(x, y) {}

  // Mettre à jour la position et la vitesse de la particule
  update() {}

  // Limiter la vitesse de la particule
  limiterVitesse() {}

  // Faire réapparaître la particule de l'autre côté si elle sort de l'écran
  gererBordsEcran() {
    if (this.x > window.innerWidth) this.x = 0;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.y > window.innerHeight) this.y = 0;
    if (this.y < 0) this.y = window.innerHeight;
  }

  // Dessiner la particule
  draw(ctx) {}
}
