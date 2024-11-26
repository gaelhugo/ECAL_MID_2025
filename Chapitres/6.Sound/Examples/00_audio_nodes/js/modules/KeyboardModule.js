import BaseModule from "./BaseModule.js";

export default class KeyboardModule extends BaseModule {
  constructor(audioContext, id, x, y) {
    super(audioContext, id, x, y);
    this.title = "Keyboard";
    this.outputs = ["frequency"];
    this.connectedOscillators = new Set();
    this.sustain = true; // Default to sustain mode
    this.frequencies = {
      C: 261.63, // C4
      "C#": 277.18,
      D: 293.66,
      "D#": 311.13,
      E: 329.63,
      F: 349.23,
      "F#": 369.99,
      G: 392.0,
      "G#": 415.3,
      A: 440.0, // A4
      "A#": 466.16,
      B: 493.88,
      C5: 523.25, // C5
    };
  }

  createDOM() {
    const element = document.createElement("div");
    element.className = "audio-module module-keyboard";
    element.id = this.id;
    element.style.left = `${this.x}px`;
    element.style.top = `${this.y}px`;

    // Add title
    const title = document.createElement("div");
    title.className = "module-title";
    title.textContent = this.title;
    element.appendChild(title);

    // Add sustain control
    const sustainControl = document.createElement("div");
    sustainControl.className = "sustain-control";

    const sustainLabel = document.createElement("label");
    sustainLabel.textContent = "Sustain";
    sustainLabel.className = "sustain-label";

    const sustainCheckbox = document.createElement("input");
    sustainCheckbox.type = "checkbox";
    sustainCheckbox.checked = this.sustain;
    sustainCheckbox.className = "sustain-checkbox";
    sustainCheckbox.addEventListener("change", (e) => {
      this.sustain = e.target.checked;
      if (!this.sustain) {
        this.stopAllNotes();
      }
      this.updateKeyEventListeners(); // Update event listeners when sustain changes
    });

    sustainControl.appendChild(sustainLabel);
    sustainControl.appendChild(sustainCheckbox);
    element.appendChild(sustainControl);

    // Add keyboard container
    const keyboardContainer = document.createElement("div");
    keyboardContainer.className = "keyboard-container";
    const keyboard = this.createControls();
    keyboard.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });
    keyboardContainer.appendChild(keyboard);
    element.appendChild(keyboardContainer);

    // Add connection points
    const connectionPoints = document.createElement("div");
    connectionPoints.className = "connection-points";
    const outputPoint = document.createElement("div");
    outputPoint.className = "connection-point output";
    outputPoint.style.top = "50%";
    connectionPoints.appendChild(outputPoint);
    element.appendChild(connectionPoints);

    this.element = element;
    return element;
  }

  createControls() {
    const keyboard = document.createElement("div");
    keyboard.className = "piano-keyboard";

    const whiteKeys = document.createElement("div");
    whiteKeys.className = "white-keys";

    ["C", "D", "E", "F", "G", "A", "B", "C5"].forEach((note) => {
      const key = document.createElement("div");
      key.className = "piano-key white-key";
      key.dataset.note = note;
      this.setupKeyEvents(key, note);
      whiteKeys.appendChild(key);
    });

    keyboard.appendChild(whiteKeys);

    ["C#", "D#", "F#", "G#", "A#"].forEach((note) => {
      const key = document.createElement("div");
      key.className = "piano-key black-key";
      key.dataset.note = note;
      this.setupKeyEvents(key, note);
      keyboard.appendChild(key);
    });

    return keyboard;
  }

  setupKeyEvents(key, note) {
    // Remove any existing listeners
    const newKey = key.cloneNode(true);
    key.parentNode?.replaceChild(newKey, key);

    // Add mousedown event
    newKey.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      this.playNote(note);
      newKey.classList.add("active");
    });

    // Add mouseup and mouseleave events
    newKey.addEventListener("mouseup", () => {
      if (!this.sustain) {
        this.stopAllNotes();
      }
      newKey.classList.remove("active");
    });

    newKey.addEventListener("mouseleave", () => {
      if (!this.sustain) {
        this.stopAllNotes();
      }
      newKey.classList.remove("active");
    });

    return newKey;
  }

  updateKeyEventListeners() {
    const keys = this.element.querySelectorAll(".piano-key");
    keys.forEach((key) => {
      const note = key.dataset.note;
      this.setupKeyEvents(key, note);
    });
  }

  playNote(note) {
    const frequency = this.frequencies[note];
    this.connectedOscillators.forEach((oscillator) => {
      if (oscillator.audioNode && oscillator.audioNode.frequency) {
        oscillator.audioNode.frequency.setValueAtTime(
          frequency,
          this.audioContext.currentTime
        );

        // Update the frequency slider
        const frequencySlider = oscillator.element.querySelector(
          'input[type="range"]'
        );
        if (frequencySlider) {
          frequencySlider.value = frequency;
          const event = new Event("input", { bubbles: true });
          frequencySlider.dispatchEvent(event);
        }
      }
    });
  }

  stopAllNotes() {
    this.connectedOscillators.forEach((oscillator) => {
      if (oscillator.audioNode && oscillator.audioNode.frequency) {
        oscillator.audioNode.frequency.setValueAtTime(
          0,
          this.audioContext.currentTime
        );
      }
    });
  }

  connect(module) {
    if (module.constructor.name === "OscillatorModule") {
      this.connectedOscillators.add(module);
      // Set initial frequency and update slider
      if (module.audioNode && module.audioNode.frequency) {
        const initialFreq = this.frequencies["A"];
        module.audioNode.frequency.setValueAtTime(
          initialFreq,
          this.audioContext.currentTime
        );

        const frequencySlider = module.element.querySelector(
          'input[type="range"]'
        );
        if (frequencySlider) {
          frequencySlider.value = initialFreq;
          const event = new Event("input", { bubbles: true });
          frequencySlider.dispatchEvent(event);
        }
      }
    }
  }

  disconnect(module) {
    if (module.constructor.name === "OscillatorModule") {
      this.connectedOscillators.delete(module);
    }
  }

  start() {
    // Set initial frequency for all connected oscillators
    this.connectedOscillators.forEach((oscillator) => {
      if (oscillator.audioNode && oscillator.audioNode.frequency) {
        oscillator.audioNode.frequency.setValueAtTime(
          this.frequencies["A"],
          this.audioContext.currentTime
        );
      }
    });
  }

  stop() {
    // Nothing to do on stop for the keyboard
  }
}
