import BaseApp from "./BaseApp";
import Utils from "./Utils";
import Particle from "./Particle";

export default class App extends BaseApp {
  constructor() {
    super();
    this.paths = [];
    this.particles = [];
    this.numParticles = 1000;
    this.mouse = { x: 0, y: 0 };
    this.mouseRadius = 50; // Rayon d'influence de la souris

    // Ajouter les event listeners pour la souris
    this.loadSVGPath();
    this.draw();
  }

  // Charge le fichier SVG de manière asynchrone et crée les particules une fois chargé
  async loadSVGPath() {
    try {
      this.paths = await Utils.loadSVG("./letter.svg");
      console.log("SVG paths loaded:", this.paths);
      // Create particles once the path is loaded
      this.createParticles();
    } catch (error) {
      console.error("Failed to load SVG:", error);
    }
  }

  // Crée les particules en les positionnant aléatoirement le long du chemin SVG
  createParticles() {
    if (this.paths.length === 0) return;

    // Get the first path (assuming it's the main letter path)
    const path = this.paths[0];

    // Create particles at random positions along the path
    for (let i = 0; i < this.numParticles; i++) {
      const randomPoint = path[Math.floor(Math.random() * path.length)];
      this.particles.push(new Particle(randomPoint.x, randomPoint.y));
    }
  }

  // Vérifie si un point donné (x,y) se trouve à l'intérieur du chemin SVG
  // en utilisant l'algorithme du nombre d'intersections pair/impair
  isPointInPath(x, y) {
    if (this.paths.length === 0) return false;

    const path = this.paths[0];
    let inside = false;

    // Cet algorithme vérifie si un point est à l'intérieur d'une forme en comptant
    // le nombre de fois qu'un rayon partant du point intersecte les bords de la forme
    // Si le nombre d'intersections est impair, le point est à l'intérieur
    for (let i = 0; i < path.length; i++) {
      // Récupère le point actuel et le point précédent pour former un bord
      const currentPoint = path[i];
      const previousPoint = i === 0 ? path[path.length - 1] : path[i - 1];

      // Vérifie si la coordonnée Y du point est entre les coordonnées Y du bord
      const isYBetween = currentPoint.y > y !== previousPoint.y > y;

      if (isYBetween) {
        // Calcule où le rayon intersecte avec le bord
        const intersectionX =
          previousPoint.x +
          ((currentPoint.x - previousPoint.x) * (y - previousPoint.y)) /
            (currentPoint.y - previousPoint.y);

        // Si le rayon intersecte à gauche de notre point, inverse intérieur/extérieur
        if (x < intersectionX) {
          inside = !inside;
        }
      }
    }

    return inside;
  }

  // Trouve le point le plus proche sur le chemin SVG pour un point donné (x,y)
  // en calculant la distance euclidienne minimale
  findNearestPointOnPath(x, y) {
    if (this.paths.length === 0) return { x, y };

    const path = this.paths[0];
    let nearestPoint = path[0];
    let minDistance = Number.MAX_VALUE;

    path.forEach((point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    });

    return nearestPoint;
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.particles.forEach((particle) => {
      particle.update();

      // Calculer la distance entre la particule et la souris
      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

      // Si la souris est proche, appliquer une force de répulsion
      if (distanceToMouse < this.mouseRadius) {
        const force = (this.mouseRadius - distanceToMouse) / this.mouseRadius;
        particle.vx += (dx / distanceToMouse) * force * 2;
        particle.vy += (dy / distanceToMouse) * force * 2;
        particle.isRepelled = true; // Marquer la particule comme repoussée
      }

      // Vérifier les limites seulement si la particule n'est pas repoussée
      if (!particle.isRepelled && !this.isPointInPath(particle.x, particle.y)) {
        const nearestPoint = this.findNearestPointOnPath(
          particle.x,
          particle.y
        );
        particle.x = nearestPoint.x;
        particle.y = nearestPoint.y;
        particle.vx *= -0.5;
        particle.vy *= -0.5;
      }

      // // Si la particule est très loin du chemin, la ramener progressivement
      // if (particle.isRepelled) {
      //   const nearestPoint = this.findNearestPointOnPath(
      //     particle.x,
      //     particle.y
      //   );
      //   const distanceToPath = Math.hypot(
      //     particle.x - nearestPoint.x,
      //     particle.y - nearestPoint.y
      //   );

      //   if (distanceToPath > 200) {
      //     // Distance maximale autorisée
      //     particle.vx += (nearestPoint.x - particle.x) * 0.01;
      //     particle.vy += (nearestPoint.y - particle.y) * 0.01;
      //   }
      // }

      particle.draw(this.ctx);
    });

    requestAnimationFrame(this.draw.bind(this));
  }
}
