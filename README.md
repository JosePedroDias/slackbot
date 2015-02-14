	     _            _    _           _
	 ___| | __ _  ___| | _| |__   ___ | |_
	/ __| |/ _` |/ __| |/ / '_ \ / _ \| __|
	\__ \ | (_| | (__|   <| |_) | (_) | |_
	|___/_|\__,_|\___|_|\_\_.__/ \___/ \__|



**DISCLAIMER**  
THIS IS AN EXPERIMENT.  
USE IF FOR GOOD AND AT YOUR OWN RESPONSABILITY.



## Setup

Install phantomjs as stated on the site
[download](http://phantomjs.org/download.html)
[build](http://phantomjs.org/build.html)

Edit `run.sh` to point to your phantomjs binary



## Config

Create a `config.js` file like this one (or you can rename `config.sample.js` and replace the fields):

```javascript
module.exports = {
	slackInstance:  'YOUR_TEAMS_SLACK_INSTANCE_HERE', // just the vhost, not the whole domain
	username:       'YOUR_USERNAME', // without @
	email:          'YOUR_EMAIL_HERE',
	password:       'YOUR_PASSWORD_HERE',
	startChannel:   'general',  // can be a user too
	plugins:        ['echoNewMessages', 'calc'] // plugins to load. order is relevant
};
```



## Plugin development

Check the sample plugins such as `plugin-smallTalk.js`.

A plugin is a an object with these optional attributes:



### onNewMessage

	onNewMessage({Object} msg) - function which gets called each time a new message arrives.

**NOTE**:  
If this function returns true, the following plugins in the `plugins` config array won't be notified.

a message has:

	{String} text    - message content
	{Number} when    - timestamp
	{String} from    - username of the sender
	{String} channel - channel where message occurred


### onTick

	onTick() - function which gets call every tickMs


### tickMs

	{Number} tickMs - on tick periodicity in millis. optional


### name

	{String} name - automatically filled by slackbot with the plugin name



## public API

Plugins can make use of the exposed public API via the `api` object.  
Exposed functions are:


### say

	say({text}) - says text on current channel


### now

	{Number} now() - returns current timestamp in millis


### parseCommand

	{String|String[]} parseCommand(messageText, commandName, [tokenizer]) - returns command parameters if message starts with !commandName. undefined if not the command. if tokenizer is passed, returns an array.


### randomInt

	{Number} randomInt({Number} n) - returns integer between 0 and n-1 


### randomItemOfArray

	{Any} randomItemOfArray({Array} arr) - returns random item from the given array


### getCurrentChannel

	{String} getCurrentChannel - returns channel the bot is on. DMs are prefixed with @


### takeScreenshot

	{String} takeScreenShot([{String} filename]) - saves browser image (useful for debugging). If filename is ommitted, it is automatically generated. returns filename.


## Reference

* http://phantomjs.org/api/webpage/
* http://phantomjs.org/api/phantom/



## TODO

* check [here](TODO.md)
