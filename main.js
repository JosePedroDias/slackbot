//var system = require('system');



var haveConfig = phantom.injectJs('config.js');
if (!haveConfig) {
	console.log('create a file named config.js, setting the config object');
	phantom.exit(1);
}

/*var args = system.args.slice();
args.shift();
console.log('system args:' + args);*/




var messages = [];



var page = require('webpage').create();
// page.settings.resourceTimeout = 30000;
// page.settings.loadImages      = false;
page.webSecurityEnabled       = false;



phantom.injectJs('tasks.js');



var step = 'login';

var url = getUrl(config, config.channels[0]);



var doStep = function() {
	var zzz = (step === 'login' ? 1 : 11);
	console.log('step ' + step + ' after ' + zzz + ' s...');

	window.setTimeout(
		function() {
			var res;
			if (step === 'login') {
				res = login(page, config);
				console.log('logging in: ' + (res === 'failed' ? 'not required' : 'ok') );

				step = 'logged-in';
			}
			else {
				messages = getMessages(page);

				// console.log('messages:');
				// console.log( JSON.stringify(messages, null, '  ') );
				console.log('fetched ' + messages.length + ' messages.');
				saveJSON('messages.json', messages);

				console.log('sending message...');
				res = sendMessage(page, 'hi there!');

				/*window.setTimeout(
					function() {
						console.log('about to render');
						page.render('slackbot.png');
						console.log('exiting.');
						phantom.exit();
					},
					2 * 1000
				);*/

				window.setTimeout(
					function() {
						console.log('exiting.');
						phantom.exit();
					},
					2 * 1000
				);
			}
			console.log('res: ' + res);
		},
		zzz * 1000
	);
};



page.onLoadFinished = function(status) {
    console.log("\npage loaded: ", status, page.url/*, page.title*/);
    doStep();
};



page.open(url, function(status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit(1);
	}
});
