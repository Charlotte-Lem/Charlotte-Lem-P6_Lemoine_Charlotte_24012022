//import du framework de node.js = express
const express = require('express');

//module qui nettoie les nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
const mongoSanitize = require('express-mongo-sanitize');

//plugin pour l'upload des images
const path = require('path');

//module qui stocke les données de session sur le client dans un cookie
// const cookieSession = require('cookie-session');

//importation des differentes routes : route de connection à la BDD de mongoDB route sauce et route user
const mongoose = require('./db/db');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//analyse le corps des requetes
const app = express();

//helmet configure de manière appropriée des en-têtes HTTP et aide a protéger l'application contre certaines vulnérabilités
const helmet = require('helmet');
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});


//renvoie le corp de la requetes en format json
app.use(express.json());

//permet de parser les requêtes envoyées par l'utilisateur
app.use(express.urlencoded({ extended: true }));

// Pour supprimer des données à l'aide des valeurs par défaut
app.use(mongoSanitize());

//gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//module export
module.exports = app;

//affichage des requetes dans la console
mongoose.set('debug', true);
