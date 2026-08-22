import os
import io
import re


styles = set()
scripts = set()
unit_content = []

for root, dirs, files in os.walk('.', topdown=False):

    for filename in files:
        # Only file with ".html" extension
        if os.path.splitext(filename)[1] == '.html':
            filepath = os.path.join(root, filename)

            file = io.open(filepath, 'r', encoding='utf8')
            content = file.read()
            file.close()

            # Find all linked and embedded CSS
            found = re.findall('<link.*?>', content)
            for style in found:
                styles.add(style)

            found = re.findall('<style>.*?<\/style>', content)
            for style in found:
                styles.add(style)

            # Find all JS
            found = re.findall('<script.*?>(?s:.)*?<\/script>', content)
            for script in found:
                scripts.add(script)

            # Find the page content
            found = re.findall('<div id="page-content-wrapper">(?s:.)*?<!-- Page Pagination in Footer -->', content)
            for page_content in found:
                unit_content.append(page_content)

"""
print(styles)
print(scripts)
print(unit_content)
print(outfilepath)
"""

file = io.open(os.path.join('.', 'unit.html'), 'w', encoding='utf8')
html = '<!DOCTYPE html><html lang="sl"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1">'

html += '<link href="../css/bootstrap.min.css" rel="stylesheet">'
html += '<link href="../css/font-awesome.min.css" rel="stylesheet">'

for style in styles:
    if style not in [
        '<link href="../css/bootstrap.min.css" rel="stylesheet">',
        '<link href="../css/simple-sidebar.css" rel="stylesheet">', # Skip 
        '<link href="../css/font-awesome.min.css" rel="stylesheet">',
        '<link href="../css/style.css" rel="stylesheet">',
        '<link href="../css/google-cse.css" rel="stylesheet">', # Skip
        '<link rel="stylesheet" href="../cc/cookiecuttr.css">', # Skip
        '<link rel="shortcut icon" href="../favicon.ico" />' # Skip
    ]:
        html += style
    
html += '<link href="../css/style.css" rel="stylesheet">'

html += '</head><body><div id="wrapper"><div id="page-content-wrapper">'

for item in unit_content:
    html += item

html += '</div></div>'

html += '<script src="../js/jquery.js"></script>'
html += '<script src="../js/bootstrap.min.js"></script>'
html += '<script src="../js/responsive-paginate.js"></script>'

for script in scripts:
    if script not in [
        '<script src="../js/jquery.js"></script>',
        '<script src="../js/bootstrap.min.js"></script>', 
        '<script src="../js/responsive-paginate.js"></script>',
        '<script type="text/javascript" src="../cc/jquery.cookie.js"></script>', # Skip
        '<script type="text/javascript" src="../cc/jquery.cookiecuttr.js"></script>', # Skip
        '<script type="text/javascript" src="../cc/google-analytics.js"></script>', # Skip
        '<script type="text/javascript" src="../cc/setup.cookiecuttr.js"></script>' # Skip
    ]:
        html += script

html += '</body></html>'

#print(html)
file.write(html)
file.close()





"""
data = content.replace('</body>', '\n<!-- CookieCuttr -->\n<script type="text/javascript" src="../cc/jquery.cookie.js"></script>\n<script type="text/javascript" src="../cc/jquery.cookiecuttr.js"></script>\n<link rel="stylesheet" href="../cc/cookiecuttr.css">\n<script type="text/javascript" src="../cc/google-analytics.js"></script>\n<script type="text/javascript" src="../cc/setup.cookiecuttr.js"></script>\n\n</body>')
file = io.open(filepath, 'w', encoding='utf8')
file.write(data)
file.close()
"""
