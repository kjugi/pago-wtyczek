/* function which will get stream status from TWITCH API

YES, TWITCH API
Kappa

#PAPUT
*/

function getTwitchStreamStatus(){
	//one streamer extension PAGO3
	//demo mode: on
	//https://api.twitch.tv/kraken/streams/40378922?client_id=dlw882cebptkltr33a4s0ejzongxfg
	var streamerID = "40378922";
	var client_id = "dlw882cebptkltr33a4s0ejzongxfg";
	var url = "https://api.twitch.tv/kraken/streams/";

	var fullUrl = url+streamerID+"?client_id="+client_id;
}