'use strict';

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		var expr = api.parseCommand(msg.text, 'help');
		if (expr === undefined) { return; }

		var genericMode = (expr === '');

		var msg2 = ['help says:'];

		plugins.forEach(function(pluginHandler) {
			if (genericMode) {
				msg2.push( ['* ', pluginHandler.name, ' - ', pluginHandler.description || 'no info'].join('') );
			}
			else if (pluginHandler.name === expr) {
				msg2 = ['help says: ' + pluginHandler.help];
			}
		});

		api.say({
			text: msg2.join('\n')
		});

		return true;
	},
	help:        '\n`!help` - lists loaded plugins\n`!help <plugin_name>` - displays plugin usage info',
	description: 'me!'
};
