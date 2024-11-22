export default class GridOverlay {
  constructor(columns = 10, rows = 10) {
    this.columns = columns;
    this.rows = rows;
    this.borderRadius = 0;
  }

  draw(ctx, videoElement) {
    if (!videoElement) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const cellWidth = width / this.columns;
    const cellHeight = height / this.rows;

    // Dessiner d'abord l'image de la webcam sur le canvas
    ctx.drawImage(videoElement, 0, 0, width, height);

    // Créer un tableau pour stocker les couleurs
    const colorData = new Array();

    // Échantillonner d'abord toutes les couleurs
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;

        // Obtenir la couleur du centre de chaque cellule
        const centerX = Math.floor(x + cellWidth / 2);
        const centerY = Math.floor(y + cellHeight / 2);

        // Échantillonner la couleur directement depuis le canvas
        const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
        colorData[row * this.columns + col] = pixel;
      }
    }

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner les rectangles avec les couleurs échantillonnées
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;
        const pixel = colorData[row * this.columns + col];

        ctx.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        // Dessiner le rectangle avec la couleur échantillonnée
        // ctx.fillRect(x, y, cellWidth, cellHeight);
        // Dessiner le rectangle arrondi
        this.roundRect(ctx, x, y, cellWidth, cellHeight, this.borderRadius);
      }
    }
  }

  // Méthode auxiliaire pour dessiner des rectangles arrondis
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }
}
