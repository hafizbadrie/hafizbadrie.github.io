var sockjs = new SockJS('http://localhost:3000/sock');
$(function() {
    $.deck('.slide');

    sockjs.onmessage = function(e) {
		var command = e.data;

		$.deck(command);
	}
});