import BaseApp from "./BaseApp.js";
import Utils from "./Utils.js";
import Easing from "./Easing.js";

/**
 * Cette classe étend BaseApp pour créer une animation interactive d'une lettre.
 * Elle utilise des données SVG pour dessiner une lettre et applique divers effets :
 * - Un mouvement ondulant contrôlé par l'amplitude et la fréquence
 * - Fonctionnalité de pause/reprise lors de l'appui/relâchement de la souris
 * - Un effet de transition pour une mise en pause et une reprise en douceur
 * - Un effet de relâchement qui ajoute un mouvement supplémentaire lors de la reprise
 *
 * L'animation peut être interagie avec des événements de souris, créant
 * un effet visuel dynamique et réactif.
 */
export default class App extends BaseApp {
  constructor() {
    super();
    this.time = 0;
    this.amplitude = 25;
    this.frequency = 0.015;
    this.isPaused = false;
    this.transition = 1;
    this.ctx.strokeStyle = "orange";
    this.ctx.lineWidth = 1;

    // Explication des propriétés et méthodes clés

    /**
     * time: Représente le temps actuel dans l'animation, incrémenté à chaque image.
     * amplitude: Contrôle l'amplitude du mouvement ondulatoire.
     * frequency: Détermine la rapidité de changement du mouvement ondulatoire le long du tracé de la lettre.
     * transition: Adoucit la transition entre les états de pause et d'activité (de 0 à 1).
     * animate(): La boucle d'animation principale, met à jour le temps et les effets, puis redessine.
     * drawPath(): Rend chaque tracé de la lettre en utilisant le décalage actuel.
     * getOffsetPoint(): Calcule la nouvelle position pour chaque point, en appliquant tous les effets.
     */
    Utils.loadSVG("letterB.svg").then((letter) => {
      this.letter = letter;
      this.calculateCenter();
      this.canvas.addEventListener("mousedown", () => (this.isPaused = true));
      this.canvas.addEventListener("mouseup", () => {
        this.isPaused = false;
      });
      this.animate();
    });
  }

  calculateCenter() {
    const bounds = Utils.calculateBounds(this.letter);
    this.centerX = this.width / 2 - (bounds.minX + bounds.width / 2);
    this.centerY = this.height / 2 - (bounds.minY + bounds.height / 2);
  }

  animate() {
    this.time += 0.01;
    this.transition += this.isPaused ? -0.02 : 0.02;
    this.transition = Math.max(0, Math.min(1, this.transition));

    this.ctx.fillStyle = "rgba(0,0,0,0.03)";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // this.ctx.clearRect(0, 0, this.width, this.height);

    // Save the context state, translate, draw the letter, then restore
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    this.ctx.beginPath();
    this.letter.forEach(this.drawPath.bind(this));
    this.ctx.fillStyle = "rgba(255,255,0,1)";
    // this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
    requestAnimationFrame(this.animate.bind(this));
  }

  drawPath(path) {
    path.forEach((point, i) => {
      const { x, y } = this.getOffsetPoint(point, i);
      this.ctx[i ? "lineTo" : "moveTo"](x, y);
    });
  }

  /**
   * getOffsetPoint(point, i): Calcule la nouvelle position pour chaque point du tracé de la lettre.
   *
   * @param {Object} point - Les coordonnées x, y originales du point.
   * @param {number} i - L'index du point dans le tracé.
   * @returns {Object} - Les nouvelles coordonnées x, y du point après application des effets.
   *
   * Cette méthode applique plusieurs effets pour créer le mouvement animé :
   * 1. Mouvement ondulant : Utilisation de la fonction sinus avec le temps et la fréquence.
   * 2. Effet de transition : Interpole en douceur entre les états en pause et actif.
   * Le décalage final est une combinaison de ces effets, appliqués aux coordonnées x et y.
   * La coordonnée y utilise un sinus déphasé pour un mouvement plus circulaire.
   */
  getOffsetPoint(point, i) {
    const angle = this.time + i * this.frequency;
    const easing = Easing.easeInOutCubic(this.transition);
    const offset = Math.sin(angle) * this.amplitude * easing;
    return {
      x: point.x + offset,
      y: point.y + offset * 0.8 * Math.cos(angle + Math.PI / 2),
    };
  }
}
