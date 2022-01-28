//import
const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();

//import du middleware password
const password = require('../middleware/password');

router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
