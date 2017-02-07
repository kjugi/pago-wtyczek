/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

// function which getting information from TWTICH API
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
	    //error control - renderStatus("response: "+response);

	    if (!response) {
	      showInfo("error");
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
		    streamOn(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium);
		}
		else{
			var streamNull = "Brak streama!";

			console.assert(
				typeof response == 'object', 'Unexpected response from the TWITCH API!');
			streamOff(streamNull);
		}
	};
	xhr.onerror = function() {
		showInfo("error");
	    errorCallback('Network error.');
	};
	xhr.send(data);
}

document.addEventListener('DOMContentLoaded', function() {

	//checking stream status in twitch API - big function - START
	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium) {

	  var status = document.getElementById('status');
	  var dateNowTimestamp = new Date();
	  var streamStartDateTimestamp = new Date(streamLiveDate);

	  var streamDuring = dateNowTimestamp - streamStartDateTimestamp;

	  //TO DO: function do this - form multiple uses
	  if(streamDuring > 0){
	  	var seconds = (streamDuring/1000)%60;
	  	var minutes = ((streamDuring-seconds)/1000)/60;

	  	var outputTime = "";

	  	var intMinutes = parseInt(minutes);
	  	var intSeconds = parseInt(seconds);

	  	if(minutes == 1){
	  		outputTime = intMinutes+"minuty ";
	  		if(seconds > 1){
	  			outputTime += intSeconds+"sekund";
	  		}
	  		else if(seconds == 1){
	  			outputTime += intSeconds+"sekundy";
	  		}
	  	}
	  	else if(minutes == 0){
	  		outputTime = intSeconds+"sekund";
	  	}
	  	else{
	  		outputTime = intMinutes+"minut ";
	  		if(seconds > 1){
	  			outputTime += intSeconds+"sekund";
	  		}
	  		else if(seconds == 1){
	  			outputTime += intSeconds+"sekundy";
	  		}
	  	}
	  }
	  else{
	  	showInfo("error");
	  	errorCallback('Time error 1');
	  }

	  	chrome.browserAction.setIcon({path: "icons/icon_1.png"});
	  	chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
 		chrome.browserAction.setBadgeText({text:"ON"});

		status.innerHTML = "<p class='handler__text'>Tytuł streama: "+streamTitle+"</p><p class='handler__text'>Gra: "+streamGame+"</p><p class='handler__text'> Bynie online: <span class='handler__text-live'>"+streamLiveViewers+"</span></p><p class='handler__text'>Live trwa od: "+outputTime+"</p><p class='handler__text'><iframe src='http://player.twitch.tv/?channel=PAGO3' height='220' width='390' frameborder='0' scrolling='yes' allowfullscreen='false'></iframe></p><a href='https://twitch.tv/pago3' target='_blank' class='handler__text-button-watch'>Oglądaj bynia!</a>";

		getLastYoutubeVideo();
	},
	function(streamOff){
		var status = document.getElementById('status');

		chrome.browserAction.setIcon({path: "icons/icon_default.png"});
		chrome.browserAction.setBadgeText({text: ''});

		status.innerHTML = "<p class='handler__text text-xs-center'>"+streamOff+"</p><img src='icons/dead_glitch.png' class='image-center'/>";

		getLastYoutubeVideo();
	},
	function(errorMessage) {
		showInfo("error");
		renderStatus('Cannot display information. ' + errorMessage);
	});
	//checking stream status in twitch API - big function - END

	//showing/hiding options
	document.getElementById("gear").addEventListener("click", function(){
		var divOptions = document.getElementById("options");
		var classList = divOptions.className.split(/\s+/);

		if(classList[1] == "none"){
			divOptions.className = divOptions.className.replace(/\bnone\b/,'');
		}
		else{
			divOptions.className += "none";
		}
	});

	//range - options
	document.getElementById("volume").addEventListener("mousemove", function(){
		rangeOptions("volume","volumeValue","%");
	});

	//setting volume height of audio alert - options
	document.getElementById("voiceAlert").addEventListener("click",function(){
		var voiceAlert = document.getElementById("voiceAlert");
		var volume = document.getElementById("volume");
		var volumeValue = document.getElementById("volumeValue");

		var valueCheckbox = voiceAlert.checked;

		if(valueCheckbox == true){
			voiceAlert.checked = true;
			volume.disabled = false;
			volume.value = 50;
			volumeValue.innerHTML = "50%";
		}
		else{
			volume.disabled = true;
			volumeValue.innerHTML = "Opcja wyłaczona";
		}
	});

	//saving options into localStorage - START
	var arrayValues = new Array();
	document.getElementById("saveFunctions").addEventListener("click", function(){
		arrayValues = [];
		var voiceAlertCheckboxValue = document.getElementById("voiceAlert").checked;

			arrayValues.push(voiceAlertCheckboxValue);
		pushToLocalStorage(voiceAlertCheckboxValue,"volume");

		var jsonArray = JSON.stringify(arrayValues);

		chrome.storage.sync.set({
			"options":jsonArray
		},function(){
			showInfo("success");
		});
	});

	//getting options from localStorage - START
	function getOptions(){
		chrome.storage.sync.get([
			"options"
		],function(items){
			var itemsArray = JSON.parse(items.options);

			//DOM elements - START
			var voiceAlert = document.getElementById("voiceAlert");
			var volume = document.getElementById("volume");
			var volumeValue = document.getElementById("volumeValue");
			//DOM elements - END

			if(itemsArray.length == 2){
				if(itemsArray[0] === false && itemsArray[1] === false){
					voiceAlert.checked = itemsArray[0];
					volume.disabled = true;
					volumeValue.innerHTML = "Opcja wyłaczona";
				}
				else{
					voiceAlert.checked = itemsArray[0];
					volume.disabled = false;
					volume.value = itemsArray[1];
					volumeValue.innerHTML = itemsArray[1]+"%";
				}
			}
			else{
				voiceAlert.checked = true;
				volume.disabled = false;
				volume.value = 50;
				volumeValue.innerHTML = "50%";
			}
		});
	}
	getOptions();
	//end getting options from localStorage - END
	//end saving options into localStorage - END

	//range - options - function - START
	function rangeOptions(idRange, idReturnedValue, unit){
		var value = document.getElementById(idRange).value;
		document.getElementById(idReturnedValue).innerHTML = value+unit;
	}
	//range - options - function - END

	//values - push to array - function - START
	function pushToLocalStorage(booleanVar, idRange){
		if(booleanVar === true){
			var rangeValue = document.getElementById(idRange).value;

			arrayValues.push(rangeValue);
		}
		else{
			arrayValues.push(false);
		}
	}
	//values - push to array - function - END

	//showing success/error popup - START
	function showInfo(whichInfo){
		if(whichInfo == "success"){
			var popup = document.getElementById("success");
		}
		else if(whichInfo == "error"){
			var popup = document.getElementById("error");
		}

		var classList = popup.className.split(/\s+/);

		if(classList[1] == "hidden-popup"){
			popup.className = popup.className.replace(/\bhidden-popup\b/,'');
		}

		setTimeout(function(){
			hideInfo(whichInfo);
		},2000);
	}

	function hideInfo(whichInfoToHide) {
		if(whichInfoToHide == "success"){
			var popup = document.getElementById("success");
		}
		else if(whichInfoToHide == "error"){
			var popup = document.getElementById("error");
		}

		var classList = popup.className.split(/\s+/);

		if(classList[1] != "hidden-popup"){
			popup.className += "hidden-popup";
		}
	}
	//showing success/error popup - END

	//hiding success/error popup onClick event - START
	document.getElementById('success').addEventListener('click',function(){
		hideInfo('success');
	});

	document.getElementById('error').addEventListener('click',function(){
		hideInfo('error');
	});
	//hiding success/error popup onClick event - END

	//pause audio play when user clicked on icon - by getting values from background.js
	var backgroundPage = chrome.extension.getBackgroundPage();
	if(typeof backgroundPage.audio != "undefined"){
 		backgroundPage.audio.pause();
 	}

	//getting last uploaded video on youtube - START
 	function getLastYoutubeVideo(){
 		//step 1 of 3 - getting channel id
 		// have this by api call one time - id doesn't change
 		var channelId = "UCGoROGG58vNiS0SnV7VBz1Q";

 		//step 2 of 3 - getting video from channel
 		var data = null;

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.open("GET", "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId="+channelId+"&key=AIzaSyA15VDfUfP5n9kflo544YvPRmt4ljsC-IY&maxResults=1&type=video");
		xhr.send(data);

		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
		    var jsonResponse1 = JSON.parse(this.responseText);
		    var videoId = jsonResponse1.items[0].id.videoId;
		    var title = jsonResponse1.items[0].snippet.title;

		    //step 3 of 3 - returning information to popup
		    var status = document.getElementById('status');

		    var statusValue = status.innerHTML;
		    var additionalValue = "<p class='handler__text'>Zobacz ostatni film na YT: <a href='https://www.youtube.com/watch?v="+videoId+"' target='_blank'>"+title+"</a></p>";

		    var newValue = statusValue+additionalValue;

		    status.innerHTML = newValue;
		  }
		});
 	}
 	//getting last uploaded video on youtube - END
});

/****

TO DO:
1) review all errors - HALF PUBLIC TESTS
2) ADD - hide or encrypt api codes from twitch and youtube (or load from other file)

****/