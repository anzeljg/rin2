

//<![CDATA[

<!--




//CODE FOR HANDLING NAV BUTTONS AND FUNCTION BUTTONS

function FocusAButton(){
	if (document.getElementById('CheckButton1') != null){
		document.getElementById('CheckButton1').focus();
	}
	else{
		if (document.getElementById('CheckButton2') != null){
			document.getElementById('CheckButton2').focus();
		}
		else{
			document.getElementsByTagName('button')[0].focus();
		}
	}
}




//CODE FOR HANDLING DISPLAY OF POPUP FEEDBACK BOX

var topZ = 1000;

function ShowMessage(Feedback){
	var Output = Feedback + '<br /><br />';
	document.getElementById('FeedbackContent').innerHTML = Output;
	var FDiv = document.getElementById('FeedbackDiv');
	topZ++;
	FDiv.style.zIndex = topZ;
	FDiv.style.top = TopSettingWithScrollOffset(30) + 'px';

	FDiv.style.display = 'block';

	ShowElements(false, 'input');
	ShowElements(false, 'select');
	ShowElements(false, 'object');
	ShowElements(true, 'object', 'FeedbackContent');

//Focus the OK button
	setTimeout("document.getElementById('FeedbackOKButton').focus()", 50);
	
//
}

function ShowElements(Show, TagName, ContainerToReverse){
// added third argument to allow objects in the feedback box to appear
//IE bug -- hide all the form elements that will show through the popup
//FF on Mac bug : doesn't redisplay objects whose visibility is set to visible
//unless the object's display property is changed

	//get container object (by Id passed in, or use document otherwise)
	TopNode = document.getElementById(ContainerToReverse);
	var Els;
	if (TopNode != null) {
		Els = TopNode.getElementsByTagName(TagName);
	} else {
		Els = document.getElementsByTagName(TagName);
	}

	for (var i=0; i<Els.length; i++){
		if (TagName == "object") {
			//manipulate object elements in all browsers
			if (Show == true){
				Els[i].style.visibility = 'visible';
			}
			else{
				Els[i].style.visibility = 'hidden';
			}
		} 
	}
}



function HideFeedback(){
	document.getElementById('FeedbackDiv').style.display = 'none';
	ShowElements(true, 'input');
	ShowElements(true, 'select');
	ShowElements(true, 'object');
}


//GENERAL UTILITY FUNCTIONS AND VARIABLES

//PAGE DIMENSION FUNCTIONS
function PageDim(){
//Get the page width and height
	this.W = 600;
	this.H = 400;
	this.W = document.getElementsByTagName('body')[0].offsetWidth;
	this.H = document.getElementsByTagName('body')[0].offsetHeight;
}

var pg = null;

function GetPageXY(El) {
	var XY = {x: 0, y: 0};
	while(El){
		XY.x += El.offsetLeft;
		XY.y += El.offsetTop;
		El = El.offsetParent;
	}
	return XY;
}

function GetScrollTop(){
	if (typeof(window.pageYOffset) == 'number'){
		return window.pageYOffset;
	}
	else{
		if ((document.body)&&(document.body.scrollTop)){
			return document.body.scrollTop;
		}
		else{
			if ((document.documentElement)&&(document.documentElement.scrollTop)){
				return document.documentElement.scrollTop;
			}
			else{
				return 0;
			}
		}
	}
}

function GetViewportHeight(){
	if (typeof window.innerHeight != 'undefined'){
		return window.innerHeight;
	}
	else{
		if (((typeof document.documentElement != 'undefined')&&(typeof document.documentElement.clientHeight !=
     'undefined'))&&(document.documentElement.clientHeight != 0)){
			return document.documentElement.clientHeight;
		}
		else{
			return document.getElementsByTagName('body')[0].clientHeight;
		}
	}
}

function TopSettingWithScrollOffset(TopPercent){
	var T = Math.floor(GetViewportHeight() * (TopPercent/100));
	return GetScrollTop() + T; 
}

//CODE FOR AVOIDING LOSS OF DATA WHEN BACKSPACE KEY INVOKES history.back()
var InTextBox = false;

