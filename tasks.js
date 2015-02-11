var fs = require('fs');



var loadJSON = function(fn) {
	return JSON.parse(fs.read(fn));
};



var saveJSON = function(fn, o) {
	fs.write(fn, JSON.stringify(o), 'w');
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



var getMessages = function(page) {
	return page.evaluate(
		function() {
			var arr = document.querySelectorAll('.message_content');
			arr = Array.prototype.slice.call(arr);
			return arr.map(function(el) {
				return {
					id:   el.parentNode.getAttribute('id'),
					text: el.textContent.trim().replace(/\n?\t+.*/, ''),
					from: el.parentNode.querySelector('[target]').getAttribute('href').split('/').pop(),
					when: parseFloat( el.parentNode.getAttribute('data-ts') )
				};
			});
		}
	);
};
