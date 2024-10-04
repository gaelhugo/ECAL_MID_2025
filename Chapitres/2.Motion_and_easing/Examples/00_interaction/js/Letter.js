export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.character = "A";
  }

  dessine(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    // dessiner le caractère au centre du cercle pour qu'il occupe toute la surface
    ctx.font = `${this.radius * 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }
}
