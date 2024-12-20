import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { LetterPlacer } from "./LetterPlacer";
import { SpeechListener } from "./SpeechListener";
import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  /**
   * Constructeur de l'application qui initialise les éléments et démarre l'application
   */
  constructor() {
    super();
    this.setupElements();
    this.setupSpeechRecognition();
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
  }

  /**
   * Configure et démarre la reconnaissance vocale
   */
  setupSpeechRecognition() {
    // Crée l'écouteur de parole
    this.speechListener = new SpeechListener(null);

    // Démarre l'écoute
    this.speechListener.start();
  }

  /**
   * Initialise l'application:
   * - Configure la détection des mains avec MediaPipe
   * - Démarre la webcam
   * - Configure les dimensions du canvas quand la vidéo est prête
   */
  async init() {
    // Imagine que tu prépares une boîte à outils pour reconnaître les mains.
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
      [this.canvas, this.video].forEach((el) => {
        el.width = el.style.width = 1920;
        el.height = el.style.height = 1080;
      });
      this.draw();
    });
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

    if (results.landmarks) {
      // Initialise le tableau de letterPlacers si nécessaire
      if (
        !this.letterPlacers ||
        this.letterPlacers.length !== results.landmarks.length
      ) {
        this.letterPlacers = results.landmarks.map(
          () => new LetterPlacer(this.ctx, this.speechListener)
        );
      }
      results.landmarks.forEach((landmarks, index) => {
        drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 3,
        });
        drawLandmarks(this.ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 1,
        });

        // this.handAnalyzer.analyzePinchDistance(landmarks);
        // const letter = new LetterPlacer(this.ctx, this.speechListener);
        this.letterPlacers[index].analyzePinchDistance(landmarks);
        // this.allLetters.push(letter);
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
