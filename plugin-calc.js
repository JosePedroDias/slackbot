plugins.push(function calc(msg, api) {
	if (msg.text.substring(0, 5) !== '!calc') { return; }
	
	var expr = msg.text.substring(5).trim();
	try {
		var result = eval(expr);
		api.say({
			text: 'calc says: ' + result  + ' to "' + msg.text + '"'
		});
	} catch (ex) {
		console.log('EXCEPTION', ex);
	}
});