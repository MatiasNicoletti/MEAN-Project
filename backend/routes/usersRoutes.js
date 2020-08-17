const express = require('express');
const post = require('../models/post');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');

router.route('/signup')
    .post(catchAsync(async (req, res, next) => {
        bcrypt.hash(req.body.password, 10).then(
            (hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save().then(res.status(201).json({
                    message: 'success',
                    user
                }))
                
            }
        );
    })); 

    module.exports = router;