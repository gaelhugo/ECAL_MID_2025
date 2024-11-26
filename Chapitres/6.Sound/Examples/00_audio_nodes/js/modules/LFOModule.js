import BaseModule from "./BaseModule.js";

export default class LFOModule extends BaseModule {
  constructor(context, id, x, y) {
    super(context, id, x, y);
    this.type = "lfo";
    this.height = 180;

    // Create oscillator and gain for LFO
    this.audioNode = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // Set up initial connections
    this.audioNode.connect(this.gainNode);

    // Set up outputs
    this.outputs = [{ x: this.width, y: this.height / 2 }];

    // Create controls
    this.controls = [
      {
        type: "select",
        options: ["sine", "square", "sawtooth", "triangle"],
        value: "square",
        label: "LFO Wave",
        onChange: (value) => {
          if (this.audioNode) {
            this.audioNode.type = value;
          }
        },
      },
      {
        type: "slider",
        min: 0.1,
        max: 20,
        value: 2,
        step: 0.1,
        label: "LFO Rate",
        onChange: (value) => {
          if (this.audioNode && this.audioNode.frequency) {
            this.audioNode.frequency.setValueAtTime(
              value,
              this.audioContext.currentTime
            );
          }
        },
      },
      {
        type: "slider",
        min: 0,
        max: 100,
        value: 50,
        label: "Depth",
        onChange: (value) => {
          if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(
              value,
              this.audioContext.currentTime
            );
          }
        },
      },
    ];

    // Set initial values
    this.audioNode.frequency.setValueAtTime(2, this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(50, this.audioContext.currentTime);
  }

  start() {
    if (this.audioNode) {
      this.audioNode.start();
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.audioNode && this.isPlaying) {
      this.audioNode.stop();
      this.isPlaying = false;
      // Create new oscillator
      const newOsc = this.audioContext.createOscillator();
      newOsc.type = this.audioNode.type;
      newOsc.frequency.value = this.audioNode.frequency.value;
      this.audioNode = newOsc;
      this.audioNode.connect(this.gainNode);
    }
  }

  connect(destModule) {
    if (this.gainNode && destModule.audioNode) {
      if (destModule.type === "oscillator") {
        // Connect to frequency for modulation
        this.gainNode.connect(destModule.audioNode.frequency);
      } else {
        this.gainNode.connect(destModule.audioNode);
      }
    }
  }

  disconnect(destModule) {
    if (this.gainNode && destModule.audioNode) {
      this.gainNode.disconnect(destModule.audioNode.frequency);
      this.gainNode.disconnect(destModule.audioNode);
    }
  }
}
