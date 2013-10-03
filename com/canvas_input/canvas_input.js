// Canvas inputs

function canvas_input(document){
	var self = this;
	self.doc = document;
	
	self.keyboard_input = function (e,callback){
			var keyCode; 
					  if(e == null)
					  {
						keyCode = window.e.keyCode; 
					  }
					  else 
					  {
						keyCode = e.keyCode; 
					  }
		   callback(keyCode);
	}

	self.mobile_input = function(e,callback){
		var coords ={};
		coords.x =  e.touches[0].pageX-canvas.offsetLeft;
		coords.y =  e.touches[0].pageY-canvas.offsetTop;
		callback(coords);	
	}

	self.mouse_input = function(e,callback){
		var coords ={};
		coords.x =  e.pageX-canvas.offsetLeft;
		coords.y =  e.pageY-canvas.offsetTop;
		callback(coords);	
	}
	
	self.keyboard = function(callback){
			self.doc.onkeydown = function(event){self.keyboard_input(event,callback)}
	}
	self.mobile = function(callback){
			self.doc.addEventListener('touchstart', function(event){self.mobile_input(event,callback)}, false);
	}
	self.mouse_action = function(callback){
			self.doc.addEventListener('mousedown', function(event){self.mouse_input(event,callback)}, false);
	}
	self.mouse_move = function(callback){
			self.doc.addEventListener('mousemove', function(event){self.mouse_input(event,callback)}, false);
	}
}