/**
 * NOUVEAUX MOTS IMPORTANTS
 * - this : permet de parler de l'objet en cours de création
 * - let : permet de déclarer une variable
 * - const : permet de déclarer une constante
 * - for : permet de créer une boucle
 * - function : permet de créer une fonction
 * - return : permet de retourner une valeur
 * - document : permet d'accéder à l'objet document
 * - addEventListener : permet d'ajouter un écouteur d'événements
 * - Math : permet d'accéder à l'objet Math
 * - console : permet d'accéder à l'objet console
 * - createElement : permet de créer un élément
 * - appendChild : permet d'ajouter un élément enfant
 * - getContext : permet d'obtenir le contexte d'un canvas
 * - fillStyle : permet de définir la couleur de remplissage
 * - fillRect : permet de dessiner un rectangle rempli
 * - beginPath : permet de commencer un chemin
 * - arc : permet de dessiner un cercle
 * - fill : permet de remplir un chemin
 * - moveTo : permet de déplacer le point de départ d'un chemin
 * - lineTo : permet de dessiner une ligne
 * - stroke : permet de dessiner un chemin
 * - clientX : permet d'obtenir la position horizontale de la souris
 * - clientY : permet d'obtenir la position verticale de la souris
 * - key : permet d'obtenir la touche du clavier pressée
 * - click : permet de détecter un clic
 * - keydown : permet de détecter une pression de touche
 */

export default class Basics {
  constructor() {
    console.log("Basics is running");
    // create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    // get the 2d context
    this.ctx = canvas.getContext("2d");

    /**
     * Pourquoi utilise-t-on "this" dans une classe ?
     *
     * "this" est un mot spécial qui permet de parler de l'objet en cours de création.
     * Dans une classe, "this" permet de parler de l'exemplaire spécifique de la classe.
     * Par exemple, on utilise "this.ctx" pour parler de la propriété "ctx" de cet exemplaire spécifique de la classe.
     * Cela permet d'accéder aux propriétés et aux méthodes de cet exemplaire spécifique à l'intérieur de la classe.
     *
     * "this" est un concept clé en programmation orientée objet.
     * Il permet de distinguer les propriétés et les méthodes de l'exemplaire spécifique de la classe.
     *
     * "this" peut être utilisé dans les fonction de la classe alors que "let" ou "const" ne le peuvent pas.
     */
  }

  /**
   * DEMO SOUS FORME DE FONCTIONS
   */

  // créer une grille
  boucle() {
    // create a nested loop of 10x10
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // do something
      }
    }
  }

  variables() {
    // declare a variable
    let x = 10;
    // increment the variable
    x++;
    // log the variable
    console.log(x);
    // use a variable in a string
    console.log(`x is ${x}`);
    console.log("x is " + x);
  }

  // fonction utile
  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  //   dessiner avec canvas
  draw() {
    // draw a rectangle
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(100, 100, 50, 50);
    // draw a circle
    this.ctx.beginPath();
    this.ctx.arc(200, 200, 50, 0, Math.PI * 2);
    this.ctx.fill();
    // draw a line
    this.ctx.beginPath();
    this.ctx.moveTo(300, 300);
    this.ctx.lineTo(400, 400);
    this.ctx.stroke();
  }

  //ajout d'interaction avec la souris
  interaction() {
    // add an event listener
    document.addEventListener("click", (event) => {
      console.log(event.clientX, event.clientY);
    });
  }

  //ajout d'interaction avec le clavier
  clavier() {
    // add an event listener
    document.addEventListener("keydown", (event) => {
      console.log(event.key);
    });
  }
}
