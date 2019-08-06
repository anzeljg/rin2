// DEXi HTML Evaluator: JavaScript library
// v1.0 2016-02-1
// Marko Bohanec, marko.bohanec@ijs.si
// http://kt.ijs.si/MarkoBohanec/dexihtml.html

// DEXi object:
// Internal representation and evaluation of DEXi models
// Assumption: DEXi.model is defined (typically loaded from a file into HTML) before use

DEXi = {

// DEXi.model: A representation of a DEXi model, typically obtained by exporting from DEXi software
 model: {},

// DEXi.attributes: A mapping from attribute ID to attribute representation within DEXi.model structure
// Defined at initialization after DEXi.model has been loaded.
 attributes: {},

// DEXi.alternative: Evaluations of the current alternative,
// represented as a mapping from attribute ID to a sorted and possibly empty array of value indices.
// Defined at initialization after DEXi.model has been loaded.
 alternative: {},

// DEXi.forEachAttribute: Iterates through attributes contained in DEXi.model, in depth-first order.
 forEachAttribute: function (callback /*, thisp*/) {
    if (typeof callback != "function")
        throw new TypeError("forEachAttribute callback is not a function");
    var thisp = arguments[1] || this;

    function iterate(att) {
        callback.call(thisp,att);
        for(var i=0; i<att.attributes.length; i++) {
            iterate(att.attributes[i]);
        }
    }

    for(var i=0; i<this.model.attributes.length; i++) {
        iterate(this.model.attributes[i]);
    }
 },

// DEXi.attClass: Possibly prefixed string representation of attribute att's class (basic, aggregated, link).
 attClass: function(att, prefix) {
     return (prefix || "") + (att.link ? "link" : (att.attributes.length==0 ? "basic" : "aggregated"));
 },

// DEXi.valClass: Possibly prefixed value class (bad, good, neutral) of the index-th value of attribute att.
 valClass: function(att, index, prefix) {
    return (prefix || "") + (att.scale.values[index].group || "neutral");
 },

// DEXi.valName: String representation of the index-th value of attribute att.
 valName: function(att, index) {
    return att.scale.values[index].name || index;
 },

// DEXi.allValues: Returns array containing all value indices from 0 to scaleSize(att)-1.
// Used to assign the value of "*", i.e., all values from att's scale.
 allValues: function(att) {
    var vals = [];
    for(var i=0; i<att.scale.values.length; i++) {
        vals.push(i);
    }
    return vals;
 },

// DEXi.vectorIndex: Mapping argument vector vec to the function value index
// in decision space with dimensions (sizes of the corresponding value scales) dim.
 vectorIndex: function(vec,dim) {
     var base = 1, index = 0;
     for(var i=dim.length-1; i>=0; i--) {
         index += base*vec[i];
         base *= dim[i];
     }
     return index;
 },

// DEXi.evaluateSingle: Calculate att.funct(vec) and accordingly update alternative[att.id].
 evaluateSingle: function(att,vec) {

     var model = this;

     function include(val) {
        if (model.alternative[att.id].indexOf(val)<0) {
            model.alternative[att.id].push(val);
        }
     }

     var result = att.funct.values[this.vectorIndex(vec,att.funct.dimensions)];
     if (typeof result=="object") {
         for(var i=0; i<result.length; i++) {
             include(result[i]);
         }
     } else {
         include(result);
     }
 },

// DEXi.evaluateMulti: Consecutively draw value vectors from vals and call evaluateSingle().
 evaluateMulti: function(att,vals) {
     var idx = [];
     var val = [];
     for(var i=0; i<vals.length; i++) {
        if (vals[i].length==0) {
            return; // i-th argument values are [], so is the overall result
        }
        idx.push(0);
        val.push(0);
     }
     do {
        // setup arguments for evaluateSingle
        for(var i=0; i<vals.length; i++) {
            val[i] = vals[i][idx[i]];
        }
        this.evaluateSingle(att,val);
        // calculate new index vector
        var carry = 1;
        for(var i=0; i<vals.length && carry; i++) {
            idx[i]++;
            if (idx[i]>=vals[i].length) {
                idx[i] = 0;
            } else {
                carry = 0;
            }
        }
     } while (carry==0);
 },

// DEXi.evaluateAttribute: Evaluate current alternative at attribute att.
// Evaluation is depth-first recursive to ensure arguments are defined prior to evaluation.
// Only aggregated and link attributes are evaluated, as basic have been already set.
 evaluateAttribute: function(att) {
    for(var i=0; i<att.attributes.length; i++) {
        this.evaluateAttribute(att.attributes[i]);
    }
    if (att.link) { // linked attribute
        this.evaluateAttribute(this.attributes[att.link]);
        this.alternative[att.id]=this.alternative[att.link];
    }
    else if (att.attributes.length!=0) { // aggregated attribute
        var vals = [];
        for(var i=0; i<att.attributes.length; i++) {
            vals.push(this.alternative[att.attributes[i].id]);
        }
        this.alternative[att.id] = [];
        this.evaluateMulti(att,vals);
        this.alternative[att.id].sort();
    }
 },

// DEXi.evaluate: Perform evaluation of the current alternative.
// Assumption: Basic attribute values have been already set (from the interface).
 evaluate: function() {
    for(var i=0; i<this.model.attributes.length; i++) {
        this.evaluateAttribute(this.model.attributes[i]);
    }
 },

//DEXi.initLevel: Assign att.level and calculate maximum level in the model
 initLevels: function(att,level) {
        att.level = level;
        this.model.maxLevel = Math.max(level,this.model.maxLevel);
        for(var i=0; i<att.attributes.length; i++) {
            this.initLevels(att.attributes[i],level+1);
        }
 },

// DEXi.initialize: Initialize model.attributes and model.alternative.
// Depending on full, alternative values are initialized to all values (true) or empty array (false).
 initialize: function(full) {
    this.model.maxLevel = 0;
    for (var i=0; i<this.model.attributes.length; i++) {
        this.initLevels(this.model.attributes[i],0);
    }
    var model = this;
    this.forEachAttribute(function(att){
        model.attributes[att.id]=att;
        model.alternative[att.id]= full ? model.allValues(att) : [];
    })
 }
};

