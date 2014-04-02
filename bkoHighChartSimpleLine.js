//@Author: Pallavi Mane
(function () {
    'use strict';
    beaker.bkoDirective("HighChart_LineChart", function () {
 return {
	template: '<div id="container"></div>',
	link: function (scope, element, attrs) {
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
		    var out = obj.values[i][j].trim();
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
         }
     };
    });
})();
