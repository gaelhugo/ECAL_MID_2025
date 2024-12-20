import BaseApp from "./BaseApp";
import Utils from "./Utils";
import ParticleSystem from "./ParticleSystem";

export default class App extends BaseApp {
  // Initialise l'application avec un tableau de points de chemin vide,
  // un système de particules pour gérer l'animation des points
  constructor() {
    super();
    this.pathPoints = [];
    this.particleSystem = new ParticleSystem();

    this.init();
  }

  // Initialise l'application en chargeant le fichier SVG et démarre l'animation
  async init() {
    this.pathPoints = await Utils.loadSVG("./letter.svg");
    this.animate();
  }

  // Retourne un point aléatoire parmi tous les chemins SVG chargés
  getRandomPathPoint() {
    const pathIndex = Math.floor(Math.random() * this.pathPoints.length);
    const points = this.pathPoints[pathIndex];
    const pointIndex = Math.floor(Math.random() * points.length);
    return points[pointIndex];
  }

  // Génère de nouvelles particules lorsque la souris est pressée,
  // avec des points cibles aléatoires sur le SVG
  generateParticles() {
    if (this.mouse.isPressed && this.pathPoints.length > 0) {
      for (let i = 0; i < 3; i++) {
        const targetPoint = this.getRandomPathPoint();
        this.particleSystem.addParticle(
          this.mouse.x,
          this.mouse.y,
          targetPoint.x,
          targetPoint.y
        );
      }
    }
  }

  // Boucle d'animation principale : efface le canvas, génère les particules,
  // met à jour leurs positions et les dessine
  animate() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.generateParticles();
    this.particleSystem.update();
    this.particleSystem.draw(this.ctx);

    // Dessine le chemin SVG
    // this.drawPath();

    requestAnimationFrame(() => this.animate());
  }
}
