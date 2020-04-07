// ----------------------------------------------------------------------------

// setup some functions which work on arrays of data

function toFixed(value, precision) {
    var precision = precision || 0,
        neg = value < 0,
        power = Math.pow(10, precision),
        value = Math.round(value * power),
        integral = String((neg ? Math.ceil : Math.floor)(value / power)),
        fraction = String((neg ? -value : value) % power),
        padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    //return precision ? integral + '.' +  padding + fraction : integral;
    return precision ? integral + ',' +  padding + fraction : integral;
}

Array.z_table = {
    '0.00' : 0.0000,
    '0.01' : 0.0040,
    '0.02' : 0.0080,
    '0.03' : 0.0120,
    '0.04' : 0.0160,
    '0.05' : 0.0199,
    '0.06' : 0.0239,
    '0.07' : 0.0279,
    '0.08' : 0.0319,
    '0.09' : 0.0359,
    '0.10' : 0.0398,
    '0.11' : 0.0438,
    '0.12' : 0.0478,
    '0.13' : 0.0517,
    '0.14' : 0.0557,
    '0.15' : 0.0596,
    '0.16' : 0.0636,
    '0.17' : 0.0675,
    '0.18' : 0.0714,
    '0.19' : 0.0753,
    '0.20' : 0.0793,
    '0.21' : 0.0832,
    '0.22' : 0.0871,
    '0.23' : 0.0910,
    '0.24' : 0.0948,
    '0.25' : 0.0987,
    '0.26' : 0.1026,
    '0.27' : 0.1064,
    '0.28' : 0.1103,
    '0.29' : 0.1141,
    '0.30' : 0.1179,
    '0.31' : 0.1217,
    '0.32' : 0.1255,
    '0.33' : 0.1293,
    '0.34' : 0.1331,
    '0.35' : 0.1368,
    '0.36' : 0.1406,
    '0.37' : 0.1443,
    '0.38' : 0.1480,
    '0.39' : 0.1517,
    '0.40' : 0.1554,
    '0.41' : 0.1591,
    '0.42' : 0.1628,
    '0.43' : 0.1664,
    '0.44' : 0.1700,
    '0.45' : 0.1736,
    '0.46' : 0.1772,
    '0.47' : 0.1808,
    '0.48' : 0.1844,
    '0.49' : 0.1879,
    '0.50' : 0.1915,
    '0.51' : 0.1950,
    '0.52' : 0.1985,
    '0.53' : 0.2019,
    '0.54' : 0.2054,
    '0.55' : 0.2088,
    '0.56' : 0.2123,
    '0.57' : 0.2157,
    '0.58' : 0.2190,
    '0.59' : 0.2224,
    '0.60' : 0.2257,
    '0.61' : 0.2291,
    '0.62' : 0.2324,
    '0.63' : 0.2357,
    '0.64' : 0.2389,
    '0.65' : 0.2422,
    '0.66' : 0.2454,
    '0.67' : 0.2486,
    '0.68' : 0.2517,
    '0.69' : 0.2549,
    '0.70' : 0.2580,
    '0.71' : 0.2611,
    '0.72' : 0.2642,
    '0.73' : 0.2673,
    '0.74' : 0.2704,
    '0.75' : 0.2734,
    '0.76' : 0.2764,
    '0.77' : 0.2794,
    '0.78' : 0.2823,
    '0.79' : 0.2852,
    '0.80' : 0.2881,
    '0.81' : 0.2910,
    '0.82' : 0.2939,
    '0.83' : 0.2967,
    '0.84' : 0.2995,
    '0.85' : 0.3023,
    '0.86' : 0.3051,
    '0.87' : 0.3078,
    '0.88' : 0.3106,
    '0.89' : 0.3133,
    '0.90' : 0.3159,
    '0.91' : 0.3186,
    '0.92' : 0.3212,
    '0.93' : 0.3238,
    '0.94' : 0.3264,
    '0.95' : 0.3289,
    '0.96' : 0.3315,
    '0.97' : 0.3340,
    '0.98' : 0.3365,
    '0.99' : 0.3389,
    '1.00' : 0.3413,
    '1.01' : 0.3438,
    '1.02' : 0.3461,
    '1.03' : 0.3485,
    '1.04' : 0.3508,
    '1.05' : 0.3531,
    '1.06' : 0.3554,
    '1.07' : 0.3577,
    '1.08' : 0.3599,
    '1.09' : 0.3621,
    '1.10' : 0.3643,
    '1.11' : 0.3665,
    '1.12' : 0.3686,
    '1.13' : 0.3708,
    '1.14' : 0.3729,
    '1.15' : 0.3749,
    '1.16' : 0.3770,
    '1.17' : 0.3790,
    '1.18' : 0.3810,
    '1.19' : 0.3830,
    '1.20' : 0.3849,
    '1.21' : 0.3869,
    '1.22' : 0.3888,
    '1.23' : 0.3907,
    '1.24' : 0.3925,
    '1.25' : 0.3944,
    '1.26' : 0.3962,
    '1.27' : 0.3980,
    '1.28' : 0.3997,
    '1.29' : 0.4015,
    '1.30' : 0.4032,
    '1.31' : 0.4049,
    '1.32' : 0.4066,
    '1.33' : 0.4082,
    '1.34' : 0.4099,
    '1.35' : 0.4115,
    '1.36' : 0.4131,
    '1.37' : 0.4147,
    '1.38' : 0.4162,
    '1.39' : 0.4177,
    '1.40' : 0.4192,
    '1.41' : 0.4207,
    '1.42' : 0.4222,
    '1.43' : 0.4236,
    '1.44' : 0.4251,
    '1.45' : 0.4265,
    '1.46' : 0.4279,
    '1.47' : 0.4292,
    '1.48' : 0.4306,
    '1.49' : 0.4319,
    '1.50' : 0.4332,
    '1.51' : 0.4345,
    '1.52' : 0.4357,
    '1.53' : 0.4370,
    '1.54' : 0.4382,
    '1.55' : 0.4394,
    '1.56' : 0.4406,
    '1.57' : 0.4418,
    '1.58' : 0.4429,
    '1.59' : 0.4441,
    '1.60' : 0.4452,
    '1.61' : 0.4463,
    '1.62' : 0.4474,
    '1.63' : 0.4484,
    '1.64' : 0.4495,
    '1.65' : 0.4505,
    '1.66' : 0.4515,
    '1.67' : 0.4525,
    '1.68' : 0.4535,
    '1.69' : 0.4545,
    '1.70' : 0.4554,
    '1.71' : 0.4564,
    '1.72' : 0.4573,
    '1.73' : 0.4582,
    '1.74' : 0.4591,
    '1.75' : 0.4599,
    '1.76' : 0.4608,
    '1.77' : 0.4616,
    '1.78' : 0.4625,
    '1.79' : 0.4633,
    '1.80' : 0.4641,
    '1.81' : 0.4649,
    '1.82' : 0.4656,
    '1.83' : 0.4664,
    '1.84' : 0.4671,
    '1.85' : 0.4678,
    '1.86' : 0.4686,
    '1.87' : 0.4693,
    '1.88' : 0.4699,
    '1.89' : 0.4706,
    '1.90' : 0.4713,
    '1.91' : 0.4719,
    '1.92' : 0.4726,
    '1.93' : 0.4732,
    '1.94' : 0.4738,
    '1.95' : 0.4744,
    '1.96' : 0.4750,
    '1.97' : 0.4756,
    '1.98' : 0.4761,
    '1.99' : 0.4767,
    '2.00' : 0.4772,
    '2.01' : 0.4778,
    '2.02' : 0.4783,
    '2.03' : 0.4788,
    '2.04' : 0.4793,
    '2.05' : 0.4798,
    '2.06' : 0.4803,
    '2.07' : 0.4808,
    '2.08' : 0.4812,
    '2.09' : 0.4817,
    '2.10' : 0.4821,
    '2.11' : 0.4826,
    '2.12' : 0.4830,
    '2.13' : 0.4834,
    '2.14' : 0.4838,
    '2.15' : 0.4842,
    '2.16' : 0.4846,
    '2.17' : 0.4850,
    '2.18' : 0.4854,
    '2.19' : 0.4857,
    '2.20' : 0.4861,
    '2.21' : 0.4864,
    '2.22' : 0.4868,
    '2.23' : 0.4871,
    '2.24' : 0.4875,
    '2.25' : 0.4878,
    '2.26' : 0.4881,
    '2.27' : 0.4884,
    '2.28' : 0.4887,
    '2.29' : 0.4890,
    '2.30' : 0.4893,
    '2.31' : 0.4896,
    '2.32' : 0.4898,
    '2.33' : 0.4901,
    '2.34' : 0.4904,
    '2.35' : 0.4906,
    '2.36' : 0.4909,
    '2.37' : 0.4911,
    '2.38' : 0.4913,
    '2.39' : 0.4916,
    '2.40' : 0.4918,
    '2.41' : 0.4920,
    '2.42' : 0.4922,
    '2.43' : 0.4925,
    '2.44' : 0.4927,
    '2.45' : 0.4929,
    '2.46' : 0.4931,
    '2.47' : 0.4932,
    '2.48' : 0.4934,
    '2.49' : 0.4936,
    '2.50' : 0.4938,
    '2.51' : 0.4940,
    '2.52' : 0.4941,
    '2.53' : 0.4943,
    '2.54' : 0.4945,
    '2.55' : 0.4946,
    '2.56' : 0.4948,
    '2.57' : 0.4949,
    '2.58' : 0.4951,
    '2.59' : 0.4952,
    '2.60' : 0.4953,
    '2.61' : 0.4955,
    '2.62' : 0.4956,
    '2.63' : 0.4957,
    '2.64' : 0.4959,
    '2.65' : 0.4960,
    '2.66' : 0.4961,
    '2.67' : 0.4962,
    '2.68' : 0.4963,
    '2.69' : 0.4964,
    '2.70' : 0.4965,
    '2.71' : 0.4966,
    '2.72' : 0.4967,
    '2.73' : 0.4968,
    '2.74' : 0.4969,
    '2.75' : 0.4970,
    '2.76' : 0.4971,
    '2.77' : 0.4972,
    '2.78' : 0.4973,
    '2.79' : 0.4974,
    '2.80' : 0.4974,
    '2.81' : 0.4975,
    '2.82' : 0.4976,
    '2.83' : 0.4977,
    '2.84' : 0.4977,
    '2.85' : 0.4978,
    '2.86' : 0.4979,
    '2.87' : 0.4979,
    '2.88' : 0.4980,
    '2.89' : 0.4981,
    '2.90' : 0.4981,
    '2.91' : 0.4982,
    '2.92' : 0.4982,
    '2.93' : 0.4983,
    '2.94' : 0.4984,
    '2.95' : 0.4984,
    '2.96' : 0.4985,
    '2.97' : 0.4985,
    '2.98' : 0.4986,
    '2.99' : 0.4986,
    '3.00' : 0.4987,
    '3.01' : 0.4987,
    '3.02' : 0.4987,
    '3.03' : 0.4988,
    '3.04' : 0.4988,
    '3.05' : 0.4989,
    '3.06' : 0.4989,
    '3.07' : 0.4989,
    '3.08' : 0.4990,
    '3.09' : 0.4990
};

