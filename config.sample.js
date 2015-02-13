/*jshint laxcomma:true*/
var config = {
	slackInstance: 'SLACK_INSTANCE', // just the vhost, not the whole domain
	username:      'USERNAME', // without @
	email:         'EMAIL',
	password:      'PASSWORD',
	channels: [
		 'jenkins'
		,'codez'
		,'general'
		,'mtg'
		,'music'
		,'nsfw'
	],
	plugins: [
		 'echoNewMessages'
		,'mute'
		,'help'
		,'goto'
		,'gotounread'
		,'shot'
		,'dice'
		,'say'
		,'calc'
		,'smallTalk'
	]
};
