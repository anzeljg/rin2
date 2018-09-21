$(document).ready(function() {
  // Colour palette
  var colours = [
    'black', 'maroon', 'green', 'olive', 'navy', 'purple', 'teal', 'silver',  
    'gray', 'red', 'lime', 'yellow', 'blue', 'fuchsia', 'aqua', 'white'
  ];
  var pixel_colour = colours[0]; // Default color

  // Switch all pixels to black on clear click
  $('#clear-all').on('click', function(){
     $('.pixel').removeClass('black maroon green olive navy purple teal silver gray red lime yellow blue fuchsia aqua white');
     updateEncodingText();
  });

  // Toggle all pixels to black on toggle click
  /*
  $('#invert').on('click', function(){
     $('.pixel').toggleClass('black');
     updateEncodingText();
  });
  */

  // On key up, update squares (delegated)
  $('#encoding-text').bind('input propertychange', function() {
     updateEncodingGrid();
  });

  // Toggle pixel on pixel click
  $('#encoding-grid').on('click', '.pixel', function(event) {
      $(this).removeClass('black maroon green olive navy purple teal silver gray red lime yellow blue fuchsia aqua white').addClass(pixel_colour);
      updateEncodingText();
  })

  // Change grid size on value change
  $('#grid-size').on('change', function(){
      setup_grid();
  });

  // Change pixel color on value change
  $('#pixel-color').on('change', function(){
      var colour_index = $('#pixel-color').val();
	  pixel_colour = colours[colour_index];
  });

  // Create the grid on load
  setup_grid();
});

function setup_grid(){
  // Get grid size and set it globably
  this.$gridSize = $('#grid-size').val();

  // Clear all errors
  $('#encoding-text-feedback').text('');
  $('#encoding-text').removeClass('error');

  if ($gridSize > 21 || $gridSize < 1 || isNaN($gridSize)) {
    // Error message
    alert('Please enter a value between 0 and 100');
    // Reset grid
    $('#grid-size').val(5);
    setup_grid()
  } else {
    // Add content to container
    $('#bit-count').text($gridSize * $gridSize);
    charCount = $gridSize >= 10 ? 2 * $gridSize : $gridSize;
    $('#char-count').text(charCount);

    // Create divs and set initial run length text
    var runText = '';
    var grid = $('#encoding-grid');
    grid.empty();
    for(row = 0; row < $gridSize; row++) {
        var gridRow = $('<div class="flex-container">');
        grid.append(gridRow);
        runText += '15, ' + $gridSize; // 15 = index of default color - white
        for(col = 0; col < $gridSize; col++) {
            gridRow.append($('<div class="flex-item pixel white"></div>'));
        }
        grid.append('</div>');
        if (row < $gridSize - 1) {
          runText += '\n';
        }
    }
    $('#encoding-text').val(runText);

    // Set suitable font size
    if ($gridSize <= 8) {
        fontSize = 20;
    } else if ($gridSize <= 12) {
        fontSize = 16;
    } else {
        fontSize = 14;
    }
    $('#encoding-text').css('font-size',fontSize);
  }
}

function updateEncodingGrid() {
  // Colour palette
  var colours = [
    'black', 'maroon', 'green', 'olive', 'navy', 'purple', 'teal', 'silver',  
    'gray', 'red', 'lime', 'yellow', 'blue', 'fuchsia', 'aqua', 'white'
  ];

  var $encodingText = $('#encoding-text');
  var $encodingFeedback = $('#encoding-text-feedback');
  var $encodingGrid = $('#encoding-grid');
  var encodingData = $encodingText.val().split('\n');
  for(row = 0; row < $gridSize; row++) {
      encodingData[row] = encodingData[row].replace(/\s/g, '').split(',').map(Number);
  }

  var is_valid_data = true;

  for (var row = 0; row < encodingData.length; row++) {
    var row_total = 0
    for (var col = 0; col < encodingData[row].length; col++) {
	  col++; // Sum only odd cols into total (the numbers of cells, NOT the colours!)
      row_total += encodingData[row][col];
    }
	console.log(row_total);
    // Wrong total for row
    if (row_total != $gridSize) {
      $encodingFeedback.text('Your numbers add up to a different number than the grid requires!');
      is_valid_data = false;
    }
  }

  // If wrong number of lines
  if (encodingData.length != $gridSize) {
    $encodingFeedback.text('You have a different number of lines than lines in the grid!');
    is_valid_data = false;
  }

  if (is_valid_data) {
    $encodingFeedback.text('');
    $encodingText.removeClass('error');
    $encodingGrid.children().each(function( row_index, row ) {
      $row_element = $(row);
      var counting_colour = 'white';
      var child_count = 0;
      var row_data = encodingData[row_index];
      console.log(row_data);
      while (row_data.length > 0) {
        var colour_index = row_data.shift();
        var colour_count = row_data.shift();
        for (var count = 0; count < colour_count; count++) {
	      var counting_colour = colours[colour_index];
          $row_element.children().eq(child_count).removeClass('black maroon green olive navy purple teal silver gray red lime yellow blue fuchsia aqua white').addClass(counting_colour);
          child_count++;
        }
        counting_colour = 'white';
      }
    });
    $('#char-count').text($encodingText.val().replace(/\s/g, '').length);
  } else {
    $encodingFeedback.addClass('error');
    $encodingText.addClass('error');
    $('#char-count').text('???');
  }
}

