//author: Di Wu
(function () {
    'use strict';
    beaker.bkoDirective("d3_bubble", function () {
      return {
        template: '<div id="container"></div>',
        link: function (scope, element, attrs) {

          var jsObj = scope.model.getCellModel();
          var colName = jsObj.columnNames[2];
          var myjsonHead = '{"name": "' + colName + '","children": [';
          var myjsonTail = ']}';
          //console.log(myjsonHead + myjsonTail);
          var myjsonBody = formJSONbody(jsObj.values.length);
          //console.log(myjsonBody);
          var myjson = myjsonHead + myjsonBody + myjsonTail;
          console.log(myjson);


          function formJSONbody(row) {
            var str = '';
            for(var i = 0; i < row; i++) {
              var arr = jsObj.values[i];
              str += '{"name": ' + '"' + jsObj.values[i][1].trim() + '"' + ', "size": ' + jsObj.values[i][2].trim() + "},";
            }
            return str.substring(0, str.length-1);
          }
          

//var myjson = '{"name": "flare","children": [{"name": "MergeEdge", "size": 10 }]}';

var myData = {"name": "flare","children": [{"name": "MergeEdge", "size": 10 }]};

var myData = {};

for () {
  myData.name = "flare"
  myData.children = [];
}


var diameter = 250,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("#container").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var root = JSON.parse(myjson);

//d3.json("flare.json", 
  var myFunc = function(error, root) {
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
    };
//});
myFunc(null, myData);

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");







        }
      };
    });
})();
