const express = require('express');
const post = require('../models/post');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

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

router.route('/login').post(async (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({ message: 'login failed' });
        }
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({
                message: 'login failed'
            });
        }
        const token = jwt.sign({ email: user.email, userId: user._id }, 'secret_password'
            , {expiresIn: '1h'});
        res.status(200).json({token});
    });
});

module.exports = router;