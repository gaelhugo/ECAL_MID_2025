export default class Circle {
  constructor(ctx, x = 0, y = 0, radius = 20) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#000000";
    this.ctx.fill();
    this.ctx.closePath();
  }
}
