function addcolMain() {
    this.version = '0.76';
    copyright = 'Copyright 2016 MathsIsFun.com';
    w = 420;
    h = 110;
    this.adda = getQueryVariable('adda');
    this.addb = getQueryVariable('addb');
    this.base = getQueryVariable('base');
    if (!this.adda) this.adda = 16;
    if (!this.addb) this.addb = 16;
    if (!this.base) this.base = 'dec'; // Decimal or denary
    this.adda = String(adda);
    this.addb = String(addb);
    this.base = String(base);
    bad = getQueryVariable('bad');
    if (!bad) bad = 0;
    colMax = Math.max(this.adda.length, this.addb.length);
    cols = [];
    for (var i = 0; i < colMax; i++) {
        var col = new Col();
        col.a = parseInt(this.adda.charAt(colMax - i - 1));
        col.b = parseInt(this.addb.charAt(colMax - i - 1));
        col.n = i;
		col.base = this.base;
        cols.push(col);
    }
    var s = "";
    s += '<div style="position:relative; width:' + w + 'px; min-height:' + h + 'px; border: none; border-radius: 20px; background-color: white; margin:auto; display:block;">';
    s += '<div style="position:absolute; left:10px; top:10px;">';
    s += getPlayHTML(36);
    s += '</div>';
    for (i = 0; i < colMax; i++) {
        s += '<div id="col' + i + '" style="font:20px sans-serif; color:#337AB7; position:absolute; left:' + ((colMax * 15 + 50) - i * 15) + 'px; top:10px; width:100px; text-align:center; transition: all linear 1s; z-index: 100;">';
        s += cols[i].getHTML();
        s += '</div>';
    }
    s += '<div id="plus" style="position:absolute; left:55px; top:45px; font:20px sans-serif; color:#333;">+</div>';
    s += '<div id="lines" style="position:absolute; left:55px; top:70px; width:' + (colMax * 15 + 25) + 'px; height:27px; border-top:1px solid #333;"></div>';
    s += '<div id="bad" style="position:absolute; left:150px; top:65px; font:bold 22px sans-serif; color:red;">(Napaka)</div>';
    s += '<div id="frame" style="position:absolute; left:150px; top:95px; font: 18px sans-serif;"></div>';
    s += '</div>';
    document.write(s);
    resetQ = true;
    colNo = 0;
    playQ = true;
    togglePlay();
}

function reset() {
    document.getElementById('bad').style.opacity = 0;
    for (var i = 0; i < colMax; i++) {
        var col = cols[i];
        col.reset();
        col.frame = 0;
    }
    colNo = 0;
}

function doNext(carry) {
    colNo++;
    if (colNo < colMax) {
        var col = cols[colNo];
        col.frame = 0;
        col.carry = carry;
        col.reset();
        col.anim();
    } else {
        togglePlay();
        resetQ = true;
        if (bad == 1) document.getElementById('bad').style.opacity = 1;
    }
}

function togglePlay() {
    if (resetQ) {
        reset();
        resetQ = false;
    }
    if (this.frame >= this.frameMax) {
        this.frame = 0;
    }
    btn = 'playBtn';
    if (playQ) {
        playQ = false;
 		jQuery('#btnIcon').addClass("fa-play");
		jQuery('#btnIcon').removeClass("fa-pause");
    } else {
        playQ = true;
 		jQuery('#btnIcon').addClass("fa-pause");
		jQuery('#btnIcon').removeClass("fa-play");
    }
    if (colNo < colMax) cols[colNo].anim();
}

function setId(id, visQ, v, x, y) {
    var div = document.getElementById(id);
    if (typeof visQ !== 'undefined') {
        if (visQ) {
            div.style.opacity = 1;
        } else {
            div.style.opacity = 0;
        }
    }
    if (v != -1) div.innerHTML = v;
    if (typeof x !== 'undefined') div.style.left = x + 'px';
    if (typeof y !== 'undefined') div.style.top = y + 'px';
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
};

