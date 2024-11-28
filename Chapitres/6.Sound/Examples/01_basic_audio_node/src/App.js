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
    this.analyser.fftSize = 256;
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
    this.updateWaveForm();
    this.updateFrequency();
    this.updatedFloatFrequency();

    // console.log("%c" + this.dataFrequency, "background: lightgreen");
    // console.log("%c" + this.dataFloatFrequency, "background: green");
    // console.log("%c" + this.dataWave, "background: darkgreen");
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    const bufferLength = this.bufferLength;
    const dataWave = this.dataWave;
    const dataFrequency = this.dataFrequency;
    const dataFloatFrequency = this.dataFloatFrequency;

    // create visualisation
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);
    const barWidth = (width / bufferLength) * 3;
    const heightScale = height / 256;

    //`hsl(\${time * 50 % 360}, 70%, 60%)`;
    ctx.fillStyle = "red";
    // frequencies
    for (let i = 0; i < bufferLength; i++) {
      const value = dataFrequency[i];
      const x = i * barWidth;
      const barHeight = value * heightScale;
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
    }

    ctx.fillStyle = "yellow"; //`hsl(\${time * 50 % 360}, 70%, 60%)`;
    // float frequencies
    ctx.save();
    // ctx.translate(0, height);
    for (let i = 0; i < bufferLength; i++) {
      const value = dataFloatFrequency[i];
      const x = i * barWidth;
      const barHeight = value * heightScale;
      console.log(barHeight);
      ctx.fillRect(x, 0, barWidth - 1, -barHeight);
    }
    ctx.restore();

    // waves
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255,255)";
    ctx.lineWidth = 2;

    const sliceWidth = width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataWave[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    requestAnimationFrame(this.draw.bind(this));
  }
}
