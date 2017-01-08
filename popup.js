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
	    errorCallback('Network error.');
	};
	xhr.send(data);
}

//rendering status in popup
function renderStatus(statusText) {
  	document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
	
	//checking stream status in twitch API - big function - START
	getTwitchStreamStatus(function(streamTitle, streamGame, streamLiveViewers, streamLiveDate, streamPreviewMedium) {

	  var status = document.getElementById('status');
	  var dateNowTimestamp = new Date();
	  var streamStartDateTimestamp = new Date(streamLiveDate);

	  var streamDuring = dateNowTimestamp - streamStartDateTimestamp;

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
	  	errorCallback('Time error 1');
	  }

	  	chrome.browserAction.setIcon({path: "icons/icon_1.png"});
		status.innerHTML = "<p class='handler__text'>Tytuł streama: "+streamTitle+"</p><p class='handler__text'>Gra: "+streamGame+"</p><p class='handler__text'>Bynie online: <span class='handler__text-live'>"+streamLiveViewers+"</span></p><p class='handler__text'>Live trwa od: "+outputTime+"</p><a href='https://twitch.tv/pago3/' target='_blank' class='handler__text__stream text-xs-center'><img src='"+streamPreviewMedium+"'/></a><a href='https://twitch.tv/pago3' target='_blank' class='handler__text-button-watch'>Oglądaj bynia!</a>";
	},
	function(streamOff){
		var status = document.getElementById('status');

		chrome.browserAction.setIcon({path: "icons/icon_default.png"});
		status.innerHTML = "<p class='handler__text text-xs-center'>"+streamOff+"</p><img src='icons/dead_glitch.png' class='image-center'/><p class='handler__text'>Sprawdź co na naszej grupie: <a href='https://www.facebook.com/groups/1721694058053294/' target='_blank'>Bynie Pągowskiego</a></p>";
	},
	function(errorMessage) {
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
			document.getElementById("range").disabled = false;
			document.getElementById("range").value = 60;
			document.getElementById("value").innerHTML = "60 minut";
		}
		else{
			document.getElementById("range").disabled = true;
			document.getElementById("value").innerHTML = "Opcja wyłaczona";
		}
	});

	//saving options into cookie - START
	document.getElementById("saveFunctions").addEventListener("click", function(){
		var arrayValues = new Array();
		var checkboxValue = document.getElementById("timeout").checked;
			arrayValues.push(checkboxValue);

		if(checkboxValue === true){
			var rangeValue = document.getElementById("range").value;

			arrayValues.push(rangeValue);
		}

		var jsonArray = JSON.stringify(arrayValues);

		chrome.cookies.set({
			"name":"PagoExtensionCookie1",
			"url":"https://api.twitch.tv/kraken",
			"value":jsonArray,
			"expirationDate": (new Date().getTime()/1000) + 3600
		});
	});

	chrome.cookies.get({
		"name":"PagoExtensionCookie1",
		"url":"https://api.twitch.tv/kraken"
	},function(cookie){
		var cookieArray = JSON.parse(cookie.value);

		if(cookieArray.length == 1){
			document.getElementById("timeout").checked = cookieArray[0];
			document.getElementById("range").disabled = true;
			document.getElementById("value").innerHTML = "Opcja wyłaczona";
		}
		else if(cookieArray.length > 1){
			document.getElementById("timeout").checked = cookieArray[0];
			document.getElementById("range").disabled = false;
			document.getElementById("range").value = cookieArray[1];
			document.getElementById("value").innerHTML = cookieArray[1]+" minut";
		}
	});
	//end saving options into cookie - END
});