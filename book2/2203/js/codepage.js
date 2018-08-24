
var info = new Array;

function basicASCII() {
  characters(false);
}

function extendedASCII() {
  characters(true);
}

function characters(offset=false) {
  for (i = 0; i <= 127; i++) {
    var num = i
	if (offset) {
	  num += 128;
	}
    var character = new Array();
    var bin = num.toString(2);
    character[0] = "00000000".substr(bin.length) + bin; // binary
    character[1] = num.toString(8);  // octal
    character[2] = num.toString(10); // decimal
    character[3] = num.toString(16).toUpperCase(); // hexadecimal
    info[i] = character;
  }
}

function display(i) {
  console.log(i);
  document.getElementById("binValue").innerHTML = info[i][0];
  document.getElementById("octValue").innerHTML = info[i][1];
  document.getElementById("decValue").innerHTML = info[i][2];
  document.getElementById("hexValue").innerHTML = info[i][3];
}
