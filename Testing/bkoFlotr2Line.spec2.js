
describe("Beaker Line: R input (no customized setting)", function() {

  var fooService;
  var bkoLine;
  var myScope;
  var element;

  // 'beforeEach' will run before each 'it', see below
  beforeEach(module("M_bkOutputDisplay"));
  beforeEach(inject(function(_outputDisplayFactory_, _outputDisplayService_, $compile, $rootScope) {

    bkoLine = _outputDisplayFactory_.getImpl("flotr2Line");

    // however, bkoFoo is just the definition, you need to instantiate it by creating an element
    element = angular.element(
        "<bk-output-display model='outputDisplayModel' type='flotr2Line'></bk-output-display>");

    // and you need to get a new scope that is going to be associated with the OutputDisplay
    var scope = $rootScope.$new();

    var outputModel = RInput;
    var RInput = 
    { 
      type: "TableDisplay", 
      columnNames: ["food", "drink"], 
      values: [ ["2.0", "10.0"] , ["3.0", "-10.0"] ]
    };
    
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

    it("should get cell model", function() {
      expect(myScope.model.getCellModel().type).toBe("TableDisplay");
      expect(myScope.model.getCellModel().columnNames).toEqual(["food", "drink"]);
      expect(myScope.model.getCellModel().values).toEqual([2, 10] , [3, -10]);
    });
    
    it("check output object", function() {
      myScope.xaxis = {colIndex:0, colName:"food"};
      myScope.yAxisOptions[1].colSelected = true;
      myScope.$digest();
      expect(myScope.output.inObj).toEqual(myScope.model.getCellModel());
      expect(myScope.output.processedData).toEqual([ {data:[[2,10],[3,-10]], label: "drink", lines:{show:true}, points:{show:true}} ]);
      expect(myScope.output.graphSetting.xaxis.min).toBe(2);
      expect(myScope.output.graphSetting.xaxis.max).toBe(3);
      expect(myScope.output.graphSetting.xaxis.noTicks).toBe(5);
      expect(myScope.output.graphSetting.yaxis.min).toBe(-10);
      expect(myScope.output.graphSetting.yaxis.max).toBe(10);
      expect(myScope.output.graphSetting.yaxis.noTicks).toBe(5);
    });

});