// DEXiInterface object:
// Conduct between DEXi model and dynamic document.

function DEXiInterface(dexiModel, dexiModelId, indentType, inputType, allowAll, state) {
    this.model = dexiModel || DEXi.model;             // underlying DEXi model
    this.modelId = '#'+dexiModelId || "#DEXi_model";  // HTML model element ID
    this.indentType = indentType || "inline";         // graphic display of tree indent: "indent" or "line"
    this.inputType = inputType || "select";           // default data entry element: "select", "radio", "check" or "none"
    this.allowAll = allowAll || true;                 // default setting for allowing "*" values
    this.state = state || "data";                     // current interface state: "data" or "eval"
    this.showLevel = this.model.model.maxLevel;       // the tree is shown up to and including the depth showLevel
    if (indentType=="lines") {
        this.indentReplace = {   // empty indent when indentType=="lines"
            "%": "&nbsp;&nbsp;", //none
            "|": "&nbsp;&nbsp;", //thru
            "*": "&nbsp;&nbsp;", //link
            "+": "&nbsp;&nbsp;", //last
            "-": "&nbsp;&nbsp;"  //line
        }
    } else {
        this.indentReplace = {   // Unicode-character indent when indentType=="indent"
            "%": "&nbsp;&nbsp;", //none
            "|": "\u2502&nbsp;", //thru
            "*": "\u251c\u2500", //link
            "+": "\u2514\u2500", //last
            "-": "\u2500\u2500"  //line
        }
    }
}

// DEXiInterface.indent: Mapping from DEXi.model indents to HTML indents.
DEXiInterface.prototype.indent = function(indent) {
    var result = "";
    for(var i=0; i<indent.length; i++){
        var ch = indent.charAt(i);
        var rep = this.indentReplace[ch];
        result += rep || ch;
    }
    return result;
}

