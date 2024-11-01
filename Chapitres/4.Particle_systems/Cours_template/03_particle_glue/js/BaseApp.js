export default class BaseApp {
  constructor() {
    this.mouse = { x: 0, y: 0, isPressed: false };
    this.createCanvas();
    this.setupMouseEvents();
  }

  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  setupMouseEvents() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse.isPressed = true;
      this.updateMousePosition(e);
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouse.isPressed = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.isPressed) {
        this.updateMousePosition(e);
      }
    });
  }

  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }
}
