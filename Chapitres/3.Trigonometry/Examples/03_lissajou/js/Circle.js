export default class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "black";
    this.angleX = 0;
    this.angleY = 0;
    this.speedX = 1;
    this.speedY = 1;
    this.center = {
      x: x,
      y: y,
    };
    this.motion_radiusX = 200;
    this.motion_radiusY = 200;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move() {
    // Lissajous curve

    this.x =
      this.center.x +
      Math.cos((this.angleX * Math.PI) / 180) * this.motion_radiusX;
    this.y =
      this.center.y +
      Math.sin((this.angleY * Math.PI) / 180) * this.motion_radiusY;

    this.angleX += this.speedX;
    this.angleY += this.speedY;
  }
}
