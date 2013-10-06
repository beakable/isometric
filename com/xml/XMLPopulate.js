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


