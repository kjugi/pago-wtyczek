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

		status.innerHTML = "<p class='handler__text'>Tytuł streama: "+streamTitle+"</p><p class='handler__text'>Gra: "+streamGame+"</p><p class='handler__text'><figure id='live'><svg class='svg-live' height='30px' version='1.1' viewBox='0 0 16 16' width='16px' x='0px' y='0px'><path clip-rule='evenodd' d='M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z' fill-rule='evenodd'></path></svg></figure> Bynie online: <span class='handler__text-live'>"+streamLiveViewers+"</span></p><p class='handler__text'>Live trwa od: "+outputTime+"</p><a href='https://twitch.tv/pago3/' target='_blank' class='handler__text__stream text-xs-center'><img src='"+streamPreviewMedium+"'/></a><a href='https://twitch.tv/pago3' target='_blank' class='handler__text-button-watch'>Oglądaj bynia!</a>";
	},
	function(streamOff){
		var status = document.getElementById('status');

		chrome.browserAction.setIcon({path: "icons/icon_default.png"});
		chrome.browserAction.setBadgeText({text: ''});

		status.innerHTML = "<p class='handler__text text-xs-center'>"+streamOff+"</p><img src='icons/dead_glitch.png' class='image-center'/><p class='handler__text'>Sprawdź co na naszej grupie: <a href='https://www.facebook.com/groups/1721694058053294/' target='_blank'>Bynie Pągowskiego</a></p>";
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

	//disable/enable range - options
	document.getElementById("range").addEventListener("mousemove", function(){
		var value = document.getElementById("range").value;
		document.getElementById("value").innerHTML = value+" minut";
	});

	//setting timeout time of call twitch api - options
	document.getElementById("timeout").addEventListener("click", function(){
		var valueCheckbox = document.getElementById("timeout").checked;

		if(valueCheckbox == true){
			document.getElementById("timeout").checked = true;
			document.getElementById("range").disabled = false;
			document.getElementById("range").value = 60;
			document.getElementById("value").innerHTML = "60 minut";
		}
		else{
			document.getElementById("range").disabled = true;
			document.getElementById("value").innerHTML = "Opcja wyłaczona";
		}
	});

	//saving options into localStorage - START
	document.getElementById("saveFunctions").addEventListener("click", function(){
		var arrayValues = new Array();
		var checkboxValue = document.getElementById("timeout").checked;
			arrayValues.push(checkboxValue);

		if(checkboxValue === true){
			var rangeValue = document.getElementById("range").value;

			arrayValues.push(rangeValue);
		}

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

			if(itemsArray.length == 1){
				document.getElementById("timeout").checked = itemsArray[0];
				document.getElementById("range").disabled = true;
				document.getElementById("value").innerHTML = "Opcja wyłaczona";
			}
			else if(itemsArray.length > 1){
				document.getElementById("timeout").checked = itemsArray[0];
				document.getElementById("range").disabled = false;
				document.getElementById("range").value = itemsArray[1];
				document.getElementById("value").innerHTML = itemsArray[1]+" minut";
			}
			else{
				document.getElementById("timeout").checked = true;
				document.getElementById("range").disabled = false;
				document.getElementById("range").value = 60;
				document.getElementById("value").innerHTML = "60 minut";
			}
		});
	}

	getOptions();
	//end getting options from localStorage - END
	//end saving options into localStorage - END

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
});

/****

TO DO:
1) Voice alert when stream on
3) minute word rendering function

****/