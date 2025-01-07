const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(authController.protect,(req, res) => {
    res.send("hello world")
})
router.route('/:id').get(userController.getOneUser)

module.exports = router;