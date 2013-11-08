/*  Copyright 2013 Iain Hamitlon & Edward Smyth

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

function XMLPopulate() {
	var xmlDoc;	

	this.loadXML = function (fileName) {
        xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",fileName,false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;

    };
	
	this.getContent = function(name,container){
		var tempArray = Array();
		var generatedArray = Array();
		var row;
		var toGet = xmlDoc.getElementsByTagName(name)[0];
		for(var i=0;i<toGet.getElementsByTagName(container).length;i++){
			 var rowSplit = toGet.getElementsByTagName(container)[i].childNodes[0].nodeValue;
			 rowSplit = rowSplit.split(",");
				for(var j=0;j<rowSplit.length;j++){
					tempArray.push(rowSplit[j]);
				}		
				generatedArray.push(tempArray);
				tempArray =[];
		}
		return generatedArray;
	};
	
	this.getAttribute = function(name,attribute,node){
		if(!node){node =0;}
		var toGet = xmlDoc.getElementsByTagName(name)[node];
		attribute = toGet.attributes.getNamedItem(attribute).value;
		return attribute;
	};
	
	this.length = function(name){
		return xmlDoc.getElementsByTagName(name).length;
	}

  this.saveMap = function (id, groundTiles, heightTiles, objectTiles) {
    var groundMap ="";
    for(var i =0;i<groundTiles.length;i++){
      groundMap += "<row>";
			for(var j=0;j<groundTiles[i].length;j++){
				groundMap += groundTiles[i][j];
				if(j!= groundTiles[i].length-1){
          groundMap += ",";
        }
			}
			groundMap += "</row>";
		}

    var heightMap ="";
    for(var i =0;i<heightTiles.length;i++){
      heightMap += "<row>";
      for(var j=0;j<heightTiles[i].length;j++){
        heightMap += heightTiles[i][j];
        if(j!= heightTiles[i].length-1){
          heightMap += ",";
        }
      }
      heightMap += "</row>";
    }

    var objectMap ="";
    for(var i =0;i<objectTiles.length;i++){
      objectMap += "<row>";
      for(var j=0;j<objectTiles[i].length;j++){
        objectMap += objectTiles[i][j];
        if(j!= objectTiles[i].length-1){
          objectMap += ",";
        }
      }
      objectMap += "</row>";
    }


    xmlhttp=new XMLHttpRequest();
    data = "id=" + id + "&groundMap=" + groundMap + "&heightMap=" + heightMap + "&objectMap=" + objectMap;

    xmlhttp.open("POST","map-save.php",true);
    xmlhttp.setRequestHeader("Connection", "close");
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        alert("Map Saved");
      }
    };
    xmlhttp.send(data);
  };

}