Array.probability = function( z_score ) {
    var lookup, prob;
    // console.log('z_score', z_score);
    if ( z_score > 0.0 ) {
        // truncate to 2dp
        lookup = Math.round(z_score * 100) / 100;
        prob = Array.z_table[toFixed(lookup, 2)];
        return toFixed(( prob + 0.5 ) * 100, 1);
    }
    else {
        z_score *= -1;
        lookup = Math.round(z_score * 100) / 100;
        prob = 0.5 - Array.z_table[toFixed(lookup, 2)];
        return toFixed(( prob ) * 100, 1);
    }
};

Array.max = function( array ) {
    return Math.max.apply( null, array );
};

Array.min = function( array ) {
    return Math.min.apply( null, array );
};

Array.mean = function( array ) {
    var total = 0.0;
    for ( var i = 0; i < array.length; i++ ) {
        total += array[i];
    }
    return total/array.length;
};

Array.sort = function( a, b ) {
    return a - b;
}

// http://www.mathsisfun.com/data/quartiles.html
Array.median = function( array ) {
    array.sort( Array.sort );
    var length = array.length;
    if ( length % 2 ) {
        // odd number
        return array[(length-1)/2];
    }
    else {
        // even number
        // (force this to be a float calculation)
        return ( 0.0 + array[length/2-1] + array[length/2] ) / 2.0;
    }
};

