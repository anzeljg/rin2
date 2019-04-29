$(function() {
    $('#theme').change(function() {
	    if ($(this).prop('checked') == true) {
	        editor.setOption('theme', 'rin-dark');
	    } else {
	        editor.setOption('theme', 'rin-light');
	    }
    })
})
