export default class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.charIndex = 0;
    this.updateSpeed = Math.floor(Math.random() * 60) + 1;
    this.frameCount = 0;
  }

  draw(ctx) {
    // Save the current drawing settings
    ctx.save();

    // Choose a character to draw
    const char = this.getCharacter();

    // Set the text size and font
    ctx.font = `${this.radius * 2}px monospace`;

    // Set the text color to green
    ctx.fillStyle = "#ffffff";

    // Center the text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the character
    ctx.fillText(char, this.x, this.y);

    // Restore the original drawing settings
    ctx.restore();
  }

  getCharacter() {
    // List of characters to use, grouped by "density"
    const characters = [
      [" ", ".", "·"],
      [":", "-", "="],
      ["+", "*", "#"],
      ["%", "@", "&"],
      ["S", "8", "O"],
      ["W", "M", "█"],
    ];

    // Choose a group based on the point's size
    const groupIndex = Math.min(
      Math.floor(this.radius / 2),
      characters.length - 1
    );

    // Return the current character from the chosen group
    return characters[groupIndex][this.charIndex];
  }

  update() {
    // Count frames
    this.frameCount++;

    // If enough frames have passed, change the character
    if (this.frameCount >= this.updateSpeed) {
      this.charIndex = (this.charIndex + 1) % 3;
      this.frameCount = 0;
    }
  }
}
