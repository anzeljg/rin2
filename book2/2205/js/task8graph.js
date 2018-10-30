$(function() {

  var board;

  function refreshGraph() {
    if (board != null) JXG.JSXGraph.freeBoard(board);
    board = JXG.JSXGraph.initBoard('jxgbox8', {boundingbox:[-0.5, 1, 1.5, -1], axis:true, grid:true});
    board.suspendUpdate();
    board.create('functiongraph', [function(x){ return -0.5 * Math.sin(25*x); }], {strokeWidth:3, strokeColor:'#0000ff'});
    board.unsuspendUpdate();
  }

  refreshGraph();

});
