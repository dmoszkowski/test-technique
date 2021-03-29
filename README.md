# test-technique

Application simple permettant d'afficher une liste d'utilisateurs, et permettant à de nouveaux utilisateurs de s'enregistrer, se connecter, et modifier leur profil.

## Configuration

Ouvrir le fichier `.env` à la racine du projet, pour configurer l'adresse de la BDD mongoDB à utiliser.
La variable RAZZLE_MONGO_URI doit contenir l'URI de connection mongoDB correspondante.
Par exemple :

```bash
RAZZLE_MONGO_URI=mongodb://localhost/testTechnique
```

## Installer les dépencances et lancer l'application

Avec yarn :
```bash
yarn
yarn start
```

Ou avec npm :
```bash
npm install
npm start
```

Le serveur se lance sur le port `3000` par défaut. Pour choisir un autre port, il faut fournir la variable d'environnement `PORT` lors de la commande `yarn start` ou `npm start`.

Exemple :
```bash
PORT=80 yarn start
```
