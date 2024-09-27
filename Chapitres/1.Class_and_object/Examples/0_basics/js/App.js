/**
 * LES MOTS IMPORTANTS
 * - import : permet d'importer des modules
 * - export : permet d'exporter des modules
 * - default : permet d'exporter un module par défaut
 * - class : permet de créer une classe
 * - constructor : permet de créer un constructeur (une méthode qui est appelée lorsqu'une instance de la classe est créée)
 * - new : permet de créer une nouvelle instance d'une classe
 *
 */

// Basics est le nom d'une classe qui a des fonctionnalités particulières que l'on peut utiliser.
import Basics from "./Basics.js";
export default class App {
  constructor() {
    console.log("App is running");
    const basics = new Basics();
  }
}
