
var debug = false;
unicodeHeavyCheckMark = String.fromCharCode(0x2714);
unicodeHeavyBallotX = String.fromCharCode(0x2718);

// returns random index between 0 and n-1
function randomIndex(n) {
  return Math.floor(Math.random()*n);
}

function radixFromDesc(radix) {
  var whichWay = randomIndex(2); // returns either 0 or 1

  if (whichWay == 0) {
    return "osnove " + radix;
  }
	  
  switch(radix) {
	case 2: return "dvojiškega";
    case 8: return "osmiškega";
	case 10: return "desetiškega";
    case 16: return "šestnajstiškega";
	default: return "osnove " + radix;
  }

}

function radixToDesc(radix) {
  var whichWay = randomIndex(2); // returns either 0 or 1

  if (whichWay == 0) {
    return "osnovo " + radix;
  }
	  
  switch(radix) {
	case 2: return "dvojiško";
    case 8: return "osmiško";
	case 10: return "desetiško";
    case 16: return "šestnajstiško";
	default: return "osnovo " + radix;
  }

}

// returns random index between 0 and n-1
function randomIntBetween(minVal, maxVal) {
  if (minVal > maxVal) {
	alert("problem in randomIntBetween function");
  }
  var numIntsInRange = maxVal - minVal + 1;
  return Math.floor(Math.random() * numIntsInRange) + minVal;
}

// return a name to use for a form for question i
function formForQuestion(i) {
  return("formForQuestion" + i);
}


function buildQuiz(numQuestions) {    
  
  var theQuizQuestionsDivElement = document.getElementById("theQuizQuestions");

  // print an error and stop if there is no div element
  if (!theQuizQuestionsDivElement) {
    window.alert("Could not find an element with id: " + "theQuizQuestions");
    return;
  }

  var theQuizQuestions = "";
  var i;
  var conversions = [
    {fromRad: 10, toRad: 2, minVal: 0, maxVal: 255},
    {fromRad: 2, toRad: 10, minVal: 0, maxVal: 255},
    {fromRad: 2, toRad: 8, minVal: 0, maxVal: 511 },
    {fromRad: 8, toRad: 2, minVal: 0, maxVal: 63 },
    {fromRad: 2, toRad: 16, minVal: 0, maxVal: 65535},
    {fromRad: 16, toRad: 2, minVal: 0, maxVal: 65535}
  ]

  theQuizQuestions += "<table>\n"
  for (i = 1; i<=numQuestions; i++) { // index counts up 0, 1, 2, etc through the array
    var whichConversion =  randomIndex(conversions.length);
	var numToConvert = randomIntBetween(conversions[whichConversion].minVal,
	                                    conversions[whichConversion].maxVal);

    theQuizQuestions += "<tr>\n"

    // the question number (add one to index)
    //theQuizQuestions += "<td style='vertical-align:top; height:45px;'>\u279c&nbsp;&nbsp;</td>\n"
    theQuizQuestions += "<td style='vertical-align:top; height:45px; width:5%;'>" +
	                    "<span class='fa fa-long-arrow-right'></span>&nbsp;&nbsp;</td>\n"

    // the question text and code
    theQuizQuestions += "<td style='vertical-align:top; height:45px; width:50%;'>\n"
    theQuizQuestions += "Pretvori "
    var fromRad = conversions[whichConversion].fromRad;
	var toRad = conversions[whichConversion].toRad;
	theQuizQuestions += formatFor(numToConvert.toString(fromRad), fromRad, toRad);
	theQuizQuestions += "<br />iz " + radixFromDesc(fromRad) +
	                    " v " + radixToDesc(toRad);
    theQuizQuestions += "</td>\n"

    var answer = formatFor(numToConvert.toString(toRad), toRad, fromRad);
    theQuizQuestions += "<td style='width:45%;'>" + turnAnswerIntoFormElement(formForQuestion(i), answer) + "</td>";
    theQuizQuestions += "</tr>\n"
  }

  theQuizQuestions += "</table>\n"

  // when you add the text to the innerHTML, it must ALREADY BE well-formed
  // HTML with properly nested tags; otherwise, the browser may not process
  // it properly.
  if (debug) {
    window.alert(theQuizQuestions);
  }

  theQuizQuestionsDivElement.innerHTML = theQuizQuestions;
}

function turnAnswerIntoFormElement(formName, correct) {
  // form all the HTML in a variable called formElement then add it
  // all at once.
  var formElement = "";
  formElement += "<form name='" + formName + "' action=''>\n";

  // cellpadding leaves room for the border that we put around correct
  // answer to not interfere with the answer text itself
  var idOfQuestionControl = questionControlID(formName);

  formElement += "<div class='input-group' id='" + idOfQuestionControl + "'>";
  formElement += makeResponseInputTextElement(formName);
  formElement += makeCheckAnswerButton(formName, correct);
  formElement += "</div>\n"; // end of question control div element

  formElement += "</form>\n";
  return formElement;
}

function questionControlID(formName) {
  return formName + "questionControl";
}

function responseFieldName(formName) {
  return formName + "Response";
}

function makeResponseInputTextElement(formName) {
  return ("<input type='text' class='form-control' name='" +
          responseFieldName(formName) + "' id='" +
		  responseFieldName(formName) + "' value='' size='16' />"); 
}

function makeCheckAnswerButton(formName, correct) {
  return ("<span class='input-group-btn'><button class='btn btn-info' name='" +
          formName + "button' " + " onclick='checkAnswer(\"" + correct + "\", \"" +
		  formName + "\");'><span class='fa fa-question'></span></button></span>"); 
}

function checkAnswer(answer, formName) {
  var answerElem = window.document.getElementById(responseFieldName(formName));
  var questionControlDivElem = window.document.getElementById(questionControlID(formName));
  var usersAnswer = answerElem.value;
  var userGotItRight = (usersAnswer == answer);
 
  if (debug) {
    window.alert("The correct answer is " + answer +
                 "\nThe user's answer is " + usersAnswer);
  }

  questionControlDivElem.innerHTML = 
    "Odgovor: " + usersAnswer +
    "<br />Pravilno: " + answer;
}

function showAnswer(answerElemId, answer) {
  var answerElem = document.getElementById(answerElemId);
  answerElem.innerHTML = answer;
}
