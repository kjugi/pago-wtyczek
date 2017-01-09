/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

function getTwitchStreamStatus(streamOn, streamOff, errorCallback){
	//one streamer extension PAGO3
	//demo mode: on
	//https://api.twitch.tv/kraken/streams/40378922?client_id=dlw882cebptkltr33a4s0ejzongxfg
	var streamerID = "40378922";
	var client_id = "dlw882cebptkltr33a4s0ejzongxfg";
	var url = "https://api.twitch.tv/kraken/streams/";
  	var data = null;

	var xhr = new XMLHttpRequest();

	xhr.open("GET", url+streamerID);
	xhr.setRequestHeader("accept", "application/vnd.twitchtv.v5+json");
	xhr.setRequestHeader("client-id", client_id);
	xhr.setRequestHeader("cache-control", "no-cache");
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

  	xhr.onload = function() {
	    var response = JSON.parse(xhr.responseText);

	    if (!response) {
	      errorCallback('No response from TWITCH API!');
	      return;
	    }

	    if(response.stream != null){
		    var streamTitle = response.stream.channel.status;
		    var streamGame = response.stream.game;
		    var streamLiveViewers = response.stream.viewers;
		    var streamLiveDate = response.stream.created_at;
		    var streamPreviewMedium = response.stream.preview.medium;

		    console.assert(
		        typeof response == 'object', 'Unexpected response from the TWITCH API!');
		    chrome.browserAction.setIcon({path: "icons/icon_1.png"});
		    chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
 			chrome.browserAction.setBadgeText({text:"ON"});

		    streamOn(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium);
		}
		else{
			var streamNull = "Brak streama!";

			console.assert(
				typeof response == 'object', 'Unexpected response from the TWITCH API!');

			chrome.browserAction.setIcon({path: "icons/icon_default.png"});
			chrome.browserAction.setBadgeText({text: ''});

			streamOff(streamNull);
		}
	};
	xhr.onerror = function() {
	    errorCallback('Network error.');
	};
	xhr.send(data);
}

//checking on welcome if stream is live function - START
function checkLiveStream(){
	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium) {
		chrome.browserAction.setIcon({path: "icons/icon_1.png"});
		chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
 		chrome.browserAction.setBadgeText({text:"ON"});
	},
	function(streamOff){
		chrome.browserAction.setIcon({path: "icons/icon_default.png"});
		chrome.browserAction.setBadgeText({text: ''});
	},
	function(errorMessage) {
	  	console.log('Cannot display information. ' + errorMessage);
	});
}
checkLiveStream();
//checking on welcome if stream is live function - END

//getting localStorage - START
function getOptions(){
	chrome.storage.sync.get([
		"options"
	],function(items){
		var itemsArray = JSON.parse(items.options);
		var miliseconds, interval;

		if(itemsArray.length == 1){
			miliseconds = 0;
			clearInterval(interval);
		}
		else if(itemsArray.length > 1){
			miliseconds = itemsArray[1] * 60000;
			interval = setInterval(checkLiveStream,miliseconds);
		}
		else{
			miliseconds = 3600000;
			interval = setInterval(checkLiveStream,miliseconds);
		}
	});
}
getOptions();
//getting localStorage - END

chrome.storage.onChanged.addListener(function(){
	getOptions();
});