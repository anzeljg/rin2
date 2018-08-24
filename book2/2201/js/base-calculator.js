"use strict";

function updateHeading(base) {
    var header = document.getElementById('base-value');
    header.innerHTML = base;
}


function updateTotalColumn(settings) {
    var total = 0;
    $('#interactive-base-calculator select').each(function() {
        var select = $(this);
        var value = select.data('value');
        total += parseInt(select.val(), settings.BASE) * value;
    });

    var totalColumn = $('#interactive-base-calculator #total-column');
    totalColumn.find('div').text(total);
};


// Sets up the cards for the interactive
function createCalculatorInterface(settings) {
    var calculatorColumns = document.getElementById("interactive-base-calculator-container");

    // Empty container
    while (calculatorColumns.firstChild) {
        calculatorColumns.removeChild(calculatorColumns.firstChild);
    }

    // Count number of rows needed
    var numberOfRows = 0;
    if (settings.SHOW_POWER) {
        numberOfRows += 1;
    }
    if (settings.SHOW_MULTIPLICATION) {
        numberOfRows += 1;
    }
    if (settings.SHOW_VALUE) {
        numberOfRows += 1;
    }

    var value = Math.pow(settings.BASE, settings.DIGITS + settings.OFFSET - 1);

    for (var digit = settings.DIGITS - 1; digit >= 0; digit--) {
        var columnElement = createCalculatorColumnContainer();

        if (settings.SHOW_POWER) {
            columnElement.appendChild(createPowerElement(settings, digit + settings.OFFSET));
        }
        if (settings.SHOW_MULTIPLICATION) {
            columnElement.appendChild(createMultiplicationElement(value));
        }
        if (settings.SHOW_VALUE) {
            columnElement.appendChild(createValueElement(value));
        }
        columnElement.appendChild(createSelectElement(settings, value));

        calculatorColumns.appendChild(columnElement);
        if (digit > 0 || (settings.SHOW_TOTAL && digit == 0)) {
            calculatorColumns.appendChild(createSymbolColumn(digit, numberOfRows));
        }
        value /= settings.BASE;
    }
    if (settings.SHOW_TOTAL) {
        if (numberOfRows == 0) {
            calculatorColumns.appendChild(createSymbolColumn(0, 1));
        }
        calculatorColumns.appendChild(createTotalsColumn(numberOfRows));
    }
    return calculatorColumns;
};


function createSelectElement(settings, value) {
    var element = createCalculatorElement();
    element.className += ' pad-left'
    var select = document.createElement('select');
    $(select).data('value', value);
    select.className = 'calculator-element';
    for (var num = 0; num < settings.BASE; num++) {
        var option = document.createElement('option');
        option.text = option.value = num.toString(settings.BASE).toUpperCase();
        select.appendChild(option);
    }
    element.appendChild(select);
    return element;
};


function createCalculatorColumnContainer() {
    var columnContainer = document.createElement('div');
    columnContainer.className = 'calculator-column';
    return columnContainer;
};


function createSymbolColumn(columnNumber, numberOfRows) {
    var columnElement = createCalculatorColumnContainer();
    for (var i = 0; i < numberOfRows; i++) {
        var symbol = createCalculatorElement();
        symbol.className += ' calculator-symbol';
        if (columnNumber == 0) {
            symbol.innerHTML = '=';
        } else {
            symbol.innerHTML = '+';
        }
        columnElement.appendChild(symbol);
    }
    return columnElement;
};


function createTotalsColumn(numberOfRows) {
    var columnElement = createCalculatorColumnContainer();
    columnElement.id = 'total-column';
    for (var i = 0; i < Math.max(numberOfRows, 1); i ++) {
        var element = createCalculatorElement();
        element.innerHTML = 0;
        columnElement.appendChild(element);
    }
    return columnElement;
};


function createPowerElement(settings, digit) {
    var element = createCalculatorElement();
    var span = document.createElement('span');
    span.className = 'orignal-value';
    span.innerHTML = 0;
    element.appendChild(span);
    element.innerHTML += ' &times; ' + settings.BASE + '<sup>' + digit + '</sup>';
    return element;
};


function createMultiplicationElement(value) {
    var element = createCalculatorElement();
    var span = document.createElement('span');
    span.className = 'orignal-value';
    span.innerHTML = 0;
    element.appendChild(span);
    element.innerHTML += ' &times; ' + value;
    return element;
};


function createValueElement(value) {
    var element = createCalculatorElement();
    element.className += ' computed-value';
    element.innerHTML = value * 0;
    return element;
};


function createCalculatorElement() {
    var element = document.createElement('div');
    element.className ='calculator-element';
    return element;
};


// From jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
