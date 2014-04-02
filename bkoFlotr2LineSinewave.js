//Author: Pallavi Mane
//Date: 03/22/2014
(function () {
    'use strict';
    beaker.bkoDirective("flotr2_linesinewave", function () {
 return {
	template: '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>',
	link: function (scope, element, attrs) {
	
	function getColumnValues(obj, col, row){
		        var arr = new Array();
		        for(var i = 0; i < row; i++) {
		          arr[i] = new Array();
		          for(var j = 0; j < col; j++) {
		            var out=jsObj.values[i][j+1].trim();
		            if(j==1) out=parseInt(out);
		            arr[i][j] = out;
		          }
		        }
		        return arr;
         }
	 function getColumnList(obj, col, row){
		        var arr = new Array();
		        for(var i = 0; i < row; i++) {
		          arr[i] = new Array();
		          for(var j = 0; j < col; j++) {
			    var out = jsObj.values[i][j].trim();
		            arr[i][j] = out;
		          }
		        }
		        return arr;
          }


        var jsObj = scope.model.getCellModel();
        var dataArr = getColumnValues(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
	var columnList = getColumnList(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
	console.log(dataArr);

	var container = document.getElementById("container");
	var d2= [];
	
	var options = {
	      xaxis: {
		minorTickFreq: 4
	      }, 
	      grid: {
		minorVerticalLines: true
	      }
	 };

	var i, graph;

	for (i = 0; i < 14; i += 0.5) {
	    d2.push([i, Math.sin(i)]);
	  }

	  // Draw the graph:
	  graph = Flotr.draw(
	    container,  // Container element
	    [ dataArr, d2 ], // Array of data series
	    options     // Configuration options
	  );
      }
     };
    });
})();
