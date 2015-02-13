var fs = require('fs');



var loadJSON = function(fn) {
	return JSON.parse(fs.read(fn));
};



var saveJSON = function(fn, o) {
	fs.write(fn, JSON.stringify(o), 'w');
};



var now = function() {
	return new Date().valueOf();
};



var randomInt = function(n) {
	return ~~( Math.random() * n);
};


var randomItemOfArray = function(arr) {
	return arr[ randomInt(arr.length) ];
};



var getUrl = function(cfg, channelName) {
	return 'https://' + cfg.slackInstance + '.slack.com/messages/' + channelName + '/';
};



var login = function(page, cfg) {
	return page.evaluate(
		function(cfg) {
			if (!document.querySelector('#email')) { return 'failed'; }
			document.querySelector('#email'   ).value = cfg.email;
			document.querySelector('#password').value = cfg.password;
			document.querySelector('#signin_btn').click();
		},
		cfg
	);
};



var sendMessage = function(page, msg) {
	var res = page.evaluate(
		function(msg) {
			var inputEl = document.querySelector('#message-input');
			if (!inputEl) { return 'failed'; }
			inputEl.focus();
			inputEl.value = msg;
		},
		msg
	);

	page.sendEvent('keyup',   page.event.key.Enter, null, null, 0);
	page.sendEvent('keydown', page.event.key.Enter, null, null, 0);

	return res;
};



var getMessages = function(page, username, currentChannelLTS) {
	return page.evaluate(
		function(username, currentChannelLTS) {
			var arr = document.querySelectorAll('.message_content');
			var from, when, el, i, arr2 = [];

			for (i = arr.length - 1; i >= 0; --i) {
				el = arr[i];

				when = parseFloat( el.parentNode.getAttribute('data-ts') );
				if (when === currentChannelLTS) { break; }

				from = el.parentNode.querySelector('[target]').getAttribute('href').split('/').pop();
				if (from === username) { continue; }

				arr2.unshift({
					//id:   el.parentNode.getAttribute('id').substring(4), // removes msg_ prefix
					text: el.textContent.trim().replace(/\n?\t+.*/, ''), // removes autogenerated content?
					from: from,
					when: when
				});
			}
			return arr2;
		},
		username, currentChannelLTS
	);
};



var checkUnreadChannels = function(page) {
	return page.evaluate(
		function() {
			var arr = document.querySelector('#channel-list').querySelectorAll('.channel.unread');
			arr = Array.prototype.slice.call(arr);
			return arr.map(function(el) {
				return el.querySelector('.overflow-ellipsis').innerText.substring(2);
			});
		}
	);
};

var goToChannel = function(page, channelName) {
	var res = page.evaluate(
		function(channelName) {
			var output = '';
			try {
				var arr = document.querySelector('#channel-list').querySelectorAll('.channel');
				arr = Array.prototype.slice.call(arr);
				arr.forEach(function(el) {
					if (el.querySelector('.overflow-ellipsis').innerText.substring(2) === channelName) {
						output += ' found';

						el = el.querySelector('a');

						if (el) {
							el.click();
							output += ' clicked';
						}
						else {
							output += ' did not click';
						}
					}
				});
			} catch (ex) {
				output += ' failed';
			}
			return output;
		},
		channelName
	);

	console.log('res: ' + res);

	// setTimeout(function() { console.log('PAGE TITLE IS "' + page.title + '"'); }, 1000);

	currentChannel = channelName;
	console.log('went to ' + currentChannel);
};



var checkDirectMessages = function(page) {
	return page.evaluate(
		function() {
			var arr = document.querySelectorAll('.cursor_pointer.member.unread');
			arr = Array.prototype.slice.call(arr);
			return arr.map(function(el) {
				return el.querySelector('.overflow-ellipsis').innerText.trim();
			});
		}
	);
};

var goToDirectMessage = function(page, userName) {
	var res = page.evaluate(
		function(userName) {
			var output = '';
			try {
				var arr = document.querySelectorAll('.cursor_pointer.member');
				arr = Array.prototype.slice.call(arr);
				arr.forEach(function(el) {
					if (el.querySelector('.overflow-ellipsis').innerText.trim() === userName) {
						output += ' found';
						
						el = el.querySelector('a');
						
						if (el) {
							el.click();
							output += ' clicked';
						}
						else {
							output += ' did not click';
						}
					}
				});
			} catch(ex) {
				output += ' failed';
			}
			return output;
		},
		userName
	);

	console.log('res: ' + res);

	// setTimeout(function() { console.log('PAGE TITLE IS "' + page.title + '"'); }, 1000);

	currentChannel = '@' + userName;
	console.log('went to ' + currentChannel);
};



var updateChannel = function(page, lastChannelTimestamps, currentChannel, onNewMessage) {
	var currentChannelLTS = lastChannelTimestamps[currentChannel] || undefined;

	var messages = getMessages(page, config.username, currentChannelLTS);

	if (messages.length) {
		console.log('fetched new ' + messages.length + ' messages from channel ' + currentChannel + '.');

		messages.forEach(function(msg) { // enrich messages with channel field
			msg.channel = currentChannel;
		});

		messages.forEach(function(msg) { // notify consumers
			onNewMessage(msg);
		});

		// save last ts for channel
		currentChannelLTS = messages[messages.length - 1].when;
		lastChannelTimestamps[currentChannel] = currentChannelLTS;

		//console.log('saving ts ' + currentChannelLTS + ' for channel ' + currentChannel);
		saveJSON('lastChannelTimestamps.json', lastChannelTimestamps);
	}
};
