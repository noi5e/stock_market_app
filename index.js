var express = require('express');
var http = require('http');
var url = require('url');
var WebSocket = require('ws');

var app = express();

var server = http.createServer(app);
var webSocketServer = new WebSocket.Server({ server });

var bodyParser = require('body-parser');

var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/stock_market_app');
mongoose.connect(process.env.MONGODB_URI);

// look for static files
app.use(express.static('./server/static'));
app.use(express.static('./client/dist'));

// parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

const api = require('./server/routes/api');
app.use('/api', api);

app.get('*', function(request, response, next) {
	response.redirect('/');
});

app.use(function(request, response) {
	response.send({ msg: "hello" });
});

webSocketServer.on('connection', function connection(webSocket, request) {
	webSocket.isAlive = true;

	webSocket.on('pong', function() {
		webSocket.isAlive = true;
	});

	webSocket.on('message', function incoming(message) {
		console.log('received: %s', message);

		var broadcastRegex = /^broadcast\:/;

		if (broadcastRegex.test(message)) {
			message = message.replace(broadcastRegex, '');

			webSocketServer.clients.forEach(function(client) {
				if (client != webSocket) {
					client.send('Hello, broadcast message: ' + message);
				}
			});
		} else {
			webSocket.send('Hello, you sent -> ' + message);
		}
	});

	setInterval(function() {
		webSocketServer.clients.forEach(function(client) {
			if (!client.isAlive) { return client.terminate(); };

			client.isAlive = false;
			client.ping(null, false, true);
		});
	}, 10000);
});

server.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});