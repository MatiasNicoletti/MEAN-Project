const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const MINE_TYPE_MAP={
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',

}
const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        const isValid = MINE_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null;
        }
        callback(error, '../backend/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MINE_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext); 
    }
});

router.route('/')
    .post( multer({storage}).single('image'), async(req, res, next) => {
        const post = new Post({
            title: req.body.title,
            content: req.body.content
        });
        await post.save().then(result => {
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

router.route('/:id')
.get( async(req, res, next) => {
    await Post.findById(req.params.id).then(post => {
        if (post) {
            console.log(post);
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    })
}).delete(async (req, res, next) => {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'deleted' });
}).put(async (req, res, next) => {
    
    post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'success', post });
});

    module.exports = router;