function updateEncodingText() {
  // Colour palette
  var colours = [
    'black', 'maroon', 'green', 'olive', 'navy', 'purple', 'teal', 'silver',  
    'gray', 'red', 'lime', 'yellow', 'blue', 'fuchsia', 'aqua', 'white'
  ];

  // Save variables
  var $encodingText = $('#encoding-text');
  var $encodingGrid = $('#encoding-grid');

  // Clear textbox
  $encodingText.val('');

  // For each row
  $encodingGrid.children().each(function( row_index, row ) {
    $row = $(row);
    var counting_colour = 'white';
    var colour_count = 0 ;
    var row_counts = [];
    // For each column
    $row.children().each(function( col_index, col ) {
      $col = $(col);
      var pixel_colour = 'white';
	  if ($col.hasClass( 'black' )) pixel_colour = 'black';
	  if ($col.hasClass( 'maroon' )) pixel_colour = 'maroon';
	  if ($col.hasClass( 'green' )) pixel_colour = 'green';
	  if ($col.hasClass( 'olive' )) pixel_colour = 'olive';
	  if ($col.hasClass( 'navy' )) pixel_colour = 'navy';
	  if ($col.hasClass( 'purple' )) pixel_colour = 'purple';
	  if ($col.hasClass( 'teal' )) pixel_colour = 'teal';
	  if ($col.hasClass( 'silver' )) pixel_colour = 'silver';
	  if ($col.hasClass( 'gray' )) pixel_colour = 'gray';
	  if ($col.hasClass( 'red' )) pixel_colour = 'red';
	  if ($col.hasClass( 'lime' )) pixel_colour = 'lime';
	  if ($col.hasClass( 'yellow' )) pixel_colour = 'yellow';
	  if ($col.hasClass( 'blue' )) pixel_colour = 'blue';
	  if ($col.hasClass( 'fuchsia' )) pixel_colour = 'fuchsia';
	  if ($col.hasClass( 'aqua' )) pixel_colour = 'aqua';

      if (pixel_colour == counting_colour) {
        colour_count++;
      } else {
        row_counts.push(colours.indexOf(counting_colour));
        row_counts.push(colour_count);
        counting_colour = 'white';
		if ($col.hasClass( 'black' )) counting_colour = 'black';
		if ($col.hasClass( 'maroon' )) counting_colour = 'maroon';
		if ($col.hasClass( 'green' )) counting_colour = 'green';
		if ($col.hasClass( 'olive' )) counting_colour = 'olive';
		if ($col.hasClass( 'navy' )) counting_colour = 'navy';
		if ($col.hasClass( 'purple' )) counting_colour = 'purple';
		if ($col.hasClass( 'teal' )) counting_colour = 'teal';
		if ($col.hasClass( 'silver' )) counting_colour = 'silver';
		if ($col.hasClass( 'gray' )) counting_colour = 'gray';
		if ($col.hasClass( 'red' )) counting_colour = 'red';
		if ($col.hasClass( 'lime' )) counting_colour = 'lime';
		if ($col.hasClass( 'yellow' )) counting_colour = 'yellow';
		if ($col.hasClass( 'blue' )) counting_colour = 'blue';
		if ($col.hasClass( 'fuchsia' )) counting_colour = 'fuchsia';
		if ($col.hasClass( 'aqua' )) counting_colour = 'aqua';
        colour_count = 1;
      }
    });
    row_counts.push(colours.indexOf(counting_colour));
    row_counts.push(colour_count);
    // Add text to encoding text
    var text = $encodingText.val() + row_counts.join(', ');
    if (row_index < $gridSize - 1) {
         text += '\n';
    }
    $encodingText.val(text);
  });
  // Count characters required
  $('#char-count').text($encodingText.val().replace(/\s/g, '').length);
}

String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
