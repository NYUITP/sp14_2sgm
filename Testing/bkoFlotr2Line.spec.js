/*
 *  Copyright 2014 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 //author: Di Wu
describe("Beaker Line: iPython input (no customized setting)", function() {

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

    var outputModel = 
    { 
      type: "TableDisplay", 
      tableDisplayModel: 
      {
        columnNames: ["", "Country", "Population %"], 
        values: [ ["0", "   USA", "  5"] , ["1", " India", " 10"] ]
      }, 
      columnNames: ["", "Country", "Population %"], 
      values: [ ["0", "   USA", "  5"] , ["1", " India", " 10"] ]
    };
    /*
    var outputModel = 
    { 
      type: "TableDisplay", 
      columnNames: ["food", "drink"], 
      values: [ ["2.0", "10.0"] , ["3.0", "-10.0"] ]
    };
    */
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
      expect(myScope.model.getCellModel().columnNames).toEqual(["", "Country", "Population %"]);
      expect(myScope.model.getCellModel().values).toEqual([ [0, "   USA", 5] , [1, " India", 10] ]);
    });
    
    it("check output object", function() {
      myScope.xaxis = {colIndex:0, colName:""};
      myScope.yAxisOptions[1].colSelected = true;
      myScope.$digest();
      expect(myScope.output.inObj).toEqual(myScope.model.getCellModel());
      expect(myScope.output.processedData).toEqual([ {data:[[0,5],[1,10]], label: "Population %", lines:{show:true}, points:{show:true}} ]);
      expect(myScope.output.graphSetting.xaxis.min).toBe(0);
      expect(myScope.output.graphSetting.xaxis.max).toBe(1);
      expect(myScope.output.graphSetting.xaxis.noTicks).toBe(5);
      expect(myScope.output.graphSetting.yaxis.min).toBe(5);
      expect(myScope.output.graphSetting.yaxis.max).toBe(10);
      expect(myScope.output.graphSetting.yaxis.noTicks).toBe(5);
    });




});
