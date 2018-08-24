/* 
  Braille-Tools
  (c) 2016 Olivier Giulieri
  https://github.com/evoluteur/braille-tools

  (c) 2018 Gregor Anželj - support for Slovenian Braille
*/

var br = {
    braille: function (message) { 
        var txt = ''; 
        var myChar, prevCharNum, inQuote 

        function BrailleChar(bPix, bAlt) {
            return '<div class="br br-' + bPix + '" title="' + bAlt + '"></div>'
        }

        for (var i = 0; i < message.length; i++) {
            myChar = message.charAt(i);
            if ((myChar >= "a") && (myChar <= "z")) { // a to z
                txt += BrailleChar(myChar, myChar);
                prevCharNum = false;            
            }
			else if((myChar >= "A") && (myChar <= "Z")) { // A to Z
                txt += BrailleChar("cap", "velika začetnica") + BrailleChar(myChar.toLowerCase(), myChar);
                prevCharNum = false;         
            }
			else if((myChar > "0") && (myChar <= "9")) {
                if (!prevCharNum){
                    txt += BrailleChar("num", "število");
                } 
                txt += BrailleChar(String.fromCharCode(myChar.charCodeAt(0) + 48), myChar); 
                prevCharNum = true;            
            }
			else {
                switch (myChar) {
                    case " ": 
                        txt += BrailleChar("sp", "presledek");
                        prevCharNum = false;
                        break;
                    case "0":
                        if (!prevCharNum){
                            txt += BrailleChar("num", "število"); 
                        }
                        txt += BrailleChar("j", "0");      
                        prevCharNum = true;
                        break;
                    case "\n":
                        txt += "<br><br>";
                        nbCharsInLine = -1;
                        prevCharNum = false;
                        break;
                    case ".":
                        txt += BrailleChar("period", ".");  
                        prevCharNum = false;
                        break;
                    case "$":
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("d", "$");
                        prevCharNum = false;
                        break;
                    case "€":
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("e", "€");
                        prevCharNum = false;
                        break;
                    case String.fromCharCode(163): // £
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("p", String.fromCharCode(163));
                        prevCharNum = false;
                        break;
                    case String.fromCharCode(169): // ©
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("c", String.fromCharCode(169));
                        prevCharNum = false;
                        break;
                    case String.fromCharCode(174): // ®
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("r", String.fromCharCode(174));
                        prevCharNum = false;
                        break;
					case "™": // tm
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("t", "™");
                        prevCharNum = false;
                        break;
					case "°":
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("s", "°");
                        prevCharNum = false;
                        break;
					case "&":
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("i", "&");
                        prevCharNum = false;
                        break;
					case "#":
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("n", "#");
                        prevCharNum = false;
                        break;
					case "@":
                        txt += BrailleChar("at", "@");
                        prevCharNum = false;
                        break;
                    case "%":
                        txt += BrailleChar("percent", "%");
                        prevCharNum = false;
                        break;
                    case "'":
                        txt += BrailleChar("qs", "'"); 
                        prevCharNum = false;
                        break;
                    case ",":
                        txt += BrailleChar("comma", ",");
                        prevCharNum = false;
                        break;
                    case "?":
                        txt += BrailleChar("qu", "?"); 
                        prevCharNum = false;
                        break;
                    case "+":
                        txt += BrailleChar("plus", "+"); 
                        prevCharNum = false;
                        break;
                    case "-":
                        txt += BrailleChar("hyph", "-"); 
                        prevCharNum = false;
                        break;
                    case "_":
                        txt += BrailleChar("dot5", "simbol") + BrailleChar("hyph", "_"); 
                        prevCharNum = false;
                        break;
                    case "*":
                        txt += BrailleChar("ast", "*"); 
                        prevCharNum = false;
                        break;
                    case "//":
                        txt += BrailleChar("sla", "//"); 
                        prevCharNum = false;
                        break;
                    case "=":
                        txt += BrailleChar("par", "enačaj"); 
                        break;
                    case "!":
                        txt += BrailleChar("ex", "!"); 
                        prevCharNum = false;
                        break;
                    case "'": 
                        if (inQuote)
                            txt += BrailleChar("qc", "začetek navedka"); 
                        else
                            txt += BrailleChar("qo", "konec navedka");  
                        inQuote = !inQuote;
                        prevCharNum = false;
                        break;
                    case ":":
                        txt += BrailleChar("col", ":");
                        prevCharNum = false;
                        break;
                    case ";":
                        txt += BrailleChar("sc", ";"); 
                        prevCharNum = false;
                        break;
                    case "(":
                        txt += BrailleChar("lpar", "oklepaj"); 
                        prevCharNum = false;
                        break;
                    case ")":
                        txt += BrailleChar("rpar", "zaklepaj"); 
                        prevCharNum = false;
                        break;
                    case "[":
                        txt += BrailleChar("dec", "dvodelno ločilo") + BrailleChar("ex", "[");
                        break;
                    case "]":
                        txt += BrailleChar("dec", "dvodelno ločilo") + BrailleChar("period", "]"); 
                        break;
                    case "{":
                        txt += BrailleChar("dec", "dvodelno ločilo") + BrailleChar("lpar", "{");
                        break;
                    case "}":
                        txt += BrailleChar("dec", "dvodelno ločilo") + BrailleChar("rpar", "}"); 
                        break;
                    case String.fromCharCode(268): // Č
                        txt += BrailleChar("cap", "Caps") + BrailleChar("ccaron", String.fromCharCode(268)); 
                        break;
                    case String.fromCharCode(269): // č
                        txt += BrailleChar("ccaron", String.fromCharCode(269)); 
                        break;
                    case String.fromCharCode(352): // Š
                        txt += BrailleChar("cap", "Caps") + BrailleChar("scaron", String.fromCharCode(352)); 
                        break;
                    case String.fromCharCode(353): // š
                        txt += BrailleChar("scaron", String.fromCharCode(353)); 
                        break;
                    case String.fromCharCode(381): // Ž
                        txt += BrailleChar("cap", "Caps") + BrailleChar("zcaron", String.fromCharCode(381)); 
                        break;
                    case String.fromCharCode(382): // ž
                        txt += BrailleChar("zcaron", String.fromCharCode(382)); 
                        break;
                    case String.fromCharCode(262): // Ć
                        txt += BrailleChar("cap", "Caps") + BrailleChar("cacute", String.fromCharCode(262)); 
                        break;
                    case String.fromCharCode(263): // ć
                        txt += BrailleChar("cacute", String.fromCharCode(263)); 
                        break;
                    case String.fromCharCode(272): // Đ
                        txt += BrailleChar("cap", "Caps") + BrailleChar("dstrok", String.fromCharCode(272)); 
                        break;
                    case String.fromCharCode(273): // đ
                        txt += BrailleChar("dstrok", String.fromCharCode(273)); 
                        break;
                }
            }
        }
        return txt;
    },

    alphabet: function(){
        var alpha = '<div class="braille-doc2 alphabet">',
            char;
        for(var i = 97; i < 123; i++){
            char = String.fromCharCode(i);
            alpha += '<div><span>' + char + '</span><div class="br br-' + char + '"></div></div>'; 
        }
        return alpha + '</div>';
    },

    abeceda: function(){
        var alpha = '<div class="braille-doc2 abeceda">',
            char;
        for(var i = 97; i <= 118; i++){
            if (i != 113) { // spusti 'q'
			    char = String.fromCharCode(i);
                alpha += '<div><span>' + char + '</span><div class="br br-' + char + '"></div></div>';
			}
			if (i == 99) { // za 'c' dodaj še 'č'
			    char = String.fromCharCode(269);
                alpha += '<div><span>' + char + '</span><div class="br br-ccaron"></div></div>';
			}
			if (i == 115) { // za 's' dodaj še 'š'
			    char = String.fromCharCode(353);
                alpha += '<div><span>' + char + '</span><div class="br br-scaron"></div></div>';
			}
        }
		// dodaj še 'z' in 'ž'
	    char = String.fromCharCode(122);
        alpha += '<div><span>' + char + '</span><div class="br br-' + char + '"></div></div>';
	    char = String.fromCharCode(382);
        alpha += '<div><span>' + char + '</span><div class="br br-zcaron"></div></div>';

        return alpha + '</div>';
    },
}
