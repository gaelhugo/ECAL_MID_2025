export default class Circle {
  constructor(context) {
    this.ctx = context;
  }

  draw(x, y, radius) {
    // this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    // this.ctx.stroke();
    this.ctx.fill();
  }

  drawCross(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x - radius, y);
    this.ctx.lineTo(x + radius, y);
    this.ctx.moveTo(x, y - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.stroke();
  }
}
