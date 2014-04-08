//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2_line", function () {
      return {
            template: '<div>'
            + '<b>Title&nbsp;</b> <input type="text" ng-model="title"  size="30" placeholder="Add graph title here"></br>'
            + '<b>X Axis&nbsp;</b><select ng-model="xaxis" ng-options="colOption for colOption in colOptions"><option value="">-- choose x-axis --</option></select>' 
            + '<b>Y Axis&nbsp;</b><select ng-model="yaxis" ng-options="colOption for colOption in colOptions"><option value="">-- choose y-axis --</option></select>' 
            + '<input type="button" value="Add Line" ng-click="addLine()"></br>'
            + '<b>Line Groups [x,y]:</b></br>'
            + '<ul>'
            +   '<li ng-repeat="line in lineGroup">'
            +      '<input type="button" value="Remove" ng-click="removeLine(line.x, line.y)">'
            +     '&nbsp;&nbsp;[{{line.x}}&nbsp;,&nbsp;{{line.y}}]'
            +   '</li>'
            + '</ul>'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>'
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
  var col, row, colOptions=[];
  for(col = 0; col < numCol; col++) {
    for(row = 0; row < numRecords; row++) {
      if(!isNumber(records[row][col])) {
        break;
      }
    }
    if(row==numRecords)
      $scope.colOptions.push(colNames[col]);
  }
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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