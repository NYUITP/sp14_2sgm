//Author: Pallavi Mane
//Date: 03/19/2014
(function () {
    'use strict';
    beaker.bkoDirective("BasicBubble", function () {
 return {
	template:'<div id="container" style="width:1000px;height:500px;margin:8px auto"></div>',
	link: function (scope, element, attrs) {

		var arrCol1 = new Array();
		var arrCol2 = new Array();
		var arrCol3 = new Array();
		function getColumnValues(obj, col, row){
				var k = 1;
				for(var i = 0; i < row; i++) {
					arrCol1[i] = new Array();
					arrCol2[i] = new Array();
					arrCol3[i] = new Array();
				  for(var j = 1; j <= col; j++) {
				    var out=jsObj.values[i][j].trim();
				    if(j==1) 
				    {
					out=parseInt(out)
				    	arrCol1[i][k] = out;
			
				    }

				    if(j==2) 
				    {
					out=parseInt(out)
				    	arrCol2[i][k] = out;
			
				    }

				    if(j==3) 
				    {
					out=parseInt(out)
				    	arrCol3[i][k] = out;
			
				    }
					
				  }
				}
		 }

		 var jsObj = scope.model.getCellModel();
		 getColumnValues(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
		var xcount = 0;
		var ycount = 0;
		var smallestX = arrCol1[0][1];
		var largestX = arrCol1[0][1];
		var smallestY = arrCol2[0][1];
		var largestY = arrCol2[0][1];

		for(var k = 0; k < arrCol1.length; k++) {
		    var value = arrCol1[k][1];
		    xcount = xcount + 1;
		    if(value < smallestX) {
			smallestX = value;
		    }
		    if(value > largestX) {
			largestX = value;
		    }	
		 }
	
		for(var k = 0; k < arrCol2.length; k++) {
		    var value = arrCol2[k][1];
		    ycount = ycount + 1;
		    if(value < smallestY) {
			smallestY = value;
		    }
		    if(value > largestY) {
			largestY = value;
		    }	
		 }

		var container = document.getElementById('container');
		var d1 = [],d2 = [],point, graph, i;
		  for (i = 0; i < xcount; i++){
			point = [arrCol1[i][1],arrCol2[i][1],(arrCol3[i][1])/2];
			d1.push(point);
		  }
		  // Draw the graph
		  graph = Flotr.draw(container, [d1], {
		    bubbles : { show : true, baseRadius : 5 },
		    xaxis   : {min: smallestX - largestX, max: largestX + (largestX-smallestX), count: xcount},
		    yaxis   : {min: smallestY - largestY, max: largestY + (largestY-smallestY), count: ycount}
		});ss
	}
     };
    });
})();
