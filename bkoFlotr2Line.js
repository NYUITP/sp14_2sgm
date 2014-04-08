//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2_line", function () {
      return {
            template: '<div>'
            + '<b>Title&nbsp;</b> <input type="text" ng-model="title"  size="30" placeholder="Add graph title here"></br>'
            + '<b>X Axis&nbsp;</b><select ng-model="xaxis" ng-options="colOption.colName for colOption in colOptions"><option value="">-- choose x-axis --</option></select>' 
            + '<b>Y Axis&nbsp;</b><select ng-model="yaxis" ng-options="colOption.colName for colOption in colOptions"><option value="">-- choose y-axis --</option></select>' 
            + '<input type="button" value="Add Line" ng-click="addLine()"></br>'
            + '<b>Line Groups [x,y]:</b></br>'
            + '<ul>'
            +   '<li ng-repeat="line in lineGroup">'
            +      '<input type="button" value="Remove" ng-click="removeLine(line.x, line.y)">'
            +     '&nbsp;&nbsp;[{{line.x.colName}}&nbsp;,&nbsp;{{line.y.colName}}]'
            +   '</li>'
            + '</ul>'
            + '<b>X Range</b>     Min: <input type="text" ng-model="xmin" size="4">     Max: <input type="text" ng-model="xmax" size="4"> Interval: <input type="text" ng-model="xinterval" size="4"><br>'
            + '<b>Y Range</b>     Min: <input type="text" ng-model="ymin" size="4">     Max: <input type="text" ng-model="ymax" size="4"> Interval: <input type="text" ng-model="yinterval" size="4"><br>'
            + 'Set X and Y ranges automatically <input type="checkbox" ng-model="autoRange"><br>'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>'
            + '<input type="button" ng-click="getOutputDisplay()" value="Run">'
            + '</div>',
controller: function($scope) {



var
    container = document.getElementById('container'),
    graph,
    jsObj = $scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length; //test which columns are numerical (numerical: true)

$scope.colOptions = [];
checkNumCol();

function checkNumCol() {
  var col, row;
  for(col = 0; col < numCol; col++) {
    for(row = 0; row < numRecords; row++) {
      if(!isNumber(records[row][col])) {
        break;
      }
    }
    if(row==numRecords)
      $scope.colOptions.push({colIndex:col, colName:colNames[col]});
  }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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

function getData(x, y) {
  var
    data = [],
    row;

  for(row = 0; row < numRecords; row++) {
    data.push([records[row][x], records[row][y]]);
  }
  //console.log(data);
  return data;
}




$scope.lineGroup=[];
$scope.addLine = function(){
  if($scope.xaxis!=undefined && $scope.yaxis!=undefined) {
    $scope.lineGroup.push({x:$scope.xaxis, y:$scope.yaxis});
  }
}

$scope.removeLine = function(rx, ry) {
  var i;
  for(i = 0; i < $scope.lineGroup.length; i++) {
    if($scope.lineGroup[i].x==rx && $scope.lineGroup[i].y==ry){
      $scope.lineGroup.splice(i, 1);
      break;
    }
  }
}




        }
      };
    });
})();