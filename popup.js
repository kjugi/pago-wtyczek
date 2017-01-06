/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

function getTwitchStreamStatus(streamOn, streamOff, errorCallback){
	//one streamer extension PAGO3
	//demo mode: on
	//https://api.twitch.tv/kraken/streams/40378922?client_id=dlw882cebptkltr33a4s0ejzongxfg

	/*xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    console.log(this.responseText);
	  }
	});*/

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
	    //error control - renderStatus("response: "+response);

	    if (!response) {
	      errorCallback('No response from TWITCH API!');
	      return;
	    }

	    if(response.stream != null){
		    var streamTitle = response.stream.channel.status;
		    var streamGame = response.stream.game;
		    var streamLiveViewers = response.stream.viewers;
		    var streamLiveDate = response.stream.created_at;

		    console.assert(
		        typeof response == 'object', 'Unexpected respose from the TWITCH API!');
		    streamOn(streamTitle, streamGame, streamLiveViewers, streamLiveDate);
		    chrome.browserAction.setIcon({path: "icon_1.png"});
		}
		else{
			var streamNull = "Brak streama";

			console.assert(
				typeof response == 'object', 'Unexpected response from the TWITCH API!');
			chrome.browserAction.setIcon({path: "icon_default.png"});
			streamOff(streamNull);
		}
	};
	xhr.onerror = function() {
	    errorCallback('Network error.');
	};
	xhr.send(data);
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {

	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate) {

	  renderStatus('Stream title:' + streamTitle);
	  var status = document.getElementById('status');

	  status.title = streamTitle;
	  status.game = streamGame;
	  status.liveViewers = streamLiveViewers;
	  status.uptime = streamLiveDate;
	},
	function(streamOff){
		renderStatus(streamOff);
	},
	function(errorMessage) {
	  renderStatus('Cannot display information. ' + errorMessage);
	});
});