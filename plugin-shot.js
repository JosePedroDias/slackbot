plugins.push({
	onNewMessage: function(msg) {
		var rest = api.parseCommand(msg.text, 'shot');
		if (rest === undefined) { return; }
		
		var shotFile = api.takeScreenshot(rest);
		console.log('saved screenshot: ' + shotFile);
	},
	help:        '\n`!shot` - takes screenshot named shot_<timestamp>.png\n!`shot filename.png` - takes screenshot `filename.png`',
	description: 'saves bot browser\'s screenshot'
});
