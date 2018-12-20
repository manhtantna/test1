//model
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var user = new Schema({
	username: {type: String, required : true},
	password: {type: String , required : true},
	image : {type: String, default : 'user.png'},
	level: {type: Number, default: 1},
	status: {type: Number, default : 1},
	created : {type : Date, default :Date.now}
}, {collection: 'user'});


module.exports = mongoose.model('user', user);