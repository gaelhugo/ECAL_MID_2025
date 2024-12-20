import BaseApp from "./BaseApp";
import Circle from "./Circle";

export default class App extends BaseApp {
  constructor() {
    super();
    this.circle = null;
    this.init();
  }

  init() {
    console.log("🚀 - App initialized");

    // Créer un cercle au centre du canvas
    this.circle = new Circle(
      this.ctx,
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    // Configuration MIDI
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(this.setupMIDI.bind(this))
        .catch((err) => console.error(err));
    }

    // Démarrer la boucle d'animation
    this.animate();
  }

  setupMIDI(midiAccess) {
    // Connexion à toutes les entrées MIDI
    const inputs = midiAccess.inputs.values();
    for (const input of inputs) {
      console.log("🎹", input);
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }
  // La "command" est le type de message MIDI reçu:
  // - 144 (0x90): Note On (touche enfoncée)
  // - 128 (0x80): Note Off (touche relâchée)
  // - 176 (0xB0): Control Change (potentiomètre/slider)

  // La "controller" est le numéro du potentiomètre/slider
  // La "value" est la valeur du potentiomètre/slider (0-127)
  handleMIDIMessage(message) {
    console.log(message);
    const [command, controller, value] = message.data;
    if (command != 248) console.log("🎹", command, controller, value);
    // Associer le potentiomètre 1 à la position X et le potentiomètre 2 à la position Y
    switch (controller) {
      case 0: // Position X
        const x = (value / 127) * this.canvas.width;
        this.circle.setPosition(x, this.circle.y);
        break;
      case 1: // Position Y
        const y = (value / 127) * this.canvas.height;
        this.circle.setPosition(this.circle.x, y);
        break;
    }
  }

  animate() {
    // Effacer le canvas et redessiner le cercle
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.circle.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
}
