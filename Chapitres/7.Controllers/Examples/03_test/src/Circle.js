export default class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.color = "black";

    this.angle = 0;
    this.bigRadiusX = 50;
    this.bigRadiusY = 300;
    this.center = {
      x: x,
      y: y,
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move() {
    this.x =
      this.center.x + Math.cos((this.angle * Math.PI) / 180) * this.bigRadiusX;
    this.y =
      this.center.y + Math.sin((this.angle * Math.PI) / 180) * this.bigRadiusY;

    this.angle += 1;
  }
}
