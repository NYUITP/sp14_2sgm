//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Line", function () {
      return {
            template: 
              '<div class="MyLineClass">'
            +   '<div class="row-fluid">'
            +     '<div class="span8"><span id="container" style="display:block;width:600px;height:384px;margin:8px auto">{{showGraph(autoRange)}}</span></div>'
            +     '<div class="span4">' 
            +       '<button class="btn btn-primary" ng-click="toggleConf()"><i class="icon-cog"></i>&nbsp; {{hideOrShowConf}} Configuration&nbsp;</button>'
            +       '<span class="label label-important">{{initReadyToGraph()}}</span>'
            +       '<div id="configuration" style={{displayConf}}>'
            +         '<span style="font-weight:bold;font-size:150%">Line Setting</span></br>'
            +         '<table>'
            +           '<tr><td><b>X Axis&nbsp;</b></td><td><select ng-model="xaxis" ng-options="colOption.colName for colOption in colOptions"></select><span class="label label-important">{{checkXaxis(xaxis)}}</span></td></tr>' 
            +         '</table>'
            +         '<b>Y Axis&nbsp;</b><span class="label label-important">{{checkYAxis(yAxisOptions)}}</span>'
            +           '<table>' 
            +             '<tr ng-repeat="yOption in yAxisOptions"><td><input class="input-medium" type="checkbox" ng-model="yOption.colSelected"></td><td>{{yOption.colName}}</td><td><input class="input-medium" type="text" ng-model="yOption.colLabel" placeholder="Enter Line Label"></td></tr>'
            +           '</table>'
            +         '<table>'
            +           '<tr><td><b>Title&nbsp;</b></td> <td><input class="input-medium" type="text" ng-model="title" placeholder="Add graph title here"></td></tr>'
            +           '<tr><td><b>X Title&nbsp;</b></td> <td><input class="input-medium" type="text" ng-model="xtitle" placeholder="Add x-axis title here"></td></tr>'
            +           '<tr><td><b>Y Title&nbsp;</b></td> <td><input class="input-medium" type="text" ng-model="ytitle" placeholder="Add y-axis title here"></td></tr>'
            +         '</table>'
            +         '{{calculateAutoRange(xaxis, yaxis)}}'
            +         '<p><b>Automatic bounds</b> <input class="input-medium" type="checkbox" ng-model="autoRange" ng-change="toggleAutoRange()"></p>'
            +         '<div id="boundConfig" style={{displayBoundConf}}>'
            +           '<b>X Bound</b></br>'
            +             '<table>'
            +               '<tr><td>Min&nbsp;</td>       <td><span class="{{checkMinMax(1, xmin)[1]}}"><input class="input-small" type="text" ng-model="xmin" ng-disabled="autoRange"></span></td>       <td><span class="label label-important">{{checkMinMax(1, xmin)[0]}}</span></td></tr>'
            +               '<tr><td>Max&nbsp;</td>       <td><span class="{{checkMinMax(1, xmax)[1]}}"><input class="input-small" type="text" ng-model="xmax" ng-disabled="autoRange"></span></td>       <td><span class="label label-important">{{checkMinMax(1, xmax)[0]}}</span></td></tr>'
            +               '<tr><td>Interval&nbsp;</td>  <td><span class="{{checkInterval(xinterval)[1]}}"><input class="input-small" type="text" ng-model="xinterval" ng-disabled="autoRange"></span></td>  <td><span class="label label-important">{{checkInterval(xinterval)[0]}}</span></td></tr>'
            +             '</table>'
            +           '<b>Y Bound</b></br>'
            +             '<table>'
            +               '<tr><td>Min&nbsp;</td>       <td><span class="{{checkMinMax(1, ymin)[1]}}"><input class="input-small" type="text" ng-model="ymin" ng-disabled="autoRange"></span></td>       <td><span class="label label-important">{{checkMinMax(2, ymin)[0]}}</span></td></tr>'
            +               '<tr><td>Max&nbsp;</td>       <td><span class="{{checkMinMax(1, ymax)[1]}}"><input class="input-small" type="text" ng-model="ymax" ng-disabled="autoRange"></span></td>       <td><span class="label label-important">{{checkMinMax(2, ymax)[0]}}</span></td></tr>'
            +               '<tr><td>Interval&nbsp;</td>  <td><span class="{{checkInterval(yinterval)[1]}}"><input class="input-small" type="text" ng-model="yinterval" ng-disabled="autoRange"></span></td>  <td><span class="label label-important">{{checkInterval(yinterval)[0]}}</span></td></tr>'
            +             '</table>'
            +         '</div>'
            +       '</div>'
            +     '</div>'
            +   '</div>'
            + '</div>',
link: function(scope, element, attrs) {
/********Var Declaration*********/
var
    jsObj = scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length,
    currXMin=-10, currXMax=10, currYMin=-10, currYMax=10, currXTick=5, currYTick=5, //test which columns are numerical (numerical: true)
    errors = ["Select the X axis.", "Select at least one Y axis.", "Enter numeric values.", "Max is smaller than Min.", "Interval <= 0.", "Please have at least two numeric columns.", "Please have unique column names."];
/********End OF Declaration*********/
scope.output = {};
console.log(jsObj);
/********Check Numeric Columns*********/
scope.colOptions = [];
checkNumCol();
function checkNumCol() {
  var col, row;
  for(col = 0; col < numCol; col++) {
    for(row = 0; row < numRecords; row++) {
      if(!isNumber(records[row][col])) {
        break;
      }
      records[row][col] = parseFloat(records[row][col]);
    }
    if(row==numRecords)
      scope.colOptions.push({colIndex:col, colName:colNames[col]});
  }
}
/********End OF Check Numeric Columns*********/

/********Find Selected Y axisesColumns*********/
scope.yAxisOptions = [];
initializeYAxisOptions();
function initializeYAxisOptions(){
  for(var i = 0; i < scope.colOptions.length; i++) {
    var yoption = {colIndex:scope.colOptions[i].colIndex, colName:scope.colOptions[i].colName, colSelected:true, colLabel:undefined};
    scope.yAxisOptions.push(yoption);
    if(i===0) yoption.colSelected = false;
  }
}
/********End OF Find Selected Y axisesColumns*********/


/********Error Checking*********/
scope.initReadyToGraph = function(){
  var opt;
  if(scope.colOptions.length<2) {
    scope.hideOrShowConf = " Hide ";
    scope.displayConf = "display:none;";
    scope.readyToGraph = false;
    return errors[5];
  }
  else if (!uniqueColumnNames()) {
    scope.hideOrShowConf = " Hide ";
    scope.displayConf = "display:none;";
    scope.readyToGraph = false;
    return errors[6];
  }
  else 
    scope.readyToGraph = true;
}
defaultGraph();
function defaultGraph() {
  if(scope.colOptions.length>=2) {
    scope.xaxis = scope.colOptions[0];
  }
}
function uniqueColumnNames() {
  for(var i = 0; i < colNames.length; i++) {
    for(var j = i+1; j < colNames.length; j++) {
      if(colNames[i]==colNames[j])
        return false;
    }
  }
  return true;
}
scope.checkXaxis = function(x) {
  if(x===undefined) {
    scope.readyToGraph = false;
    return errors[0];
  }
  return "";
}
scope.yaxis;
scope.checkYAxis = function(ys) {
  scope.yaxis = [];
  for(var i in scope.yAxisOptions) {
    if(scope.yAxisOptions[i].colSelected)
      scope.yaxis.push(scope.yAxisOptions[i]);
  }
  if(scope.yaxis.length==0) {
    scope.readyToGraph = false;
    return errors[1];
  }
  else return "";
}
scope.checkMinMax = function(axisName, input) {
  if(!isNumber(input)){
    scope.readyToGraph = false;
    return [errors[2],"control-group error"];
  }
  else if(axisName==1) {
    return checkMinMaxError(scope.xmin, scope.xmax);
  }
  else if(axisName==2) {
    return checkMinMaxError(scope.ymin, scope.ymax);
  }
  else
    return ["",""];
}
scope.checkInterval = function(interval) {
  if(!isNumber(interval)){
    scope.readyToGraph = false;
    return [errors[2],"control-group error"];
  }
  else if(parseFloat(interval)<=0) {
    scope.readyToGraph = false;
    return [errors[4],"control-group error"];
  }
  else
    return ["",""];
}
function checkMinMaxError (min, max) {
  if(isNumber(min) && isNumber(max) && parseFloat(max) < parseFloat(min) ) {
    scope.readyToGraph = false;
    return [errors[3],"control-group error"];
  }
  else
    return ["",""];
}
/********End OF Error Checking*********/

/********Auto Range Functions*********/
scope.autoRange = true;
setDefaultRange();
scope.displayBoundConf = "display:none;";
function setDefaultRange() {
  scope.xmin = currXMin;
  scope.xmax = currXMax;
  scope.xinterval = (currXMax-currXMin)/currXTick;
  scope.ymin = currYMin;
  scope.ymax = currYMax;
  scope.yinterval = (currYMax-currYMin)/currYTick;
}

scope.toggleAutoRange = function(){
  if(scope.autoRange) {
    setDefaultRange();
    scope.displayBoundConf = "display:none;";
  }
  else{
    scope.displayBoundConf = "display:block;";
  }
}

scope.calculateAutoRange = function(xaxis, yaxis) {
  if(scope.readyToGraph && scope.autoRange) {
    currXTick=5;
    currYTick=5;

    var xMinMax = getColMinMax(scope.xaxis.colIndex);
    var yMinMax = getColMinMax(scope.yaxis[0].colIndex);
    for(var i = 1; i < scope.yaxis.length; i++) {
      var tmpYMinMax = getColMinMax(scope.yaxis[i].colIndex);
      yMinMax[0] = Math.min(yMinMax[0], tmpYMinMax[0]);
      yMinMax[1] = Math.max(yMinMax[1], tmpYMinMax[1]);
    }
    currXMin=xMinMax[0];
    currXMax=xMinMax[1];
    currYMin=yMinMax[0];
    currYMax=yMinMax[1];
    setDefaultRange();
  }
}
/********End OF Auto Range Functions*********/

/********Show/Hide Configuration*********/
scope.hideOrShowConf = " Hide ";
scope.displayConf = "display:block;";
scope.toggleConf = function() {
  if(scope.displayConf=="display:block;") {
    scope.displayConf = "display:none;";
    scope.hideOrShowConf = "Show ";
  }
  else {
    scope.displayConf = "display:block;";
    scope.hideOrShowConf = " Hide ";
  }
}
/********End OF Show/Hide Configuration*********/

/********Helper Functions*********/
function isNumber(n) {
  return n!=undefined && !isNaN(parseFloat(n)) && isFinite(n);
}

function needReset(varStr) {
  return (varStr==undefined||varStr==null||varStr=="");
}

function getColMinMax(col) {
  var max=records[0][col], min=max;
  for(var row = 1; row < numRecords; row++) {
    max = Math.max(max, records[row][col]);
    min = Math.min(min, records[row][col]);
  }
  return [min, max];
}

function getData() {
  var data = [];

  for (var i = 0; i < scope.yaxis.length; i++) {
    var lb = scope.yaxis[i].colLabel;
    if(needReset(lb)) lb = scope.yaxis[i].colName;
    data.push( {data:getOneLineData(scope.xaxis.colIndex, scope.yaxis[i].colIndex), label: lb, lines:{show:true}, points:{show:true}});
  }
  return data;
}

function getOneLineData(x, y) {
  var
    data = [],
    row;

  for(row = 0; row < numRecords; row++) {
    data.push([ records[row][x], records[row][y] ]);
  }
  return data;
}
/********End OF Helper Functions*********/

/********Graph Functions*********/
scope.showGraph=function(autoRange) {
  if(scope.readyToGraph) {
    if(!autoRange) {
      currXMin=scope.xmin, currXMax=scope.xmax, currYMin=scope.ymin, currYMax=scope.ymax,
      currXTick = Math.ceil(Math.abs(scope.xmax - scope.xmin) / scope.xinterval);
      currYTick = Math.ceil(Math.abs(scope.ymax - scope.ymin) / scope.yinterval);
    }
    getOutputDisplay();
  }
}

function getOutputDisplay(){
  var 
    data = getData(), // First data series
    finalTitle, finalXTitle, finalYTitle; 

  var xaxis = scope.xaxis;
  //Set title
  if(needReset(scope.title)) finalTitle="Line Graph";
  else finalTitle=scope.title;
  if(needReset(scope.xtitle)) finalXTitle=scope.xaxis.colName;
  else finalXTitle=scope.xtitle;
  if(needReset(scope.ytitle)) finalYTitle="Y";
  else finalYTitle=scope.ytitle;
  scope.output.inObj = jsObj;
  scope.output.processedData = data;
  scope.output.graphSetting = 
  {
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
  };

  var container = element.find('#container')[0];
  scope.checkContainer = container;
  var graph = Flotr.draw(container, scope.output.processedData, scope.output.graphSetting);
}

/********End of Graph Functions*********/




        }
      };
    });
})(); 