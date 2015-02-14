'use strict';

var greetings = require('./plugin-smallTalk-greetings');
console.log('loaded ' + greetings.length + ' greetings.');

var phrases = require('./plugin-smallTalk-phrases');
console.log('loaded ' + phrases.length + ' phrases.');

var api;

module.exports = {
	init: function(api_) {
		api = api_;
	},
	onNewMessage: function(msg) {
		//console.log(this.name + ' got "' + msg.text + '" from ' + msg.from);
		this.lastMessageTime = api.now();
	},
	onTick: function() {
		var phrase, t = api.now();

		if (!this.startTime) {
			this.startTime       = t;
			this.lastMessageTime = t;

			// first run - say hi
			phrase = api.randomItemOfArray(greetings);
			console.log(this.name + ' greeting with "' + phrase + '"');
			api.say({ text: phrase });
			return;
		}

		if (this.keepQuiet) { return; }

		var silenceTimeS = (t - this.lastMessageTime) / 1000; // in seconds

		if (silenceTimeS > this.makeSmallTalkS) {
			// quiet for makeSmallTalkS seconds, filling with small talk...
			phrase = api.randomItemOfArray(phrases);
			console.log(this.name + ' making small talk with "' + phrase + '"');
			api.say({ text: phrase });
			this.lastMessageTime = t;
		}
		/*else {
			console.log(this.name + ' tick! No activity for ' + silenceTimeS);
		}*/
	},
	tickMs:         1000,
	help:           '\ngreets people when arriving.\ncan also make small talk when channel is quiet for `keepQuiet` seconds.',
	description:    'makes conversation',
	makeSmallTalkS: 60,
	keepQuiet:      true
};
