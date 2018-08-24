/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 * 
 * body weight 91kg
 * x 12
 * 
 */

var __focusedInput = null;
function import_TextInput(scope, canvas, $canvas) {
    scope.calcTextDimensions = function(string, fontFamily, fontSize) {
        var char = new PointText({
            point: [0,0],
            content: string,
            fillColor: 'black',
            fontSize: fontSize,
            font: fontFamily
        });
        var r = char.bounds.clone();
        char.remove()
        return r;
    }
    
    //copy the default
    var onkeydown = scope.onkeydown;
    var onkeypress = scope.onkeypress;
    scope.releaseKeyBoardFocus = function() {
        if(__focusedInput != null) __focusedInput._cursorLoseFocus();
        __focusedInput = null;

        scope.onkeydown = onkeydown;
        scope.onkeypress = onkeypress;
    }
    
    function takeKeyBoardFocus(group, at) {
        if((__focusedInput != null) && (__focusedInput !== group))
            __focusedInput._cursorLoseFocus();
        __focusedInput = group;
        scope.onkeydown = function(e){
            
            if (e.keyCode == 37) {
                if(at != null) {
                    at = at.leftSibling();
                    group._cursorAlign(at);
                }
            }
            
            if (e.keyCode == 39) {
                if(at == null) at = group.firstChild;
                else if(at.rightSibling() != null) 
                { at = at.rightSibling(); }
                group._cursorAlign(at);
            }
            
            if (e.keyCode == 8) {
                if(typeof at != 'undefined')
                if(at != null) {
                    var index = at.index;
                    if(index >= 0) {
                        var next = at.leftSibling();
                        at.remove();
                        at = next;
                        group._align();
                        group._cursorAlign(at);
                    }
                }
                return false;
            }
        };
        scope.onkeypress = function(e) {

            at = group.append(String.fromCharCode(e.which),at);
            return false;  
        }
    }
    
    scope.TextBox = Group.extend({ 
        initialize: function TextBox(string, fontFamily, fontSize, show) {
            var self = this;
            var rectangle = calcTextDimensions(string, fontFamily, fontSize);
            
            this.data.bCanEdit = true;
            
            
            this.clip = new Path.Rectangle(rectangle);
            this.clip.strokeColor = 'white';
            
            this.border = new Path.Rectangle(rectangle);
            this.border.fillColor = 'white';
            this.border.strokeColor = 'black';
            this.border.strokeWidth = 1;
            
            this.cursor = new Path.Line(new Point(0,0), 
                new Point(0, this.border.bounds.height));
                
            this.cursor.strokeWidth = 2;
            this.cursor.strokeColor = new Color(0,0,0,0.6);
            this.cursor.visible = false;
            
            if(!show) this.border.strokeColor = new Color(0,0,0,0.2);
                else this.border.strokeColor = 'white';

            this.text = new CharacterGroup(fontSize, fontFamily, this);
            
            Group.call(this);
            this.addChildren([this.clip,this.border,this.text, this.cursor]);
            this.clipped = true;
            if(show) this.text.append(string);
            
            
            this.onMouseEnter = function(event) {
                if(self.data.bCanEdit) {
                    $canvas.css( 'cursor', 'text' );
                    self.cursorEnter(event);
                }
                
            }

            this.onMouseLeave = function(event) {
                $canvas.css( 'cursor', 'default' );
                self.cursorLeave(event);
            }
            
        },
        setEdit: function(b) {  this.data.bCanEdit = b;} ,
        cursorEnter: function(event) {},
        cursorLeave: function(event) {}

    });

    scope.CharacterGroup = Group.extend({       
        initialize: function CharacterGroup(fontSize, fontFamily, textbox) {

            this.textbox = textbox;
            this.border = textbox.border;
            this.cursor = textbox.cursor;
            this.fontFamily = fontFamily;
            this.fSize = fontSize;
            Group.call(this);

            //Cursor too last character
            var self = this;
            this.border.onMouseDown = function(event) {
                console.log(self.textbox.data.bCanEdit);
                if(self.textbox.data.bCanEdit)
                {
                    takeKeyBoardFocus(self, self.lastChild);
                    self._cursorAlign(self.lastChild);
                    self._cursorGainFocus();
                }
            }
            this.onFrame = function(){}; //This makes it update

        },
        focused: function() {
            // too override.
        
        
        },
        _cursorBlink: function(event) {
            if(this.visible && ((event.count % 60) == 0)) {
                this.visible = false;
            }
            else if((event.count) % 20 == 0)
                this.visible = true;
        },
        _cursorGainFocus: function() {
            this.border.strokeColor = new Color(1,1,0, 0.5);
            this.border.strokeWidth = 5;
            this.cursor.visible = true;
            if(!this.cursor.responds('frame')) this.cursor.on('frame', this._cursorBlink);
        },
        _cursorLoseFocus: function() {
            this.border.strokeColor = 'white';
            this.border.strokeWidth = 5;
            if(this.cursor.responds('frame')) this.cursor.detach('frame', this._cursorBlink);
            this.cursor.visible = false;
        },
        _cursorAlign: function(at) {
            if(at != null)
                this.cursor.position = at.bounds.rightCenter;
            else { 
                this.cursor.position = this.border.bounds.leftCenter;
                this.cursor.position.x += 1;
            }
        },
        _align: function() {
            if(this.children.length > 0) {
                this.children[0].position.x += this.border.bounds.left - this.children[0].bounds.left;
                this.children[0].position.y += 
                        this.border.bounds.top - this.children[0].bounds.top;
                
                for(var i = 1; i < this.children.length; i++) {
                    this.children[i].position.x += this.children[i-1].bounds.right - 
                            this.children[i].bounds.left;
                    this.children[i].position.y += 
                        this.border.bounds.top - this.children[i].bounds.top;
                }
            }
        },
        
        
        append: function(string, at) {
            
    
            var characters = string.split("");
            var character = null;
            
            if(this.bounds.width < (this.border.bounds.width)) //keep in bounds
            for(var i=0;i<characters.length;i++) {

                character = new PointText({
                    point: [0,0],
                    content: characters[i],
                    fillColor: 'black',
                    fontSize: this.fSize,
                    font: this.fontFamily
                });
                
                var index = 0;
                index = (typeof at == 'undefined') || (at == null) ? 0 : at.index+1;            
                at = this.insertChild(index, character);

                var self = this;
                //on character select
                character.onMouseDown = function(event) {
                    if(self.textbox.data.bCanEdit)
                    {
                    
                        var at = null
                        if(event.point.x > this.position.x)
                            takeKeyBoardFocus(self, at = this);
                        else takeKeyBoardFocus(self, at = this.parent.children[this.index-1]);
                        this.parent._cursorAlign(at);
                        this.parent._cursorGainFocus();
                    }
                }
                
                character.leftSibling = function(event) {
                    var sibling = this.parent.children[this.index-1];
                    return (typeof sibling == 'undefined') ? null : sibling;
                }
                
                character.rightSibling = function(event) {
                    var sibling = this.parent.children[this.index+1];
                    return (typeof sibling == 'undefined') ? null : sibling;
                }
                
            } 

            this._align();
            this._cursorAlign(at);

            return at;
        }
  
    });
}