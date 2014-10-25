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

jsiso/img/loader 

Promise version

Simply takes an array of image paths and 
preloads them ready for use

**/
define(function() {

  return function(graphics) {

    // graphics example =
    /*
    [{
      graphics: ["img/sground.png"],
      spritesheet: { // OPTIONAL spritesheet is optional for images to be auto split up
        width: 24, 
        height: 24, 
        offsetX: 0, // OPTIONAL
        offsetY: 0, // OPTIONAL
        spacing: 0, // OPTIONAL
        firstgid: 0 // OPTIONAL
      }
    }]
    */

    function _splitSpriteSheet(spritesheet) {
      return new Promise(function(resolve, reject) {
        var _loaded = 0; // Images total the preloader has loaded
        var _loading = 0; // Images total the preloader needs to load
        
        var images = [];
        var ctx = document.createElement('canvas');
        var tileManip;
        var imageFilePathArray = [];
        var spriteID = (spritesheet.firstgid || 0);
        var tileRow;
        var tileCol;
        var spritesheetCols = Math.floor(spritesheet.files[spritesheet.dictionary[0]].width / (spritesheet.width));
        var spritesheetRows = Math.floor(spritesheet.files[spritesheet.dictionary[0]].height / (spritesheet.height));
        _loading +=  spritesheetCols * spritesheetRows;
        ctx.width = spritesheet.width;
        ctx.height = spritesheet.height;
        tileManip = ctx.getContext('2d');
        for (var i = 0; i < spritesheetRows; i++) {
          for (var j = 0; j < spritesheetCols; j++) {
            tileManip.drawImage(spritesheet.files[spritesheet.dictionary[0]], j * (spritesheet.width + spritesheet.offsetX  + spritesheet.spacing) + spritesheet.spacing, i * (spritesheet.height + spritesheet.offsetY + spritesheet.spacing) + spritesheet.spacing,  spritesheet.width + spritesheet.offsetX - spritesheet.spacing, spritesheet.height  + spritesheet.offsetY - spritesheet.spacing, 0, 0, spritesheet.width, spritesheet.height);
            imageFilePathArray[spriteID] = spriteID;
            images[spriteID] = new Image();
            images[spriteID].src = ctx.toDataURL();
            tileManip.clearRect (0, 0, spritesheet.width, spritesheet.height);
            images[spriteID].onload = function () {
              _loaded ++;
              if (_loaded === _loading) {
                resolve({files: images, dictionary: imageFilePathArray});
              }
            };
            spriteID ++;
          }
        }
      });
    }


    function _imgPromise(graphic) {
      return new Promise(function(resolve, reject) {

        var _loaded = 0; // Images total the preloader has loaded
        var _loading = 0; // Images total the preloader needs to load

        var images = [];
        _loading += graphic.graphics.length;
       
        graphic.graphics.map(function(img) {
          imgName = img;
          if (graphic.removePath === undefined || graphic.removePath === true) {
            imgName = img.split("/").pop();
          }
          images[imgName] = new Image();
          images[imgName].src = img;
          images[imgName].onload = function() {
            _loaded ++;
            if (_loaded === _loading && !graphic.spritesheet) {
              resolve({files: images, dictionary: graphic.graphics});
            }
            else {
              _splitSpriteSheet({
                files: images,
                dictionary: graphic.graphics,
                width: graphic.spritesheet.width,
                height: graphic.spritesheet.height,
                offsetX: (graphic.spritesheet.offsetX || 0),
                offsetY: (graphic.spritesheet.offsetY || 0),
                spacing: (graphic.spritesheet.spacing || 0),
                firstgid: (graphic.spritesheet.firstgid || 0)
              }).then(function(response) {
                resolve(response);
              });
            }
          };
        });
        if (graphic.removePath === undefined || graphic.removePath === true) {
          for (var i = 0; i < graphic.graphics.length; i++) {
            graphic.graphics[i] = graphic.graphics[i].split("/").pop();
          }
        }
      });
    }

    if (Object.prototype.toString.call(graphics) === '[object Array]') {
      var promises = [];
      for (var i = 0; i < graphics.length; i++) {
        promises.push(_imgPromise(graphics[i]));
      }
      return Promise.all(promises);
    }
    else {
      return _imgPromise(graphics);
    }

  };
});