//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Line", function () {
      return {
            template: 
              '<button class="btn btn-primary" ng-click="toggleConf()">&nbsp; {{hideOrShow}} &nbsp;<i class="icon-cog"></i></button>'
            + '<div class="tabbable" id="configuration" style={{displayConf}}>'
            +   '<ul class="nav nav-tabs">'
            +     '<li class="active"><a href="#tab1" data-toggle="tab">Line Group</a></li>'
            +     '<li><a href="#tab2" data-toggle="tab">Axis</a></li>'
            +   '</ul>'
            +   '<div class="tab-content">'
            +     '<div class="tab-pane active" id="tab1">'
            +       '<table>'
            +       '<tr><td><b>Title&nbsp;</b></td> <td><input type="text" ng-model="title"  size="30" placeholder="Add graph title here"></td></tr>'
            +       '<tr><td><b>X Title&nbsp;</b></td> <td><input type="text" ng-model="xtitle"  size="30" placeholder="Add x-axis title here"></td><td><b>&nbsp;Y Title&nbsp;</b></td> <td><input type="text" ng-model="ytitle"  size="30" placeholder="Add y-axis title here"></td></tr>'
            +       '<tr><td><b>X Axis&nbsp;</b></td><td><select ng-model="xaxis" ng-options="colOption.colName for colOption in colOptions"><option value="">-- choose x-axis --</option></select></td></tr>' 
            +       '</table>'
            +       '<b>Y Axis&nbsp;</b>'
            +         '<table>' 
            +           '<tr ng-repeat="yOption in yAxisOptions"><td><input type="checkbox" ng-model="yOption.colSelected"></td><td>{{yOption.colName}}</td><td><input type="text" ng-model="yOption.colLabel" placeholder="Enter Line Label"></td></tr>'
            +         '</table>'
            +     '</div>'
            +     '<div class="tab-pane" id="tab2">'
            +       '<b>X Range</b>     Min: <input type="text" ng-model="xmin" size="4">     Max: <input type="text" ng-model="xmax" size="4"> Interval: <input type="text" ng-model="xinterval" size="4"><br>'
            +       '<b>Y Range</b>     Min: <input type="text" ng-model="ymin" size="4">     Max: <input type="text" ng-model="ymax" size="4"> Interval: <input type="text" ng-model="yinterval" size="4"><br>'
            +       'Set X and Y ranges automatically <input type="checkbox" ng-model="autoRange"><br>'
            +     '</div>'
            +   '</div>'
            + '</div>'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto">{{showGraph()}}</div>',
controller: function($scope) {

var
    container = document.getElementById('container'),
    graph,
    jsObj = $scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length,
    finalTitle, finalXTitle, finalYTitle; //test which columns are numerical (numerical: true)

$scope.hideOrShow = " Hide ";
$scope.displayConf = "display:block;";
$scope.toggleConf = function() {
  if($scope.displayConf=="display:block;") {
    $scope.displayConf = "display:none;";
    $scope.hideOrShow = "Show";
  }
  else {
    $scope.displayConf = "display:block;";
    $scope.hideOrShow = " Hide ";
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
    $scope.yAxisOptions.push({colIndex:$scope.colOptions[i].colIndex, colName:$scope.colOptions[i].colName, colSelected:false, colLabel:undefined});
}


$scope.showGraph=function() {
  //Get all selected y axis
  $scope.yaxis = [];
  for(var i in $scope.yAxisOptions) {
    if($scope.yAxisOptions[i].colSelected)
      $scope.yaxis.push($scope.yAxisOptions[i]);
  }

  //Set title
  if(needReset($scope.title)) finalTitle="Line Graph";
  else finalTitle=$scope.title;
  if(needReset($scope.xtitle)) finalXTitle=$scope.xaxis.colName;
  else finalXTitle=$scope.xtitle;
  if(needReset($scope.ytitle)) finalYTitle="Y";
  else finalYTitle=$scope.ytitle;
  //if($scope.xaxis==undefined) abortJS("Error: please select x axis.");
  //if($scope.yaxis.length==0) abortJS("Error: please select at least one y axis.");
  getOutputDisplay();
}

function needReset(varStr) {
  return (varStr==undefined||varStr==null||varStr=="");
}

function getData() {
  var data = [];

  for (var i = 0; i < $scope.yaxis.length; i++) {
    var lb = $scope.yaxis[i].colLabel;
    if(needReset(lb)) lb = $scope.yaxis[i].colName;
    data.push( {data:getOneLineData($scope.xaxis.colIndex, $scope.yaxis[i].colIndex), label: lb, lines:{show:true}, points:{show:true}});
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


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkRangeInput(range, min, max, interval) {
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

function getOutputDisplay(){
  var 
    data = getData(), // First data series
    xvals, //[xmin, xmax, xticks]
    yvals; //ymin, ymax, yticks
  var xaxis = $scope.xaxis;
  if($scope.autoRange) {
    xvals = [null, null, 5];
    yvals = xvals;
  }
  else {
    xvals = checkRangeInput("X Range", $scope.xmin, $scope.xmax, $scope.xinterval); 
    yvals = checkRangeInput("Y Range", $scope.ymin, $scope.ymax, $scope.yinterval); 
  }

  graph = Flotr.draw(container, data, {
    title: finalTitle,
    xaxis: {
      title: finalXTitle,
      min: xvals[0],
      max: xvals[1],
      noTicks: xvals[2]
    }, 
    yaxis: {
      title: finalYTitle,
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