//Author: Pallavi Mane
//Date: 04/08/2014
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Bubble", function () {
 return {
	//template:'<div id="container" style="width:1000px;height:500px;margin:8px auto"></div>',
	template: '<div>'
            + '<b>Title</b> <input type="text" id="title" size="15"><br>'
            + '<b>X Axis</b>'
            + '<select id=selectX>'
            + '</select><br>'
            + '<b>Y Axis</b>'
            + '<select id=selectY>'
            + '</select><br>'
	    + '<b>Z Axis</b>'
            + '<select id=selectZ>'
            + '</select><br>'
            + '<b>X Range</b>     Min: <input type="text" id="xmin" size="4">     Max: <input type="text" id="xmax" size="4"> Interval: <input type="text" id="xinterval" size="4"><br>'
            + '<b>Y Range</b>     Min: <input type="text" id="ymin" size="4">     Max: <input type="text" id="ymax" size="4"> Interval: <input type="text" id="yinterval" size="4"><br>'
            + 'Set X and Y ranges automatically <input type="checkbox" id="autoRange"><br>'
            + '<input type="button" ng-click="getOutputDisplay()" value="Run">'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>'
            + '</div>',
	link: function (scope, element, attrs) {

	var
    	container = document.getElementById('container'),
    	graph,
    	jsObj = scope.model.getCellModel(),
    	colNames = jsObj.columnNames,
    	numCol = colNames.length,
    	records = jsObj.values,
    	numRecords = records.length,
    	isNumCol = checkNumCol();

	colNames[0] = "--Select--";

	function checkNumCol() {
	  var boolArr = [true], col, row;
	  for(col = 1; col < numCol; col++) {
	    for(row = 0; row < numRecords; row++) {
	      if(!isNumber(records[row][col])) {
		boolArr.push(false);
		break;
	      }
	    }
	    if(row==numRecords)
	      boolArr.push(true);
	  }
	  //console.log(boolArr);
	  return boolArr;
	}		

	fillDropdown("selectX");
	fillDropdown("selectY");
	fillDropdown("selectZ");

	function fillDropdown(id) {
	  var 
	    element = document.getElementById(id),
	    html = '',
	    i;
	    for(i = 0; i < numCol; i++) {
	      if(isNumCol[i]){
		html = html + '<option value="' + i + '">' + colNames[i] + '</option>';
	      }
	    }
	    element.innerHTML = html;
	}

	scope.getOutputDisplay=function(){
	  var 
	    graphTitle = document.getElementById("title").value,
	    xaxis = document.getElementById("selectX"),
	    yaxis = document.getElementById("selectY"),
	    zaxis = document.getElementById("selectZ"),
	    colXIndex = parseInt(xaxis.options[xaxis.selectedIndex].value),
	    colYIndex = parseInt(yaxis.options[yaxis.selectedIndex].value),
	    colZIndex = parseInt(zaxis.options[zaxis.selectedIndex].value),
	    data = dataToChart(colXIndex, colYIndex, colZIndex),
	    autoRange = document.getElementById("autoRange").checked,
	    xvals, 
	    yvals; 
	    var largestX, largestY,smallestX,smallestY;

		if(autoRange) {
		var xArr = [], yArr = [];
			for(var row = 0; row < numRecords; row++) {
			     xArr.push(records[row][colXIndex]);
			}
			for(var row = 0; row < numRecords; row++) {
			     yArr.push(records[row][colYIndex]);
			}
			 smallestX = Math.min.apply(null, xArr),
	    		 largestX = Math.max.apply(null, xArr);
			 smallestY = Math.min.apply(null, yArr),
	    		 largestY = Math.max.apply(null, yArr);
			//  xvals = [null, null, 5];
			 // yvals = xvals;
				graph = Flotr.draw(container, [data], {
				    title: graphTitle,
				    bubbles : { show : true, baseRadius : 3 },
				    xaxis   : {title: colNames[colXIndex], min: smallestX - largestX, max: (2*largestX), noTicks: numRecords},
				    yaxis   : {title: colNames[colYIndex], min: smallestY - largestY, max: (2*largestY), noTicks: numRecords},
				    mouse: {
		      			track: true
		    			}
				});
		}
		else {
		  xvals = checkRangeInput("X Range", document.getElementById("xmin").value, document.getElementById("xmax").value, document.getElementById("xinterval").value); 
		  yvals = checkRangeInput("Y Range", document.getElementById("ymin").value, document.getElementById("ymax").value, document.getElementById("yinterval").value); 

			graph = Flotr.draw(container, [data], {
				    title: graphTitle,
				    bubbles : { show : true, baseRadius : 3 },
				    xaxis   : {title: colNames[colXIndex], min: xvals[0], max: xvals[1], noTicks: xvals[2]},
				    yaxis   : {title: colNames[colYIndex], min: yvals[0], max: yvals[1], noTicks: yvals[2]},
				    mouse: {
		      			track: true
		    			}
				});
		     }

		}


	function checkRangeInput(range, min, max, interval) {
	  //console.log(range + " " +  min + " " + max + " " + interval );
	  if(!isNumber(min) || !isNumber(max) || !isNumber(interval) ) 
	    abortJS(range + " Error: Please enter numeric min, max and interval.");

	  min = parseFloat(min);
	  max = parseFloat(max);
	  interval = parseFloat(interval);
	  if(min > max) 
	    abortJS(range + " Error: max is smaller than min.");
	  
	  if(interval <= 0) 
	    abortJS(range + " Error: interval cannot be smaller or equals to zero.");
	  
	  var ticks = Math.ceil(Math.abs(max - min) / interval);
	  return [min, max, ticks];
	}


	function abortJS(err) {
	  alert(err);
	  throw new Error(err);
	}

	function dataToChart(x, y, z) {
	  var
	    data = [],
	    point,
	    row;

	  for(row = 0; row < numRecords; row++) {
		point = [records[row][x], records[row][y], (records[row][z])/2];

	    data.push(point);
	  }
	  console.log(data);
	  return data;
	}

	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	}
     };
    });
})();
