# Projet Dev : D-Bot

- [Projet Dev : D-Bot](#projet-dev--d-bot)
  - [Idée principale (résumé)](#idée-principale-résumé)
  - [Tâches principales](#tâches-principales)
  - [Technologies](#technologies)
  - [Base de donnée (Pour l'instant)](#base-de-donnée-pour-linstant)
  - [Modèle de donnée](#modèle-de-donnée)
  - [Crédits](#crédits)

## Idée principale (résumé)

Un site web qui est un outils de création de bot discord, d'abord sous forme de formulaires, puis avec le principe de blocs scratch (Plus ludique). Il serait possible d'exporter le projet directement dans un `.zip` et il suffira de faire un `npm install` pour initialiser le projet.  
D'autre fonctionnalités sont à prévoir comme le partage de certains blocs/commandes fait par la communauté ou encore une application pour gérer automatiquement l'installation et la config du bot.  

---

## Tâches principales

- [X] Setup le github
- [ ] Faire le squelette du site
- [ ] Schéma de la BDD (UML) - 5 pts (1 pts par table)
- [ ] Création du site web de base (routing, ect. No CSS) - 1 pts
- [ ] Mise en place et lien avec la BDD - 3 pts
- [ ] Login/Register + Login avec les sites tiers - 4 pts
- [ ] HomePage, ProfilePage, AdminPage - 3 pts
- [ ] Page de création *formulaires* (Seulement fonctionnel) - 4 pts
- [ ] Export en ZIP - 3 pts
- [ ] Style général du site - 1 pts
- [ ] Partage des blocs crées par la commu (donc système de sauvegarde/CRUD) - 3 pts
- [ ] Intégration du style scratch - 6 pts

Total de points : `33 pts`

---

## Technologies

- Backend :
    Node.JS, ExpressJS, SQLite et DiscordJS

- Frontend :
    HTML, CSS (Obvious), Tailwindcss et ReactJS ou/et AplineJS

---

## Base de donnée (Pour l'instant)

| **User** | **Bloc**    | **Upvote** | **Downvote** | **Comments** |
|----------|-------------|------------|--------------|--------------|
| Id       | Id          | Id         | Id           | Id           |
| Username | UserId      | UserId     | UserId       | UserId       |
| Email    | Content     | BlocId     | BlocId       | Content      |
| Roles    | BlocContent | --         | --           | BlocId       |
| Badges   | --          | --         | --           | --           |

---

## Modèle de donnée

![Schema de donnée](https://i.imgur.com/GhxRSKb.png)

---

## Crédits

Valentin DAUTREMENT.
