import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import BaseApp from "./BaseApp";
import Grid from "./Grid";

export default class App extends BaseApp {
  /**
   * Constructeur de l'application qui initialise les éléments et démarre l'application
   */
  constructor() {
    super();
    this.setupElements();
    this.init();
  }

  /**
   * Configure les éléments de base de l'application:
   * - Crée et configure la vidéo pour la webcam
   */
  setupElements() {
    this.video = document.createElement("video");
    this.video.autoplay = true;
    document.body.appendChild(this.video);

    // this.handAnalyzer = new HandAnalyzer(this.ctx);
  }

  /**
   * Initialise l'application:
   * - Configure la détection des mains avec MediaPipe
   * - Démarre la webcam
   * - Configure les dimensions du canvas quand la vidéo est prête
   */
  async init() {
    // Imagine que tu prépares une boîte à outils magique pour reconnaître les mains.
    // Cette ligne c'est comme déballer et installer tous les outils dont on a besoin:
    // - Elle télécharge un "cerveau artificiel" (appelé WASM en langage technique)
    // - Elle prépare le navigateur à utiliser ce cerveau (comme brancher une machine)
    // - Elle installe tous les assistants nécessaires (comme TensorFlow, un outil d'intelligence artificielle)
    const vision = await FilesetResolver.forVisionTasks("./wasm");

    // Maintenant, on crée notre "détecteur de mains" (HandLandmarker en anglais).
    // C'est comme un artiste qui sait dessiner des points sur les mains:
    // - Il utilise un "modèle" (comme un guide de dessin) pour reconnaître les mains
    // - Il travaille en deux étapes:
    //   1. Il repère les mains dans l'image (comme trouver une forme dans un dessin)
    //   2. Il place des points spéciaux sur chaque main (comme relier les points d'un dessin)
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `./hand_landmarker.task`, // Notre "guide de dessin" (6 Mo de données)
        delegate: "GPU", // On utilise la carte graphique (comme un assistant rapide)
      },
      // Le mode VIDEO, c'est comme avoir une mémoire:
      // - Il se rappelle où étaient les mains avant
      // - Il peut les suivre même quand elles bougent vite
      // (comme suivre une balle qui rebondit)
      runningMode: "VIDEO",
      // On lui dit de chercher maximum 2 mains en même temps
      // (comme un jongleur qui ne peut suivre que 2 balles)
      numHands: 2,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080 },
    });
    this.video.srcObject = stream;

    this.video.addEventListener("loadeddata", () => {
      const { videoWidth, videoHeight } = this.video;
      [this.canvas, this.video].forEach((el) => {
        el.width = el.style.width = videoWidth;
        el.height = el.style.height = videoHeight;
      });

      this.grid = new Grid(this.canvas, this.ctx);
      this.draw();
    });

    async function listAudioFiles() {
      try {
        const response = await fetch("audio/");
        const text = await response.text();
        console.log("Audio files:", text);
      } catch (error) {
        console.error("Error listing audio files:", error);
      }
    }

    // Call this in your init() method
    listAudioFiles();
  }

  isPinching(landmarks) {
    // Distance between index finger tip (landmark 8) and thumb tip (landmark 4)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    // if one of the fingers is not detected, return false
    // if (!thumbTip || !indexTip) return false;

    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2)
    );

    // If the distance is small enough, consider it a pinch
    return distance < 0.1;
  }

  /**
   * Analyse la frame vidéo courante pour détecter les mains et créer les mots correspondantes
   */
  detect() {
    const results = this.handLandmarker.detectForVideo(
      this.video,
      performance.now()
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the grid first
    this.grid.draw();

    if (results.landmarks) {
      results.landmarks.forEach((landmarks) => {
        // Check for pinch gesture
        const isPinching = this.isPinching(landmarks);

        // Use the position of the index finger tip (landmark 8) for interaction
        const x = landmarks[8].x * this.canvas.width;
        const y = landmarks[8].y * this.canvas.height;
        this.grid.checkPinch(x, y, isPinching);

        // Draw hand landmarks
        drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 3,
        });
        drawLandmarks(this.ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 1,
        });
      });
    }
  }

  /**
   * Lance la boucle d'animation qui détecte et affiche les mains en continu
   */
  draw() {
    this.detect();
    requestAnimationFrame(this.draw.bind(this));
  }
}
