
describe("Beaker Line: Working iPython input (Large # Of Numeric Columns)", function() {

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

    var iPythonInput =
    { 
      type: "TableDisplay", 
      tableDisplayModel: 
      {
        columnNames: ['', 'a1', 'a2', 'a3', 'a4','a5','a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14', 'a15', 'a16', 'a17', 'a18'], 
        values: [
[0, 7, 5, 15,7, 5, 15,7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[1, 14, 10, 30,14, 10, 30,14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[2, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[3, 23, 20, 5, 23, 20, 5, 23, 20, 5, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[4, 1,30, 25,1,30, 25,1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25],
[5, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[6, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[7, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20,21, 15, 20,21, 15, 20], 
[8, 23,20, 5, 23,20, 5, 23,20, 5, 23,20, 5,23,20, 5,23,20, 5], 
[9, 7, 5, 15,7, 5, 15,7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[10, 14, 10, 30,14, 10, 30,14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[11, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[12, 23, 20, 5, 23, 20, 5, 23, 20, 5, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[13, 1,30, 25,1,30, 25,1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25],
[14, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[15, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[16, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20,21, 15, 20,21, 15, 20], 
[17, 23,20, 5, 23,20, 5, 23,20, 5, 23,20, 5,23,20, 5,23,20, 5],
[18, 23, 20, 5, 23, 20, 5, 23, 20, 5, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[19, 1,30, 25,1,30, 25,1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25],
[20, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[21, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[22, 1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25]
]
      }, 
      columnNames: ['', 'a1', 'a2', 'a3', 'a4','a5','a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14', 'a15', 'a16', 'a17', 'a18'], 
      values: [
[0, 7, 5, 15,7, 5, 15,7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[1, 14, 10, 30,14, 10, 30,14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[2, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[3, 23, 20, 5, 23, 20, 5, 23, 20, 5, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[4, 1,30, 25,1,30, 25,1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25],
[5, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[6, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[7, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20,21, 15, 20,21, 15, 20], 
[8, 23,20, 5, 23,20, 5, 23,20, 5, 23,20, 5,23,20, 5,23,20, 5], 
[9, 7, 5, 15,7, 5, 15,7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[10, 14, 10, 30,14, 10, 30,14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[11, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[12, 23, 20, 5, 23, 20, 5, 23, 20, 5, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[13, 1,30, 25,1,30, 25,1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25],
[14, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[15, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[16, 21, 15, 20, 21, 15, 20, 21, 15, 20, 21, 15, 20,21, 15, 20,21, 15, 20], 
[17, 23,20, 5, 23,20, 5, 23,20, 5, 23,20, 5,23,20, 5,23,20, 5],
[18, 23, 20, 5, 23, 20, 5, 23, 20, 5, 21, 15, 20, 21, 15, 20, 21, 15, 20], 
[19, 1,30, 25,1,30, 25,1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25],
[20, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15, 7, 5, 15], 
[21, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30, 14, 10, 30], 
[22, 1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25, 1,30, 25]
]
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

    myScope = element.find('.MyLineClass').scope();
  }));

    it("number of y options limit 15", function() {
      var numSelected = 0;
      for(var i = 0; i < myScope.yAxisOptions.length; i++) {
        if(myScope.yAxisOptions[i].colSelected===true)
          numSelected+=1;
      }
      expect(numSelected).toBe(15);

    });

});
