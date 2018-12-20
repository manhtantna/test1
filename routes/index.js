var express = require('express');
var router = express.Router();

var passport= require('passport');
var localStrategy =require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

require('../passport.js')(passport);
/* GET home page. */
var User  = require('../app/models/user.js');
var Products = require('../app/models/products.js');

var pageController = require('../app/controllers/pageController.js');

var isLogin = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else 
		res.redirect('/login');
};

router.get('/',isLogin,pageController.getIndex);

router.get('/product',pageController.getProduct);
router.post('/product',pageController.createProduct);

router.get('/login',pageController.getLogin);
router.post('/login',
		passport.authenticate('local',
			{	successRedirect: '/',
				failureRedirect: '/login',
				failureFlash: true
			})
	);
router.get('/register',pageController.getRegister);
router.post('/register',pageController.createUser);
router.get('/stream',pageController.getStream);
module.exports = router;
