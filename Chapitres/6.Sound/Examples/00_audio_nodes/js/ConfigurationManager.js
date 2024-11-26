export default class ConfigurationManager {
  constructor(app) {
    this.app = app;
    this.createUI();
  }

  createUI() {
    const container = document.createElement("div");
    container.className = "config-manager";

    // Save button
    const saveButton = document.createElement("button");
    saveButton.className = "config-button save-button";
    saveButton.textContent = "Save Config";
    saveButton.addEventListener("click", () => this.saveConfiguration());

    // Load button with file input
    const loadButton = document.createElement("button");
    loadButton.className = "config-button load-button";
    loadButton.textContent = "Load Config";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", (e) =>
      this.loadConfiguration(e.target.files[0])
    );

    loadButton.addEventListener("click", () => fileInput.click());

    container.appendChild(saveButton);
    container.appendChild(loadButton);
    container.appendChild(fileInput);

    document.body.appendChild(container);
  }

  saveConfiguration() {
    const config = {
      modules: [],
      connections: [],
    };

    // Save modules
    this.app.modules.forEach((module) => {
      const moduleConfig = {
        id: module.id,
        type: module.constructor.name.replace("Module", "").toLowerCase(),
        x: module.x,
        y: module.y,
        settings: this.getModuleSettings(module),
      };
      config.modules.push(moduleConfig);
    });

    // Save connections
    this.app.connections.forEach((conn) => {
      config.connections.push({
        from: conn.from,
        to: conn.to,
      });
    });

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synth-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async loadConfiguration(file) {
    try {
      const text = await file.text();
      const config = JSON.parse(text);

      // Clear existing setup
      this.app.stopAudio();
      this.app.connections = [];
      this.app.modules.forEach((module) => {
        module.element.remove();
      });
      this.app.modules.clear();

      // Reset module ID counter
      this.app.moduleId = 0;

      // Create modules with their original IDs
      for (const moduleConfig of config.modules) {
        // Handle both visualizer types
        let type = moduleConfig.type;
        if (type === "soundwavevisualizer") type = "visualizer";
        if (type === "spectrumvisualizer") type = "spectrum";

        const module = this.app.createModule(
          type,
          moduleConfig.x,
          moduleConfig.y,
          moduleConfig.id
        );

        if (module) {
          this.applyModuleSettings(module, moduleConfig.settings);
        }
      }

      // Create connections after all modules are created
      requestAnimationFrame(() => {
        for (const conn of config.connections) {
          const fromModule = this.app.modules.get(conn.from);
          const toModule = this.app.modules.get(conn.to);
          if (fromModule && toModule) {
            this.app.createConnection(fromModule, toModule);
          }
        }
      });
    } catch (error) {
      console.error("Error loading configuration:", error);
      alert("Error loading configuration file");
    }
  }

  getModuleSettings(module) {
    const settings = {};

    try {
      // First get all control values from the UI
      if (module.controls && module.element) {
        settings.controls = module.controls.map((control, index) => {
          const input = module.element.querySelector(
            `input[type="range"]:nth-of-type(${index + 1}), 
             select:nth-of-type(${index + 1}),
             input[type="number"]:nth-of-type(${index + 1})`
          );
          return input ? input.value : control.value;
        });
      }

      // Then get specific module settings
      switch (module.constructor.name) {
        case "SequencerModule":
          // Save sequence data
          settings.sequence = Array(module.steps)
            .fill(null)
            .map((_, i) => {
              const select = module.element.querySelector(
                `.sequencer-step:nth-child(${i + 1}) select`
              );
              return select ? select.value : "";
            });
          settings.bpm = module.bpm;
          settings.isPlaying = module.isPlaying;
          break;

        case "SlicerModule":
          // Save slicer pattern
          settings.sequence = Array(module.steps)
            .fill(null)
            .map((_, i) => {
              const step = module.element.querySelector(
                `.slicer-step:nth-child(${i + 1})`
              );
              return step && step.classList.contains("active") ? 1 : 0;
            });
          settings.bpm = module.bpm;
          settings.depth = module.depth;
          settings.isPlaying = module.isPlaying;
          break;

        case "OscillatorModule":
          if (module.audioNode) {
            settings.waveform = module.audioNode.type;
            if (module.audioNode.frequency) {
              settings.frequency = module.audioNode.frequency.value;
            }
          }
          break;

        case "GainModule":
          if (module.audioNode && module.audioNode.gain) {
            settings.gain = module.audioNode.gain.value;
          }
          break;

        case "LFOModule":
          if (module.audioNode) {
            settings.waveform = module.audioNode.type;
            if (module.audioNode.frequency) {
              settings.rate = module.audioNode.frequency.value;
            }
          }
          if (module.gainNode && module.gainNode.gain) {
            settings.depth = module.gainNode.gain.value;
          }
          break;

        case "DelayModule":
          if (module.audioNode && module.audioNode.delayTime) {
            settings.time = module.audioNode.delayTime.value;
          }
          if (module.feedbackGain && module.feedbackGain.gain) {
            settings.feedback = module.feedbackGain.gain.value;
          }
          break;

        case "KeyboardModule":
          settings.sustain = module.sustain;
          break;

        case "ReverbModule":
          if (module.audioNode) {
            settings.mix = module.mix;
            settings.decay = module.decay;
          }
          break;

        case "SoundwaveVisualizerModule":
        case "SpectrumVisualizerModule":
          settings.type = module.constructor.name
            .replace("Module", "")
            .toLowerCase();
          break;
      }
    } catch (error) {
      console.warn(
        `Error getting settings for ${module.constructor.name}:`,
        error
      );
    }

    return settings;
  }

  applyModuleSettings(module, settings) {
    if (!settings) return;

    try {
      // First restore all control values
      if (settings.controls && module.controls && module.element) {
        settings.controls.forEach((value, index) => {
          const input = module.element.querySelector(
            `input[type="range"]:nth-of-type(${index + 1}), 
             select:nth-of-type(${index + 1}),
             input[type="number"]:nth-of-type(${index + 1})`
          );
          if (input) {
            input.value = value;
            // Trigger the change event to update the audio parameters
            const event = new Event("change");
            input.dispatchEvent(event);

            // Also trigger input event for sliders to update any visual feedback
            if (input.type === "range") {
              const inputEvent = new Event("input");
              input.dispatchEvent(inputEvent);
            }
          }
        });
      }

      // Then apply specific module settings
      switch (module.constructor.name) {
        case "SequencerModule":
          if (settings.sequence) {
            settings.sequence.forEach((note, index) => {
              const select = module.element.querySelector(
                `.sequencer-step:nth-child(${index + 1}) select`
              );
              if (select) {
                select.value = note;
                // Trigger change event to update visual state
                const event = new Event("change");
                select.dispatchEvent(event);
              }
            });
          }
          if (settings.bpm) {
            module.bpm = settings.bpm;
            const bpmInput = module.element.querySelector(
              'input[type="number"]'
            );
            if (bpmInput) bpmInput.value = settings.bpm;
          }
          // Restore playing state if it was playing
          if (settings.isPlaying) {
            const playButton = module.element.querySelector(
              ".sequencer-play-button"
            );
            if (playButton) {
              setTimeout(() => playButton.click(), 100); // Small delay to ensure proper initialization
            }
          }
          break;

        case "SlicerModule":
          if (settings.sequence) {
            settings.sequence.forEach((active, index) => {
              const step = module.element.querySelector(
                `.slicer-step:nth-child(${index + 1})`
              );
              if (step) {
                if (active) {
                  step.classList.add("active");
                } else {
                  step.classList.remove("active");
                }
                module.sequence[index] = active;
              }
            });
          }
          if (settings.bpm) {
            module.bpm = settings.bpm;
            // Update BPM display
            const bpmDisplay = module.element.querySelector(".bpm-value");
            if (bpmDisplay) bpmDisplay.textContent = settings.bpm;
          }
          if (settings.depth) {
            module.depth = settings.depth;
          }
          // Restore playing state if it was playing
          if (settings.isPlaying) {
            const playButton = module.element.querySelector(
              ".slicer-play-button"
            );
            if (playButton) {
              setTimeout(() => playButton.click(), 100);
            }
          }
          break;

        case "OscillatorModule":
          if (settings.waveform) module.audioNode.type = settings.waveform;
          if (settings.frequency) {
            module.audioNode.frequency.setValueAtTime(
              settings.frequency,
              module.audioContext.currentTime
            );
          }
          break;

        case "GainModule":
          if (settings.gain) {
            module.audioNode.gain.setValueAtTime(
              settings.gain,
              module.audioContext.currentTime
            );
          }
          break;

        case "LFOModule":
          if (settings.waveform) module.audioNode.type = settings.waveform;
          if (settings.rate) {
            module.audioNode.frequency.setValueAtTime(
              settings.rate,
              module.audioContext.currentTime
            );
          }
          if (settings.depth) {
            module.gainNode.gain.setValueAtTime(
              settings.depth,
              module.audioContext.currentTime
            );
          }
          break;

        case "DelayModule":
          if (settings.time) {
            module.audioNode.delayTime.setValueAtTime(
              settings.time,
              module.audioContext.currentTime
            );
          }
          if (settings.feedback) {
            module.feedbackGain.gain.setValueAtTime(
              settings.feedback,
              module.audioContext.currentTime
            );
          }
          break;

        case "KeyboardModule":
          if (typeof settings.sustain !== "undefined") {
            module.sustain = settings.sustain;
            // Update the sustain checkbox
            const sustainCheckbox =
              module.element.querySelector(".sustain-checkbox");
            if (sustainCheckbox) {
              sustainCheckbox.checked = settings.sustain;
              // Trigger the change event to update any related state
              const event = new Event("change");
              sustainCheckbox.dispatchEvent(event);
            }
          }
          break;

        case "ReverbModule":
          if (settings.mix) module.mix = settings.mix;
          if (settings.decay) module.decay = settings.decay;
          break;

        case "SoundwaveVisualizerModule":
        case "SpectrumVisualizerModule":
          if (module.startAnimation) {
            module.startAnimation();
          }
          break;
      }

      // Update UI elements
      if (module.element) {
        module.element.querySelectorAll("input, select").forEach((input) => {
          if (input.type !== "checkbox") {
            // Skip checkboxes as they're handled separately
            const event = new Event("change");
            input.dispatchEvent(event);
          }
        });
      }
    } catch (error) {
      console.warn(
        `Error applying settings for ${module.constructor.name}:`,
        error
      );
    }
  }
}
