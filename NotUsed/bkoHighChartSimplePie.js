//Author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("HighChart_PieChart", function () {
      return {
        template: '<div id="container"></div>',
        link: function (scope, element, attrs) {
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
        }
      };
    });
})();
