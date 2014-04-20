//Values = int parse int, values=float, parse float
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Pie", function () {
      return {
            template: 
              '<button class="btn btn-primary" ng-click="toggleConf()"><i class="icon-cog"></i>&nbsp; {{hideOrShowConf}} Setting&nbsp;</button>'
            + '<button class="btn btn-primary" ng-click="toggleMsg()">&nbsp; {{hideOrShowMsg}} Error &nbsp;</button></br>'
            + '<div class={{msgClass}} id="msg" style={{displayMsg}}><h4>{{msgType}}</h4><ul><li ng-repeat="err in currErrors">{{err}}</br></li></ul></div>'
            + '<div id="configuration" style={{displayConf}}>'
            +   '</br><b>Number of Pie: &nbsp;</b><input type="text" name="pienum" class="input-medium" ng-model="numPie" placeholder="Enter number of pie"></br>'
            +   '<b>Pie Setting&nbsp;</b>'
            +     '<div id="pieSetting" style={{checkNumPie()}}>'
            +       '<table>' 
            +         '<tr><th>Title</th><th>Data</th><th>Label</th></tr>'
            +         '<tr ng-repeat="pie in getPieGroup(numPie)">'
            +           '<td><input type="text" class="input-medium" ng-model="pie.title" placeholder="Enter pie title"></td>'
            +           '<td><select ng-model="pie.data" ng-options="dataOption.colName for dataOption in dataOptions"><option value="-- choose data --"></option></select></td>'
            +           '<td><select ng-model="pie.label" ng-options="labelOption.colName for labelOption in labelOptions"><option value="-- choose label --"></option></select></td>'
            +         '</tr>'
            +       '</table>'
            +     '</div>'
            + '</div>'
            + '<div id="graphs" style={{checkError()}}>'
            +   '<ul class="unstyled"><li ng-repeat="pie in pieGroup"><div id="{{pie.id}}" style="width:600px;height:384px;margin:8px auto">{{showGraph(pie)}}</div></li></ul>'
            + '</div>',
controller: function($scope) {


var
    jsObj = $scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length,
    errors = ["Please enter valid input: at least two columns.", "At least one column should be numeric." ,"Please enter how many pies do you need.", "Please enter numeric value greater than 0 for the number of pies.", "Please select 'Data' and 'Label' for every pie."],
    commitErrors = [0, 0, 0, 0, 0];

$scope.pieGroup = [];

$scope.hideOrShowConf = " Hide ";
$scope.displayConf = "display:block;";
$scope.toggleConf = function() {
  if($scope.displayConf=="display:block;") {
    $scope.displayConf = "display:none;";
    $scope.hideOrShowConf = "Show";
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
}

$scope.dataOptions = [];
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
      $scope.dataOptions.push({colIndex:col, colName:colNames[col]});
  }
}

$scope.labelOptions = [];
checkLabelCol();
function checkLabelCol(){
  var col;
  for(col = 0; col < numCol; col++) {
    $scope.labelOptions.push({colIndex:col, colName:colNames[col]});
  }
}

function isNumber(n) {
  return n!=undefined && !isNaN(parseFloat(n)) && isFinite(n);
}

var validUserInput = checkUserInput();
function checkUserInput() {
  if($scope.labelOptions.length<=2 || $scope.dataOptions.length<1) {
    return false;
  }
  return true;
}

$scope.getPieGroup=function(numPie) {
  if(!validUserInput || needReset(numPie) || !isNormalInteger(numPie)) {
    $scope.pieGroup = [];
    return $scope.pieGroup;
  }
  numPie = parseInt(numPie);
  if($scope.pieGroup.length==0) {
    $scope.pieGroup = [];
    for(var i = 0; i < numPie; i++)
      $scope.pieGroup.push({id:i, title:undefined, data:undefined, label:undefined});
    return $scope.pieGroup;
  }
  if($scope.pieGroup.length>numPie) {
    $scope.pieGroup = $scope.pieGroup.slice(0, numPie);
    return $scope.pieGroup;
  }
  if($scope.pieGroup.length<numPie) {
    var currID = $scope.pieGroup.length;
    while($scope.pieGroup.length<numPie) {
      $scope.pieGroup.push({id:currID, title:undefined, data:undefined, label:undefined});
      currID = currID+1;
    }
    return $scope.pieGroup;
  }
  return $scope.pieGroup;
}

function needReset(varStr) {
  return (varStr==undefined||varStr==null||varStr=="");
}

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}

$scope.checkNumPie = function() {
  if($scope.pieGroup.length==0)
    return "display:none;"
  else
    return "display:block;"
}

var readyToGraph;
$scope.checkError=function() {
  readyToGraph = true;
  var outStyle = "display:block;"
  commitErrors = [0, 0, 0, 0, 0];
  //error handling 
  if(!validUserInput){
    commitErrors[0] = 1;
    readyToGraph = false;
  }
  if(readyToGraph){
     if($scope.dataOptions.length <=1){
	commitErrors[1] = 1;
        readyToGraph = false;
	}
  }
  if(readyToGraph) {
    if(needReset($scope.numPie)) {
      commitErrors[2] = 1;
      readyToGraph = false;
    }
    else {
      if(!isNormalInteger($scope.numPie)) {
        commitErrors[3] = 1;
        readyToGraph = false;
      }
    }
  }
  if(readyToGraph) {
    var pie;
    for(var i = 0; i < $scope.pieGroup.length; i++) {
      pie = $scope.pieGroup[i];
      if(pie.data==undefined || pie.label==undefined) {
        commitErrors[4] = 1;
        readyToGraph = false;
        break;
      }
    }
  }
  if($scope.displayMsg=="display:block;")
    generateMessages(); 

  if(!readyToGraph) 
    outStyle = "display:none;"

  return outStyle;
}

$scope.showGraph=function(pie) {
  if(readyToGraph) {
    getOutputDisplay(pie);
  }
}


function getOnePieData(dt, label) {
  
  var
    finalData = [], row;

  for(row = 0; row < numRecords; row++) {
    finalData.push( { data: [[ 0, parseFloat(records[row][dt]) ]], label:records[row][label] } );
  }
  return finalData;
  
}


function getOutputDisplay(pie){
  var data, finalTitle, container, graph;
  data = getOnePieData(pie.data.colIndex, pie.label.colIndex);

  if(needReset(pie.title)) finalTitle="Pie Graph " + pie.id;
  else finalTitle=pie.title;

  container = document.getElementById(pie.id);

  graph = Flotr.draw(container, data, {
    title: finalTitle,
    HtmlText: false,
    pie:{
      show: true,
      explode: 6
    },
    xaxis: {
      showLabels: false
    }, 
    yaxis: {
      showLabels: false
    },
    grid: {
      verticalLines: false,
      horizontalLines : false
    },
    mouse: {
      track: true
    },
    legend: {
      position: 'se',
      backgroundColor: '#D2E8FF'
    }
  });
}




        }
      };
    });
})(); 
