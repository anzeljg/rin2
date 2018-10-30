function AudioSynthView() {

	var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	if(isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }

	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(0.5);
	var __octave = 4;
	
	// Change octave
	var fnChangeOctave = function(x) {

		x |= 0;
	
		__octave += x;
	
		__octave = Math.min(5, Math.max(3, __octave));
	
		var octaveName = document.getElementsByName('OCTAVE_LABEL');
		var i = octaveName.length;
		while(i--) {
			var val = parseInt(octaveName[i].getAttribute('value'));
			octaveName[i].innerHTML = (val + __octave);
		}
	
		document.getElementById('OCTAVE_LOWER').innerHTML = __octave-1;
		document.getElementById('OCTAVE_UPPER').innerHTML = __octave+1;
	
	};

	// Key bindings, notes to keyCodes.
	var keyboard = {
		
			/* 2 */
			50: 'C#,-1',
			
			/* 3 */
			51: 'D#,-1',
			
			/* 5 */
			53: 'F#,-1',
			
			/* 6 */
			54: 'G#,-1',
			
			/* 7 */
			55: 'A#,-1',
			
			/* 9 */
			57: 'C#,0',
			
			/* 0 */
			48: 'D#,0',
			
			/* + */
			//61: 'F#,0',
			187: 'F#,0',
			43: 'F#,0',

			
			/* Q */
			81: 'C,-1',
			
			/* W */
			87: 'D,-1',
			
			/* E */
			69: 'E,-1',
			
			/* R */
			82: 'F,-1',
			
			/* T */
			84: 'G,-1',
			
			/* Y */
			//89: 'A,-1',
			/* Z */
			90: 'A,-1',
			
			/* U */
			85: 'H,-1',
			
			/* I */
			73: 'C,0',
			
			/* O */
			79: 'D,0',
			
			/* P */
			80: 'E,0',
			
			/* [ */
			219: 'F,0',
			
			/* ] */
			221: 'G,0',
		
			/* A */
			65: 'G#,0',
		
			/* S */
			83: 'A#,0',
			
			/* F */
			70: 'C#,1',
		
			/* G */
			71: 'D#,1',
		
			/* J */
			74: 'F#,1',
		
			/* K */
			75: 'G#,1',
		
			/* L */
			76: 'A#,1',
		
			/* Z */
			//90: 'A,0',
			/* Y */
			89: 'A,0',
		
			/* X */
			88: 'H,0',
		
			/* C */
			67: 'C,1',
		
			/* V */
			86: 'D,1',
		
			/* B */
			66: 'E,1',
		
			/* N */
			78: 'F,1',
		
			/* M */
			77: 'G,1',
			
			/* , */
			188: 'A,1',
			
			/* . */
			190: 'H,1'
		
		};
	
	var reverseLookupText = {};
	var reverseLookup = {};

	// Create a reverse lookup table.
	for(var i in keyboard) {
	
		var val;

		switch(i|0) {
		

			case 187:
				//val = 61;
				val = 43;
				break;
			
			case 219:
				//val = 91;
				val = 247; // Š = 138
				break;
			
			case 221:
				//val = 93;
				val = 215; // Ð = 208
				break;
			
			case 188:
				val = 44;
				break;
			
			case 190:
				val = 46;
				break;
			
			default:
				val = i;
				break;
			
		}
	
		reverseLookupText[keyboard[i]] = val;
		reverseLookup[keyboard[i]] = i;
	
	}

	// MIDI note values
    var notes = {
        'C,2' : 48, 'C#,2': 49, 'D,2' : 50, 'D#,2': 51, 'E,2' : 52, 'F,2' : 53,
        'F#,2': 54, 'G,2' : 55, 'G#,2': 56, 'A,2' : 57, 'A#,2': 58, 'H,2' : 59,
        'C,3' : 60, 'C#,3': 61, 'D,3' : 62, 'D#,3': 63, 'E,3' : 64, 'F,3' : 65,
        'F#,3': 66, 'G,3' : 67, 'G#,3': 68, 'A,3' : 69, 'A#,3': 70, 'H,3' : 71,
        'C,4' : 72, 'C#,4': 73, 'D,4' : 74, 'D#,4': 75, 'E,4' : 76, 'F,4' : 77,
        'F#,4': 78, 'G,4' : 79, 'G#,4': 80, 'A,4' : 81, 'A#,4': 82, 'H,4' : 83,
        'C,5' : 84, 'C#,5': 85, 'D,5' : 86, 'D#,5': 87, 'E,5' : 88, 'F,5' : 89,
        'F#,5': 90, 'G,5' : 91, 'G#,5': 92, 'A,5' : 93, 'A#,5': 94, 'H,5' : 95,
        'C,6' : 96, 'C#,6': 97, 'D,6' : 98, 'D#,6': 99, 'E,6' : 100, 'F,6': 101,
        'F#,6': 102, 'G,6': 103, 'G#,6': 104, 'A,6': 105, 'A#,6': 106, 'H,6': 107,
    }

	// Keys you have pressed down.
	var keysPressed = [];
	var visualKeyboard = null;
	var selectSound = null;

	var fnCreateKeyboard = function(keyboardElement) {
		// Generate keyboard
		// This is our main keyboard element! It's populated dynamically based on what you've set above.
		visualKeyboard = document.getElementById('keyboard');
		selectSound = document.getElementById('midi-sound');

		var iKeys = 0;
		var iWhite = 0;
		var notes = __audioSynth._notes;

		for(var i=-1;i<=1;i++) {
			for(var n in notes) {
				if(n[2]!='b') {
					var thisKey = document.createElement('div');
					if(n.length>1) {
						thisKey.className = 'black key';
						thisKey.style.width = '30px';
						thisKey.style.height = '120px';
						thisKey.style.left = (38 * (iWhite - 1)) + 24 + 'px';
					} else {
						thisKey.className = 'white key';
						thisKey.style.width = '38px';
						thisKey.style.height = '200px';
						thisKey.style.left = 38 * iWhite + 'px';
						iWhite++;
					}
					var label = document.createElement('div');
					label.className = 'keylabel';
					//label.innerHTML = '<b>' + String.fromCharCode(reverseLookupText[n + ',' + i]) + '</b>' + '<br /><br />' + n.substr(0,1) +
					//	'<span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span>' + (n.substr(1,1)?n.substr(1,1):'');
					label.innerHTML = '<b>' + String.fromCharCode(reverseLookupText[n + ',' + i]) + '</b>' + '<br /><br />' + n.substr(0,1) +
						(n.substr(1,1)?n.substr(1,1):'') + '<sub><span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span></sub>';
					thisKey.appendChild(label);
					thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);
					thisKey.addEventListener(evtListener[0], (function(_temp) { return function() { fnPlayKeyboard({keyCode:_temp}); } })(reverseLookup[n + ',' + i]));
					visualKeyboard[n + ',' + i] = thisKey;
					visualKeyboard.appendChild(thisKey);
					iKeys++;
				}
			}
		}

		visualKeyboard.style.width = iWhite * 38 + 'px';

		window.addEventListener(evtListener[1], function() { n = keysPressed.length; while(n--) { fnRemoveKeyBinding({keyCode:keysPressed[n]}); } });
	
	};

	// Creates our audio player
	var fnPlayNote = function(note, octave) {

		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function() { container = null; });
		container.addEventListener('loadeddata', function(e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		/*document.body.appendChild(container);*/
		container.load();
		return container;
	
	};

	// Detect keypresses, play notes.

	var fnPlayKeyboard = function(e) {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				return false;	
			}
		}
		keysPressed.push(e.keyCode);
	
		switch(e.keyCode) {
		
			// left
			case 37:
				fnChangeOctave(-1);
				break;
		
			// right
			case 39:
				fnChangeOctave(1);
				break;
		
			// space
			case 16:
				break;
				fnPlaySong([
					['E,0', 8],
					['D,0', 8],
					['C,0', 2],
					['C,0', 8],
					['D,0', 8],
					['C,0', 8],
					['E,0', 8],
					['D,0', 1],
					['C,0', 8],
					['D,0', 8],
					['E,0', 2],
					['A,0', 8],
					['G,0', 8],
					['E,0', 8],
					['C,0', 8],
					['D,0', 1],
					['A,0', 8],
					['H,0', 8],
					['C,1', 2],
					['H,0', 8],
					['C,1', 8],
					['D,1', 8],
					['C,1', 8],
					['A,0', 1],
					['G,0', 8],
					['A,0', 8],
					['H,0', 2],
					['C,1', 8],
					['H,0', 8],
					['A,0', 8],
					['G,0', 8],
					['A,0', 1]
				]);
				break;
		
		}
	
		if(keyboard[e.keyCode]) {
			if(visualKeyboard[keyboard[e.keyCode]]) {
				visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '#ff0000';
				visualKeyboard[keyboard[e.keyCode]].style.marginTop = '5px';
				visualKeyboard[keyboard[e.keyCode]].style.boxShadow = 'none';

				// MIDI message start
				var parts = keyboard[e.keyCode].split(",");
				var letter = parts[0];
				var number = __octave + parseInt(parts[1]);
				var channel = $('#midi-channel').val();
				var velocity = $('#midi-velocity').val();

				var status = 144 + parseInt(channel); // 144 + channel => NoteOn
				var pitch = notes[letter + "," + number];
				var velocity = parseInt(velocity);

				if ($('#midi-output').val() == 16) {
					status = '0x' + status.toString(16).toUpperCase();
					pitch = '0x' + pitch.toString(16).toUpperCase();
					velocity = velocity.toString(16).toUpperCase();
					if (velocity.length == 1) {
						velocity = '0' + velocity;
					}
					velocity = '0x' + velocity;
				}

				$('#midi-messages').html($('#midi-messages').html() + status + " " + pitch + " " + velocity + "\n");
				// MIDI message end
			}
			var arrPlayNote = keyboard[e.keyCode].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1]|0;
			fnPlayNote(note, __octave + octaveModifier);
		} else {
			return false;	
		}
	
	}

	// Remove key bindings once note is done.

	var fnRemoveKeyBinding = function(e) {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				if(visualKeyboard[keyboard[e.keyCode]]) {
					visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';

					// MIDI message start
					var parts = keyboard[e.keyCode].split(",");
					var letter = parts[0];
					var number = __octave + parseInt(parts[1]);
					var channel = $('#midi-channel').val();

					var status = 128 + parseInt(channel); // 128 + channel => NoteOff
					var pitch = notes[letter + "," + number];
					var velocity = 0;

					if ($('#midi-output').val() == 16) {
						status = '0x' + status.toString(16).toUpperCase();
						pitch = '0x' + pitch.toString(16).toUpperCase();
						velocity = '0x00';
					}

					$('#midi-messages').html($('#midi-messages').html() + status + " " + pitch + " " + velocity + "\n");
					// MIDI message end
				}
				keysPressed.splice(i, 1);
			}
		}
	
	}

	var fnPlaySong = function(arr) {
	
		if(arr.length>0) {
		
			var noteLen = 1000*(1/parseInt(arr[0][1]));
			if(!(arr[0][0] instanceof Array)) {
				arr[0][0] = [arr[0][0]];	
			}
			var i = arr[0][0].length;
			var keys = [];
			while(i--) {
				keys.unshift(reverseLookup[arr[0][0][i]]);
				fnPlayKeyboard({keyCode:keys[0]});
			}
			arr.shift();
			setTimeout(function(array, val){ return function() { var i = val.length; while(i--) { fnRemoveKeyBinding({keyCode:val[i]}); } fnPlaySong(array); } }(arr, keys), noteLen);
		
		}
	
	};

	// Change instrument
	var fnChangeInstrument = function(clear=0) {

		// MIDI message start
		var sound = $('#midi-sound').val();
		var channel = $('#midi-channel').val();

		var status = 192 + parseInt(channel); // 192 + channel => ProgramChange
		var instrument = 1;
		switch (parseInt(sound)) {
			// Organ
			case 1:
				// General MIDI: Church Organ 
				instrument = 20;
				break;
			// Guitar
			case 2:
				// General MIDI: Acoustic Guitar (nylon)
				instrument = 25;
				break;
			// Piano
			case 0:
			default:
				// General MIDI: Acoustic Grand Piano
				instrument: 1;
		}
		// Subtract 1 from instrument to convert
		// from General MIDI to MIDI message format
		instrument--;

		if ($('#midi-output').val() == 16) {
			status = '0x' + status.toString(16).toUpperCase();
			instrument = instrument.toString(16).toUpperCase();
			if (instrument.length == 1) {
				instrument = '0' + instrument;
			}
			instrument = '0x' + instrument;
		}

		if (clear) {
		    $('#midi-messages').html(status + " " + instrument + "\n");
		} else {
		    $('#midi-messages').html($('#midi-messages').html() + status + " " + instrument + "\n");
		}
		// MIDI message end
	
	};

	// Clear MIDI messages
	var fnClearMessages = function() {
        fnChangeInstrument(1);
	};

	// Change MIDI output
	var fnChangeOutput = function() {
        fnChangeInstrument(1);
	};


	// Set up global event listeners

	window.addEventListener('keydown', fnPlayKeyboard);
	window.addEventListener('keyup', fnRemoveKeyBinding);
	document.getElementById('-_OCTAVE').addEventListener('click', function() { fnChangeOctave(-1); });
	document.getElementById('+_OCTAVE').addEventListener('click', function() { fnChangeOctave(1); });
	document.getElementById('midi-sound').addEventListener('change', function() { fnChangeInstrument(); });
	document.getElementById('midi-clear').addEventListener('click', function() { fnClearMessages(); });
	document.getElementById('midi-output').addEventListener('click', function() { fnChangeOutput(); });
	
	Object.defineProperty(this, 'draw', {
		value: fnCreateKeyboard
	});

}