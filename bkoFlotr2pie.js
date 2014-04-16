//Values = int parse int, values=float, parse float
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Pie", function () {
      return {
            template: 
              '<button class="btn btn-primary" ng-click="toggleConf()"><i class="icon-cog"></i>&nbsp; {{hideOrShowConf}} Setting&nbsp;</button>'
            + '<button class="btn btn-primary" ng-click="toggleMsg()">&nbsp; {{hideOrShowMsg}} Error &nbsp;</button>'
            + '<div class={{msgClass}} id="msg" style={{displayMsg}}><h4>{{msgType}}</h4><ul><li ng-repeat="err in currErrors">{{err}}</br></li></ul></div>'
            + '<div id="configuration" style={{displayConf}}>'
            +   '<b>Number of Pie: &nbsp;</b><input type="text" ng-model="numPie" placeholder="Enter number of pie"></br>'
            +   '<b>Pie Setting&nbsp;</b>'
            +      '<table>' 
            +         '<tr><th>Title</th><th>Data</th><th>Label</th></tr>'
            +         '<tr ng-repeat="pie in getPieGroup(numPie)">'
            +           '<td><input type="text" ng-model="pie.title" placeholder="Enter pie title"></td>'
            +           '<td><select ng-model="pie.data" ng-options="dataOption.colName for dataOption in dataOptions"><option value="-- choose data --"></option></select></td>'
            +           '<td><select ng-model="pie.label" ng-options="labelOption.colName for labelOption in labelOptions"><option value="-- choose label --"></option></select></td>'
            +         '</tr>'
            +      '</table>'
            + '</div>'
            + '<div id="graphs">'
            +   '<ul><li ng-repeat="pie in getPieGroup(numPie)"><div id="{{pie.id}}" style="width:600px;height:384px;margin:8px auto">{{showGraph(pie.id)}}</div></li></ul>'
            + '</div>',
controller: function($scope) {


var
    jsObj = $scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length,
    errors = ["Please enter valid input: at least two columns, at least one numeric column." ,"Please enter how many pies do you need.", "Please enter numeric value greater than 0 for the number of pies.", "Please select 'Data' and 'Label' for every pie."],
    commitErrors = [0, 0, 0, 0],
    pieGroup = [];

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
  if($scope.labelOptions.length<2 || $scope.dataOptions.length<1) {
    return false;
  }
  return true;
}


$scope.getPieGroup=function(numPie) {
  if(!validUserInput) return pieGroup;
  if(needReset(numPie) || !isNormalInteger(numPie)) return pieGroup;
  numPie = parseInt(numPie);
  if(pieGroup.length==0) {
    for(var i = 0; i < numPie; i++)
      pieGroup.push({id:i, title:undefined, data:undefined, label:undefined});
    return pieGroup;
  }
  if(pieGroup.length>numPie) {
    pieGroup = pieGroup.slice(0, numPie);
    return pieGroup;
  }
  if(pieGroup.length<numPie) {
    var currID = pieGroup.length;
    while(pieGroup.length<numPie) {
      pieGroup.push({id:currID, title:undefined, data:undefined, label:undefined});
      currID = currID+1;
    }
    return pieGroup;
  }
  return pieGroup;
}

function needReset(varStr) {
  return (varStr==undefined||varStr==null||varStr=="");
}

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}

$scope.showGraph=function(pieIndex) {
  var readyToGraph = true;
  commitErrors = [0, 0, 0, 0, 0];
  //error handling 
 if($scope.numPie==""){
    commitErrors[1] = 1;
    readyToGraph = false;
  }
  if(parseInt($scope.numPie)==0){
    commitErrors[2] = 1;
    readyToGraph = false;
  }
  /*if(($scope.pie.data || $scope.pie.label)==""){
    commitErrors[3] = 1;
    readyToGraph = false;
  }*/
  if($scope.displayMsg=="display:block;")
    generateMessages(); 
  if(readyToGraph)
    getOutputDisplay();

}


function getOnePieData(dt, label) {
  //console.log(dt + " " + label);
  
  var
    finalData = [], row;

  for(row = 0; row < numRecords; row++) {
    finalData.push( { data: [[ 0, parseFloat(records[row][dt]) ]], label:records[row][label] } );
  }
  //console.log(finalData);
  return finalData;
  
}


function getOutputDisplay(){
  var data, finalTitle, p, pie, container, graph;
  for(p = 0; p < $scope.numPie; p++) {
    pie = pieGroup[p];
    data = getOnePieData(pie.data.colIndex, pie.label.colIndex);

    //Set title
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




        }
      };
    });
})(); 
