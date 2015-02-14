'use strict';

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		'use strict';
		/*jshint evil:true */

		var fs, require, window, open, process;

		var expr = api.parseCommand(msg.text, 'calc');
		if (expr === undefined) { return; }

		var result = 42;
		try {
			result = eval(expr);
		} catch (ex) {}

		console.log('calc: ' + result);
		api.say({
			text: this.name + ' says: ' + result + ' to @' + msg.from
		});

		return true;
	},
	help:        '`!calc <expr>` - returns result of expression',
	description: 'calculates stuff'
};
