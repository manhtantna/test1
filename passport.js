
var localStrategy = require('passport-local');
var bcrypt = require('bcryptjs');
var User = require('./app/models/user');
module.exports = function (passport) {
	
	passport.serializeUser(function (user, done) {
		done(null, user);
	});
	passport.deserializeUser(function (user, done) {
		done(null, user);
	});
	passport.use(new localStrategy(function (username, password, done) {
		User.findOne({'username': username}, function (err, user) {
			if (err) {done(err);} 
			else 
			{
				if (user) {					
					bcrypt.compare(password,user.password, function(err, result) {				
	    				if(result) {
	    					done(null, user);   					
	    				}
	    				else done(null, false);
					});
				}
				else {
					done(null, false);
				}
			}
		});
	}));
	return passport;
}
