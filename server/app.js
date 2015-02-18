/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var twit = require("node-tweet-stream");

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;

/*
var status = "on";
setInterval(function() {
	status = status === "on" ? "off" : "on";
	var servicenum = Math.floor(Math.random() * (6) + 1);
	socketio.emit('statusupdate', {name: "service"+servicenum, status: status});
}, 2000);
*/

var t = new twit({
	consumer_key: process.env.TWITTER_API_KEY,
	consumer_secret: process.env.TWITTER_API_SECRET,
	token: process.env.TWITTER_TOKEN,
	token_secret: process.env.TWITTER_TOKEN_SECRET
});

t.track("#knoxdevstatus");

t.on("tweet", function (tweet) {
	var command = tweet.split();
	if(command.length === 3) {
		var status = {};
		status.name = command[1];
		status.status = command[2];
		socketio.emit('statusupdate', status);
	}
});

t.on("error", function (err) {
	console.log("Error with Twitter stream: %o", err);
});