var Message = require('../../app/models/message.js');
var listUser=[];

var chat = function(io){
	
	io.on('connection',function(socket){
		socket.on('CS-userLogin',function(username){
			var user ={ id:'',name:''};
			user.id = socket.id;
			user.name = username;
			listUser.push(user);			
		});
		socket.on('CS-getListUser',function(){
			socket.emit('SS-getListUser',listUser);
		})
		socket.on('disconnect',function(){
			var vt = listUser.indexOf(socket.username);
			console.log(vt);
			//listUser.splice(vt,1);
		});
		socket.on('CS-message',function(message){
			//console.log(message);
			io.sockets.emit('SS-messageFromClient',message);
		});
		//room
		socket.on('CS-joinRoom',function(room){
			socket.join(room,function(){
				socket.room = room;
			});
		});
		socket.on('CS-roomMessage',function(message){
			//console.log(socket.room);
			io.to(socket.room).emit('SS-roomMessage',message);
		});

	});

	return io;
}

module.exports = chat;