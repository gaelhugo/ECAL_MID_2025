import BaseApp from "./BaseApp";
import WebcamManager from "./WebcamManager";
import GridOverlay from "./GridOverlay";
import SliderControl from "./SliderControl";
import CheckboxControl from "./CheckboxControl";

export default class App extends BaseApp {
  constructor() {
    super();
    this.webcamManager = new WebcamManager();
    this.gridOverlay = new GridOverlay(100, 100);
    this.showGrid = false;

    // Master slider to control both dimensions
    this.masterSlider = new SliderControl({
      min: 1,
      max: 100,
      value: 100,
      label: "Taille de la grille",
      onChange: (value) => {
        // Update both individual sliders
        this.heightSlider.setValue(value);
        this.widthSlider.setValue(value);
        // Update grid directly
        this.gridOverlay.rows = value;
        this.gridOverlay.columns = value;
      },
    });

    // Création des contrôles de curseur
    this.heightSlider = new SliderControl({
      min: 1,
      max: 100,
      value: 100,
      label: "Lignes",
      onChange: (value) => {
        this.gridOverlay.rows = value;
      },
    });

    this.widthSlider = new SliderControl({
      min: 1,
      max: 100,
      value: 100,
      label: "Colonnes",
      onChange: (value) => {
        this.gridOverlay.columns = value;
      },
    });

    this.radiusSlider = new SliderControl({
      min: 0,
      max: 50,
      value: 0,
      label: "Rayon des Bords",
      onChange: (value) => {
        this.gridOverlay.borderRadius = value;
      },
    });

    this.gridToggle = new CheckboxControl({
      label: "Afficher la grille",
      checked: false,
      onChange: (value) => {
        this.showGrid = value;
      },
    });

    this.init();
  }

  async init() {
    await this.webcamManager.initialize();
    this.draw();
  }

  draw() {
    // Effacer le canvas et redessiner
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Only draw the grid if showGrid is true
    if (this.showGrid) {
      this.gridOverlay.draw(ctx, this.webcamManager.getVideo());
    } else {
      // Draw just the video without the grid
      const video = this.webcamManager.getVideo();
      ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
