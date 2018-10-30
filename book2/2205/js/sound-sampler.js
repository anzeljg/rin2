$(function() {

  var brd2;

  function f(x) {
    // Function: f(x) = 2*(sin(x) - cos(1.5*x) + sin(pi/2))
    return 2*(Math.sin(x) - Math.cos(1.5*x) + Math.sin(Math.PI/2));
  }

  function sampleCurve() {
    var freq = $("#sampler").slider("value");

    if (brd2 != null) JXG.JSXGraph.freeBoard(brd2);
    brd2 = JXG.JSXGraph.initBoard('jxgbox2', {boundingbox: [-2, 8, 12, -3], keepaspectratio:true, axis:true, grid:true});
    brd2.suspendUpdate();
    var a = brd2.create('functiongraph', [f, 0, 11], {strokeWidth:3, strokeColor:'#0000ff'});
	if (freq > 0) {
	  var xval = [];
	  var yval = [];
	  for (var i=0; i<=11.001; i+=1/freq) {
	    // Whole numbers, halves, thirds, quarters etc.
	    xval.push(i);
		// Rounded to whole numbers, halves, thirds, quarters etc. based on frequency
        yval.push((Math.round(f(i)*freq)/freq).toFixed(1));
	  }
	  var b = brd2.create('chart', [xval, yval], {chartStyle:'line,point', strokeWidth:2, strokeColor:'#ff0000'});
	}
    brd2.unsuspendUpdate();
  }

  $("#sampler").slider({
    orientation: "horizontal",
    range: "min",
    max: 1,
	min: 0,
	step: 1,
    value: 0,
    slide: sampleCurve,
    change: sampleCurve
  });

  $("#sampler").slider("value", 0);

  $("#sampler").slider({
    create: function() {
      var state = "Da";
	  if ($(this).slider("value") == 0) {
        state = "Ne";
	  }
      $("#sampler-handle").text(state);
    },
    slide: function(event, ui) {
      var state = "Da";
	  if (ui.value == 0) {
        state = "Ne";
	  }
      $("#sampler-handle").text(state);
    }
  });

  sampleCurve();

});
