
var submitcount=0;

function UR_Start() 
{
	UR_Nu = new Date;
	UR_Indhold = showFilled(UR_Nu.getHours()) + ":" + showFilled(UR_Nu.getMinutes()) + ":" + showFilled(UR_Nu.getSeconds());
	document.getElementById("currenttime").innerHTML = UR_Indhold;
	setTimeout("UR_Start()",1000);
}
function showFilled(Value) 
{
	return (Value > 9) ? "" + Value : "0" + Value;
}

function submitOnceCheck() {                       

   if (submitcount == 0)
      {
      submitcount++;
      return true;
      }
   else
      {
      alert("This form has already been submitted.  Thanks!");
      return false;
      }
}


