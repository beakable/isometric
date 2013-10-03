function ImageLoader() {
  var _toLoad = 0;
  var _loaded = 0;

  function _loadArray(path, dict) {
    _toLoad += dict.length;
    var images = Array();
    dict.map(function(img) {
      images[img] = new Image();
      images[img].src = path + img;
      images[img].onload = function() {
        _loaded++;
      };
    });
    return {files: images, dictionary: dict};
  }

  return {
    loadImageArray: function(path, dict) {
      return _loadArray(path, dict);
    }
  };

}