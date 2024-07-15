const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// testing purposes
router.post('/hi',(req,res)=>{
    res.send("Hi I am authRoutes")
});


router.post('/signup',authController.signup);
router.post('/login',authController.login)

module.exports = router;