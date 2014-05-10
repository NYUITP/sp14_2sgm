
describe("Beaker Pie: Working R input", function() {

  var fooService;
  var bkoPie;
  var myScope;
  var element;

  // 'beforeEach' will run before each 'it', see below
  beforeEach(module("M_bkOutputDisplay"));
  beforeEach(module("M_generalUtils"));
  beforeEach(inject(function(_outputDisplayFactory_, _outputDisplayService_, $compile, $rootScope) {

    bkoPie = _outputDisplayFactory_.getImpl("flotr2Pie");

    // however, bkoFoo is just the definition, you need to instantiate it by creating an element
    element = angular.element(
        "<bk-output-display model='outputDisplayModel' type='flotr2Pie'></bk-output-display>");

    // and you need to get a new scope that is going to be associated with the OutputDisplay
    var scope = $rootScope.$new();

    var RInput = 
    { 
      type: "TableDisplay", 
      status: "FINISHED",
      columnNames: ["food", "drink", "boolean", "snack"], 
      values: [ [2, 3.5, "true", 14] , [10.5, -30, "false", 7] ]
    };

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

    myScope = element.find('.MyPieClass').scope();
  }));

    it("should get cell model", function() {

      expect(myScope.model.getCellModel().type).toBe("TableDisplay");
      expect(myScope.model.getCellModel().columnNames).toEqual(["food", "drink", "boolean", "snack"]);
      expect(myScope.model.getCellModel().values).toEqual([ [2, 3.5, "true", 14] , [10.5, -30, "false", 7] ]);

    });
    
    it("check default graph", function() {

      expect(myScope.output[0].inObj).toEqual(myScope.model.getCellModel());
      expect(myScope.output[0].processedData).toEqual([ {data:[[0,2]], label: 3.5}, {data:[[0,10.5]], label: -30} ]);
      expect(myScope.pieGroup).toEqual([{id: 0, title: "[Category: drink]\t[Size: food]", size: {colIndex: 0, colName: 'food'}, category: {colIndex: 1, colName: 'drink'}}]);

    });

    it("check title inputs", function() {

      myScope.pieGroup[0].title = "Pie Graph!!";
      myScope.$digest();
      expect(myScope.output[0].graphSetting.title).toEqual("Pie Graph!!");

    });
      
    it("check pie add/remove and edit size/category", function() {
      
      myScope.pieGroup[0].title = "Pie Graph!!";
      myScope.pieGroup[0].size = {colIndex: 3, colName: "snack"};
      myScope.pieGroup[0].category = {colIndex: 2, colName: "boolean"};
      myScope.$digest();
      expect(myScope.output[0].processedData).toEqual([ {data:[[0, 14]], label: "true"}, {data:[[0, 7]], label: "false"} ]);
      expect(myScope.pieGroup).toEqual([{id: 0, title: "Pie Graph!!", size: {colIndex: 3, colName: "snack"}, category: {colIndex: 2, colName: "boolean"}}]);

      myScope.addPie(0);
      myScope.$digest();
      expect(myScope.pieGroup).toEqual([ {id: 0, title: "[Category: drink]\t[Size: food]", size: {colIndex: 0, colName: 'food'}, category: {colIndex: 1, colName: 'drink'}},
                                         {id: 1, title: "Pie Graph!!", size: {colIndex: 3, colName: "snack"}, category: {colIndex: 2, colName: "boolean"}}]);
      expect(myScope.output[0].processedData).toEqual([ {data:[[0,2]], label: 3.5}, {data:[[0,10.5]], label: -30} ]);
      expect(myScope.output[1].processedData).toEqual([ {data:[[0, 14]], label: "true"}, {data:[[0, 7]], label: "false"} ]);

      myScope.removePie(0);
      myScope.$digest();
      expect(myScope.pieGroup).toEqual([ {id: 0, title: "Pie Graph!!", size: {colIndex: 3, colName: "snack"}, category: {colIndex: 2, colName: "boolean"}} ]);
      expect(myScope.output[0].processedData).toEqual([ {data:[[0, 14]], label: "true"}, {data:[[0, 7]], label: "false"} ]);
    });

});
