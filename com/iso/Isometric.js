/*  Copyright (c) 2013 Iain Hamilton & Edward Smyth

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

function Isometric(ctx, tileWidth, tileHeight, mapLayout, tileImages, tileImagesDictionary) {

  var title = "";

  var zeroIsBlank = false;
  var stackTiles = false;
  var stackTileGraphic = null;
  var drawX = 0;
  var drawY = 0;

  var heightMap = null;
  var lightMap = null;
  var lightX = null;
  var lightY = null;

  var heightOffset = 0;
  var heightShadows = null;
  var shadowSettings = null;

  var shadowDistance = null;

  var heightMapOnTop = false;

  var curZoom = 1;
  var mouseUsed = false;
  var focusTilePosX = 0;
  var focusTilePosY = 0;

  var applyIneractions = false;

  var alphaWhenFocusBehind =  {}; // Used for applying alpha to objects infront of focus 

  var tilesHide = null;
  var hideSettings = null;

  var particleTiles =null;
  var particleMap = [];
  var particleMapHolder = [];


  function _setup(settings) {
      lightMap = settings.lightMap;
      shadowDistance = settings.shadowDistance;
      title = settings.title;
      zeroIsBlank = settings.zeroIsBlank;
      alphaWhenFocusBehind = settings.alphaWhenFocusBehind;
  }

  function _draw(i, j, tileImageOverwite) {

    var xpos, ypos;
    i = Math.floor(i);
    j = Math.floor(j);
    if (i > mapLayout.length - 1) {
      i = mapLayout.length - 1;
    }
    if (j > mapLayout[i].length - 1) {
      j = mapLayout[i].length - 1;
    }
    var resizedTileHeight;
    var stackGraphic = null;
    var image_num = Number(mapLayout[i][j]);
    var distanceLighting = null;
    var distanceLightingSettings;
    if (shadowDistance) {
      distanceLightingSettings = {
        distance: shadowDistance.distance,
        darkness: shadowDistance.darkness,
        color: shadowDistance.color
      };
      distanceLighting = Math.sqrt((Math.floor(i - lightX) * Math.floor(i - lightX)) + (Math.floor(j - lightY) * Math.floor(j - lightY)));
      if (lightMap) {
        var lightDist = 0;
        // Calculate which light source is closest

        lightMap.map(function(light) {
          lightDist = Math.sqrt((Math.floor(i - light[0]) * Math.floor(i - light[0])) + (Math.floor(j - light[1]) * Math.floor(j - light[1])));
          if (lightDist > distanceLighting) {

          }
          else {
            if(distanceLighting / (distanceLightingSettings.darkness * distanceLightingSettings.distance) > lightDist / (light[2] * light[3])) {
              distanceLighting = lightDist;
              distanceLightingSettings.distance = light[2];
              distanceLightingSettings.darkness = light[3];
            }
          }
        });
      }
      if(distanceLighting > distanceLightingSettings.distance){
        distanceLighting = distanceLightingSettings.distance;
      }
      distanceLighting =  distanceLighting / (distanceLightingSettings.darkness * distanceLightingSettings.distance);
    }
    if ((!zeroIsBlank) || (zeroIsBlank && image_num) || tileImageOverwite) {
      if (zeroIsBlank) {
        image_num--;
      }
      if(tilesHide && image_num >= hideSettings.hideStart && image_num <= hideSettings.hideEnd) {
        stackGraphic = tileImages[hideSettings.planeGraphic];
      }
      else if(tileImageOverwite) {
        stackGraphic = tileImageOverwite;
      }
      else {
        if (stackTileGraphic) {
          stackGraphic = stackTileGraphic;
        }
        else {
          stackGraphic = tileImages[tileImagesDictionary[image_num]];
        }
      }

      resizedTileHeight = stackGraphic.height / (stackGraphic.width / tileWidth);

      xpos = (i - j) * (tileHeight * curZoom) + drawX;
      ypos = (i + j) * (tileWidth / 4 * curZoom) + drawY;

      if (!stackTiles) {

        // If no heightmap for this tile

        if (!distanceLightingSettings || ( distanceLightingSettings && distanceLighting < distanceLightingSettings.darkness)) {
          if (tileImageOverwite) {

            // Draw the overwriting image insetad of tile

            ctx.drawImage(tileImageOverwite, 0, 0, stackGraphic.width, stackGraphic.height, xpos, (ypos + ((tileHeight - resizedTileHeight) * curZoom)), (tileWidth * curZoom), (resizedTileHeight * curZoom));
          }
          else {

            // Draw the tile image
            ctx.save();
            if (alphaWhenFocusBehind.apply === true) {
              if ((i === focusTilePosX + 1 && j === focusTilePosY + 1) || (i === focusTilePosX && j === focusTilePosY + 1) || (i === focusTilePosX + 1 && j === focusTilePosY)) {
                    if (alphaWhenFocusBehind.objectApplied && ((alphaWhenFocusBehind.objectApplied === null || alphaWhenFocusBehind.objectApplied && (resizedTileHeight * curZoom) > alphaWhenFocusBehind.objectApplied.height * curZoom))) {
                  ctx.globalAlpha = 0.6;
                }
              }
            }
            ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, (ypos + ((tileHeight - resizedTileHeight) * curZoom)), (tileWidth * curZoom), (resizedTileHeight * curZoom));
            crx.restore();
          }
        }
      }
      else {
        var stack = Math.round(Number(heightMap[i][j]));
        for (var k = 0; k <= stack; k++) {
          if (heightMapOnTop && k === stack) { 

            // If tile is to be placed on top of heightmap 

            if (!distanceLightingSettings || ( distanceLightingSettings && distanceLighting < distanceLightingSettings.darkness)) {
              if (tileImageOverwite) {

                // Draw overwriting image on top of height map

                ctx.drawImage(tileImageOverwite, 0, 0, tileImageOverwite.width, tileImageOverwite.height, xpos, ypos + ((k - 1) *(tileHeight - heightOffset - tileHeight)) * curZoom - (resizedTileHeight  - tileHeight) * curZoom, (tileWidth * curZoom), (resizedTileHeight * curZoom));
              }
              else {

                // Draw the tile image on top of height map
                ctx.save();
                if (alphaWhenFocusBehind && alphaWhenFocusBehind.apply === true) {
                  if ((i === focusTilePosX + 1 && j === focusTilePosY + 1) || (i === focusTilePosX && j === focusTilePosY + 1) || (i === focusTilePosX + 1 && j === focusTilePosY)) {
                    if (alphaWhenFocusBehind.objectApplied && (alphaWhenFocusBehind.objectApplied === null || (alphaWhenFocusBehind.objectApplied && (resizedTileHeight * curZoom) > alphaWhenFocusBehind.objectApplied.height * curZoom))) {
                      ctx.globalAlpha = 0.6;
                    }
                  }
                }
                ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + ((k - 1) *(tileHeight - heightOffset - tileHeight)) * curZoom - (resizedTileHeight  - tileHeight) * curZoom, (tileWidth * curZoom), (resizedTileHeight * curZoom));
                ctx.restore();
              }
            }
          }
          else if(!heightMapOnTop) {

            // If tile is to be repeated for heightmap

            if (!distanceLightingSettings || ( distanceLightingSettings && distanceLighting < distanceLightingSettings.darkness)) {
              if (tileImageOverwite) {
                ctx.drawImage(tileImageOverwite, 0, 0, tileImageOverwite.width, tileImageOverwite.height, xpos, ypos + (k * ((tileHeight - heightOffset - resizedTileHeight) * curZoom)), (tileWidth * curZoom), (resizedTileHeight * curZoom));
              }
              else{
                if (stackTileGraphic) {
                  if (k !== stack) {
                    ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + (k * ((tileHeight - heightOffset - resizedTileHeight) * curZoom)), (tileWidth * curZoom), (resizedTileHeight * curZoom));
                  } 
                  else {
                    stackGraphic = tileImages[tileImagesDictionary[image_num]];
                    //resizedTileHeight = stackGraphic.height / (stackGraphic.width / tileWidth);
                    ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + ((k - 1) * ((tileHeight - heightOffset - resizedTileHeight) * curZoom)), (tileWidth * curZoom), (stackGraphic.height / (stackGraphic.width / tileWidth) * curZoom));
                  }
                }
                else {
                  ctx.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + (k * ((tileHeight - heightOffset - resizedTileHeight) * curZoom)), (tileWidth * curZoom), (resizedTileHeight * curZoom));
                }
              }
            }
          }
          ctx.restore();
        }
        if (distanceLightingSettings) {
          if (distanceLightingSettings.color !== false) {
          -- k;
           if ( distanceLighting < distanceLightingSettings.darkness) {

              // Apply distane shadows from light source

              ctx.save();
              //ctx.globalCompositeOperation = 'source-atop';
              ctx.fillStyle = 'rgba(' + distanceLightingSettings.color + ',' + distanceLighting + ')';
              ctx.beginPath();
              ctx.moveTo(xpos - 2, ypos - 1 + ((k - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
              ctx.lineTo(xpos - 1 + (tileHeight * curZoom), ypos - 2 + ((k - 1) * ((tileHeight - resizedTileHeight) * curZoom)));
              ctx.lineTo(xpos + 2 + (tileHeight * curZoom) * 2, ypos - 1 + ((k - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
              ctx.lineTo(xpos + 1 + (tileHeight * curZoom), ypos + 2 + ((k - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom));
              ctx.fill();
              ctx.restore();
            }
          }
        }
        if (mouseUsed) {
          if (i == focusTilePosX && j == focusTilePosY) {

            // Apply mouse over tile coloring

            ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
            ctx.beginPath();
            ctx.moveTo(xpos, ypos + ((k - 2) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.lineTo(xpos + (tileHeight * curZoom), ypos + ((k - 2) * ((tileHeight - resizedTileHeight) * curZoom)));
            ctx.lineTo(xpos + (tileHeight * curZoom) * 2, ypos + ((k - 2) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
            ctx.lineTo(xpos + (tileHeight * curZoom), ypos + ((k - 2) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom));
            ctx.fill();
          }
        }
      }
    }

    if (particleTiles) {

      // Draw Particles
      if (!distanceLightingSettings || ( distanceLightingSettings && distanceLighting < distanceLightingSettings.darkness)) {
        if (Number(particleMap[i][j]) !== 0) {
          if (!particleMapHolder[i]) {
            particleMapHolder[i] = [];
          }
          if (!particleMapHolder[i][j]) {
            particleMapHolder[i][j] = new EffectLoader.Get(particleMap[i][j], ctx, new Range(0, 800), new Range(0, 600));
          }
          particleMapHolder[i][j].Draw(xpos, ypos + ((k - 1) *(tileHeight - heightOffset - tileHeight)) * curZoom - (resizedTileHeight  - tileHeight) * curZoom, (tileWidth * curZoom));
        }
      }
    }

    if (heightShadows) {
      var nextStack = 0;
      var currStack = 0;
      var shadowXpos = 0;
      var shadowYpos = 0;

      if (heightMap) {
        nextStack = Math.round(Number(heightMap[i][j - 1]));
        currStack = Math.floor(Number(heightMap[i][j]));
        if (currStack < nextStack) {
          shadowXpos = (i - j) * (tileHeight * curZoom) + drawX;
          shadowYpos = (i + j) * (tileWidth / 4 * curZoom) + drawY;
          if (shadowSettings.verticalColor) {

            // Apply Vertical shadow created from stacked tiles

            if (!distanceLightingSettings  || (distanceLighting < distanceLightingSettings.darkness)) {
              ctx.fillStyle = shadowSettings.verticalColor;
              ctx.beginPath();
              ctx.moveTo(shadowXpos, shadowYpos + ((currStack - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
              ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + ((currStack - 1) * ((tileHeight - resizedTileHeight) * curZoom)));
              ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos + ((currStack - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
              ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + ((currStack - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom));
              ctx.fill();
            }
          }
          if (shadowSettings.horizontalColor) {

            // Apply Horizontal shadows on stacked tiles

            if (!distanceLightingSettings  || (distanceLighting < distanceLightingSettings.darkness)) {
              ctx.fillStyle = shadowSettings.horizontalColor;
              ctx.beginPath();
              ctx.moveTo(shadowXpos + (tileHeight * curZoom), shadowYpos + ((currStack - 1) * ((tileHeight - resizedTileHeight) * curZoom)));
              ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos - ((nextStack - 1) * ((tileHeight - shadowSettings.offset) / ((tileHeight - shadowSettings.offset) / shadowSettings.offset)  * curZoom)));
              ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos - ((nextStack - 1) * (tileHeight - shadowSettings.offset) / ((tileHeight - shadowSettings.offset) / shadowSettings.offset) * curZoom) + (tileHeight * curZoom) / 2);
              ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos + ((currStack - 1) * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
              ctx.fill();
            }
          }
        }
      }
      else {

        // Shadows without height map e.g. Object Shadows

        currStack = Math.floor(Number(mapLayout[i][j - 1]));
        if(currStack > 0) {
          shadowXpos = (i - j) * (tileHeight * curZoom) + drawX;
          shadowYpos = (i + j) * (tileWidth / 4 * curZoom) + drawY;
          ctx.fillStyle = shadowSettings.verticalColor;
          ctx.beginPath();
          ctx.moveTo(shadowXpos, shadowYpos + (currStack * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
          ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resizedTileHeight) * curZoom)));
          ctx.lineTo(shadowXpos + (tileHeight * curZoom) * 2, shadowYpos + (currStack * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom) / 2);
          ctx.lineTo(shadowXpos + (tileHeight * curZoom), shadowYpos + (currStack * ((tileHeight - resizedTileHeight) * curZoom)) + (tileHeight * curZoom));
          ctx.fill();
        }
      }
    }
  }

  function _stackTiles(settings) {
    stackTiles = true;
    stackTileGraphic = settings.heightTile;
    heightMap = settings.map;
    heightOffset = settings.offset;
    heightMapOnTop = settings.heightMapOnTop || false;
  }

  function _particleTiles(map) {
    particleTiles = true;
    particleMap = map;
  }

  function _setLight(posX, posY) {
    lightX = posX;
    lightY = posY;
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

  function _getHeightMapTile(posX, posY) {
    return heightMap[posX][posY];
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

  function _adjustLight(setting, increase) {
    if (increase) {
      shadowDistance.distance += setting;
      if (lightMap) {
        lightMap.map(function(light) {
          //light[3] += setting;
        });
      }
    }
    else {
      shadowDistance.distance -= setting;
      if (lightMap) {
        lightMap.map(function(light) {
         // light[3] -= setting;
        });
      }
    }
  }

  function _getXYCoords(x, y) {
    var positionY = (2 * (y - drawY) - x + drawX) / 2;
    var positionX = x + positionY - drawX - (tileHeight * curZoom);
    positionY = Math.round(positionY / (tileHeight * curZoom));
    positionX = Math.round(positionX / (tileHeight * curZoom));
    return({x: positionX, y: positionY});
  }

  function _applyMouseFocus(x, y) {
    mouseUsed = true;
    focusTilePosY = (2 * (y - drawY) - x + drawX) / 2;
    focusTilePosX = x + focusTilePosY - drawX - (tileHeight * curZoom);
    focusTilePosY = Math.round(focusTilePosY / (tileHeight * curZoom));
    focusTilePosX = Math.round(focusTilePosX / (tileHeight * curZoom));
    return({x: focusTilePosX, y: focusTilePosY});
  }

  function _applyFocusClick(x, y, val) {
    // heightMap[x][y] = Number(heightMap[x][y]) + 1;
  }

  function _setTile(x, y, val) {
    mapLayout[x][y] = val;
  }

  function _setHeightmapTile(x, y, val) {
    heightMap[x][y] = val;
  }

  function _applyFocus(xPos, yPos) {
    focusTilePosX = xPos;
    focusTilePosY = yPos;
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
    var tempArrayThree =[];
    var tempLineThree = [];
    var i,j ;
    if (setting == "left") {
      for (i = 0; i < mapLayout.length; i++) {
        for (j = mapLayout.length - 1; j >= 0; j--) {
          tempLine.push(mapLayout[j][i]);
          if (stackTiles) {
            tempLineTwo.push(heightMap[j][i]);
          }
          if (particleTiles) {
            tempLineThree.push(particleMap[j][i]);
          }
        }
        tempArray.push(tempLine);
        tempLine = [];
        if (stackTiles) {
          tempArrayTwo.push(tempLineTwo);
          tempLineTwo = [];
        }
        if (particleTiles) {
          tempArrayThree.push(tempLineThree);
          tempLineThree = [];
        }
      }
      if (stackTiles) {
        heightMap = tempArrayTwo;
      }
      if (particleTiles) {
        heightMap = tempArrayThree;
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
          if (particleTiles) {
            tempLineThree.push(particleMap[j][i]);
          }
        }
        tempArray.push(tempLine);
        tempLine = [];
        if (stackTiles) {
          tempArrayTwo.push(tempLineTwo);
          tempLineTwo = [];
        }
        if (particleTiles) {
          tempArrayThree.push(tempLineThree);
          tempLineThree = [];
        }
      }
      if (stackTiles) {
        heightMap = tempArrayTwo;
      }
      if (particleTiles) {
        heightMap = tempArrayThree;
      }
      mapLayout = tempArray;
    }
  }


  return {

    setupProperties: function(settings) {
      return _setup(settings);
    },

    draw: function(tileX, tileY, tileImageOverwite) {
      return _draw(tileX, tileY, tileImageOverwite);
    },

    stackTiles: function(settings) {
      return _stackTiles(settings);
    },

    particleTiles: function(map) {
      return _particleTiles(map);
    },

    getLayout: function() {
      return _getLayout();
    },

    getHeightLayout: function() {
      return _getHeightLayout();
    },

    getTitle: function() {
      return title;
    },

    getTile: function(tileX, tileY) {
      return Number(_getTile(tileX, tileY));
    },

    getHeightMapTile: function(tileX, tileY) {
      return Number(_getHeightMapTile(tileX, tileY));
    },

    setTile: function(tileX, tileY, val) {
      _setTile(tileX, tileY, val);
    },

    setHeightmapTile: function(tileX, tileY, val) {
      _setHeightmapTile(tileX, tileY, val);
    },

    setZoom: function(direction) {
      // in || out
      return _setZoom(direction);
    },

    setLight: function(tileX, tileY) {
      return _setLight(tileX, tileY);
    },

    getXYCoords: function(XPosition, YPosition) {
      return _getXYCoords(XPosition, YPosition);
    },

    applyMouseFocus: function(mouseXPosition, mouseYPosition) {
      return _applyMouseFocus(mouseXPosition, mouseYPosition);
    },

    applyFocus: function(tileX, tileY) {
      return _applyFocus(tileX, tileY);
    },

    applyFocusClick: function(tileX, tileY, val) {

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

    setLightness: function(setting) {
      shadowDistance.distance = setting;
    },

    adjustLightness: function(setting, increase) {
      _adjustLight(setting, increase);
    },

    getLightness: function() {
      return shadowDistance.distance;
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