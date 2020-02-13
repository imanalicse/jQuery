/*
* Get query param by name
*/
function getUriParam(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null) {
		return null;
	}
	return decodeURI(results[1]) || 0;
}
var docid = getUriParam('docid');

/*
* Get query param by name but it does not support in internet explorer
* http://localhost:8000/checkout/primo-redirect/?cart_identifier=327739aed9ad0165fbd84e2ab2294ca5
*/
var url_string = window.location.href;
var url = new URL(url_string);
var cart_identifier = url.searchParams.get("cart_identifier");



function getQueryParam(url, param) {
	var regex = new RegExp("[\\?&]" + param + "=([^&#]*)"),
		results = regex.exec(url);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
