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

jsiso/img/ImageLoader 

Simply takes an array of image paths and 
preloads them ready for use

**/
define(function() {

  // Private properties for ImageLoader

  return function() {

    var _loaded = 0; // Images total the preloader has loaded

    var _loading = 0; // Images total the preloader needs to load

    function _loadArray(imageFilePathArray, removePath) {
      var images = [];
      _loading = imageFilePathArray.length;
      imageFilePathArray.map(function(img) {
        imgName = img;
        if (removePath) {
          imgName = img.split("/").pop();
        }
        images[imgName] = new Image();
        images[imgName].src = img;
        images[imgName].onload = function() {
          _loaded ++;
        };
      });
      if (removePath) {
        for (var i = 0; i < imageFilePathArray.length; i++) {
          imageFilePathArray[i] = imageFilePathArray[i].split("/").pop();
        }
      }
      return {files: images, dictionary: imageFilePathArray};
    }


    // ----
    // -- Public properties for ImageLoader
    // ----

    return {

      loaded: _loaded,
      loading: _loading,

      /**
      * Loads an Array of images and returns an object containing preloaded 
        images and dictionary of images for calling
      * @param {Array} Contains all the paths and files.extenstion to be preloaded
      * @param {Boolean} If path should be removed from dictionary so lookup is via filename.ext only
      * @return {Object} via _loadArray returns an object containing { files: {Array} preloadedImages, dictionary: {Array} imageNames}
      */
      loadImageArray: function(imageFilePathArray, removePath) {
        // imageFilePathArray - Array of paths and file name locations to be preloaded in.
        // removePath - Bool if true will remove paths from dictionary leaving only filenames and image extension.
        return _loadArray(imageFilePathArray, removePath);
      }

    };
  };
});