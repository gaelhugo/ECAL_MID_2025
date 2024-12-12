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
      case 3: // Lettres
        const newIndex = Math.floor((value / 127) * (this.letters.length - 1));
        if (newIndex !== this.currentLetterIndex) {
          this.currentLetterIndex = newIndex;
          this.updateAllLetters(this.letters[this.currentLetterIndex]);
        }
        break;
      case 4: // Magnification
        this.magnification = value / 127;
        break;
      case 5: // Amplitude du mouvement
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

  draw() {
    // Fond noir
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.particles.length > 0) {
      // Mode particules
      this.particles.forEach((particle) => {
        // Recalculate scale based on current magnification
        const scale =
          1 +
          (1 - particle.distance / particle.maxDistance) * this.magnification;

        // Calculate motion effect with current parameters
        const motion =
          this.magnification *
          Math.sin(this.time + particle.distance * 0.05) *
          this.motionAmplitude;
        const offsetX = Math.cos(particle.angle) * motion * 20;
        const offsetY = Math.sin(particle.angle) * motion * 20;

        particle.update(
          this.canvas.width / 2,
          this.canvas.height / 2,
          offsetX,
          offsetY,
          scale
        );
        particle.draw(this.ctx);
      });
    } else {
      // Mode normal
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      this.ctx.fillStyle = "#ffffff";
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const baseX =
            col * this.letterSize * 1.5 -
            (this.cols * this.letterSize * 1.5) / 2;
          const baseY =
            row * this.letterSize * 1.5 -
            (this.rows * this.letterSize * 1.5) / 2;

          const distance = Math.sqrt(baseX * baseX + baseY * baseY);
          const maxDistance =
            Math.sqrt(
              Math.pow(this.cols * this.letterSize, 2) +
                Math.pow(this.rows * this.letterSize, 2)
            ) / 2;

          const scale = 1 + (1 - distance / maxDistance) * this.magnification;
          const angle = Math.atan2(baseY, baseX);

          const motion =
            this.magnification *
            Math.sin(this.time + distance * 0.05) *
            this.motionAmplitude;
          const offsetX = Math.cos(angle) * motion * 20;
          const offsetY = Math.sin(angle) * motion * 20;

          const x = centerX + (baseX + offsetX) * scale;
          const y = centerY + (baseY + offsetY) * scale;

          this.ctx.font = `${this.letterSize * scale}px monospace`;
          this.ctx.fillText(this.grid[row][col], x, y);
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
