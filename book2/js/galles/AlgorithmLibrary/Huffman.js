// Copyright 2015 Yves Lucet, University of British Columbia Okanagan. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of British Columbia Okanagan.

function Huffman(am, w, h) {
    this.init(am, w, h);
}

Huffman.prototype = new Algorithm();
Huffman.prototype.constructor = Huffman;
Huffman.superclass = Algorithm.prototype;

Huffman.MARGIN_X = 40;
Huffman.MARGIN_Y = 60;
Huffman.STATUS_LABEL_X = 20;
Huffman.STATUS_LABEL_Y = 20;
Huffman.NODE_WIDTH = 25;
Huffman.NODE_HEIGHT = 25;
Huffman.NODE_SPACING_X = 30;
Huffman.NODE_SPACING_Y = 35;

Huffman.NORMAL_FG_COLOR = "#000";
Huffman.ROOT_FG_COLOR = "#00f";

Huffman.cmpByFreq = function(node1, node2) {
    return node1.freq - node2.freq;
}

Huffman.prototype.init = function(am, w, h) {
    Huffman.superclass.init.call(this, am, w, h);
    this.addControls();
    this.reset();
}

Huffman.prototype.addControls = function() {
    this.controls = [];

    this.btnReset = addControlToAlgorithmBar("Button", "Ponastavi");
    this.btnReset.onclick = this.reset.bind(this);
    this.controls.push(this.btnReset);

    this.btnBuild = addControlToAlgorithmBar("Button", "Zgradi drevo");
    this.btnBuild.onclick = this.buildWrapper.bind(this);
    this.controls.push(this.btnBuild);

    this.lblText = addLabelToAlgorithmBar("Besedilo:");
    this.txtText = addControlToAlgorithmBar("Text", "Perica reže raci rep");
    this.controls.push(this.txtText);
}

Huffman.prototype.disableUI = function(event) {
    this.setEnabled(false);
}

Huffman.prototype.enableUI = function(event) {
    this.setEnabled(true);
}

Huffman.prototype.setEnabled = function(b) {
    for (var i = 0; i < this.controls.length; ++i) {
        this.controls[i].disabled = !b;
    }
}

Huffman.prototype.reset = function() {
    var i, ch, freqs;
    var text = this.txtText.value;

    this.nextId = 0;

    this.animationManager.resetAll();
    this.clearHistory();

    this.commands = [];

    this.statusId = this.newId();
    this.cmd(
        "CreateLabel", this.statusId, "Pripravljen.", Huffman.STATUS_LABEL_X, Huffman.STATUS_LABEL_Y, 0);

    // Calculate the frequencies of the characters in the input.
    freqs = {};
    for (i = 0; i < text.length; ++i) {
        ch = text[i];
        freqs[ch] = 1 + (freqs[ch] !== undefined ? freqs[ch] : 0)
    }

    // Create a singleton tree for each node.
    this.roots = [];
    Object.keys(freqs).sort().forEach(function(c, i) {
        this.roots.push(this.newLeafNode(c, freqs[c], i));
    }, this);
    this.pq = new Huffman.PQ(this.roots, Huffman.cmpByFreq);

    this.redrawTree();

    this.animationManager.StartNewAnimation(this.commands);
}

// Allocates a new graphics ID.
Huffman.prototype.newId = function() {
    return this.nextId++;
}

Huffman.prototype.newLeafNode = function(value, freq, rootIndex) {
    return {
        freq: freq,
        value: value,
        parent: undefined,
        child1: undefined,
        child2: undefined,
        rootIndex: rootIndex,

        // Visualization properties.
        id: undefined,
        width: Huffman.NODE_WIDTH,
        x: undefined,
        y: undefined,
        inPQ: true
    };
}

Huffman.prototype.newParentNode = function(child1, child2, rootIndex) {
    var node = {
        freq: child1.freq + child2.freq,
        value: undefined,
        parent: undefined,
        child1: child1,
        child2: child2,
        rootIndex: rootIndex,

        // Visualization properties.
        id: undefined,
        width: child1.width + Huffman.NODE_SPACING_X + child2.width,
        x: undefined,
        y: undefined,
        inPQ: false
    };

    if (child1.parent !== undefined || child2.parent !== undefined) {
        throw new Error("newParentNode: Child already has a parent.");
    }
    child1.parent = node;
    child2.parent = node;

    return node;
}

