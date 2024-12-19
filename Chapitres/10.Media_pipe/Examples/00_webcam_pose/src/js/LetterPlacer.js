export class LetterPlacer {
  /**
   * Crée un placeur de lettres qui affiche une lettre entre deux points
   * @param {CanvasRenderingContext2D} ctx - Le contexte de dessin du canvas
   */
  constructor(ctx, speechListener) {
    this.ctx = ctx;
    this.speechListener = speechListener;
    this.letter = "Gael"; // La lettre à afficher
    this.font = "Arial"; // Police d'écriture
    this.minFontSize = 10; // Taille minimum de la police en pixels
    this.maxFontSize = 1000; // Taille maximum de la police en pixels

    // Paramètres pour le lissage du mouvement
    this.smoothingFactor = 0.5; // Entre 0 et 1, plus c'est haut plus c'est lisse
    this.smoothedPoints = {
      thumb: null, // Position lissée du pouce
      index: null, // Position lissée de l'index
    };
  }

  /**
   * Lisse la position d'un point pour éviter les mouvements brusques
   * @param {Object} newPoint - Nouvelle position du point {x, y, z}
   * @param {Object} lastPoint - Dernière position lissée du point
   * @returns {Object} Position lissée
   */
  smoothPoint(newPoint, lastPoint) {
    if (!lastPoint) return newPoint;

    // Fonction de lissage pour une coordonnée (EASING)
    const smooth = (a, b) =>
      this.smoothingFactor * a + (1 - this.smoothingFactor) * b;

    // Applique le lissage sur chaque coordonnée
    return {
      x: smooth(lastPoint.x, newPoint.x),
      y: smooth(lastPoint.y, newPoint.y),
      z: smooth(lastPoint.z, newPoint.z),
    };
  }

  /**
   * Analyse la position des doigts et place la lettre
   * @param {Array} landmarks - Points de repère de la main
   */
  analyzePinchDistance(landmarks) {
    // Récupère les positions des bouts des doigts
    const rawThumb = landmarks[4]; // Bout du pouce
    const rawIndex = landmarks[8]; // Bout de l'index

    // Lisse les positions
    this.smoothedPoints.thumb = this.smoothPoint(
      rawThumb,
      this.smoothedPoints.thumb
    );
    this.smoothedPoints.index = this.smoothPoint(
      rawIndex,
      this.smoothedPoints.index
    );

    // Place la lettre entre les doigts
    this.placeLetter(this.smoothedPoints.thumb, this.smoothedPoints.index);
  }

  /**
   * Place et dessine la lettre entre deux points
   * @param {Object} thumb - Position du pouce {x, y, z}
   * @param {Object} index - Position de l'index {x, y, z}
   */
  placeLetter(thumb, index) {
    const { width, height } = this.ctx.canvas;

    // Convertit les positions relatives (0-1) en positions en pixels
    const [thumbX, thumbY] = [thumb.x * width, thumb.y * height];
    const [indexX, indexY] = [index.x * width, index.y * height];

    // Calcule le point central entre les doigts
    const centerX = (thumbX + indexX) / 2;
    const centerY = (thumbY + indexY) / 2;

    // Calcule l'angle de rotation pour la lettre
    const angle = Math.atan2(indexY - thumbY, indexX - thumbX) + Math.PI; /// 2;

    // Calcule la distance entre les doigts
    const distance = Math.hypot(indexX - thumbX, indexY - thumbY);

    // Configure le style du texte
    const fontSize = this.calculateOptimalFontSize(distance);
    this.ctx.font = `${fontSize}px ${this.font}`;

    // Sauvegarde le contexte, applique les transformations et dessine
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(angle);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.speechListener.SPOKEN_WORDS, 0, distance / 10);

    // Restaure le contexte
    this.ctx.restore();
  }

  /**
   * Calcule la taille optimale de la police en fonction de la distance
   * @param {number} distance - Distance entre les doigts en pixels
   * @returns {number} Taille de la police en pixels
   */
  calculateOptimalFontSize(distance) {
    // Mesure la largeur de la lettre avec la distance comme taille de police
    this.ctx.font = `${distance}px ${this.font}`;
    const letterWidth = this.ctx.measureText(this.letter).width;

    // Ajuste la taille pour que la lettre soit proportionnelle à la distance
    const finalSize = Math.round(distance * (distance / letterWidth));

    // Limite la taille entre min et max
    return Math.max(this.minFontSize, Math.min(finalSize, this.maxFontSize));
  }

  updateVariableFont() {
    // KyivTypeSerif-VarGX.woff2
    // paramètre : wght 0 -1000
    // paramètre : CONT 0 -1000
    // paramètre : MIDL 0 -1000
  }
}
