(function () {
    'use strict';
    beaker.bkoDirective("SimpleTable", function () {
        return {
            template: '<div>'
            +   '<form ng-submit="link">'
            +   'Chart Title: <input id="title" type="text"><br>'
            +   'Unit:        <input id="unit" type="text"><br>'
            +   '<input type="submit" value="Submit">'
            +   '</form>'
            + '<div id="container"></div>'
            + '</div>',
            
            link: function (scope, element, attrs) {
              //scope.x=document.getElementById("container")  //Find the element
              //scope.x.innerHTML="Hello JavaScript";  
              var title = document.getElementById("title").value;  
              var unit = document.getElementById("unit").value;

              $('#container').highcharts({
                chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false
                },
                title: {
                  text: 'Browser market shares at a specific website, 2010' //CHANGE
                },
                /* Default to <span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>
                tooltip: {
                  pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>' //CHANGE Value Unit: {point.percentage:.1f} unit EX: Employee
                },
                */
                plotOptions: {
                  pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                      enabled: true,
                      color: '#000000',
                      connectorColor: '#000000',
                      format: '<b>{point.name}</b>: {point.y}' //CHANGE Value unit: {point.y} unit EX: Employee
                      
                    }
                  }
                },
                series: [{
                  type: 'pie',
                  name: 'Browser share', //CHANGE Key name EX: City
                  data: [ //CHANGE
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    ['Chrome',  12.8],
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0.7]
                  ]
                }]
              });
            }
        };
    });
})();
