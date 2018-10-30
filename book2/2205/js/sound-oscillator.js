$(function() {

  var brd1;

  Gibberish.init();
  Gibberish.Time.export();
  Gibberish.Binops.export();
  // Sine wave oscillator
  var osc = new Gibberish.Sine(440, .2).connect();

  function refreshGraph() {
	osc.amp = $("#amplitude").slider("value");
	osc.frequency = $("#frequency").slider("value");

    if (brd1 != null) JXG.JSXGraph.freeBoard(brd1);
    brd1 = JXG.JSXGraph.initBoard('jxgbox1', {boundingbox:[-7, 4, 7, -4], axis:false});
    brd1.suspendUpdate();
    brd1.create('functiongraph', [function(x){ return (osc.amp * 0.3) * Math.sin((osc.frequency / 200.0) * 2 * Math.PI * x); }], {strokeWidth:3, strokeColor:'#0000ff'});
    brd1.unsuspendUpdate();
  }

  $("#amplitude").slider({
    orientation: "horizontal",
    range: "min",
    max: 10,
	min: 0,
	step: 1,
    value: 2, // 20%
    slide: refreshGraph,
    change: refreshGraph
  });

  $("#frequency").slider({
    orientation: "horizontal",
    range: "min",
    max: 1000,
	min: 0,
	step: 50,
    value: 440, // 440 Hz
    slide: refreshGraph,
    change: refreshGraph
  });

  $("#amplitude").slider("value", 2);
  $("#frequency").slider("value", 440);

  $("#amplitude").slider({
    create: function() {
      $("#amplitude-handle").text($(this).slider("value") * 10 + "%");
    },
    slide: function(event, ui) {
      $("#amplitude-handle").text(ui.value * 10 + "%");
    }
  });

  $("#frequency").slider({
    create: function() {
      $("#frequency-handle").text($(this).slider("value") + " Hz");
    },
    slide: function(event, ui) {
      $("#frequency-handle").text(ui.value + " Hz");
    }
  });

  $("#stopSound").click(function() {
    Gibberish.clear();
  });

  refreshGraph();

});
