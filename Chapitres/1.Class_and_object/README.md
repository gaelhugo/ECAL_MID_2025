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
public class Boule {
    private int x;
    private int y;
    private int rayon;
    private int vitesse;
    private int directionX;
    private int directionY;

    // Constructeur
    public Boule(int x, int y, int rayon, int vitesse, int directionX, int directionY) {
        this.x = x;
        this.y = y;
        this.rayon = rayon;
        this.vitesse = vitesse;
        this.directionX = directionX;
        this.directionY = directionY;
    }

    // Méthodes
    public void deplacer() {
        x += vitesse * directionX;
        y += vitesse * directionY;
    }
}
```

## Héritage

**Création de classes héritant des propriétés et méthodes d'une classe mère, une relation de spécialisation**

- Imaginez une classe de base comme un modèle général, un plan de base. Par exemple, la classe Forme. Cette classe définit les propriétés et les méthodes communes à toutes les formes : une couleur, une position, la possibilité de se déplacer, etc.
- Une classe dérivée est une version plus spécifique de la classe de base. Elle hérite de toutes les caractéristiques de la classe de base et peut en ajouter de nouvelles ou en modifier certaines. Par exemple, la classe Cercle est une spécialisation de la classe Forme. Elle hérite de la couleur et de la position, mais ajoute une propriété spécifique : le rayon.

**Pourquoi utiliser l'héritage** ?

- Réutilisation de code: Évitez de réécrire du code en réutilisant les propriétés et les méthodes déjà définies dans la classe de base.
- Organisation du code: Créez une hiérarchie de classes qui reflète les relations entre les objets de votre application.
- Polymorphisme: Permet à des objets de types différents de répondre différemment à un même message, en fonction de leur classe.

## Application aux projets créatifs

- Création d'objets interactifs (interfaces, boutons, sliders, etc.)
- Modélisation de systèmes complexes (physique, particules)
