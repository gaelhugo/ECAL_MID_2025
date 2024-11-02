export default class Particle {
  constructor(x, y) {
    // Position de départ de la particule
    this.x = x || 0;
    this.y = y || 0;

    // Vitesse de la particule sur chaque axe
    this.vitesseX = 0;
    this.vitesseY = 0;

    // Force appliquée à la particule
    this.forceX = 0;
    this.forceY = 0;

    // Propriétés visuelles
    this.taille = 20; // Taille du texte
    this.vitesseMax = 3; // Vitesse maximum de la particule

    // Choisir un angle de départ aléatoire (entre 0 et 360 degrés, converti en radians)
    this.angle = Math.random() * Math.PI * 2;

    // Donner une impulsion initiale dans la direction aléatoire
    this.forceX = Math.cos(this.angle) * 2;
    this.forceY = Math.sin(this.angle) * 2;
  }

  // Mettre à jour la position et la vitesse de la particule
  update() {
    // 1. Ajouter la force à la vitesse
    this.vitesseX += this.forceX;
    this.vitesseY += this.forceY;

    // 2. Limiter la vitesse
    this.limiterVitesse();

    // 3. Mettre à jour la position
    this.x += this.vitesseX;
    this.y += this.vitesseY;

    // 4. Gérer les bords de l'écran
    this.gererBordsEcran();

    // 5. Calculer l'angle de rotation en fonction de la direction
    if (this.vitesseX !== 0 || this.vitesseY !== 0) {
      this.angle = Math.atan2(this.vitesseY, this.vitesseX);
    }

    // 6. Réinitialiser les forces
    this.forceX = 0;
    this.forceY = 0;
  }

  // Limiter la vitesse de la particule
  limiterVitesse() {
    // Limiter la vitesse en X
    this.vitesseX = Math.min(
      Math.max(this.vitesseX, -this.vitesseMax),
      this.vitesseMax
    );

    // Limiter la vitesse en Y
    this.vitesseY = Math.min(
      Math.max(this.vitesseY, -this.vitesseMax),
      this.vitesseMax
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

    // Déplacer le contexte à la position de la particule et le tourner
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2); // Ajouter 90° pour orienter correctement

    // Configurer le style du texte
    ctx.font = `${this.taille}px Arial`;
    ctx.fillStyle = "#FF5733";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Dessiner la lettre A
    ctx.fillText("A", 0, 0);

    ctx.restore();
  }
}
