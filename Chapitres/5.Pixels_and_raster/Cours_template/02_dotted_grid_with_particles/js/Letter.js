export default class Letter {
  constructor(ctx, letter, x, y) {
    this.ctx = ctx;
    this.letter = letter;
    this.x = x;
    this.y = y;
    this.color = "white";
    this.scale = 1;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.letter, 0, 0);
    this.ctx.fill();
    this.ctx.restore();
  }
}
