/* This file has been put into the public domain by its
 * author, David Eck (http://math.hws.edu/eck), with no
 * guarantees or claims about what it might be good for.
 */

function DisplayedCard(divid, card) {
   this.card = card || new Card(Card.ACE, Card.SPADE);
   this.faceDown = true;
   this.div = document.getElementById(divid);
   this.div.style.width = "79px";
   this.div.style.height = "110px";
   var div1 = document.createElement("div");
   this.cardContainer = div1;
   div1.style.position = "relative";
   div1.style.width = "79px";
   div1.style.height = "110px";
   div1.style.left = "0px";
   div1.style.top = "0px";
   this.div.appendChild(div1);
   var cardImg = document.createElement("img");
   this.cardImg = cardImg;
   cardImg.src = "blackjack/cards.png";
   cardImg.style.position = "absolute";
   cardImg.style.width = (79 * 13) + "px";
   cardImg.style.height = (110 * 5) + "px";
   this.setPositionAndClip();
   div1.appendChild(cardImg);
}

DisplayedCard.prototype.setPositionAndClip = function() {
   var left, top;
   if (this.faceDown) {
      left = 2 * 79;
      top = 4 * 110;
   }
   else {
      left = (this.card.value-1) * 79;
      top = (this.card.suit-1) * 110;
   }
   this.cardImg.style.left = "-" + left + "px";
   this.cardImg.style.top = "-" + top + "px";
   this.cardImg.style.clip = "rect(" + top + "px " + (left + 79) + "px "  + 
                                      (top + 110) + "px "  + left + "px)";
}

DisplayedCard.prototype.setCard = function(card) {
   this.card = card;
   this.setPositionAndClip();
}

DisplayedCard.prototype.setFaceDown = function() {
   if (arguments.length == 0)
      this.faceDown = true;
   else
      this.faceDown = Boolean(arguments[0]);
   this.setPositionAndClip();
}

DisplayedCard.prototype.setFaceUp = function() {
   if (arguments.length == 0)
      this.faceDown = false;
   else
      this.faceDown = ! Boolean(arguments[0]);
   this.setPositionAndClip();
}


