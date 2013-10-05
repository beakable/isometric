<?php
/*

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.



- Isometric HTML5 App is currently in early development and does not contain all planned features.

- Author : Iain M Hamilton - <iain@beakable.com> - http://www.beakable.com

*/
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <style type="text/css">
     body{
      margin: 0;
      padding: 0;
     }
    </style>
    <script type="text/javascript" src="com/CanvasInput/CanvasInput.js"></script> 
    <script type="text/javascript" src="com/xml/XMLPopulate.js" ></script>
    <script type="text/javascript" src="com/img/ImageLoader.js"></script>
    <script tppe="text/javascript" src="com/iso/Isometric.js"></script>
    <script type="text/javascript">

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame  || 
      window.mozRequestAnimationFrame     || 
      window.oRequestAnimationFrame       ||  
      window.msRequestAnimationFrame      || 
      function(callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
    })();

    function launch() {

      var XML = new XMLPopulate();
      var imgLoader = new ImageLoader();

      XML.loadXML('com/xml/XMLFiles.php?folder=img/ground/');
      var groundImages = imgLoader.loadImageArray('img/ground/', XML.getContent('files', 'file'));

      XML.loadXML('com/xml/XMLFiles.php?folder=img/objects/');
      var objectImages = imgLoader.loadImageArray('img/objects/', XML.getContent('files','file'));

      XML.loadXML('com/xml/XMLFiles.php?folder=img/gui/');
      var guiImages = imgLoader.loadImageArray('img/gui/', XML.getContent('files','file'));
      
      var loadTimer = setInterval(loadAll, 100);

      function loadAll() {
        if (imgLoader.loaded === imgLoader.to_load) {
          clearInterval(loadTimer);
          var game = new main(0, 0, 14, 14, 100, 50);
          XML.loadXML('map-read.php');
          
          game.init({
            layers: [
              game.createLayer({
                zIndex: 0,
                title: "Ground Layer",
                layout: XML.getContent('ground_map','row'),
                graphics: groundImages.files,
                graphicsDictionary: groundImages.dictionary,
                heightShadow: {
                  offset: 20
                },
                heightMap: {
                  map: XML.getContent('ground_height','row'),
                  offset: 0,
                  //heightMapOnTop: true
                },
                hideGraphics: {
                  //rangeMin: 0,
                  //rangeMax: 6,
                  //graphic: '5-concrete.png'
                },
                height: 100,
                width: 50,
                applyIneractions: true

              }),
              game.createLayer({
                zIndex: 1,
                title: "Object Layer",
                layout: XML.getContent('object_map','row'),
                graphics: objectImages.files,
                graphicsDictionary: objectImages.dictionary,
                height: 100,
                width: 50,
                zero_is_blank: true,
                //alpha_mouse_behind: true,
                //heightShadow: {
                //  offset: 10
                //},
                heightMap: {
                  map: XML.getContent('ground_height','row'),
                  offset: 20,
                  heightMapOnTop: true
                },
                hideGraphics: {
                  rangeMin: 0,
                  rangeMax: 11,
                  graphic: '7-normal.png'
                },
                applyIneractions: true
              })
            ],
            gui: guiImages.files
          });
        }
      }
    }


    function main(x, y, xrange, yrange) {
      self = this;
      var mapLayers = [];
      var gui = [];
      var tile_coordinates = {};
      var mouse_coordinates = {};
      var startY = y;
      var startX = x;
      var rangeX = xrange;
      var rangeY = yrange;
      var defaultRangeY = rangeY;

      var canvas = document.createElement('canvas');
      canvas.width = 920;
      canvas.height = 600;
      canvas.style.border = "#333 2px solid";
      var context = canvas.getContext('2d');
      document.body.appendChild(canvas);

      var input = new CanvasInput(document, canvas);

      input.keyboard(function(pressed) {
        switch(pressed) {
          case 38:
            self.keyCommand(1);
          break;
          case 39:
            self.keyCommand(2);
          break;
          case 40:
            self.keyCommand(3);
          break;
          case 37:
            self.keyCommand(4);
          break;
          case 65:
            self.keyCommand(5);
          break;
          case 83:
            self.keyCommand(6);
          break;
          case 49:
            self.keyCommand(7);
          break;
          case 50:
            self.keyCommand(8);
          break;
          case 81:
            self.keyCommand(9);
          break;
          case 87:
            self.keyCommand(10);
          break;
        }
      });

      this.keyCommand = function(dir) {
        switch(dir) {
          case 1:
            if (startY > 0) {
              mapLayers.map(function(layer) {
                layer.draw_y += layer.tileH/2 * layer.curZoom;
                layer.draw_x += layer.tileH * layer.curZoom;
              });
              startY --;
            }
          break;
          case 2:
            if (startX > 0) {
              mapLayers.map(function(layer) {
                layer.draw_y += layer.tileH/2 * layer.curZoom;
                layer.draw_x -= layer.tileH * layer.curZoom;
              });
              startX --;
            }
          break;
          case 3:
          if (startY + rangeY < mapLayers[0].getLayout().length) {
            mapLayers.map(function(layer) {
              layer.draw_y -= layer.tileH/2 * layer.curZoom;
              layer.draw_x -= layer.tileH * layer.curZoom;
            });
            startY ++;
          }
          break;
          case 4:
            if (startX + rangeX < mapLayers[0].getLayout().length ) {
              mapLayers.map(function(layer) {
                layer.draw_y -= layer.tileH/2 * layer.curZoom;
                layer.draw_x += layer.tileH * layer.curZoom;
              });
              startX ++;
            }
          break;
          case 5:
            mapLayers.map(function(layer) {
              if (startY + rangeY + 1 < mapLayers[0].getLayout().length - 1) {
                layer.setZoom("out");
                layer.align("h-center", canvas.width, xrange, -60);
                layer.align("v-center", canvas.height,  yrange, 35);
                rangeX +=  1
                rangeY +=  1
              }
            });
          break;
          case 6:
            mapLayers.map(function(layer) {
              if (rangeY - 1 > defaultRangeY - 1) {
                layer.setZoom("in");
                layer.align("h-center", canvas.width, xrange, -60);
                layer.align("v-center", canvas.height,  yrange, 35);
                rangeX -=  1
                rangeY -=  1
              }
            })
          break;
          case 7:
            mapLayers.map(function(layer) {
              if (layer.tilesHide !== null) {
                layer.hideGraphics(true);
              }
              if (layer.heightShadow !== null) {
                layer.applyHeightShadow(true);
              }
            });
          break;
          case 8:
            mapLayers.map(function(layer) {
              if(layer.tilesHide !== null) {
                layer.hideGraphics(false);
              }
              if (layer.heightShadow !== null) {
                layer.applyHeightShadow(false);
              }
            });
          break;
          case 9:
            mapLayers.map(function(layer) {
              layer.rotate("left");
              //startY = mapLayers[0].getLayout().length - startY - rangeX;
              //startX = startY;
            });
          break;
          case 10:
            mapLayers.map(function(layer) {
              layer.rotate("right");
              //startY = mapLayers[0].getLayout().length - startX - rangeX;
            });
          break;
        }
        requestAnimFrame(self.draw);
      }

      this.draw = function() {
       context.clearRect(0,0,canvas.width,canvas.height);
        for(i = startY; i < startY + rangeY; i++) {
          for(j = startX; j < startX + rangeX; j++) {
           mapLayers.map(function(layer) {
             layer.draw(i,j);
           });
         }
       }
       context.fillStyle = "rgb(255,255,255)";
       if (tile_coordinates.x < mapLayers[0].getLayout().length && tile_coordinates.x >= 0 && tile_coordinates.y < mapLayers[0].getLayout().length && tile_coordinates.y >= 0) {
         mapLayers.map( function(layer) {
          if (layer.applyIneractions) {
            if (layer.getTile([tile_coordinates.x],[tile_coordinates.y]) > 0) {
             context.drawImage(gui["popup-box.png"],mouse_coordinates.x,mouse_coordinates.y);
             context.font = "8pt Arial";
             context.fillText("Hover box",mouse_coordinates.x+14,mouse_coordinates.y+25);
            }
          }
         });
       }
      }
      
      this.createLayer = function(settings) {
       var layer = new Isometric(context, settings.height, settings.width, settings.layout, settings.graphics, settings.graphicsDictionary);
       layer.title = settings.title;
       layer.setZoom(1);
       layer.zero_is_blank = settings.zero_is_blank;
       layer.alpha_mouse_behind = settings.alpha_mouse_behind;
       if(settings.heightShadow) {
         layer.applyHeightShadow(settings.heightShadow);
       }
       if (settings.heightMap) {
         layer.stack_tiles(settings.heightMap);
       }
       if(settings.hideGraphics) {
         layer.hideGraphics(true, {
          rangeStart: settings.hideGraphics.rangeMin, 
          rangeEnd: settings.hideGraphics.rangeMax, 
          graphic: settings.hideGraphics.graphic
         });
       }

       if(settings.applyIneractions) {
         layer.applyIneractions = settings.applyIneractions;
         input.mouse_move(function(coords) {
          tile_coordinates = layer.applyMouse(coords.x, coords.y);
          mouse_coordinates = coords;
          requestAnimFrame(self.draw);
         });  
         input.mobile(function(coords) {
          tile_coordinates = layer.applyMouse(coords.x, coords.y);
          mouse_coordinates = coords;
          requestAnimFrame(self.draw);
         });
         input.mouse_action(function(coords) {
          tile_coordinates = layer.applyMouse(coords.x, coords.y);
          layer.applyMouseClick(tile_coordinates.x, tile_coordinates.y);
          requestAnimFrame(self.draw);
         });
       }

       layer.align("h-center", canvas.width, xrange, -60);
       layer.align("v-center", canvas.height,  yrange, 35);
       return layer;
      }


      this.init = function(settings) {
       mapLayers = settings.layers;
       gui = settings.gui;
       this.draw();
      }
      
    }
    </script>
  </head>
  <body onLoad="launch()">  
  </body>
</html>