// DEXiInterface.valString: Return the HTML string representing index-th att's value.
DEXiInterface.prototype.valString = function(att, index) {
    return '<span class="'+this.model.valClass(att,index,"DEXi_")+'">'+this.model.valName(att, index)+'</span>';
 },

// DEXiInterface.valsString: Return the HTML string representing the set of attribute values vals.
DEXiInterface.prototype.valsString = function(att, vals) {
    var strs = [];
    for(var i=0; i<vals.length; i++) {
        strs.push(this.valString(att,vals[i]));
    }
    return strs.join('; ');
}

// DEXiInterface.setupTree: Return HTML string for the Tree column of attribute att,
// consisting of indent and attribute name.
DEXiInterface.prototype.setupTree = function(att) {
    var linesIndent = this.indentType=="lines" ? '<span class="DEXi_indbox"></span>' : '';
    return '<td class="DEXi_attribute">'+
     '<span class="DEXi_indent">'+this.indent(att.indent)+linesIndent+'</span>'+
     '<span class="DEXi_attname">'+att.name+'</span>'+
     '</td>';
}

// DEXiInterface.setupValue: Return HTML string for the Value column of attribute att:
// empty for aggregated and link attributes, defining input elements for basic attributes.
DEXiInterface.prototype.setupValue = function(att) {

    function selected(cond, str) {
        return cond ? ' '+str+'="'+str+'"' : '';
    }

    var inpHtml = "";
    var altVals = this.model.alternative[att.id]; // current alternative value at attribute att
    var altVal = altVals.length==1 ? altVals[0] : (altVals.length==0 ? -1 : -2);
        // altVal: v>=0 if altVals contains a single value v
        //           -1 if altVals is empty
        //           -2 if altVals contains multiple values
    if (!att.link && att.attributes.length==0) { // basic attribute
        switch(this.inputType) {
            case "radio":
                for(var i=0; i<att.scale.values.length; i++) {
                    inpHtml +=
                        '<input type="radio" name="'+att.id+'" value="'+i+'"'+selected(i==altVal,"checked")+'>'+
                        '<span class="DEXi_'+this.model.valClass(att,i)+'">'+this.model.valName(att,i)+'</span>';
                }
                if (this.allowAll) {
                 inpHtml += '<input type="radio" name="'+att.id+'" value="*"'+selected(altVal==-2,"checked")+'>*';
                }
                break;
            case "check":
                for(var i=0; i<att.scale.values.length; i++) {
                    inpHtml +=
                        '<input type="checkbox" name="'+att.id+'" value="'+i+'"'+selected(altVals.indexOf(i)>=0,"checked")+'>'+
                        '<span class="DEXi_'+this.model.valClass(att,i)+'">'+this.model.valName(att,i)+'</span>';
                }
                break;
            case "none":
                inpHtml = this.valsString(att,this.model.alternative[att.id]);
                break;
            default: // select
                inpHtml = '<select name="'+att.id+'">';
                if (!this.allowAll) {
                    inpHtml +=
                        '<option value="null" disabled="disabled" '+selected(altVal<0,"selected")+'></option>';
                }
                for(var i=0; i<att.scale.values.length; i++) {
                    inpHtml +=
                        '<option value="'+i+'" class="DEXi_'+this.model.valClass(att,i)+'"'+
                        selected(i==altVal,"selected")+'>'+this.model.valName(att,i)+'</option>';
                }
                if (this.allowAll) {
                    inpHtml += '<option value="*"'+selected(altVal<0,"selected")+'>*</option>';
                }
                inpHtml += '</select>';
        }
    }
    return '<td class="DEXi_value">'+inpHtml+'</td>';
}

// DEXiInterface.setupAttribute: Append HTML string representing attribute att to the document.
DEXiInterface.prototype.setupAttribute = function(att) {
    if (this.state=="eval" && att.level > this.showLevel) { return; }
    jQuery(this.modelId).append(
        '<tr id="'+att.id+'" class="DEXi_'+this.model.attClass(att)+'">'+
        this.setupTree(att)+
        this.setupValue(att)+
        '</tr>'
    );
}

