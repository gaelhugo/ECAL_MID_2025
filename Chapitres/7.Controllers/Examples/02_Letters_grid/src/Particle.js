export default class Particle {
  constructor(x, y, letter, size, baseX, baseY, angle, distance, maxDistance) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.size = size;
    this.baseX = baseX;
    this.baseY = baseY;
    this.angle = angle;
    this.distance = distance;
    this.maxDistance = maxDistance;
    this.velocity = {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
    };
    this.isExploding = false;
  }

  update(centerX, centerY, offsetX, offsetY, scale) {
    if (this.isExploding) {
      // Simple explosion movement
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    } else {
      // Return to original position with all effects
      const targetX = centerX + (this.baseX + offsetX) * scale;
      const targetY = centerY + (this.baseY + offsetY) * scale;

      // Smooth interpolation back to target position
      const easing = 0.1;
      this.x += (targetX - this.x) * easing;
      this.y += (targetY - this.y) * easing;
    }

    // Always apply scale for consistent size
    this.currentScale = scale;
  }

  draw(ctx) {
    ctx.font = `${this.size * this.currentScale}px monospace`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.letter, this.x, this.y);
  }

  explode() {
    this.isExploding = true;
  }

  reset() {
    this.isExploding = false;
  }
}
