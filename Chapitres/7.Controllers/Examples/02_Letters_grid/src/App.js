import BaseApp from "./BaseApp";
import Particle from "./Particle";

export default class App extends BaseApp {
  constructor() {
    super();
    this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.grid = [];
    this.particles = [];
    this.rows = 1;
    this.cols = 1;
    this.letterSize = 20;
    this.currentLetterIndex = 0;
    this.magnification = 0;
    this.motionAmplitude = 0;
    this.time = 0;
    this.init();
  }

  init() {
    // Configuration initiale
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${this.letterSize}px monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Créer la grille initiale
    this.createGrid();

    // Configuration MIDI
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(this.setupMIDI.bind(this))
        .catch((err) => console.error(err));
    }

    this.animate();
  }

  createGrid() {
    this.grid = [];
    this.particles = [];
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = this.getRandomLetter();
      }
    }
  }

  getRandomLetter() {
    return this.letters[Math.floor(Math.random() * this.letters.length)];
  }

  setupMIDI(midiAccess) {
    const inputs = midiAccess.inputs.values();
    for (const input of inputs) {
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }

  handleMIDIMessage(message) {
    const [command, controller, value] = message.data;
    console.log(command, controller, value);
    // Gérer l'explosion (touche 32)
    if (controller === 32) {
      if (value === 127) {
        this.createParticles();
        this.particles.forEach((particle) => particle.explode());
      } else if (value === 0) {
        this.particles.forEach((particle) => particle.reset());
      }
      return;
    }

    switch (controller) {
      case 1: // Colonnes
        this.cols = Math.max(1, Math.floor((value / 127) * 20 + 1));
        this.createGrid();
        break;
      case 2: // Lignes
        this.rows = Math.max(1, Math.floor((value / 127) * 20 + 1));
        this.createGrid();
        break;
      case 3: // Magnification
        this.magnification = value / 127;
        break;
      case 4: // Amplitude du mouvement
        this.motionAmplitude = value / 127;
        break;
    }
  }

  updateAllLetters(letter) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = letter;
      }
    }
  }

  createParticles() {
    this.particles = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const baseX =
          col * this.letterSize * 1.5 - (this.cols * this.letterSize * 1.5) / 2;
        const baseY =
          row * this.letterSize * 1.5 - (this.rows * this.letterSize * 1.5) / 2;

        // Calculate initial parameters
        const distance = Math.sqrt(baseX * baseX + baseY * baseY);
        const maxDistance =
          Math.sqrt(
            Math.pow(this.cols * this.letterSize, 2) +
              Math.pow(this.rows * this.letterSize, 2)
          ) / 2;

        const angle = Math.atan2(baseY, baseX);

        const x = this.canvas.width / 2 + baseX;
        const y = this.canvas.height / 2 + baseY;

        this.particles.push(
          new Particle(
            x,
            y,
            this.grid[row][col],
            this.letterSize,
            baseX,
            baseY,
            angle,
            distance,
            maxDistance
          )
        );
      }
    }
  }

  getEffects(baseX, baseY) {
    const distance = Math.hypot(baseX, baseY);
    const maxDistance =
      Math.hypot(this.cols * this.letterSize, this.rows * this.letterSize) / 2;
    const scale = 1 + (1 - distance / maxDistance) * this.magnification;
    const angle = Math.atan2(baseY, baseX);
    const motion =
      this.magnification *
      Math.sin(this.time + distance * 0.05) *
      this.motionAmplitude;

    return {
      scale,
      motion: {
        x: Math.cos(angle) * motion * 20,
        y: Math.sin(angle) * motion * 20,
      },
    };
  }

  draw() {
    // Clear background
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#ffffff";

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Draw grid (either particles or normal)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const baseX =
          col * this.letterSize * 1.5 - (this.cols * this.letterSize * 1.5) / 2;
        const baseY =
          row * this.letterSize * 1.5 - (this.rows * this.letterSize * 1.5) / 2;
        const effects = this.getEffects(baseX, baseY);

        if (this.particles.length) {
          this.particles[row * this.cols + col].update(
            centerX,
            centerY,
            effects.scale,
            effects.motion
          );
          this.particles[row * this.cols + col].draw(this.ctx, effects.scale);
        } else {
          this.ctx.font = `${this.letterSize * effects.scale}px monospace`;
          this.ctx.fillText(
            this.grid[row][col],
            centerX + (baseX + effects.motion.x) * effects.scale,
            centerY + (baseY + effects.motion.y) * effects.scale
          );
        }
      }
    }
  }

  animate() {
    this.time += 0.03;
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
}
