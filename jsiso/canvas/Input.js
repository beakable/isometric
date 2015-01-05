/*  
Copyright (c) 2013 Iain Hamilton

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



/*** 

jsiso/canvas/Input

Simplifies adding multiple input methods
for canvas interaction

***/
define(function() {

// Return Input Class

  return function(doc, canvas) {

    // Private properties for Input

    /**
    * Used for getting keyboard interaction keycodes
    * @param {Event} Event
    * @param {Function} Callback function
    * @param {Boolean} If the key is down or up
    * @return {Function} callback({Number} keycode, {Boolean} pressed)
    */
    function _keyboardInput(e, callback, pressed) {
      var keyCode;
      if(e === null) {
        keyCode = window.e.keyCode;
      }
      else {
        keyCode = e.keyCode;
      }
      callback(keyCode, pressed, e);
    }


    /**
    * Used for getting touch screen coordinates
    * @param {Event} Event
    * @param {Function} Callback function
    * @param {Boolean} If the screen is being touched
    * @return {Function} callback({Object} X & Y touch coordinates, {Boolean} pressed)
    */
    function _mobileInput(e, callback, pressed) {
      var coords = {};
      if (pressed) {
        coords.x = e.touches[0].pageX - canvas.offsetLeft;
        coords.y = e.touches[0].pageY - canvas.offsetTop;
      }
      callback(coords, pressed);
    }


    /**
    * Used for getting mouse click coordinates
    * @param {Event} Event
    * @param {Function} Callback function
    * @return {Function} callback({Object} X & Y mouse coordinates)
    */
    function _mouseInput(e, callback) {
      var coords = {};
      coords.x = e.pageX - canvas.offsetLeft;
      coords.y = e.pageY - canvas.offsetTop;
      callback(coords);
    }


    /**
    * Performs the callback function when screen orientation change is detected
    * @param {Function} Callback function
    * @return {Function} callback()
    */
    function _orientationChange(callback) {
      window.addEventListener("orientationchange", function() {
        callback();
      }, false);
    }


    // ----
    // -- Public properties for Input
    // ----

    return {

      /**
      * Public method for adding keyboard input
      * @param {Function} Callback function
      */
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


      /**
      * Public method for adding orientation detection
      * @param {Function} Callback function
      */
      orientationChange: function(callback) {
        // Callback returns if orientation of screen is changed
        _orientationChange(callback);
      },


      /**
      * Public method for adding mobile touch detection
      * @param {Function} Callback function
      */
      mobile: function(callback) {
        var touchendCoords = {};
        // Callback returns when screen is touched and when screen touch ends
        canvas.addEventListener('touchstart', function(event) {
          event.preventDefault();
          _mobileInput(event, function(coords, pressed) {
            touchendCoords = coords;
            callback(coords, pressed);
          }, true);
        }, false);
        canvas.addEventListener('touchend', function(event) {
          event.preventDefault();
          callback(touchendCoords, false);
        });
      },


      /**
      * Public method for adding mouse click detection
      * @param {Function} Callback function
      */
      mouse_action: function(callback) {
        // Callback returns on mouse down
        canvas.addEventListener('mousedown', function(event) {
          event.preventDefault();
          _mouseInput(event, callback);
        }, false);
      },


      /**
      * Public method for adding mouse move detection
      * @param {Function} Callback function
      */
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