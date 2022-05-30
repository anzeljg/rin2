function datumCas() {
  var d = new Date();
  var dvt = d.getDay(); // 'dvt' pomeni 'dan v tednu'
  var dnevi = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];

  // dodaj predpono 0, če je vrednost manjša od 10
  var dan   = d.getDate().toString().padStart(2, '0');
  var mesec = (d.getMonth()+1).toString().padStart(2, '0');
  var leto  = d.getFullYear()
  var datum = dan + '/' + mesec + '/' + leto;

  // dodaj predpono 0, če je vrednost manjša od 10
  var ure     = d.getHours().toString().padStart(2, '0');
  var minute  = d.getMinutes().toString().padStart(2, '0');
  var sekunde = d.getSeconds().toString().padStart(2, '0');
  var cas     = ure + ':' + minute + ':' + sekunde;

  var danDatumCas = dnevi[dvt] + ', ' + datum + ' ' + cas;
  document.getElementById('ura').innerHTML =  danDatumCas;
}
