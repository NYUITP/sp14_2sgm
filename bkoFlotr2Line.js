//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2_line", function () {
      return {
            template: '<div>'
            + '<b>X Axis\t</b>'
            + '<select id=selectX>'
            + '</select></br>'
            + '<b>Y Axis\t</b>'
            + '<select id=selectY>'
            + '</select></br>'
            //+ '<b>X range</b>     Min: <input type="text" id="xmin">     Max: <input type="text" id="ymin"> '
            //+ 
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
    isNumCol = checkNumCol(); //test which columns are numerical (numerical: true)

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
  console.log(boolArr);
  return boolArr;
}

fillDropdown("selectX");
fillDropdown("selectY");

function fillDropdown(id) {
  var 
    element = document.getElementById(id),
    html = '<option value="0">Index</option>',
    i;
    for(i = 1; i < numCol; i++) {
      if(isNumCol[i]){
        html = html + '<option value="' + i + '">' + colNames[i] + '</option>';
      }
    }
    element.innerHTML = html;
    console.log(html);
}


//data = [[0, 3], [4, 8], [8, 5], [9, 13]]
// Draw Graph
scope.getOutputDisplay=function(){
  var 
    xaxis = document.getElementById("selectX"),
    yaxis = document.getElementById("selectY"),
    colXIndex = parseInt(xaxis.options[xaxis.selectedIndex].value),
    colYIndex = parseInt(yaxis.options[yaxis.selectedIndex].value),
    data = getData(colXIndex, colYIndex); // First data series

  graph = Flotr.draw(container, [ data ], {
    xaxis: {
      minorTickFreq: 4
    }, 
    grid: {
      minorVerticalLines: true
    }
  });
}

function getData(x, y) {
  var
    data = [],
    row;

  for(row = 0; row < numRecords; row++) {
    data.push([records[row][x], records[row][y]]);
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
