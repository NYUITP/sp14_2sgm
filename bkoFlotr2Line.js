//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2_line", function () {
      return {
            template: '<div>'
            + '<b>Title</b> <input type="text" id="title" size="15"><br>'
            + '<b>X Axis</b>'
            + '<select id=selectX>'
            + '</select><br>'
            + '<b>Y Axis</b>'
            + '<select id=selectY>'
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
    isNumCol = checkNumCol(); //test which columns are numerical (numerical: true)

colNames[0] = "Index";
console.log(colNames);

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
    //console.log(html);
}


//data = [[0, 3], [4, 8], [8, 5], [9, 13]]
// Draw Graph
scope.getOutputDisplay=function(){
  var 
    graphTitle = document.getElementById("title").value,
    xaxis = document.getElementById("selectX"),
    yaxis = document.getElementById("selectY"),
    colXIndex = parseInt(xaxis.options[xaxis.selectedIndex].value),
    colYIndex = parseInt(yaxis.options[yaxis.selectedIndex].value),
    data = getData(colXIndex, colYIndex); // First data series

  graph = Flotr.draw(container, [ data ], {
    title: graphTitle,
    xaxis: {
      title: colNames[colXIndex]
    }, 
    yaxis: {
      title: colNames[colYIndex]
    },
    grid: {
      
    },
    mouse: {
      track: true
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