// DEXiInterface.setupIndent: Format indent lines for attribute att.
// Assumption: indentType=="lines".
DEXiInterface.prototype.setupIndent = function(att) {
    var attName = jQuery(this.modelId+' #'+att.id+' .DEXi_attname');
    if (attName.length==0) { return; }
    var attPos = attName.offset();
    for(var i=0; i<att.attributes.length; i++) {
        var child = att.attributes[i];
        var childName = jQuery(this.modelId+' #'+child.id+' .DEXi_attname');
        if (childName.length!=0) {
            var childPos = childName.offset();
            var boxHeight = childName.height();
            jQuery(this.modelId+' #'+child.id+' .DEXi_indbox').css({
                top: attPos.top + attName.height(),
                left: attPos.left + 3,
                height: childPos.top-attPos.top - boxHeight/2,
                width: childPos.left-attPos.left - 8
        });
        }
    }
}

// DEXiInterface.setupIndent: (Re)format indent lines of all attributes.
DEXiInterface.prototype.setupIndents = function() {
    if (this.indentType!="lines") {
        return;
    }
    this.model.forEachAttribute(this.setupIndent,this);
}

// DEXiInterface: Obtain basic attribute values from input elements
DEXiInterface.prototype.readInputs = function() {
    for(var id in this.model.attributes) {
        var att = this.model.attributes[id];
        if (att.attributes.length==0) { // basic attribute
            var vals = this.model.alternative[id];
            var inputs = this.inputType=="select" ? jQuery(this.modelId+" #"+id+" select") : jQuery(this.modelId+" #"+id+" input");
            if (inputs.length>0) {
                vals = [];
                switch(this.inputType) {
                    case "radio":
                        inputs = jQuery(this.modelId+" #"+id+" input:checked");
                        var val = inputs.val();
                        if (val!==undefined) {
                            vals = (inputs.length>1 || val == "*") ? this.model.allValues(att) : [ Number(val) ];
                        }
                        break;
                    case "check":
                        inputs = jQuery(this.modelId+" #"+id+" input:checked");
                        for(var i=0; i<inputs.length; i++) {
                            vals.push(Number(jQuery(inputs[i]).val()));
                        }
                        break;
                    case "select":
                        var val = jQuery(this.modelId+" #"+id+" select").val();
                        if (val!==undefined) {
                            vals = val=="*" ? this.model.allValues(att) : [ Number(val) ];
                        }
                        break;
                }
            }
            this.model.alternative[id] = vals;
        }
    }
}

// DEXiInterface.setup: HTML model tree display: (Re)create and assign events.
DEXiInterface.prototype.setup = function() {
    jQuery(this.modelId).empty();
    this.model.forEachAttribute(this.setupAttribute,this);
    this.setupShrinkExpand();
    var intfc = this;
    if (this.indentType=="lines") {
        jQuery(window).resize(function() {
            if (intfc.state=="eval") {
                intfc.setupIndents();
            }
        });
    }
    jQuery(this.modelId+" select").change(function(){
        $(this).prop('class',$(this).find('option:selected').prop('class'));
        intfc.evaluate();
    });
    jQuery(this.modelId+" input").change(function(){
        intfc.evaluate();
    });
    jQuery(this.modelId+" select").trigger("change");
}

// DEXiInterface.setState: Set HTML to either data entry ("data") or evaluation ("eval") state.
DEXiInterface.prototype.setState = function(state) {
    this.state = state;
    if (state=="eval") {
        jQuery(this.modelId+' .DEXi_indent').show();
        jQuery(this.modelId+' .DEXi_aggregated').show();
        jQuery(this.modelId+' .DEXi_link').show();
        jQuery("#btnData").show();
        jQuery("#btnEval").hide();
        jQuery("#btnShrink").show();
        jQuery("#btnExpand").show();
        intfc.setupIndents();
        intfc.evaluate();
    }
    else if (state=="data") {
        jQuery(this.modelId+' .DEXi_indent').hide();
        jQuery(this.modelId+' .DEXi_aggregated').hide();
        jQuery(this.modelId+' .DEXi_link').hide();
        jQuery("#btnData").hide();
        jQuery("#btnEval").show();
        jQuery("#btnShrink").hide();
        jQuery("#btnExpand").hide();
    }
}

