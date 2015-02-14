'use strict';

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'shot');
		if (rest === undefined) { return; }
		
		var shotFile = api.takeScreenshot(rest);
		console.log('saved screenshot: ' + shotFile);

		return true;
	},
	help:        '\n`!shot` - takes screenshot named shot_<timestamp>.png\n!`shot filename.png` - takes screenshot `filename.png`',
	description: 'saves bot browser\'s screenshot'
};
