//import
const express = require('express');
const router = express.Router();

//import du controller 
const userCtrl = require('../controllers/user');

//import du middleware controleEmail
const controleEmail = require('../middleware/controleEmail');

//import du middleware password
const password = require('../middleware/password');

//Creation d'un nouvel utilisateur controle et chiffre l'email , controle et hash le password 
router.post('/signup', controleEmail, password, userCtrl.signup);
//Vérification des infos de l'utilisateur pour la connection 
router.post('/login', userCtrl.login);

module.exports = router;
