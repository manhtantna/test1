//router admin
var express = require('express');
var router = express.Router();
var passport= require('passport');
var localStrategy =require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

require('../passport.js')(passport);

var User  = require('../app/models/user.js');
var adminController = require('../app/controllers/adminController');

var isAdmin = function(req,res,next){
	if(req.isAuthenticated()){
		if(req.user.level==3) next();
		else res.send('not permission' + '<a href="">click<a>');
	}else 
		res.redirect('/admin/login');
};
router.get('/login',adminController.getLogin);
router.post('/login',
	passport.authenticate('local',
		{	successRedirect: '/admin',
			failureRedirect: '/admin/login',
			failureFlash: true
		})
	);
router.get('/',isAdmin,adminController.getIndex);
router.get('/user/list',isAdmin,adminController.getList);

router.get('/user/add',isAdmin,adminController.getAdd);
router.post('/user/add',adminController.postAdd);

router.get('/user/edit/:username',isAdmin,adminController.getEdit);
router.post('/user/edit/:username',adminController.postEdit);

router.get('/user/delete/:username',isAdmin,adminController.getDelete);
module.exports = router;
