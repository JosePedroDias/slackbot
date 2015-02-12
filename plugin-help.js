plugins.push({
	onNewMessage: function(msg) {
		if (msg.text.substring(0, 5) !== '!help') { return; }

		var expr = msg.text.substring(5).trim();

		var genericMode = (expr === '');

		var msg2 = ['help says:'];

		plugins.forEach(function(pluginHandler) {
			if (genericMode) {
				msg2.push( [pluginHandler.name, ' - ', pluginHandler.description || 'no info'].join('') );
			}
			else if (pluginHandler.name === expr) {
				msg2.push(pluginHandler.help);
			}
		});

		var n = parseInt(expr, 10);

		if (isNaN(n)) { return; }

		api.say({
			text: msg2.join('\n')
		});
	}
});