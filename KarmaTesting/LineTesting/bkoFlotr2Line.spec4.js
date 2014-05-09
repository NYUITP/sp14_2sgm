
describe("Beaker Line: Invalid R input", function() {

  var fooService;
  var bkoLine;
  var myScope;
  var element;

  // 'beforeEach' will run before each 'it', see below
  beforeEach(module("M_bkOutputDisplay"));
  beforeEach(module("M_generalUtils"));
  beforeEach(inject(function(_outputDisplayFactory_, _outputDisplayService_, $compile, $rootScope) {

    bkoLine = _outputDisplayFactory_.getImpl("flotr2Line");

    // however, bkoFoo is just the definition, you need to instantiate it by creating an element
    element = angular.element(
        "<bk-output-display model='outputDisplayModel' type='flotr2Line'></bk-output-display>");

    // and you need to get a new scope that is going to be associated with the OutputDisplay
    var scope = $rootScope.$new();

    var RInput = 
    { 
      type: "TableDisplay", 
      status: "FINISHED",
      columnNames: ["food", "boolean"], 
      values: [ [2, "true"] , [10.5, "false"] ]
    };
    // { 
    //   type: "TableDisplay", 
    //   status: "FINISHED",
    //   columnNames: ["food"], 
    //   values: [ [2] , [10.5] ]
    // };

    var outputModel = RInput;

    scope.outputDisplayModel = {
      getCellModel: function() {
        return outputModel;
      }
    };

    // now compile it, Angular creates the OutputDisplay
    $compile(element)(scope);

    // $digest ensures things are refreshed
    $rootScope.$digest();

    myScope = element.find('.MyLineClass').scope();
  }));

    it("check input data error", function() {
    
      var id, html;

      id = myScope.randID + 'initError';
      myScope.$digest();
      html = element.find('#' + id).html();
      expect(html).toEqual("Please have at least two numeric columns.");

    });

});
