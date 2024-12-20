import Easing from "./Easing";

export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.speed = 0.01; // Increased speed for more noticeable animation
    this.character =
      this.characters[Math.floor(Math.random() * this.characters.length)];
    // on va géré un temps entre 0 et 1
    this.timing = 0;

    // Add new properties for hover effect
    this.baseRadius = radius;
    this.targetRadius = radius;
    this.currentRadius = radius;
    this.bigRadius = radius * 3.5;
    this.isHovered = false;
    this.wasHovered = false; // New property to track previous hover state

    this.timing = 0; // New property to track animation progress
  }

  draw(ctx) {
    ctx.font = `${this.currentRadius * 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }

  update() {
    this.timing += this.speed;
    const easing = Easing.elasticOut(this.timing);
    if (!this.isHovered) {
      this.currentRadius =
        this.bigRadius + (this.targetRadius - this.bigRadius) * easing;
    } else {
      this.currentRadius =
        this.baseRadius + (this.targetRadius - this.baseRadius) * easing;
    }
  }

  // New method to handle hover state
  checkHover(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.isHovered = distance < this.baseRadius;

    // Check if hover state has changed
    if (this.isHovered !== this.wasHovered) {
      this.timing = 0;
      if (this.isHovered) {
        this.targetRadius = this.bigRadius;
      } else {
        this.targetRadius = this.baseRadius;
      }
      this.wasHovered = this.isHovered; // Update previous hover state
    }
  }
}