Array.lower_quartile = function( array ) {
    array.sort( Array.sort );
    var length = array.length;

    if ( length % 2 ) {
        // odd number, therefore the lower quartile is the median of this
        return Array.median( array.slice(0, (length-1)/2 ) );
    }
    else {
        // even number, therefore the upper quartile is the median of this
        return Array.median( array.slice( 0, length / 2 ) );
    }
};

Array.upper_quartile = function( array ) {
    array.sort( Array.sort );
    var length = array.length;

    if ( length % 2 ) {
        // odd number, therefore the lower quartile is the median of this
        return Array.median( array.slice( - (length-1)/2 ) );
    }
    else {
        // even number, therefore the upper quartile is the median of this
        return Array.median( array.slice( - length / 2 ) );
    }
};

Array.mode = function( array ) {
    var count = {};
    $.each(data, function(i, d) {
        if ( count[d] ) {
            count[d] = count[d] + 1;
        }
        else {
            count[d] = 1;
        }
    });

    var max_freq = 0;
    var mode;
    $.each(count, function(key, freq) {
        if ( freq > max_freq ) {
            mode = key;
            max_freq = freq;
        }
    });
    return '' + mode + ' (needs to be fixed)';
};

Array.variance = function( array ) {
    var mean = Array.mean(array);

    var diff;
    var total_squares = 0;
    for ( var i = 0; i < array.length; i++ ) {
        diff = array[i] - mean;
        total_squares += diff * diff;
    }
    return total_squares / array.length;
};

