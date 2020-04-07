// ----------------------------------------------------------------------------

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

Graph = {
    'line' : function(r) {
        var x = r.getBBox().width,
            h = r.getBBox().height;
    },

    'store_bounds' : function( $el, r, w, h ) {
        // figure out the bounds of the graph
        var x0 = 30,
            x100 = w - 30,
            y0 = h - 30,
            y1 = 30;

        // store the Raphael object with the element
        var graph = {
            'r' : r,
            'x0' : x0,
            'x100' : x100,
            'y0' : y0,
            'y1' : y1,
            'xdiff' : x100 - x0,
            'ydiff' : y0 - y1
        }

        // store the graph data
        $el.data( 'graph', graph );
    },

    'init' : function( el, w, h ) {
        var $el = $(el);

        // set up some vars so we know our drawing board
        var canvas_w = $el.width();
        var canvas_h = $el.height();
        var r = Raphael( $el.get(0), canvas_w, canvas_h );

        w = w || canvas_w;
        h = h || canvas_h;

        this.store_bounds( $el, r, w, h );

        // figure out the bounds of the graph
        var graph = $el.data( 'graph' );

        // draw the x and y axis
        this.draw_x_axis( r, graph.y0, graph.x0, graph.x100 );
        this.draw_y_axis( r, graph.x0, graph.y0, graph.y1 );

        // done! :)
        return $el;
    },

    'init_blank' : function( el, w, h ) {
        var $el = $(el);

        // set up some vars so we know our drawing board
        var canvas_w = $el.width();
        var canvas_h = $el.height();
        var r = Raphael( $el.get(0), canvas_w, canvas_h );

        w = w || canvas_w;
        h = h || canvas_h;

        this.store_bounds( $el, r, w, h );

        // done! :)
        return $el;
    },

    'draw_x_axis' : function( r, y0, x0, x100) {
        // axis line
        var xaxis = r.path( 'M' + x0 + ',' + y0 + ' L' + x100 + ',' + y0 );

        // stepped increments and labels
        var line;
        var xdiff = x100 - x0;
        for ( var i = 0; i <= 100; i+= 10 ) {
            line = r.path( 'M' + (x0+(x100-x0)*i/100) + ',' + y0 + ' l0,6' );
            r.text( x0 + (xdiff*i/100), y0 + 15, i);
        }
    },

    'draw_y_axis' : function( r, x0, y0, y1) {
        r.text( 50, 10, 'Probability Density');

        // axis line
        var yaxis = r.path( 'M' + x0 + ',' + y0 + ' L' + x0 + ',' + y1 );

        // stepped increments and labels
        var y;
        var line;
        for ( var i = 0; i <= 100; i+= 25 ) {
            var y = y0 + (y1-y0) * i / 100;
            line = r.path( 'M' + x0 + ',' + y + ' l-6,0' );
            r.text( x0 - 20, y, i / 2500);
        }
    },

    'path' : function( x0, x100, y0, y1, xdiff, ydiff, Y, xfrom, xto ) {
        var path = '';
        xfrom = parseInt(xfrom);
        xto = parseInt(xto);

        if ( xfrom < 0 ) xfrom = 0;
        if ( xto > 100 ) xto = 100;

        // bottom of the curve
        path = 'M' + (x0 + xfrom * xdiff/100) + ',' + y0;

        // do the curve itself
        for ( x = xfrom; x <= xto; x++ ) {
            path += 'L' + (x0 + x * xdiff/100)  + ',' + (y0 - Y[x] * ydiff * 25);
        }

        // finish off the bottom
        path += 'L' + (x0 + xto * xdiff/100) + ',' + y0;

        // let the caller close the loop with 'z' if they want to

        return path;
    },

    'add' : function( el, id, definition ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;
        var curve;

        // the 'example' mean and stddev need to be updated with the real ones
        if ( typeof definition.mean === 'undefined' ) {
            definition.mean = Array.mean( definition.data );
        }
        if ( typeof definition.stddev === 'undefined' ) {
            definition.stddev = Array.stddev( definition.data );
        }

        // get the Normal Equation path for this set of data
        var Y = Array.normal_curve( definition.mean, definition.stddev );

        // remember all of the elements we have created
        var elements = [];
        var path = '';
        var x;
        var min, max;

        // let's see if they want to show the 68-95 rule
        if ( definition['show-68-95'] ) {

            // add a curve between 4 stddev
            min = definition.mean - ( 4 * definition.stddev );
            max = definition.mean + ( 4 * definition.stddev );
            path = this.path(graph.x0, graph.x100, graph.y0, graph.y1, graph.xdiff, graph.ydiff, Y, min, max);
            path += ' z';
            curve = r.path( path );
            curve.attr({
                'stroke' : 'none',
                'stroke-width' : 0,
                'fill' : '90-#044-#0ff'
            });
            $(curve.node).attr('id', id + '-std4');
            elements.push(curve);

            // add a curve between 3 stddev
            min = definition.mean - ( 3 * definition.stddev );
            max = definition.mean + ( 3 * definition.stddev );
            path = this.path(graph.x0, graph.x100, graph.y0, graph.y1, graph.xdiff, graph.ydiff, Y, min, max);
            path += ' z';
            curve = r.path( path );
            curve.attr({
                'stroke' : 'none',
                'stroke-width' : 0,
                'fill' : '90-#0b0-#0f0'
            });
            $(curve.node).attr('id', id + '-std3');
            elements.push(curve);

            // add a curve between 2 stddev
            min = definition.mean - ( 2 * definition.stddev );
            max = definition.mean + ( 2 * definition.stddev );
            path = this.path(graph.x0, graph.x100, graph.y0, graph.y1, graph.xdiff, graph.ydiff, Y, min, max);
            path += ' z';
            curve = r.path( path );
            curve.attr({
                'stroke' : 'none',
                'stroke-width' : 0,
                'fill' : '90-#00b-#00f'
            });
            $(curve.node).attr('id', id + '-std2');
            elements.push(curve);

            // add a curve between 1 stddev
            min = definition.mean - ( 1 * definition.stddev );
            max = definition.mean + ( 1 * definition.stddev );
            path = this.path(graph.x0, graph.x100, graph.y0, graph.y1, graph.xdiff, graph.ydiff, Y, min, max);
            path += ' z';
            curve = r.path( path );
            curve.attr({
                'stroke' : 'none',
                'stroke-width' : 0,
                'fill' : '90-#b00-#f00'
            });
            $(curve.node).attr('id', id + '-std1');
            elements.push(curve);
        }

        // plot the main path of the Y values
        path = this.path(graph.x0, graph.x100, graph.y0, graph.y1, graph.xdiff, graph.ydiff, Y, 0, Y.length);
        curve = r.path( path );
        curve.attr({
            'stroke' : (typeof definition.stroke === 'undefined' ? 'black' : definition.stroke),
            'stroke-width' : 2
        });
        elements.push(curve);

        // set the id of this curve element
        $(curve.node).attr('id', id);

        // draw some text at the top of the curve (where z is the mean)
        // since x = mean, much of this formula disappears
        // * http://en.wikipedia.org/wiki/Normal_distribution
        var p = 1 / ( definition.stddev * Math.sqrt(2*Math.PI) );
        p *= 25;
        var label_mean_x = this.scale(graph.x0, graph.x100, definition.mean);
        var label_mean_y = this.scale(graph.y0, graph.y1, p*100) - 10;
        var label_mean = r.text( label_mean_x, label_mean_y, '' + toFixed(definition.mean, 2) + '%' );
        elements.push(label_mean);

        return elements;
    },

    'addCurve' : function( el, id, definition, xfrom, xto ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;

        var Y = Array.normal_curve( definition.mean, definition.stddev );
        var path = this.path(graph.x0, graph.x100, graph.y0, graph.y1, graph.xdiff, graph.ydiff, Y, xfrom, xto);

        var curve = r.path( path );
        return curve;
    },

    'animate' : function( el, curve, attr ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;

        // get the Normal Equation path for this set of data
        var Y = Array.normal_curve( attr.data );

        // plot the path of these Y numbers
        var path = '';
        for ( var x = 0; x < Y.length; x++ ) {
            path += (x==0?'M':'L') + (graph.x0 + x * graph.xdiff/100)  + ',' + (graph.y0 - Y[x] * graph.ydiff * 25);
        }

        curve.animate( { 'path' : path, 'stroke' : attr.stroke }, 1000 );
    },

    'hide' : function( el, curves ) {
        var g = this;
        $.each( curves, function (i, curve) {
            if ( typeOf(curve) === 'array' ) {
                g.hide( el, curve );
            }
            else {
                curve.hide();
            }
        });
    },

    'show' : function( el, curves ) {
        var g = this;
        $.each( curves, function (i, curve) {
            if ( typeOf(curve) === 'array' ) {
                g.show( el, curve );
            }
            else {
                curve.show();
            }
        });
    },

    'addXAxis' : function( el, ypos ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;
        this.draw_x_axis( r, ypos, graph.x0, graph.x100 );
    },

    'addLine' : function( el, x0, y0, x1, y1 ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;

        var line = r.path( [ 'M', x0, ',', y0, 'L', x1, ',', y1 ].join('') );
        return line;
    },

    'addRect' : function( el, x0, y0, x1, y1 ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;

        var line = r.path( [ 'M', x0, ',', y0, 'L', x1, ',', y1 ].join('') );
        return line;
    },

    'scale' : function( low, high, value ) {
        return low + ( value * (high-low) ) / 100;
    },

    'addBox' : function( el, id, definition ) {
        var $el = $(el);
        var graph = $el.data('graph');
        var r = graph.r;

        // figure out where we are going to draw the box
        definition.min = Array.min( definition.data );
        definition.lower_quartile = Array.lower_quartile( definition.data );
        definition.median = Array.median( definition.data );
        definition.upper_quartile = Array.upper_quartile( definition.data );
        definition.iqr = definition.upper_quartile - definition.lower_quartile;
        definition.max = Array.max( definition.data );

        // calculate some x positions on the graph
        var lower_x = this.scale( graph.x0, graph.x100, definition.lower_quartile );
        var upper_x = this.scale( graph.x0, graph.x100, definition.upper_quartile );
        var min_x = this.scale( graph.x0, graph.x100, definition.min );
        var max_x = this.scale( graph.x0, graph.x100, definition.max );

        // draw the whiskers
        var line = this.addLine( el, graph.x0 + (definition.min*graph.xdiff/100), definition.ypos, graph.x0 + (definition.max*graph.xdiff/100), definition.ypos );
        var min = this.addLine( el, min_x, definition.ypos - 10, min_x, definition.ypos + 10 );
        var max = this.addLine( el, max_x, definition.ypos - 10, max_x, definition.ypos + 10 );

        // now draw the box itself
        var rect = r.rect(
            lower_x,
            definition.ypos - 10,
            upper_x - lower_x,
            20
        );
        rect.attr({
            //'fill' : 'white'
            'fill' : '#d9d9d9'
        })

        // and finally, the median
        var median_x = this.scale( graph.x0, graph.x100, definition.median );
        var median = this.addLine( el, median_x, definition.ypos - 10, median_x, definition.ypos + 10 );

        // remember these shapes
        var shapes = [ line, min, max, rect, median ];

        // write the text
        if ( typeof definition.label !== 'undefined' ) {
            var text_x = this.scale( graph.x0, graph.x100, 50 );
            var text = r.text( text_x, definition.ypos + 20, definition.label );
            shapes.push(text);
        }

        // show the various other numbers (min, Q1, median, Q3, max)
        var things = [ 'min', 'lower_quartile', 'median', 'upper_quartile', 'max' ];
        for ( t in things ) {
            var name = things[t];
            text_x = this.scale( graph.x0, graph.x100, definition[name] );
            //text = r.text( text_x, definition.ypos - 20, definition[name] );
            text = r.text( text_x, definition.ypos - 20, String(definition[name]).replace(".", ",") );
            shapes.push(text);
        }

        // return the shapes array
        return shapes;
    },

    'remove' : function( el, curve ) {
        
    },

    'destroy' : function() {

    }
};

// ----------------------------------------------------------------------------
