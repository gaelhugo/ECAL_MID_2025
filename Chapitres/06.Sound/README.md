# Son

La Web Audio API est une interface de programmation JavaScript puissante qui permet de manipuler et de créer des expériences audio directement dans votre navigateur. Elle offre un contrôle granulaire sur le traitement du son, ouvrant ainsi de vastes possibilités pour la création de jeux, d'applications musicales, de visualisations sonores et bien plus encore.

## Les fonctionnalités clés de la Web Audio API

- **Création d'un contexte audio**:

  - **AudioContext**: C'est le point d'entrée pour toute opération audio. Il représente un contexte audio global dans lequel les nœuds audio sont créés et connectés.

- **Les nœuds audio**:

  - **Oscillateurs**: Génèrent des formes d'onde simples (sinusoïdales, carrées, etc.) qui servent de base à la création de sons.
  - **Sources audio**: Chargent des fichiers audio depuis le disque dur ou un flux en ligne.
  - **Effets**: Appliquent des effets audio tels que le filtrage (passe-bas, passe-haut), la réverbération, la distorsion, etc.
  - **Gain**: Contrôle le volume.
  - **Analyse**: Analyse le spectre fréquentiel du signal audio.

- **Graphique de flux audio**:

  - Les nœuds audio sont connectés entre eux pour former un graphe de flux audio. Le son circule de la source vers la destination en passant par les différents nœuds.
  - Cette flexibilité permet de créer des chaînes de traitement audio complexes.

- **Analyse spectrale**:

  - **Fourier Fast Transform (FFT)**: Permet d'analyser le contenu fréquentiel d'un signal audio.
  - **Visualisations**: Création de visualisations en temps réel du spectre fréquentiel (analyseur de spectre).

## La visualisation en temps réel

### Le principe de base

La création de visualisations musicales en temps réel repose sur l'analyse des données audio et la transformation de ces données en éléments visuels. La Web Audio API offre les outils nécessaires pour analyser le signal audio (amplitude, fréquence).

### Les étapes clés

1. **Analyse du signal audio**:

   - **Transformation de Fourier**: Cette opération mathématique permet de décomposer le signal audio en ses différentes composantes fréquentielles.
   - **Analyse spectrale**: On obtient un spectre fréquentiel qui représente la répartition de l'énergie sonore en fonction des fréquences.
   - **Caractéristiques extraites**: On peut extraire différentes caractéristiques du spectre : fréquence fondamentale, harmoniques, bande passante, etc.

2. **Mapping des données audio vers des paramètres visuels**:

   - **Amplitude**: L'amplitude du signal peut être utilisée pour contrôler la taille, la luminosité ou l'opacité des éléments graphiques.
   - **Fréquence**: La fréquence fondamentale peut être utilisée pour contrôler la couleur ou la vitesse des animations.
   - **Autres paramètres**: D'autres paramètres comme la bande passante peuvent être utilisés pour créer des effets plus complexes.

3. **Création de la visualisation**:

   - **Choix de la représentation visuelle**: Barres, cercles, particules, formes géométriques, etc.
   - **Animation**: Les éléments visuels sont animés en fonction des données audio.
   - **Synchronisation**: La visualisation doit être parfaitement synchronisée avec la musique.

### Exemples de visualisation

- **Barres**: Les barres de hauteur varient en fonction de l'amplitude du signal audio.
- **Cercles concentriques**: Des cercles concentriques se dilatent ou se contractent en fonction de l'amplitude.
- **Particules**: Des particules sont émises et animées en fonction de la fréquence et de l'amplitude du signal.
- **Formes géométriques**: Des formes géométriques simples ou complexes peuvent être déformées ou colorées en fonction de la musique.

  ![](assets/20240915_181752_1_bmAT4Anl8261Ko3H5SA2kQ.gif)

## Bibliothèque JS

- **Tone.js**: C'est l'une des bibliothèques les plus complètes et les plus utilisées pour la synthèse sonore, le traitement du signal et la création d'instruments virtuels. Elle offre une API intuitive et une grande flexibilité. ([link](****))
- **Howler.js**: Conçue principalement pour la lecture de fichiers audio, Howler.js est facile à utiliser et offre des fonctionnalités comme la gestion de plusieurs fichiers audio simultanément, le contrôle du volume et la spatialisation. ([link](https://howlerjs.com/))

## Applications

- **Créateurs de musique**: Construction de synthétiseurs virtuels, de boîtes à rythmes, d'effets de guitare.
- **Jeux vidéo**: Création de paysages sonores immersifs, de sons d'effets, de musiques interactives.
- **Applications** de streaming audio: Ajout d'effets personnalisés, création de stations de radio en ligne.
- **Visualisations musicales**: Création de visualisations en temps réel synchronisées avec la musique.
- **Assistants vocaux**: Traitement de la voix, reconnaissance vocale.
