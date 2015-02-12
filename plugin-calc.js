plugins.push({
	onNewMessage: function(msg) {
		/*jshint evil:true */
		if (msg.text.substring(0, 5) !== '!calc') { return; }
		
		var expr = msg.text.substring(5).trim();
		try {
			expr = expr
				.replace(/alert/g,   '')
				.replace(/confirm/g, '')
				.replace(/open/g,    '')
				.replace(/prompt/g,  '')
				.replace(/process/g, '')
				.replace(/require/g, '');

			var result = eval(expr);
			api.say({
				text: 'calc says: ' + result + ' to @' + msg.from
			});
		} catch (ex) {
			//console.log('EXCEPTION', ex);
			api.say({
				text: 'calc says: 42 to @' + msg.from
			});
		}
	},
	help:        '`!calc <expr>` returns result of expression',
	description: 'calculates stuff'
});
