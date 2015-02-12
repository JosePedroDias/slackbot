(function() {

	'use strict';



	phantom.injectJs('plugin-smallTalk-greetings.js');
	console.log('loaded ' + plugin_smallTalk_greetings.length + ' greetings.');
	phantom.injectJs('plugin-smallTalk-phrases.js');
	console.log('loaded ' + plugin_smallTalk_phrases.length + ' phrases.');



	plugins.push({
		onNewMessage: function(msg) {
			console.log(this.name + ' got "' + msg.text + '" from ' + msg.from);
			this.lastMessageTime = api.now();
		},
		onTick: function() {
			var phrase, t = api.now();

			if (!this.startTime) {
				this.startTime       = t;
				this.lastMessageTime = t;

				phrase = api.randomItemOfArray(plugin_smallTalk_greetings);
				console.log(this.name + ' saying "' + phrase + '"');
				api.say({ text: phrase });
				return;
			}

			var silenceTime = (t - this.lastMessageTime) / 1000; // in seconds

			if (silenceTime > 30) {
				phrase = api.randomItemOfArray(plugin_smallTalk_phrases);
				console.log(this.name + ' saying "' + phrase + '"');
				api.say({ text: phrase });
				this.lastMessageTime = t;
			}
			else {
				console.log(this.name + ' tick! No activity for ' + silenceTime);
			}
		},
		tickMs: 1000
	});

})();
