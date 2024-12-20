import BaseApp from "./BaseApp";
import Utils from "./Utils";
import ColorGradient from "./ColorGradient";

export default class App extends BaseApp {
  constructor() {
    super();
    this.points = [];
    this.originalPoints = [];
    this.time = 0;
    this.waveIntensity = 0;
    this.lineWidth = 2;
    this.colorGradient = new ColorGradient(this.ctx);
    this.init();
  }

  async init() {
    try {
      // Charger la lettre
      const paths = await Utils.loadSVG("/letter.svg");
      this.originalPoints = paths[0];

      // Centrer la lettre
      const bounds = this.getBounds(this.originalPoints);
      const centerX = this.canvas.width / 2 - (bounds.maxX + bounds.minX) / 2;
      const centerY = this.canvas.height / 2 - (bounds.maxY + bounds.minY) / 2;

      this.originalPoints.forEach((point) => {
        point.x += centerX;
        point.y += centerY;
      });

      // Configuration MIDI
      if (navigator.requestMIDIAccess) {
        navigator
          .requestMIDIAccess()
          .then(this.setupMIDI.bind(this))
          .catch((err) => console.error(err));
      }

      this.animate();
    } catch (error) {
      console.error("Erreur lors du chargement du SVG:", error);
    }
  }

  getBounds(points) {
    return points.reduce(
      (bounds, point) => ({
        minX: Math.min(bounds.minX, point.x),
        maxX: Math.max(bounds.maxX, point.x),
        minY: Math.min(bounds.minY, point.y),
        maxY: Math.max(bounds.maxY, point.y),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
  }

  setupMIDI(midiAccess) {
    const inputs = midiAccess.inputs.values();
    for (const input of inputs) {
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }

  handleMIDIMessage(message) {
    const [command, controller, value] = message.data;
    if ((command & 0xf0) === 0xb0) {
      switch (controller) {
        case 1: // Premier potentiomètre: intensité de la vague
          this.waveIntensity = value / 127;
          break;
        case 2: // Deuxième potentiomètre: épaisseur du trait
          this.lineWidth = 1 + (value / 127) * 30;
          break;
        case 3: // Troisième potentiomètre: position dans le gradient de couleur
          this.colorGradient.setPosition(value / 127);
          break;
      }
    }
  }

  animate() {
    this.time += 0.05;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dessiner la lettre avec effet de vague
    if (this.originalPoints.length > 0) {
      this.ctx.beginPath();

      // Premier point
      const firstPoint = this.getWavePoint(this.originalPoints[0]);
      this.ctx.moveTo(firstPoint.x, firstPoint.y);

      // Points suivants
      for (let i = 1; i < this.originalPoints.length; i++) {
        const point = this.getWavePoint(this.originalPoints[i]);
        this.ctx.lineTo(point.x, point.y);
      }

      // Remplir avec la couleur actuelle
      this.ctx.fillStyle = this.colorGradient.getCurrentColor(
        this.canvas.width
      );
      this.ctx.fill();

      // Contour
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.stroke();
    }

    // Dessiner la barre de gradient et le curseur
    this.colorGradient.draw(this.canvas.width, this.canvas.height);

    requestAnimationFrame(this.animate.bind(this));
  }

  getWavePoint(point) {
    // Effet de vague simple
    const wave = Math.sin(point.x * 0.02 + this.time) * 30 * this.waveIntensity;
    return {
      x: point.x,
      y: point.y + wave,
    };
  }
}
