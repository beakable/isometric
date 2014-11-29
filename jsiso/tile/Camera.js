/*  Copyright (c) 2014 Iain Hamilton

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
THE SOFTWARE. */

define([], function() {
  return function () {

    var mapLayers;

    var mapWidth;
    var mapHeight;
    var tileWidth;
    var tileHeight;
    var screenWidth;
    var screenHeight;


    var mapOffsetX;
    var mapOffsetY;

    var curZoom;
    var startX = 0;
    var startY = 0;
    var focusX = 0;
    var focusY = 0;
    
    var isometric = false;

    function _setup(layers, mapW, mapH, tileW, tileH, screenW, screenH, curZ) {
      mapLayers = layers;
      mapWidth = mapW;
      mapHeight = mapH;
      tileWidth = tileW;
      tileHeight = tileH;
      curZoom = curZ || 1;
      screenWidth = screenW;
      screenHeight = screenH;
      return {
        startX: startX,
        startY: startY,
        pinFocusX: focusX,
        pinFocusY: focusY
      };
    }

    function _getXYCoords(x, y) {
      var positionY, positionX;
      if (!isometric) {
        positionY = Math.round((y - (tileHeight * curZoom) / 2)/ (tileHeight * curZoom));
        positionX = Math.round((x - (tileWidth * curZoom) / 2)/ (tileWidth * curZoom));
      }
      else {
        positionY = (2 * (y - mapOffsetY) - x + mapOffsetX) / 2;
        positionX = x + positionY - mapOffsetX - (tileHeight * curZoom);
        positionY = Math.round(positionY / (tileHeight * curZoom));
        positionX = Math.round(positionX / (tileHeight * curZoom));
      }
      return {x: positionX, y: positionY};
    }

    function _setFocus(posX, posY, rangeX, rangeY) {
      var xyMapOffset;
      var i;
      startX = posX - screenWidth / 2;
      startY = posY - screenHeight / 2;
      
      if (screenHeight * tileHeight > mapHeight) {
        for (i = 0; i < mapLayers.length; i++) {
          mapLayers[i].setOffset(null, Math.floor(screenHeight * tileHeight / 2 - mapHeight / 2));
        }
      }
      else {
        for (i = 0; i < mapLayers.length; i++) {
          if (startY < 0) {
            mapLayers[i].setOffset(null, Math.floor(-tileHeight * posY + (posY * tileHeight)));
          }
          else {
            if (startY + screenHeight > mapHeight / tileHeight) {
              mapLayers[i].setOffset(null, Math.floor(mapHeight / tileHeight) - (screenHeight * tileHeight) / 2) ;
            }
            else {
              mapLayers[i].setOffset(null, Math.floor(-tileHeight * posY + (screenHeight / 2 * tileHeight)));
            }
          }
        }
      }
      if (screenWidth * tileWidth > mapWidth) {
        for (i = 0; i < mapLayers.length; i++) {
          mapLayers[i].setOffset(Math.floor(screenWidth * tileWidth / 2 - mapWidth / 2), Math.floor(screenHeight * tileHeight / 2 - mapHeight / 2));
        }
      }
      else {
        for (i = 0; i < mapLayers.length; i++) {
          if (startX < 0) {
            mapLayers[i].setOffset(Math.floor(-tileWidth * posX + (posX * tileWidth)), null);
          }
          else {
            if (startX + screenWidth > mapWidth / tileWidth) {
              mapLayers[i].setOffset(-(Math.floor(mapWidth / tileWidth)  - screenWidth) * tileWidth, null);
            }
            else {
              mapLayers[i].setOffset(Math.floor(-tileWidth * posX + (screenWidth / 2 * tileHeight)), null);
            }
          }
        }
      }
      xyMapOffset = mapLayers[0].getOffset();
      focusX = posX * tileWidth + xyMapOffset.x;
      focusY = posY * tileHeight + xyMapOffset.y;
      var xyNextPos = _getXYCoords(focusX - xyMapOffset.x, focusY - xyMapOffset.y);
      return {
        startX: Math.floor(xyNextPos.x - rangeX / 2),
        startY: Math.floor(xyNextPos.y - rangeY / 2),
        pinFocusX: Math.floor(focusX),
        pinFocusY: Math.floor(focusY),
        tileX: Math.floor(posX),
        tileY: Math.floor(posY)
      };
    }

    // direction: "up", "down", "left", "right" - distance: int
    function _move(direction, distance, startX, startY, rangeX, rangeY) {
      var xyMapOffset = mapLayers[0].getOffset();
      var xyNextPos = _getXYCoords(focusX - xyMapOffset.x, focusY - xyMapOffset.y);
      switch(direction) {
        case "up":
          if (xyNextPos.y - 1 <= startY + screenHeight / 2 && focusY < (screenHeight / 2 * tileHeight) && xyMapOffset.y <= 0) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("up", distance);
            }
          }
          else {
            focusY -= distance;
          }
        break;
        case "down":
          if (xyNextPos.y >= screenHeight / 2 && xyMapOffset.y >= -mapHeight + focusY + (screenHeight / 2 * tileHeight)) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("down", distance);
            }
          }
          else {
            focusY += distance;
          }
        break;
        case "left":
          if (xyNextPos.x - 1 <= startX + screenWidth / 2 && focusX < (screenWidth / 2 * tileWidth) && xyMapOffset.x <= 0) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("left", distance);
            }
          }
          else {
            focusX -= distance;
          }
        break;
        case "right":
          if (xyNextPos.x >= screenWidth / 2 && xyMapOffset.x >= -mapWidth + focusX + (screenWidth / 2 * tileWidth)) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("right", distance);
            }
          }
          else {
            focusX += distance;
          }
        break;
      }
      startX = xyNextPos.x - rangeX / 2;
      startY = xyNextPos.y - rangeY / 2;

      return {
        startX: Math.floor(startX),
        startY: Math.floor(startY),
        pinFocusX: Math.floor(focusX),
        pinFocusY: Math.floor(focusY),
        tileX: Math.floor(xyNextPos.x),
        tileY: Math.floor(xyNextPos.y)
      };
      // Returns where to start drawing the tiles from.
      // pinFocus represents a precise location withn the map.
    }

    return {
      setup: function(mapLayers, mapWidth, mapHeight, tileWidth, tileHeight, screenWidth, screenHeight, curZoom) {
        return _setup(mapLayers, mapWidth, mapHeight, tileWidth, tileHeight, screenWidth, screenHeight, curZoom);
      },

      setFocus: function(posX, posY, rangeX, rangeY) {
        return _setFocus(posX, posY, rangeX, rangeY);
      },

      getFocus: function() {
        return {
          startX: startX,
          startY: startY,
          pinFocusX: focusX,
          pinFocusY: focusY
        };
      },

      move: function(direction, distance, startX, startY, rangeX, rangeY) {
        return _move(direction, distance, startX, startY, rangeX, rangeY);
      }
      
    };
  };
});