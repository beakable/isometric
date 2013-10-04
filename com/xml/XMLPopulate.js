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
	

}


