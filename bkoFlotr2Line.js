//author: Di Wu
//Need to check empty input, then correct calculateAutoRange()
//checkUserInput();
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Line", function () {
      return {
            template: 
              '<button class="btn btn-primary" ng-click="toggleConf()"><i class="icon-cog"></i>&nbsp; {{hideOrShowConf}} Setting&nbsp;</button>'
            + '<button class="btn btn-primary" ng-click="toggleMsg()">&nbsp; {{hideOrShowMsg}} Error &nbsp;</button>'
            + '<div class={{msgClass}} id="msg" style={{displayMsg}}><h4>{{msgType}}</h4><ul><li ng-repeat="err in currErrors">{{err}}</br></li></ul></div>'
            + '<div class="tabbable" id="configuration" style={{displayConf}}>'
            +   '<ul class="nav nav-tabs">'
            +     '<li class="active"><a href="#tab1" data-toggle="tab">Line Group</a></li>'
            +     '<li><a href="#tab2" data-toggle="tab">Bound</a></li>'
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
            + '<div id="container" style="width:600px;height:384px;margin:8px auto">{{showGraph(autoRange)}}</div>',
controller: function($scope) {

var
    container = document.getElementById('container'),
    graph,
    jsObj = $scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length,
    currXMin=-10, currXMax=10, currYMin=-10, currYMax=10, currXTick=5, currYTick=5, //test which columns are numerical (numerical: true)
    errors = ["Please select the X axis.", "Please select at least one Y axis.", "X/Y Axis: Please enter numeric Min, Max and Interval values.", "X/Y Axis: Max is smaller than Min.", "X/Y Axis: Interval cannot be smaller or equals to zero."],
    commitErrors = [0, 0, 0, 0, 0];


$scope.autoRange = true;
setDefaultRange();
function setDefaultRange() {
  $scope.xmin = currXMin;
  $scope.xmax = currXMax;
  $scope.xinterval = (currXMax-currXMin)/currXTick;
  $scope.ymin = currYMin;
  $scope.ymax = currYMax;
  $scope.yinterval = (currYMax-currYMin)/currYTick;
}

$scope.toggleAutoRange = function(){
  if($scope.autoRange) {
    setDefaultRange();
  }
}

$scope.hideOrShowConf = " Hide ";
$scope.displayConf = "display:block;";
$scope.toggleConf = function() {
  if($scope.displayConf=="display:block;") {
    $scope.displayConf = "display:none;";
    $scope.hideOrShowConf = "Show ";
  }
  else {
    $scope.displayConf = "display:block;";
    $scope.hideOrShowConf = " Hide ";
  }
}

$scope.hideOrShowMsg = "Show ";
$scope.displayMsg = "display:none;";
$scope.toggleMsg = function() {
  if($scope.displayMsg=="display:block;") {
    $scope.displayMsg = "display:none;";
    $scope.hideOrShowMsg = "Show ";
  }
  else {
    generateMessages();
    $scope.displayMsg = "display:block;";
    $scope.hideOrShowMsg = " Hide ";
  }
}

function generateMessages() {
  $scope.currErrors = [];
  for(var i = 0; i < errors.length; i++) {
    if(commitErrors[i]==1) $scope.currErrors.push(errors[i]);
  }
  if($scope.currErrors.length==0) {
    $scope.msgClass="alert alert-success";
    $scope.msgType="Success!";
  }
  else {
    $scope.msgClass="alert alert-error";
    $scope.msgType="Error!";
  }
  //console.log($scope.currErrors);
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


$scope.showGraph=function(autoRange) {
  var readyToGraph = true;
  commitErrors = [0, 0, 0, 0, 0];
  /*Check Errors in X, Y column selection*/
  $scope.yaxis = [];
  for(var i in $scope.yAxisOptions) {
    if($scope.yAxisOptions[i].colSelected)
      $scope.yaxis.push($scope.yAxisOptions[i]);
  }
  if($scope.xaxis==undefined){
    commitErrors[0] = 1;//
    //console.log("Please select the X axis.");
    readyToGraph = false;
  }
  if($scope.yaxis.length==0) {
    commitErrors[1] = 1;//
    //console.log("Please select at least one Y axis.");
    readyToGraph = false;
  }
  if(readyToGraph) {
    if(autoRange) {
      calculateAutoRange();
      setDefaultRange();
    }
    else {
      if(!properRangeInput($scope.xmin, $scope.xmax, $scope.xinterval, $scope.ymin, $scope.ymax, $scope.yinterval)) readyToGraph=false;
    }
  }
  if($scope.displayMsg=="display:block;")
    generateMessages(); 
  if(readyToGraph)
    getOutputDisplay();
}

function calculateAutoRange() {
  currXTick=5;
  currYTick=5;

  var xMinMax = getColMinMax($scope.xaxis.colIndex);
  var yMinMax = getColMinMax($scope.yaxis[0].colIndex);
  for(var i = 1; i < $scope.yaxis.length; i++) {
    var tmpYMinMax = getColMinMax($scope.yaxis[i].colIndex);
    yMinMax[0] = Math.min(yMinMax[0], tmpYMinMax[0]);
    yMinMax[1] = Math.max(yMinMax[1], tmpYMinMax[1]);
  }
  currXMin=xMinMax[0];
  currXMax=xMinMax[1];
  currYMin=yMinMax[0];
  currYMax=yMinMax[1];
}

function getColMinMax(col) {
  var max=records[0][col], min=max;
  for(var row = 1; row < numRecords; row++) {
    max = Math.max(max, records[row][col]);
    min = Math.min(min, records[row][col]);
  }
  return [min, max];
}


function properRangeInput(xmin, xmax, xinterval, ymin, ymax, yinterval) {
  var isProper=true;
  if(!isNumber(xmin) || !isNumber(xmax) || !isNumber(xinterval) || !isNumber(ymin) || !isNumber(ymax) || !isNumber(yinterval) ){
    commitErrors[2] = 1;
    //console.log("X/Y Axis: Please enter numeric min, max and interval values.");
    return false;
  }

  xmin = parseFloat(xmin);
  xmax = parseFloat(xmax);
  xinterval = parseFloat(xinterval);
  ymin = parseFloat(ymin);
  ymax = parseFloat(ymax);
  yinterval = parseFloat(yinterval);

  if(xmin > xmax || ymin > ymax) {
    commitErrors[3] = 1;
    //console.log("X/Y Axis: Max is smaller than Min.");
    isProper=false; 
  }
  
  if(xinterval <= 0 || yinterval <= 0) {
    commitErrors[4] = 1;
    //console.log("X/Y Axis: Interval cannot be smaller or equals to zero.");
    isProper=false;
  }

  if(isProper) {
    currXMin=xmin, currXMax=xmax, currYMin=ymin, currYMax=ymax,
    currXTick = Math.ceil(Math.abs(xmax - xmin) / xinterval);
    currYTick = Math.ceil(Math.abs(ymax - ymin) / yinterval);
    return true;
  }
  else {
    return false;
  }
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
  return n!=undefined && !isNaN(parseFloat(n)) && isFinite(n);
}

function getOutputDisplay(){
  var 
    data = getData(), // First data series
    finalTitle, finalXTitle, finalYTitle; 

  var xaxis = $scope.xaxis;
  //Set title
  if(needReset($scope.title)) finalTitle="Line Graph";
  else finalTitle=$scope.title;
  if(needReset($scope.xtitle)) finalXTitle=$scope.xaxis.colName;
  else finalXTitle=$scope.xtitle;
  if(needReset($scope.ytitle)) finalYTitle="Y";
  else finalYTitle=$scope.ytitle;

  graph = Flotr.draw(container, data, {
    title: finalTitle,
    xaxis: {
      title: finalXTitle,
      min: currXMin,
      max: currXMax,
      noTicks: currXTick
    }, 
    yaxis: {
      title: finalYTitle,
      min: currYMin,
      max: currYMax,
      noTicks: currYTick
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