//import de bcrypt pour hasher le mot de passe
const bcrypt = require('bcrypt');
//import de jsonwebtoken pour le token user
const jwt = require('jsonwebtoken');
//import du shema model users
const User = require('../models/User');
//import de crypto pour chiffrer l'adresse mail
const CryptoJS = require('crypto-js');
//importation des variable d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();



//fonction inscription new user
exports.signup = (req, res, next) => {
  //chiffrer l'email avant l'envoie dans la BD
  const emailCryptoJs = CryptoJS.HmacSHA256(req.body.email, `$(process.env.CRYPTOJSKEY_EMAIL`).toString();
  console.log('contenu email');
  console.log(emailCryptoJs);

  // Le mot de passe sera 'salé' 10 fois par la fonction de hashage 'bcrypt'
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save() // Le nouvel utilisateur est enregistré dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => {
          console.error(error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error });
    });
};

//fonction login user existant
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
