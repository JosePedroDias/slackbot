plugins.push({
	onNewMessage: function(msg) {
		console.log('\n->\n' + JSON.stringify(msg, null, '  '));
	}
});
