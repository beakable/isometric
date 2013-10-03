function url(){
	this._path = function(part) {
			var url = window.location.href;
			var url_parts = url.split('/');
			return url_parts[part+3];

	} 
}