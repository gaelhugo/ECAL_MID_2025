export default class WebcamManager {
  constructor() {
    this.video = null;
    this.stream = null;
  }

  async initialize() {
    try {
      // Créer l'élément vidéo
      this.video = document.createElement("video");
      this.video.style.width = "100%";
      this.video.style.height = "100%";
      this.video.style.objectFit = "cover";
      document.body.appendChild(this.video);

      // Obtenir le flux de la webcam
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      this.video.srcObject = this.stream;
      this.video.play();
    } catch (error) {
      console.error("Erreur d'accès à la webcam:", error);
    }
  }

  getVideo() {
    return this.video;
  }
}
