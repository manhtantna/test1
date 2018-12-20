var url = 'mongodb://127.0.0.1:27017/test';
var mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
	mongoose.connect(url,{ useNewUrlParser: true });
	mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var products = new Schema({
	name: {type: String},
	description: {type: String},
	status: {type: Number},
},{collection : 'products'});
var CreateDB = mongoose.model('products', products);
var cr = new CreateDB({name: 'tan1', description:'abc1', status: 1});
	cr.save();