// JavaScript Document


function image_loader(){
	var self = this;
	self.to_load = 0;
	self.loaded = 0;
	
	this.load_array = function(path,dict){
			self.to_load += dict.length;
			var images = Array();
				for(var i=0;i<dict.length;i++){
					images[dict[i]] = new Image(); 
					images[dict[i]].src = path + dict[i];
						images[dict[i]].onload = function(){
							self.loaded++;	
						}
				}
			return images;
	}
	

	
}