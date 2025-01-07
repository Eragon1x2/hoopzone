const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const router = express.Router();


router.route('/').get(authController.protect,postController.getAllPosts)
.post(authController.protect,postController.createPost)
router.route('/:id')
    .get(postController.getOnePost)
    .put(authController.protect,postController.updatePost)
    .delete(authController.protect,postController.deletePost)
router.route('/:id/like').post(authController.protect,postController.AddLike)
module.exports = router;