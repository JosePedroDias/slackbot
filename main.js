// load configuration

var haveConfig = phantom.injectJs('config.js');
if (!haveConfig) {
	console.log('create a file named config.js, setting the config object');
	phantom.exit(1);
}



// some globals

var step = 'not-logged-in';
var api = {};
var lastChannelTimestamps = {};
var url, currentChannel;



// setup plugins

var plugins = [];
config.plugins.forEach(function(pluginName) {
	console.log('Loading plugin ' + pluginName + '...');
	phantom.injectJs('plugin-' + pluginName + '.js');
	plugins[ plugins.length - 1 ].name = pluginName;
});



var onNewMessage = function(msg) {
	plugins.forEach(function(pluginHandler) {
		if ('onNewMessage' in pluginHandler) {
			pluginHandler.onNewMessage(msg);
		}
	});
};



var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
// page.settings.resourceTimeout = 30000;
// page.settings.loadImages = false;
page.webSecurityEnabled = false;



phantom.injectJs('tasks.js');



currentChannel = config.channels[0];
url = getUrl(config, currentChannel);




// load channels history

try {
	lastChannelTimestamps = loadJSON('lastChannelTimestamps.json');
} catch (ex) {}



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
			if (step === 'not-logged-in') {
				var res = login(page, config);
				console.log('logging in: ' + (res === 'failed' ? 'not required' : 'ok') );

				step = 'logging-in';

				if (res === 'failed') {
					setTimeout(doStep, 0);
				}
			}
			else if (step === 'logging-in') {
				updateChannel(page, lastChannelTimestamps, currentChannel, onNewMessage);

				step = 'logged-in';

				setTimeout(doStep, 0);
			}
			else if (step === 'logged-in') {
				updateChannel(page, lastChannelTimestamps, currentChannel, onNewMessage);

				setTimeout(doStep, 0);
			}
			else {
				console.log('unsupported step: "' + step + '"!');

				setTimeout(doStep, 0);
			}
		},
		zzz * 1000
	);
};



page.onLoadFinished = function(status) {
    console.log("\npage loaded: ", status, page.url);
    doStep();
};



// add stuff to public API

api.say = function(o) {
	sendMessage(page, o.text);
};
api.now = now;
api.randomInt = randomInt;
api.randomItemOfArray = randomItemOfArray;



// effectively start the page here

page.open(url, function(status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit(1);
	}
});




// setup plugin ticks

plugins.forEach(function(pluginHandler) {
	if ('tickMs' in pluginHandler && 'onTick' in pluginHandler) {
		var cb = function() {
			if (step === 'logged-in') {
				this.onTick();
			}
		}.bind(pluginHandler);
		console.log('setting up onTick for plugin ' + pluginHandler.name);
		setInterval(cb, pluginHandler.tickMs);
	}
});
