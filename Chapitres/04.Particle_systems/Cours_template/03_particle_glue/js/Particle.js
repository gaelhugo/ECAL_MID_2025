import Utils from "./Utils.js";

export default class Particle {
  /**
   * Crée une nouvelle particule avec une position initiale et une position cible
   * @param {number} x - Position x initiale
   * @param {number} y - Position y initiale
   * @param {number} targetX - Position x cible
   * @param {number} targetY - Position y cible
   */
  constructor(x, y, targetX, targetY) {}

  /**
   * Calcule la force de direction vers la cible
   * Applique un comportement de ralentissement quand la particule s'approche de sa cible
   * @returns {Object} Force de direction {x, y}
   */
  seek() {
    if (this.isDead) return { x: 0, y: 0 };

    const desired = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const distanceToTarget = Utils.getSpeed(desired);
    const currentSpeed = Utils.getSpeed(this.velocity);

    const wasAtTarget = this.isAtTarget;
    this.isAtTarget = distanceToTarget < 0.5 && currentSpeed < 0.1;

    if (!wasAtTarget && this.isAtTarget) {
      this.targetTimer = 0;
    }

    if (distanceToTarget === 0) return { x: 0, y: 0 };

    let desiredSpeed = this.maxSpeed;
    if (distanceToTarget < this.slowDownDistance) {
      desiredSpeed = this.maxSpeed * (distanceToTarget / this.slowDownDistance);
    }

    const movement = Utils.getDirection(desired, desiredSpeed);
    const steer = {
      x: movement.x - this.velocity.x,
      y: movement.y - this.velocity.y,
    };

    return Utils.getDirection(steer, this.maxForce);
  }

  /**
   * Met à jour la position et l'état de la particule
   * Gère le cycle de vie de la particule (naissance, déplacement, mort)
   */
  update() {}

  /**
   * Dessine la particule sur le contexte canvas
   * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu 2D du canvas
   */
  draw(ctx) {}
}
