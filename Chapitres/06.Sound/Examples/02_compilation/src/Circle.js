import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  constructor() {
    super();
    this.audioFile = "./audio/noise.m4a";
    this.audio = new Audio(this.audioFile);
    this.init();
  }
  init() {
    document.addEventListener("click", (e) => {
      this.play(e);
    });
    document.addEventListener("keydown", (e) => {
      console.log(e);
      this.audio.pause();
      this.isPlaying = false;
    });
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.initBroadcast();
    this.setupAnalyser();
  }

  initBroadcast() {
    this.source = this.audioContext.createMediaElementSource(this.audio);
  }

  setupAnalyser() {
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    console.log(this.audioContext.destination);
    //expliquer
    this.analyser.fftSize = 2048;
    //expliquer
    this.bufferLength = this.analyser.frequencyBinCount;
    //tableau de data (2 type)
    this.dataFrequency = new Uint8Array(this.bufferLength);
    this.dataFloatFrequency = new Float32Array(this.bufferLength);
    this.dataWave = new Uint8Array(this.bufferLength);
    this.draw();
  }
  updateWaveForm() {
    this.analyser.getByteTimeDomainData(this.dataWave);
  }
  updateFrequency() {
    this.analyser.getByteFrequencyData(this.dataFrequency);
  }
  updatedFloatFrequency() {
    this.analyser.getFloatFrequencyData(this.dataFloatFrequency);
  }
  play(mouse) {
    if (!this.isPlaying) {
      if (!this.audioContext) {
        this.initAudioContext();
      }
      this.audio.play();
      this.isPlaying = true;
    } else {
      // this.audio.pause();
      // this.isPlaying = false;
      let timeToStart =
        (mouse.clientX / window.innerWidth) * this.audio.duration;
      this.audio.currentTime = timeToStart;
    }
  }

  draw() {
    const { ctx, width, height } = this;

    // Mise à jour des données audio
    this.updateWaveForm();
    this.updateFrequency();
    this.updatedFloatFrequency();

    const dataWave = this.dataWave;
    const dataFrequency = this.dataFrequency;
    const bufferLength = this.bufferLength;

    if (this.isPlaying) {
      // CIRCLE BASED ON FREQUENCY (double)
      //   ctx.fillStyle = "black";
      //   ctx.fillRect(0, 0, width, height);

      //   let offset = 380;
      //   let offsetFreq = 40;
      //   let range = bufferLength - (offset + offsetFreq);
      //   let angle = (Math.PI * 1) / range;
      //   let centerX = width / 2;
      //   let centerY = height / 2;
      //   ctx.fillStyle = "white";
      //   ctx.beginPath();
      //   for (let i = 0; i < range; i++) {
      //     const freq = dataFrequency[i + offsetFreq];
      //     const radius = height / 4 + freq * 2;
      //     const x = Math.cos(angle * i) * radius + centerX;
      //     const y = Math.sin(angle * i) * radius + centerY;

      //     if (i == 0) {
      //       ctx.moveTo(x, y);
      //     } else {
      //       ctx.lineTo(x, y);
      //     }
      //   }

      //   for (let i = range; i > 0; i--) {
      //     const freq = dataFrequency[i + offsetFreq];
      //     const radius = height / 4 + freq * 2;
      //     const x = Math.cos(-angle * i) * radius + centerX;
      //     const y = Math.sin(-angle * i) * radius + centerY;
      //     ctx.lineTo(x, y);
      //   }

      //   ctx.closePath();
      //   ctx.fill();
      //   ctx.stroke();

      //   // CIRCLE BASED ON WAVE (double)
      //   ctx.fillStyle = "black";
      //   offset = 0;
      //   offsetFreq = 0;
      //   range = bufferLength - (offset + offsetFreq);
      //   angle = (Math.PI * 1) / range;

      //   ctx.beginPath();
      //   for (let i = 0; i < range; i++) {
      //     const freq = dataWave[i + offsetFreq];
      //     const radius = 10 + freq;
      //     const x = Math.cos(angle * i) * radius + centerX;
      //     const y = Math.sin(angle * i) * radius + centerY;

      //     if (i == 0) {
      //       ctx.moveTo(x, y);
      //     } else {
      //       ctx.lineTo(x, y);
      //     }
      //   }

      //   for (let i = range; i > 0; i--) {
      //     const freq = dataWave[i + offsetFreq];
      //     const radius = 10 + freq;
      //     const x = Math.cos(-angle * i) * radius + centerX;
      //     const y = Math.sin(-angle * i) * radius + centerY;
      //     ctx.lineTo(x, y);
      //   }

      //   ctx.closePath();
      //   ctx.fill();
      //   ctx.stroke();
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      let offset = 150;
      let offsetFreq = 40;
      let range = bufferLength - (offset + offsetFreq);
      let angle = (Math.PI * 1) / range;
      let centerX = width / 2;
      let centerY = height / 2;
      ctx.fillStyle = "white";
      ctx.beginPath();
      for (let i = 0; i < range; i++) {
        const freq = dataFrequency[i + offsetFreq];
        const radius = height / 4 + freq * 0.5;
        const x = Math.cos(angle * i) * radius + centerX;
        const y = Math.sin(angle * i) * radius + centerY;

        if (i == 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      for (let i = range; i > 0; i--) {
        const freq = dataFrequency[i + offsetFreq];
        const radius = height / 4 + freq * 0.5;
        const x = Math.cos(-angle * i) * radius + centerX;
        const y = Math.sin(-angle * i) * radius + centerY;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // CIRCLE BASED ON WAVE (double)
      ctx.fillStyle = "black";
      offset = 0;
      offsetFreq = 0;
      range = bufferLength - (offset + offsetFreq);
      angle = (Math.PI * 1) / range;

      ctx.beginPath();
      for (let i = 0; i < range; i++) {
        const freq = dataWave[i + offsetFreq];
        const radius = freq / 6;
        const x = Math.cos(angle * i) * radius + centerX;
        const y = Math.sin(angle * i) * radius + centerY;

        if (i == 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      for (let i = range; i > 0; i--) {
        const freq = dataWave[i + offsetFreq];
        const radius = freq / 6;
        const x = Math.cos(-angle * i) * radius + centerX;
        const y = Math.sin(-angle * i) * radius + centerY;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
