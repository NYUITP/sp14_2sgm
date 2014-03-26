//author: Di Wu

/*
 *  Copyright 2014 TWO SIGMA INVESTMENTS, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
/**
 * M_bkoTableDisplay
 * This is the output display component for displaying tables.
 */
(function () { 
    'use strict';
    beaker.bkoDirective("HighChart", function () {
        return {
            template: '<div>'
            + '<select id=selectedOutput>'
            +   '<option value="pie chart">Pie Chart</option>'
            +   '<option value="line chart">Line Chart</option>'
            + '</select></br>'
            + '<input type="button" ng-click="getOutputDisplay()" value="Run">'
            + '<div id="container"></div>'
            + '</div>',
            link: function (scope, element, attrs) {
              scope.getOutputDisplay=function(){
                var outputType = document.getElementById("selectedOutput");
                if(outputType.selectedIndex==1){
                  outputLineChart();
                }
                else if(outputType.selectedIndex==0) {
                  outputPieChart();
                }
              };
              function outputLineChart(){
                function getColumnValues(obj, col, row){
                  var arr = new Array();
                  for(var i = 0; i < row; i++) {
                    arr[i] = new Array();
                    for(var j = 0; j < col; j++) {
                      var out=jsObj.values[i][j+1].trim();
                      if(j==1) out=parseInt(out);
                      arr[i][j] = out;
                    }
                  }
                  return arr;
                }
                function getColumnList(obj, col, row){
                  var arr = new Array();
                  for(var i = 0; i < row; i++) {
                    arr[i] = new Array();
                    for(var j = 0; j < col; j++) {
                      var out = jsObj.values[i][j].trim();
                      arr[i][j] = out;
                    }
                  }
                  return arr;
                }
                var jsObj = scope.model.getCellModel();
                var dataArr = getColumnValues(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
                var columnList = getColumnList(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
                $('#container').highcharts({
                  title: {
                    text: 'Line Chart',
                    x: -20 //center
                  },
                  xAxis: {
                    categories: columnList
                  },
                  yAxis: {
                    title: {
                      text: 'Values'
                    },
                    plotLines: [{
                      value: 0,
                      width: 10,
                      color: '#808080'
                    }]
                  },
                  legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                  },
                  series: [{
                    name: jsObj.columnNames[2],
                    data: dataArr
                  }]
                });
              };
              function outputPieChart(){
                function convertToArray(obj, col, row){
                  var arr = new Array();
                  for(var i = 0; i < row; i++) {
                    arr[i] = new Array();
                    for(var j = 0; j < col; j++) {
                      var out=jsObj.values[i][j+1].trim();
                      if(j==1) out=parseInt(out); //CHANGE int/float user input
                      arr[i][j] = out;
                    //console.log("arr["+i+"]["+j+"] = [" + arr[i][j]+"]\n");
                    }
                  }
                  return arr;
                }

                var jsObj = scope.model.getCellModel();
                console.log(jsObj);
                console.log(jsObj.columnNames.length-1);
                console.log(jsObj.values.length);
                var dataArr = convertToArray(jsObj, jsObj.columnNames.length-1, jsObj.values.length);
                console.log(dataArr);

                $('#container').highcharts({
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                  },
                  title: {
                    text: 'Pie Chart'//CHANGE
                  },
                  // Default to <span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>
                  tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>' //CHANGE Value Unit: {point.percentage:.1f} unit EX: Employee
                  },
                
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.y} '+jsObj.columnNames[2] //CHANGE Value unit: {point.y} unit EX: Employee
                      }
                    }
                  },
                  series: [{
                    type: 'pie',
                    name: jsObj.columnNames[2], //CHANGE Key name EX: Employees
                    data: dataArr //CHANGE
                  }]
                });
              };
            }
        };
    });
})();

