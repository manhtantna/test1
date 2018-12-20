//controller admin
var express = require('express');
var router = express.Router();
//var multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var passport = require('passport');
var flash = require('connect-flash');


var User  = require('../models/user.js');

var adminController = {
	getLogin:function(req,res,next){
		res.render('admin/login',{title: ' Trang Đăng Nhập'});
	},
	postLogin:function(req,res,next){
		var body=req.body;
		User.findOne({username: body.username}, function(err,user){
			if(!user){
				res.res.redirect('/admin/login');
			}
			else{
				bcrypt.compare(body.password,user.password, function(err, result) {				
    				//console.log(token);
    				//var decode = jwt.verify(token,'secret');
    				//console.log(decode.username);
    				if(result) {
    					var token = jwt.sign({username: user.username, level: user.level, status:user.status}, 'secret');
    					res.cookie('auth',token);
    					res.redirect('/admin');
    				}
    				else res.redirect('/admin/login');
				});
			}
		});
	},  
	getIndex: function(req,res,next){
		//var token = req.cookies.auth;
		//var user = jwt.verify(token,'secret');	
		//if(user.level<3){
		//	res.status(500).send('account not per mission'+ ' <a href="/"> click</a>');
			
		//}else{
		//	res.render('admin/index',{title : ' Trang Quản Trị', user: user});
		//}
		//console.log(req.user);
		res.render('admin/index', {title : ' Trang Quản Trị',user: req.user});	
		
	},
	getList: function(req,res,next){
		
		User.find({}).exec(function(err,result){
				if(err){}

				res.render('admin/user/list',{title : ' Danh Sách Thành Viên',user : result});	
		});
	},
	getAdd: function(req,res,next){
		res.render('admin/user/add',{title : ' Thêm Thành Viên', message : req.flash('message')});
	},
	postAdd: function(req,res,next){
		var body = req.body;
		var username = body.username;
		var level = body.level;
		var status = body.status;

		User.findOne({'username' : username},  function(err,user){
			if(err){}
			else {
				if(user){
					req.flash('message','Tài Khoản Đã Tồn Tại');
					res.redirect('add');
				}
				else {					
					bcrypt.genSalt(10, function(err,salt){
						bcrypt.hash(body.password,salt,  function(err,hash){							
							var user = new User();
							user.username =  username;
							user.level= level;
							user.status = status;
							user.password =  hash;
							user.save( function(err,result){
								if(err)  {
									req.flash('message','bi loi ');
									res.redirect('add');
								}
								else  {
									req.flash('message','Thêm Thành Công Tài Khoản');
									res.redirect('add');
								}
							});	
						});
					});					
				}	
			}
		});
		
	},
	getEdit: function(req,res,next){
		var username = req.params.username;
		User.findOne({ 'username' : username}).exec(function(err,user){
			if( err){}
			res.render('admin/user/edit',{title : ' Sửa Thành Viên', users : user, message : req.flash('message')});
		})	
	},
	postEdit: function(req,res,next){
		var body =req.body;
		var username = req.params.username;
		User.findOneAndUpdate({'username': username},
		{ $set: {username: body.username, level: body.level , status : body.status}},
			{new: true, overwrite: true},
			function(err,user){
				if(err) {console.log(err);}
				req.flash('message','Sửa Thành Công');
				res.redirect( user.username);
			}
		);
	},
	getDelete: function(req,res,next){
		var username = req.params.username;
		User.findOneAndRemove({'username' : username},function(err,result){
			if(err) throw err;
			res.redirect('/admin/user/list');
		});
	},
	getLogout: function(req,res,next){
		req.logout();
		res.redirect('/admin');
	},
}
module.exports = adminController;