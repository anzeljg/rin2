
var current_val = 0;
var current_size = 4;
var size_disabled = false;
var rules;

$(document).ready(function(){

	var params = $('#routine').text();
	params = params.split(',');
//	alert(params);
	rules = new customRules(params[0]);

	size_disabled = $('#size').attr('disabled');

	initValues();

	$("#bits b").click(function(){updateBits(this);});
	$('#f16').keyup(function(){update(this, 16);});
	$('#f10').keyup(function(){update(this, 10);});
	$('#f8').keyup(function(){update(this, 8);});
	$('#f2').keyup(function(){update(this, 2);});
	$('#fa').keyup(function(){updateASCII();}).focus(function(){$(this).val('');});
	$('#size').change(function(){setSize();});
	$('#clear').click(function(){updateAll(0);});

	$('#loading').hide();
	$('#container').show();
	

});



function customRules(id)
{
	var rule;
	var subrules	= new Array();
	var ruleRows	= new Array();
	var rulesToLoad	= new Array();
	var imagePath;
	var valueToUpdate = 0;
	var valuesBuffer= new Object();
	
	
	function lpad(input, pad_length, pad_string)
	{
	    var pad_to_go;
	    input += '';
	    if ((pad_to_go = pad_length - input.length) > 0) {
	        var str_pad_repeater = function(s, len) {
	            var collect = '', i;

	            while(collect.length < len) collect += s;
	            collect = collect.substr(0,len);

	            return collect;
	        };
	        input = str_pad_repeater(pad_string, pad_to_go) + input;
	    }
	    return input;
	} // lpad
	
	
	function addRow(mask, value, label, color, label_color, title, rows)
	{
		rows = 25 * (rows?rows:1);
		mask = lpad(mask.toString(16), 8, '0');
		
		var td;
		td  = '<td id="'+mask+ (title?('" title="'+title):'') + '" style="height:'+rows+'px;">'
			+ (label?('<b' + (label_color?(' style="color:'+label_color+';"'):'') +'>' + label + '</b>: '):'')
			+ '<i' + (color?(' style="color:'+color+';"'):'') +'>' + value + '</i>'
			+ '</td>';
		
		ruleRows.push('<tr>'+td+'</tr>');
	} // addRow


	function print()
	{
		var html;
		html = '<img id="bimage" src="'+imagePath+'" alt="" />'
			 + '<table cellpadding="0" cellspacing="0" id="bdesc">'
			 + ruleRows.sort().join('')
			 + '</table>';

		obj = $("#bdetails");
		if (obj.size()) obj.html(html);
		else $("#routine").before('<div id="bdetails">'+html+'</div>');
	} // print
	
	
	function load(subroutine)
	{
		return;						// TODO: hidding of advanced mode
		
		if (typeof(subroutine) == 'undefined') subroutine = '';
		else if (typeof(rule.sub[subroutine]) != 'undefined') return;
		
		$.post('/getRoutine/'+id+'/'+subroutine, '', function(data, textStatus) {
			if (textStatus == 'success') {
				if (subroutine) {
					if (typeof(data) == 'object') {
						rule.sub[subroutine] = data;
						updateRoutine();
					} else { 
						var tmp = data.split(':',2);
						tmp = parseInt(tmp[0], 16)+'/'+parseInt(tmp[1], 16);
						if (typeof(rule.sub[tmp]) == 'undefined') load(tmp);
						rule.sub[subroutine] = tmp;
					}
				} else {
					rule = data;
					updateRoutine();
				}
			}
		}, 'json');	
	} // load

	
	function getLabel(row)
	{
		var ret   = new Array(
			typeof(row.lbl) != 'undefined'?row.lbl:'n/d',
			typeof(row.col) != 'undefined'?row.col:'black'
		);
		
		return ret;
	}
	
	
	function selectValue(obj, val)
	{
		var ret;
		for(v in obj) {
			if (val == v) {
				ret = new Array(obj[v], v);
				break;
			}
			if ((v == 'def') && (typeof(ret) == 'undefined')) ret = new Array(obj[v], v);
		}
		return ret;
	} // selectValue
	
	
	function loadVal(key, mask, request)
	{
		var params = {
			mask: mask,
			val : valueToUpdate,
			req : request
		};
	    var str = jQuery.param(params);
		
		$.post('/getValue/'+id, str, function(data, textStatus) {
			if (textStatus == 'success') {
				valuesBuffer[key] = data.val;
				updateRoutine();
			}
		}, 'json');	
		
	}

	
	function getVal(data, mask)
	{
		var color = 'black';

		if (typeof(data) != 'object') return new Array(data, color);

		var val	  = 'n/d';
		
		if (typeof(data.val) != 'undefined') {
			var key = data.val+':'+mask+':'+(valueToUpdate&mask);
			
			if (typeof(valuesBuffer[key]) == 'undefined') {
				if (data.val.substr(0,2) == "\27:") {
					val = processValue(data.val.substr(2), mask, valueToUpdate);
				} else {
					loadVal(key, mask, data.val.substr(2));
				}
			} else val = valuesBuffer[key];
			return new Array(val, color);
		}
		
		var buf   = selectValue(data, valueToUpdate&mask);
		var value = buf[0];
		
		if ((typeof(value) == 'string') || (typeof(value) == 'number')) return new Array(value, color);

		
		var key   = buf[1];
		var load  = false; 
					
		if (typeof(value) == 'object') {
			if (typeof(value.val) != 'undefined') {
				val = value.val;
//				alert(value.val);
			}
			if (typeof(value.col) != 'undefined') color = value.col;
			if (typeof(value.load) != 'undefined') load = true; 
		}

		if (load) {
			var subroutine = mask+'/'+key;
			if (typeof(rule.sub[subroutine]) == 'undefined') {
				rulesToLoad.push(subroutine); 
			} else if (typeof(rule.sub[subroutine]) == 'string') {
				subroutine = rule.sub[subroutine];
			}
			subrules.push(subroutine);
		}
		
		return new Array(val, color);
	} // getVal
	
	
	function processRow(row, mask)
	{
		if (mask == 'sub') return;
		if (mask == 'cfg') {
			imagePath = row.img;
			return;
		}
		
		var title = typeof(row.title)!='undefined'?row.title:'';
		var label = getLabel(row);
		var value = getVal(row.val, mask);

		addRow(mask, value[0], label[0], value[1], label[1], title);
	} // processRow

	
	function updateRoutine()
	{
		ruleRows = new Array();
		rulesToLoad = new Array();
		subrules = new Array();

		if (typeof(rule.sub)=='undefined') rule.sub = new Object();

		for(mask in rule) {
			processRow(rule[mask], mask);
		}
		
		for(sub in subrules) {
			if (typeof(rule.sub[subrules[sub]]) == 'object') {
				for(mask in rule.sub[subrules[sub]]) {
					processRow(rule.sub[subrules[sub]][mask], mask);
				}				
			}
		}
		
		if (rulesToLoad.length) {
			var subroutine = rulesToLoad.pop();
			load(subroutine);
		} else {
			print();
		}		
	} // updateRoutine
	
	
	this.update = function (val)
	{
		valueToUpdate = val;
		
		if (typeof(rule) == 'undefined') load(); 
		else updateRoutine();
	} // update
	
	
} // customRules