Huffman.prototype.getChildren = function(node) {
    return node.child1 !== undefined ? [node.child1, node.child2] : [];
}

Huffman.prototype.setNodeInPQ = function(node, inPQ) {
    if (inPQ !== undefined) {
        node.inPQ = inPQ;
    }
    this.cmd(
        "SetForegroundColor",
        node.id,
        node.inPQ ? Huffman.ROOT_FG_COLOR : Huffman.NORMAL_FG_COLOR);
}

// Sets the text displayed in the status label.
Huffman.prototype.setStatus = function(msg) {
    this.cmd("SetText", this.statusId, msg);
}

// Performs all the steps to update the visualization based on the current
// state.
Huffman.prototype.redrawTree = function() {
    var i;
    this.repositionTree();
    for (i = 0; i < this.roots.length; ++i) {
        this.realizePositions(this.roots[i]);
    }
}

// Calculates positions for all of the nodes in the tree, using their
// already-calculated widths.
Huffman.prototype.repositionTree = function() {
    var x = Huffman.MARGIN_X + Huffman.NODE_WIDTH / 2;
    var y = Huffman.MARGIN_Y + Huffman.NODE_HEIGHT / 2;
    var i, root;

    for (i = 0; i < this.roots.length; ++i) {
        root = this.roots[i];
        root.x = x + root.width / 2;
        root.y = y;
        this.repositionChildren(root);
        x += root.width + Huffman.NODE_SPACING_X;
    }
}

// Calculates positions for all of the children underneath the node, based on
// the node's position, using their already-calculated widths.  Centers the
// children underneath the node.
Huffman.prototype.repositionChildren = function(node) {
    var x = node.x - node.width / 2;
    var y = node.y + Huffman.NODE_SPACING_Y + Huffman.NODE_HEIGHT;
    var children = this.getChildren(node);
    var i, child;
    for (i = 0; i < children.length; ++i) {
        child = children[i];
        child.x = x + child.width / 2;
        child.y = y;
        this.repositionChildren(child);
        x += child.width + Huffman.NODE_SPACING_X;
    }
}

// Applies the positions of the given node and all of its descendents to the
// visualization.
Huffman.prototype.realizePositions = function(node) {
    var children = this.getChildren(node);
    var i, label;
    if (node.id === undefined) {
        node.id = this.newId();
        label = node.value === undefined ?
            node.freq + "" :
            node.value + " (" + node.freq + ")";
        this.cmd("CreateCircle", node.id, label, node.x, node.y);
        this.setNodeInPQ(node);
        if (node.parent !== undefined) {
            this.cmd("Connect", node.parent.id, node.id);
        }
    } else {
        this.cmd("Move", node.id, node.x, node.y);
    }
    for (i = 0; i < children.length; ++i) {
        this.realizePositions(children[i]);
    }
}

// Joins the two trees with the given roots under a new root node that is
// returned.  Updates the visualization.
Huffman.prototype.union = function(node1, node2) {
    var i, nodeTmp, newRoot;
    if (node1.rootIndex === undefined || node2.rootIndex === undefined) {
        throw new Error("union: Both nodes must have root node indices.");
    }

    // For visual consistency, always merge the right node into the left.
    if (node1.rootIndex > node2.rootIndex) {
        nodeTmp = node1;
        node1 = node2;
        node2 = nodeTmp;
    }

    newRoot = this.newParentNode(node1, node2, node1.rootIndex);
    this.roots[newRoot.rootIndex] = newRoot;
    this.roots.splice(node2.rootIndex, 1);
    for (i = node2.rootIndex; i < this.roots.length; ++i) {
        this.roots[i].rootIndex = i;
    }
    node1.rootIndex = undefined;
    node2.rootIndex = undefined;

    this.redrawTree();
    this.cmd("Connect", newRoot.id, node1.id);
    this.cmd("Connect", newRoot.id, node2.id);

    return newRoot;
}

Huffman.prototype.buildWrapper = function(event) {
    this.reset();
    if (this.txtText.value === "") {
        return;
    }
    this.implementAction(this.build.bind(this), this.txtText.value);
}

