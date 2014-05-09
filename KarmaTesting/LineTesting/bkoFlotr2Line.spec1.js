
describe("Beaker Line: iPython input", function() {

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

    myScope = element.find('.MyLineClass').scope();
  }));

    it("should get cell model", function() {

      expect(myScope.model.getCellModel().type).toBe("TableDisplay");
      expect(myScope.model.getCellModel().columnNames).toEqual(["", "Country", "Population %", "Sales"]);
      expect(myScope.model.getCellModel().values).toEqual([ [0, "   USA", 5, 30] , [1, " India", 10, 60] ]);

    });
    
    it("check default graph", function() {

      expect(myScope.output.inObj).toEqual(myScope.model.getCellModel());
      expect(myScope.output.processedData).toEqual([ {data:[[0, 5],[1, 10]], label: "Population %", lines:{show:true}, points:{show:true}},
                                                     {data:[[0, 30],[1, 60]], label: "Sales", lines:{show:true}, points:{show:true}}]);
      expect(myScope.output.graphSetting.xaxis.min).toBe(0);
      expect(myScope.output.graphSetting.xaxis.max).toBe(1);
      expect(myScope.xinterval).toBe(0.2);
      expect(myScope.output.graphSetting.xaxis.noTicks).toBe(5);
      expect(myScope.output.graphSetting.yaxis.min).toBe(5);
      expect(myScope.output.graphSetting.yaxis.max).toBe(60);
      expect(myScope.yinterval).toBe(11);
      expect(myScope.output.graphSetting.yaxis.noTicks).toBe(5);

    });

    it("check axis inputs", function() {

      myScope.xaxis = {colIndex:2, colName:"Population %"};
      myScope.yAxisOptions[1].colSelected = false;
      myScope.yAxisOptions[2].colSelected = true;
      myScope.$digest();

      expect(myScope.output.inObj).toEqual(myScope.model.getCellModel());
      expect(myScope.output.processedData).toEqual([ {data:[[5,30],[10,60]], label: "Sales", lines:{show:true}, points:{show:true}} ]);
      expect(myScope.output.graphSetting.xaxis.min).toBe(5);
      expect(myScope.output.graphSetting.xaxis.max).toBe(10);
      expect(myScope.xinterval).toBe(1);
      expect(myScope.output.graphSetting.xaxis.noTicks).toBe(5);
      expect(myScope.output.graphSetting.yaxis.min).toBe(30);
      expect(myScope.output.graphSetting.yaxis.max).toBe(60);
      expect(myScope.yinterval).toBe(6);
      expect(myScope.output.graphSetting.yaxis.noTicks).toBe(5);

    });

    it("check title inputs", function() {

      myScope.title = "Line Graph!!";
      myScope.xtitle = "Index!!";
      myScope.ytitle = "Population!!";
      myScope.$digest();
      expect(myScope.output.graphSetting.title).toEqual("Line Graph!!");
      expect(myScope.output.graphSetting.xaxis.title).toEqual("Index!!");
      expect(myScope.output.graphSetting.yaxis.title).toEqual("Population!!");

    });
      
    it("check bound inputs", function() {
      
      myScope.autoRange = false;
      myScope.xmin = -5;
      myScope.xmax = 5;
      myScope.xinterval = 2;
      myScope.ymin = -5;
      myScope.ymax = 5;
      myScope.yinterval = 2;
      myScope.$digest();

      expect(myScope.output.graphSetting.xaxis.min).toBe(-5);
      expect(myScope.output.graphSetting.xaxis.max).toBe(5);
      expect(myScope.output.graphSetting.xaxis.noTicks).toBe(5);
      expect(myScope.output.graphSetting.yaxis.min).toBe(-5);
      expect(myScope.output.graphSetting.yaxis.max).toBe(5);
      expect(myScope.output.graphSetting.yaxis.noTicks).toBe(5);

    });

    it("check UI input errors: X Axis", function() {

      var id, html;

      id = myScope.randID + 'xError';
      myScope.xaxis = undefined;
      myScope.checkXaxis(myScope.xaxis);
      myScope.$digest();
      html = element.find('#' + id).html();
      expect(html).toEqual("Select the X axis.");

      myScope.xaxis = {colIndex:2, colName:"Population %"};
      myScope.$digest();
      html = element.find('#' + id).html();
      expect(html).toEqual("");

    });

    it("check UI input errors: Y Axis", function() {

      var id, html;

      id = myScope.randID + 'yError';
      myScope.unselectAllYAxis();
      myScope.$digest();
      html = element.find('#' + id).html();
      expect(html).toEqual("Select at least one Y axis.");

      myScope.selectAllYAxis();
      myScope.$digest();
      html = element.find('#' + id).html();
      expect(html).toEqual("");
      
    });

    it("check UI input errors: bound not numeric", function() {

      var id1, id2, html1, html2;
      id1 = myScope.randID + 'xMinError';
      id2 = myScope.randID + 'yMaxError';
      myScope.autoRange = false;
      myScope.xmin = 'Hello World!';
      myScope.ymax = '* 234';
      myScope.$digest();
      html1 = element.find('#' + id1).html();
      expect(html1).toEqual("Enter numeric values.");
      html2 = element.find('#' + id2).html();
      expect(html2).toEqual("Enter numeric values.");

      myScope.xmin = '-2';
      myScope.ymax = 234;
      myScope.$digest();
      html1 = element.find('#' + id1).html();
      expect(html1).toEqual("");
      html2 = element.find('#' + id2).html();
      expect(html2).toEqual("");

    });

    it("check UI input errors: Check max >= min", function() {

      var id1, id2, html1, html2;
      id1 = myScope.randID + 'xMinError';
      id2 = myScope.randID + 'xMaxError';
      myScope.autoRange = false;
      myScope.xmin = 10;
      myScope.xmax = 9.999;
      myScope.$digest();
      html1 = element.find('#' + id1).html();
      expect(html1).toEqual("Max is smaller than Min.");
      html2 = element.find('#' + id2).html();
      expect(html2).toEqual("Max is smaller than Min.");

      myScope.xmin = 10;
      myScope.xmax = 10.0001;
      myScope.$digest();
      html1 = element.find('#' + id1).html();
      expect(html1).toEqual("");
      html2 = element.find('#' + id2).html();
      expect(html2).toEqual("");

    });

    it("check UI input errors: Check Interval > 0", function() {

      var id1, id2, html1, html2;
      id1 = myScope.randID + 'xIntervalError';
      id2 = myScope.randID + 'yIntervalError';
      myScope.autoRange = false;
      myScope.xinterval = 0;
      myScope.yinterval = -0.00001;
      myScope.$digest();
      html1 = element.find('#' + id1).html();
      expect(html1).toEqual("Interval &lt;= 0.");
      html2 = element.find('#' + id2).html();
      expect(html2).toEqual("Interval &lt;= 0.");

      myScope.xinterval = 1;
      myScope.yinterval = 0.00001;
      myScope.$digest();
      html1 = element.find('#' + id1).html();
      expect(html1).toEqual("");
      html2 = element.find('#' + id2).html();
      expect(html2).toEqual("");

    });

});
