
describe("Beaker Pie: Working iPython input", function() {

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

    var iPythonInput =
    { 
      type: "TableDisplay", 
      tableDisplayModel: 
      {
        columnNames: ["", "Country", "Population %", "Sales"], 
        values: [ [0, "   USA", 5, 30] , [1, " India", 10, 60] ]
      }, 
      columnNames: ["", "Country", "Population %", "Sales"], 
      values: [ [0, "   USA", 5, 30] , [1, " India", 10, 60] ]
    };

    var outputModel = iPythonInput;
    
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
      expect(myScope.model.getCellModel().columnNames).toEqual(["", "Country", "Population %", "Sales"]);
      expect(myScope.model.getCellModel().tableDisplayModel.values).toEqual([ [0, "   USA", 5, 30] , [1, " India", 10, 60] ]);

    });
    
    it("check default graph", function() {

      expect(myScope.output[0].inObj).toEqual(myScope.model.getCellModel());
      expect(myScope.output[0].processedData).toEqual([ {data:[[0,0]], label: "USA"},
                                                     {data:[[0,1]], label: "India"}]);
      expect(myScope.pieGroup).toEqual([{id: 0, title: "[Category: Country]\t[Size: ]", size: {colIndex: 0, colName: ''}, category: {colIndex: 1, colName: 'Country'}}]);

    });

    it("check title inputs", function() {

      myScope.pieGroup[0].title = "Pie Graph!!";
      myScope.$digest();
      expect(myScope.output[0].graphSetting.title).toEqual("Pie Graph!!");

    });
      
    it("check pie add/remove and edit size/category", function() {
      
      myScope.pieGroup[0].title = "Pie Graph!!";
      myScope.pieGroup[0].size = {colIndex: 2, colName: "Population %"};
      myScope.pieGroup[0].category = {colIndex: 0, colName: ""};
      myScope.$digest();
      expect(myScope.output[0].processedData).toEqual([ {data:[[0, 5]], label: 0}, {data:[[0, 10]], label: 1} ]);
      expect(myScope.pieGroup).toEqual([{id: 0, title: "Pie Graph!!", size: {colIndex: 2, colName: "Population %"}, category: {colIndex: 0, colName: ""}}]);

      myScope.addPie(0);
      myScope.$digest();
      expect(myScope.pieGroup).toEqual([ {id: 0, title: "[Category: Country]\t[Size: ]", size: {colIndex: 0, colName: ''}, category: {colIndex: 1, colName: 'Country'} },
                                         {id: 1, title: "Pie Graph!!", size:{colIndex: 2, colName: "Population %"}, category: {colIndex: 0, colName: ""} }]);
      expect(myScope.output[0].processedData).toEqual([ {data:[[0, 0]], label: "USA"}, {data:[[0, 1]], label: "India"} ]);
      expect(myScope.output[1].processedData).toEqual([ {data:[[0, 5]], label: 0}, {data:[[0, 10]], label: 1} ]);

      myScope.removePie(0);
      myScope.$digest();
      expect(myScope.pieGroup).toEqual([ { id: 0, title: "Pie Graph!!", size:{colIndex: 2, colName: "Population %"}, category: {colIndex: 0, colName: ""} } ]);
      expect(myScope.output[0].processedData).toEqual([ {data:[[0, 5]], label: 0}, {data:[[0, 10]], label: 1} ]);
    });

});