function processValue(data, mask, val)
{
	var masked_val = val & mask;
	var out = 'n/d';
	
	function getOffset()
	{
		for(i=0,n=1; i<32; i++,n=n<<1) if (n&mask) return i;
	}
	
	function function_exists( function_name ) {
	    // Checks if the function exists  
	    // 
	    // version: 810.114
	    // discuss at: http://phpjs.org/functions/function_exists
	    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   improved by: Steve Clay
	    // +   improved by: Legaev Andrey
	    // *     example 1: function_exists('isFinite');
	    // *     returns 1: true
	    if (typeof function_name == 'string'){
	        return (typeof window[function_name] == 'function');
	    } else{
	        return (function_name instanceof Function);
	    }
	}

	
	if (data == '@') return masked_val >> getOffset();
	


	return out;
}



function initValues()
{
	var b = 10;
	var args = getArgs();

	if (args['hex'] != undefined) {
		b = 16;
		val = args['hex'];
	} else if (args['dec'] != undefined) {
		val = args['dec'];
	} else if (args['bin'] != undefined) {
		b = 2;
		val = args['bin'];
	} else if (args['oct'] != undefined) {
		b = 8;
		val = args['oct'];
	} else if (args['val'] != undefined) {
		val = String(args['val']);
		var len = val.length;
		if (val.substr(0,2) == '0x') {
			b = 16;
			val = val.substr(2, len);
		} else if (val.substr(len-1, 1) == 'b') {
			b = 2;
			val = val.substr(0, len-1);
		} else if (val.substr(0, 1) == '0') {
			b = 8;
			val = val.substr(1, len);
		}
	} else {
		val = getCookie('last_value');
	}

	base(val, b, 10);

	if (args['size'] == undefined) {
		setSize(getCookie('last_size'));
	} else {
		setSize(args['size']);
	}

	setBitTitles();
	updateAll();
}


