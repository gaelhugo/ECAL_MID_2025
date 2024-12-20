export default class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "black";
    this.angle = 0;
    this.center = {
      x: x,
      y: y,
    };
    this.motion_radius = 200;
    // this.motion_radiusX = 200;
    // this.motion_radiusY = 300;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move() {
    this.x =
      this.center.x +
      Math.cos((this.angle * Math.PI) / 180) * this.motion_radius;
    this.y =
      this.center.y +
      Math.sin((this.angle * Math.PI) / 180) * this.motion_radius;

    // this.x =
    //   this.center.x +
    //   Math.cos((this.angle * Math.PI) / 180) * this.motion_radiusX;
    // this.y =
    //   this.center.y +
    //   Math.sin((this.angle * Math.PI) / 180) * this.motion_radiusY;
    this.angle += 1;
  }
}