function SuppressBackspace(e){ 
	if (InTextBox == true){return;}
	thisKey = e.keyCode;

	var Suppress = false;

	if (thisKey == 8) {
		Suppress = true;
		e.preventDefault();
	}
}

window.addEventListener('keypress',SuppressBackspace,false);

function ReduceItems(InArray, ReduceToSize){
	var ItemToDump=0;
	var j=0;
	while (InArray.length > ReduceToSize){
		ItemToDump = Math.floor(InArray.length*Math.random());
		InArray.splice(ItemToDump, 1);
	}
}

function Shuffle(InArray){
	var Num;
	var Temp = new Array();
	var Len = InArray.length;

	var j = Len;

	for (var i=0; i<Len; i++){
		Temp[i] = InArray[i];
	}

	for (i=0; i<Len; i++){
		Num = Math.floor(j  *  Math.random());
		InArray[i] = Temp[Num];

		for (var k=Num; k < (j-1); k++) {
			Temp[k] = Temp[k+1];
		}
		j--;
	}
	return InArray;
}

function WriteToInstructions(Feedback) {
	document.getElementById('InstructionsDiv').innerHTML = Feedback;

}




function EscapeDoubleQuotes(InString){
	return InString.replace(/"/g, '&quot;')
}

function TrimString(InString){
        var x = 0;

        if (InString.length != 0) {
                while ((InString.charAt(InString.length - 1) == '\u0020') || (InString.charAt(InString.length - 1) == '\u000A') || (InString.charAt(InString.length - 1) == '\u000D')){
                        InString = InString.substring(0, InString.length - 1)
                }

                while ((InString.charAt(0) == '\u0020') || (InString.charAt(0) == '\u000A') || (InString.charAt(0) == '\u000D')){
                        InString = InString.substring(1, InString.length)
                }

                while (InString.indexOf('  ') != -1) {
                        x = InString.indexOf('  ')
                        InString = InString.substring(0, x) + InString.substring(x+1, InString.length)
                 }

                return InString;
        }

        else {
                return '';
        }
}

function FindLongest(InArray){
	if (InArray.length < 1){return -1;}

	var Longest = 0;
	for (var i=1; i<InArray.length; i++){
		if (InArray[i].length > InArray[Longest].length){
			Longest = i;
		}
	}
	return Longest;
}

//SELECTION OBJECT FOR TYPING WITH KEYPAD
var selObj = null;
            
SelObj = function(box){
	this.box = box;
	this.selStart = this.box.selectionStart;
	this.selEnd = this.box.selectionEnd;
	this.selText = this.box.value.substring(this.selStart, this.selEnd);
	return this;
}

function setSelText(newText){
	var caretPos = this.selStart + newText.length;
	var newValue = this.box.value.substring(0, this.selStart);
	newValue += newText;
	newValue += this.box.value.substring(this.selEnd, this.box.value.length);
	this.box.value = newValue;
	this.box.setSelectionRange(caretPos, caretPos);
	this.box.focus();
}
SelObj.prototype.setSelText = setSelText;

function setSelSelectionRange(start, end){
	this.box.setSelectionRange(start, end);
}
SelObj.prototype.setSelSelectionRange = setSelSelectionRange;

//UNICODE CHARACTER FUNCTIONS
function IsCombiningDiacritic(CharNum){
	var Result = (((CharNum >= 0x0300)&&(CharNum <= 0x370))||((CharNum >= 0x20d0)&&(CharNum <= 0x20ff)));
	Result = Result || (((CharNum >= 0x3099)&&(CharNum <= 0x309a))||((CharNum >= 0xfe20)&&(CharNum <= 0xfe23)));
	return Result;
}

function IsCJK(CharNum){
	return ((CharNum >= 0x3000)&&(CharNum < 0xd800));
}

//SETUP FUNCTIONS
//BROWSER WILL REFILL TEXT BOXES FROM CACHE IF NOT PREVENTED
function ClearTextBoxes(){
	var NList = document.getElementsByTagName('input');
	for (var i=0; i<NList.length; i++){
		if ((NList[i].id.indexOf('Guess') > -1)||(NList[i].id.indexOf('Gap') > -1)){
			NList[i].value = '';
		}
		if (NList[i].id.indexOf('Chk') > -1){
			NList[i].checked = '';
		}
	}
}







//JQUIZ CORE JAVASCRIPT CODE

var CurrQNum = 0;
var CorrectIndicator = '&#x2714;';
var IncorrectIndicator = '&#x2718;';
var YourScoreIs = 'Rezultat je';

//New for 6.2.2.0
var CompletedSoFar = 'Odgovorjenih vpra&#x0161;anj: ';
var ExerciseCompleted = 'Zaklju&#x010D;ili ste kviz.';
var ShowCompletedSoFar = true;

var ContinuousScoring = true;
var CorrectFirstTime = 'Pravilno odgovorjenih vpra&#x0161;anj v prvem poskusu: ';
var ShowCorrectFirstTime = true;
var ShuffleQs = true;
var ShuffleAs = true;
var DefaultRight = 'Pravilno!';
var DefaultWrong = 'Nepravilno! Poskusite znova.';
var QsToShow = 15;
var Score = 0;
var Finished = false;
var Qs = null;
var QArray = new Array();
var ShowingAllQuestions = false;
var ShowAllQuestionsCaption = 'Poka&#x017E;i vsa vpra&#x0161;anja';
var ShowOneByOneCaption = 'Poka&#x017E;i posamezna vpra&#x0161;anja';
var State = new Array();
var Feedback = '';
var TimeOver = false;
var strInstructions = '';
var Locked = false;

//The following variable can be used to add a message explaining that
//the question is finished, so no further marking will take place.
var strQuestionFinished = '';

function CompleteEmptyFeedback(){
	var QNum, ANum;
	for (QNum=0; QNum<I.length; QNum++){
//Only do this if not multi-select
		if (I[QNum][2] != '3'){
  		for (ANum = 0; ANum<I[QNum][3].length; ANum++){
  			if (I[QNum][3][ANum][1].length < 1){
  				if (I[QNum][3][ANum][2] > 0){
  					I[QNum][3][ANum][1] = DefaultRight;
  				}
  				else{
  					I[QNum][3][ANum][1] = DefaultWrong;
  				}
  			}
  		}
		}
	}
}

function SetUpQuestions(){
	var AList = new Array(); 
	var QList = new Array();
	var i, j;
	Qs = document.getElementById('Questions');
	while (Qs.getElementsByTagName('li').length > 0){
		QList.push(Qs.removeChild(Qs.getElementsByTagName('li')[0]));
	}
	var DumpItem = 0;
	if (QsToShow > QList.length){
		QsToShow = QList.length;
	}
	while (QsToShow < QList.length){
		DumpItem = Math.floor(QList.length*Math.random());
		for (j=DumpItem; j<(QList.length-1); j++){
			QList[j] = QList[j+1];
		}
		QList.length = QList.length-1;
	}
	if (ShuffleQs == true){
		QList = Shuffle(QList);
	}
	if (ShuffleAs == true){
		var As;
		for (var i=0; i<QList.length; i++){
			As = QList[i].getElementsByTagName('ol')[0];
			if (As != null){
  			AList.length = 0;
				while (As.getElementsByTagName('li').length > 0){
					AList.push(As.removeChild(As.getElementsByTagName('li')[0]));
				}
				AList = Shuffle(AList);
				for (j=0; j<AList.length; j++){
					As.appendChild(AList[j]);
				}
			}
		}
	}
	
	for (i=0; i<QList.length; i++){
		Qs.appendChild(QList[i]);
		QArray[QArray.length] = QList[i];
	}

//Show the first item
	QArray[0].style.display = '';
	
//Now hide all except the first item
	for (i=1; i<QArray.length; i++){
		QArray[i].style.display = 'none';
	}		
	SetQNumReadout();
	
	SetFocusToTextbox();
}

function SetFocusToTextbox(){
//if there's a textbox, set the focus in it
	if (QArray[CurrQNum].getElementsByTagName('input')[0] != null){
		QArray[CurrQNum].getElementsByTagName('input')[0].focus();
//and show a keypad if there is one
		if (document.getElementById('CharacterKeypad') != null){
			document.getElementById('CharacterKeypad').style.display = 'block';
		}
	}
	else{
  	if (QArray[CurrQNum].getElementsByTagName('textarea')[0] != null){
  		QArray[CurrQNum].getElementsByTagName('textarea')[0].focus();	
//and show a keypad if there is one
			if (document.getElementById('CharacterKeypad') != null){
				document.getElementById('CharacterKeypad').style.display = 'block';
			}
		}
//This added for 6.0.4.11: hide accented character buttons if no textbox
		else{
			if (document.getElementById('CharacterKeypad') != null){
				document.getElementById('CharacterKeypad').style.display = 'none';
			}
		}
	}
}

function ChangeQ(ChangeBy){
//The following line prevents moving to another question until the current
//question is answered correctly. Uncomment it to enable this behaviour. 
//	if (State[CurrQNum][0] == -1){return;}
	if (((CurrQNum + ChangeBy) < 0)||((CurrQNum + ChangeBy) >= QArray.length)){return;}
	QArray[CurrQNum].style.display = 'none';
	CurrQNum += ChangeBy;
	QArray[CurrQNum].style.display = '';
//Undocumented function added 10/12/2004
	ShowSpecialReadingForQuestion();
	SetQNumReadout();
	SetFocusToTextbox();
}

var HiddenReadingShown = false;
function ShowSpecialReadingForQuestion(){
//Undocumented function for showing specific reading text elements which change with each question
//Added on 10/12/2004
	if (document.getElementById('ReadingDiv') != null){
		if (HiddenReadingShown == true){
			document.getElementById('ReadingDiv').innerHTML = '';
		}
		if (QArray[CurrQNum] != null){
//Fix for 6.0.4.25
			var Children = QArray[CurrQNum].getElementsByTagName('div');
			for (var i=0; i<Children.length; i++){
			if (Children[i].className=="HiddenReading"){
					document.getElementById('ReadingDiv').innerHTML = Children[i].innerHTML;
					HiddenReadingShown = true;
//Hide the ShowAllQuestions button to avoid confusion
					if (document.getElementById('ShowMethodButton') != null){
						document.getElementById('ShowMethodButton').style.display = 'none';
					}
				}
			}	
		}
	}
}

function SetQNumReadout(){
	document.getElementById('QNumReadout').innerHTML = (CurrQNum+1) + ' / ' + QArray.length;
	if ((CurrQNum+1) >= QArray.length){
		if (document.getElementById('NextQButton') != null){
			document.getElementById('NextQButton').style.visibility = 'hidden';
		}
	}
	else{
		if (document.getElementById('NextQButton') != null){
			document.getElementById('NextQButton').style.visibility = 'visible';
		}
	}
	if (CurrQNum <= 0){
		if (document.getElementById('PrevQButton') != null){
			document.getElementById('PrevQButton').style.visibility = 'hidden';
		}
	}
	else{
		if (document.getElementById('PrevQButton') != null){
			document.getElementById('PrevQButton').style.visibility = 'visible';
		}
	}
}

var I=new Array();
I[0]=new Array();I[0][0]=100;
I[0][1]='';
I[0][2]='0';
I[0][3]=new Array();
I[0][3][0]=new Array('Hyperlinks and Text Markup Language','',0,0,1);
I[0][3][1]=new Array('Hyper Text Markup Language','',1,100,1);
I[0][3][2]=new Array('Home Tool Markup Language','',0,0,1);
I[1]=new Array();I[1][0]=100;
I[1][1]='';
I[1][2]='0';
I[1][3]=new Array();
I[1][3][0]=new Array('World Wide Web konzorcij','',1,100,1);
I[1][3][1]=new Array('Microsoft','',0,0,1);
I[1][3][2]=new Array('Google','',0,0,1);
I[1][3][3]=new Array('Apple','',0,0,1);
I[2]=new Array();I[2][0]=100;
I[2][1]='';
I[2][2]='0';
I[2][3]=new Array();
I[2][3][0]=new Array('&lt;head&gt;','',0,0,1);
I[2][3][1]=new Array('&lt;h1&gt;','',1,100,1);
I[2][3][2]=new Array('&lt;h6&gt;','',0,0,1);
I[2][3][3]=new Array('&lt;heading&gt;','',0,0,1);
I[3]=new Array();I[3][0]=100;
I[3][1]='';
I[3][2]='0';
I[3][3]=new Array();
I[3][3][0]=new Array('&lt;b&gt;','',0,0,1);
I[3][3][1]=new Array('&lt;strong&gt;','',1,100,1);
I[3][3][2]=new Array('&lt;important&gt;','',0,0,1);
I[3][3][3]=new Array('&lt;i&gt;','',0,0,1);
I[4]=new Array();I[4][0]=100;
I[4][1]='';
I[4][2]='0';
I[4][3]=new Array();
I[4][3][0]=new Array('&lt;em&gt;','',1,100,1);
I[4][3][1]=new Array('&lt;italic&gt;','',0,0,1);
I[4][3][2]=new Array('&lt;i&gt;','',0,0,1);
I[5]=new Array();I[5][0]=100;
I[5][1]='';
I[5][2]='0';
I[5][3]=new Array();
I[5][3][0]=new Array('&lt;a url="http://www.google.com"&gt;Google&lt;/a&gt;','',0,0,1);
I[5][3][1]=new Array('&lt;a name="http://www.google.com"&gt;Google&lt;/a&gt;','',0,0,1);
I[5][3][2]=new Array('&lt;a&gt;http://www.google.com&lt;/a&gt;','',0,0,1);
I[5][3][3]=new Array('&lt;a href="http://www.google.com"&gt;Google&lt;/a&gt;','',1,100,1);
I[6]=new Array();I[6][0]=100;
I[6][1]='';
I[6][2]='0';
I[6][3]=new Array();
I[6][3][0]=new Array('&lt;a href="url" target="new"&gt;','',0,0,1);
I[6][3][1]=new Array('&lt;a href="url" target="_blank"&gt;','',1,100,1);
I[6][3][2]=new Array('&lt;a href="url" new&gt;','',0,0,1);
I[7]=new Array();I[7][0]=100;
I[7][1]='';
I[7][2]='0';
I[7][3]=new Array();
I[7][3][0]=new Array('&lt;table&gt;&lt;tr&gt;&lt;td&gt;','',1,100,1);
I[7][3][1]=new Array('&lt;table&gt;&lt;head&gt;&lt;tfoot&gt;','',0,0,1);
I[7][3][2]=new Array('&lt;thead&gt;&lt;body&gt;&lt;tr&gt;','',0,0,1);
I[7][3][3]=new Array('&lt;table&gt;&lt;tr&gt;&lt;tt&gt;','',0,0,1);
I[8]=new Array();I[8][0]=100;
I[8][1]='';
I[8][2]='0';
I[8][3]=new Array();
I[8][3][0]=new Array('&lt;lb&gt;','',0,0,1);
I[8][3][1]=new Array('&lt;break&gt;','',0,0,1);
I[8][3][2]=new Array('&lt;br&gt;','',1,100,1);
I[9]=new Array();I[9][0]=100;
I[9][1]='';
I[9][2]='0';
I[9][3]=new Array();
I[9][3][0]=new Array('&lt;list&gt;','',0,0,1);
I[9][3][1]=new Array('&lt;dl&gt;','',0,0,1);
I[9][3][2]=new Array('&lt;ol&gt;','',1,100,1);
I[9][3][3]=new Array('&lt;ul&gt;','',0,0,1);
I[10]=new Array();I[10][0]=100;
I[10][1]='';
I[10][2]='0';
I[10][3]=new Array();
I[10][3][0]=new Array('&lt;list&gt;','',0,0,1);
I[10][3][1]=new Array('&lt;dl&gt;','',0,0,1);
I[10][3][2]=new Array('&lt;ol&gt;','',0,0,1);
I[10][3][3]=new Array('&lt;ul&gt;','',1,100,1);
I[11]=new Array();I[11][0]=100;
I[11][1]='';
I[11][2]='0';
I[11][3]=new Array();
I[11][3][0]=new Array('&lt;img src="slika.png" alt="Moja slika"&gt;','',1,100,1);
I[11][3][1]=new Array('&lt;img href="slika.png" alt="Moja slika"&gt;','',0,0,1);
I[11][3][2]=new Array('&lt;image src="slika.png" alt="Moja slika"&gt;','',0,0,1);
I[11][3][3]=new Array('&lt;img alt="Moja slika"&gt;slika.png&lt;/img&gt;','',0,0,1);
I[12]=new Array();I[12][0]=100;
I[12][1]='';
I[12][2]='0';
I[12][3]=new Array();
I[12][3][0]=new Array('&lt;body style="background-image:url(ozadje.png)"&gt;','',1,100,1);
I[12][3][1]=new Array('&lt;background img="ozadje.png"&gt;','',0,0,1);
I[12][3][2]=new Array('&lt;body bg="ozadje.png"&gt;','',0,0,1);
I[13]=new Array();I[13][0]=100;
I[13][1]='';
I[13][2]='0';
I[13][3]=new Array();
I[13][3][0]=new Array('Pravilno','',1,100,1);
I[13][3][1]=new Array('Nepravilno','',0,0,1);
I[14]=new Array();I[14][0]=100;
I[14][1]='';
I[14][2]='0';
I[14][3]=new Array();
I[14][3][0]=new Array('&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 5.0//EN" "http://www.w3.org/TR/html5/strict.dtd"&gt;','',0,0,1);
I[14][3][1]=new Array('&lt;!DOCTYPE HTML5&gt;','',0,0,1);
I[14][3][2]=new Array('&lt;!DOCTYPE html&gt;','',1,100,1);


function StartUp(){

//If there's only one question, no need for question navigation controls
	if (QsToShow < 2){
		document.getElementById('QNav').style.display = 'none';
	}
	
//Stash the instructions so they can be redisplayed
	strInstructions = document.getElementById('InstructionsDiv').innerHTML;
	

	

	

	
	CompleteEmptyFeedback();

	SetUpQuestions();
	ClearTextBoxes();
	CreateStatusArray();
	

	
//Check search string for q parameter
	if (document.location.search.length > 0){
		if (ShuffleQs == false){
			var JumpTo = parseInt(document.location.search.substring(1,document.location.search.length))-1;
			if (JumpTo <= QsToShow){
				ChangeQ(JumpTo);
			}
		}
	}
//Undocumented function added 10/12/2004
	ShowSpecialReadingForQuestion();
}

function ShowHideQuestions(){
	document.getElementById('ShowMethodButton').style.display = 'none';
	if (ShowingAllQuestions == false){
		for (var i=0; i<QArray.length; i++){
				QArray[i].style.display = '';
			}
		document.getElementById('Questions').style.listStyleType = 'decimal';
		document.getElementById('OneByOneReadout').style.display = 'none';
		document.getElementById('ShowMethodButton').innerHTML = ShowOneByOneCaption;
		ShowingAllQuestions = true;
	}
	else{
		for (var i=0; i<QArray.length; i++){
				if (i != CurrQNum){
					QArray[i].style.display = 'none';
				}
			}
		document.getElementById('Questions').style.listStyleType = 'none';
		document.getElementById('OneByOneReadout').style.display = '';
		document.getElementById('ShowMethodButton').innerHTML = ShowAllQuestionsCaption;
		ShowingAllQuestions = false;	
	}
	document.getElementById('ShowMethodButton').style.display = 'inline';
}

function CreateStatusArray(){
	var QNum, ANum;
//For each item in the item array
	for (QNum=0; QNum<I.length; QNum++){
//Check if the question still exists (hasn't been nuked by showing a random selection)
		if (document.getElementById('Q_' + QNum) != null){
			State[QNum] = new Array();
			State[QNum][0] = -1; //Score for this q; -1 shows question not done yet
			State[QNum][1] = new Array(); //answers
			for (ANum = 0; ANum<I[QNum][3].length; ANum++){
				State[QNum][1][ANum] = 0; //answer not chosen yet; when chosen, will store its position in the series of choices
			}
			State[QNum][2] = 0; //tries at this q so far
			State[QNum][3] = 0; //incrementing percent-correct values of selected answers
			State[QNum][4] = 0; //penalties incurred for hints
			State[QNum][5] = ''; //Sequence of answers chosen by number
		}
		else{
			State[QNum] = null;
		}
	}
}



function CheckMCAnswer(QNum, ANum, Btn){
//if question doesn't exist, bail
	if (State[QNum].length < 1){return;}
	
//Get the feedback
	Feedback = I[QNum][3][ANum][1];
	
//Now show feedback and bail if question already complete
	if (State[QNum][0] > -1){
//Add an extra message explaining that the question
// is finished if defined by the user
		if (strQuestionFinished.length > 0){Feedback += '<br />' + strQuestionFinished;}
//Show the feedback
		ShowMessage(Feedback);
//New for 6.2.2.1: If you want to mark an answer as correct even when it's the final choice, uncomment this line.
//		if (I[QNum][3][ANum][2] >= 1){Btn.innerHTML = CorrectIndicator;}else{Btn.innerHTML = IncorrectIndicator;}	
		return;
	}
	
//Hide the button while processing
	Btn.style.display = 'none';

//Increment the number of tries
	State[QNum][2]++;
	
//Add the percent-correct value of this answer
	State[QNum][3] += I[QNum][3][ANum][3];
	
//Store the try number in the answer part of the State array, for tracking purposes
	State[QNum][1][ANum] = State[QNum][2];
	if (State[QNum][5].length > 0){State[QNum][5] += ' | ';}
	State[QNum][5] += String.fromCharCode(65+ANum);
	
//Should this answer be accepted as correct?
	if (I[QNum][3][ANum][2] < 1){
//It's wrong

//Mark the answer
		Btn.innerHTML = IncorrectIndicator;
		
//Remove any previous score unless exercise is finished (6.0.3.8+)
		if (Finished == false){
			WriteToInstructions(strInstructions);
		}	
		
//Check whether this leaves just one MC answer unselected, in which case the Q is terminated
		var RemainingAnswer = FinalAnswer(QNum);
		if (RemainingAnswer > -1){
//Behave as if the last answer had been selected, but give no credit for it
//Increment the number of tries
			State[QNum][2]++;		
		
//Calculate the score for this question
			CalculateMCQuestionScore(QNum);
			
//Get the overall score and add it to the feedback
			CalculateOverallScore();
//New for 6.2.2.1
			var QsDone = CheckQuestionsCompleted();
			if ((ContinuousScoring == true)||(Finished == true)){
				Feedback += '<br />' + YourScoreIs + ' ' + Score + '%.' + '<br />' + QsDone;
				WriteToInstructions(YourScoreIs + ' ' + Score + '%.' + '<br />' + QsDone);
			}
			else{
				WriteToInstructions(QsDone);
			}
		}
	}
	else{
//It's right
//Mark the answer
		Btn.innerHTML = CorrectIndicator;
				
//Calculate the score for this question
		CalculateMCQuestionScore(QNum);
		
//New for 6.2.2.0
		var QsDone = CheckQuestionsCompleted();

//Get the overall score and add it to the feedback
		if (ContinuousScoring == true){
			CalculateOverallScore();
			if ((ContinuousScoring == true)||(Finished == true)){
				Feedback += '<br />' + YourScoreIs + ' ' + Score + '%.' + '<br />' + QsDone;
				WriteToInstructions(YourScoreIs + ' ' + Score + '%.' + '<br />' + QsDone);
			}
		}
		else{
			WriteToInstructions(QsDone);
		}
	}
	
//Show the button again
	Btn.style.display = 'inline';
	
//Finally, show the feedback	
	ShowMessage(Feedback);
	
//Check whether all questions are now done
	CheckFinished();
}

function CalculateMCQuestionScore(QNum){
	var Tries = State[QNum][2] + State[QNum][4]; //include tries and hint penalties
	var PercentCorrect = State[QNum][3];
	var TotAns = GetTotalMCAnswers(QNum);
	var HintPenalties = State[QNum][4];
	
//Make sure it's not already complete

	if (State[QNum][0] < 0){
//Allow for Hybrids
		if (HintPenalties >= 1){
			State[QNum][0] = 0;
		}
		else{
//This line calculates the score for this question
			if (TotAns == 1){
				State[QNum][0] = 1;
			}
			else{
				State[QNum][0] = ((TotAns-((Tries*100)/State[QNum][3]))/(TotAns-1));
			}
		}
//Fix for Safari bug added for version 6.0.3.42 (negative infinity problem)
		if ((State[QNum][0] < 0)||(State[QNum][0] == Number.NEGATIVE_INFINITY)){
			State[QNum][0] = 0;
		}
	}
}

function GetTotalMCAnswers(QNum){
	var Result = 0;
	for (var ANum=0; ANum<I[QNum][3].length; ANum++){
		if (I[QNum][3][ANum][4] == 1){ //This is an MC answer
			Result++;
		}
	}
	return Result;
}

function FinalAnswer(QNum){
	var UnchosenAnswers = 0;
	var FinalAnswer = -1;
	for (var ANum=0; ANum<I[QNum][3].length; ANum++){
		if (I[QNum][3][ANum][4] == 1){ //This is an MC answer
			if (State[QNum][1][ANum] < 1){ //This answer hasn't been chosen yet
				UnchosenAnswers++;
				FinalAnswer = ANum;
			}
		}
	}
	if (UnchosenAnswers == 1){
		return FinalAnswer;
	}
	else{
		return -1;
	}
}





function CalculateOverallScore(){
	var TotalWeighting = 0;
	var TotalScore = 0;
	
	for (var QNum=0; QNum<State.length; QNum++){
		if (State[QNum] != null){
			if (State[QNum][0] > -1){
				TotalWeighting += I[QNum][0];
				TotalScore += (I[QNum][0] * State[QNum][0]);
			}
		}
	}
	if (TotalWeighting > 0){
		Score = Math.floor((TotalScore/TotalWeighting)*100);
	}
	else{
//if TotalWeighting is 0, no questions so far have any value, so 
//no penalty should be shown.
		Score = 100; 
	}
}

//New for 6.2.2.0
function CheckQuestionsCompleted(){
	if (ShowCompletedSoFar == false){return '';}
	var QsCompleted = 0;
	for (var QNum=0; QNum<State.length; QNum++){
		if (State[QNum] != null){
			if (State[QNum][0] >= 0){
				QsCompleted++;
			}
		}
	}
//Fixes for 6.2.2.2
	if (QsCompleted >= QArray.length){
		return ExerciseCompleted;
	}
	else{
		return CompletedSoFar + ' ' + QsCompleted + '/' + QArray.length + '.';
	}
}

function CheckFinished(){
	var FB = '';
	var AllDone = true;
	for (var QNum=0; QNum<State.length; QNum++){
		if (State[QNum] != null){
			if (State[QNum][0] < 0){
				AllDone = false;
			}
		}
	}
	if (AllDone == true){
	
//Report final score and submit if necessary
		CalculateOverallScore();
		FB = YourScoreIs + ' ' + Score + '%.';
		if (ShowCorrectFirstTime == true){
			var CFT = 0;
			for (QNum=0; QNum<State.length; QNum++){
				if (State[QNum] != null){
					if (State[QNum][0] >= 1){
						CFT++;
					}
				}
			}
			FB += '<br />' + CorrectFirstTime + ' ' + CFT + '/' + QsToShow;
		}
		
//New for 6.2.2.0
		FB += '<br />' + ExerciseCompleted;
		
		WriteToInstructions(FB);
		
		Finished == true;




		TimeOver = true;
		Locked = true;
		


		Finished = true;
		Detail = '<?xml version="1.0"?><hpnetresult><fields>';
		for (QNum=0; QNum<State.length; QNum++){
			if (State[QNum] != null){
				if (State[QNum][5].length > 0){
					Detail += '<field><fieldname>Question #' + (QNum+1) + '</fieldname><fieldtype>question-tracking</fieldtype><fieldlabel>Q ' + (QNum+1) + '</fieldlabel><fieldlabelid>QuestionTrackingField</fieldlabelid><fielddata>' + State[QNum][5] + '</fielddata></field>';
				}
			}
		}
		Detail += '</fields></hpnetresult>';
	}

}










//-->

//]]>


