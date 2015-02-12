plugins.push({
	onNewMessage: function(msg) {
		if (msg.text.substring(0, 5) !== '!dice') { return; }

		var expr = msg.text.substring(5).trim();

		var n = parseInt(expr, 10);

		if (isNaN(n)) { return; }

		api.say({
			text: 'dice says: ' + (api.randomInt(n) + 1) + ' to @' + msg.from
		});
	},
	help:        '`!dice <n>` returns a number between 1 and n',
	description: 'rolls a dice for you'
});