export default class MidiController {
  constructor() {
    this.handlers = new Map();
    this.init();
  }

  init() {
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(this.setupMIDI.bind(this))
        .catch(console.error);
    }
  }

  setupMIDI(midiAccess) {
    for (const input of midiAccess.inputs.values()) {
      input.onmidimessage = this.handleMessage.bind(this);
    }
  }

  handleMessage(message) {
    const [command, controller, value] = message.data;
    const normalizedValue = value / 127;

    const handler = this.handlers.get(controller);
    if (handler) {
      handler(normalizedValue, value);
    }
  }

  on(controller, callback) {
    this.handlers.set(controller, callback);
  }
}
