const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/').get((req, res) => {
    
})
router.post('/signup', authController.signup)
module.exports = router;