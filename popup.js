
function setIconToEmoji(emoji) {
	var index = emoji.codePointAt(0).toString(16);
	var newIconPath = 'images/emoji/' + index + '.png';
	chrome.browserAction.setIcon({
		path: newIconPath
	});
}

function syncRecents(token) {
	$.get( 'https://api.justyo.co/status/me/history/?distinct=1&access_token=' + token, function( data ) {
		console.log(data);
		var results = data.results;
		var hexArray = [];
		for (var i = 0; i < results.length ; i++) {
			emoji = results[i];
			var index = emoji.codePointAt(0).toString(16);
			hexArray.push(index);
		}

	    chrome.storage.sync.get("recent_emojis", function(n) {
	        chrome.storage.sync.set({
	            recent_emojis: hexArray
	        })
	    });
	});
}

function loadCurrentUser(token) {

	$.get( 'https://api.justyo.co/me/?access_token=' + token, function( data ) {

		setIconToEmoji(data.status);
		
		var socket = new ReconnectingWebSocket("wss://websockets.justyo.co/socket?access_token=" + token);
        socket.onopen = function(message) {
            console.log('socket opened');
            socket.send('/subscribe status.update ' + data.username);
        };
        socket.onclose = function(message) {
            console.log('socket closed');
        };
        socket.onmessage = function(message) {
          var data = JSON.parse(message.data);
          var username = data.user.username;
          setIconToEmoji(data.user.status);
        };
	});

	$.get( 'https://api.justyo.co/status/me/contacts/?access_token=' + token, function( data ) {
		var results = data.results;
		var table = $("#list");
		$.each(results, function() {
		    table.append("<tr class='friend-row'>" +
		    				"<td style='width: 80%;'>" + this.display_name + "</td>" +
		    				"<td style='font-family: serif; font-size: 2em; width: 20%;'>" + this.status + "</td>" +
		    			"</tr>");
		});
	});

}


$( document ).ready(function() {

	$('.friends-list').click( function() {
		$('#emojipicker').hide();
		$('#friends-list').show();
	});

	$('.set-status').click( function() {
		$('#emojipicker').show();
		$('#friends-list').hide();
	});

	$('.js-logout').click( function() {
		chrome.storage.local.remove('token');

		$('.login').show();
        $('#logged-in').hide();

	    chrome.browserAction.setIcon({
			path: '/images/icon-128.png'
		});
	});

	$('.login-btn').click( function() {
		var params = {
			'redirect_uri': chrome.identity.getRedirectURL('/authorized/'),
			'response_type': 'token',
			'scope': 'basic',
			'client_id': 'WR5AMcmQsIeSlrExzPRNGvWu4wGY1Jxp8PH4Ex1S'
		}
		var encodedParams = $.param(params);
		chrome.identity.launchWebAuthFlow({
			'url': 'https://dashboard.justyo.co/authorize/?' + encodedParams, 
			'interactive': true
		},
	  	function(redirect_url) { 
	  		var token = new URL(redirect_url).hash.split('&').filter(function(el) { if(el.match('access_token') !== null) return true; })[0].split('=')[1];
	  		chrome.storage.local.set({'token': token});
			chrome.runtime.reload();
	  		loadCurrentUser(token);
	  		syncRecents(token);
	  	});
	 });

	chrome.storage.local.get('token', function(result) {
		token = result['token'];
		loadCurrentUser(token);
		syncRecents(token);
        if (token) {

        	$('#emojipicker').show();
			$('#friends-list').hide();

    		$('.login').hide();
    		$('#logged-in').show();

        }
        else {
        	$('.login').show();
        	$('#logged-in').hide();
        }
    });

});

