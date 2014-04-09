//Author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("flotr2", function () {
      return {
            template: 'Hello<script src="script.js"></script>'
            + '<flotr2-outputs></flotr2-outputs>',
            //+ '<script type="text/ng-template id="bubble.html"><flotr2-bubble></flotr2-bubble></script>'
            + '<script type="text/ng-template id="pie.html"><flotr2-pie></flotr2-pie></script>'
            + '<script type="text/ng-template id="line.html"><flotr2-line></flotr2-line></script>',
        link: function (scope, element, attrs) {













        }
      };
    });
})();