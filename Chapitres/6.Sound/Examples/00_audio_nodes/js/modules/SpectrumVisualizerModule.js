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

    // Add fullscreen change listener
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        // Reset canvas size when exiting fullscreen
        this.canvas.width = 240;
        this.canvas.height = 140;
        this.canvas.classList.remove("fullscreen");
      }
    });
  }

  createDOM() {
    const element = super.createDOM();

    // Create container for canvas and controls
    const container = document.createElement("div");
    container.className = "spectrum-container";

    // Create fullscreen button
    const fullscreenButton = document.createElement("button");
    fullscreenButton.className = "spectrum-fullscreen-button";
    fullscreenButton.textContent = "⛶"; // Unicode fullscreen symbol
    fullscreenButton.addEventListener("click", () => this.toggleFullscreen());

    this.canvas = document.createElement("canvas");
    this.canvas.className = "spectrum-canvas";
    this.canvas.width = 240;
    this.canvas.height = 140;
    this.ctx = this.canvas.getContext("2d");

    container.appendChild(this.canvas);
    container.appendChild(fullscreenButton);
    element.appendChild(container);

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

    // Use requestAnimationFrame at the start to optimize frame timing
    requestAnimationFrame(() => this.animate());

    // Get frequency data
    this.audioNode.getByteFrequencyData(this.dataArray);

    // Calculate scale factor only once per frame
    const isFullscreen = !!document.fullscreenElement;
    const scaleFactor = isFullscreen
      ? Math.min(window.innerWidth / 240, window.innerHeight / 140)
      : 1;

    // Pre-calculate common values
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    const barCount = Math.floor(this.bufferLength / 8);
    const angleStep = ((Math.PI * 2) / barCount) * 2;

    // Clear and draw background
    this.ctx.clearRect(0, 0, width, height);
    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "rgba(10, 10, 15, 0.95)");
    bgGradient.addColorStop(1, "rgba(15, 15, 25, 0.95)");
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    // Draw grid with reduced opacity in fullscreen
    if (!isFullscreen) {
      this.drawGrid();
    }

    // Pre-calculate bar width and minimum height
    const barWidth = 4 * scaleFactor;
    const minHeight = 2 * scaleFactor;
    const barRadius = 2 * scaleFactor;

    // Create off-screen canvas for bars
    const barCanvas = document.createElement("canvas");
    barCanvas.width = width;
    barCanvas.height = height;
    const barCtx = barCanvas.getContext("2d");

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const index = Math.floor(Math.pow(i / barCount, 1.8) * this.bufferLength);
      const value = this.dataArray[index];
      const percent = value / 256;

      // Calculate position
      const angle = i * angleStep + (this.hue * Math.PI) / 180;
      const radius = (i / barCount) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Calculate height
      const height = Math.max(minHeight, 100 * percent * scaleFactor);

      // Calculate color
      const hue = (this.hue + (i / barCount) * 360) % 360;
      const saturation = 80 + percent * 20;
      const lightness = 40 + percent * 20;

      // Draw bar
      barCtx.save();
      barCtx.translate(x, y);
      barCtx.rotate(angle + Math.PI / 2);

      const gradient = barCtx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(
        0,
        `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`
      );
      gradient.addColorStop(
        1,
        `hsla(${hue}, ${saturation}%, ${lightness * 0.6}%, 0.9)`
      );

      barCtx.beginPath();
      this.roundedRect(-barWidth / 2, 0, barWidth, height, barRadius);
      barCtx.fillStyle = gradient;

      if (percent > 0.5) {
        barCtx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
        barCtx.shadowBlur = 10 * scaleFactor;
      }

      barCtx.fill();
      barCtx.restore();

      // Update and draw peaks
      this.peaks[i] = Math.max(height, (this.peaks[i] || 0) * this.peakDecay);
      if (this.peaks[i] > height) {
        barCtx.save();
        barCtx.translate(x, y);
        barCtx.rotate(angle + Math.PI / 2);
        barCtx.fillStyle = `hsla(${hue}, ${saturation}%, ${
          lightness + 20
        }%, 0.9)`;
        barCtx.beginPath();
        barCtx.arc(0, this.peaks[i], barRadius, 0, Math.PI * 2);
        barCtx.fill();
        barCtx.restore();
      }
    }

    // Draw the final result
    this.ctx.drawImage(barCanvas, 0, 0);

    // Update hue
    this.hue = (this.hue + deltaTime * 0.02) % 360;
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

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      this.canvas.requestFullscreen().then(() => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.classList.add("fullscreen");
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen().then(() => {
        this.canvas.width = 240;
        this.canvas.height = 140;
        this.canvas.classList.remove("fullscreen");
      });
    }
  }
}
