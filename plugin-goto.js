plugins.push({
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'goto');
		if (rest === undefined) { return; }
		
		if (rest[0] === '@') {
			// user
			console.log(this.name + ' going to direct message tab with ' + rest);
			api.goToDirectMessage( rest.substring(0) );
		}
		else {
			// channel
			console.log(this.name + ' going to channel tab ' + rest);
			api.goToChannel( rest );
		}

		console.log(this.name + ' saying "' + rest + '"');
	},
	help:        '`!goto` <user or channel>` - moves bot to user/channel tab',
	description: 'moves bot to given user or channel'
});
