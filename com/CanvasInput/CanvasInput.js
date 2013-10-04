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

function CanvasInput(doc, canvas) {

  function _keyboard_input(e, callback) {
    var keyCode;
    if(e === null) {
      keyCode = window.e.keyCode;
    }
    else {
      keyCode = e.keyCode;
    }
    callback(keyCode);
  }

  function _mobile_input(e, callback) {
    var coords = {};
    coords.x = e.touches[0].pageX - canvas.offsetLeft;
    coords.y = e.touches[0].pageY - canvas.offsetTop;
    callback(coords);
  }

  function _mouse_input(e, callback) {
    var coords = {};
    coords.x = e.pageX - canvas.offsetLeft;
    coords.y = e.pageY - canvas.offsetTop;
    callback(coords);
  }

  return {
    keyboard: function(callback) {
      doc.onkeydown = function(event) {
        _keyboard_input(event, callback);
      };
    },

    mobile: function(callback) {
      doc.addEventListener('touchstart', function(event) {
        event.preventDefault();
        _mobile_input(event, callback);
      }, false);
    },

    mouse_action: function(callback) {
      doc.addEventListener('mousedown', function(event) {
        event.preventDefault();
        _mouse_input(event, callback);
      }, false);
    },

    mouse_move: function(callback) {
      doc.addEventListener('mousemove', function(event) {
        event.preventDefault();
        _mouse_input(event, callback);
      }, false);
    }
  };
}