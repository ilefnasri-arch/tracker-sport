# Documentation Technique - Tracker de Sport Personnel

## Présentation
Ce projet est une application web simple permettant de suivre ses activités sportives quotidiennes. Elle a été réalisée dans un but pédagogique pour démontrer l'utilisation du JavaScript moderne côté client.

## Structure du Projet
- `index.html` : Structure de l'interface utilisateur (Dashboard, Formulaire, Liste).
- `style.css` : Mise en page et design responsive.
- `script.js` : Logique applicative (Manipulation du DOM, Gestion des données).
- `sports.json` : Base de données locale pour la liste des sports disponibles.

## Fonctionnalités Clés
1. **Récupération de Données (Fetch)** : La liste des sports et le calcul des calories sont basés sur les données chargées asynchronement depuis `sports.json`.
2. **Manipulation du DOM** : L'interface se met à jour dynamiquement lors de l'ajout ou de la suppression d'une séance sans recharger la page.
3. **Persistance (LocalStorage)** : Toutes les séances saisies sont sauvegardées dans le navigateur de l'utilisateur. Elles restent disponibles même après fermeture du navigateur.
4. **Tableau de Bord** : Calcul en temps réel du nombre total de sessions, de la durée cumulée et des calories brûlées.

## Installation
Pour faire fonctionner le projet :
1. Placez les fichiers dans un dossier sur votre serveur local (ex: XAMPP, WAMP).
2. Ouvrez `index.html` via votre navigateur (il est recommandé d'utiliser un serveur local pour que les requêtes `fetch` fonctionnent correctement sur certains navigateurs).
