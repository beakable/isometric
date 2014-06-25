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

    var mapOffsetX;
    var mapOffsetY;

    var curZoom;
    var startX = 0;
    var startY = 0;
    var focusX = 0;
    var focusY = 0;
    
    var isometric = false;

    function _setup(layers, mapW, mapH, tileW, tileH, curZ) {
      mapLayers = layers;
      mapWidth = mapW;
      mapHeight = mapH;
      tileWidth = tileW;
      tileHeight = tileH;
      curZoom = curZ || 1;
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
      startX = posX - rangeX / 2;
      startY = posY - rangeY / 2;
      mapLayers.forEach(function(layer) {
      if (startX < 0) {
        layer.setOffset(-tileWidth * posX + (posX * tileWidth), null);
      }
      else {
        if (startX + rangeX > mapWidth / tileWidth) {
          layer.setOffset(mapWidth / tileWidth - (rangeX * tileWidth), null);
        }
        else {
          layer.setOffset(-tileWidth * posX + (rangeX / 2 * tileHeight), null);
        }
      }
      if (startY < 0) {
        layer.setOffset(null, -tileHeight * posY + (posY * tileHeight));
      }
      else {
        if (startY + rangeY > mapHeight / tileHeight) {
          layer.setOffset(null, mapHeight / tileHeight - (startY * tileHeight) / 2);
        }
        else {
          layer.setOffset(null, -tileHeight * posY + (rangeY / 2 * tileHeight));
        }
      }
        
      });
      xyMapOffset = mapLayers[0].getOffset();
      focusX = posX * tileWidth + xyMapOffset.x;
      focusY = posY * tileHeight + xyMapOffset.y;
      return {
        startX: startX,
        startY: startY,
        pinFocusX: focusX,
        pinFocusY: focusY,
        tileX: posX,
        tileY: posY
      };
    }

    // direction: "up", "down", "left", "right" - distance: int
    function _move(direction, distance, startX, startY, rangeX, rangeY) {
      var xyNextPos;
      var xyMapOffset = mapLayers[0].getOffset();
      switch(direction) {
        case "up":
          xyNextPos = _getXYCoords(focusX - xyMapOffset.x, focusY - 2 - xyMapOffset.y);
          if (xyNextPos.y <= startY + rangeY / 2 && focusY < (rangeY / 2 * tileHeight) && xyMapOffset.y <= 0) {
            mapLayers.forEach(function(layer) {
              layer.move("up", distance);
            });
          }
          else {
            focusY -= distance;
          }
        break;
        case "down":
          xyNextPos = _getXYCoords(focusX - xyMapOffset.x, focusY + 2 - xyMapOffset.y);
          if (xyNextPos.y >= rangeY / 2 && xyMapOffset.y >= -mapHeight + focusY + (rangeY / 2 * tileHeight)) {
            mapLayers.forEach(function(layer) {
              layer.move("down", distance);
            });
          }
          else {
            focusY += distance;
          }
        break;
        case "left":
          xyNextPos = _getXYCoords(focusX - 2 - xyMapOffset.x, focusY - xyMapOffset.y);
          if (xyNextPos.x <= startX + rangeX / 2 && focusX < (rangeX / 2 * tileWidth) && xyMapOffset.x <= 0) {
            mapLayers.forEach(function(layer) {
              layer.move("left", distance);
            });
          }
          else {
            focusX -= distance;
          }
        break;
        case "right":
          xyNextPos = _getXYCoords(focusX + 2 - xyMapOffset.x, focusY - xyMapOffset.y);
          if (xyNextPos.x >= rangeX / 2 && xyMapOffset.x >= -mapWidth + focusX + (rangeX / 2 * tileWidth)) {
            mapLayers.forEach(function(layer) {
              layer.move("right", distance);
            });
          }
          else {
            focusX += distance;
          }
        break;
      }
      startX = xyNextPos.x - rangeX / 2;
      startY = xyNextPos.y - rangeY / 2;

      return {
        startX: startX,
        startY: startY,
        pinFocusX: focusX,
        pinFocusY: focusY,
        tileX: xyNextPos.x,
        tileY: xyNextPos.y
      };
      // Returns where to start drawing the tiles from.
      // pinFocus represents a precise location withn the map.
    }

    return {
      setup: function(mapLayers, mapWidth, mapHeight, tileWidth, tileHeight, curZoom) {
        return _setup(mapLayers, mapWidth, mapHeight, tileWidth, tileHeight, curZoom);
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