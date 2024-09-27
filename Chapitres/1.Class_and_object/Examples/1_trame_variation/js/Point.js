export default class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.strokeStyle = "black";
    // ctx.beginPath();
    // ctx.moveTo(this.x - this.radius, this.y);
    // ctx.lineTo(this.x + this.radius, this.y);
    // ctx.moveTo(this.x, this.y - this.radius);
    // ctx.lineTo(this.x, this.y + this.radius);
    // ctx.lineWidth = 1;
    // ctx.stroke();
  }
}
