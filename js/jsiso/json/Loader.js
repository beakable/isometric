define(function() {

  return function(path, callback) {

		var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", path, true);
    xmlhttp.send();

		xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(JSON.parse(xmlhttp.responseText));
      }
    };


  };
});