$(function() {
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

  $("#red, #green, #blue").slider({
    orientation: "horizontal",
    range: "min",
    max: 255,
    value: 127,
    slide: refreshRGB,
    change: refreshRGB
  });

  $("#red").slider("value", 192);
  $("#green").slider("value", 64);
  $("#blue").slider("value", 128);

  $("#red").slider({
    create: function() {
      $("#red-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#red-handle").text(ui.value);
    }
  });

  $("#green").slider({
    create: function() {
      $("#green-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#green-handle").text(ui.value);
    }
  });

  $("#blue").slider({
    create: function() {
      $("#blue-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#blue-handle").text(ui.value);
    }
  });


  function hexFromCMYK(c, m, y, k) {
    c = (c / 255);
    m = (m / 255);
    y = (y / 255);
    k = (k / 255);
    
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;
    
    var r = Math.round(255 * (1 - c));
    var g = Math.round(255 * (1 - m));
    var b = Math.round(255 * (1 - y));

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

  function refreshCMYK() {
    var cyan = $("#cyan").slider("value"),
		magenta = $("#magenta").slider("value"),
		yellow = $("#yellow").slider("value"),
		black = $("#black").slider("value"),
		hex = hexFromCMYK(cyan, magenta, yellow, black);
    $("#color-cmyk").css("background-color", "#" + hex);
  }

  $("#cyan, #magenta, #yellow, #black").slider({
    orientation: "horizontal",
    range: "min",
    max: 255,
    value: 127,
    slide: refreshCMYK,
    change: refreshCMYK
  });

  $("#cyan").slider("value", 192);
  $("#magenta").slider("value", 128);
  $("#yellow").slider("value", 64);
  $("#black").slider("value", 0);

  $("#cyan").slider({
    create: function() {
      $("#cyan-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#cyan-handle").text(ui.value);
    }
  });

  $("#magenta").slider({
    create: function() {
      $("#magenta-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#magenta-handle").text(ui.value);
    }
  });

  $("#yellow").slider({
    create: function() {
      $("#yellow-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#yellow-handle").text(ui.value);
    }
  });

  $("#black").slider({
    create: function() {
      $("#black-handle").text($(this).slider("value"));
    },
    slide: function(event, ui) {
      $("#black-handle").text(ui.value);
    }
  });

});
