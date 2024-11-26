import BaseModule from "./BaseModule.js";

export default class SpectrumVisualizerModule extends BaseModule {
  constructor(context, id, x, y) {
    super(context, id, x, y);
    this.title = "Spectrum";
    this.type = "spectrum";
    this.width = 260;
    this.height = 200;

    // Create analyzer node with higher resolution
    this.audioNode = this.audioContext.createAnalyser();
    this.audioNode.fftSize = 2048;
    this.audioNode.smoothingTimeConstant = 0.85;
    this.audioNode.minDecibels = -90;
    this.audioNode.maxDecibels = -10;

    this.bufferLength = this.audioNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.inputs = ["audio"];
    this.outputs = [];

    // Animation
    this.isAnimating = false;
    this.hue = 180; // Start with cyan
    this.canvas = null;
    this.ctx = null;
    this.lastTime = 0;
    this.peaks = new Array(this.bufferLength).fill(0);
    this.peakDecay = 0.98; // How fast peaks fall
  }

  createDOM() {
    const element = super.createDOM();

    this.canvas = document.createElement("canvas");
    this.canvas.className = "spectrum-canvas";
    this.canvas.width = 240;
    this.canvas.height = 140;
    this.ctx = this.canvas.getContext("2d");

    element.appendChild(this.canvas);
    this.startAnimation();

    return element;
  }

  startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.lastTime = performance.now();
      this.animate();
    }
  }

  stopAnimation() {
    this.isAnimating = false;
  }

  animate() {
    if (!this.isAnimating) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.audioNode.getByteFrequencyData(this.dataArray);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background with subtle gradient
    const bgGradient = this.ctx.createLinearGradient(
      0,
      0,
      0,
      this.canvas.height
    );
    bgGradient.addColorStop(0, "rgba(10, 10, 15, 0.95)");
    bgGradient.addColorStop(1, "rgba(15, 15, 25, 0.95)");
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add subtle grid
    this.drawGrid();

    // Center point
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Spiral parameters
    const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    const spiralSpacing = 4; // Space between spiral rings
    const barCount = this.bufferLength / 8; // Reduce number of bars for smoother spiral
    const angleStep = ((Math.PI * 2) / barCount) * 2; // Two full rotations

    // Draw bars in spiral
    for (let i = 0; i < barCount; i++) {
      // Use logarithmic scale for frequency distribution
      const index = Math.floor(Math.pow(i / barCount, 1.8) * this.bufferLength);
      const value = this.dataArray[index];
      const percent = value / 256;

      // Calculate spiral position
      const angle = i * angleStep + (this.hue * Math.PI) / 180; // Use hue for rotation
      const radius = (i / barCount) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Calculate bar height
      const minHeight = 2;
      const height = Math.max(minHeight, 100 * percent);

      // Calculate hue based on frequency and intensity
      const hue = (this.hue + (i / barCount) * 360) % 360;
      const saturation = 80 + percent * 20;
      const lightness = 40 + percent * 20;

      // Draw bar
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(angle + Math.PI / 2);

      // Create gradient for bar
      const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(
        0,
        `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`
      );
      gradient.addColorStop(
        1,
        `hsla(${hue}, ${saturation}%, ${lightness * 0.6}%, 0.9)`
      );

      // Draw the bar
      this.ctx.beginPath();
      this.roundedRect(-2, 0, 4, height, 2);
      this.ctx.fillStyle = gradient;

      // Add glow effect based on intensity
      if (percent > 0.5) {
        this.ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
        this.ctx.shadowBlur = 10;
      }

      this.ctx.fill();
      this.ctx.restore();

      // Update peak for this bar
      this.peaks[i] = Math.max(height, (this.peaks[i] || 0) * this.peakDecay);

      // Draw peak dot
      if (this.peaks[i] > height) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle + Math.PI / 2);
        this.ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${
          lightness + 20
        }%, 0.9)`;
        this.ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${
          lightness + 20
        }%, 0.5)`;
        this.ctx.shadowBlur = 4;
        this.ctx.beginPath();
        this.ctx.arc(0, this.peaks[i], 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // Rotate the spiral
    this.hue = (this.hue + deltaTime * 0.02) % 360;

    requestAnimationFrame(() => this.animate());
  }

  drawGrid() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    this.ctx.lineWidth = 1;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;

    // Draw circular grid lines
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Draw radial lines
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(
        centerX + Math.cos(a) * maxRadius,
        centerY + Math.sin(a) * maxRadius
      );
      this.ctx.stroke();
    }
  }

  roundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  start() {
    this.startAnimation();
  }

  stop() {
    this.stopAnimation();
  }
}
