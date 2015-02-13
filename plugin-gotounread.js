plugins.push({
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'gotounread');
		if (rest === undefined) { return; }

		api.goToUnread();

		return true;
	},
	help:        '`!gotounread`',
	description: 'makes bot move to an unread tab'
});
