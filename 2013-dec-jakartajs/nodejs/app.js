var sockjs 	= require('sockjs'),
	http	= require('http'),
	pool	= [],
	sock 	= sockjs.createServer(),
	server;

sock.on('connection', function(conn) {
	pool.push(conn);

	conn.on('data', function(message) {
		for (var i=0; i<pool.length; i++) {
			if (pool[i] !== conn) {
				pool[i].write(message);
			}
		}
	});
});

server = http.createServer();
sock.installHandlers(server, {prefix:'/sock'});
server.listen(3000, function(){
  console.log('Listening on port 3000');
});