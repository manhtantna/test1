var bcrypt = require('bcryptjs');
bcrypt.genSalt(10,function(err,salt){
	bcrypt.hash('abcd',salt,function(err,hash){
		console.log(hash +'/n');
		bcrypt.compare('abcd',hash,function(err,res){
			console.log(res);
		});
		bcrypt.compare('abcdef',hash,function(err,res){
			console.log(res);
		});
	});
});
