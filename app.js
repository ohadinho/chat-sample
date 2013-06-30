
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io')  // library for realtime web applications based on WebSocket protocol

var app = express()
, server = http.createServer(app)
, io = socketio.listen(server);

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'hjs');
    app.use(express.favicon());
    app.use(express.logger('dev')); // Express logger
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser()); // To parse cookies
    app.use(express.session({secret: '1234567D9sQWERTY'})); // To use sessions
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public'))); 
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));  
});


io.configure('production', function(){
    io.enable('browser client etag');
    io.set('log level', 1);
});

io.configure('development', function(){
    io.set('log level', 1);
});

var users = {};

io.sockets.on('connection', function (socket) {		
	
	socket.on('join', function(userNameParam) {
		socket.join('chatchannel'); // create/join a socket.io room
		users[userNameParam] = userNameParam; // save the user name in the users array
		socket.userName = userNameParam; // save the user name inside the socket
		socket.emit('firstLogin',users); // when a user login first, call 'firstLogin' only in that client socket
		socket.broadcast.to('chatchannel').emit('addConnectedUser',userNameParam); // tells everyone except that user that a new user has been connected
	});
	
	socket.on('leave', onUserDisconnected);
	
	socket.on('disconnect', onUserDisconnected);
	
	function onUserDisconnected() {
	    delete users[socket.userName]; // removing the user from users list
	    io.sockets.in('chatchannel').emit('logout',socket.userName); // call logout event on client
	    socket.leave('chatchannel'); // leaving socket.io 'chatchannel' room
	}
	
	socket.on('send', function(userName, messageText) {
	  io.sockets.in('chatchannel').emit('message',userName, messageText);
	});
});
	
require('./routes')(app);
