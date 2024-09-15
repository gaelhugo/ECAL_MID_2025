# Classes et Objets

## Concepts fondamentaux

- **Objet** : instance d'une classe, possède des propriétés et des méthodes
  - **Objet** : Un personnage de jeu vidéo est un objet JavaScript. Chaque personnage (instance) est unique (apparence, compétences, etc.) mais partage les mêmes caractéristiques (santé, mana, etc.) et peut effectuer les mêmes actions (attaquer, se déplacer, sauter).
  - **Propriétés** : La force, l'agilité, le niveau, l'inventaire sont des propriétés d'un personnage.
  - **Méthodes** : Attaquer, se défendre, utiliser un sort, ouvrir une porte sont des méthodes d'un personnage.
- **Classe** : modèle pour créer des objets

## Création de classes en js

- Structure d'une classe
- Constructeur
- Méthodes

```
class Ball {
  constructor(x, y, rayon, couleur, vitesseX, vitesseY) {
    this.x = x;
    this.y = y;
    this.rayon = rayon;
    this.couleur = couleur;
    this.vitesseX = vitesseX;
    this.vitesseY = vitesseY;
  }

  // Méthode pour dessiner la balle sur un canvas
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
    ctx.fillStyle = this.couleur;
    ctx.fill();
    ctx.closePath();
  }

  // Méthode pour mettre à jour la position de la balle
  update() {
    this.x += this.vitesseX;
    this.y += this.vitesseY;
  }
}
```

## Instanciation

```
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ball = new Ball(100, 100, 20, 'red', 2, 2);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  ball.draw(ctx);
}

animate();
```

## Héritage

**Création de classes héritant des propriétés et méthodes d'une classe mère, une relation de spécialisation**

- Imaginez une classe de base comme un modèle général, un plan de base. Par exemple, la classe Forme. Cette classe définit les propriétés et les méthodes communes à toutes les formes : une couleur, une position, la possibilité de se déplacer, etc.
- Une classe dérivée est une version plus spécifique de la classe de base. Elle hérite de toutes les caractéristiques de la classe de base et peut en ajouter de nouvelles ou en modifier certaines. Par exemple, la classe Cercle est une spécialisation de la classe Forme. Elle hérite de la couleur et de la position, mais ajoute une propriété spécifique : le rayon.

**Pourquoi utiliser l'héritage** ?

- Réutilisation de code: Évitez de réécrire du code en réutilisant les propriétés et les méthodes déjà définies dans la classe de base.
- Organisation du code: Créez une hiérarchie de classes qui reflète les relations entre les objets de votre application.
- Polymorphisme: Permet à des objets de types différents de répondre différemment à un même message, en fonction de leur classe.

  ```apache
  class Shape {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    draw(ctx) {
      // Méthode à redéfinir dans les classes filles
    }
  }
  ```

  ```apache
  class Ball extends Shape {
    constructor(x, y, radius, color) {
      super(x, y); // Appel du constructeur de la classe parente
      this.radius = radius;
      this.color = color;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();  

      ctx.closePath();
    }
  }
  ```

```apache
class Rectangle extends Shape {
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
```

```apache
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ball = new Ball(100, 100, 20, 'red');
const rect = new Rectangle(200, 200, 50, 30);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw(ctx);
  rect.draw(ctx);
}

animate();
```

## Application aux projets créatifs

- Création d'objets interactifs (interfaces, boutons, sliders, etc.)
- Modélisation de systèmes complexes (physique, particules)
