# Projet Dev : D-Bot

- [Projet Dev : D-Bot](#projet-dev--d-bot)
  - [Idée principale (résumé)](#idée-principale-résumé)
  - [Tâches principales](#tâches-principales)
  - [Technologies](#technologies)
  - [Base de donnée (Pour l'instant)](#base-de-donnée-pour-linstant)
  - [Modèle de donnée](#modèle-de-donnée)
  - [Comment installer](#comment-installer)
  - [Install du bot](#install-du-bot)
  - [Crédits](#crédits)

## Idée principale (résumé)

Un site web qui est un outils de création de bot discord, d'abord sous forme de formulaires, puis avec le principe de blocs scratch (Plus ludique). Il serait possible d'exporter le projet directement dans un `.zip` et il suffira de faire un `npm install` pour initialiser le projet.  
D'autre fonctionnalités sont à prévoir comme le partage de certains blocs/commandes fait par la communauté ou encore une application pour gérer automatiquement l'installation et la config du bot.  

---

## Tâches principales

- [X] Setup le github
- [x] Faire le squelette du site
- [x] Schéma de la BDD (UML) - 5 pts (1 pts par table)
- [X] Création du site web de base (routing, ect. No CSS) - 1 pts
- [X] Mise en place et lien avec la BDD - 3 pts
- [X] Login/Register + ~~Login avec les sites tiers~~ - 4 pts
- [X] HomePage, ProfilePage, AdminPage - 3 pts
- [X] Page de création *formulaires* (Seulement fonctionnel) - 4 pts
- [X] Export en ZIP (le zip est corrompu) - 1 pts
- [X] Style général du site - 1 pts
- [X] Partage des blocs crées par la commu (donc système de sauvegarde/CRUD) - 3 pts
- [ ] Intégration du style scratch - 6 pts

Total de points : `33 pts`

---

## Technologies

- Backend :
    Node.JS, ExpressJS, MySQL et DiscordJS

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

![Schema de donnée](https://i.imgur.com/TzvILWX.png)

---

## Comment installer

Il suffit de cloner le projet dans votre dossier personnel et de faire `npm install` pour initialiser le projet.

Ensuite, il faut créer la base de donnée avec le script ci-dessous.

```sql
CREATE TABLE users ( id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL, roles TEXT NOT NULL, badges TEXT NOT NULL, created_at TIMESTAMP NOT NULL );

CREATE TABLE blocs ( id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, userId INT NOT NULL, title VARCHAR(200) NOT NULL, content TEXT NOT NULL, blocContent TEXT NOT NULL, created_at TIMESTAMP NOT NULL, file VARCHAR(255) NOT NULL, FOREIGN KEY (userId) REFERENCES users(id));
```

Enfin, il suffit de lancer le serveur avec `npm run watch`.

PS: Pour avoir un user admin, il faut ajouter un role 'admin' à l'utilisateur dans la base de donnée.

PS 2 : Le download du zip marche mais le Zip est corrompu du coup il faut le prendre directement depuis `./d-bot/public/temp` :(

## Install du bot

- Décompressez le zip
- Faites un npm install
- Ajoutez les informations importantes dans le fichier `config.json` (token du bot, id du serveur ou il sera, id du bot)
- Lancez le bot avec `node src/bot.js`

---

## Crédits

Valentin DAUTREMENT.
