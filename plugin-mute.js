plugins.push({
	onNewMessage: function(msg) {
		var out;
		switch (msg.text) {
			case '!mute':
				this.isMuted = true;
				out = 'state set to muted';
				break;

			case '!unmute':
				this.isMuted = false;
				out = 'state set to unmuted';
				break;

			case '!ismuted':
				out = 'current state is ' + (this.isMuted ? 'muted' : 'unmuted');
				break;

			default:
				return this.isMuted;
		}

		api.say({text: this.name + ' says: ' + out});

		return true;
	},
	help:        '\n`!unmute` lets remaining plugins work\n`!mute` inhibits remaining plugins\n`!ismuted` display current mute state',
	description: 'when activated, no plugins below it receive onNewMessage calls',

	isMuted: true
});
