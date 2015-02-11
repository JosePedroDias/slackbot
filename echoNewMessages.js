plugins.push(function echoNewMessages(msg) {
	console.log('\n->\n' + JSON.stringify(msg, null, '  '));
});
