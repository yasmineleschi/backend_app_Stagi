module.exports = {
  testEnvironment: "node", // Utilise Node.js comme environnement
  testMatch: ["**/TestUnitaire/**/*.test.js"], // Corrige le chemin pour inclure tous les fichiers de tests
  collectCoverage: true, // Active la couverture de code
  coverageDirectory: "coverage", // Répertoire pour les rapports de couverture
};
