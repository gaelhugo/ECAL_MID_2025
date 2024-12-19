export class SpeechListener {
  constructor(onWordDetected) {
    // Initialisation des propriétés de base
    this.recognition = null; // L'objet de reconnaissance vocale
    this.isListening = false; // État actuel de l'écoute
    this.shouldBeListening = false; // Si on devrait être en train d'écouter
    this.SPOKEN_WORDS = ""; // Les mots prononcés

    // Configuration de la reconnaissance vocale
    this.setupRecognition();
  }

  setupRecognition() {
    // Vérifie si la reconnaissance vocale est disponible dans le navigateur
    if (!("webkitSpeechRecognition" in window)) {
      console.error(
        "Votre navigateur ne supporte pas la reconnaissance vocale"
      );
      return;
    }

    // Crée et configure l'objet de reconnaissance
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true; // Écoute en continu
    this.recognition.interimResults = true; // Obtient les résultats en temps réel
    this.recognition.lang = "fr-FR"; // Définit la langue en français

    // Quand la reconnaissance démarre
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("Début de l'écoute");
    };

    // Quand la reconnaissance s'arrête
    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Fin de l'écoute");

      // Redémarre si nécessaire
      if (this.shouldBeListening) {
        setTimeout(() => this.start(), 1000);
      }
    };

    // En cas d'erreur
    this.recognition.onerror = (event) => {
      console.error("Erreur:", event.error);
      this.isListening = false;

      // Arrête définitivement si l'accès est refusé
      if (event.error.includes("not-allowed")) {
        this.shouldBeListening = false;
        console.error("Accès au micro refusé");
      }
    };

    // Quand un mot est détecté
    this.recognition.onresult = (event) => {
      const word = event.results[event.results.length - 1][0].transcript.trim();
      if (word) {
        this.SPOKEN_WORDS = word;
        console.log("Mot détecté:", word);
      }
    };
  }

  // Démarre l'écoute
  start() {
    if (!this.recognition) {
      console.error("Reconnaissance vocale non initialisée");
      return;
    }

    this.shouldBeListening = true;

    if (!this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error("Erreur au démarrage:", error);
        this.isListening = false;
      }
    }
  }

  // Arrête l'écoute
  stop() {
    this.shouldBeListening = false;

    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Erreur à l'arrêt:", error);
      }
      this.isListening = false;
    }
  }
}
