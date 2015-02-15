'use strict';

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'html');
		if (rest === undefined) { return; }
		
		var htmlFile = api.saveHTML();
		console.log('saved html: ' + htmlFile);

		return true;
	},
	help:        '`!html` - saves bot browser window html to file',
	description: 'outputs window html to file'
};
