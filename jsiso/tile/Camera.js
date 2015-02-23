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

    var scaledMapWidth;
    var scaledMapHeight;

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
    var rangeX = 0;
    var rangeY = 0;
    
    var isometric = false;

    var xyNextPos = {};

    var lockToScreen = false; // if set to True, tile maps larger than screen will not scroll off screen boundary

    function _setup(layers, mapW, mapH, tileW, tileH, screenW, screenH, curZ, lts) {
      mapLayers = layers;
      mapWidth = mapW;
      mapHeight = mapH;
      tileWidth = tileW;
      tileHeight = tileH;
      curZoom = curZ || 1;
      screenWidth = screenW;
      screenHeight = screenH;
      scaledMapWidth = mapWidth / tileW;
      scaledMapWidth = scaledMapWidth * (tileW * curZoom);
      scaledMapHeight = mapHeight / tileW;
      scaledMapHeight = scaledMapHeight * (tileH * curZoom);
      if (lts) {
        lockToScreen = lts;
      }
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

    function _setFocus(posX, posY, cameraRangeX, cameraRangeY, setZoom) {
      var xyMapOffset;
      var i;

      if (setZoom !== undefined) {
        curZoom = setZoom;
        scaledMapWidth = mapWidth / tileWidth;
        scaledMapWidth = scaledMapWidth * (tileWidth * curZoom);
        scaledMapHeight = mapHeight / tileHeight;
        scaledMapHeight = scaledMapHeight * (tileHeight * curZoom);
        screenHeight = Math.round(window.innerHeight / (tileHeight * curZoom));
        screenWidth = Math.round(window.innerWidth / (tileWidth * curZoom));
      }
      rangeX = cameraRangeX || rangeX;
      rangeY = cameraRangeY || rangeY;
      startX = Math.round(posX - screenWidth / 2);
      startY = Math.round(posY - screenHeight / 2);

      if (!lockToScreen) {
        if (startX < 0) {
          startX = 0;
        }
        if (startY < 0) {
          startY = 0;
        }
      }

      if (screenHeight * tileHeight > scaledMapHeight) {
        for (i = 0; i < mapLayers.length; i++) {
          mapLayers[i].setOffset(null, Math.round(screenHeight * (tileHeight * curZoom) / 2 - scaledMapHeight / 2));
        }
      }
      else {
        for (i = 0; i < mapLayers.length; i++) {
          if (startY < 0) {
            mapLayers[i].setOffset(null, Math.round(-(tileHeight * curZoom) * posY + (posY * (tileHeight * curZoom))));
          }
          else {
            if (lockToScreen && startY + screenHeight > scaledMapHeight / tileHeight) {
              mapLayers[i].setOffset(null, -(Math.round(scaledMapHeight / tileHeight) - screenHeight) * tileHeight + tileHeight);
            }
            else {
              mapLayers[i].setOffset(null, Math.round(-(tileHeight * curZoom) * posY + (screenHeight / 2 * (tileHeight * curZoom))));
            }
          }
        }
      }
      if (screenWidth * tileWidth > scaledMapWidth) {
        for (i = 0; i < mapLayers.length; i++) {
          mapLayers[i].setOffset(Math.round(screenWidth * (tileWidth * curZoom) / 2 - scaledMapWidth / 2), null);
        }
      }
      else {
        for (i = 0; i < mapLayers.length; i++) {
          if (startX < 0) {
            mapLayers[i].setOffset(Math.floor(screenWidth * (tileWidth * curZoom) / 2 - scaledMapWidth / 2), null);
          }
          else {
            if (lockToScreen && startX + screenWidth > scaledMapWidth / tileWidth) {
              mapLayers[i].setOffset(-(Math.floor(scaledMapWidth / tileWidth)  - screenWidth) * tileWidth, null);
            }
            else {
              mapLayers[i].setOffset(Math.round(-(tileWidth * curZoom) * posX + (screenWidth / 2 * (tileWidth * curZoom))), null);
            }
          }
        }
      }

      xyMapOffset = mapLayers[0].getOffset();

      focusX = posX * (curZoom * tileWidth) + xyMapOffset.x;
      focusY = posY * (curZoom * tileHeight) + xyMapOffset.y;
      xyNextPos = _getXYCoords(focusX - xyMapOffset.x, focusY - xyMapOffset.y);
      var startXNew = Math.floor(xyNextPos.x - rangeX / 2);
      var startYNew = Math.floor(xyNextPos.y - rangeY / 2);
      if (!lockToScreen) {
        if (startXNew < 0) {
          startXNew = 0;
        }
        if (startYNew < 0) {
          startYNew = 0;
        }
      }
      /*if (startXNew + screenWidth > scaledMapWidth / (tileWidth * curZoom)) {
        startXNew = scaledMapWidth / (tileWidth * curZoom) - screenWidth;
      }
      if (startYNew + screenHeight > scaledMapHeight / (tileHeight * curZoom)) {
        startYNew = scaledMapHeight / (tileHeight * curZoom) - screenHeight;
      }*/
      return {
        startX: startXNew,
        startY: startYNew,
        pinFocusX: Math.floor(focusX),
        pinFocusY: Math.floor(focusY),
        tileX: Math.floor(posX),
        tileY: Math.floor(posY)
      };
    }

    // direction: "up", "down", "left", "right" - distance: int
    function _move(direction, distance) {
      var xyMapOffset = mapLayers[0].getOffset();
      xyNextPos = _getXYCoords(focusX - xyMapOffset.x, focusY - xyMapOffset.y);
      switch(direction) {
        case "up":
          if (!lockToScreen || (lockToScreen && xyNextPos.y - 1 <= startY + screenHeight / 2 && focusY < (screenHeight / 2 * tileHeight) && xyMapOffset.y <= 0)) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("up", distance);
            }
          }
          else {
            focusY -= distance;
          }
        break;
        case "down":
          if (!lockToScreen || (lockToScreen && xyNextPos.y >= screenHeight / 2 && focusY > (screenHeight / 2 * tileHeight) && xyMapOffset.y >= -mapHeight + tileHeight + focusY + (screenHeight / 2 * tileHeight))) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("down", distance);
            }
          }
          else {
            focusY += distance;
          }
        break;
        case "left":
          if (!lockToScreen || (lockToScreen && xyNextPos.x - 1 <= startX + screenWidth / 2 && focusX < (screenWidth / 2 * tileWidth) && xyMapOffset.x <= 0)) {
            for (i = 0; i < mapLayers.length; i++) {
              mapLayers[i].move("left", distance);
            }
          }
          else {
            focusX -= distance;
          }
        break;
        case "right":
          if (!lockToScreen || (lockToScreen && xyNextPos.x >= screenWidth / 2 && xyMapOffset.x >= -mapWidth + focusX + (screenWidth / 2 * tileWidth))) {
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
      setup: function(mapLayers, mapWidth, mapHeight, tileWidth, tileHeight, screenWidth, screenHeight, curZoom, lockToScreen) {
        return _setup(mapLayers, mapWidth, mapHeight, tileWidth, tileHeight, screenWidth, screenHeight, curZoom, lockToScreen);
      },

      setFocus: function(posX, posY, rangeX, rangeY, setZoom) {
        return _setFocus(posX, posY, rangeX, rangeY, setZoom);
      },

      setPinFocusY: function(y) {
        focusY = y;
        return {
          startX: Math.floor(startX),
          startY: Math.floor(startY),
          pinFocusX: focusX,
          pinFocusY: focusY,
          tileX: Math.floor(xyNextPos.x),
          tileY: Math.floor(xyNextPos.y)
        };
      },

      setPinFocusX: function(x) {
        focusX = x;
        return {
          startX: Math.floor(startX),
          startY: Math.floor(startY),
          pinFocusX: focusX,
          pinFocusY: focusY,
          tileX: Math.floor(xyNextPos.x),
          tileY: Math.floor(xyNextPos.y)
        };
      },

      getFocus: function() {
        return {
          startX: Math.floor(startX),
          startY: Math.floor(startY),
          pinFocusX: focusX,
          pinFocusY: focusY,
          tileX: Math.floor(xyNextPos.x),
          tileY: Math.floor(xyNextPos.y)
        };
      },

      move: function(direction, distance, setZoom) {
        return _move(direction, distance, setZoom);
      }
      
    };
  };
});