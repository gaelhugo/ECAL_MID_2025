export default class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // Vitesse de la particule
    this.vitesseX = 0;
    this.vitesseY = 0;

    // Accélération de la particule
    this.accelerationX = (Math.random() - 0.5) * 0.05;
    this.accelerationY = (Math.random() - 0.5) * 0.05;

    // Limite de vitesse
    this.vitesseMax = Math.random() * 5 + 1;
  }

  // Mettre à jour la position et la vitesse de la particule
  update() {
    this.vitesseX += this.accelerationX;
    this.vitesseY += this.accelerationY;

    this.x += this.vitesseX;
    this.y += this.vitesseY;

    this.angle = Math.atan2(this.vitesseY, this.vitesseX);
  }

  // Limiter la vitesse de la particule
  limiterVitesse() {
    // this.vitesseX = Math.min(this.vitesseX, this.vitesseMax);
    // this.vitesseY = Math.min(this.vitesseY, this.vitesseMax);

    this.vitesseX = Math.min(
      Math.max(this.vitesseX, -this.vitesseMax),
      this.vitesseMax,
    );
    this.vitesseY = Math.min(
      Math.max(this.vitesseY, -this.vitesseMax),
      this.vitesseMax,
    );
  }

  // Faire réapparaître la particule de l'autre côté si elle sort de l'écran
  gererBordsEcran() {
    if (this.x > window.innerWidth) this.x = 0;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.y > window.innerHeight) this.y = 0;
    if (this.y < 0) this.y = window.innerHeight;
  }

  // Dessiner la particule
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", 0, 0);

    ctx.restore();
  }
}
