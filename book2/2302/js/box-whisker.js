$(function () {
    // set up all the data we require for all the examples
    var graph = {
        'ex_class_results' : [
            {
                'id' : 'class0',
                'data' : [ 50, 51, 38, 50, 43, 77, 45, 45, 75, 33, 52, 69, 50, 48, 32, 60, 47, 77, 71, 83, 73, 69, 45, 71, 57 ],
                'label' : 'Primer 1',
                'ypos'   : 40
            },
            {
                'id' : 'class1',
                'data' : [ 35, 51, 40, 39, 43, 48, 36, 38, 50, 37, 54, 47, 52, 53, 43, 40, 42, 37, 66, 40, 55, 45, 57, 46, 39 ],
                'label' : 'Primer 2',
                'ypos'   : 40
            }
        ],
        'subject_1' : [
            {
                'id' : 'class0',
                'data' : [ 50, 51, 40, 50, 43, 63, 45, 45, 68, 33, 52, 50, 60, 48, 32, 60, 47, 70, 71, 72, 73, 60, 45, 64, 57 ],
                'label' : 'Class A',
                'ypos'   : 40
            },
            {
                'id' : 'class1',
                'data' : [ 30, 32, 40, 32, 43, 48, 36, 38, 34, 37, 54, 47, 36, 44, 34, 40, 42, 37, 58, 40, 44, 44, 57, 46, 39 ],
                'label' : 'Class B',
                'ypos'   : 110
            }
        ],
        'subject_2' : [
            {
                'id' : 'class0',
                'data' : [ 60, 56, 40, 50, 43, 63, 45, 45, 68, 33, 52, 50, 60, 48, 37, 60, 47, 70, 71, 72, 60, 60, 45, 64, 57 ],
                'label' : 'Class A',
                'ypos'   : 40
            },
            {
                'id' : 'class1',
                'data' : [ 40, 42, 40, 52, 53, 58, 66, 58, 34, 37, 55, 47, 46, 54, 34, 40, 42, 37, 68, 60, 44, 44, 57, 46, 39 ],
                'label' : 'Class B',
                'ypos'   : 110
            }
        ]

    };

    // init our graph class and draw the x axis
    var class_r = Graph.init_blank( '#ex-class' );
    Graph.addXAxis( class_r, 80 );
    var custom = {
        'label' : 'Tvoji podatki',
        'ypos'  : 40
    };

    $.each( graph.ex_class_results, function(i, class_results) {
        // do all these calculations first
        class_results.mean     = Array.mean( class_results.data );
        class_results.stddev   = Array.stddev( class_results.data );
        class_results.variance = Array.variance( class_results.data );

        // now, draw some box plots
        var boxplot = Graph.addBox( class_r, 'ex-class-box-' + class_results.id, class_results );
        class_results.shapes = [ boxplot ]
        Graph.hide( class_r, class_results.shapes );
    });

    Graph.show( class_r, graph.ex_class_results[0].shapes );

    // respond to the button click event
    $('.ex-classes-class').click(function () {
        var class_num = $(this).attr( 'data-class' );

        // for this set of data, show the figures
        var definition = graph.ex_class_results[class_num];
        $('#class-data').html( definition.data.join(', ') );
        $('#class-q1').html( toFixed(definition.lower_quartile, 2) );
        $('#class-median').html( toFixed(definition.median, 2) );
        $('#class-q3').html( toFixed(definition.upper_quartile, 2) );
        $('#class-min').html( toFixed(definition.min, 2) );
        $('#class-max').html( toFixed(definition.max, 2) );
        $('#class-iqr').html( toFixed(definition.iqr, 2) );

        // hide/show any graphs
        if ( custom.shapes ) {
            Graph.hide( class_r, custom.shapes );
        }

        $.each(graph.ex_class_results, function(i, class_results) {
            if ( class_results.id === 'class' + class_num ) {
                Graph.show( class_r, class_results.shapes );
            }
            else {
                Graph.hide( class_r, class_results.shapes );
            }
        });

        // hide/show the paragraph texts
        $('.ex-class-desc').hide();
        $('#ex-class-desc' + class_num).show();
    });

    // show the first plot
    $('.ex-classes-class').first().click();

    // let the user use their own data
    $('#use-my-data').click( function() {
        // hide any current plot
        if ( custom.shapes ) {
            Graph.hide( class_r, custom.shapes );
        }

        // firstly, check that the input looks about right
        var string = $('#my-data').val();
        $('#error').text( '' );
        // just look for input matching "1, 2, 3" (spaces optional)
        if ( ! string.match( /^\s*\d+\s*(?:,\s*\d+)*\s*$/ ) ) {
            $('#error').text( 'Neveljaven vnos. Uporabi samo števila, ločena z vejico.' );
            return;
        }

        // hide all the other graphs
        $.each(graph.ex_class_results, function(i, class_results) {
            Graph.hide( class_r, class_results.shapes );
        });

        // make a new one
        custom = {
            'label' : 'Tvoji podatki',
            'ypos'  : 40
        };

        // split the string and turn each bit into a proper integer
        custom.data = string.split( /\s*,\s*/ );
        $.each(custom.data, function(i, v) {
            custom.data[i] = parseInt(v);
        });

        // do all these calculations first
        custom.mean     = Array.mean( custom.data );
        custom.stddev   = Array.stddev( custom.data );
        custom.variance = Array.variance( custom.data );

        // now, draw some box plots
        custom.shapes = Graph.addBox( class_r, 'custom', custom );

        // 19,34,44,45,50,52,54,55,60,61,62,75

        // show all of these on the screen
        $('#class-data').html( custom.data.join(', ') );
        $('#class-mean').html( toFixed(custom.mean, 2) );
        $('#class-stddev').html( toFixed(custom.stddev, 2) );
        $('#class-variance').html( toFixed(custom.variance, 2) );
        $('#class-q1').html( toFixed(custom.lower_quartile, 2) );
        $('#class-median').html( toFixed(custom.median, 2) );
        $('#class-q3').html( toFixed(custom.upper_quartile, 2) );
        $('#class-min').html( toFixed(custom.min, 2) );
        $('#class-max').html( toFixed(custom.max, 2) );
        $('#class-iqr').html( toFixed(custom.iqr, 2) );
        $('.ex-class-desc').hide();
    });

    // ------------------------------------------------------------------------
    // now for the 'Comparing Classes' stuff

    //console.log('right here');

    // init our graph class and draw the x axis
    var subject_1_r = Graph.init_blank( '#ex-subject-1' );
    Graph.addXAxis( subject_1_r, 150 );
    $.each( graph.subject_1, function(i, class_results) {
        // do all these calculations first
        class_results.mean     = Array.mean( class_results.data );
        class_results.stddev   = Array.stddev( class_results.data );
        class_results.variance = Array.variance( class_results.data );

        // now, draw some box plots
        var boxplot = Graph.addBox( subject_1_r, 'ex-subject-box-' + class_results.id, class_results );
        class_results.shapes = [ boxplot ]
    });

    // init our graph class and draw the x axis
    var subject_2_r = Graph.init_blank( '#ex-subject-2' );
    Graph.addXAxis( subject_2_r, 150 );
    $.each( graph.subject_2, function(i, class_results) {
        // do all these calculations first
        class_results.mean     = Array.mean( class_results.data );
        class_results.stddev   = Array.stddev( class_results.data );
        class_results.variance = Array.variance( class_results.data );

        // now, draw some box plots
        var boxplot = Graph.addBox( subject_2_r, 'ex-subject-box-' + class_results.id, class_results );
        class_results.shapes = [ boxplot ]
    });
});