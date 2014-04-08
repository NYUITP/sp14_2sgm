//Author: Priyanka Inani
//two pie chart

(function () {
    'use strict';
    beaker.bkoDirective("flotr2_pie", function () {
 return {
	template: '<div>'
            + '<b>Title1</b> <input type="text" id="title" size="15"><br>'
            + '<b>Value1</b>'
            + '<select id=selectvalue>'
            + '</select><br>'
            + '<b>Label1</b>'
            + '<select id=selectlabel>'
            + '</select><br>'
	    + '<b>Title2</b> <input type="text" id="title2" size="15"><br>'
            + '<b>Value2</b>'
            + '<select id=selectvalue2>'
            + '</select><br>'
            + '<b>Label2</b>'
            + '<select id=selectlabel2>'
            + '</select><br>'
            + '<input type="button" ng-click="getOutputDisplay()" value="Run">'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>'
	    + '<div id="container2" style="width:600px;height:384px;margin:8px auto"></div>'
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
    		isNumCol = checkNumCol(); //test which columns are numerical (numerical: true)

		//colNames[0] = "Index";	

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
  		
  		return boolArr;
		}

		fillDropdown("selectvalue");
		fillDropdownLabel("selectlabel");
		fillDropdown("selectvalue2");
		fillDropdownLabel("selectlabel2");

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

		function fillDropdownLabel(id) {
  		var 
    		element = document.getElementById(id),
    		html = '',
    		i;
    		for(i = 0; i < numCol; i++) {
        		html = html + '<option value="' + i + '">' + colNames[i] + '</option>';
    		}
    		element.innerHTML = html;
		}	
		
		scope.getOutputDisplay=function(){
  var 
    graphTitle = document.getElementById("title").value,
    value = document.getElementById("selectvalue"),
    label = document.getElementById("selectlabel"),
    colXIndex = parseInt(value.options[value.selectedIndex].value),
    colYIndex = parseInt(label.options[label.selectedIndex].value),
    data = getData(colXIndex, colYIndex);

  
var 
    graphTitle2 = document.getElementById("title2").value,
    value2 = document.getElementById("selectvalue2"),
    label2 = document.getElementById("selectlabel2"),
    colXIndex2 = parseInt(value2.options[value2.selectedIndex].value),
    colYIndex2 = parseInt(label2.options[label2.selectedIndex].value),
    data2 = getData(colXIndex2, colYIndex2);
  
graph = Flotr.draw(container, data,{
		title: graphTitle,
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

	graph = Flotr.draw(container2, data2,{
		title: graphTitle2,
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

function getData(x, y) {
  var
    data = [],
    row;

  for(row = 0; row < numRecords; row++) {
    data.push({data:[[0,parseInt(records[row][x])]], label:records[row][y]});
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
