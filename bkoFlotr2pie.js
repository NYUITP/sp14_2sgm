//Priyanka Inani & Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Pie", function () {
      return {
            template: 
              '<div class="MyPieClass">'
            +   '<div class="row-fluid">'
            +     '<div class="span8">'
            +       '<span id="graphs">'
            +         '<ul class="unstyled"><li ng-repeat="pie in pieGroup track by $index"><div id="{{pie.id}}" style="width:600px;height:384px;margin:8px auto">{{showGraph(pie)}}</div></li></ul>'
            +       '</span>'
            +     '</div>'
            +     '<div class="span4">'
            +       '<button class="btn btn-primary" ng-click="toggleConf()"><i class="icon-cog"></i>&nbsp; {{hideOrShowConf}} Configuration&nbsp;</button>'
            +       '<div class="label label-important">{{initReadyToGraph()}}</div>'
            +       '<div id="configuration" style={{displayConf}}>'
            +           '<span style="font-weight:bold;font-size:150%">Pie Setting</span></br>'
            +           '<button class="btn btn btn-mini btn-success" ng-click="addPie()"><i class="icon-plus"></i>Add Pie</button>'
            +           '<table>'
            +             '<tbody style="width:600px;" ng-repeat="pie in pieGroup track by $index">' 
            +               '<tr><td><b>Pie {{pie.id}}</b></td> <td><button class="btn btn btn-mini btn-danger" ng-click="removePie(pie)"><i class="icon-minus"></i>Remove Pie</button></td></tr>'
            +               '<tr><td><b>Category&nbsp;</b></td> <td><select ng-model="pie.category" ng-options="categoryOption.colName for categoryOption in categoryOptions"><option value="-- choose category --"></option></select></br><span class="label label-important">{{checkCategory(pie.category)}}</span></td></tr>'
            +               '<tr><td><b>Size&nbsp;</b></td>     <td><select ng-model="pie.size" ng-options="sizeOption.colName for sizeOption in sizeOptions"><option value="-- choose size --"></option></select></br><span class="label label-important">{{checkSize(pie.size)}}</span></td></tr>'  
            +               '<tr><td><b>Title&nbsp;</b></td>    <td><input ng-model="pie.title" type="text" class="input-medium" placeholder="Enter pie title"></td></tr>'
            +               '<tr><td></br></br></br></br></br></br></br></br></br></br></br></td></tr>'
            +             '</tbody>'
            +           '</table>'
            +       '</div>'
            +     '</div>'
            +   '</div>'
            + '</div>',
link: function(scope, element, attrs) {
/*Variable Declaration*/
var
    jsObj = scope.model.getCellModel(),
    colNames = jsObj.columnNames,
    numCol = colNames.length,
    records = jsObj.values,
    numRecords = records.length,
    errors = ["Please have at least two columns.", "At least one column should be numeric.","Please have unique columns name", "Please select Category.", "Please select Size."];
scope.pieGroup = [];
scope.output = {};
scope.categoryOptions = [];
scope.sizeOptions = [];
scope.readyToGraph = true;
scope.defaultPie;
/*Variable declaration end*/

/*Get/Organize User Input*/
checkCol();
function checkCol() {
  var col, row;
  for(col = 0; col < numCol; col++) {
    scope.categoryOptions.push({colIndex:col, colName:colNames[col]});
    for(row = 0; row < numRecords; row++) {
      if(!isNumber(records[row][col])) {
        break;
      }
    }
    if(row==numRecords)
      scope.sizeOptions.push({colIndex:col, colName:colNames[col]});
  }
}
/*Get/Organize User Input end*/

/*Error Checking*/
scope.initReadyToGraph = function(){
  var opt;
  if(numCol<2) {
    scope.hideOrShowConf = " Hide ";
    scope.displayConf = "display:none;";
    scope.readyToGraph = false;
    return errors[0];
  }
  else if(scope.sizeOptions.length<1) {
    scope.hideOrShowConf = " Hide ";
    scope.displayConf = "display:none;";
    scope.readyToGraph = false;
    return errors[1];
  }
  else if (!uniqueColumnNames()) {
    scope.hideOrShowConf = " Hide ";
    scope.displayConf = "display:none;";
    scope.readyToGraph = false;
    return errors[2];
  }
  else
    scope.readyToGraph = true;
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

scope.checkCategory = function(z) {
  if(z== undefined) {
    scope.readyToGraph = false;
    return errors[3];
  }
  return "";
}

scope.checkSize = function(y) {
  if(y == undefined) {
    scope.readyToGraph = false;
    return errors[4];
  }
  return "";
}
/*Error Checking end*/

/*Default Graph*/
defaultGraph();
function defaultGraph() {
  if(scope.readyToGraph) {
    var size = scope.sizeOptions[0];
    var category;
    for(var i = 0; i < scope.categoryOptions.length; i++){
      var cat = scope.categoryOptions[i];
      if(cat.colIndex != size.colIndex) {
        category = cat;
        break;
      }
    }
    var title = "[Category: " + category.colName + "]\t[Size: " + size.colName + "]";
    scope.defaultPie = {id: 0, title: title, size: size, category: category};
    scope.pieGroup = [clone(scope.defaultPie)];
  }
}
/*Default Graph end*/

/*Add/Remove Pie*/
scope.addPie = function() {
  scope.pieGroup.unshift( clone(scope.defaultPie) );
  for(var i = 1; i < scope.pieGroup.length; i++) {
    scope.pieGroup[i].id = i;
  }
  console.log(scope.pieGroup);
}

scope.removePie = function(pie) {
  var index = scope.pieGroup.indexOf(pie);
  scope.pieGroup.splice(index, 1);
  for(var i = 0; i < scope.pieGroup.length; i++) {
    scope.pieGroup[i].id = i;
  }
  console.log(scope.pieGroup);
}
/**/

/*Pie Graph Functions*/
scope.showGraph=function(pie) {
  if(scope.readyToGraph) {
    getOutputDisplay(pie);
  }
}

function getOutputDisplay(pie){
  var data, finalTitle, container, graph;

  data = getOnePieData(pie.size.colIndex, pie.category.colIndex);

  if(needReset(pie.title)) 
    finalTitle = "[Category: " + pie.category.colName + "]\t[Size: " + pie.size.colName + "]";
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
      showLabels: true
    }, 
    yaxis: {
      showLabels: true
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

function getOnePieData(size, category) {
  var
    finalData = [], row;

  for(row = 0; row < numRecords; row++) {
    finalData.push( { data: [[ 0, parseFloat(records[row][size]) ]], label:records[row][category] } );
  }
  return finalData;
  
}

/*Pie Graph Functions End*/

/*Show hide configuration*/
scope.hideOrShowConf = " Hide ";
scope.displayConf = "display:block;";
scope.toggleConf = function() {
  if(scope.displayConf=="display:block;") {
    scope.displayConf = "display:none;";
    scope.hideOrShowConf = "Show";
  }
  else {
    scope.displayConf = "display:block;";
    scope.hideOrShowConf = " Hide ";
  }
}
/*End of show hide configuration*/

/*helper functions*/
function isNumber(n) {
  return n!=undefined && !isNaN(parseFloat(n)) && isFinite(n);
}

function needReset(varStr) {
  return (varStr==undefined||varStr==null||varStr=="");
}

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n > 0;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
/*end of helper functions*/

        }
      };
    });
})(); 
