//Author: Pallavi Mane
//Date: 03/25/2014
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Bubble", function () {
 return {
	template: '<div>'
            +   '<div style="float:left;width:20%;display:inline-block"><h4>X-Axis</h4><input type="radio" id ="r1" name="col" value="col1" checked="checked">Column 1<tab></tab><input type="radio" id ="r2" name="col"'
            +   'value="col2">Column 2<input type="radio" id ="r3" name="col" value="col3">Column 3</div>'
            +   '<div style="margin-left:20%;display:inline-block;"><h4>Y-Axis</h4><input type="radio" id ="r4" name="cols" value="col1">Column 1<input type="radio" id ="r5" name="cols"'
	    +   'value="col2"checked="checked">Column 2<tab></tab><input type="radio" id ="r6" name="cols" value="col3">Column 3</div>'
            + '</br></br>'
	    + '<input type="button" ng-click="GetOutputDisplay()" value="Submit">'
            + '<div id="container" style="width:1000px;height:500px;margin:8px auto"></div>'
            + '</div>',
	link: function (scope, element, attrs) {
		var x = 1;
		var y = 2;
		loadChart();
		if((scope.model.getCellModel().columnNames.length -1) != 3) { alert('For Bubble Chart, # of Columns required is 3!') }
		scope.GetOutputDisplay=function(){
			if(document.getElementById('r1').checked) {x=1;}
			else if(document.getElementById('r2').checked) {x=2;}
			else if(document.getElementById('r3').checked) {x=3;}
				
			if(document.getElementById('r4').checked) {y=1;}
			else if(document.getElementById('r5').checked) {y=2;}
			else if(document.getElementById('r6').checked) {y=3;}

			if((x==1) && (y==1)) { alert('Invalid Selection');}
			else if((x==2) && (y==2)) { alert('Invalid Selection');}
			else if((x==3) && (y==3)) { alert('Invalid Selection');}
			
			loadChart();
		}

		function loadChart() {
	
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
		var arr1, arr2, arr3;
		if((x==1) && (y==2)) { arr1 = arrCol1.slice(); arr2 = arrCol2.slice(); arr3 = arrCol3.slice(); }
      		else if((x==1) && (y==3)) { arr1 = arrCol1.slice(); arr2 = arrCol3.slice(); arr3 = arrCol2.slice(); }			 
      		else if((x==2) && (y==1)) { arr1 = arrCol2.slice(); arr2 = arrCol1.slice(); arr3 = arrCol3.slice(); }	
      		else if((x==2) && (y==3)) { arr1 = arrCol2.slice(); arr2 = arrCol3.slice(); arr3 = arrCol1.slice(); }
      		else if((x==3) && (y==1)) { arr1 = arrCol3.slice(); arr2 = arrCol1.slice(); arr3 = arrCol2.slice(); }	
      		else if((x==3) && (y==2)) { arr1 = arrCol3.slice(); arr2 = arrCol2.slice(); arr3 = arrCol1.slice(); }	

		var xcount = 0;
		var ycount = 0;
		var smallestX = arr1[0][1];
		var largestX = arr1[0][1];
		var smallestY = arr2[0][1];
		var largestY = arr2[0][1];

		for(var k = 0; k < arr1.length; k++) {
		    var value = arr1[k][1];
		    xcount = xcount + 1;
		    if(value < smallestX) {
			smallestX = value;
		    }
		    if(value > largestX) {
			largestX = value;
		    }	
		 }
	
		for(var k = 0; k < arr2.length; k++) {
		    var value = arr2[k][1];
		    ycount = ycount + 1;
		    if(value < smallestY) {
			smallestY = value;
		    }
		    if(value > largestY) {
			largestY = value;
		    }	
		 }

		var container = document.getElementById('container');
		var d1 = [], point, graph, i;
		  for (i = 0; i < xcount; i++){
			point = [arr1[i][1],arr2[i][1],(arr3[i][1])/2];
			d1.push(point);
		  }

		  // Draw the graph
		  graph = Flotr.draw(container, [d1], {
		    bubbles : { show : true, baseRadius : 5, fillColor: '#333'},
		    xaxis   : {min: smallestX - largestX, max: (2*largestX), count: xcount},
		    yaxis   : {min: smallestY - largestY, max: (2*largestY), count: ycount}
		});
	 }
	}
};
});
})();
