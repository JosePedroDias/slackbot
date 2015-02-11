//var system = require('system');



var haveConfig = phantom.injectJs('config.js');
if (!haveConfig) {
	console.log('create a file named config.js, setting the config object');
	phantom.exit(1);
}

/*var args = system.args.slice();
args.shift();
console.log('system args:' + args);*/



var plugins = [];
config.plugins.forEach(function(pluginName) {
	console.log('Loading plugin ' + pluginName + '...');
	phantom.injectJs(pluginName + '.js');
});



var onNewMessage = function(msg) {
	plugins.forEach(function(pluginHandler) {
		pluginHandler(msg);
	});
};



var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
// page.settings.resourceTimeout = 30000;
// page.settings.loadImages = false;
page.webSecurityEnabled = false;



phantom.injectJs('tasks.js');



phantom.injectJs('greetings.js');
console.log('loaded ' + greetings.length + ' greetings.');



phantom.injectJs('phrases.js');
console.log('loaded ' + phrases.length + ' phrases.');



var step = 'not-logged-in';

var currentChannel = config.channels[0];

var url = getUrl(config, currentChannel);




// load channels history
var channelMessages = {};
config.channels.forEach(function(channelName) {
	try {
		var messages = loadJSON(channelName + '.json');
		channelMessages[channelName] = messages;
		console.log('found ' + messages.length + ' messages for channel ' + channelName);
	} catch (ex) {
		console.log('found no prior messages for channel ' + channelName);
	}
});



var sleeps = {
	'not-logged-in':  2,
	'logging-in':    11,
	'logged-in':      5
};



var doStep = function() {
	var zzz = sleeps[step] || 5;
	var phrase;

	console.log('\nabout to do step ' + step + ' after ' + zzz + ' s...');

	window.setTimeout(
		function() {
			var res;
			if (step === 'not-logged-in') {
				res = login(page, config);
				console.log('logging in: ' + (res === 'failed' ? 'not required' : 'ok') );

				step = 'logging-in';

				if (res === 'failed') {
					setTimeout(doStep, 0);
				}
			}
			else if (step === 'logging-in') {
				updateChannel(page, channelMessages, currentChannel, onNewMessage);

				phrase = randomItemOfArray(greetings);
				console.log('sending message "' + phrase + '"...');
				res = sendMessage(page, phrase);

				step = 'logged-in';

				setTimeout(doStep, 0);
			}
			else if (step === 'logged-in') {
				updateChannel(page, channelMessages, currentChannel, onNewMessage);

				phrase = randomItemOfArray(phrases);
				console.log('sending message "' + phrase + '"...');
				res = sendMessage(page, phrase);

				/*window.setTimeout(
					function() {
						console.log('about to render');
						page.render('slackbot.png');
						console.log('exiting.');
						phantom.exit();
					},
					2 * 1000
				);*/

				/*window.setTimeout(
					function() {
						console.log('exiting.');
						phantom.exit();
					},
					2 * 1000
				);*/

				setTimeout(doStep, 5 * 1000);
			}
			else {
				console.log('unsupported step: "' + step + '"!');
				setTimeout(doStep, 0);
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
