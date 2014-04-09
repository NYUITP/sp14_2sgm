//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Outputs", function () {
      return {
            template: '<div>'
            +  '<b>Select Chart Type</b>'
            +  '<select ng-model="chartType">'
            +   '<option value="bubble.html">Bubble Chart</option>'
            +   '<option value="pie.html">Pie Chart</option>'
            +   '<option value="line.html">Line Chart</option>'
            + '</select></br>'
            + '<div ng-include="getChartType()"></div></div>',
        link: function (scope, element, attrs) {

          scope.getChartType = function(){
            return scope.chartType; 
          }        

















        }
      };
    });
})();