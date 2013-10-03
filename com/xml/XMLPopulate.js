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


