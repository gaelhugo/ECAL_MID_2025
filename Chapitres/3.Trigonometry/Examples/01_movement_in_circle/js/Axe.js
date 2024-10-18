export default class Axe {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.color = "red";
  }

  draw(ctx) {
    // draw axis x and y
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(0, this.y);
    ctx.lineTo(this.width, this.y);
    ctx.stroke();
    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, this.height);
    ctx.stroke();
  }
}
