import AudioLib from "./AudioLib";

export default class Grid {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rows = 3;
    this.cols = 3;
    this.audioLib = new AudioLib();
    this.cells = this.initializeCells();
    this.isPinching = false;
    this.currentSequenceIndex = 0;
    this.isPlaying = false;

    // Define the complete sequence
    this.sequence = [
      // Basic sequence
      ["workIt"],
      ["makeIt"],
      ["doIt"],
      ["makesUs"],
      ["harder"],
      ["better"],
      ["faster"],
      ["stronger"],
      ["moreThan"],
      ["hour"],
      ["never"],
      ["ever"],
      ["after"],
      ["workIs"],
      ["over"],
      // Repeat basic
      ["workIt"],
      ["makeIt"],
      ["doIt"],
      ["makesUs"],
      ["harder"],
      ["better"],
      ["faster"],
      ["stronger"],
      // Final part
      ["workIt"],
      ["harder"],
      ["makeIt"],
      ["better"],
      ["doIt"],
      ["faster"],
      ["makesUs"],
      ["stronger"],
      ["moreThan"],
      ["ever"],
      ["hour"],
      ["after"],
      ["hour"],
      ["workIs"],
      ["never"],
      ["over"],
    ];
  }

  initializeCells() {
    const cells = [];
    const cellSizeX = window.innerWidth / this.cols;
    const cellSizeY = window.innerHeight / this.rows;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        cells.push({
          x: j * cellSizeX,
          y: i * cellSizeY,
          width: cellSizeX,
          height: cellSizeY,
          color: "rgba(255,255,255,0.1)",
          active: false,
        });
      }
    }
    return cells;
  }

  draw() {
    this.cells.forEach((cell) => {
      this.ctx.fillStyle = cell.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.rect(cell.x, cell.y, cell.width, cell.height);
      this.ctx.fill();
    });

    // // Draw current sequence position
    // this.ctx.fillStyle = "white";
    // this.ctx.font = "20px Arial";
    // this.ctx.fillText(
    //   `Sequence: ${this.currentSequenceIndex + 1}/${this.sequence.length}`,
    //   10,
    //   30
    // );
  }

  async playCurrentSequence() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    const currentPart = this.sequence[this.currentSequenceIndex];

    try {
      // Play each sound in the current sequence part

      await this.audioLib.playSoundVariation(currentPart);

      // Move to next sequence
      this.currentSequenceIndex =
        (this.currentSequenceIndex + 1) % this.sequence.length;
    } finally {
      this.isPlaying = false;
    }
  }

  checkPinch(x, y, isPinching) {
    if (isPinching !== this.isPinching) {
      this.isPinching = isPinching;

      if (isPinching && !this.isPlaying) {
        const cellIndex = this.cells.findIndex(
          (cell) =>
            x >= cell.x &&
            x <= cell.x + cell.width &&
            y >= cell.y &&
            y <= cell.y + cell.height
        );

        if (cellIndex !== -1) {
          const cell = this.cells[cellIndex];
          cell.active = !cell.active;
          cell.color = cell.active
            ? "rgba(0,255,0,0.5)"
            : "rgba(255,255,255,0.1)";

          // Play the current sequence part
          this.playCurrentSequence();

          // Reset cell color after a short delay
          setTimeout(() => {
            cell.active = false;
            cell.color = "rgba(255,255,255,0.1)";
          }, 500);
        }
      }
    }
  }
}
