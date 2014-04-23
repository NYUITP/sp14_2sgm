//Author: Pallavi Mane
//Date: 04/23/2014
(function () {
    'use strict';
    beaker.bkoDirective("flotr2Bubble", function () {
 return {
	template:'<span id="inputerror" class="label label-important"></span>'
	    + '<div id="allcontent">'
	    + '<input type="button" id="button" value="Show/Hide Configuration" class="btn btn-primary"><br><br>'
	    + '<div id="main" style="border:1.5px solid"><br>'
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
            + '<b>X Range</b> Min: <input type="text" id="xmin" style="width:50px"><span id="errorxmin" class="label label-important"></span>    Max: <input type="text" id="xmax" style="width:50px"><span id="errorxmax" class="label label-important"></span> Interval: <input type="text" id="xinterval" style="width:50px"><span id="errorxinterval" class="label label-important"></span><br>'
            + '<b>Y Range</b>     Min: <input type="text" id="ymin" style="width:50px"><span id="errorymin" class="label label-important"></span>     Max: <input type="text" id="ymax" style="width:50px"><span id="errorymax" class="label label-important"></span> Interval: <input type="text" id="yinterval" style="width:50px"><span id="erroryinterval" class="label label-important"></span><br>'
            + 'Automatic Bounds&nbsp;&nbsp;<input type="checkbox" id="autoRange" checked="checked"><br></div>'
            + '<div id="container" style="width:600px;height:384px;margin:8px auto"></div></div>',
	link: function (scope,element,attrs) {
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
			    if(row==numRecords){
			      boolArr.push(true);
			    }
			  }
			  return boolArr;
			}
	


		var totalNumCols = 0;
			for(var k =1;k<isNumCol.length;k++)
			{
				if(isNumCol[k] == true){
					totalNumCols = totalNumCols + 1;
				}
			}

			if(totalNumCols < 3){
				$('#inputerror').show();
				$('#allcontent').hide();
				$('#inputerror').html("Bubble Chart Requires min 3 numerical columns!!");

			}
			else{
	    			$('#inputerror').hide();
				$('#allcontent').show();
				chartDraw();
			}



		function isNumber(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		}

	function chartDraw(){

		fillDropdown("selectX");
		fillDropdown("selectY");
		fillDropdown("selectZ");
		textDisable();


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


		function getColumnTotal(column3)
		{
		    var total;
		    var value = 0;
	  	    for(var row = 0; row < numRecords; row++) {
			value = value + parseInt(records[row][column3]);
	   	    }
		    return value;
		}

		$('#selectX').change(function(){
			document.getElementById('selectX').selected=true;
		if(($("#selectY :selected").text() != "") && ($("#selectZ :selected").text() != "")){
			if($('#autoRange').is(':checked')) {
					textDisable();
			}
			getOutputDisplay();
		     }	

		});

         	$('#selectY').change(function(){
			document.getElementById('selectY').selected=true;
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "")){
			if($('#autoRange').is(':checked')) {
					textDisable();
			}
			getOutputDisplay();
		  }
		});
	
		$('#selectZ').change(function(){
			document.getElementById('selectZ').selected=true;
		if(($("#selectX :selected").text() != "") && ($("#selectY :selected").text() != "")){
			if($('#autoRange').is(':checked')) {
					textDisable();
			}
			getOutputDisplay();
		  }
		});

		$('#title').change(function(){
		if(($("#selectX :selected").text() != "") && ($("#selectY :selected").text() != "") && ($("#selectX :selected").text() !=  ""))
			getOutputDisplay();
		});
	
		$('#autoRange').change(function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "")){
			if($('#autoRange').is(':checked')){
				textDisable();
				getOutputDisplay();
			}
			else{
				textEnable();
			}
		    }
		});
	
		$('#xmin').on('input',function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "") && !($('#autoRange').is(':checked'))){
				if(($('#xmin').val()) == '' || isNaN($('#xmin').val())){
					$('#errorxmin').show();					
					$('#errorxmin').html("Only Numbers allowed");
					
				}
				else if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
					$('#errorxmin').hide();
					getOutputDisplay();
				}
			}
		}); 

		$('#xmax').on('input',function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "") && !($('#autoRange').is(':checked'))){
				if(($('#xmax').val()) == '' || isNaN($('#xmax').val())){
					$('#errorxmax').show();					
					$('#errorxmax').html("Only Numbers allowed");
					
				}
				else if((($('#xmin').val()) != '') && (($('#ymin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
					$('#errorxmax').hide();
					getOutputDisplay();
			        }
			}				
		}); 

		$('#ymin').on('input',function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "") && !($('#autoRange').is(':checked'))){
				if(($('#ymin').val()) == '' || isNaN($('#ymin').val())){
					$('#errorymin').show();					
					$('#errorymin').html("Only Numbers allowed");
					
				}
				else if((($('#xmax').val()) != '') && (($('#xmin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
					$('#errorymin').hide();
					getOutputDisplay();
				     }
			}
		}); 

		$('#ymax').on('input',function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "") && !($('#autoRange').is(':checked'))){
				if(($('#ymax').val()) == '' || isNaN($('#ymax').val())){
					$('#errorymax').show();					
					$('#errorymax').html("Only Numbers allowed");
					
				}
				else if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#xmin').val()) != '') && (($('#xinterval').val()) != '') && (($('#yinterval').val()) != '')){
					$('#errorymax').hide();
					getOutputDisplay();
				     }
			}
		}); 

		$('#xinterval').on('input',function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "") && !($('#autoRange').is(':checked'))){
				if(($('#xinterval').val()) == '' || isNaN($('#xinterval').val())){
					$('#errorxinterval').show();					
					$('#errorxinterval').html("Only Numbers allowed");
					
				}
				else if(($('#xinterval').val()) < 0 || ($('#xinterval').val()) == 0){
					$('#errorxinterval').show();					
					$('#errorxinterval').html("Interval cannot be negative or zero");
					
				}
				else if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#xmin').val()) != '') && (($('#ymax').val()) != '') && (($('#yinterval').val()) != '')){
					$('#errorxinterval').hide();	
					getOutputDisplay();
				}
			}		
		}); 

		$('#yinterval').on('input',function(){
		if(($("#selectX :selected").text() != "") && ($("#selectZ :selected").text() != "") && ($("#selectZ :selected").text() != "") && !($('#autoRange').is(':checked'))){
				if(($('#yinterval').val()) == '' || isNaN($('#yinterval').val())){
					$('#erroryinterval').show();					
					$('#erroryinterval').html("Only Numbers allowed");
					
				}
				else if(($('#yinterval').val()) < 0 || ($('#yinterval').val()) == 0){
					$('#erroryinterval').show();					
					$('#erroryinterval').html("Interval cannot be negative or zero");
					
				}
				else if((($('#xmax').val()) != '') && (($('#ymin').val()) != '') && (($('#xmin').val()) != '') && (($('#ymax').val()) != '') && (($('#xinterval').val()) != '')){
					$('#erroryinterval').hide();	
					getOutputDisplay();
				}
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

					 $('#xmin').val(smallestX - largestX);
					 $('#ymin').val(smallestY - largestY);
					 $('#xmax').val(2*largestX);
					 $('#ymax').val(2*largestY);
					 $('#xinterval').val(numRecords);
					 $('#yinterval').val(numRecords);

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
				xvals = [document.getElementById("xmin").value, document.getElementById("xmax").value, document.getElementById("xinterval").value]; 
	     			yvals = [document.getElementById("ymin").value, document.getElementById("ymax").value, document.getElementById("yinterval").value]; 
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
	}

     };
    });
})();