// DEXiInterface.resetInterface: (Re)create HTML.
DEXiInterface.prototype.resetInterface = function() {
    this.setup();
    this.setState(this.state);
    this.evaluate();
}

// DEXiInterface.setupShrinkExpand: Enable/disable btnShrink and btnExpand
DEXiInterface.prototype.setupShrinkExpand = function() {
    if (this.showLevel<=0) {
        jQuery("#btnShrink").prop("disabled","disabled");
    } else {
        jQuery("#btnShrink").removeAttr("disabled");
    }
    if (this.showLevel>=this.model.model.maxLevel) {
        jQuery("#btnExpand").prop("disabled","disabled");
    } else {
        jQuery("#btnExpand").removeAttr("disabled");
    }
}

// DEXiInterface.setupMenu: Setup the control menu.
DEXiInterface.prototype.setupMenu = function() {
    var gap = '&nbsp;&nbsp;&nbsp;';
    jQuery("#DEXi_commands").append('<p>'+
        '<button type="button" id="btnData">Data Entry</button>'+
        '<button type="button" id="btnEval">Evaluate</button>'+
        gap +
        '<button type="button" title="Collapse tree by one level" id="btnShrink">&#x2196;</button>'+
        '<button type="button" title="Expand tree by one level" id="btnExpand">&#x2198;</button>'+
        gap+
        '<i>Input by</i>: '+
        '<span class="DEXi_menuitem">'+
        '<input type="radio" name="radEntry" value="select""/>Select box</input>&nbsp;'+
        '<input type="radio" name="radEntry" value="radio"/>Radio buttons</input>&nbsp;'+
        '<input type="radio" name="radEntry" value="check"/>Check boxes</input>'+
        '<input type="radio" name="radEntry" value="none"/>None</input>'+
        '</span>'+gap+
        '<span class="DEXi_menuitem">'+
        '<input type="checkbox" id="chkAllow"><i>Allow</i> * (all values) </input>'+
        '</span>'+gap+
        '<button type="button" id="btnReset">Reset</button>'+
        '</p>'
     );
    jQuery('#DEXi_commands input:radio[value='+this.inputType+']').prop('checked',true);
    jQuery('#chkAllow').prop('checked',this.allowAll);
    jQuery("#btnEval").click(function(){intfc.setState("eval");});
    jQuery("#btnData").click(function(){intfc.setState("data");});
    jQuery("#btnReset").click(function(){
        intfc.model.initialize(intfc.allowAll);
        intfc.showLevel = intfc.model.model.maxLevel;
        intfc.resetInterface();
    });
    var intfc = this;
    jQuery("#btnShrink").click(function(){
        if (intfc.showLevel > 0) {
            intfc.showLevel--;
            intfc.resetInterface();
        }
    });
    jQuery("#btnExpand").click(function(){
        if (intfc.showLevel < intfc.model.model.maxLevel) {
            intfc.showLevel++;
            intfc.resetInterface();
        }
    });
    jQuery("#chkAllow").click(function() {
            intfc.allowAll = jQuery(this).prop('checked');
            intfc.resetInterface();
    });
    jQuery("#DEXi_commands input:radio[name=radEntry]").click(function() {
            intfc.inputType = jQuery(this).val();
            intfc.resetInterface();
    });
}

// DEXiInterface.evaluate: Evaluate the current alternative and update the document.
DEXiInterface.prototype.evaluate = function() {
    this.readInputs();
    this.model.evaluate();
    // update display of non-basic values
    for(var id in this.model.attributes) {
        var att = this.model.attributes[id];
        if (att.attributes.length!=0 || att.link) {
            jQuery(this.modelId+" #"+id+" .DEXi_value").html(this.valsString(att,this.model.alternative[id]));
        }
    }
}

jQuery(document).ready(function() {
    DEXi.initialize();
    intfc = new DEXiInterface(DEXi,"DEXi_model","lines");
    DEXi.initialize(intfc.allowAll);
    intfc.setupMenu();
    intfc.resetInterface();
});
