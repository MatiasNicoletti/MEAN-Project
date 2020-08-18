const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');


router.route('/').post(postController.createPost).get(postController.getPosts);

router.route('/:id')
    .get(postController.getPostById)
    .delete(checkAuth, postController.deletePost)
    .put(checkAuth, postController.updatePost);  

module.exports = router;