function setBitTitles()
{
	for(i=0; i<32; i++) {
		/*switch (i) {
			case 31:
			case 1 : nr = i+'st'; break;
			case 2 : nr = i+'nd'; break;
			case 3 : nr = i+'rd'; break;
			default: nr = i+'th';
		}*/
		nr = i+'.';
		var dec = Math.pow(2, i);
		var hex = dec.toString(16);
		
		if ((dec<0x10) || 
			((dec>0xFF) && (dec<0x1000)) ||
			((dec>0xFF00) && (dec<0x100000)) ||
			((dec>0xFF0000) && (dec<0x10000000))) {
			hex = '0'+hex;
		}
		
		$('#b'+i).attr('title', nr+' bit, vrednost='+dec+', hex=0x'+hex);
	}
}


function setSize(size)
{
	var mask = 0xFFFFFFFF;

	if (size_disabled || (size == undefined)) {
		size = Number($('#size').val());
	}
	
	switch (Number(size)) {
		default:
		case 4: 
			mask = 0xFFFFFFFF;
			$('#f2').attr({size: 33, maxlength: 32});
			$('#f8').attr({size: 12, maxlength: 11});
			$('#f10').attr({size: 11, maxlength: 10});
			$('#f16').attr({size: 9, maxlength: 8});
			$('#bits_3,#bits_2,#bits_1').show();
			current_size = 4;
			break;

		case 3:
			mask = 0xFFFFFF;
			$('#f2').attr({size: 25, maxlength: 25});
			$('#f8,#f10').attr({size: 9, maxlength: 9});
			$('#f16').attr({size: 7, maxlength: 7});
			$('#bits_3').hide();
			$('#bits_2,#bits_1').show();
			current_size = 3;
			break;

		case 2:
			mask = 0xFFFF;
			$('#f2').attr({size: 17, maxlength: 17});
			$('#f8').attr({size: 7, maxlength: 7});
			$('#f10').attr({size: 6, maxlength: 6});
			$('#f16').attr({size: 5, maxlength: 5});
			$('#bits_3,#bits_2').hide();
			$('#bits_1').show();
			current_size = 2;
			break;

		case 1:
			mask = 0xFF;
			$('#f2').attr({size: 9, maxlength: 9});
			$('#f8,#f10').attr({size: 4, maxlength: 4});
			$('#f16').attr({size: 3, maxlength: 3});
			$('#bits_3,#bits_2,#bits_1').hide();
			current_size = 1;
			break;
	}

	$('#container').css('width', '900px');		

	
	if (current_size == 1) {
		$('#ascii').show();
	} else {
		$('#ascii').hide();		
	}

	$("#size").val(current_size);
	if (!size_disabled) {
		setCookie('last_size', current_size);
	}
	currentValue(current_val & mask);
	updateAll();
}


function updateAll(val)
{
	if (val == undefined) val = currentValue();

	$('#f16').val(base(val, 10, 16));
	$('#f10').val(base(val, 10, 10));
	$('#f8').val(base(val, 10, 8));
	$('#f2').val(base(val, 10, 2));

	updateASCII(val);
	setBits(val);
	updateHex();
}


