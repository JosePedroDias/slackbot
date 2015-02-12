(function() {

	'use strict';



	phantom.injectJs('plugin-smallTalk-greetings.js');
	console.log('loaded ' + plugin_smallTalk_greetings.length + ' greetings.');
	phantom.injectJs('plugin-smallTalk-phrases.js');
	console.log('loaded ' + plugin_smallTalk_phrases.length + ' phrases.');



	plugins.push({
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
				phrase = api.randomItemOfArray(plugin_smallTalk_greetings);
				console.log(this.name + ' greeting with "' + phrase + '"');
				api.say({ text: phrase });
				return;
			}

			if (this.keepQuiet) { return; }

			var silenceTimeS = (t - this.lastMessageTime) / 1000; // in seconds

			if (silenceTimeS > this.makeSmallTalkS) {
				// quiet for makeSmallTalkS seconds, filling with small talk...
				phrase = api.randomItemOfArray(plugin_smallTalk_phrases);
				console.log(this.name + ' making small talk with "' + phrase + '"');
				api.say({ text: phrase });
				this.lastMessageTime = t;
			}
			else {
				// console.log(this.name + ' tick! No activity for ' + silenceTimeS);
			}
		},
		tickMs:         1000,
		help:           'greets people when arriving. can also make small talk when channel is quiet for `keepQuiet` seconds',
		description:    'makes conversation',
		makeSmallTalkS: 30,
		keepQuiet:      true
	});

})();
