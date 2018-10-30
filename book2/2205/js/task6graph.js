$(function() {

  var board;

  // Gliding lines
  var l0, l1, l2, l3, l4, l5, l6, l7, l8, l9;
  // Gliding points
  var p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;
  // Segments between gliding points
  var s1, s2, s3, s4, s5, s6, s7, s8, s9;

  
  function f(x) {
	// Function: f(x) = -0.34*(((x-3.68)/2.2)^5 - 8*((x-3.68)/2.2)^3 + 10*((x-3.68)/2.2) - 7.8)
    return -0.34*(Math.pow(((x-3.68)/2.2),5) - 8*Math.pow(((x-3.68)/2.2),3) + 10*((x-3.68)/2.2)- 7.8);
  }

  function Setup6() {
    if (board != null) JXG.JSXGraph.freeBoard(board);
    board = JXG.JSXGraph.initBoard('jxgbox6', {boundingbox:[-2, 8, 10, -1], keepaspectratio:true, axis:true, grid:true});
    board.suspendUpdate();
	// Gliding lines
	l0 = board.create('line',[[0,0],[0,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=0'});
	l1 = board.create('line',[[1,0],[1,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=1'});
	l2 = board.create('line',[[2,0],[2,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=2'});
	l3 = board.create('line',[[3,0],[3,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=3'});
	l4 = board.create('line',[[4,0],[4,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=4'});
	l5 = board.create('line',[[5,0],[5,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=5'});
	l6 = board.create('line',[[6,0],[6,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=6'});
	l7 = board.create('line',[[7,0],[7,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=7'});
	l8 = board.create('line',[[8,0],[8,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=8'});
	l9 = board.create('line',[[9,0],[9,1]], {strokeOpacity:0, strokeColor:'#000000', fixed:true, name:'x=9'});
	// Gliding points
	p0 = board.create('glider', [0,0, l0], {name:''});
	p1 = board.create('glider', [0,0, l1], {name:''});
	p2 = board.create('glider', [0,0, l2], {name:''});
	p3 = board.create('glider', [0,0, l3], {name:''});
	p4 = board.create('glider', [0,0, l4], {name:''});
	p5 = board.create('glider', [0,0, l5], {name:''});
	p6 = board.create('glider', [0,0, l6], {name:''});
	p7 = board.create('glider', [0,0, l7], {name:''});
	p8 = board.create('glider', [0,0, l8], {name:''});
	p9 = board.create('glider', [0,0, l9], {name:''});
	// Segments between gliding points
	s1 = board.create('line', [p0,p1], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s2 = board.create('line', [p1,p2], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s3 = board.create('line', [p2,p3], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s4 = board.create('line', [p3,p4], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s5 = board.create('line', [p4,p5], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s6 = board.create('line', [p5,p6], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s7 = board.create('line', [p6,p7], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s8 = board.create('line', [p7,p8], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
	s9 = board.create('line', [p8,p9], {straightFirst:false, straightLast:false, strokeWidth:2, strokeColor:'#ff0000'});
    board.unsuspendUpdate();
  }

  function Solution6() {
    board.suspendUpdate();
    var a = board.create('functiongraph', [f, 0, 9], {strokeWidth:3, strokeColor:'#0000ff'});
    p0.moveTo([0,0]);
	p1.moveTo([1,3]);
	p2.moveTo([2,4]);
	p3.moveTo([3,4]);
	p4.moveTo([4,2]);
	p5.moveTo([5,1]);
	p6.moveTo([6,2]);
	p7.moveTo([7,4]);
	p8.moveTo([8,7]);
	p9.moveTo([9,5]);
    board.unsuspendUpdate();
  }

  Setup6();

  $("#solution6").click(function() {
    Solution6();
  });

  $("#reset6").click(function() {
    Setup6();
  });

});