function updateHex()
{
	var nr;
	var dec;
	var hex;
	var val = currentValue();
	
	for (i=0; i<4; i++) {
		dec = val & 0xFF;

		if (dec<16) hex = '0'+dec.toString(16);
		else hex = dec.toString(16);
		hex = hex.toUpperCase();
		
		switch (i) {
			case 0: nr = '1st'; break;
			case 1: nr = '2nd'; break;
			case 2: nr = '3rd'; break;
			case 3: nr = '4th'; break;
		}
		$('#bits_'+i).attr('title', nr+' byte value='+dec+', hex=0x'+hex);

		val = val >> 8;
	}
}


function update(obj, from)
{
	base($(obj).val(), from);
	updateAll();
}


function updateBits(obj)
{
	obj = $(obj);
	
	var b = Math.pow(2, obj.attr('id').substr(1));
	var val = currentValue();

	if (obj.text() == 0) {
		val |= b;
	} else {
		b = 0xFFFFFFFF - b;
		val &= b;
	}

	val = unsigned32bit(val);
	currentValue(val);
	updateAll();
}


function unsigned32bit(val)
{
	if (val < 0) {	
		val &= (0xFFFFFFFF - 0x80000000);
		val = val.toString(2);		
		val = new Array(32 - val.length).join('0') + val;
		val = parseInt('1'+val, 2);
	}
	return val;
}


function setBits(val)
{
	for(n=0; n<32; n++) {
		$('#b'+n).text(currentValue()&Math.pow(2,n)?1:0);
	}	
}


function base(val, from, to)
{
	val = parseInt(val,from);
	val = unsigned32bit(val);
	currentValue(val);
	if (to) {
		val = val.toString(to);
		if (val == 'NaN') val = '';
		return val;
	}
}


function currentValue(val)
{
	if (val != undefined) {
		if (current_val != val) {
			rules.update(val);
		}
		setCookie('last_value', current_val);
		current_val = val;
		var url = 'dec='+current_val;
		if (!size_disabled) url = 'size='+current_size+'&'+url;
		$('#current_state').attr('href', '?'+url);
	}

	return current_val;
}


function getArgs()
{
	var args = new Object();
	var query = location.search.substring(1);
	var pairs = query.split("&");
	for(var i = 0; i < pairs.length; i++) {
		var pos = pairs[i].indexOf('=');
		if (pos == -1) continue;
		var argname = pairs[i].substring(0,pos);
		var value = pairs[i].substring(pos+1);
		args[argname] = unescape(value);
	}
	return args;
}


function setCookie(name,value,days)
{
	var expires = '';
	
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*86400000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/";
}


function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function clearCookie(name) {
	createCookie(name,"",-1);
}


function updateASCII(val)
{
	if (val == undefined) {
		val = $('#fa').val();
		
		val = (val+'').charCodeAt(val.length<2?0:1);
		currentValue(val);
		updateAll();
	} else {
		if ((val>31) && (val<127)) {
			$('#fa').removeAttr('class');
			$('#fa').val(String.fromCharCode(val));
		} else {
			$('#fa').attr('class', 'off');
			switch(val) {
				case 0: val='NUL'; break;
				case 1: val='SOH'; break;
				case 2: val='STX'; break;
				case 3: val='ETX'; break;
				case 4: val='EOT'; break;
				case 5: val='ENQ'; break;
				case 6: val='ACK'; break;
				case 7: val='BEL'; break;
				case 8: val='BS'; break;
				case 9: val='HT'; break;
				case 10: val='LF'; break;
				case 11: val='VT'; break;
				case 12: val='FF'; break;
				case 13: val='CR'; break;
				case 14: val='SO'; break;
				case 15: val='SI'; break;
				case 16: val='DLE'; break;
				case 17: val='DC1'; break;
				case 18: val='DC2'; break;
				case 19: val='DC3'; break;
				case 20: val='DC4'; break;
				case 21: val='NAK'; break;
				case 22: val='SYN'; break;
				case 23: val='ETB'; break;
				case 24: val='CAN'; break;
				case 25: val='EM'; break;
				case 26: val='SUB'; break;
				case 27: val='ESC'; break;
				case 28: val='FS'; break;
				case 29: val='GS'; break;
				case 30: val='RS'; break;
				case 31: val='US'; break;
				case 127: val='DEL'; break;
				default : val='';
			}
			$('#fa').val(val);
		}
	}
}
