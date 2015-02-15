'use strict';

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'sayin');
		if (rest === undefined) {
			rest = api.parseCommand(msg.text, 'say');
			if (rest === undefined) { return; }
			console.log(this.name + ' saying "' + rest + '"');
			api.say({text:rest});
			return true;
		}
		var i = rest.indexOf(' ');
		var channel = rest.substring(0, i);
		var text = rest.substring(i + 1);
		console.log(this.name + ' saying "' + text + '" on channel "' + channel + '"');
		api.say({text:text, channel:channel});
		return true;
	},
	help:        '\n`!say` <stuff>` - says given text in current channel\n`!sayin <channel_name> <stuff>` - say given text to given channel (can be a username)',
	description: 'says what you request it to'
};
