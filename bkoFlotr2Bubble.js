//Author: Pallavi Mane
//Date: 04/16/2014
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Bubble", function () {
 return {
	template: '<div id="main">'
            + '<b>Title</b> <input type="text" id="title" size="15"><br>'
            + '<b>X Axis</b>'
            + '<select id=selectX>'
            + '</select>&nbsp;'
            + '<b>Y Axis</b>'
            + '<select id=selectY>'
            + '</select>&nbsp;'
	    + '<b>Bubble Size</b>'
            + '<select id=selectZ>'
            + '</select><br>'
	    + '<b><i><u>Set X-Y Bounds</u></i></b><br>'
            + '<b>X Range</b> Min: <input type="text" class="textgroup" id="xmin" style="width:50px">     Max: <input type="text" class="textgroup"  id="xmax" style="width:50px"> Interval: <input type="text" class="textgroup" id="xinterval" style="width:50px"><br>'
            + '<b>Y Range</b>     Min: <input type="text" class="textgroup" id="ymin" style="width:50px">     Max: <input type="text" class="textgroup" id="ymax" style="width:50px"> Interval: <input type="text" class="textgroup" id="yinterval" style="width:50px"><br>'
            + 'Automatic Bounds&nbsp;&nbsp;<input type="checkbox" id="autoRange" checked="checked"><br></div>'
	    + '<input type="button" id="button" value="Show/Hide Configuration" style="height:30px; width:200px">'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div>',
	link: function (scope, element, attrs) {
		var flag = 0;
		$("#button").click(function(){
   			$("#main").toggle(1000);
	   	});

		var
	    	container = document.getElementById('container'),
	    	graph,
	    	jsObj = scope.model.getCellModel(),
	    	colNames = jsObj.columnNames,
	    	numCol = colNames.length,
	    	records = jsObj.values,
	    	numRecords = records.length,
	    	isNumCol = checkNumCol();
		flag = 0;

		function checkNumCol() {
		  var boolArr = [true], col, row;
		  for(col = 1; col < numCol; col++) {
		    for(row = 0; row < numRecords; row++) {
		      if(!isNumber(records[row][col])) {
			boolArr.push(false);
			break;
		      }
		    }
		    if(row==numRecords)
		      boolArr.push(true);
		  }
		  return boolArr;
		}		

		fillDropdown("selectX");
		fillDropdown("selectY");
		fillDropdown("selectZ");

		function fillDropdown(id) {
		  var 
		    element = document.getElementById(id),
		    html = '',
		    i;
		    for(i = 0; i < numCol; i++) {
		      if(isNumCol[i]){
			html = html + '<option value="' + i + '">' + colNames[i] + '</option>';
		      }
		    }
		   element.innerHTML = html;
		 }
	    
	  function checkRangeInput(range, min, max, interval) {
	  if(!isNumber(min) || !isNumber(max) || !isNumber(interval) ){ 
	    var r = confirm("Please enter numeric min, max and interval.");
	    if(r==true)
		flag = 0;
	    else
		flag = 1;
	   }

	  min = parseFloat(min);
	  max = parseFloat(max);
	  interval = parseFloat(interval);
	  if(min > max) 
	    abortJS(range + " Error: max is smaller than min.");
	  
	  if(interval <= 0) 
	    abortJS(range + " Error: interval cannot be smaller or equals to zero.");
	  
	  var ticks = Math.ceil(Math.abs(max - min) / interval);
	  return [min, max, ticks];
	}


	function abortJS(err) {
	  alert(err);
	  throw new Error(err);
	}

	function dataToChart(x, y, z) {
	  var
	    data = [],
	    point,
	    row;

          var totalColValue = getColumnTotal(z);

	  for(row = 0; row < numRecords; row++) {
		point = [records[row][x], records[row][y], parseInt(((records[row][z])/totalColValue)*100)];
		data.push(point);
	  }
	  return data;
	}


	function getColumnTotal(z)
	{
	    var total;
	    var value = 0;
  	    for(var row = 0; row < numRecords; row++) {
		value = value + parseInt(records[row][z]);
   	    }
	    return value;
	}

	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

		$('#selectX').change(function(){
			document.getElementById('selectX').selected=true;
		if(($("#selectY :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($('#autoRange').is(':checked'))) {
					textDisable();
					getOutputDisplay();
			}
		});
         	$('#selectY').change(function(){
			document.getElementById('selectX').selected=true;
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($('#autoRange').is(':checked'))) {
					textDisable();	      			   
					getOutputDisplay();
		  }
		});
	
		$('#selectZ').change(function(){
			document.getElementById('selectX').selected=true;
		if(($("#selectX :selected").text() != "") && ($("#selectY :selected").text() != "") && ($('#autoRange').is(':checked'))) {
					textDisable();	      			
					getOutputDisplay();
		  }
		});

		$('#title').change(function(){
		    if(($("#selectX :selected").text() != "") && ($("#selectY :selected").text() != "") && ($("#selectX :selected").text() != "") && ($('#autoRange').is(':checked'))) {
					textDisable();	      			
					getOutputDisplay();
		  }
		});
	
		$('#autoRange').change(function(){
		if($('#autoRange').is(':checked')){
			$('.textgroup').val('');
			textDisable();
			getOutputDisplay();
		}
		else {
			textEnable();
			$('#xmin').on('input',function(){
			    if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
				getOutputDisplay();
			     }
			}); 

			$('#xmax').on('input',function(){
			    if((($('#xmin').val()) != '') && (($('#ymin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
				getOutputDisplay();
			     }
			}); 

			$('#ymin').on('input',function(){
			    if((($('#xmax').val()) != '') && (($('#xmin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
				getOutputDisplay();
			     }
			}); 

			$('#ymax').on('input',function(){
			    if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#xmin').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
				getOutputDisplay();
			     }
			}); 

			$('#xinterval').on('input',function(){
			    if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#xmin').val()) != '') && (($('#ymax').val()) != '') && (($('#yinterval').val()) != '')){
				getOutputDisplay();
			     }
			}); 

			$('#yinterval').on('input',function(){
			    if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#xmin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '')){
				getOutputDisplay();
			     }
			});
	
		      }
		});


			


	function textDisable() {
	      $("#xmin").attr("disabled","disabled");
	      $("#xmax").attr("disabled","disabled");
	      $("#ymin").attr("disabled","disabled");
	      $("#ymax").attr("disabled","disabled");
	      $("#xinterval").attr("disabled","disabled");
	      $("#yinterval").attr("disabled","disabled");
	}
	
	function textEnable() {
	      $("#xmin").removeAttr("disabled");
	      $("#xmax").removeAttr("disabled");
	      $("#ymin").removeAttr("disabled");
	      $("#ymax").removeAttr("disabled");
	      $("#xinterval").removeAttr("disabled");
	      $("#yinterval").removeAttr("disabled");
	}


 	function getOutputDisplay(){
	  var container = document.getElementById('container');
	  var 
	    graphTitle = document.getElementById("title").value,
	    xaxis = document.getElementById("selectX"),
	    yaxis = document.getElementById("selectY"),
	    zaxis = document.getElementById("selectZ"),
	    colXIndex = parseInt(xaxis.options[xaxis.selectedIndex].value),
	    colYIndex = parseInt(yaxis.options[yaxis.selectedIndex].value),
	    colZIndex = parseInt(zaxis.options[zaxis.selectedIndex].value),
	    data = dataToChart(colXIndex, colYIndex, colZIndex),
	    autoRange = document.getElementById("autoRange").checked,
	    xvals, 
	    yvals; 
	    var largestX, largestY,smallestX,smallestY;

	     var checkAutoOption = $('#autoRange').is(':checked');
		 if(checkAutoOption){
				var xArr = [], yArr = [];
				for(var row = 0; row < numRecords; row++) {
				     xArr.push(records[row][colXIndex]);
				}
				for(var row = 0; row < numRecords; row++) {
				     yArr.push(records[row][colYIndex]);
				}
				 smallestX = Math.min.apply(null, xArr),
		    		 largestX = Math.max.apply(null, xArr);
				 smallestY = Math.min.apply(null, yArr),
		    		 largestY = Math.max.apply(null, yArr);


	  			 graph = Flotr.draw(container, [data], {
				    title: graphTitle,
				    bubbles : { show : true, baseRadius : 3 },
				    xaxis   : {title: colNames[colXIndex], min: smallestX - largestX, max: (2*largestX), noTicks: numRecords},
				    yaxis   : {title: colNames[colYIndex], min: smallestY - largestY, max: (2*largestY), noTicks: numRecords},
				    mouse: {
		      			     track: true
		    			   }
				 });
		}
		else {
			xvals = checkRangeInput("X Range", document.getElementById("xmin").value, document.getElementById("xmax").value, document.getElementById("xinterval").value); 
     			yvals = checkRangeInput("Y Range", document.getElementById("ymin").value, document.getElementById("ymax").value, document.getElementById("yinterval").value); 
			graph = Flotr.draw(container, [data], {
			    title: graphTitle,
			    bubbles : { show : true, baseRadius : 3 },
			    xaxis   : {title: colNames[colXIndex], min: xvals[0], max: xvals[1], noTicks: xvals[2]},
			    yaxis   : {title: colNames[colYIndex], min: yvals[0], max: yvals[1], noTicks: yvals[2]},
			    mouse: {
					track: true
				    }
			});	

		}
		
	    }

         }

     };
    });
})();
