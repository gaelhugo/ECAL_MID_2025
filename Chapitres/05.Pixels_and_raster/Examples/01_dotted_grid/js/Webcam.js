export default class Webcam {
  constructor() {
    this.video = document.createElement("video");
    this.video.width = 800;
    this.video.height = 800;
    // get user media
    navigator.mediaDevices
      .getUserMedia({ video: { width: 800, height: 800 } })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
  }
}
