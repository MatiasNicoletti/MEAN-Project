const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/signup')
    .post(userController.signup);
    // userController.login
router.route('/login').post(userController.login);

module.exports = router;