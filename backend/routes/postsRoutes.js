const express = require('express');
const Post = require('../models/post');
const router = express.Router();

router.route('/')
    .post((req, res, next) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        post.save().then(result => {
            res.status(201).json({
                status: 'success',
                postId: result._id
            });
        });
    })
    .get(async (req, res, next) => {
        const posts = await Post.find();
        return res.status(200).json({
            status: 'success',
            posts
        });
    });

router.route('/:id').get((req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    })
}).delete(async (req, res, next) => {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'deleted' });
}).put(async (req, res, next) => {
    post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })});

    module.exports = router;