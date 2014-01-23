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

/** jsiso/canvas/Input simplifies multiple input methods for canvas interaction. **/

define(function() {

// Return CanvasInput Class

  return function(doc, canvas) {

    // Private properties for CanvasInput

    function _keyboardInput(e, callback, pressed) {
      var keyCode;
      if(e === null) {
        keyCode = window.e.keyCode;
      }
      else {
        keyCode = e.keyCode;
      }
      callback(keyCode, pressed);
    }

    function _mobileInput(e, callback, pressed) {
      var coords = {};
      if (pressed) {
        coords.x = e.touches[0].pageX - canvas.offsetLeft;
        coords.y = e.touches[0].pageY - canvas.offsetTop;
      }
      callback(coords, pressed);
    }

    function _mouseInput(e, callback) {
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


    // Public properties for CanvasInput:

    return {

      keyboard: function(callback) {
        // Callback returns 2 paramaters:
        // -- Pressed keycode
        // -- True if button is down / False if button is up
        doc.onkeydown = function(event) {
          _keyboardInput(event, callback, true);
        };
        doc.onkeyup = function(event) {
          _keyboardInput(event, callback, false);
        };
      },


      orientationChange: function(callback) {
        // Callback returns if orientation of screen has changed
        _orientationChange(callback);
      },


      mobile: function(callback) {
        // Callback returns when screen is touched and when screen touch ends
        canvas.addEventListener('touchstart', function(event) {
          event.preventDefault();
          _mobileInput(event, callback, true);
        }, false);
        canvas.addEventListener('touchend', function(event) {
          event.preventDefault();
          _mobileInput(event, callback, false);
        }, false);
      },


      mouse_action: function(callback) {
        // Callback returns on mouse down
        canvas.addEventListener('mousedown', function(event) {
          event.preventDefault();
          _mouseInput(event, callback);
        }, false);
      },


      mouse_move: function(callback) {
        // Callback returns when mouse is moved
        canvas.addEventListener('mousemove', function(event) {
          event.preventDefault();
          _mouseInput(event, callback);
        }, false);
      }

    };

  };

});