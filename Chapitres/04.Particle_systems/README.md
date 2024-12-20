# Système de Particules

Un système de particules est un ensemble d'éléments graphiques simples, appelés particules, qui évoluent au fil du temps selon des règles spécifiques. Ces particules peuvent être animées pour créer des effets visuels complexes et réalistes, comme des feux d'artifice, de la fumée, de la pluie, de la neige, ou encore des explosions.

![](assets/20240915_175400_particles.gif)

## Les éléments clés d'un système de particules

- **La particule**:

  - C'est l'unité de base du système.
  - Chaque particule possède un ensemble de propriétés :
    - Position: Coordonnées (x, y) dans l'espace.
    - Vitesse: Vecteur indiquant la direction et la vitesse du mouvement.
    - Accélération: Taux de variation de la vitesse (influencée par les forces).
    - Durée de vie: Temps pendant lequel la particule est visible à l'écran.
    - Couleur: Couleur de la particule.
    - Taille: Taille de la particule.
    - Rotation: Angle de rotation de la particule.

- **L'émetteur**:

  - C'est l'élément qui crée de nouvelles particules.
  - Il définit les propriétés initiales des particules (position, vitesse, couleur, etc.).
  - Il peut être statique ou en mouvement.

- **Les forces**:

  - Les forces agissent sur les particules et modifient leur mouvement.
  - Exemples de forces : gravité, vent, forces répulsives, forces attractives.

## Mise en œuvre en javascript

- Création d'une classe Particle
- Gestion de la durée de vie des particules
- Forces agissant sur les particules (gravité, vent, etc.)

## Applications

- **Jeux vidéo**: Particules d'éclaboussures, de feu, de magie, etc.
- **Visualisations de données**: Représentation de flux de données, de nuages de points, etc.
- **Art numérique**: Création d'œuvres d'art abstraites et dynamiques.

  ![](assets/20240915_175919_particles2.gif)
