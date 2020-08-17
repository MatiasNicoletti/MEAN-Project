const express = require('express');
const post = require('../models/post');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');

router.route('/signup')
    .post(async (req, res, next) => {
        bcrypt.hash(req.body.password, 10).then(
            (hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save().then(result => res.status(201).json({
                    message: 'success',
                    result
                })
                ).catch(error => {
                    res.status(500).json({ error })
                })
            }
        );
    });

module.exports = router;