export default class Particle {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = 2;
    this.alpha = 1;
    this.speed = 2 + Math.random() * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.fadeSpeed = 0.02;
    this.color = "red";
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= this.fadeSpeed;
    return this.alpha > 0;
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}
