// load configuration

var haveConfig = phantom.injectJs('config.js');
if (!haveConfig) {
	console.log('create a file named config.js, setting the config object');
	phantom.exit(1);
}



// some globals

var step = 'not-logged-in';
var currentChannel = config.channels[0];
var lastChannelTimestamps = {};
var plugins = [];
var api = {};



// setup browser window

var page = require('webpage').create();
page.viewportSize = {width:800, height:600};
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
// page.settings.resourceTimeout = 30000;
// page.settings.loadImages = false;
page.webSecurityEnabled = false;



// load low-level bot functions

phantom.injectJs('tasks.js');



// load channel times

try {
	lastChannelTimestamps = loadJSON('lastChannelTimestamps.json');
} catch (ex) {}

if (false) { // resets history
	console.log('resetting channel visit times...');
	var n = parseFloat( (new Date().valueOf() / 1000).toFixed(6) );
	config.channels.forEach(function(channelName) {
		lastChannelTimestamps[channelName] = n;
	});
	saveJSON('lastChannelTimestamps.json', lastChannelTimestamps, true);
}



// setup plugins

config.plugins.forEach(function(pluginName) {
	console.log('Loading plugin ' + pluginName + '...');
	phantom.injectJs('plugin-' + pluginName + '.js');
	plugins[ plugins.length - 1 ].name = pluginName;
});



// onNewMessage generic callback

var onNewMessage = function(msg) {
	plugins.some(function(pluginHandler) {
		if ('onNewMessage' in pluginHandler) {
			try {
				var val = pluginHandler.onNewMessage(msg);
				//console.log('plugin ' + pluginHandler.name + ' ' + (val === true ? 'EXHAUSTED' : 'LET IT PASS'));
				return val;
			} catch(ex) {
				console.log(pluginHandler.name + ' onNewMessage() ERROR:\n' + ex);
			}
		}
	});
};



var sleeps = {
	'not-logged-in':  2,
	'logging-in':    11,
	'logged-in':      2
};



var doStep = function() {
	var zzz = sleeps[step] || 5;
	var phrase;

	currentChannel = getChannelName(page) || currentChannel;

	console.log(time() + ' will do step ' + step + ' in channel ' + currentChannel + ' after ' + zzz + ' s...');

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

				/*var dms = checkDirectMessages(page);
				if (dms.length) {
					console.log('dms: ' + dms.join(','));
				}

				var ucs = checkUnreadChannels(page);
				if (ucs.length) {
					console.log('ucs: ' + ucs.join(','));
				}*/

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



// fired when a page loads (should happen only once for now...)

page.onLoadFinished = function(status) {
    console.log('page loaded: ', status, page.url);
    doStep();
};



// add stuff to public API

api.say = function(o) {
	sendMessage(page, o.text);
};
api.parseCommand = function(str, commandName, tokenizer) {
	if (str[0] !== '!') { return; }
	var l = commandName.length;
	if (str.substring(1, l+1) !== commandName) { return; }
	var rest = str.substring(l+1).trim();
	return (tokenizer ? rest.split(tokenizer) : rest);
};
api.takeScreenshot = function(screenshotName) {
	if (!screenshotName) {
		screenshotName = 'shot_' + currentChannel + '_' + now() + '.png';
	}
	page.render(screenshotName);
	return screenshotName;
};
api.goToChannel = function(channelName) {
	goToChannel(page, channelName);
};
api.goToDirectMessage = function(userName) {
	goToDirectMessage(page, userName);
};
api.goToUnread = function() {
	goToUnread();
};
api.now = now;
api.randomInt = randomInt;
api.randomItemOfArray = randomItemOfArray;



// effectively start the page here

page.open(getUrl(config, currentChannel), function(status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit(1);
	}
});



// setup plugin onTick timers

plugins.forEach(function(pluginHandler) {
	if ('tickMs' in pluginHandler && 'onTick' in pluginHandler) {
		var cb = function() {
			if (step === 'logged-in') {
				try {
					this.onTick();
				} catch(ex) {
					console.log(this.name + ' onTick() ERROR:\n' + ex);
				}
			}
		}.bind(pluginHandler);
		console.log('setting up onTick() for plugin ' + pluginHandler.name);
		setInterval(cb, pluginHandler.tickMs);
	}
});
