export default class Particle {
  constructor(x, y) {
    // Position
    this.position = {
      x: x || 0,
      y: y || 0,
    };

    // Velocity
    this.velocity = {
      x: 0,
      y: 0,
    };

    // Acceleration
    this.acceleration = {
      x: 0,
      y: 0,
    };

    // Additional properties
    this.radius = 5;
    this.maxSpeed = 3;
    this.orientation = 0; // in radians
  }

  // Apply force to the particle
  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  // Update particle physics
  update() {
    // Update velocity by adding acceleration
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    // Limit speed
    const speed = Math.sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }

    // Update position by adding velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Wrap around screen edges
    if (this.position.x > window.innerWidth) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = window.innerWidth;
    }

    if (this.position.y > window.innerHeight) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = window.innerHeight;
    }

    // Calculate orientation based on velocity direction
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.orientation = Math.atan2(this.velocity.y, this.velocity.x);
    }

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  // Draw the particle
  draw(ctx) {
    ctx.save();

    // Move to particle position and rotate
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.orientation);

    // Draw particle as a triangle to show orientation
    ctx.beginPath();
    ctx.moveTo(this.radius * 2, 0);
    ctx.lineTo(-this.radius, -this.radius);
    ctx.lineTo(-this.radius, this.radius);
    ctx.closePath();

    ctx.fillStyle = "#FF5733";
    ctx.fill();

    ctx.restore();
  }
}
