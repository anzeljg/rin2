"use strict";

$(document).ready(function () {
    // Settings for interactive
    var baseCalculatorSettings = {
        BASE: 10,
        DIGITS: 4,
        OFFSET: 0,
        SHOW_POWER: true,
        SHOW_MULTIPLICATION: true,
        SHOW_VALUE: true,
        SHOW_TOTAL: true
    }

    createCalculatorInterface(baseCalculatorSettings);
    updateHeading(baseCalculatorSettings.BASE);

    $('select').change(function() {
        var select = $(this);
        var column = select.parent().parent();
        if (baseCalculatorSettings.SHOW_POWER || baseCalculatorSettings.SHOW_MULTIPLICATION) {
            column.find('.orignal-value').text(parseInt(select.val(), baseCalculatorSettings.BASE));
        }
        if (baseCalculatorSettings.SHOW_VALUE) {
            column.find('.computed-value').text(select.val() * select.data('value'));
        }
        updateTotalColumn(baseCalculatorSettings);
    });
});
