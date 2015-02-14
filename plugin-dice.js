'use strict';

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		var expr = api.parseCommand(msg.text, 'dice');
		if (expr === undefined) { return; }

		var n = parseInt(expr, 10);

		if (isNaN(n)) { return; }

		var result = api.randomInt(n) + 1;

		console.log('dice: ' + result);
		api.say({
			text: this.name + ' says: ' + result + ( (api.getCurrentChannel() ===  msg.from) ? '' : ' to ' + msg.from )
		});

		return true;
	},
	help:        '`!dice <n>` - returns a number between `1` and `n`',
	description: 'rolls a dice for you'
};
