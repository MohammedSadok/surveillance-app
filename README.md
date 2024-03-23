# Projet de surveillance des examens

Ce projet vise à fournir une solution de surveillance des examens pour la faculté des science el jadida, permettant une gestion efficace des surveillants, des salles d'examen et des enseignants.

## Structure du projet

Le projet est organisé en plusieurs dossiers pour une meilleure gestion :

- `actions/`: Contient les services côté serveur pour les actions spécifiques de l'application.
- `app/`: Contient la logique principale de l'application, avec des sous-dossiers pour l'authentification, les routes et les composants.
- `components/`: Contient les composants réutilisables de l'interface utilisateur.
- `hooks/`: Contient des hooks personnalisés utilisés dans l'application.
- `lib/`: Contient des fonctions utilitaires.
- `out/`: Contient les fichiers exécutables de l'application.
- `prisma/`: Contient les fichiers de définition de la base de données et de migration associés.

## Perspectives futures

### Envoi d'e-mails aux chefs de départements et aux enseignants concernés

- Ajouter la fonctionnalité permettant d'envoyer automatiquement des e-mails aux chefs de départements et aux enseignants concernés pour les informer des détails de surveillance pour leurs cours respectifs.

### Gestion des surveillants occupés

- Intégrer la possibilité de cocher les enseignants qui sont déjà occupés pendant une heure donnée dans un créneau spécifique, afin d'éviter les conflits de planning lors de l'attribution des surveillants.

### Réservation des locaux

- Ajouter la fonctionnalité permettant aux utilisateurs de réserver des salles d'examen pour des créneaux spécifiques, offrant ainsi une meilleure gestion des ressources et une allocation plus efficace des espaces d'examen.

### Gestion des notes

- Intégrer un système de gestion des notes pour enregistrer et suivre les résultats des examens surveillés, offrant ainsi une vue d'ensemble complète du processus d'examen.

## Installation

Pour installer et exécuter localement ce projet, suivez ces étapes :

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js et npm installés sur votre machine.
3. Créez une base de données MySQL nommée "surveillance" en exécutant le script SQL fourni dans le répertoire Prisma. Le script se trouve dans un fichier nommé "surveillance.SQL".
4. Vérifiez le fichier .env pour vous assurer que le chemin ou le lien vers la base de données est correctement spécifié.
5. Exécutez `npm install` pour installer les dépendances.
6. Exécutez `npm run dev` pour démarrer l'application en mode devloppement.
7. Exécutez la commande `npx next build` pour passer en mode production.
8. mail: `admin@ucd.ac.ma`, mot de pass: `admin1`
