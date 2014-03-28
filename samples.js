var express = require('express');
var fs = require('fs');
var app = express();

var PUBLIC_PATH = __dirname + '/public';

app.get('/map-read.php', function(req, res) {
  var body = fs.readFileSync(__dirname + "/sample_map.xml");
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Content-Length', body.length);
  res.end(body); 
});

app.get('/XMLFiles.php', function(req, res) {
	var body = '<?xml version="1.0" ?><files>';
	var contents = fs.readdirSync(PUBLIC_PATH + '/img/' + req.query.folder);
	for (var f in contents) {
		var filename = contents[f];
		if (filename.match("(\.jpg$)|(\.png$)|(\.jpeg)|(\.gif$)")) {
			body += '<file>'+'/img' + req.query.folder + filename+'</file>'
		}
	}
	body += '</files>'
	res.setHeader('Content-Type', 'text/xml');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.use(express.static(PUBLIC_PATH));
app.use('/js', express.static(__dirname + '/js'));

var port = process.env.PORT || 1337
app.listen(port);
console.log('Listening on port ' + port);

