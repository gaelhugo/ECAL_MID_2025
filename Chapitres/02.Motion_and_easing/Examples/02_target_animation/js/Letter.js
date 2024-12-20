import Easing from "./Easing";

export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.targetx = x;
    this.targety = y;
    this.originx = x;
    this.originy = y;
    this.radius = radius;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.character = characters[Math.floor(Math.random() * characters.length)];
    this.speed = 0.01;

    // on va géré un temps entre 0 et 1
    this.timing = 0;
  }

  dessine(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = `${this.radius * 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }

  pointQuiAvanceEtQuiStop(t) {
    return Math.min(t, 1);
  }

  // elasticOut(t) {
  //   return Math.sin(((-13 * Math.PI) / 2) * (t + 1)) * Math.pow(2, -10 * t) + 1;
  // }

  update() {
    this.timing += this.speed;

    // step 1 : on va directement sur la target
    // this.x = this.targetx;
    // this.y = this.targety;

    // step 2 : on va à la target mais en calculant depuis l'origine

    // this.targetx - this.originx = la distance entre l'origine et la target
    // this.x = this.originx + (this.targetx - this.originx);
    // this.y = this.originy + (this.targety - this.originy);

    // step 3 : on va à la moitié de la distance entre l'origine et la target
    // this.x = this.originx + (this.targetx - this.originx) * 0.5;
    // this.y = this.originy + (this.targety - this.originy) * 0.5;

    // step 4 : on va à un point qui avant en porportion du temps
    // this.x = this.originx + (this.targetx - this.originx) * this.timing;
    // this.y = this.originy + (this.targety - this.originy) * this.timing;

    // step 5 : on va à un point qui avant en porportion du temps avec une fonction du temps qui l'arrete à un moment.
    // this.x =
    //   this.originx +
    //   (this.targetx - this.originx) * this.pointQuiAvanceEtQuiStop(this.timing);
    // this.y =
    //   this.originy +
    //   (this.targety - this.originy) * this.pointQuiAvanceEtQuiStop(this.timing);

    // step 6 : on va à un point qui avant en porportion du temps
    // avec des fonction du temps qui varient
    this.x =
      this.originx +
      (this.targetx - this.originx) * Easing.elasticOut(this.timing);
    this.y =
      this.originy +
      (this.targety - this.originy) * Easing.elasticOut(this.timing);
  }

  reset(x, y) {
    this.targetx = x;
    this.targety = y;
    this.originx = this.x;
    this.originy = this.y;
    this.timing = 0;
  }
}
