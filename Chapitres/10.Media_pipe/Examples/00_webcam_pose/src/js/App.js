import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

export default class App {
  constructor() {
    console.log("constructor");
    this.init();
  }

  async init() {
    console.log("init");
    // 1. Créer les éléments de base
    this.setupDOMElements();

    // 2. Initialiser le détecteur de mains
    await this.setupHandLandmarker();

    // 3. Démarrer la webcam
    await this.startWebcam();
  }

  setupDOMElements() {
    // Créer et configurer le canvas
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // Créer et configurer l'élément vidéo
    this.video = document.createElement("video");
    this.video.autoplay = true;
    document.body.appendChild(this.video);
  }

  async setupHandLandmarker() {
    // Charger les fichiers nécessaires pour la vision par ordinateur
    const vision = await FilesetResolver.forVisionTasks(
      "node_modules/@mediapipe/tasks-vision/wasm"
    );

    // Créer le détecteur de mains avec les options
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
  }

  async startWebcam() {
    // Vérifier si la webcam est supportée
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn("getUserMedia() n'est pas supporté par votre navigateur");
      return;
    }

    try {
      // Accéder à la webcam avec la plus haute résolution possible
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      // Connecter le flux à l'élément vidéo
      this.video.srcObject = stream;

      // Attendre que la vidéo soit chargée
      this.video.addEventListener("loadeddata", () => {
        // Configurer les dimensions pour correspondre à la vidéo
        const updateDimensions = () => {
          // Utiliser les dimensions réelles de la vidéo
          const videoWidth = this.video.videoWidth;
          const videoHeight = this.video.videoHeight;

          // Appliquer les mêmes dimensions au canvas
          this.canvas.width = videoWidth;
          this.canvas.height = videoHeight;

          // Appliquer les dimensions via CSS pour maintenir le ratio
          this.canvas.style.width = `${videoWidth}px`;
          this.canvas.style.height = `${videoHeight}px`;
          this.video.style.width = `${videoWidth}px`;
          this.video.style.height = `${videoHeight}px`;
        };

        // Mettre à jour les dimensions initialement
        updateDimensions();

        // Démarrer la détection
        this.startDetection();
      });
    } catch (error) {
      console.error("Erreur d'accès à la webcam:", error);
    }
  }

  startDetection() {
    let lastVideoTime = -1;

    const detectFrame = async () => {
      // Ne détecter que si la frame a changé
      if (lastVideoTime !== this.video.currentTime) {
        lastVideoTime = this.video.currentTime;

        // Détecter les mains
        const results = this.handLandmarker.detectForVideo(
          this.video,
          performance.now()
        );

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner les résultats
        if (results.landmarks) {
          for (const landmarks of results.landmarks) {
            drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 3,
            });
            drawLandmarks(this.ctx, landmarks, {
              color: "#FF0000",
              lineWidth: 1,
            });
          }
        }
      }

      // Continuer la boucle
      requestAnimationFrame(detectFrame);
    };

    // Démarrer la boucle de détection
    detectFrame();
  }
}
