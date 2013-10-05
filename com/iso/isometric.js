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

function Isometric(ctx, tile_width, tile_height, map_array, images, tile_dict) {
  this.context = ctx;

  this.title = "";

  this.tileW = tile_width;
  this.tileH = tile_height;
  this.dict = tile_dict;
  this.map = map_array;
  this.tiles = images;
  this.zero_is_blank = 0;
  this.stackTiles = false;
  this.draw_x =0;
  this.draw_y =0;

  this.heightMap = null;

  this.heightOffset = 0;
  this.shadowOffset = 0;

  this.heightMapOnTop = false;

  this.curZoom =1;
  this.mouse_used = 0;
  this.MouseTilePosX = 0;
  this.MouseTilePosY = 0;
  this.xMouse = 0;
  this.yMouse = 0;

  this.applyIneractions = false;

  this.alpha_mouse_behind = 0;

  this.heightShadow = null;

  this.tilesHide = null;

  this.planeGraphic = null;
  this.hideStart = null;
  this.hideEnd = null;

  this.draw = function(i, j) {
    i = Math.floor(i);
    j = Math.floor(j);
    if (i > this.map.length - 1) {
      i = this.map.length - 1;
    }
    if (j > this.map[i].length - 1) {
      j = this.map[i].length - 1;
    }
    var resized_height;
    var stackGraphic = null;
    var image_num = Number(this.map[i][j]);
    if ((!this.zero_is_blank) || (this.zero_is_blank && image_num)) {
      if (this.zero_is_blank) {
        image_num--;
      }
      if(this.tilesHide && image_num >= this.hideStart && image_num <= this.hideEnd) {
        stackGraphic = this.tiles[this.planeGraphic];
        resized_height = this.tiles[this.planeGraphic].height / (this.tiles[this.planeGraphic].width / this.tileW);
      }
      else {
        stackGraphic = this.tiles[this.dict[image_num]];
        resized_height = this.tiles[this.dict[image_num]].height / (this.tiles[this.dict[image_num]].width / this.tileW);
      }
      var xpos = (i - j) * (this.tileH * this.curZoom) + this.draw_x;
      var ypos = (i + j) * (this.tileW / 4 * this.curZoom) + this.draw_y;
      if (!this.stackTiles) {
        this.context.drawImage(this.tiles[this.dict[image_num]], 0, 0, this.tiles[this.dict[image_num]].width, this.tiles[this.dict[image_num]].height, xpos, (ypos + ((this.tileH - resized_height) * this.curZoom)), (this.tileW * this.curZoom), (resized_height * this.curZoom));
      }
      else {
        var stack = Math.round(Number(this.heightMap[i][j]));
        for (var k = 0; k <= stack; k++) {
          this.context.save();
          if (this.alpha_mouse_behind) {
            if (i == this.MouseTilePosX + 1 && j == this.MouseTilePosY + 1) {
              this.context.globalAlpha = 0.3;
            }
          }
          if (this.heightMapOnTop && k === stack){
            this.context.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + (k *(this.tileH - this.heightOffset - this.tileH)) * this.curZoom - (resized_height  - this.tileH) * this.curZoom, (this.tileW * this.curZoom), (resized_height * this.curZoom));
          }
          else if(!this.heightMapOnTop) {
            this.context.drawImage(stackGraphic, 0, 0, stackGraphic.width, stackGraphic.height, xpos, ypos + (k * ((this.tileH - this.heightOffset - resized_height) * this.curZoom)), (this.tileW * this.curZoom), (resized_height * this.curZoom));
          }
          this.context.restore();
        }
        if (this.mouse_used) {
          if (i == this.MouseTilePosX && j == this.MouseTilePosY) {
            --k;
            ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
            ctx.beginPath();
            ctx.moveTo(xpos, ypos + (k * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
            ctx.lineTo(xpos + (this.tileH * this.curZoom), ypos + (k * ((this.tileH - resized_height) * this.curZoom)));
            ctx.lineTo(xpos + (this.tileH * this.curZoom) * 2, ypos + (k * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
            ctx.lineTo(xpos + (this.tileH * this.curZoom), ypos + (k * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom));
            ctx.fill();
          }
        }
      }
    }
    if (this.objectShadows) {
      if(this.heightMap) {
        var nextStack = Math.round(Number(this.heightMap[i][j - 1]));
        var currStack = Math.floor(Number(this.heightMap[i][j]));
        if (currStack < nextStack) {
          var shadowXpos = (i - j) * (this.tileH * this.curZoom) + this.draw_x;
          var shadowYpos = (i + j) * (this.tileW / 4 * this.curZoom) + this.draw_y;
          ctx.fillStyle = 'rgba(50, 60, 60, 0.5)';
          ctx.beginPath();
          ctx.moveTo(shadowXpos, shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom), shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)));
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom) * 2, shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom), shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom));
          ctx.fill();
          ctx.fillStyle = 'rgba(50, 60, 60, 0.7)';
          ctx.beginPath();
          ctx.moveTo(shadowXpos + (this.tileH * this.curZoom), shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)));
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom), shadowYpos - (nextStack * ((this.tileH - this.shadowOffset) / ((this.tileH - this.shadowOffset) / this.shadowOffset)  * this.curZoom)));
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom) * 2, shadowYpos - (nextStack * (this.tileH - this.shadowOffset) / ((this.tileH - this.shadowOffset) / this.shadowOffset) * this.curZoom) + (this.tileH * this.curZoom) / 2);
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom) * 2, shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
          ctx.fill();
        }
      }
      else {
        var currStack = Math.floor(Number(this.map[i][j - 1]));
        if(currStack > 0) {
          var shadowXpos = (i - j) * (this.tileH * this.curZoom) + this.draw_x;
          var shadowYpos = (i + j) * (this.tileW / 4 * this.curZoom) + this.draw_y;
          ctx.fillStyle = 'rgba(50, 60, 60, 0.6)';
          ctx.beginPath();
          ctx.moveTo(shadowXpos, shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom), shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)));
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom) * 2, shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom) / 2);
          ctx.lineTo(shadowXpos + (this.tileH * this.curZoom), shadowYpos + (currStack * ((this.tileH - resized_height) * this.curZoom)) + (this.tileH * this.curZoom));
          ctx.fill();
        }
      }
    }
  };

  this.stack_tiles = function(settings) {
    this.stackTiles = true;
    this.heightMap = settings.map;
    this.heightOffset = settings.offset;
    this.heightMapOnTop = settings.heightMapOnTop || false;
  };

  this.getLayout = function() {
    return this.map;
  };

  this.getTile = function(posX, posY) {
    return this.map[posX][posY];
  };

  this.setZoom = function(dir) {
    if (Number(dir)) {
      this.curZoom = dir;
    }
    else if (dir == "in") {
      if (this.curZoom < 1) {
        this.curZoom += 0.1;
      }
    }else if (dir == "out") {
      if (this.curZoom > 0.2) {
        this.curZoom -= 0.1;
      }
    }
  };

  this.applyMouse = function(x, y) {
    var coords = {};
    this.mouse_used = 1;
    this.xMouse = x;
    this.yMouse = y;
    this.MouseTilePosY = (2 * (y - this.draw_y) - x + this.draw_x) / 2;
    this.MouseTilePosX = x + this.MouseTilePosY - this.draw_x - (this.tileH * this.curZoom);
    this.MouseTilePosY = Math.round(this.MouseTilePosY / (this.tileH * this.curZoom));
    this.MouseTilePosX = Math.round(this.MouseTilePosX / (this.tileH * this.curZoom));
    coords.x = this.MouseTilePosX;
    coords.y = this.MouseTilePosY;
    return(coords);
  };

  this.applyMouseClick = function(x, y) {
    this.heightMap[x][y] = Number(this.heightMap[x][y]) + 1;
  };

  this.align = function(position, screen_dimension, size, offset) {
    switch(position) {
      case "h-center":
        this.draw_x = ((screen_dimension / 2) - (this.tileW * (size-1) )/(this.tileH/4)* this.curZoom) - offset;
      break;
      case "v-center":
        this.draw_y = ((screen_dimension / 2) - (this.tileH * (size-1) * this.curZoom) / 2) - offset;
      break;
    }
  };

  this.hideGraphics = function(hide, settings) {
    this.tilesHide = hide;
    if (settings) {
      this.planeGraphic = settings.graphic;
      this.hideStart = settings.rangeStart;
      this.hideEnd = settings.rangeEnd;
    }
  };

  this.applyHeightShadow = function(shadow) {
    if (shadow) {
      this.objectShadows = true;
    }
    else{
      this.objectShadows = false;
    }
    if(shadow.offset) {
      this.shadowOffset = shadow.offset;
    }
  };

  this.rotate = function(setting) {
    var tempArray = [];
    var tempLine = [];
    var tempArrayTwo = [];
    var tempLineTwo = [];
    var i,j ;
    if (setting == "left") {
      for (i = 0; i < this.map.length; i++) {
        for (j = this.map[i].length - 1; j >= 0; j--) {
          tempLine.push(this.map[j][i]);
          if (this.stackTiles) {
            tempLineTwo.push(this.heightMap[j][i]);
          }
        }
        tempArray.push(tempLine);
        tempLine = [];
        if (this.stackTiles) {
          tempArrayTwo.push(tempLineTwo);
          tempLineTwo = [];
        }
      }
      if (this.stackTiles) {
        this.heightMap = tempArrayTwo;
      }
      this.map = tempArray;
    }
    else {
      for (i = this.map.length -1; i >= 0; i--) {
        for (j = 0; j < this.map.length; j++) {
          tempLine.push(this.map[j][i]);
          if (this.stackTiles) {
            tempLineTwo.push(this.heightMap[j][i]);
          }
        }
        tempArray.push(tempLine);
        tempLine = [];
        if (this.stackTiles) {
          tempArrayTwo.push(tempLineTwo);
          tempLineTwo = [];
        }
      }
      if (this.stackTiles) {
        this.heightMap = tempArrayTwo;
      }
      this.map = tempArray;
    }
  };
}