// Animates the construction of a Huffman code for the given text.
Huffman.prototype.build = function(text) {
    var node, child1, child2;

    this.commands = [];
    this.cmd("Step");

    while (this.pq.size() > 1) {
        this.setStatus("Odstranjujem najmanjša elementa iz prioritetne vrste.");
        this.cmd("Step");
        child1 = this.pq.removeMin();
        child2 = this.pq.removeMin();
        this.setNodeInPQ(child1, false);
        this.setNodeInPQ(child2, false);
        this.cmd("SetHighlight", child1.id, 1);
        this.cmd("SetHighlight", child2.id, 1);
        this.cmd("Step");

        this.setStatus("Združujem drevesi.");
        this.cmd("Step");
        this.cmd("SetHighlight", child1.id, 0);
        this.cmd("SetHighlight", child2.id, 0);
        node = this.union(child1, child2);
        this.cmd("SetHighlight", node.id, 1);
        this.cmd("Step");

        this.setStatus("Vstavljam novo korensko vozlišče v prioritetno vrsto.");
        this.cmd("Step");
        this.pq.insert(node);
        this.setNodeInPQ(node, true);
        this.cmd("SetHighlight", node.id, 0);
        this.cmd("Step");
    }

    // Finally, remove the last entry from the priority queue so that it doesn't
    // stay coloured.
    node = this.pq.removeMin();
    this.setNodeInPQ(node, false);

    this.setStatus("");
    return this.commands;
}

// Simple priority queue implementation using a min heap.
Huffman.PQ = function(elements, comparator) {
    var i;

    this.comparator = comparator;

    // Create a heap via bottom-up construction.
    this.elements = elements.slice();
    for (i = this.elements.length - 1; i >= 0; --i) {
        this.percolateDown(i);
    }
}

// Returns the number of elements in the queue.
Huffman.PQ.prototype.size = function() {
    return this.elements.length;
}

// Inserts an element into the queue.
Huffman.PQ.prototype.insert = function(element) {
    this.elements.push(element);
    this.percolateUp(this.elements.length - 1);
}

// Removes the minimum element from the queue and returns it.
Huffman.PQ.prototype.removeMin = function() {
    var minElement = this.elements[0];
    this.swap(0, this.elements.length - 1);
    this.elements.pop();
    this.percolateDown(0);
    return minElement;
}

// Returns the index of the parent of a node, or undefined when given the root.
Huffman.PQ.prototype.getParent = function(i) {
    // Avoiding ending up with floating-point numbers here.
    return i === 0 ? undefined : (i - ((i & 1) == 1 ? 1 : 2)) / 2;
}

// Returns the index of the child node with the smaller key, or undefined the
// node has no children.
Huffman.PQ.prototype.findMinChild = function(i) {
    var j = i * 2 + 1;  // Left child index.
    if (j >= this.elements.length) {
        return undefined;
    } else if (j + 1 < this.elements.length) {
        // Two children; compare them.
        if (this.comparator(this.elements[j], this.elements[j + 1]) < 0) {
            return j;  // Left child is smaller.
        } else {
            return j + 1;  // Right child is smaller.
        }
    } else {
        // Only one child.
        return j;
    }
}

// Swaps two positions in the heap.
Huffman.PQ.prototype.swap = function(i, j) {
    var x = this.elements[i];
    this.elements[i] = this.elements[j];
    this.elements[j] = x;
}

// Moves an element down the heap until it's less than or equal to all of its
// children.
Huffman.PQ.prototype.percolateDown = function(i) {
    var j;
    while (true) {
        j = this.findMinChild(i);
        if (j === undefined) {
            break;
        }
        if (this.comparator(this.elements[i], this.elements[j]) <= 0) {
            break;
        }
        this.swap(i, j);
        i = j;
    }
}

// Moves an element up the heap until it's greater than or equal to its parent.
Huffman.PQ.prototype.percolateUp = function(i) {
    var j;
    while (true) {
        j = this.getParent(i);
        if (j === undefined) {
            break;  // No parent.
        }
        if (this.comparator(this.elements[i], this.elements[j]) >= 0) {
            break;  // Current node is >= parent.
        }
        this.swap(i, j);
        i = j;
    }
}

var currentAlg;

function init() {
    var animManag = initCanvas();
    currentAlg = new Huffman(animManag, canvas.width, canvas.height);
}
