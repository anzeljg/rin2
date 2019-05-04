import os
import io

for root, dirs, files in os.walk(".", topdown=False):
    for filename in files:
        restricted = ['addcol.html', 'welcome.html', 'blackjack.html']
        # Only file with ".html" extension
        if os.path.splitext(filename)[1] == '.html' and filename not in restricted:
            #print(filename)
            filepath = os.path.join(root, filename)

            file = io.open(filepath, 'r', encoding='utf8')
            content = file.read()
            file.close()

            data = content.replace('					<li><a href="../2301/index.html">Modeliranje in simulacije</a></li>\n					<li><a href="../2302/index.html">Osnove preglednic</a></li>\n					<li><a href="../2303/index.html">Osnove grafikonov</a></li>\n					<li><a href="../2304/index.html">Enostavni oz. linearni modeli, finančni primeri (kredit itd.)?</a></li>\n					<li><a href="../2305/index.html">Simulacija Monte Carlo</a></li>\n					<li><a href="../2306/index.html">Relacijske podatkovne baze</a></li>\n					<li><a href="../2307/index.html">Ne-relacijske poatkovne baze</a></li>\n					<li><a href="../2308/index.html">Osnove SQL</a></li>\n					<li><a href="../2309/index.html">Ekspertni sistemi</a></li>', '					<li><a href="../2301/index.html">Osnove preglednic</a></li>\n					<li><a href="../2302/index.html">Modeliranje in simulacije</a></li>\n					<li><a href="../2303/index.html">Osnove grafikonov</a></li>\n					<li><a href="../2304/index.html">Podatkovne baze</a></li>\n					<li><a href="../2305/index.html">Osnove SQL</a></li>\n					<li><a href="../2306/index.html">Ekspertni sistemi</a></li>')
            file = io.open(filepath, 'w', encoding='utf8')
            file.write(data)
            file.close()

