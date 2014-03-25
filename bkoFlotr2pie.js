(function () {
    'use strict';
    beaker.bkoDirective("pie43", function () {
 return {
	template: '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>',
	link: function (scope, element, attrs) {
	
	function getColumnValues(obj, col, row){
		        var arr = new Array();
		        for(var i = 0; i < row; i++) {
		          arr[i] = new Array();
		          for(var j = 1; j < col; j++) {
		            var out=jsObj.values[i][j+1].trim();
		            if(j==1) {
				 out=parseInt(out);
		            	 arr[i][j] = out;
			    }
		          }
		        }
		        return arr;
         }
	 function getColumnList(obj, col, row){
		        var arr = new Array();
		        for(var i = 0; i < row; i++) {
		          arr[i] = new Array();
		          for(var j = 1; j < col; j++) {
			    var out = jsObj.values[i][j].trim();
			    if(j==1) {
		                arr[i][j] = out;
			    }
		          }
		        }
		        return arr;
          }


        var jsObj = scope.model.getCellModel();
        var dataArr = getColumnValues(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
	var columnList = getColumnList(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
	//console.log(dataArr);
	//console.log(columnList);

	
	/*console.log(columnList[0,0]);
	console.log(columnList[1,1]);
	console.log(columnList[2,2]);
	console.log(columnList[3,3]);
	console.log(columnList[4,4]);*/
	
	var container = document.getElementById("container");
	var
	d1 = dataArr[0][1],
    	d2 = dataArr[1][1],
    	d3 = dataArr[2][1],
    	d4 = dataArr[3][1],
	d5 = dataArr[4][1],
	l1 = columnList[0][1],
	l2 = columnList[1][1],
	l3 = columnList[2][1],
	l4 = columnList[3][1],
	l5 = columnList[4][1],
	k1 = [[0, d1]],
	k2 = [[0, d2]],
	k3 = [[0, d3]],
	k4 = [[0, d4]],
	k5 = [[0, d5]],
    	graph;	
	graph = Flotr.draw(container, [
    { data : k1, label : l1 },
    { data : k2, label : l2 },
    { data : k3, label : l3,
      pie : {
        explode : 50
      }
    },
    { data : k4, label : l4 },
    { data : k5, label : l5 }

  ], {
    HtmlText : false,
    grid : {
      verticalLines : false,
      horizontalLines : false
    },
    xaxis : { showLabels : false },
    yaxis : { showLabels : false },
    pie : {
      show : true, 
      explode : 6
    },
    mouse : { track : true },
    legend : {
      position : 'se',
      backgroundColor : '#D2E8FF'
    }
  });

	
      }
     };
    });
})();
