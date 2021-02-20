const express = require('express');

const path = require('path');

const messenger = require('socket.io')();

const app = express();


const port = process.env.PORT || 5050;

app.use(express.static("public"));

app.get("/",(req, res) => {
	res.sendFile(path.join(__dirname, "/index.html")); 
});

app.get("/chat",(req, res) => {
	res.sendFile(path.join(__dirname, "/chat.html")); 
});

const server = app.listen(port,() => {
	console.log(`app is running on ${port}`);
});
//messenger is the connection manager - like a switchboard operator
messenger.attach(server);

users = [];

//socket is the individual connection - the caller
messenger.on('connection', (socket) => {
	console.log(`a user connected: ${socket.id}`);

	

	//send the connected user their assigned ID
	socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'});

	

	socket.on('chatmessage', function(msg){
		console.log(msg);
		messenger.emit('message', { id: socket.id, message: msg });
	})

	socket.on('connect', () => {
		console.log('a user has connected');
		message = `${socket.id} joined the chat`;
		messenger.emit('userconnect', message);
	})

	socket.on('disconnect', () => {
		console.log('a user has disconnected');
		message = `${socket.id} left the chat`;
		messenger.emit('userdisconnect', message);
	})

	socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    })
	socket.on('stopTyping', () => {
		socket.broadcast.emit('stopTyping');
	})
	// socket.on('joined', (data) => {
    //     socket.broadcast.emit('joined', (data));
    // });

    // socket.on('leave', (data) => {
    //     socket.broadcast.emit('leave', (data));
    // });
	
});

