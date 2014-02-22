(function () {
    'use strict';
    beaker.bkoDirective("SimpleExample", function () {
        return {
            template: "<div>" +
                "<span>Hi, {{ name }}</span>" +
                "<img src='http://www.twosigma.com/assets/images/logo.png'>" +
                "<span>The raw output model is {{rawoutput}}</span>" +
                "</div>",
            link: function (scope, element, attrs) {
                scope.name = "there";
                scope.rawOutput = JSON.stringify(scope.model.getCellModel());
            }
        };
    });
})();
