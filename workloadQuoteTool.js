'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
    RedisSMQ = require("rsmq"),
    rsmq = new RedisSMQ( {host: "localhost", port: 6379, ns: "rsmq"}),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

function createQueue(){
    rsmq.createQueue({qname:"myqueue"}, function (err, resp) {
        if (resp===1) {
            console.log("queue created")
        }
    });
}

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
//app.listen(config.port);

app.get('server').listen(config.port);

app.on('error', function(err) {
    console.log('caught ' + err);
});

createQueue();

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);