/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

//variable to playing PAGO audio/showing nottications - łapki w góre
var oneMoreTimeHomie = true, audio, volumeLevelDecimal, showNotificationVal = null, videoId, videoTitle;

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

	    if(!response){
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
	xhr.onerror = function(){
		showInfo("error");
	    errorCallback('Network error.');
	};
	xhr.send(data);
}

//checking on welcome if stream is live function - START
function checkLiveStream(){
	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium){
		chrome.browserAction.setIcon({path: "icons/icon_1.png"});
		chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
 		chrome.browserAction.setBadgeText({text:"ON"});

 		//start audio play - only when stream start
 		playMusic(volumeLevelDecimal);
 		showNotification();
	},
	function(streamOff){
		chrome.browserAction.setIcon({path: "icons/icon_default.png"});
		chrome.browserAction.setBadgeText({text: ''});

		//to play again when stream went on
		oneMoreTimeHomie = true;
	},
	function(errorMessage){
		showInfo("error");
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
		if(typeof items.options == "undefined"){
			setDefaultFirstOptions();
		}
		else{
			var itemsArray = JSON.parse(items.options);
			var miliseconds, interval, volumeLevelPercent;

			if(itemsArray.length == 2){
				if(itemsArray[0] != false && itemsArray[1] != false){
					clearInterval(interval);
					//3 minutes
					miliseconds = 180000;
					interval = setInterval(checkLiveStream,miliseconds);

					volumeLevelPercent = itemsArray[1];
					volumeLevelDecimal = itemsArray[1] * 0.01;
				}
			}
			else{
				clearInterval(interval);
				//3 minutes
				miliseconds = 180000;
				interval = setInterval(checkLiveStream,miliseconds);

				volumeLevelDecimal = 0.5;
			}
		}
	});
}
getOptions();
//getting localStorage - END

//checking localStorage on change [new click on save button in options]
chrome.storage.onChanged.addListener(function(){
	getOptions();
});

//setting first default options - ONLY ON FIRST RUN
function setDefaultFirstOptions(){
	var arrayValues = [true,'50'];
	var jsonArray = JSON.stringify(arrayValues);

	chrome.storage.sync.set({
		"options":jsonArray
	});

	getOptions();
}

//start audio play - only when stream starts
function playMusic(volumeLevel){
	if(typeof volumeLevel != "undefined"){
		if(oneMoreTimeHomie == true){
			audio = new Audio('audio/pago_lapki_w_gore.mp3');
			audio.volume = volumeLevel;
			audio.play();
		}
	}
}

//functions to notifications when stream is LIVE
//basic showingNotification
function showNotification() {
	if(oneMoreTimeHomie == true){
	 	chrome.notifications.create('twitch', {
	        type: 'basic',
	        iconUrl: 'icons/icon_1.png',
	        title: 'Pago właśnie nadaje live',
			buttons: [{title:'Ogladaj'},{title:"Zamknij"}],
	        message: 'Pago włączył właśnie live stream\'a'
	    }, function(id) {
	    	showNotificationVal = id;
	    });
   	}

   	//to stop playing/showing nottications till the stream will ends
	oneMoreTimeHomie = false;
}

//what happened when user click on button - OPEN LINK WITH STREAM / CLOSE NOTIFICATION
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonId){
    if (notificationId === showNotificationVal){
        if(buttonId === 0 && notificationId == "twitch"){
            window.open("http://twitch.tv/pago3");
        }
        else if(buttonId === 0 && notificationId == "youtube"){
        	window.open("https://www.youtube.com/watch?v="+videoId);
        }
        else if(buttonId === 1){
            chrome.notifications.clear(notificationId,function(){ //..
            });
        }
    }
});

//what happened when user click on nottification - OPEN LINK WITH STREAM
chrome.notifications.onClicked.addListener(function(notificationId){
	if (notificationId === showNotificationVal){
        if(notificationId == "twitch"){
			window.open("http://twitch.tv/pago3");
		}
		else if(notificationId == "youtube"){
        	window.open("https://www.youtube.com/watch?v="+videoId);
        }
	}
});

//getting last uploaded video on youtube - START

function getYoutubeStorage(){
	chrome.storage.sync.get([
		"youtube"
	],function(items){
		if(typeof items.youtube == "undefined"){
			setYoutubeOptions();
		}
		else{
			var itemsArray = JSON.parse(items.youtube);
			var interval2;

			if(itemsArray[0] != videoId){
				setYoutubeOptions();
				clearInterval(interval2);
				showYoutubeNotification();
				interval2 = setInterval(getLastYoutubeVideo,600000);
			}
		}
	});
}

function setYoutubeOptions(){
	var videoIdArray = [videoId];
	var jsonArray = JSON.stringify(videoIdArray);

	chrome.storage.sync.set({
		"youtube":jsonArray
	});

	getYoutubeStorage();
}

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
		if(this.readyState === 4){
			var jsonResponse1 = JSON.parse(this.responseText);
			videoId = jsonResponse1.items[0].id.videoId;
			videoTitle = jsonResponse1.items[0].snippet.title;

			getYoutubeStorage();
		}
	});
}

function showYoutubeNotification() {
 	chrome.notifications.create('youtube', {
        type: 'basic',
        iconUrl: 'icons/icon_1.png',
        title: 'Widziałeś nowy film PAGO3?',
		buttons: [{title:'Ogladaj'},{title:"Zamknij"}],
        message: videoTitle
    },function(id){
    	showNotificationVal = id;
    });
}

getLastYoutubeVideo();
//getting last uploaded video on youtube - END