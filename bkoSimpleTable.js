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
    beaker.bkoDirective('SimpleTable', ["bkCellPluginManager", function (bkCellPluginManager) {
        return {
            template: '<div>'
            + '<select id=selectedOutput>'
            +   '<option value="table">Table</option>'
            +   '<option value="pie chart">Pie Chart</option>'
            + '</select></br>'
            + '<input type="button" ng-click="getOutputDisplay()" value="Run">'
            //+   '<form ng-sumbit="scope.myFunction()">'
            //+   'Chart Title: <input id="title" type="text"><br>'
            //+   'Unit:        <input id="unit" type="text"><br>'
            //+   '<input type="button" value="Submit" onclick="link.myFunction()">'
            //+   '<input type="submit" value="Submit">'
            //+   '</form>'
            + '<div id="container"></div>'
            + '</div>',
            controller: function ($scope) {
                $scope.getShareMenuPlugin = function () {
                    // the following cellType needs to match
                    //plugin.cellType = "bkTableDisplay"; in dynamically loaded outputDisplay_bkTableDisplay.js
                    var cellType = "bkTableDisplay";
                    return bkCellPluginManager.getPlugin(cellType);
                };
                $scope.$watch("getShareMenuPlugin()", function (getShareMenu) {
                    if (getShareMenu && $scope.model.resetShareMenuItems) {
                        $scope.model.resetShareMenuItems(getShareMenu($scope));
                    }
                });

                var onDestroy = function () {
                    //$scope.dt.fnDestroy();
                    delete $scope.grid;
                };
                $scope.$on("$destroy", onDestroy);
                $scope.getColumns = function () {
                    var columns = _.map($scope.model.getCellModel().columnNames, function (col) {
                        return {id: col, name: col, field: col, sortable: true};
                    });
                    var elm = document.createElement('div');
                    $(elm).addClass('ui-widget').addClass('slick-cell');
                    var getWidth = function (text) {
                        $(elm).html(text);
                        $('body').append(elm);
                        var width = $(elm).width();
                        $(elm).remove();
                        return width + 10;
                    };

                    _.each(columns, function (col) {
                        col.width = getWidth(col.field);
                    });
                    var r, c, row, col, width;
                    for (r = 0; r < $scope.model.getCellModel().values.length && r < 10; ++r) {
                        row = $scope.model.getCellModel().values[r];
                        for (c = 0; c < columns.length; c++) {
                            width = getWidth(row[c]);
                            col = columns[c];
                            if (width > col.width) {
                                col.width = width;
                            }
                        }
                    }
                    var timeCol = _.find(columns, function (it) {
                        return it.field === "time";
                    });
                    if (timeCol) {
                        // if the server provides the converted timeStrings, just use it
                        if ($scope.model.getCellModel().timeStrings) {
                            var timeStrings = $scope.model.getCellModel().timeStrings;
                            timeCol.width = getWidth(timeStrings[0]);
                            timeCol.formatter = function (row, cell, value, columnDef, dataContext) {
                                return timeStrings[row];
                            };
                        } else {
                            timeCol.width = getWidth("20110101 23:00:00.000 000 000");
                            timeCol.formatter = function (row, cell, value, columnDef, dataContext) {
                                var nano = value % 1000;
                                var micro = (value / 1000) % 1000;
                                var milli = value / 1000 / 1000;
                                var d = new Date(milli);
                                var doubleDigit = function (integer) {
                                    if (integer < 10) {
                                        return "0" + integer;
                                    }
                                    return integer.toString();
                                };
                                var trippleDigit = function (integer) {
                                    if (integer < 10) {
                                        return "00" + integer;
                                    } else if (integer < 100) {
                                        return "0" + integer;
                                    }
                                    return integer.toString();
                                };
                                var result = "";
                                result += d.getFullYear() + doubleDigit(d.getMonth() + 1) + doubleDigit(d.getDate());
                                result += " ";
                                result += doubleDigit(d.getHours()) + ":" + doubleDigit(d.getMinutes()) + ":" + doubleDigit(d.getSeconds());
                                result += ".";
                                result += trippleDigit(d.getMilliseconds());
                                result += " " + trippleDigit(micro);
                                result += " " + trippleDigit(nano);
                                return result;
                            };
                        }
                    }
                    return columns;
                };
                $scope.getOptions = function () {
                    var options = {
                        enableCellNavigation: true,
                        enableColumnReorder: true,
                        multiColumnSort: true,
                        selectedCellCssClass: 'bk-table-cell-selected'
                        //forceFitColumns: true
                    };
                    return options;
                };
                $scope.getData = function () {
                    var data = _.map($scope.model.getCellModel().values, function (row) {
                        return _.object($scope.model.getCellModel().columnNames, row);
                    });
                    return data;
                };
            },
            link: function (scope, element, attrs) {
 
              //var title = document.getElementById("title").value;  
              //var unit = document.getElementById("unit").value;
              scope.getOutputDisplay=function(){
                var outputType = document.getElementById("selectedOutput");
                if(outputType.selectedIndex==0){
                  outputTable();
                }
                else if(outputType.selectedIndex==1) {
                  outputPieChart();
                }
              };
              function outputTable(){

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

              //function myFunction (){ 
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
    }]);
})();