Array.stddev = function( array ) {
    var mean = Array.mean(array);
    var variance = Array.variance(array);
    return Math.sqrt(variance);
};

Array.normal_curve = function( arg1, arg2 ) {
    var mean;
    var stddev;
    if ( typeof arg1 == 'object' && typeof arg2 == 'undefined' ) {
        mean = Array.mean(arg1);
        stddev = Array.stddev(arg2);
    }
    else if ( typeof arg1 == 'number' && typeof arg2 == 'number' ) {
        mean = arg1;
        stddev = arg2;
    }
    else {
        return [];
    }

    // setup some invariants (http://en.wikipedia.org/wiki/Normal_distribution)
    var one_over_sigma_root_two_pi = 1 / ( stddev * Math.sqrt(2*Math.PI) );
    var two_sigma_squared = 2 * stddev * stddev;
    var x_minus_mean, exponent, p, total = 0.0;

    var Y = [];
    for( x = 0; x <= 100; x++ ) {
        x_minus_mean = x - mean;
        exponent = - (x_minus_mean * x_minus_mean) / two_sigma_squared;
        p = one_over_sigma_root_two_pi * Math.exp(exponent);

        Y.push( p );
    }

    return Y;
};

// From: http://vorlon.case.edu/~vxl11/software/gauss.html
Array.box_muller = function() {
    var u1, u2;
    u1 = u2 = 0.;
    while (u1 * u2 == 0.) {
        u1 = Math.random();
        u2 = Math.random();
    }
    return Math.sqrt(-2. * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
};

Array.gauss = function(mean, stddev) {
    return stddev * Array.box_muller() + 1.0 * mean;
};

Array.generate_normal_distribution = function( mean, stddev, quantity ) {
    var data = [];
    for ( var i = 0; i < quantity; i++ ) {
        data.push( Array.gauss(mean, stddev) );
    }
    return data;
};

Math.stanine = function( percentage ) {
    if ( percentage < 0 ) {
        return;
    }
    else if ( percentage < 4 ) {
        return 1;
    }
    else if ( percentage < 11 ) {
        return 2;
    }
    else if ( percentage < 23 ) {
        return 3;
    }
    else if ( percentage < 40 ) {
        return 4;
    }
    else if ( percentage < 60 ) {
        return 5;
    }
    else if ( percentage < 77 ) {
        return 6;
    }
    else if ( percentage < 89 ) {
        return 7;
    }
    else if ( percentage < 96 ) {
        return 8;
    }
    else if ( percentage < 100 ) {
        return 9;
    }
    return;
};

Math.nth = function ( number) {
    number = parseInt(number);
    if ( number % 100 >= 10 && number % 100 <= 19 ) {
        return '' + number + 'th';
    }
    if ( number % 10 == 1 ) {
        return '' + number + 'st';
    }
    if ( number % 10 == 2 ) {
        return '' + number + 'nd';
    }
    if ( number % 10 == 3 ) {
        return '' + number + 'rd';
    }
    return '' + number + 'th';
};

// ----------------------------------------------------------------------------
