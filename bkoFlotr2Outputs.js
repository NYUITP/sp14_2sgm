//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Outputs", function () {
      return {
            template: '<div id="html">'
            + '<select ng-model=selectedOutput>'
            +   '<option value="bubble">Bubble Chart</option>'
            +   '<option value="pie">Pie Chart</option>'
            +   '<option value="line">Line Chart</option>'
            + '</select></br>'
            + '<input type="button" ng-click="getOutputType()" value="Select">'
            + '</div>',
        link: function (scope, element, attrs) {

          function getOutputType(){
              var 
                  outputType = document.getElementById("selectedOutput"),
                  type = outputType.options[outputType.selectedIndex].value;
/*
                if(type=="bubble"){
                  //beaker.registerOutputDisplay("TableDisplay", ['flotr2_bubble'], 0);
                }
                else if(type=="pie") {
                  //beaker.registerOutputDisplay("TableDisplay", ['flotr2_pie'], 0);
                }
                else if(type=="line") {
                  //beaker.registerOutputDisplay("TableDisplay", ['flotr2_line'], 0);
                }
              }  
*/              
          }        

















        }
      };
    });
})();