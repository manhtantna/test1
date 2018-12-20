var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var cookieparse =require('cookie-parser');

var router = express.Router();
var Product = require('../models/products.js');
var User = require('../models/user.js');

var pageController = {
	getIndex : function(req, res, next) {
		res.render('page/index', { title: 'Trang Chủ', user: req.user});
	},
	getProduct : function(req,res,next){
		Product.find({}).exec(function(err,result){
			res.render('page/product',{'product' : result} );
		});
	},
	getLogin : function(req, res, next) {
		res.render('login', { title: 'login' });
	},
	postLogin : function(req,res,next){
		var body=req.body;
		User.findOne({username: body.username}, function(err,user){
			if(!user){
				res.res.redirect('/login');
			}
			else{
				bcrypt.compare(body.password,user.password, function(err, result) {
    				//console.log(result);
    				var token = jwt.sign({username: user.username, _id: user._id}, 'secret');
    				//console.log(token);
    				//var decode = jwt.verify(token,'secret');
    				//console.log(decode.username);
    				res.cookie('auth',token);
    				if(result) res.redirect('/');
    				else res.redirect('/login');
				});
			}
		});
		//res.render('index',{user :req.user})
	},
	getRegister : function(req, res, next) {
		res.render('register', { title: 'register' });
	},
	createUser : function(req,res,next){
		var body = req.body;
		var username = body.username;
		User.findOne({'username' : username},  function(err,user){
			if(err){}
			else {
				if(user){
					res.status(500).send('user already exists');
					res.redirect('/register');
				}
				else {					
					bcrypt.genSalt(10, function(err,salt){
						bcrypt.hash(body.password,salt,  function(err,hash){							
							var user = new User();
							user.username =  username;
							user.password =  hash;
							user.save( function(err,result){
								if(err)  res.status(500).send('error');
								else   res.redirect('/register');
							});	
						});
					});					
				}	
			}
		});
		
	},
	createProduct : function(req,res,next){
		var name = req.body.inputName;
		var description = req.body.inputDescription;
		var status = req.body.inputStatus;
		var product = new Product();
			product.name = name;
			product.description = description;
			product.status = status;
		console.log(product.name + product.description + product.status);
		product.save(function(err,result){
			if (err) {
				res.status(500).send('save error');
			} else {
				res.redirect('/product');
			}
		});
		
	},
	getStream : function(req,res,next){
		res.render('page/stream/index',{title: 'live call'});
	}
};

module.exports = pageController;