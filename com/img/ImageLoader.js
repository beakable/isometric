/*  This file is part of Iain Hamiltons Isometric HTML5 App.

    Iain Hamiltons Isometric HTML5 App is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Iain Hamiltons Isometric HTML5 App is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Iain Hamiltons Isometric HTML5 App.  If not, see <http://www.gnu.org/licenses/>. */

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