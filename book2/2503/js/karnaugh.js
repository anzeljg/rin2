var kvMapPage = new (function() {
	
	/*
	var d3Script = document.createElement("script");
	d3Script.src = "./js/D3/d3.v5.min.js";
	document.body.appendChild(d3Script);
	var utilScript = document.createElement("script");
	utilScript.src = "./js/QM/util.js";
	document.body.appendChild(utilScript);
	var minScript = document.createElement("script");
	minScript.src = "./js/QM/minterm.js";
	document.body.appendChild(minScript);
	var qmScript = document.createElement("script");
	qmScript.src = "./js/QM/quinemccluskey.js";
	document.body.appendChild(qmScript);
	*/

	window.onload = run;

	/*variable definition*/
	var scale = 1; //changes size of map
	var width = 40; //width of map cells 
	var height = 40; //height of map cells 
	var distance = 4; //distance distance between cells
	var d_labels = 5; //distance of labels from map
	var offset = 30; //offset distance of map from svg border
	var color0 = getColor(0); // color of cell with value 0
	var color1 = getColor(0); // color of cell with value 1
	var colorX = getColor(0); //color of cell with Don't Care value
	var colorIndex = null; //will be incremented with each new drawed ring. Initialisation with the first ring in drawRings()
	var radius = 15; //radius of the smallest rings
	const variablesDefault = "ABCD"; //default name of variables
	var leftIsMSB = true; //if first letter of variablesDefault is the MSB
	var variables = "";
	var previousresult = "";
	//var ShowIndex = null; /**/


	/*functions*/
	function run()
	{
		/*create html elements*/
		/*
		d3.select("body").append("section").attr("id", "karnaugh");
		
		d3.select("#karnaugh").append("h1").attr("id", "title");
		d3.select("#title").text("KV-Diagramm");
		
		d3.select("#karnaugh").append("div").attr("id", "settings");
			
		d3.select("#settings").append("div").attr("id", "variablesNumber").attr("class", "settings");
		d3.select("#variablesNumber").append("label").attr("for", "varNumber").text("Anzahl der Variablen: ");
		d3.select("#variablesNumber").append("select").attr("id", "varNumber").attr("name", "varNumber").attr("onchange", "kvMapPage.newMap(this.value)");
		for (let i=1; i<5; i++)
		{
			d3.select("#varNumber").append("option").attr("value", i).text(i);
		}
		
		d3.select("#settings").append("div").attr("id", "allowDontCares").attr("class", "settings");
		d3.select("#allowDontCares").append("input").attr("id", "DontCares").attr("name", "allowDontCaresAllowed").attr("type", "checkbox").attr("checked", "");
		d3.select("#allowDontCares").append("label").attr("for", "DontCares").text(" Don't Cares erlauben");

		d3.select("#settings").append("div").attr("id", "showCellIndex").attr("class", "settings");
		d3.select("#showCellIndex").append("input").attr("id", "ShowIndex").attr("name", "ShowIndex").attr("type", "checkbox").attr("checked", "")
			.attr("onclick", "kvMapPage.showIndex()");
		d3.select("#showCellIndex").append("label").attr("for", "ShowIndex").text(" Zellenindex anzeigen");
		
		d3.select("#karnaugh").append("div").attr("id", "Map");

		d3.select("#karnaugh").append("div").attr("id", "result").attr("class", "result");
		*/

		kvMapPage.newMap();
	}
	this.newMap = function newMap(n)
	{	
		//delete map
		d3.select("#Map").selectAll("*").remove();
			
		//get query string
		var parameterString = new URL(document.location);
		var parameters = parameterString.searchParams;
		/*get URL parameters
		 * n: number of variables
		 * var: name of the varaibles
		 * index: show index (bool)
		 * dc: enable don't cares (bool)
		 * msb: leftIsMSB (bool)
		 * scale: scale
		 */
		if(parameters.get("index")=="false") ShowIndex.checked = false;
		if(parameters.get("dc")=="false") DontCares.checked = false;
		if(parameters.get("msb")=="true") leftIsMSB = true;
		if(parameters.get("scale")!=null&&parameters.get("scale")!=""&&!isNaN(parameters.get("scale"))) scale = parameters.get("scale");
		let s = "";
		s += parameters.get("n")==null?0:1;
		s += parameters.get("var")==null?0:1;
		switch (s)
		{
			case "00":
				variables = variablesDefault.substring(0, document.getElementById("varNumber").value);
				break;
			case "01":
				if(n===undefined) 
				{
					variables = parameters.get("var");
					document.getElementById("varNumber").value = variables.length.toString();
				}
				else
				{
					if(parameters.get("var").length!=n) 
					{
						variables = variablesDefault.substring(0, n);
					}
					else
					{
						variables = parameters.get("var");
					}
				}
				break;
			case "10":
				if(n===undefined) document.getElementById("varNumber").value = parameters.get("n");
				variables = variablesDefault.substring(0, document.getElementById("varNumber").value);
				break;
			case "11":
				if(n===undefined)
				{
					document.getElementById("varNumber").value = parameters.get("n");
					if(parameters.get("var").length==document.getElementById("varNumber").value)
					{
						variables = parameters.get("var");
					}
					else
					{
						console.log("Anzahl der Variablennamen (var) und Variablenanzahl (n) stimmen nicht überein.");
						return;
					}
				}
				else
				{
					if(parameters.get("var").length==n)
					{
						console.log(parameters.get("var").length+" == "+n);
						variables = parameters.get("var");
					}
					else
					{
						variables = variablesDefault.substring(0, n);
					}
				}
				break;
			default:
				break;
		} 
		if(leftIsMSB==false) variables = reverseString(variables); 
		
		//set number of rows, columns of map
		switch(document.getElementById("varNumber").value)
		{
			case "1":
				var nRows = 1;
				var nColumns = 2;	
				break;
			case "2":
				var nRows = 2;
				var nColumns = 2;	
				break;
			case "3":
				var nRows = 2;
				var nColumns = 4;	
				break;
			case "4":
				var nRows = 4;
				var nColumns = 4;	
				break;
			default:
				console.log("Anzahl der Variablen muss zwischen 1 und 5 definiert sein.");
				break;
		}

		drawMap(nRows,nColumns);
		//kvMapPage.showIndex();
		calculate();
	}
	function drawMap(nRows, nColumns) //number of rows, columns of map
	{
		//draw new map
		values = [];
		dontCares = [];
		
		let w = nColumns*(width+distance)-distance+offset*2;
		let h = nRows*(height+distance)-distance+offset*2;
		d3.select("#Map").append("svg").attr("id", "svgMap")
			.attr("width", w*scale)
			.attr("height", h*scale)
			.attr("viewBox", "0 0 " + w + " " + h)
			.attr("font-family", "sans-serif");		
		
		for (let row=0; row<nRows; row++)    
		{	
			for(let column=0; column<nColumns; column++)
			{
				//draw cells
				let grayRow = nRows>1? decimalToGray(row,Math.log2(nRows)).toString() : "";
				let grayColumn = decimalToGray(column,Math.log2(nColumns)).toString();
				let bin = grayRow + grayColumn;
				let id = binaryToDecimal(bin);
				let g = d3.select("#svgMap").append("g").attr("id", id).attr("bin", bin)
					.attr("row", row).attr("column", column).attr("onclick", "kvMapPage.changeValue(this)");				
				let pos_x = offset+column*(width+distance); //origin of rect
				let pos_y = offset+row*(height+distance); //origin of rect
				g.append("rect")
					.attr("x", pos_x).attr("y", pos_y)
					.attr("width", width).attr("height", height)				
					.style("fill", color0);
				g.append("text")
					.attr("x", pos_x+width/2).attr("y", pos_y+height/2)
					.attr("text-anchor", "middle").attr("dominant-baseline", "central")
					.attr("font-size", "20").text("0");	
				g.append("text").attr("name", "index")
					.attr("x", pos_x+3).attr("y", pos_y+height-3)				
					.attr("text-anchor", "start").attr("dominant-baseline", "baseline")
					.attr("font-size", "10").text(id);	
				//draw labels of rows
				if(column==0)
				{
					for(let k=0; k<grayRow.length; k++)
					{
						if(grayRow.charAt(k) == "1")
						{
							if(d3.select("#label"+variables.charAt(k)).empty())
							{
								let sign = Math.pow(-1,k+1);
								let x = pos_x + ((width+distance)*nColumns-distance)*k + sign*d_labels;
								d3.select("#svgMap").append("line").attr("id", "line"+variables.charAt(k))
									.attr("stroke", "#000000").attr("stroke-width", "1")
									.attr("x1", x).attr("y1", pos_y)
									.attr("x2", x).attr("y2", pos_y+height);	
								d3.select("#svgMap").append("text").attr("id", "label"+variables.charAt(k))
									.attr("x", x + sign*5).attr("y", pos_y+height/2)
									.attr("text-anchor", (sign>0)?"start":"end").attr("dominant-baseline", "middle")
									.attr("font-size", "14").text(variables.charAt(k));		
							}
							else
							{
								let y2 = d3.select("#line"+variables.charAt(k)).attr("y2");
								if(pos_y>y2) 
								{
									d3.select("#line"+variables.charAt(k)).attr("y2", pos_y + height);
									let y = d3.select("#label"+variables.charAt(k)).attr("y");
									d3.select("#label"+variables.charAt(k)).attr("y", Number(y)+distance+height/2);
								}
							}
						}	
					}
				}	
				//draw labels of columns
				if(row==0)
				{					
					for(let k=grayRow.length; k<bin.length; k++)
					{
						if(grayColumn.charAt(k-grayRow.length) == "1")
						{
							if(d3.select("#label"+variables.charAt(k)).empty())
							{
								let sign = Math.pow(-1,k-grayRow.length+1);
								let y = pos_y + ((height+distance)*nRows-distance)*(k-grayRow.length) + sign*d_labels;
								d3.select("#svgMap").append("line").attr("id", "line"+variables.charAt(k))
									.attr("stroke", "#000000").attr("stroke-width", "1")
									.attr("x1", pos_x).attr("y1", y)
									.attr("x2", pos_x+width).attr("y2", y);	
								d3.select("#svgMap").append("text").attr("id", "label"+variables.charAt(k))
									.attr("x", pos_x+width/2).attr("y", y + sign*5)
									.attr("text-anchor", "middle").attr("dominant-baseline", (sign>0)?"hanging":"baseline")
									.attr("font-size", "14").text(variables.charAt(k));			
							}
							else
							{
								let x2 = d3.select("#line"+variables.charAt(k)).attr("x2");
								if(pos_x>x2) 
								{
									d3.select("#line"+variables.charAt(k)).attr("x2", pos_x + height);
									let x = d3.select("#label"+variables.charAt(k)).attr("x");
									d3.select("#label"+variables.charAt(k)).attr("x", Number(x)+(distance+width)/2);
								}
							}
						}				
					}				
				}			
			}
		}
	}
	function calculate()
	{
		var qm = new QuineMcCluskey(variables, values, dontCares, false);
		let newresult = rewriteresult(qm.getFunction());
		d3.select("#result").text("y = " + newresult);
		
		if(newresult != previousresult)
		{
			drawRings(newresult.replace(/\+ /g, "").split(" "));
		}
		previousresult = newresult;
	}

	/*change value of cell
	 *el: <g> element
	 */
	this.changeValue = function changeValue(el)
	{	
		let txt = d3.select(el).select("text");
		switch(txt.text())
		{
			case "0": value1(el); break;
			case "1": DontCares.checked==true? valueX(el):value0(el); break;
			case "X": value0(el); break;
			default: console.log("Value must be: 0, 1 or X.");
		}
		
		calculate();
	}
	function value0(el)
	{	
		d3.select(el).select("text").text("0");
		d3.select(el).select("text").style("fill", "#000000");
		d3.select(el).select("rect").style("fill", color0);
		//remove element of array values
		let index_1 = values.indexOf(el.id);
		if (index_1 > -1) values.splice(index_1, 1); 
		//remove element of array dontCares
		let index_X = dontCares.indexOf(el.id);
		if (index_X > -1) dontCares.splice(index_X, 1); 
	}
	function value1(el)
	{
		d3.select(el).select("text").text("1");
		d3.select(el).select("text").style("fill", "#000000");
		d3.select(el).select("rect").style("fill", color1);
		values.push(el.id);
	}
	function valueX (el)
	{
		d3.select(el).select("text").text("X");
		d3.select(el).select("text").style("fill", "#C8C8C8");
		d3.select(el).select("rect").style("fill", colorX);
		dontCares.push(el.id);
		//remove element of array values
		let index = values.indexOf(el.id);
		if (index > -1) values.splice(index, 1); 
	}

	/*draw rings
	 * primImplikanten: array of prime iplicants of result
	 * example: result = BD + AC + ABD, primImplikanten = [BD,AC,ABD] 
	 *
	 * x0, y0: orgin of top left cell
	 * x1, y1: orgin of bottom right cell
	 */
	function drawRings(primImplikanten)
	{
		d3.select("#svgMap").selectAll("path").remove(); //erase rings
		
		colorIndex = 2; //index of first ring color - 1
		
		if (primImplikanten != "0")
		{
			for(let i = 0; i < primImplikanten.length; i++)
			{
				let primImpl = primImplikanten[i]; 
				//convert prime implicant string into "binary"
				let binStr = "";
				let k = 0; 
				for(let j = 0; j < primImpl.length; j++)
				{
					if(primImpl[j] == variables[k])
					{
						if (primImpl[j+1]=="̅")
						{
							binStr += "0";
							j++;
							k++;
						}
						else
						{
							binStr += "1";
							k++;
						}
					}
					else
					{
						if(primImplikanten == "1")
						{
							for(let a=0;a<variables-length;a++){binStr += "-";}
							break;
						}
						else
						{
							binStr += "-";
							k++;
							j--;
						}
					}
				}				
				while(binStr.length<variables.length){binStr += "-";}
				
				//calculate coordinates of ring 
				let x0 = 0;
				let y0 = 0;
				let x1 = 0;
				let y1 = 0;
				let R = [];
				let C = [];
				let rCount = 0;
				let cCount = 0;
				d3.select("#svgMap").selectAll("g").each(function(d){ 
					if(isElementOfImplicant(d3.select(this).attr("bin"), binStr))
					{		
						//update coordinates of ring
						let rect = d3.select(this).select("rect");
						let rectX = Number(rect.attr("x"));
						let rectY = Number(rect.attr("y"));
						
						if(x0==0) {x0 = rectX;}
						if(y0==0) {y0 = rectY;}
						
						if(rectX<x0) {x0 = rectX;}
						else         {x1 = rectX;}
						if(rectY<y0) {y0 = rectY;}
						else         {y1 = rectY;}
						
						//get row and column number of cell
						R.push(d3.select(this).attr("row"));
						C.push(d3.select(this).attr("column"));
					}
					//check if cells are adjacent
					R.sort();
					C.sort();
					for(let m = 0; m < R.length-1; m++)
					{					
						if(Number(R[m+1]) > Number(R[m])+1) rCount++;
					}
					for(let n = 0; n < C.length-1; n++)
					{					
						if(Number(C[n+1]) > Number(C[n])+1) cCount++;
					}
				});

				//call draw function
				if(rCount>0)
				{
					if(cCount>0) {ringCorner(getColor(), x0, y0, x1, y1);}
					else         {ringTopBottomOpen(getColor(), x0, y0, x1, y1);}
				}
				else
				{
					if(cCount>0) {ringSideOpen(getColor(), x0, y0, x1, y1);}
					else         {ringClosed(getColor(), x0, y0, x1, y1);}
				}
			}
		}
	}
	function ringClosed(color, x0, y0, x1, y1)
	{		
		x1 += width;
		y1 += height;

		let d = "";
		d += "M " + (x0+radius) + " " + y0 + " ";
		d += "L " + (x1-radius) + " " + y0 + " ";
		d += "Q " + x1 + " " + y0 + " " + x1 + " " + (y0+radius) + " ";
		d += "L " + x1 + " " + (y1-radius) + " ";
		d += "Q " + x1 + " " + y1 + " " + (x1-radius) + " " + y1 + " ";
		d += "L " + (x0+radius) + " " + y1 + " ";
		d += "Q " + x0 + " " + y1 + " " + x0 + " " + (y1-radius) + " ";
		d += "L " + x0 + " " + (y0+radius) + " ";
		d += "Q " + x0 + " " + y0 + " " + (x0+radius) + " " + y0 + " ";
		d += "Z";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d);		
	}
	function ringTopBottomOpen(color, x0, y0, x1, y1)
	{
		let k = 2;
		x0 += k;
		y0 += height - k;
		x1 += width - k;
		y1 += k;

		let dBottom = "";
		dBottom += "M " + x0 + " " + (y1+height-k) + " ";
		dBottom += "L " + x0 + " " + (y1+radius) + " "; 
		dBottom += "Q " + x0 + " " + y1 + " " + (x0+radius) + " " + y1 + " ";
		dBottom += "L " + (x1-radius) + " " + y1 + " ";
		dBottom += "Q " + x1 + " " + y1 + " " + x1 + " " + (y1+radius) + " ";
		dBottom += "L " + x1 + " " + (y1+height-k) + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", dBottom);		
			
		let d2 = "";
		d2 += "M " + x0 + " " + (y0-height+k) + " ";
		d2 += "L " + x0 + " " + (y0-radius) + " "; 
		d2 += "Q " + x0 + " " + y0 + " " + (x0+radius) + " " + y0 + " ";
		d2 += "L " + (x1-radius) + " " + y0 + " ";
		d2 += "Q " + x1 + " " + y0 + " " + x1 + " " + (y0-radius) + " ";
		d2 += "L " + x1 + " " + (y0-height+k) + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d2);	
	}
	function ringSideOpen(color, x0, y0, x1, y1)
	{
		let k = 2;
		x0 += width - k;
		y0 += k;
		x1 += k;
		y1 += height - k;
		
		let d1 = "";
		d1 += "M " + (x0-width+k) + " " + y0 + " ";
		d1 += "L " + (x0-radius) + " " + y0 + " "; 
		d1 += "Q " + x0 + " " + y0 + " " + x0 + " " + (y0+radius) + " ";
		d1 += "L " + x0 + " " + (y1-radius) + " ";
		d1 += "Q " + x0 + " " + y1 + " " + (x0-radius) + " " + y1 + " ";
		d1 += "L " + (x0-width+k) + " " + y1 + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d1);		
			
		let d2 = "";
		d2 += "M " + (x1+width-k) + " " + y0 + " ";
		d2 += "L " + (x1+radius) + " " + y0 + " "; 
		d2 += "Q " + x1 + " " + y0 + " " + x1 + " " + (y0+radius) + " ";
		d2 += "L " + x1 + " " + (y1-radius) + " ";
		d2 += "Q " + x1 + " " + y1 + " " + (x1+radius) + " " + y1 + " ";
		d2 += "L " + (x1+width-k) + " " + y1 + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d2);	
	}
	function ringCorner(color, x0, y0, x1, y1)
	{
		let k = -2;
		x0 += width - k;
		y0 += height - k;
		x1 += k;
		y1 += k;

		let d1 = "";
		d1 += "M " + (x0-width+k) + " " + y0 + " ";
		d1 += "L " + (x0-radius) + " " + y0 + " ";
		d1 += "Q " + x0 + " " + y0 + " " + x0 + " " + (y0-radius) + " ";
		d1 += "L " + x0 + " " + (y0-height+k) + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d1);		
			
		let d2 = "";
		d2 += "M " + x1 + " " + (y0-height+k) + " ";
		d2 += "L " + x1 + " " + (y0-radius) + " ";
		d2 += "Q " + x1 + " " + y0 + " " + (x1+radius) + " " + y0 + " ";
		d2 += "L " + (x1+width-k) + " " + y0 + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d2);

		let d_3 = "";
		d_3 += "M " + (x0-width+k) + " " + y1 + " ";
		d_3 += "L " + (x0-radius) + " " + y1 + " "; 
		d_3 += "Q " + x0 + " " + y1 + " " + x0 + " " + (y1+radius) + " ";
		d_3 += "L " + x0 + " " + (y1+height-k) + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d_3);	

		let d4 = "";
		d4 += "M " + (x1+width-k) + " " + y1 + " ";
		d4 += "L " + (x1+radius) + " " + y1 + " "; 
		d4 += "Q " + x1 + " " + y1 + " " + x1 + " " + (y1+radius) + " ";
		d4 += "L " + x1 + " " + (y1+height-k) + " ";
		
		d3.select("#svgMap").append("path")
			.attr("stroke", color).attr("stroke-width", "2")
			.attr("fill", "none").attr("d", d4);			
	}

	/*settings*/
	/*
	this.showIndex = function showIndex()
	{
		if(ShowIndex.checked==true)
		{
			document.getElementsByName("index").forEach(
				function(currentValue){currentValue.style.display = "inline";});
		}
		else
		{
			 document.getElementsByName("index").forEach(
				function(currentValue){currentValue.style.display = "none";});
		}
	}
	*/
	function getColor(index = null)
	{
		var color = [
		"#F5F5F5", //color0
		"hsl(0, 0%, 88%)",     // color1
		"hsl(0, 0%, 92%)",     // colorX
		"hsl(0, 100%, 40%)",   //red
		"hsl(240, 100%, 50%)", //blue
		"hsl(300, 100%, 50%)", //Fuchsia
		"hsl(120, 80%, 50%)",  //green
		"hsl(36, 100%, 50%)",  //orange
		"hsl(300, 100%, 20%)", //purple	
		"hsl(190, 100%, 40%)", //light-blue
		"hsl(60, 100%, 40%)",  //yellow
		"hsl(280, 100%, 50%)", //violet
		"hsl(82, 64%, 37%)",   //green-nature
		"hsl(320, 100%, 56%)", //pink 
		"hsl(44, 100%, 23%)",  //brown
		"hsl(10, 100%, 70%)",  //light-red
		"hsl(238, 100%, 25%)", //dark-blue
		"hsl(120, 60%, 23%)",  //dark-green
		"hsl(165, 60%, 45%)"   //aqua	
		];
		
		if((index!=null)&&(index<color.length))
		{
			return color[index];
		}
		else{
			colorIndex++;
			return color[colorIndex];
		}
	}  
	function rewriteresult(r)
	{
		let result = r.replace(/OR/gi, "+");
		result = result.replace(/ AND /gi, "");
		result = result.replace(/\(/g, "");
		result = result.replace(/\)/g, "");
		var ind = result.indexOf("NOT ");
		while (ind>-1)
		{
			let variable = result.charAt(ind+4);
			result = result.substr(0,ind)+variable+"\u0305" + result.substr(ind+5);
			ind = result.indexOf("NOT ");
		}
		return result;
	}

	/*helper functions*/
	function setAttributes(el, attr)
	{
		for(var key in attr)
		{
			el.setAttribute(key, attr[key]);
		}
	}
	function decimalToGray(dec, n) //dec: string, n: number of digits of gray code
	{
		let gray = (dec^dec >> 1).toString(2) + "";
		while (gray.length < n) 
		{
			gray = "0" + gray;
		}
		return gray;
	}
	function binaryToDecimal(bin) //bin: string
	{
		return parseInt(bin, 2);
	}
	function reverseString(string)
	{
		return string.split("").reverse().join("");
	}
	function isElementOfImplicant(bin, binStr) //bin: Minterm string(0,1), binStr: Implikant string(0,1,-)
	{
		if(bin.length != binStr.length)
		{
			console.log("Function string parameters must have the same length.");
			return false;
		}
		for(let i = 0; i < bin.length; i++)
		{
			if((binStr[i] != "-")&&(bin[i] != binStr[i]))
			{
				return false;			
			}
		}
		return true;
	}
});