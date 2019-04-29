$(function() {
    $('#theme').change(function() {
	    if ($(this).prop('checked') == true) {
	        editor.setOption('theme', 'rin-dark');
	    } else {
	        editor.setOption('theme', 'rin-light');
	    }
    })
    $('#theme2').change(function() {
	    if ($(this).prop('checked') == true) {
	        editor2.setOption('theme', 'rin-dark');
	    } else {
	        editor2.setOption('theme', 'rin-light');
	    }
    })
    $('#theme3').change(function() {
	    if ($(this).prop('checked') == true) {
	        editor3.setOption('theme', 'rin-dark');
	    } else {
	        editor3.setOption('theme', 'rin-light');
	    }
    })
    $('#theme4').change(function() {
	    if ($(this).prop('checked') == true) {
	        editor4.setOption('theme', 'rin-dark');
	    } else {
	        editor4.setOption('theme', 'rin-light');
	    }
    })
    $('#theme5').change(function() {
	    if ($(this).prop('checked') == true) {
	        editor5.setOption('theme', 'rin-dark');
	    } else {
	        editor5.setOption('theme', 'rin-light');
	    }
    })
})
