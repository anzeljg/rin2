$(function() {

  var board;

  function f(x) {
	// Function: f(x) = -2*(sin(x)^5 - cos(x/2)^3) + 4
    return -2*(Math.pow(Math.sin(x),5)-Math.pow(Math.cos(x/2),3)) + 4;
  }

  function Setup7() {
    if (board != null) JXG.JSXGraph.freeBoard(board);
    board = JXG.JSXGraph.initBoard('jxgbox7', {boundingbox:[-2, 8, 10, -1], keepaspectratio:true, axis:true, grid:true});
    board.suspendUpdate();
    var a = board.create('functiongraph', [f, 0, 9], {strokeWidth:3, strokeColor:'#0000ff'});
    board.unsuspendUpdate();
  }

  function Hint7() {
    board.suspendUpdate();
	var freq = 1;
	if (freq > 0) {
	  var xval = [];
	  var yval = [];
	  for (var i=0; i<=9.001; i+=1/freq) {
	    // Whole numbers, halves, thirds, quarters etc.
	    xval.push(i);
		// Rounded to whole numbers, halves, thirds, quarters etc. based on frequency
        yval.push((Math.round(f(i)*freq)/freq).toFixed(1));
	  }
	  var b = board.create('chart', [xval, yval], {chartStyle:'line,point', strokeWidth:2, strokeColor:'#ff0000'});
	}
    board.unsuspendUpdate();
  }

  Setup7();

  $("#hint7").click(function() {
    Hint7();
  });

  $("#reset7").click(function() {
    Setup7();
  });

});
