	     _            _    _           _
	 ___| | __ _  ___| | _| |__   ___ | |_
	/ __| |/ _` |/ __| |/ / '_ \ / _ \| __|
	\__ \ | (_| | (__|   <| |_) | (_) | |_
	|___/_|\__,_|\___|_|\_\_.__/ \___/ \__|



**DISCLAIMER**  
THIS IS AN EXPERIMENT.  
USE IF FOR GOOD AND AT YOUR OWN RESPONSABILITY.



## Setup

Install phantomjs as stated on the site [download](http://phantomjs.org/download.html) [build](http://phantomjs.org/build.html)

Edit `run.sh` to point to your phantomjs binary



## Config

Create a `config.js` file like this one:

```javascript
var config = {
	slackInstance:  'YOUR_TEAMS_SLACK_INSTANCE_HERE',
	email:          'YOUR_EMAIL_HERE',
	password:       'YOUR_PASSWORD_HERE',
	channels:       ['general', 'codez'], // array of channels to visit periodically
	plugins:        ['echoNewMessages', 'calc'] // plugins to load
};
```



## Plugin development

A plugin is a function which gets called each time a new message arrives.


The received arguments are:

	{Object} msg
	{Object} api


For now a message has:

	{String} id   - message id
	{String} text - message content
	{String} from - username of the sender
	{Number} when - timestamp


The public API exposed to plugins so far has:

	say({text})

	{Number} randomInt({Number} n)

	{Any} randomItemOfArray({Array}arr)


Check the sample plugins.

Keep in mind you can surround the plugins.push() call in an IIFE so you can store state between calls.



## Reference

* http://phantomjs.org/api/webpage/
* http://phantomjs.org/api/phantom/



## TODO

* check [here](TODO.md)
