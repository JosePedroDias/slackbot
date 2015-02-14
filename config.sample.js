/*jshint laxcomma:true*/
module.exports =  {
	slackInstance: 'SLACK_INSTANCE', // just the vhost, not the whole domain
	username:      'USERNAME', // without @
	email:         'EMAIL',
	password:      'PASSWORD',
	startChannel:  'general', // can be a user too
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
