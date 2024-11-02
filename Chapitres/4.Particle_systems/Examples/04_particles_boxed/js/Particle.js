export default class Particle {
  /**
   * Crée une nouvelle particule avec une position et une vélocité aléatoire
   * @param {number} x - Position initiale en X
   * @param {number} y - Position initiale en Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.radius = 2;
    this.isRepelled = false;
    this.friction = 0.98;
  }

  /**
   * Met à jour la position et la vélocité de la particule
   * - Ajoute un mouvement aléatoire
   * - Applique la friction
   * - Limite la vitesse maximale
   * - Met à jour l'état de répulsion
   */
  update() {
    // Ajouter un mouvement aléatoire
    this.vx += (Math.random() - 0.5) * 0.2;
    this.vy += (Math.random() - 0.5) * 0.2;

    // Appliquer la friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Limiter la vitesse
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > 5) {
      this.vx = (this.vx / speed) * 5;
      this.vy = (this.vy / speed) * 5;
    }

    // Si la vitesse est très faible et que la particule était repoussée,
    // on la considère comme revenue à la normale
    if (speed < 0.5 && this.isRepelled) {
      this.isRepelled = false;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * Dessine la particule sur le canvas
   * La couleur change selon si la particule est repoussée ou non
   * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu 2D
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.isRepelled ? this.radius * 3 : this.radius,
      0,
      Math.PI * 2
    );
    // Changer la couleur en fonction de l'état
    ctx.fillStyle = this.isRepelled ? "red" : "white";
    ctx.fill();
  }
}
