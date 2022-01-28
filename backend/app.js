//import de express
const express = require('express');

//importation des differentes route
const mongoose = require('./db/db');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

const helmet = require('helmet');
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(express.json());

//headers
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

//gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

//module export
module.exports = app;

//affichage des requetes dans la console
mongoose.set('debug', true);
