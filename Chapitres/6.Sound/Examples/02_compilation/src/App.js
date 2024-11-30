import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  constructor() {
    super();
    // Fichier audio à charger
    this.audioFile = "./audio/noise.m4a";
    // Création de l'élément audio HTML
    this.audio = new Audio(this.audioFile);
    this.init();
  }
  init() {
    // Gestion du clic pour lancer/contrôler l'audio
    document.addEventListener("click", (e) => {
      this.play(e);
    });
    // Gestion de l'arrêt avec n'importe quelle touche
    document.addEventListener("keydown", (e) => {
      console.log(e);
      this.audio.pause();
      this.isPlaying = false;
    });
  }

  initAudioContext() {
    // Création du contexte audio (compatible tous navigateurs)
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.initBroadcast();
    this.setupAnalyser();
  }

  initBroadcast() {
    // Création de la source audio à partir de l'élément HTML
    this.source = this.audioContext.createMediaElementSource(this.audio);
  }

  setupAnalyser() {
    // Création et configuration de l'analyseur audio
    this.analyser = this.audioContext.createAnalyser();
    // Connexion de la source à l'analyseur puis aux haut-parleurs
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    console.log(this.audioContext.destination);

    // Définition de la taille de la FFT (plus grand = plus précis mais plus lent)
    this.analyser.fftSize = 2048;
    // Nombre de valeurs de fréquence disponibles (fftSize / 2)
    this.bufferLength = this.analyser.frequencyBinCount;

    // Création des tableaux pour stocker les différentes données audio
    this.dataFrequency = new Uint8Array(this.bufferLength); // Données de fréquence (0-255)
    this.dataFloatFrequency = new Float32Array(this.bufferLength); // Données de fréquence (-1 à 1)
    this.dataWave = new Uint8Array(this.bufferLength); // Données de forme d'onde
    this.draw();
  }

  updateWaveForm() {
    // Récupération des données de forme d'onde
    this.analyser.getByteTimeDomainData(this.dataWave);
  }
  updateFrequency() {
    // Récupération des données de fréquence en bytes
    this.analyser.getByteFrequencyData(this.dataFrequency);
  }
  updatedFloatFrequency() {
    // Récupération des données de fréquence en float
    this.analyser.getFloatFrequencyData(this.dataFloatFrequency);
  }

  play(mouse) {
    if (!this.isPlaying) {
      // Initialisation du contexte audio au premier clic
      if (!this.audioContext) {
        this.initAudioContext();
      }
      this.audio.play();
      this.isPlaying = true;
    } else {
      // Navigation dans l'audio en fonction de la position horizontale du clic
      let timeToStart =
        (mouse.clientX / window.innerWidth) * this.audio.duration;
      this.audio.currentTime = timeToStart;
    }
  }

  draw() {
    // Mise à jour de toutes les données audio
    this.updateWaveForm();
    this.updateFrequency();
    this.updatedFloatFrequency();

    const { ctx, width, height, bufferLength } = this;

    const dataWave = this.dataWave;
    const dataFrequency = this.dataFrequency;
    const dataFloatFrequency = this.dataFloatFrequency;

    /** ################### PARTIE 1 ################### */

    // Effacement du canvas
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    // 1. Visualisation des barres de fréquence
    const barWidth = (width / bufferLength) * 3;
    ctx.fillStyle = "rgb(255, 255, 255)";
    for (let i = 0; i < bufferLength; i++) {
      const x = i * barWidth;
      const barHeight = dataFrequency[i] * (height / 256);
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      // Ajout de lignes horizontales pour les fréquences fortes
      if (dataFrequency[i] > 128 && i % 2 === 0) {
        ctx.fillRect(x, height / 2, barWidth * 2, 1);
      }
    }

    // 2. Visualisation de la grille verticale avec points de données
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 1;

    for (let i = 0; i < bufferLength; i += 6) {
      const x = (width / bufferLength) * i;
      const value = -dataFloatFrequency[i] * 5;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, value);
      ctx.fillRect(x, value, 2, 2);
    }
    ctx.stroke();

    // 3. Visualisation de la forme d'onde
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.lineWidth = 2;
    const sliceWidth = width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataWave[i] / 128.0;
      const y = (v * height) / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    // Animation en continu
    requestAnimationFrame(this.draw.bind(this));
  }
}