function Col() {
    this.carry = 0;
    this.a = 0;
    this.b = 0;
    this.sum = 0;
    this.frame = 0;
    this.frameMax = 500;
    this.n = 0;
    this.isMovingQ = false;
	this.base = 'dec';
}
Col.prototype.getHTML = function() {
    var onestext = 'enice'; // ones
	var tenstext = 'desetice'; // tens
	if (this.base == 'bin') tenstext = 'dvojke'; // twos
    var id = 'c' + this.n;
    var s = '';
    var hiClr = 'rgba(0,0,255,0.1)';
    var hiClr2 = 'rgba(230,230,255,1)';
    var std = 'transition: all linear 1s;';
    s += '<div id="' + id + 'a" style="position:absolute; left:0px; top:10px; text-align: right; width:25px;' + std + '">a</div>';
    s += '<div id="' + id + 'b" style="position:absolute; left:0px; top:34px; text-align: right; width:25px;' + std + '">b</div>';
    s += '<div id="' + id + 'hi" style="position:absolute; left:11px; top:-5px; width:17px; height:95px; border:none; background-color:' + hiClr + '; border-radius:20px;' + std + '"></div>';
    s += '<div id="' + id + 'line" style="position:absolute; left:28px; top:18px; width:42px; border-top: 5px solid ' + hiClr2 + ';' + std + '"></div>';
    s += '<div id="' + id + 'eq" style="position:absolute; left:70px; top:5px; width:150px; height:32px; border:none; background-color:' + hiClr2 + '; border-radius:20px;' + std + '">';
    s += '<div id="' + id + 'eqlhs" style="position:absolute; left:10px; top:5px; color:crimson; width:100px; text-align:center; ' + std + '">a</div>';
    s += '<div id="' + id + 'eqc" style="position:absolute; left:100px; top:5px; color:crimson;' + std + '">c</div>';
    s += '</div>';
    s += '<div id="' + id + 'lblten" style="position:absolute; left:115px; top:45px; text-align:center; width:40px; font:12px sans-serif; color:#333;' + std + '">' + tenstext + '</div>';
    s += '<div id="' + id + 'lblone" style="position:absolute; left:145px; top:45px; text-align:center; width:40px; font:12px sans-serif; color:#333;' + std + '">' + onestext + '</div>';
    s += '<div id="' + id + 'sum" style="position:absolute; left:150px; top:65px; text-align:right; width:30px; letter-spacing:2px; color:crimson; ' + std + '">45</div>';
    s += '<div id="' + id + 'sumten" style="position:absolute; left:130px; top:65px; text-align:right; width:30px; color:crimson; ' + std + '">4</div>';
    s += '<div id="' + id + 'sumone" style="position:absolute; left:170px; top:65px; text-align:right; width:30px; color:crimson; ' + std + '">5</div>';
    return s;
};
Col.prototype.reset = function() {
    var id = 'c' + this.n;
    setId(id + 'a', true, this.a);
    setId(id + 'b', true, this.b);
    setId(id + 'hi', false, '');
    document.getElementById(id + 'line').style.opacity = 0;
    document.getElementById(id + 'eq').style.opacity = 0;
    setId(id + 'eqlhs', false);
    setId(id + 'eqc', false);
    setId(id + 'sum', false, -1, 175, 10);
    setId(id + 'sumone', false, -1, 175, 10);
    setId(id + 'sumten', false, -1, 175, 10);
    document.getElementById(id + 'sumten').style.fontSize = '20px';
    setId(id + 'lblten', false, -1, 125, 47);
    setId(id + 'lblone', false, -1, 175, 47);
};
Col.prototype.anim = function() {
    this.frame++;
    var id = 'c' + this.n;
    var sum = this.carry + this.a + this.b;
	// If base is binary, then cast sum to binary
	if (this.base == 'bin' && sum == 2) sum = 10;
	if (this.base == 'bin' && sum == 3) sum = 11;
    tens = 0;
    ones = 0;
    var carryQ = false;
    if (sum >= 10 && this.n < colMax - 1 && bad != 1) {
        carryQ = true;
        tens = (sum / 10) << 0;
        ones = sum % 10;
    }
    switch (this.frame) {
        case 2:
            this.reset();
            break;
        case 20:
            setId(id + 'hi', true, -1);
            break;
        case 50:
            var lhs = '';
            if (this.carry > 0) {
                lhs += this.carry + '+' + this.a + '+' + this.b + ' =';
            } else {
                lhs += this.a + ' + ' + this.b + ' = ';
            }
            setId(id + 'eqlhs', true, lhs);
            document.getElementById(id + 'line').style.opacity = 1;
            document.getElementById(id + 'eq').style.opacity = 1;
            break;
        case 100:
            setId(id + 'eqc', true, sum);
            break;
        case 150:
            setId(id + 'sum', true, sum, 170, 10);
            break;
        case 170:
            setId(id + 'sum', true, -1, 150, 65);
            break;
        case 240:
            setId(id + 'sumten', false, -1, 135, 65);
            setId(id + 'sumone', false, -1, 150, 65);
            if (!carryQ) {
                setId(id + 'sum', true, -1, -4, 63);
            }
            break;
        case 300:
            if (carryQ) {
                setId(id + 'sum', false, sum);
                setId(id + 'sumten', true, tens, 110, 65);
                setId(id + 'sumone', true, ones, 175, 65);
                setId(id + 'lblten', true, -1, 115, 47);
                setId(id + 'lblone', true, -1, 175, 47);
            } else {}
            break;
        case 350:
            document.getElementById(id + 'line').style.opacity = 0;
            document.getElementById(id + 'eq').style.opacity = 0;
            break;
        case 450:
            document.getElementById(id + 'hi').style.opacity = 0;
            if (carryQ) {
                setId(id + 'lblten', false, -1);
                setId(id + 'lblone', false, -1);
                setId(id + 'sumten', true, -1, -24, -2);
                document.getElementById(id + 'sumten').style.fontSize = '15px';
                setId(id + 'sumone', true, -1, -6, 63);
            }
            break;
        default:
    }
    if (this.frame == this.frameMax) {
        doNext(tens);
    } else {
        if (playQ) requestAnimationFrame(this.anim.bind(this));
    }
};

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

function getPlayHTML(w) {
    var s = '';
    s += '<button id="playBtn" class="btn btn-primary" onclick="togglePlay()"><span id="btnIcon" class="fa" style="width:16px"></span></button>';
    return s;
}