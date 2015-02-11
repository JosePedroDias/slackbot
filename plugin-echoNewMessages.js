plugins.push(function echoNewMessages(msg, api) {
	console.log('\n->\n' + JSON.stringify(msg, null, '  '));
});
