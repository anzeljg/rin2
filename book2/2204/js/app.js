// Sortable Color Name Chart
// Center Key
// By Dem Pilafian
// centerkey.com/colors
// License: http://creativecommons.org/licenses/by-sa/4.0/

var app = {};

app.colors = {
   named: [
      { name: 'AliceBlue',            hex: 'F0F8FF' },
      { name: 'AntiqueWhite',         hex: 'FAEBD7' },
      { name: 'Aqua',                 hex: '00FFFF' },
      { name: 'Aquamarine',           hex: '7FFFD4' },
      { name: 'Azure',                hex: 'F0FFFF' },
      { name: 'Beige',                hex: 'F5F5DC' },
      { name: 'Bisque',               hex: 'FFE4C4' },
      { name: 'Black',                hex: '000000' },
      { name: 'BlanchedAlmond',       hex: 'FFEBCD' },
      { name: 'Blue',                 hex: '0000FF' },
      { name: 'BlueViolet',           hex: '8A2BE2' },
      { name: 'Brown',                hex: 'A52A2A' },
      { name: 'BurlyWood',            hex: 'DEB887' },
      { name: 'CadetBlue',            hex: '5F9EA0' },
      { name: 'Chartreuse',           hex: '7FFF00' },
      { name: 'Chocolate',            hex: 'D2691E' },
      { name: 'Coral',                hex: 'FF7F50' },
      { name: 'CornflowerBlue',       hex: '6495ED' },
      { name: 'Cornsilk',             hex: 'FFF8DC' },
      { name: 'Crimson',              hex: 'DC143C' },
      { name: 'Cyan',                 hex: '00FFFF' },
      { name: 'DarkBlue',             hex: '00008B' },
      { name: 'DarkCyan',             hex: '008B8B' },
      { name: 'DarkGoldenRod',        hex: 'B8860B' },
      { name: 'DarkGray',             hex: 'A9A9A9' },
      { name: 'DarkGreen',            hex: '006400' },
      { name: 'DarkKhaki',            hex: 'BDB76B' },
      { name: 'DarkMagenta',          hex: '8B008B' },
      { name: 'DarkOliveGreen',       hex: '556B2F' },
      { name: 'DarkOrange',           hex: 'FF8C00' },
      { name: 'DarkOrchid',           hex: '9932CC' },
      { name: 'DarkRed',              hex: '8B0000' },
      { name: 'DarkSalmon',           hex: 'E9967A' },
      { name: 'DarkSeaGreen',         hex: '8FBC8F' },
      { name: 'DarkSlateBlue',        hex: '483D8B' },
      { name: 'DarkSlateGray',        hex: '2F4F4F' },
      { name: 'DarkTurquoise',        hex: '00CED1' },
      { name: 'DarkViolet',           hex: '9400D3' },
      { name: 'DeepPink',             hex: 'FF1493' },
      { name: 'DeepSkyBlue',          hex: '00BFFF' },
      { name: 'DimGray',              hex: '696969' },
      { name: 'DodgerBlue',           hex: '1E90FF' },
      { name: 'FireBrick',            hex: 'B22222' },
      { name: 'FloralWhite',          hex: 'FFFAF0' },
      { name: 'ForestGreen',          hex: '228B22' },
      { name: 'Fuchsia',              hex: 'FF00FF' },
      { name: 'Gainsboro',            hex: 'DCDCDC' },
      { name: 'GhostWhite',           hex: 'F8F8FF' },
      { name: 'Gold',                 hex: 'FFD700' },
      { name: 'GoldenRod',            hex: 'DAA520' },
      { name: 'Gray',                 hex: '808080' },
      { name: 'Green',                hex: '008000' },
      { name: 'GreenYellow',          hex: 'ADFF2F' },
      { name: 'HoneyDew',             hex: 'F0FFF0' },
      { name: 'HotPink',              hex: 'FF69B4' },
      { name: 'IndianRed ',           hex: 'CD5C5C' },
      { name: 'Indigo ',              hex: '4B0082' },
      { name: 'Ivory',                hex: 'FFFFF0' },
      { name: 'Khaki',                hex: 'F0E68C' },
      { name: 'Lavender',             hex: 'E6E6FA' },
      { name: 'LavenderBlush',        hex: 'FFF0F5' },
      { name: 'LawnGreen',            hex: '7CFC00' },
      { name: 'LemonChiffon',         hex: 'FFFACD' },
      { name: 'LightBlue',            hex: 'ADD8E6' },
      { name: 'LightCoral',           hex: 'F08080' },
      { name: 'LightCyan',            hex: 'E0FFFF' },
      { name: 'LightGoldenRodYellow', hex: 'FAFAD2' },
      { name: 'LightGray',            hex: 'D3D3D3' },
      { name: 'LightGreen',           hex: '90EE90' },
      { name: 'LightPink',            hex: 'FFB6C1' },
      { name: 'LightSalmon',          hex: 'FFA07A' },
      { name: 'LightSeaGreen',        hex: '20B2AA' },
      { name: 'LightSkyBlue',         hex: '87CEFA' },
      { name: 'LightSlateGray',       hex: '778899' },
      { name: 'LightSteelBlue',       hex: 'B0C4DE' },
      { name: 'LightYellow',          hex: 'FFFFE0' },
      { name: 'Lime',                 hex: '00FF00' },
      { name: 'LimeGreen',            hex: '32CD32' },
      { name: 'Linen',                hex: 'FAF0E6' },
      { name: 'Magenta',              hex: 'FF00FF' },
      { name: 'Maroon',               hex: '800000' },
      { name: 'MediumAquaMarine',     hex: '66CDAA' },
      { name: 'MediumBlue',           hex: '0000CD' },
      { name: 'MediumOrchid',         hex: 'BA55D3' },
      { name: 'MediumPurple',         hex: '9370D8' },
      { name: 'MediumSeaGreen',       hex: '3CB371' },
      { name: 'MediumSlateBlue',      hex: '7B68EE' },
      { name: 'MediumSpringGreen',    hex: '00FA9A' },
      { name: 'MediumTurquoise',      hex: '48D1CC' },
      { name: 'MediumVioletRed',      hex: 'C71585' },
      { name: 'MidnightBlue',         hex: '191970' },
      { name: 'MintCream',            hex: 'F5FFFA' },
      { name: 'MistyRose',            hex: 'FFE4E1' },
      { name: 'Moccasin',             hex: 'FFE4B5' },
      { name: 'NavajoWhite',          hex: 'FFDEAD' },
      { name: 'Navy',                 hex: '000080' },
      { name: 'OldLace',              hex: 'FDF5E6' },
      { name: 'Olive',                hex: '808000' },
      { name: 'OliveDrab',            hex: '6B8E23' },
      { name: 'Orange',               hex: 'FFA500' },
      { name: 'OrangeRed',            hex: 'FF4500' },
      { name: 'Orchid',               hex: 'DA70D6' },
      { name: 'PaleGoldenRod',        hex: 'EEE8AA' },
      { name: 'PaleGreen',            hex: '98FB98' },
      { name: 'PaleTurquoise',        hex: 'AFEEEE' },
      { name: 'PaleVioletRed',        hex: 'D87093' },
      { name: 'PapayaWhip',           hex: 'FFEFD5' },
      { name: 'PeachPuff',            hex: 'FFDAB9' },
      { name: 'Peru',                 hex: 'CD853F' },
      { name: 'Pink',                 hex: 'FFC0CB' },
      { name: 'Plum',                 hex: 'DDA0DD' },
      { name: 'PowderBlue',           hex: 'B0E0E6' },
      { name: 'Purple',               hex: '800080' },
      { name: 'Red',                  hex: 'FF0000' },
      { name: 'RosyBrown',            hex: 'BC8F8F' },
      { name: 'RoyalBlue',            hex: '4169E1' },
      { name: 'SaddleBrown',          hex: '8B4513' },
      { name: 'Salmon',               hex: 'FA8072' },
      { name: 'SandyBrown',           hex: 'F4A460' },
      { name: 'SeaGreen',             hex: '2E8B57' },
      { name: 'SeaShell',             hex: 'FFF5EE' },
      { name: 'Sienna',               hex: 'A0522D' },
      { name: 'Silver',               hex: 'C0C0C0' },
      { name: 'SkyBlue',              hex: '87CEEB' },
      { name: 'SlateBlue',            hex: '6A5ACD' },
      { name: 'SlateGray',            hex: '708090' },
      { name: 'Snow',                 hex: 'FFFAFA' },
      { name: 'SpringGreen',          hex: '00FF7F' },
      { name: 'SteelBlue',            hex: '4682B4' },
      { name: 'Tan',                  hex: 'D2B48C' },
      { name: 'Teal',                 hex: '008080' },
      { name: 'Thistle',              hex: 'D8BFD8' },
      { name: 'Tomato',               hex: 'FF6347' },
      { name: 'Turquoise',            hex: '40E0D0' },
      { name: 'Violet',               hex: 'EE82EE' },
      { name: 'Wheat',                hex: 'F5DEB3' },
      { name: 'White',                hex: 'FFFFFF' },
      { name: 'WhiteSmoke',           hex: 'F5F5F5' },
      { name: 'Yellow',               hex: 'FFFF00' },
      { name: 'YellowGreen',          hex: '9ACD32' }
      ],
   overloaded: null
   };

