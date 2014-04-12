//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Line", function () {
      return {
            template: 
               '<button class="btn btn-primary" ng-click="toggleConf()">&nbsp; {{hideOrShow}} &nbsp;<i class="icon-cog"></i></button>'
            + '<div id="configuration" style={{displayConf}}>'
            + '<b>Title&nbsp;</b> <input type="text" ng-model="title"  size="30" placeholder="Add graph title here"></br>'
            + '<b>X Axis&nbsp;</b><select ng-model="xaxis" ng-options="colOption.colName for colOption in colOptions"><option value="">-- choose x-axis --</option></select></br>' 
            + '<b>Y Axis&nbsp;</b>'
            + '<ul class="unstyled">' 
            +   '<li ng-repeat="yOption in yAxisOptions">{{yOption.colName}}<input type="checkbox" ng-model="yOption.colSelected"></li>'
            + '</ul>'
            + '<b>Line Label</b><input type="text" ng-model="lineName" placeholder="Enter line name here">'
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
            + '<input type="button" ng-click="getOutputDisplay()" value="Run">'
            + '</div>'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>',
controller: function($scope) {

var
    container = document.getElementById('container'),
    graph,
    jsObj = $scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length; //test which columns are numerical (numerical: true)

$scope.hideOrShow = "Hide";
$scope.displayConf = "display:block"
$scope.toggleConf = function() {
  if($scope.displayConf=="display:block") {
    $scope.displayConf = "display:none";
    $scope.hideOrShow = "Show";
  }
  else {
    $scope.displayConf = "display:block";
    $scope.hideOrShow = "Hide";
  }
}

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

$scope.yAxisOptions = [];
initializeYAxisOptions();
function initializeYAxisOptions(){
  
  for(var i = 0; i < $scope.colOptions.length; i++)
    $scope.yAxisOptions.push({colIndex:$scope.colOptions[i].colIndex, colName:$scope.colOptions[i].colName, colSelected:false});
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

function checkLineInput(){
  var xaxis;
  if($scope.lineGroup.length==0) abortJS("Error: must have at least one line.");
  else {
    xaxis = $scope.lineGroup[0].x;
    for(var i = 0; i < $scope.lineGroup.length; i++) {
      if($scope.lineGroup[i].x != xaxis)
        abortJS("Error: all lines must have same x-axis.");
    }
  }
  return xaxis;
}

function abortJS(err) {
  alert(err);
  throw new Error(err);
}

function getData() {
  var data = [];

  for (var i = 0; i < $scope.lineGroup.length; i++) {
    data.push( {data:getOneLineData($scope.lineGroup[i].x.colIndex, $scope.lineGroup[i].y.colIndex), label: $scope.lineGroup[i].name, lines:{show:true}, points:{show:true}});
  }
  console.log(data);
  return data;
}

function getOneLineData(x, y) {
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
    for(var i = 0; i < $scope.lineGroup.length; i++)
      if($scope.lineGroup[i].x==$scope.xaxis && $scope.lineGroup[i].y==$scope.yaxis)
        abortJS("Error: Duplicate line.");
    //console.log($scope.lineName + "/" + $scope.yaxis.colName);
    if($scope.lineName==undefined||$scope.lineName=="")
      $scope.lineName = $scope.yaxis.colName;
    $scope.lineGroup.push({x:$scope.xaxis, y:$scope.yaxis, name:$scope.lineName});
  }
  $scope.lineName="";
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
$scope.getOutputDisplay=function(){
  var 
    data = getData(), // First data series
    xvals, //[xmin, xmax, xticks]
    yvals; //ymin, ymax, yticks
  var xaxis=checkLineInput();
  if($scope.autoRange) {
    xvals = [null, null, 5];
    yvals = xvals;
  }
  else {
    xvals = checkRangeInput("X Range", $scope.xmin, $scope.xmax, $scope.xinterval); 
    yvals = checkRangeInput("Y Range", $scope.ymin, $scope.ymax, $scope.yinterval); 
  }

  graph = Flotr.draw(container, data, {
    title: $scope.title,
    xaxis: {
      title: xaxis.colName,
      min: xvals[0],
      max: xvals[1],
      noTicks: xvals[2]
    }, 
    yaxis: {
      //title: colNames[colYIndex],
      min: yvals[0],
      max: yvals[1],
      noTicks: yvals[2]
    },
    grid: {
      
    },
    mouse: {
      track: true
    }
  });
}




        }
      };
    });
})(); 