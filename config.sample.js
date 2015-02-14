/*jshint laxcomma:true*/
module.exports =  {
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
		//,'mute'
		,'help'
		//,'shot'
		,'dice'
		,'say'
		,'calc'
		,'smallTalk'
	]
};
