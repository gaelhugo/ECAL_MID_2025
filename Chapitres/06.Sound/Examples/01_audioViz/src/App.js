import BaseApp from "./BaseApp";
export default class App extends BaseApp {
  constructor() {
    super();
    // Fichier audio à charger
    this.audioFile = "./noise.m4a";
    // Création de l'élément audio HTML
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      if (!this.audioContext) {
        // On vérifie si le contexte audio est disponible
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        // on récupère le contexte audio
        this.audioContext = new AudioContext();
        //
        this.setup();
      }

      const postion_souris_x = e.clientX;
      // pourcentage par rapport à la largeur de la fenêtre
      const pourcentage = postion_souris_x / window.innerWidth;
      // on met à jour la position de la lecture
      this.audio.currentTime = this.audio.duration * pourcentage;
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    });
  }

  setup() {
    // on crée un noeud source
    this.source = this.audioContext.createMediaElementSource(this.audio);
    // on crée un noeud d'analyse
    this.analyser = this.audioContext.createAnalyser();
    // crée un noeud de destination
    this.destination = this.audioContext.destination;
    // on connecte le noeud source à l'analyseur
    this.source.connect(this.analyser);
    // on connecte l'analyseur à la destination
    this.analyser.connect(this.destination);
    // on definie la taille du buffer
    this.analyser.fftSize = 2048;
    // on crée un tableau de données pour l'anayse de frequences (en Byte)
    this.dataArray = new Uint8Array(this.analyser.fftSize);
    // on crée un tableau de données pour l'anayse de waveform (en Byte)
    this.waveArray = new Uint8Array(this.analyser.fftSize);
    this.draw();
  }

  // on crée une méthode pour analyser les données de frenquences
  analyseFrequencies() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  // on crée une méthode pour analyser les données de waveform
  analyseWaveform() {
    this.analyser.getByteTimeDomainData(this.waveArray);
  }

  draw() {
    console.log("draw");
    this.analyseFrequencies();
    this.analyseWaveform();

    this.ctx.clearRect(0, 0, this.width, this.height);

    // visualisation des frequences
    const barWidth = this.width / (this.dataArray.length / 2);
    let x = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const barHeight = this.dataArray[i] * 3;
      this.ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      this.ctx.fillRect(x, this.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }

    // visualisation de la waveform
    const waveSpace = this.width / this.waveArray.length;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    for (let i = 0; i < this.waveArray.length; i++) {
      const y = (this.waveArray[i] / 128) * this.height - this.height / 2;
      this.ctx.lineTo(i * waveSpace, y);
    }
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

    requestAnimationFrame(this.draw.bind(this));
  }
}
