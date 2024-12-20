export default class Particle {
  constructor(x, y, letter, size, baseX, baseY) {
    // Position and movement
    this.x = x;
    this.y = y;
    this.baseX = baseX;
    this.baseY = baseY;
    this.velocity = {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
    };

    // Display
    this.letter = letter;
    this.size = size;
    this.isExploding = false;
  }

  update(centerX, centerY, scale, motion) {
    if (this.isExploding) {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    } else {
      const targetX = centerX + (this.baseX + motion.x) * scale;
      const targetY = centerY + (this.baseY + motion.y) * scale;
      this.x += (targetX - this.x) * 0.1;
      this.y += (targetY - this.y) * 0.1;
    }
  }

  draw(ctx, scale) {
    ctx.font = `${this.size * scale}px monospace`;
    ctx.fillText(this.letter, this.x, this.y);
  }

  explode() {
    this.isExploding = true;
  }
  reset() {
    this.isExploding = false;
  }
}
