
// SS - Server Send || SR - Server Receive
// CS - Client Send || CR - Client Receive

$(document).ready(function() {
	var socket = io.connect('http://localhost:3000');
	
	$('#btn-login').click(function(){
		var username = $('#username').val();
		socket.emit('CS-userLogin',username);
	});
	//get list user
	$('#btnListUser').click(function(){
		socket.emit('CS-getListUser');
		$('#listUser').html('');
		
	});
	
	socket.on('SS-getListUser',function(data){
		//console.log(data);
		$('#tblUserOnline').show(function(){
			data.forEach(function(user){
				$('#listUser').append(`<li class="text-success"><button id="${user.id}" class="btn btn-link">${user.name}</button></li>`);
			});
		});
	});
	$('#listUser').on('click','li>button',function(){		
		var id = $(this).attr('id');// ok console.log(id);
		$('#chatbox').show();
		
	});
	// room
	$('#roomChat').on('click','li>button',function(){
		var room = $(this).attr('id');
		//console.log(room);
		socket.emit('CS-joinRoom',room);
	});
	//message room
	$('#btn-sendRoomMessage').click(function(){
		var message = $('#textRoomMessage').val();
		socket.emit('CS-roomMessage',message);
		$('#textRoomMessage').val('');
	});
	socket.on('SS-roomMessage',function(message){
		$('#roomMessage').append(`
		<li>
			<div class="d-inline-flex">
				<img src="images/admin.png" alt="ping" width="30px" height="30px">
				<p class="text-left ">${message} </p>
			</div>
		</li>
		`);
	});
	//send message to everybody

	$('#btn-sendMessage').click(function(){
		var message = $('#textMessage').val();
		socket.emit('CS-message',message);
		$('#textMessage').val('');
	})
	socket.on('SS-messageFromClient',function(message){
		$('#worldMessage').append(`
		<li>
			<div class="d-inline-flex">
				<img src="images/admin.png" alt="ping" width="30px" height="30px">
				<p class="text-left ">${message} </p>
			</div>
		</li>
		`);
	});
	//
});