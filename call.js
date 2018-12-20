 var Peer = require('peerjs');
$(document).ready(function(){
	function openStream() {
	    const config = { audio: false, video: true };
	    return navigator.mediaDevices.getUserMedia(config);
	};

	function playStream(idVideoTag, stream) {
	    const video = document.getElementById(idVideoTag);
	    video.srcObject = stream;
	    video.play();
	};
	//openStream().then(stream => playStream('idCall', stream));
	var peer = new Peer({key: 'lwjd5qra8257b9'});
	peer.on('open', function(id){
		console.log(id);
	})
});

