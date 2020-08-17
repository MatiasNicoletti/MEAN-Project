const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const MINE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',

}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MINE_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
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
    .post(checkAuth, multer({ storage }).single('image'), async (req, res, next) => {
        const url = req.protocol + '://' + req.get('host');
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename,
            creator: req.userData.userId
        });
        await post.save().then(result => {
            res.status(201).json({
                status: 'success',
                post: { ...result, id: result._id }
            });
        });
    })
    .get(async (req, res, next) => {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const postQuery = Post.find();
        let fetchedPosts;
        let count;
        if (pageSize && currentPage) {
            postQuery.skip(pageSize * (currentPage - 1))
                .limit(pageSize);
        }
        count = await Post.count();
        fetchedPosts = await postQuery;
        return res.status(200).json({
            status: 'success',
            fetchedPosts,
            count
        });
    });

router.route('/:id')
    .get(async (req, res, next) => {
        await Post.findById(req.params.id).then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
    })
    .delete(checkAuth, async (req, res, next) => {
        const result = await Post.deleteOne({ _id: req.params.id ,creator: req.userData.userId});
        if(result.deleteCount > 0){
            res.status(200).json({ message: 'deleted', result }); 
        }else{
            res.status(401).json({ message: 'Not Authorized', result }); 
        }
    })
    .put(checkAuth, multer({ storage }).single('image'), async (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get('host');
            imagePath = url + '/images/' + req.file.filename;
        }
        const updatedPost = {
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath 
        }
        Post.updateOne({_id: req.params.id,creator: req.userData.userId},updatedPost)
            .then(result => {
                if(result.nModified > 0){
                    res.status(200).json({ message: 'success', result }); 
                }else{
                    res.status(401).json({ message: 'Not Authorized', result }); 
                }
                  
            });
        
    });  

module.exports = router;