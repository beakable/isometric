/*  This file is part of Iain Hamiltons Isometric HTML5 App.

    Iain Hamiltons Isometric HTML5 App is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Iain Hamiltons Isometric HTML5 App is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Iain Hamiltons Isometric HTML5 App.  If not, see <http://www.gnu.org/licenses/>. */

function Isometric(ctx, tileWidth, tileHeight, mapLayout, tileImages, tileImagesDictionary) {
  
  var title = "";

  var zeroIsBlank = false;
  var stackTiles = false;
  var drawX = 0;
  var drawY = 0;

  var heightMap = null;

  var heightOffset = 0;
  var heightShadows = null;
  var shadowSettings = null;

  var shadowDistance = false;

  var heightMapOnTop = false;

  var curZoom = 1;
  var mouseUsed = false;
  var MouseTilePosX = 0;
  var MouseTilePosY = 0;
  var xMouse = 0;
  var yMouse = 0;

  var applyIneractions = false;

  var mouseBehindAlpha =  false;

  var tilesHide = null;
  var hideSettings = null;


  function _setup(settings) {
      shadowDistance = settings.shadowDistance;
      title = settings.title;
      zeroIsBlank = settings.zeroIsBlank;
      //mouseBehindAlpha = settings.mouseBehindAlpha;
  }

  function _draw(i, j) {

    var xpos, ypos;

    i = Math.floor(i);
    j = Math.floor(j);
    if (i > mapLayout.length - 1) {
      i = mapLayout.length - 1;
    }
    if (j > mapLayout[i].length - 1) {
      j = mapLayout[i].length - 1;
    }
    var resized_height;
    var stackGraphic = null;
    var image_num = Number(mapLayout[i][j]);
    if ((!zeroIsBlank) || (zeroIsBlank && image_num)) {
      if (zeroIsBlank) {
        image_num--;
      }
      if(tilesHide && image_num >= hideSettings.hideStart && image_num <= hideSettings.hideEnd) {
        stackGraphic = tileImages[hideSettings.planeGraphic];
        resized_height = tileImages[hideSettings.planeGraphic].height / (tileImages[hideSettings.planeGraphic].width / tileWidth);
      }
      else {
        stackGraphic = tileImages[tileImagesDictionary[image_num]];
        resized_height = tileImages[tileImagesDictionary[image_num]].height / (tileImages[tileImagesDictionary[image_num]].width / tileWidth);
      }
      xpos = (i - j) * (tileHeight * curZoom) + drawX;
      ypos = (i + j) * (tileWidth / 4 * curZoom) + drawY;
      if (!stackTiles) {
        ctx.drawImage(tileImages[tileImagesDictionary[image_num]], 0, 0, tileImages[tileImagesDictionary[image_num]].width, tileImages[tileImagesDictionary[image_num]].height, xpos, (ypos + ((tileHeight - resized_height) * curZoom)), (tileWidth * curZoom), (resized_height * curZoom));
      }
      else {
        var stack = Math.round(Number(heightMap[i][j]));
        for (var k = 0; k <= stack; k++) {
          ctx.save();
          if (mouseBehindAlpha) {
            if (i == MouseTilePosX + 1 && j == MouseTilePosY + 1) {
              ctx.globalAlpha = 0.3;
            }
          }
          if (heightMapOnTop && k === stack){
            ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + (k *(tileHeight - heightOffset - tileHeight)) * curZoom - (resized_height  - tileHeight) * curZoom, (tileWidth * curZoom), (resized_height * curZoom));
          }
          else if(!heightMapOnTop) {
            ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + (k * ((tileHeight - heightOffset - resized_height) * curZoom)), (tileWidth * curZoom), (resized_height * curZoom));
          }
          ctx.restore();
        }
        if (shadowDistance) {
          var  dist = Math.sqrt((Math.floor(i - MouseTilePosX) * Math.floor(i - MouseTilePosX)) + (Math.floor(j - MouseTilePosY) * Math.floor(j - MouseTilePosY)));
          if(dist > 10){
            dist = 10;
          }
          -- k;
          dist = dist/(20+stack*2);
          ctx.save();
          ctx.globalCompositeOperation = 'source-atop';
          ctx.fillStyle = 'rgba(0, 0, 33,'+dist+')';
          ctx.beginPath();
          ctx.moveTo(xpos, ypos + (k * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
          ctx.lineTo(xpos + (tileHeight * curZoom), ypos + (k * ((tileHeight - resized_height) * curZoom)));
          ctx.lineTo(xpos + (tileHeight * curZoom) * 2, ypos + (k * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
          ctx.lineTo(xpos + (tileHeight * curZoom), ypos + (k * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom));
          ctx.fill();
          ctx.restore();
        }
        if (mouseUsed) {
          if (i == MouseTilePosX && j == MouseTilePosY) {
            ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
            ctx.beginPath();
            ctx.moveTo(xpos, ypos + (k * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.lineTo(xpos + (tileHeight * curZoom), ypos + (k * ((tileHeight - resized_height) * curZoom)));
            ctx.lineTo(xpos + (tileHeight * curZoom) * 2, ypos + (k * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.lineTo(xpos + (tileHeight * curZoom), ypos + (k * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom));
           // ctx.fill();
          }
        }
      }
    }
    if (heightShadows) {
      if (heightMap) {
        var nextStack = Math.round(Number(heightMap[i][j - 1]));
        var currStack = Math.floor(Number(heightMap[i][j]));
        if (currStack < nextStack) {
          var shadowXpos = (i - j) * (tileHeight * curZoom) + drawX;
          var shadowYpos = (i + j) * (tileWidth / 4 * curZoom) + drawY;
          if (shadowSettings.verticalColor) {
            ctx.fillStyle = shadowSettings.verticalColor;
            ctx.beginPath();
            ctx.moveTo(shadowXpos, shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)));
            ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom));
            ctx.fill();
          }
          if (shadowSettings.horizontalColor) {
            ctx.fillStyle = shadowSettings.horizontalColor;
            ctx.beginPath();
            ctx.moveTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)));
            ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos - (nextStack * ((tileHeight - shadowSettings.offset) / ((tileHeight - shadowSettings.offset) / shadowSettings.offset)  * curZoom)));
            ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos - (nextStack * (tileHeight - shadowSettings.offset) / ((tileHeight - shadowSettings.offset) / shadowSettings.offset) * curZoom) + (tileHeight * curZoom) / 2);
            ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.fill();
          }
        }
      }
      else {
        var currStack = Math.floor(Number(mapLayout[i][j - 1]));
        if(currStack > 0) {
          var shadowXpos = (i - j) * (tileHeight * curZoom) + drawX;
          var shadowYpos = (i + j) * (tileWidth / 4 * curZoom) + drawY;
          ctx.fillStyle = shadowSettings.verticalColor;
          ctx.beginPath();
          ctx.moveTo(shadowXpos, shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
          ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)));
          ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom) / 2);
          ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resized_height) * curZoom)) + (tileHeight * curZoom));
          ctx.fill();
        }
      }
    }
  }

  function _stackTiles(settings) {
    stackTiles = true;
    heightMap = settings.map;
    heightOffset = settings.offset;
    heightMapOnTop = settings.heightMapOnTop || false;
  }

  function _getLayout() {
    return mapLayout;
  }

  function _getHeightLayout() {
    return heightMap;
  }

  function _getTile(posX, posY) {
    return mapLayout[posX][posY];
  }

  function _setZoom(dir) {
    if (Number(dir)) {
      curZoom = dir;
    }
    else if (dir == "in") {
      if (curZoom < 1) {
        curZoom += 0.1;
      }
    }else if (dir == "out") {
      if (curZoom > 0.2) {
        curZoom -= 0.1;
      }
    }
  }

  function _applyMouse(x, y) {
    var coords = {};
    mouseUsed = true;
    xMouse = x;
    yMouse = y;
    MouseTilePosY = (2 * (y - drawY) - x + drawX) / 2;
    MouseTilePosX = x + MouseTilePosY - drawX - (tileHeight * curZoom);
    MouseTilePosY = Math.round(MouseTilePosY / (tileHeight * curZoom));
    MouseTilePosX = Math.round(MouseTilePosX / (tileHeight * curZoom));
    coords.x = MouseTilePosX;
    coords.y = MouseTilePosY;
    return(coords);
  }

  function _applyMouseClick(x, y) {
    // mapLayout[x][y] = Math.floor(Math.random()*6);
    // heightMap[x][y] = Number(heightMap[x][y]) + 1;
  }

  function _align(position, screen_dimension, size, offset) {
    switch(position) {
      case "h-center":
        drawX = ((screen_dimension / 2) - (tileWidth * (size-1) )/(tileHeight/4)* curZoom) - offset;
      break;
      case "v-center":
        drawY = ((screen_dimension / 2) - (tileHeight * (size-1) * curZoom) / 2) - offset;
      break;
    }
  }

  function _hideGraphics(toggle, settings) {
    tilesHide = toggle;
    if (settings) {
      hideSettings = settings;
    }
  }

  function _applyHeightShadow(toggle, settings) {
    if (toggle) {
      if(settings || shadowSettings) {
        heightShadows = true;
      }
    }
    else{
      if(settings || shadowSettings) {
        heightShadows = false;
      }
    }
    if (settings) {
      shadowSettings = settings;
    }
  }

  function _rotate(setting) {
    var tempArray = [];
    var tempLine = [];
    var tempArrayTwo = [];
    var tempLineTwo = [];
    var i,j ;
    if (setting == "left") {
      for (i = 0; i < mapLayout.length; i++) {
        for (j = mapLayout[i].length - 1; j >= 0; j--) {
          tempLine.push(mapLayout[j][i]);
          if (stackTiles) {
            tempLineTwo.push(heightMap[j][i]);
          }
        }
        tempArray.push(tempLine);
        tempLine = [];
        if (stackTiles) {
          tempArrayTwo.push(tempLineTwo);
          tempLineTwo = [];
        }
      }
      if (stackTiles) {
        heightMap = tempArrayTwo;
      }
      mapLayout = tempArray;
    }
    else if (setting == "right") {
      for (i = mapLayout.length -1; i >= 0; i--) {
        for (j = 0; j < mapLayout.length; j++) {
          tempLine.push(mapLayout[j][i]);
          if (stackTiles) {
            tempLineTwo.push(heightMap[j][i]);
          }
        }
        tempArray.push(tempLine);
        tempLine = [];
        if (stackTiles) {
          tempArrayTwo.push(tempLineTwo);
          tempLineTwo = [];
        }
      }
      if (stackTiles) {
        heightMap = tempArrayTwo;
      }
      mapLayout = tempArray;
    }
  }


  return {

    setupProperties: function(settings) {
      return _setup(settings);
    },

    draw: function(tileX, tileY) {
      return _draw(tileX, tileY);
    },

    stackTiles: function(settings) {
      return _stackTiles(settings);
    },

    getLayout: function() {
      return _getLayout();
    },

    getHeightLayout: function() {
      return _getHeightLayout();
    },

    getTile: function(tileX, tileY) {
      return _getTile(tileX, tileY);
    },

    setZoom: function(direction) {
      // in || out
      return _setZoom(direction);
    },

    applyMouse: function(tileX, tileY) {
      return _applyMouse(tileX, tileY);
    },

    applyMouseClick: function(tileX, tileY) {
      return _applyMouseClick(tileX, tileY);
    },

    align: function(position, screen_dimension, size, offset) {
      return _align(position, screen_dimension, size, offset);
    },

    hideGraphics: function(toggle, settings) {
      return _hideGraphics(toggle, settings);
    },

    applyHeightShadow: function(toggle, settings) {
      return _applyHeightShadow(toggle, settings);
    },

    rotate: function(direction) {
      // left || right
      return _rotate(direction);
    },

    toggleGraphicsHide: function(toggle) {
      if (tilesHide !== null) {
        _hideGraphics(toggle);
      }
    },

    toggleHeightShadow: function(toggle) {
      if (heightShadows !== null) {
        _applyHeightShadow(toggle);
      }
    },

    move: function(direction) {
      // left || right || up || down
      if (direction === "up") {
        drawY += tileHeight/2 * curZoom;
        drawX += tileHeight * curZoom;
      }
      else if (direction === "down") {
        drawY += tileHeight/2 * curZoom;
        drawX -= tileHeight * curZoom;
      }
      else if (direction === "left") {
        drawY -= tileHeight/2 * curZoom;
        drawX -= tileHeight * curZoom;
      }
      else if (direction === "right") {
        drawY -= tileHeight/2 * curZoom;
        drawX += tileHeight * curZoom;
      }


    }

  };


}