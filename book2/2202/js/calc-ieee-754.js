// adds leading zeros to a number
function pad(num, length) {
	var string = num + ""; // convert to string
	while (string.length < length) {
		string = "0" + string;
	}
	return string;
}

// converts a number to a binary string representing the number
function decimalToBinary(dec) {
	return parseInt(dec).toString(2);
}

// converts a binary number formatted as a string into a number
function binaryToDecimal(bin) {
	return parseInt(bin, 2);
}

// converts a double number into the IEEE representation bit string
function doubleToIEEE(f) {
    var buf = new ArrayBuffer(8);
    (new Float64Array(buf))[0] = f;
    var parts = [(new Uint32Array(buf))[0], (new Uint32Array(buf))[1]];
    return pad(decimalToBinary(parts[1]), 32) + pad(decimalToBinary(parts[0]), 32);
}

// converts a float number into the IEE representation bit string
function floatToIEEE(f) {
    var buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = f;
    return pad(decimalToBinary((new Uint32Array(buf))[0]), 32);
}


(function() {
	// cache DOM
	var floatInput = $('#input-float'), 
		rawBinaryOutput = $('#raw-binary-output'),
		floatOutputRow = $('#float-output-row'),
		floatMarkerRow = $('#float-marker-row'),
		doubleOutputRow = $('#double-output-row'),
		doubleMarkerRow = $('#double-marker-row'),
		specialInputValueSelect = $('#special-input-value'),
		stringOutputHeading = $('#string-output');

	var val = NaN;

	function updateOutput() {
		try {
			var f = val;

			stringOutputHeading.html(f.toString());

			// float
			var floatBitString = floatToIEEE(f);
			var currentBit = 0;
			for (var i = 0; i < 4; i++) {
				var byteString = floatBitString.substring(i * 8, i * 8 + 8),
					cellHTML = "",
					markHTML = "";
				for (var j = 0; j < 8; j++) {
					var className = "mantissa"; // default
					if (i === 0 && j === 0) {
						className = "sign";
					}
					else if (i === 0 || i === 1 && j < 1) {
						className = "exponent";
					}
					currentBit = 31 - (i * 8 + j);
					cellHTML += "<span id=\"b" + currentBit + "\" class=\"" + className + "\">" + byteString.substring(j, j + 1) + "</span>";
					markHTML += "<span class=\"" + className + "\">";
					if (currentBit == 31 ||
					    currentBit == 30 || currentBit == 23 ||
    					currentBit == 22 || currentBit == 0) {
						markHTML += currentBit;
					}
					else {
						markHTML += '&nbsp;'
					}
					markHTML += "</span>";
				}
				floatOutputRow.children().eq(i).html(cellHTML);
				floatMarkerRow.children().eq(i).html(markHTML);
			}

			// double
			doubleBitString = doubleToIEEE(f)
			var currentBit = 0;
			for (var i = 0; i < 8; i++) {
				var byteString = doubleBitString.substring(i * 8, i * 8 + 8),
					cellHTML = "",
					markHTML = "";
				for (var j = 0; j < 8; j++) {
					var className = "mantissa"; // default
					if (i === 0 && j === 0) {
						className = "sign";
					}
					else if (i === 0 || i === 1 && j < 4) {
						className = "exponent";
					}
					currentBit = 63 - (i * 8 + j);
					cellHTML += "<span id=\"b" + currentBit + "\" class=\"" + className + "\">" + byteString.substring(j, j + 1) + "</span>";
					markHTML += "<span class=\"" + className + "\">";
					if (currentBit == 63 ||
					    currentBit == 62 || currentBit == 52 ||
    					currentBit == 51 || currentBit == 0) {
						markHTML += currentBit;
					}
					else {
						markHTML += '&nbsp;'
					}
					markHTML += "</span>";
				}
				doubleOutputRow.children().eq(i).html(cellHTML);
				doubleMarkerRow.children().eq(i).html(markHTML);
			}
		}
		catch (e) {
			console.log(e);
			// TODO: show error
		}
	}

	floatInput.on('change keyup', function() {
		try {
			val = parseFloat(floatInput.val());
			if (isNaN(val)) {
				specialInputValueSelect.val('nan');
			}
			else if (Object.is(val, +0)) {
				specialInputValueSelect.val('positive-0');
			}
			else if (Object.is(val, -0)) {
				specialInputValueSelect.val('negative-0');
			}
			else if (val === +Infinity) {
				specialInputValueSelect.val('positive-inf');
			}
			else if (val === -Infinity) {
				specialInputValueSelect.val('negative-inf');
			}
			else {
				specialInputValueSelect.val('number');
			}
		}
		catch (e) {
			val = NaN;
		}
		updateOutput();
	}).trigger('change');

	specialInputValueSelect.on('change', function() {
		switch (specialInputValueSelect.val()) {
			case "number":
				floatInput.trigger('change');
				break;
			case "positive-0":
				val = +0;
				floatInput.val('+0');
				break;
			case "negative-0":
				val = -0;
				floatInput.val('-0');
				break;
			case "positive-inf":
				val = +Infinity;
				floatInput.val('+Infinity');
				break;
			case "negative-inf":
				val = -Infinity
				floatInput.val('-Infinity');
				break;
			default:
				val = NaN
				break;
		}
		updateOutput();
	})
})();