app.colorData = {
   generateHexColors: function() {
      var intensities = ['00', '33', '66', '99', 'CC', 'FF'];
      var colors = [];
      for (var r = 0; r < intensities.length; r++)
         for (var g = 0; g < intensities.length; g++)
            for (var b = 0; b < intensities.length; b++)
               colors.push({ hex: intensities[r] + intensities[g] + intensities[b] });
      app.colors.overloaded = app.colors.named.concat(colors);
      app.colorData.addSortFields(colors);
      },
   addSortFields: function(colors) {
      function calcOdtenek(r, g, b) {
         var odtenekR = (r * 2 - g - b) * 5;  //Redness [-2560,2560]
         var odtenekG = (g * 2 - r - b) * 5;  //Greeness
         var odtenekB = (b * 2 - r - g) * 5;  //Blueness
         var odtenekC = -odtenekR;            //Cyaness
         var odtenekM = -odtenekG;            //Magentaness
         var odtenekY = -odtenekB;            //Yellowness
         var odtenekMax = Math.max(odtenekR, odtenekG, odtenekB, odtenekC, odtenekM, odtenekY);  //[0,2260]
         var odtenek = odtenekMax - r - g - b;  //[-768,2004]
         if (Math.max(odtenekR, odtenekG, odtenekB) < 75)
            odtenek = odtenek + 70000;
         else if (odtenekR === odtenekMax)
            odtenek = odtenek + 10000;
         else if (odtenekG === odtenekMax)
            odtenek = odtenek + 20000;
         else if (odtenekB === odtenekMax)
            odtenek = odtenek + 30000;
         else if (odtenekC === odtenekMax)
            odtenek = odtenek + 40000;
         else if (odtenekM === odtenekMax)
            odtenek = odtenek + 50000;
         else
            odtenek = odtenek + 60000;
         return odtenek + r;
         }
      function calcSivino(r, g, b) {
         return (Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r)) * 100 + r + g + b;
         }
      function enhance(color) {
         color.r = parseInt(color.hex.substr(0, 2), 16);
         color.g = parseInt(color.hex.substr(2, 2), 16);
         color.b = parseInt(color.hex.substr(4, 2), 16);
         color.sivino =     calcSivino(color.r, color.g, color.b);
         color.barvitost = -color.sivino;
         color.temnost =     color.r + color.g + color.b;
         color.svetlost =    -color.temnost;
         color.odtenek =          calcOdtenek(color.r, color.g, color.b);
         color.abecedo = color.name || 'z' + color.r + color.g + color.b;
         color.kratkost =      color.name ? color.name.length : 100 + parseInt(color.hex, 16);
         }
      colors.forEach(enhance);
      },
   titles: ['Barvitost', 'Sivino', 'Svetlost', 'Temnost', 'Odtenek', 'Abecedo', 'Kratkost'],
   headers: ['Barvitost', 'Sivina', 'Svetlost', 'Temnost', 'Odtenek', 'Abeceda', 'Kratkost'],
   makeComparator: function(compare) {
      function comparator(color1, color2) {
         var sortField = app.colorData.titles[compare].toLowerCase();
         var v1 = color1[sortField];
         var v2 = color2[sortField];
         return (v1 < v2) ? -1 : ((v1 > v2) ? 1 : 0);
         }
      return comparator;
      }
   };

app.action = {
   display: function() {
      var compare = Math.max(0, $('button.action.selected').index());
      $('.big-box h1').text(app.colorData.headers[compare]);
      var overload = $('#hex-overload input').is(':checked');
      if (overload && !app.colors.overloaded)
         app.colorData.generateHexColors();
      var colors = overload ? app.colors.overloaded : app.colors.named;
      colors.sort(app.colorData.makeComparator(compare));
      dna.clone('swatch', colors, { empty: true });
      $('#num-colors span').text(colors.length);
      },
   sort: function(button) {
      button.addClass('selected').siblings().removeClass('selected');
      app.action.display();
      button.prop({ disabled: false });
      },
   start: function() {
      dna.clone('action', app.colorData.titles);
      $('button.action').first().addClass('selected');
      app.colorData.addSortFields(app.colors.named);
      app.action.display();
      }
   };

$(app.action.start);
