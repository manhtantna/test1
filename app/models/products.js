var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var products = new Schema({
	name: {type: String},
	description: {type: String},
	status: {type: Number},
},{collection : 'products'});
module.exports = mongoose.model('products', products);