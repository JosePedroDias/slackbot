'use strict';



var fs = require('fs');



// load configuration

var config = require('./config');



// some globals

var step = 'not-logged-in';
var currentChannel = config.startChannel;
var lastChannelTimestamps = {};
var plugins = [];
var api = {};
var sayQueues = {}; // indexed by channelName



// setup browser window

var page = require('webpage').create();
page.viewportSize = {width:800, height:600};
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
// page.settings.resourceTimeout = 30000;
// page.settings.loadImages = false;
page.webSecurityEnabled = false;



// load low-level bot functions

var t = require('./tasks');



// load channel times

try {
	lastChannelTimestamps = loadJSON('lastChannelTimestamps.json');
} catch (ex) {}



// setup plugins

config.plugins.forEach(function(pluginName) {
	console.log('Loading plugin ' + pluginName + '...');
	var pluginHandler = require('./plugin-' + pluginName);
	pluginHandler.name = pluginName;
	plugins.push(pluginHandler);
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


var inactiveSteps = 0;

var doStep = function() {
	var zzz = sleeps[step] || 5;
	var phrase;

	currentChannel = t.getChannelName(page) || currentChannel;

	if (step !== 'logged-in') {
		console.log(t.time() + ' will do step ' + step + ' in channel ' + currentChannel + ' after ' + zzz + ' s...');
	}

	window.setTimeout(
		function() {
			if (step === 'not-logged-in') {
				var res = t.login(page, config);
				console.log('logging in: ' + (res === 'failed' ? 'not required' : 'ok') );

				step = 'logging-in';

				if (res === 'failed') {
					setTimeout(doStep, 0);
				}
			}
			else if (step === 'logging-in') {
				step = 'logged-in';

				setTimeout(doStep, 0);
			}
			else if (step === 'logged-in') {
				if (inactiveSteps === 0) {
					t.clearUnread();
				}
				
				t.updateChannel(page, lastChannelTimestamps, currentChannel, onNewMessage);

				var says = sayQueues[currentChannel];
				if (says) {
					says = says.map(function(o) {
						return o.text;
					}).join('\n');
					t.sendMessage(page, says);
					delete sayQueues[currentChannel];
				}

				if (inactiveSteps > 3) {
					var sqs = Object.keys(sayQueues); // criteria 1 - messages to say somewhere else
					if (sqs.length > 0) {
						var destination = sqs.shift();
						inactiveSteps = 0;
						if (destination[0] === '@') {
							t.goToDirectMessage(page, destination);
						}
						else {
							t.goToChannel(page, destination);
						}
					}
					else {
						var ucs = t.checkUnreadChannels(page); // criteria 2 - messages to read on other channels
						if (ucs.length > 0) {
							inactiveSteps = 0;
							t.goToChannel(page, ucs.shift());
						}
						else {
							var dms = t.checkDirectMessages(page); // criteria 3 - direct messages to read
							if (dms.length > 0) {
								inactiveSteps = 0;
								t.goToDirectMessage(page, dms.shift());
							}
						}	
					}
				}

				++inactiveSteps;

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
	var ch = o.channel || currentChannel;

	if (!(ch in sayQueues)) {
		sayQueues[ch] = [o];
	}
	else {
		sayQueues[ch].push(o);
	}
	//t.sendMessage(page, o.text);
};
api.getCurrentChannel = function() {
	return currentChannel;
},
api.parseCommand = function(str, commandName, tokenizer) {
	if (str[0] !== '!') { return; }
	var l = commandName.length;
	if (str.substring(1, l+1) !== commandName) { return; }
	var rest = str.substring(l+1).trim();
	return (tokenizer ? rest.split(tokenizer) : rest);
};
api.takeScreenshot = function(screenshotName) {
	if (!screenshotName) {
		screenshotName = 'shot_' + currentChannel + '_' + t.now() + '.png';
	}
	page.render(screenshotName);
	return screenshotName;
};
api.saveHTML = function(htmlName) {
	if (!htmlName) {
		htmlName = 'html_' + currentChannel + '_' + t.now() + '.html';
	}
	var html = page.content;
	fs.write(htmlName, html, 'w');
	return htmlName;
};
api.now = t.now;
api.randomInt = t.randomInt;
api.randomItemOfArray = t.randomItemOfArray;



// effectively start the page here

page.open(t.getUrl(config, currentChannel), function(status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit(1);
	}
});



// setup plugin init and onTick timers

plugins.forEach(function(pluginHandler) {
	pluginHandler.init(api);
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
