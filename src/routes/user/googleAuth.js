const express = require('express');
const router = express();
const passport = require('passport'); 
require('../../controllers/passport');

router.use(passport.initialize()); 
router.use(passport.session());

const userController = require('../../controllers/userController');

// Auth 
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

// Auth Callback 
router.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/success', 
		failureRedirect: '/'
}));

// Success 
router.get('/success' , userController.successGoogleLogin); 

// failure 
router.get('/failure' , userController.failureGoogleLogin);

module.exports = router;