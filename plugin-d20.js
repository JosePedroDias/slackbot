plugins.push(function d20(msg, api) {
	if (msg.text.substring(0, 2) !== '!d') { return; }

	var expr = msg.text.substring(2).trim();

	var n = parseInt(expr, 10);

	if (isNaN(n)) { return; }

	api.say({
		text: 'd20 says: ' + (api.randomInt(n) + 1) + ' to "' + msg.text + '"'
	});
});