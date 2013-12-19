var sockjs = new SockJS('http://localhost:3000/sock');

document.getElementById('next').onclick = function(e) {
	e.preventDefault();
	sockjs.send('next');
}

document.getElementById('prev').onclick = function(e) {
	e.preventDefault();
	sockjs.send('prev');
}