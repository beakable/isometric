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



/*** 

jsiso/canvas/Control 

Allows for creation of a Canvas object that offers
access to easy common functionality used in projects

***/
define(function() {

  // Private properties for Control

  var canvasElement = null;

  /***
  * Checks that the browser supports HTML5 Canvas element
  * @return {Boolean} determines if Canvas is supported
  */
  function _supported () {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }


  /**
  * Creates a Canvas object offering easy access to element manipulation 
  * @param {String} name - to be appleid as the ID of created Canvas element
  * @param {Number} width
  * @param {Number} height
  * @param {Object} style
  * @return {Object} Canvas
  */
  function _create(name, w, h, style, element) {
    if (_supported()) {
      canvasElement = document.createElement('canvas');
      canvasElement.id = name;
      canvasElement.width = w || window.innerWidth;
      canvasElement.height = h || window.innerHeight;
      for (var s in style) {
        canvasElement.style[s] = style[s];
      }
      if (!element) {
        // Append Canvas into document body
        return document.body.appendChild(canvasElement).getContext('2d');
      }
      else {
        // Place canvas into passed through body element
        return document.getElementById(element).appendChild(canvasElement).getContext('2d');
      }
    }
    else {
      // Create an HTML element displaying that Canvas is not supported :(
      var noCanvas = document.createElement("div");
      noCanvas.style.color = "#FFF";
      noCanvas.style.textAlign = "center";
      noCanvas.innerHTML = "Sorry, you need to use a more modern browser. We like: <a href='https://www.google.com/intl/en/chrome/browser/'>Chrome</a> &amp; <a href='http://www.mozilla.org/en-US/firefox/new/'>Firefox</a>";
      return document.body.appendChild(noCanvas);
    }
  }


  /**
  * Fullscreens the Canvas object
  */
  function _fullScreen() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = window.innerHeight;
    document.body.style.width = window.innerWidth;
    document.body.style.overflow = "hidden";
    canvasElement.height = window.innerHeight;
    canvasElement.width = window.innerWidth;
    window.scrollTo(0, 1);
  }


  /**
  * Update the Canvas object dimensions
  * @param {Number} width
  * @param {Number} height
  */
  function _update(w, h) {
    canvasElement.width = w || window.innerWidth;
    canvasElement.height = h || window.innerHeight;
  }


  /**
  * Return the created HTML Canvas element when it is called directly
  * @return {HTML} Canvas element
  */
  function canvas() {
    return canvasElement;
  }


  // ----
  // -- Public properties for Control
  // ----
  canvas.create = _create;
  canvas.fullScreen = _fullScreen;
  canvas.update = _update;


  // Return Canvas Object
  return canvas;
});