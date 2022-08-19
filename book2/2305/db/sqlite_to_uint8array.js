/*
 * How to convert 'database.sqlite' file to 'database.js' file:
 * - Run 'cmd' and navigate to this folder
 * - Run command:
 *     > node sqlite_to_uint8array.js
 */

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

//module.exports = atob.atob = atob;

function base64ToUint8Array(string) {
  var raw = atob(string);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for (var i = 0; i < rawLength; i += 1) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

var fs = require('fs');
var base64 = fs.readFileSync('database.sqlite', 'base64');
fs.writeFileSync('database.js', 'var dbData = [' + base64ToUint8Array(base64) + '];');