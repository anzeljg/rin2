/* This file has been put into the public domain by its
 * author, David Eck (http://math.hws.edu/eck), with no
 * guarantees or claims about what it might be good for.
 */

/*
 * This file defines a Card class to represent the standard 52 playing cards
 * and a Deck class to represents a deck of cards.
 */

/**
 * Constructs a card.  When called with no parameters, a card
 * with value and suit set to -1 is created.  It can also be called
 * with two arguments specifying the value and suit of the card, where
 * value is a number in the range 1 to 13 and suit is in the range 1 to 4.
 * @constructor
 */
function Card(value, suit) {
    
    this.suit = -1;
    this.value = -1;
    
    if (arguments.length >= 2)
       this.set(arguments[0], arguments[1]);
    
}

/*
 * some constants that can be used to refer to non-numeric card values.
 */
Card.ACE = 1;
Card.JACK = 11;
Card.QUEEN = 12;
Card.KING = 13;

/*
 * Some constants that can be used to refer to suits.
 */
Card.CLUB = 1;
Card.DIAMOND = 2;
Card.SPADE = 4;
Card.HEART = 3;

/**
 *  The clear method sets the value and suit of the card to -1, 
 *  representing an undefined card.
 */
Card.prototype.clear = function() {
   this.suit = -1;
   this.value = -1;
}

/**
 * The set method sets the value and suit of a card.
 * @param value the value of the card, a number in the range 1 to 13
 * @param suit the suit of the card, a number in the range 1 to 4
 */
Card.prototype.set = function (value, suit) {
   if (arguments.length < 2)
      throw "The set function requires two arguments.";
   var v = Math.round(Number(value));
   var s = Math.round(Number(suit));
   if ( ! (v >- 1 && v <= 13) )
      throw "The value of a card must be in the range 1 to 13.";
   if ( ! (s >= 1 && s <= 4) )
      throw "The suit of a card must be 1, 2, 3, or 4.";
   this.suit = s;
   this.value = v;
}

/**
 * a card's toString method returns a string such as "Ace of Hearts"
 * or "2 of Diamonds".
 */
Card.prototype.toString = function() {
    if (this.value == -1)
       return "(Card not shown)";
    var s = "";
    switch (this.value) {
       case 1: s += "Ace"; break;
       case 11: s += "Jack"; break;
       case 12: s += "Queen"; break;
       case 13: s += "King"; break;
       default: s += this.value; break;
    }
    s += " of ";
    switch (this.suit) {
       case 1: s += "Clubs"; break;
       case 2: s += "Diamonds"; break;
       case 3: s += "Hearts"; break;
       case 4: s += "Spades"; break;
    }
    return s;
}

/**
 * An object of type Deck is a standard deck of 52 playing cards.
 * The constructor creates the cards in a standard order.  The 
 * shuffle method must be called to place them into a random order.
 * Note that it is assumed that the individual cards in this deck will 
 * not be modified.
 * @constructor
 */
function Deck() {
   this.deck = new Array(52);
   this.count = 52;
   var c = 0;
   for (var i = 1; i <= 4; i++)
      for (var j = 1; j <= 13; j++)
         this.deck[c++] = new Card(j,i);
}

/**
 * Returns any cards that have been dealt to the deck and shuffles
 * them into a random order.
 */
Deck.prototype.shuffle = function() {
   for (var i = 51; i > 0; i--) {
       var r = Math.floor((i+1)*Math.random(i));
       var temp = this.deck[r];
       this.deck[r] = this.deck[i];
       this.deck[i] = temp;
   }
   this.count = 52;
}

/**
 * The nextCard method removes the next available card from
 * the deck and returns it.  If called when all cards have
 * already been dealt, an exception is thrown.
 * @return the next available card in the deck.
 */
Deck.prototype.nextCard = function() {
   if (this.count == 0)
      throw "Deck is out of cards";
   return this.deck[--this.count];
}

