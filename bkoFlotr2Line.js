//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Line", function () {
      return {
            template: 
              '<button class="btn btn-primary" ng-click="toggleConf()">&nbsp; {{hideOrShow}} &nbsp;<i class="icon-cog"></i></button>'
            + '<div class="{{checkInputs()}}"></div>'
            + '<div class="tabbable" id="configuration" style={{displayConf}}>'
            +   '<ul class="nav nav-tabs">'
            +     '<li class="active"><a href="#tab1" data-toggle="tab">Line Group</a></li>'
            +     '<li><a href="#tab2" data-toggle="tab">Axis</a></li>'
            +   '</ul>'
            +   '<div class="tab-content">'
            +     '<div class="tab-pane active" id="tab1">'
            +       '<table>'
            +       '<tr><td><b>Title&nbsp;</b></td> <td><input class="input-xlarge" type="text" ng-model="title"  size="30" placeholder="Add graph title here"></td></tr>'
            +       '<tr><td><b>X Title&nbsp;</b></td> <td><input class="input-xlarge" type="text" ng-model="xtitle"  size="30" placeholder="Add x-axis title here"></td><td><b>&nbsp;Y Title&nbsp;</b></td> <td><input class="input-xlarge" type="text" ng-model="ytitle"  size="30" placeholder="Add y-axis title here"></td></tr>'
            +       '<tr><td><b>X Axis&nbsp;</b></td><td><select ng-model="xaxis" ng-options="colOption.colName for colOption in colOptions"><option value="">-- choose x-axis --</option></select></td></tr>' 
            +       '</table>'
            +       '<b>Y Axis&nbsp;</b>'
            +         '<table>' 
            +           '<tr ng-repeat="yOption in yAxisOptions"><td><input class="input-xlarge" type="checkbox" ng-model="yOption.colSelected"></td><td>{{yOption.colName}}</td><td><input class="input-xlarge" type="text" ng-model="yOption.colLabel" placeholder="Enter Line Label"></td></tr>'
            +         '</table>'
            +     '</div>'
            +     '<div class="tab-pane" id="tab2">'
            +       '<p><b>Set X and Y ranges automatically</b> <input class="input-xlarge" type="checkbox" ng-model="autoRange" ng-change="toggleAutoRange()"></p>'
            +       '<b>X Range</b>     Min: <input class="input-xlarge" type="text" ng-model="xmin" size="4" ng-disabled="autoRange">     Max: <input class="input-xlarge" type="text" ng-model="xmax" size="4" ng-disabled="autoRange"> Interval: <input class="input-xlarge" type="text" ng-model="xinterval" size="4" ng-disabled="autoRange"><br>'
            +       '<b>Y Range</b>     Min: <input class="input-xlarge" type="text" ng-model="ymin" size="4" ng-disabled="autoRange">     Max: <input class="input-xlarge" type="text" ng-model="ymax" size="4" ng-disabled="autoRange"> Interval: <input class="input-xlarge" type="text" ng-model="yinterval" size="4" ng-disabled="autoRange"><br>'
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
    autoXMin=-10, autoXMax=10, autoYMin=-10, autoYMax=10, autoInterval=5, //test which columns are numerical (numerical: true)
    errors = ["Please select the X axis.", "Please select at least one Y axis.", "X/Y Axis: Please enter numeric Min, Max and Interval values.", "X/Y Axis: Max is smaller than Min.", "X/Y Axis: Interval cannot be smaller or equals to zero."],
    commitErrors = [0, 0, 0, 0, 0];


$scope.autoRange = true;
setDefaultRange();
function setDefaultRange() {
  $scope.xmin = autoXMin;
  $scope.xmax = autoXMax;
  $scope.xinterval = autoInterval;
  $scope.ymin = autoYMin;
  $scope.ymax = autoYMax;
  $scope.yinterval = autoInterval;
}

$scope.toggleAutoRange = function(){
  if(autoRange) {
    setDefaultRange();

  }
}

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
  var readyToGraph = true;
  commitErrors = [0, 0, 0, 0, 0];
  /*Check Errors in X, Y column selection*/
  $scope.yaxis = [];
  for(var i in $scope.yAxisOptions) {
    if($scope.yAxisOptions[i].colSelected)
      $scope.yaxis.push($scope.yAxisOptions[i]);
  }
  if($scope.xaxis==undefined){
    commitErrors[0] = 1;//"Please select the X axis."
    readyToGraph = false;
  }
  if($scope.yaxis.length==0) {
    commitErrors[1] = 1;//"Please select at least one Y axis."
    readyToGraph = false;
  }
  //if(readyToGraph) {
    //calculateAutoRange();
  //}


  if(readyToGraph)
    getOutputDisplay();
}

function checkRangeInput(min, max, interval) {
  if(!isNumber(min) || !isNumber(max) || !isNumber(interval) ) 
    commitErrors[2] = 1;//"X/Y Axis: Please enter numeric min, max and interval values."

  min = parseFloat(min);
  max = parseFloat(max);
  interval = parseFloat(interval);
  if(min > max) 
    commitErrors[3] = 1;//"X/Y Axis: Max is smaller than Min."
  
  if(interval <= 0) 
    commitErrors[4] = 1;//"X/Y Axis: Interval cannot be smaller or equals to zero."
  
  var ticks = Math.ceil(Math.abs(max - min) / interval);
  return [min, max, ticks];
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
  return data;
}

function getOneLineData(x, y) {
  var
    data = [],
    row;

  for(row = 0; row < numRecords; row++) {
    data.push([records[row][x], records[row][y]]);
  }
  return data;
}


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getOutputDisplay(){
  var 
    data = getData(), // First data series
    xvals, //[xmin, xmax, xticks]
    yvals, //ymin, ymax, yticks
    finalTitle, finalXTitle, finalYTitle; 

  var xaxis = $scope.xaxis;
  //Set title
  if(needReset($scope.title)) finalTitle="Line Graph";
  else finalTitle=$scope.title;
  if(needReset($scope.xtitle)) finalXTitle=$scope.xaxis.colName;
  else finalXTitle=$scope.xtitle;
  if(needReset($scope.ytitle)) finalYTitle="Y";
  else finalYTitle=$scope.ytitle;

  if($scope.autoRange) {
    xvals = [null, null, 5];
    yvals = xvals;
  }
  else {
    xvals = checkRangeInput($scope.xmin, $scope.xmax, $scope.xinterval); 
    yvals = checkRangeInput($scope.ymin, $scope.ymax, $scope.yinterval); 
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