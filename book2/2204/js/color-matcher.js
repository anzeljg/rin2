$(function() {

  // 24-bit color represenation section

  function hexFromRGB(r, g, b) {
    var hex = [
      r.toString(16),
      g.toString(16),
      b.toString(16)
    ];
    $.each(hex, function(nr, val) {
      if (val.length === 1) {
        hex[nr] = "0" + val;
      }
    });
    return hex.join("").toUpperCase();
  }

  function refreshRGB() {
    var red = $("#red").slider("value"),
		green = $("#green").slider("value"),
		blue = $("#blue").slider("value"),
		hex = hexFromRGB(red, green, blue);
    $("#color-rgb").css("background-color", "#" + hex);
  }

  function set24BitTab() {
	$("#red, #green, #blue").slider({
	orientation: "horizontal",
	range: "min",
	max: 255,
	value: 127,
	slide: refreshRGB,
	change: refreshRGB
	});

	var value = Math.floor(Math.random() * 256);
	$("#red").slider("value", value);
	$("#red-handle").text($("#red").slider("value"));
	var binary = ("00000000" + value.toString(2)).slice(-8);
	$("#red-value").text(binary);
	$("#red-part").text(binary);

	var value = Math.floor(Math.random() * 256);
	$("#green").slider("value", value);
	$("#green-handle").text($("#green").slider("value"));
	var binary = ("00000000" + value.toString(2)).slice(-8);
	$("#green-value").text(binary);
	$("#green-part").text(binary);

	var value = Math.floor(Math.random() * 256);
	$("#blue").slider("value", value);
	$("#blue-handle").text($("#blue").slider("value"));
	var binary = ("00000000" + value.toString(2)).slice(-8);
	$("#blue-value").text(binary);
	$("#blue-part").text(binary);

	$("#red").slider({
	create: function() {
	  $("#red-handle").text($(this).slider("value"));
	},
	slide: function(event, ui) {
	  $("#red-handle").text(ui.value);
	  var binary = ("00000000" + ui.value.toString(2)).slice(-8);
	  $("#red-value").text(binary);
	  $("#red-part").text(binary);
	}
	});

	$("#green").slider({
	create: function() {
	  $("#green-handle").text($(this).slider("value"));
	},
	slide: function(event, ui) {
	  $("#green-handle").text(ui.value);
	  var binary = ("00000000" + ui.value.toString(2)).slice(-8);
	  $("#green-value").text(binary);
	  $("#green-part").text(binary);
	}
	});

	$("#blue").slider({
	create: function() {
	  $("#blue-handle").text($(this).slider("value"));
	},
	slide: function(event, ui) {
	  $("#blue-handle").text(ui.value);
	  var binary = ("00000000" + ui.value.toString(2)).slice(-8);
	  $("#blue-value").text(binary);
	  $("#blue-part").text(binary);
	}
	});

  }

  set24BitTab(); // Initial call


  // 8-bit color represenation section

  function refreshRGB8() {
    var red = Math.floor($("#red8").slider("value") * 36.428571429),
		green = Math.floor($("#green8").slider("value") * 36.428571429),
		blue = Math.floor($("#blue8").slider("value") * 85),
		hex = hexFromRGB(red, green, blue);
		console.log(hex);
    $("#color8-rgb").css("background-color", "#" + hex);
  }

  function set8BitTab() {
	$("#red8, #green8").slider({
	orientation: "horizontal",
	range: "min",
	max: 7,
	value: 3,
	slide: refreshRGB8,
	change: refreshRGB8
	});

	$("#blue8").slider({
	orientation: "horizontal",
	range: "min",
	max: 3,
	value: 1,
	slide: refreshRGB8,
	change: refreshRGB8
	});

	var value = Math.floor(Math.random() * 8);
	$("#red8").slider("value", value);
	$("#red8-handle").text($("#red8").slider("value"));
	var binary = ("000" + value.toString(2)).slice(-3);
	$("#red8-value").text(binary);
	$("#red8-part").text(binary);

	var value = Math.floor(Math.random() * 8);
	$("#green8").slider("value", value);
	$("#green8-handle").text($("#green8").slider("value"));
	var binary = ("000" + value.toString(2)).slice(-3);
	$("#green8-value").text(binary);
	$("#green8-part").text(binary);

	var value = Math.floor(Math.random() * 4);
	$("#blue8").slider("value", value);
	$("#blue8-handle").text($("#blue8").slider("value"));
	var binary = ("00" + value.toString(2)).slice(-2);
	$("#blue8-value").text(binary);
	$("#blue8-part").text(binary);

	$("#red8").slider({
	create: function() {
	  $("#red8-handle").text($(this).slider("value"));
	},
	slide: function(event, ui) {
	  $("#red8-handle").text(ui.value);
	  var binary = ("000" + ui.value.toString(2)).slice(-3);
	  $("#red8-value").text(binary);
	  $("#red8-part").text(binary);
	}
	});

	$("#green8").slider({
	create: function() {
	  $("#green8-handle").text($(this).slider("value"));
	},
	slide: function(event, ui) {
	  $("#green8-handle").text(ui.value);
	  var binary = ("000" + ui.value.toString(2)).slice(-3);
	  $("#green8-value").text(binary);
	  $("#green8-part").text(binary);
	}
	});

	$("#blue8").slider({
	create: function() {
	  $("#blue8-handle").text($(this).slider("value"));
	},
	slide: function(event, ui) {
	  $("#blue8-handle").text(ui.value);
	  var binary = ("00" + ui.value.toString(2)).slice(-2);
	  $("#blue8-value").text(binary);
	  $("#blue8-part").text(binary);
	}
	});

  }

  set8BitTab(); // Initial call


  // Other functions

  function setGoalColor() {
	// Set goal color as half way between 8 bit values for difficulty
	var red = Math.floor((Math.floor(Math.random() * 7) + 0.5) * 36.428571429);
	var green = Math.floor((Math.floor(Math.random() * 7) + 0.5) * 36.428571429);
	var blue = Math.floor((Math.floor(Math.random() * 3) + 0.5) * 85);

	// Set colour
	var hex = hexFromRGB(red, green, blue);
	$("#color-goal").css("background-color", "#" + hex);
	$("#color8-goal").css("background-color", "#" + hex);
  }

  setGoalColor(); // Initial call

  // Reset goal color
  $("#resetGoalColor").click(function() {
    setGoalColor();
	set24BitTab();
	set8BitTab();
  });

});
