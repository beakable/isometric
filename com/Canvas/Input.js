/*  
Copyright (c) 2013 Iain Hamilton & Edward Smyth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
*/

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

  function _orientationChange(callback) {
    window.addEventListener("orientationchange", function() {
      callback();
    }, false);    
  }

  return {
    keyboard: function(callback) {
      doc.onkeydown = function(event) {
        _keyboard_input(event, callback);
      };
    },

    orientationChange: function(callback) {
      _orientationChange(callback);
    },

    mobile: function(callback) {
      canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();
        _mobile_input(event, callback);
      }, false);
    },

    mouse_action: function(callback) {
      canvas.addEventListener('mousedown', function(event) {
        event.preventDefault();
        _mouse_input(event, callback);
      }, false);
    },

    mouse_move: function(callback) {
      canvas.addEventListener('mousemove', function(event) {
        event.preventDefault();
        _mouse_input(event, callback);
      }, false);
    }
  };
}