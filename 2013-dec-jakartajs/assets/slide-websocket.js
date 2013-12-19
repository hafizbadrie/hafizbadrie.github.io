var sockjs = new SockJS('http://119.235.29.194:3000/sock');
$(function() {
    $.deck('.slide');

    sockjs.onmessage = function(e) {
		var command = e.data;

		$.deck(command);
	}
});
