//Author: Pallavi Mane
//Date: 03/19/2014
(function () {
    'use strict';
    beaker.bkoDirective("flot2_sinewave", function () {
 return {
	template: '<div id="container" style="width:600px;height:500px;margin:8px auto"></div>',
/*<div class="controls">'
            + '<h3>Function:</h3> <p>'
            +   '<input type="radio" name="func" value="1" onclick="toggleFunc(1)" checked> sin'
            +   '<input type="radio" name="func" value="2" onclick="toggleFunc(2)"> sin(1/x)</p>'
            + '<h3>Visual mode:</h3><p>'
            + '<input type="radio" name="mode" value="1" onclick="toggleMode(1)" checked> #1'
            + '<input type="radio" name="mode" value="2" onclick="toggleMode(2)"> #2'
            + '<input type="radio" name="mode" value="3" onclick="toggleMode(3)"> #3'
	    + '</p></div>',*/
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

		 var jsObj = scope.model.getCellModel();
		 var dataArr = getColumnValues(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
		 var smallest = dataArr[0][1];
		 var largest = dataArr[0][1];
		 var count = 0;
		 
		 for(var k = 0; k < dataArr.length; k++) {
		    var value = dataArr[k][1];
		    count = count + 1;
		    if(value < smallest) {
			smallest = value;
		    }
		    if(value > largest) {
			largest = value;
		    }	
		 }
		

		var container = document.getElementById('container');
		var start = (new Date).getTime();
		var data, graph, offset, i, data2;
	
		var mode = 1;
		var fmode = 1; // 1- basic sin, 2 - sin(1/x)


		// Draw a sine curve at time t
		function animateSine (t) {
		    data = [];
		    data2 = [];

		    // little offset between steps
		    offset = 2 * Math.PI * (t - start) / 10000;

		    if (fmode == 2 && offset > 15) {
			start = t;
		    }

		    for (i = 0; i < 4 * Math.PI; i += 0.2) {
			if (fmode == 1) {
			    data.push([i, Math.sin(i - offset)]);
			    data2.push([i, Math.sin(i*2 - offset)]);
			} else if (fmode == 2) {
			    data.push([i, Math.sin(1/(i-offset))]);
			    // data2.push([i, Math.sin(1/(i*2-offset))]);
			}
		    }

		    // prepare properties
		    var properties;
		    switch (mode) {
			case 1:
			    properties = {
				yaxis : {
				    max : 2,
				    min : -2
				}
			    };
			    break;
			case 2:
			    properties = {
				yaxis : {
				    max : 2,
				    min : -2
				},
				bars: {
				    show: true,
				    horizontal: false,
				    shadowSize: 0,
				    barWidth: 0.5
				}
			    };
			    break;
			case 3:
			    properties = {
				yaxis : {
				    max : 2,
				    min : -2
				},
				radar: {
				    show: true
				},
				grid: {
				    circular: true,
				    minorHorizontalLines: true
				}
			    };
			    break;
			case 4:
			    properties = {
				yaxis : {
				    max : 2,
				    min : -2
				},
				bubbles: {
				    show: true,
				    baseRadius: 5
				},
			    };
			    break;
		    }

		    // draw graph
		    if (fmode == 1) {
			graph = Flotr.draw(container, [ data, data2 ], properties);
		    } else if (fmode == 2) {
			graph = Flotr.draw(container, [ data ], properties);
		    }

		    // main loop
		    setTimeout(function () {
			animateSine((new Date).getTime());
		    }, 50);
		}
      	animateSine(start);
       }
     };
    });
})();
