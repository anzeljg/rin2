function report(s)
{
 // Comment out only one of the following lines

  //  window.alert(s);   // in browser, use window.alert(s) or document.write(s)
	window.document.write("<pre>" + s + "</pre>");
 // print(s);   // for command line javascript, use print(s) 
}

function checkExpect(check,expect)
{
  try {
    result = eval(check);
    if (result==expect) {
      report("Test case " + check + " passed! (result: " + result + ")");
   }  else {
      report("Test case " + check + " FAILED: expected: " + expect 
                                  + " result: " + result);
     } // else
  } catch (err) {
    report("Test case " + check + 
          " FAILED: an error occurred: ");
    for (var i in err) report (i + ' = ' + err[i]); //  all properties of err
    report("NOTE: If a syntax error is reported on 'line 12', for example, and line 12 is the line where the eval function appears, this may be actually a syntax error in the argument to check, and not an error in the JavaScript source at line 12 of this file'");

    }
}


function spaceAndZeroFillBinary(s,n)
{

  s = s + ""; // converts to string if it came in as a number

  if (typeof(s) != "string")
    s = "";

  if (typeof(n) != "number")
    n=4;

  var len = s.length; 
  if (len <=  n)
      return nZeros(n-len) + s;
  else
     {
       lenFirstPart = len-n; 

//print('len=' +len);
//print('len=' + n);
//print('lenFirstPart =' +lenFirstPart);

       var firstPart = s.substring(0,lenFirstPart);
       var secondPart = s.substring(lenFirstPart,len);
 
//print('firstPart=' + firstPart);
//print('secondPart=' + secondPart);

     return spaceAndZeroFillBinary(firstPart,n) + " " + secondPart;
     }


}

function nZeros(n)
{
   if (n<=0) 
     return "";
   else
     return "0" + nZeros(n-1);
}

function formatFor(s,radix,otherRadix)
{
   if (radix!=2)
     return s;

   if (otherRadix==8)
     return spaceAndZeroFillBinary(s,3);
 
   return spaceAndZeroFillBinary(s,4);
   
}

function testCases()
{
   checkExpect('nZeros(0)','');
   checkExpect('nZeros(1)','0');
   checkExpect('nZeros(3)','000');
   checkExpect('nZeros(4)','0000');

   checkExpect('spaceAndZeroFillBinary("00000000",4)',"0000 0000")
   checkExpect('spaceAndZeroFillBinary("1",4)',"0001")
   checkExpect('spaceAndZeroFillBinary("1",3)',"001")
   checkExpect('spaceAndZeroFillBinary("101",3)',"101")
   checkExpect('spaceAndZeroFillBinary("001",3)',"001")
   checkExpect('spaceAndZeroFillBinary("001",4)',"0001")
   checkExpect('spaceAndZeroFillBinary("1001",3)',"001 001")
   checkExpect('spaceAndZeroFillBinary("foo","bar")',"0foo")
   checkExpect('spaceAndZeroFillBinary(1111,3)',"001 111")

   checkExpect('formatFor(1111,2,8)','001 111');
   checkExpect('formatFor(1111,2,10)','1111');
   checkExpect('formatFor(111,10,2)','111');
   checkExpect('formatFor(11,8,2)','11');
   

}

// testCases();
