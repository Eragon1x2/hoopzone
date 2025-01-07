const express = require('express');
const { getAllComments, getOneComment, postComment } = require('../controllers/commentController');
const authController = require('../controllers/authController');
const router = express.Router();


router.route('/').get(getAllComments).post(authController.protect,postComment)
router.route('/:id').get(getOneComment)


module.exports = router;