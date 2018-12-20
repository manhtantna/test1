var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var message = new Schema({
	nameroom: {type: String},
	historymessage: {type: Array},
	status: {type: Number ,default : 1},
},{collection : 'message'});
module.exports = mongoose.model('message', message);