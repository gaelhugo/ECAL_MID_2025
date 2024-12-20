export default class ColorGradient {
  constructor(ctx, height = 30) {
    this.ctx = ctx;
    this.height = height;
    this.position = 0;
    this.colors = [
      { pos: 0, color: "red" },
      { pos: 0.2, color: "yellow" },
      { pos: 0.4, color: "lime" },
      { pos: 0.6, color: "cyan" },
      { pos: 0.8, color: "blue" },
      { pos: 1, color: "magenta" },
    ];
  }

  setPosition(position) {
    this.position = Math.max(0, Math.min(1, position));
  }

  createGradient(width) {
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    this.colors.forEach(({ pos, color }) => {
      gradient.addColorStop(pos, color);
    });
    return gradient;
  }

  getCurrentColor(width) {
    // Créer un canvas temporaire pour échantillonner la couleur
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext("2d");

    // Dessiner le gradient
    const gradient = this.createGradient(width);
    tempCtx.fillStyle = gradient;
    tempCtx.fillRect(0, 0, width, 1);

    // Obtenir la couleur à la position du curseur
    const x = Math.floor(this.position * width);
    const imageData = tempCtx.getImageData(x, 0, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  }

  draw(canvasWidth, canvasHeight) {
    // Dessiner la barre de gradient
    const y = canvasHeight - this.height;
    this.ctx.fillStyle = this.createGradient(canvasWidth);
    this.ctx.fillRect(0, y, canvasWidth, this.height);

    // Dessiner le curseur
    const cursorX = this.position * canvasWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(cursorX, y);
    this.ctx.lineTo(cursorX - 10, y - 10);
    this.ctx.lineTo(cursorX + 10, y - 10);
    this.ctx.closePath();
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.fill();
    this.ctx.stroke();
  }
}
