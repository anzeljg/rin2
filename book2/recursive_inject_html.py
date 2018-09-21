import os
import io

for root, dirs, files in os.walk(".", topdown=False):
    for filename in files:
        # Only file with ".html" extension
        if os.path.splitext(filename)[1] == '.html':
            filepath = os.path.join(root, filename)

            file = io.open(filepath, 'r', encoding='utf8')
            content = file.read()
            file.close()

            data = content.replace('			<div id="navbar" class="navbar-collapse collapse">', '			<div id="google_cse_wrapper">\n                <script type="text/javascript" src="../js/google-cse.js"></script>\n                <gcse:search linktarget="_self"></gcse:search>\n                <link href="../css/google-cse.css" rel="stylesheet">\n            </div>\n            <div id="navbar" class="navbar-collapse collapse">')
            file = io.open(filepath, 'w', encoding='utf8')
            file.write(data)
            file.close()
