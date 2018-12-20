
var debug = false;
unicodeHeavyCheckMark = String.fromCharCode(0x2714);
unicodeHeavyBallotX = String.fromCharCode(0x2718);

// returns random index between 0 and n-1
function randomIndex(n) {
  return Math.floor(Math.random()*n);
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
    /* VGA */
    {width: 640, height: 480, bitDepth: 4},
    {width: 640, height: 480, bitDepth: 8},
	/* SVGA */
    {width: 800, height: 600, bitDepth: 4},
    {width: 800, height: 600, bitDepth: 8},
	/* XGA */
    {width: 1024, height: 768, bitDepth: 8},
    {width: 1024, height: 768, bitDepth: 16},
	/* HD (720p) */
    {width: 1280, height: 720, bitDepth: 24},
	/* WXGA */
    {width: 1280, height: 800, bitDepth: 24},
	/* SXGA */
    {width: 1280, height: 1024, bitDepth: 24},
	/* WXGA+ */
    {width: 1440, height: 900, bitDepth: 24},
	/* UXGA */
    {width: 1600, height: 1200, bitDepth: 24},
	/* Full HD (1080) */
    {width: 1920, height: 1080, bitDepth: 24},
  ]

  theQuizQuestions += "<table>\n"
  for (i = 1; i<=numQuestions; i++) { // index counts up 0, 1, 2, etc through the array
    var whichConversion =  randomIndex(conversions.length);

    theQuizQuestions += "<tr>\n"

    // the question number (add one to index)
    theQuizQuestions += "<td style='vertical-align:top; height:45px; width:5%;'>" +
	                    "<span class='fa fa-long-arrow-right'></span>&nbsp;&nbsp;</td>\n"

    // the question text and code
    var width  = conversions[whichConversion].width;
	var height = conversions[whichConversion].height;
	var depth  = conversions[whichConversion].bitDepth;
    theQuizQuestions += "<td style='vertical-align:top; height:45px; width:50%;'>\n"
    theQuizQuestions += "Velikost: " 
	theQuizQuestions += width + "×" + height + " pikslov"
	theQuizQuestions += "<br />Bitna globina: " + depth + ((depth > 4) ? " bitov" : " biti");;
    theQuizQuestions += "</td>\n"

    var answer = width * height * depth;
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
    window.alert("Pravilni odgovor je " + answer +
                 "\nUporabnikov odgovor je " + usersAnswer);
  }

  questionControlDivElem.innerHTML = 
    "Odgovor: " + usersAnswer +
    "<br />Pravilno: " + answer;
}

function showAnswer(answerElemId, answer) {
  var answerElem = document.getElementById(answerElemId);
  answerElem.innerHTML = answer;
}
