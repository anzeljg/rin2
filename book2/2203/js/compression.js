$(document).ready(function() {
    paper.install(window);
    canvas = document.getElementById('canvascontent');

    var ctx = canvas.getContext('2d');
    ctx.canvas.width  = 500;
    ctx.canvas.height = 400;

    paper.setup(canvas);
    window.paper = paper; //make it global

    import_TextInput(window, canvas, $('#canvascontent'));
    canvas.addEventListener ("mouseout", releaseKeyBoardFocus, false);

    var frame = new Path.RoundRectangle(view.bounds.expand(-5), 5);
    frame.strokeWidth = 1.1;
    frame.strokeColor = '#d3d3d3';//'black';
    frame.fillColor = 'white';
    frame.visible = true;

    var bRemoveSpaces = true;
    var bDynamicLinks = true;
    var g_min_prefix_size = 1;
    var graphics_links = null

    // Create a layer. The properties in the object literal
    // are set on the newly created layer.
    new Layer([frame]);
    new Layer();
 
    render(getText(), bRemoveSpaces, g_min_prefix_size);

    function formatTextarea(text, cols) {
        var lines = text.split('\n');

        var lines_split = [];
        for(var i = 0; i < lines.length;i++) {
            var line = lines[i].split("");
            while(line.length > 0)
                lines_split.push(line.splice(0, cols+1).join(''));
        }
        return lines_split;
    }

    function countLines($area) {
         var taLineHeight = parseInt($area.css('line-height')); // This should match the line-height in the CSS
         var taHeight = $area.prop('scrollHeight'); // Get the scroll height of the textarea
         return Math.floor(taHeight/taLineHeight); // numberOfLines
    }

    function limit_lines($area) {   
        var undo_content = $area.val();
        var cursorPosition = 0;
        function text_update() {
            var lines = formatTextarea($(this).val(), 30);

            if(countLines($(this)) > (parseInt($area.attr('rows')))) 
            {
                $(this).val(undo_content);
                $area.prop("selectionStart", cursorPosition);
                $area.prop("selectionEnd", cursorPosition);
            } else {
                undo_content = $(this).val();
                cursorPosition = $(this).prop("selectionStart");
            }
        }

        $area.keyup(text_update);
        $area.keydown(text_update);
        $area.click(function() { cursorPosition = $(this).prop("selectionStart"); });

    }
    limit_lines($("#code"));

   
    function getText()
    {
        return formatTextarea($("#code").val(), 30).join('\n');
    }

    $("#compress").click(function() {
        render(getText(), bRemoveSpaces, g_min_prefix_size);
    });

    $('#compress').button();
    checkBoxs("#wordtypes");
    $("#tabs" ).tabs();

    $('#whitespacecheck').change(function(event, selectorbox)
    {
        bRemoveSpaces = !$(this).is(":checked");
        render(getText(), bRemoveSpaces, g_min_prefix_size);
    });

    $('#alllinkscheck').change(function(event, selectorbox)
    {
        if(graphics_links != null)
        for(var i = 0; i < graphics_links.children.length; i++)
        {
            graphics_links.children[i].visible = $(this).is(":checked");
            bDynamicLinks = !$(this).is(":checked");
        }
    });

    $('#lsscheck').change(function(event, selectorbox) {
        if($(this).is(":checked")) g_min_prefix_size = 2;
            else g_min_prefix_size = 1;

        render(getText(), bRemoveSpaces, g_min_prefix_size);
    });
        
    function checkBoxs(div)
    {
        //style input checkboxs/radios
        //not tested on radios
        var checkBoxs = $(div).children(":input");
        checkBoxs.each(function() {
            var id = (typeof $(this).attr("id") === 'undefined') ? $(this).val() : $(this).attr("id");
            var $label = $("<label for='" + id + "'>");
            var $input = $(this).clone(true); //clone input with events
            $input.attr("id", id);
            $label.append($input);
            $label.append($('<span>').text($(this).val()));
            $(this).replaceWith($label); //replace with new stucture
        });

        var standardBoxs = $(div).find(":input[name!=selector]");
        var selectorBox = $(div).find(":input[name=selector]");
        selectorBox.attr("indeterminate", false);

        //on selector box change
        selectorBox.change( function() {
            $(this).attr('indeterminate', 'false');
            standardBoxs.prop('checked', $(this).is(":checked"));
            standardBoxs.trigger("change", [true]);
        });

        function checkSelection() {
            selectorBox.attr('indeterminate', 'true');
            var allSelected = true, allNotSelected = true; 
            standardBoxs.each(function()
            {
                allSelected = $(this).is(":checked") && allSelected;
                allNotSelected = (!$(this).is(":checked")) && allNotSelected; 
            });

            if(allSelected) {
                selectorBox.prop('checked', true);
                selectorBox.attr('indeterminate', 'false');
            }                                                                                                                                                                                                                                                                              
            if(allNotSelected) {
                selectorBox.prop('checked', false);
                selectorBox.attr('indeterminate', 'false');
            }

        }
        checkSelection();

        //change selector box if all the same
        standardBoxs.change(checkSelection);
    }
   
    function Character(char, link) {
        this.char = char;
        this.box = null;
        this.link = link;
    }

    function lzss_www(str, cLen, bLen, bRemoveSpaces, min_prefix_size) {
        function compare(w) {
            var link_prefix = [];
            var window = w.encoded.concat(w.lookahead);
            
            if((!bRemoveSpaces) || (w.lookahead[0].char != ' '))
            for(var o = w.encoded.length-1; o >= 0; o--) {
                var _prefix = [];
                
                var look_slice = window.slice(o, o + w.lookahead.length);


                //compare
                for(var j=0; j < w.lookahead.length; j++) {
                    if(w.lookahead[j].char != look_slice[j].char) break;
                    if(w.lookahead[j].char == '\n') break;
                    _prefix.push({a:w.lookahead[j], b:look_slice[j]}); 
                }

                if( _prefix.length > link_prefix.length) 
                    { link_prefix = _prefix; }
                    
                
            }

            var prefix = [];
            for(var i =0; i<link_prefix.length;i++)
            {
                link_prefix[i].a.link = link_prefix[i].b;
                prefix.push(link_prefix[i].a);
            }
            
            
            //space at end
            if(bRemoveSpaces)
            if(prefix.length != 0)
            if((prefix[prefix.length-1].char == ' '))
                prefix.pop();
            
            if(min_prefix_size > prefix.length) //don't compress
                return [];
                
                
            return prefix;
        }


        var istream = [];
        var chars = str.split("");
        for(var i = 0; i< chars.length;i++) 
            istream.push(new Character(chars[i]))
        
        var ostream = [];
        var w = { encoded:[], lookahead:[] };

        w.lookahead = w.lookahead.concat( istream.splice(0,bLen-w.lookahead.length) );
 
        while(w.lookahead.length > 0) {           
            var prefix = compare(w);
            
            //add array "prefix" remove from look-ahead buffer
            if(prefix.length > 0) {
                //output the pointer
                ostream.push(prefix);
                //shift window length of characters
                w.encoded = w.encoded.concat(w.lookahead.splice(0, prefix.length) );
                
            } else {
                //output first character
                ostream.push(w.lookahead[0]);
                //shift window
                w.encoded = w.encoded.concat(w.lookahead.splice(0, 1));
            }
            // coded buffer size cull
            if((w.encoded.length - cLen) > 0) 
                w.encoded.splice(0, (w.encoded.length - cLen));

            //move new data into look ahead buffer. Keep it full!
            w.lookahead = w.lookahead.concat( 
                    istream.splice(0,bLen-w.lookahead.length) );
            
            
            var str = "{";           
            for(var i = 0; i<w.encoded.length;i++)
                str +=w.encoded[i].char;
            str += "|"
            for(var i = 0; i<w.lookahead.length;i++)
                str +=w.lookahead[i].char;
            str+="}" + parseInt(w.lookahead.length)
            
            console.log(str);
        }

        var decode = "";
        for (var i in ostream) {
            if(ostream[i] instanceof Array) {
                for(var j=0; j<ostream[i].length; j++) 
                    decode+=ostream[i][j].char;
            } else {
                decode+= ostream[i].char;
            }
        }

        //console.log(ostream);
        console.log(decode);
        
        return ostream;
    }
    
    function render(content, bRemoveSpaces, min_prefix_size) {
        project.activeLayer.remove();
        new Layer();
        
        var uncompressed = content;
        
        var fontFamily = 'Courier New';
        var lz = lzss_www(uncompressed, 100, 50, bRemoveSpaces, min_prefix_size);

        var cornerSize = new Size(10, 10);
        var string1 = null;
        var start = new Point(12,42);

        var x = start.x, y = start.y;
        var ly = 40;
        var spacing = 53;
        var fontSize = 25;

        graphics_links = new Group(); 
        var underlay = new Group();

        for(var i=0; i < lz.length; i++) {
            
            if(lz[i] instanceof Character) {
                if(lz[i].char == '\n') { y+=spacing; x=start.x;}
                var box = new TextBox(lz[i].char, fontFamily, fontSize, true);
                box.position = new Point(x + (box.bounds.width/2), y);
                x = box.bounds.right;
                lz[i].box = box;
                box.setEdit(false);
            } else {
                var a = lz[i]; var s = "";
                var xc = 0 + x;
                for(var j=0; j<a.length; j++) {
                    s+=a[j].char;
                    var box = a[j].box = new TextBox(
                        a[j].char, 
                        fontFamily, 
                        fontSize, 
                        false);
                    box.position = new Point(xc + (box.bounds.width/2), y);
                    xc = box.bounds.right;
                }

                //if contain newline
                var inputbox = new TextBox(s, fontFamily, fontSize, false);
                inputbox.position = new Point(x + (inputbox.bounds.width/2), y);
                x = inputbox.bounds.right;

                var border = new Path.Rectangle(inputbox.bounds.clone());
                border.strokeColor = new Color(0,0,0,0.35);
                underlay.addChild(border);
               
                var refBoxto = new Path.Rectangle(
                    inputbox.bounds.clone().expand(5), 
                    cornerSize);
                    

                refBoxto.fillColor = new Color(0,0,1,0.1);
                refBoxto.strokeColor = new Color(0,0,1,0.6);
                refBoxto.strokeWidth = 1.5;
                refBoxto.locked = true;
                refBoxto.name = 'to';
                
                var refBox = new Path.Rectangle(
                    (new Rectangle(a[0].link.box.bounds.topLeft,
                        a[a.length-1].
                        link.box.bounds.bottomRight)).expand(5),
                        cornerSize);
                refBox.fillColor = new Color(1,0,0,0.1);
                refBox.strokeColor = new Color(1,0,0,0.6);
                refBox.strokeWidth = 1.5;
                refBox.locked = true;
                refBox.name = 'from';
               
                var path = line_shortest(refBoxto, refBox);
                var line = arrow(path, new Color(0,0,1,0.6));
                line.name = 'arrow';
                
                inputbox.data.indicator = new Group([refBoxto, refBox, line]);
                inputbox.data.indicator.visible = !bDynamicLinks;
                graphics_links.addChild(inputbox.data.indicator);
                
                inputbox.data.selected = function(self) {
                    if(bDynamicLinks) self.data.indicator.visible = true; 
                    self.data.indicator.children.to.fillColor = new Color(0,0,1,0.1);
                    self.data.indicator.children.to.strokeColor = new Color(0,0,1,0.6);
                    self.data.indicator.children.from.fillColor = new Color(1,0,0,0.1);
                    self.data.indicator.children.from.strokeColor = new Color(1,0,0,0.6);
                    self.data.indicator.children.arrow.strokeColor = new Color(0,0,1,0.5);
                };
                
                inputbox.data.unselected = function(self) {
                    if(bDynamicLinks) self.data.indicator.visible = false; 
                    self.data.indicator.children.to.fillColor = new Color(0,0,1,0.02);
                    self.data.indicator.children.to.strokeColor = new Color(0,0,1,0.3);
                    self.data.indicator.children.from.fillColor = new Color(1,0,0,0.02);
                    self.data.indicator.children.from.strokeColor = new Color(1,0,0,0.3);
                    self.data.indicator.children.arrow.strokeColor = new Color(0,0,1,0.3);
                };
               
                
                inputbox.cursorEnter = 
                    function() { //if(bDynamicLinks) this.data.indicator.visible = true; 
                        this.data.selected(this);
                    };
                inputbox.cursorLeave = 
                    function() { //if(bDynamicLinks) this.data.indicator.visible = false; 
                        this.data.unselected(this);
                    };
   
                inputbox.data.unselected(inputbox);

            }


       }
       underlay.bringToFront();
       graphics_links.bringToFront();
       
       console.log(lz);
    }
  
    function arrow(path, color) {    
        var tangent = path.getTangentAt(4);
        var start = path.firstSegment.point;
        
        var arrowVector = tangent.normalize(8);
        
        var head = new Path([
                start,
                start.add(arrowVector.rotate(25)),
                start.add(tangent.normalize(6)),
                start.add(arrowVector.rotate(-25)),
                start
            ]);

        head.fillColor = color;
        head.strokeWidth = 0.1;
        head.name = "head";
        
        var vectorItem = new Group([path, head]);
        vectorItem.strokeWidth = 1.5;
        vectorItem.strokeColor = color;
        
        return vectorItem;
    }

    function line_shortest(A, B) {
        var closest = null;
        var bA = A.bounds;
        var bB = B.bounds;
        var v = bB.topCenter.subtract(bA.topCenter);
        
        var a = (v.length * 0.5);
        var o = 10;
        var angle = Math.atan(o/a);
        
        var n = v.normalize(Math.sqrt(a*a + o*o))
                 .rotate(angle * 180/Math.PI)
                 .add(bA.topCenter);

        var check = [
            {A: bA.topCenter, B: bB.topCenter, Path: new Path.Arc(bB.topCenter, n, bA.topCenter)},
            {A: bA.topCenter, B: bB.bottomCenter, Path: new Path([bB.bottomCenter, bA.topCenter])}
        ];
        
        var min = null;
        for(var i = 0; i < check.length; i++) {
            var c = check[i];
            var len = c.A.subtract(c.B).length;
            if((min == null) || (min > len)) {
                min = len;
                closest = c;
            }
        }

        return closest.Path;
    }

});
