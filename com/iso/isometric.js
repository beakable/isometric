function Isometric(ctx,tile_width,tile_height,map_array,images,tile_dict){
	this.context = ctx;
	
	this.tileW = tile_width;
	this.tileH = tile_height;
	this.dict = tile_dict;
	this.map = map_array;
	this.tiles = images;
	this.zero_is_blank = 0;
	this.stack_numbers = 0;
	this.draw_x =0;
	this.draw_y =0;
	this.height_divider;
	this.height_map =[];
	this.curZoom =1;
	this.mouse_used = 0;
	this.xmouse = 0;
	this.ymouse = 0;

	this.applyIneractions = false;

	this.alpha_mouse_behind = 0;

	this.objectShadows = null;

	this.tilesHide = null; 

	this.planeGraphic = null;
	this.hideStart;
	this.hideEnd;
	
	this.draw = function(){
			for(i=0; i<this.map.length; i++){
					for(j=0; j<this.map[i].length; j++){
							var image_num = Number(this.map[i][j]);
							if( (!this.zero_is_blank) || (this.zero_is_blank && image_num) ){
								if(this.zero_is_blank){
									image_num--;	
								}
										var width_reduce = this.tiles[this.dict[image_num]].width / this.tileW;
										var resized_height = this.tiles[this.dict[image_num]].height/ width_reduce; 
										var xpos = (i-j)*(this.tileH*this.curZoom) + this.draw_x;
										var ypos = (i+j)*(this.tileW/4*this.curZoom)+ this.draw_y;
								if(!this.stack_numbers){
										this.context.drawImage(this.tiles[this.dict[image_num]],0,0,this.tiles[this.dict[image_num]].width,this.tiles[this.dict[image_num]].height,xpos,(ypos+((this.tileH-resized_height)*this.curZoom)),(this.tileW*this.curZoom),(resized_height*this.curZoom));
									}else{
									var stack = Math.round(Number(this.height_map[i][j])/this.height_divider);
									if(stack < 1){
										stack = 1;
									}
									for(k=1; k<=stack; k++){
										this.context.save();
										if(this.alpha_mouse_behind){
												if(i == this.xmouse+1 && j == this.ymouse+1){
													this.context.globalAlpha = 0.3;		
												}
										}
										if(!this.tilesHide){
											this.context.drawImage(this.tiles[this.dict[image_num]],0,0,this.tiles[this.dict[image_num]].width,this.tiles[this.dict[image_num]].height,xpos,ypos+(k*((this.tileH-resized_height)*this.curZoom)),(this.tileW*this.curZoom),(resized_height*this.curZoom));
										}else{
											if(image_num >= this.hideStart && image_num <= this.hideEnd){
												this.context.drawImage(this.tiles[this.planeGraphic],0,0,this.tiles[this.planeGraphic].width,this.tiles[this.planeGraphic].height,xpos,ypos+(k*((this.tileH-resized_height)*this.curZoom)),(this.tileW*this.curZoom),(resized_height*this.curZoom));
											}else{
												this.context.drawImage(this.tiles[this.dict[image_num]],0,0,this.tiles[this.dict[image_num]].width,this.tiles[this.dict[image_num]].height,xpos,ypos+(k*((this.tileH-resized_height)*this.curZoom)),(this.tileW*this.curZoom),(resized_height*this.curZoom));
											}
										}
										this.context.restore();
									}
									if(this.mouse_used){
										if(i == this.xmouse && j == this.ymouse){
												  --k;
												  ctx.fillStyle = 'rgba(255, 255, 120, 0.7)';
												  ctx.beginPath();
												  ctx.moveTo(xpos, ypos+(k*((this.tileH-resized_height)*this.curZoom))+(this.tileH*this.curZoom)/2);
												  ctx.lineTo(xpos+(this.tileH*this.curZoom), ypos+(k*((this.tileH-resized_height)*this.curZoom)));
												  ctx.lineTo(xpos+(this.tileH*this.curZoom)*2, ypos+(k*((this.tileH-resized_height)*this.curZoom))+(this.tileH*this.curZoom)/2);
												  ctx.lineTo(xpos+(this.tileH*this.curZoom), ypos+(k*((this.tileH-resized_height)*this.curZoom))+(this.tileH*this.curZoom));
												  ctx.fill();	
										}
									}
								}
					//---- end dont draw if zero -----
							}

								if(this.objectShadows){
										var neighStack = Math.round(Number(this.height_map[i][j-1])/this.height_divider);
										var currStack = Math.floor(Number(this.height_map[i][j])/this.height_divider);
										if(currStack < neighStack){
											var shadowXpos = (i-j)*(this.tileH*this.curZoom) + this.draw_x;
											var shadowYpos = (i+j)*(this.tileW/4*this.curZoom)+ this.draw_y;
												  ctx.fillStyle = 'rgba(50, 60, 60, 0.6)';
												  ctx.beginPath();
												  ctx.moveTo(shadowXpos, shadowYpos+(currStack*((this.tileH-resized_height)*this.curZoom))+(this.tileH*this.curZoom)/2);
												  ctx.lineTo(shadowXpos+(this.tileH*this.curZoom), shadowYpos+(currStack*((this.tileH-resized_height)*this.curZoom)));
												  ctx.lineTo(shadowXpos+(this.tileH*this.curZoom)*2, shadowYpos+(currStack*((this.tileH-resized_height)*this.curZoom))+(this.tileH*this.curZoom)/2);
												  ctx.lineTo(shadowXpos+(this.tileH*this.curZoom), shadowYpos+(currStack*((this.tileH-resized_height)*this.curZoom))+(this.tileH*this.curZoom));
												  ctx.fill();
										}
								}
				//---- end for loops -----
					}
			}
	}
	
	this.stack_tiles = function(map,divider){
		this.stack_numbers = 1;
		this.height_map = map;
		this.height_divider = divider;
		
	}

	this.getLayout = function() {
		return this.map;
	}

	this.getTile = function(posX,posY) {
		return this.map[posX][posY];
	}

	this.setZoom = function(dir){
		if(Number(dir)){
			this.curZoom = dir;	
		}
		else if(dir == "in"){
			if(this.curZoom < 3){
				this.curZoom += 0.1;
			}
		}else if(dir == "out"){
			if(this.curZoom > 0.3){
				this.curZoom -= 0.1;
			}
		}	
	}
	
	this.applyMouse = function(x,y){
		var coords = {}
		this.mouse_used = 1;
		this.ymouse=(2*(y-this.draw_y)-x+this.draw_x)/2;
		this.xmouse=x+this.ymouse-this.draw_x-(this.tileH*this.curZoom)
 		this.ymouse=Math.round(this.ymouse/(this.tileH*this.curZoom));
		this.xmouse=Math.round(this.xmouse/(this.tileH*this.curZoom));
		coords.x = this.xmouse;
		coords.y = this.ymouse;
		return(coords);
	}
	
	this.align = function(position,screen_dimension){
		switch(position){
			case "h-center":
					this.draw_x = (screen_dimension/2)
			break;	
			case "v-center":
					this.draw_y = (screen_dimension/2)-(this.tileH*this.map.length*this.curZoom)/2
			break;	
		}
	}
	
	this.hideGraphics = function(hide, settings){
		this.tilesHide = hide;
		if(settings){
			this.planeGraphic = settings.graphic;
			this.hideStart = settings.rangeStart;
			this.hideEnd = settings.rangeEnd;
		}
	}

	this.applyObjectShadow = function(shadow){
		if (shadow){
			this.objectShadows = true;
		}
    else{
			this.objectShadows = false;
		}
	}
	
	this.rotate = function(setting){
		if(setting == "left"){
			var tempArray = [];
			var tempLine = [];
			var tempArrayTwo = [];
			var tempLineTwo = [];
			for(i=this.map.length-1; i>=0; i--){
					for(j=this.map[i].length-1; j>= 0; j--){
						tempLine.push(this.map[i][j]);
						if(this.stack_numbers){
							tempLineTwo.push(this.height_map[i][j]);	
						}
					}
					tempArray.push(tempLine);
					tempLine = [];
					if(this.stack_numbers){
							tempArrayTwo.push(tempLineTwo);	
							tempLineTwo = [];
					}
			}
			if(this.stack_numbers){
				this.height_map = tempArrayTwo;
			}
			this.map = tempArray;	
		}else{

		}
	}

		
}