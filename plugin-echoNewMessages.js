plugins.push({
	onNewMessage: function(msg) {
		console.log('\n->\n' + JSON.stringify(msg, null, '  '));
	},
	help:        'this plugin doesn\' respond to commands',
	description: 'prints incoming messages to console.log'
});
