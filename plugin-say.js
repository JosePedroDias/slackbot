plugins.push({
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'say');
		if (rest === undefined) { return; }
		
		console.log(this.name + ' saying "' + rest + '"');
		api.say({text:rest});

		return true;
	},
	help:        '`!say` <stuff>` - says given text',
	description: 'says what you request it to'
});
