plugins.push({
	onNewMessage: function(msg) {
		//console.log('\n->\n' + JSON.stringify(msg, null, '  '));
		console.log([
			'-> ', msg.from, ' @ ', msg.channel, '\n',
			msg.text
		].join(''));
	},
	help:        'this plugin doesn\' respond to commands',
	description: 'prints incoming messages to console.log'
});
