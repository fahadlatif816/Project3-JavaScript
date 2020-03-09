function Validate(formname)
{

if(formname.fromMissing.value==""||formname.toMissing.value=="")
{
alert("Please select date and time to mark missing entry.");
return false;
}else
{
return true;
}
}

function disable(){
document.markattendance.timein.disabled=true;
document.markattendance.timeout.disabled=true;
}
function hidediv(str) {

if (document.getElementById) { // DOM3 = IE5, NS6
	if(str=="missingdiv"){
		document.getElementById('hidem').style.display = 'none';
		document.getElementById('showm').style.display = 'block';
	}else{
		document.getElementById('hidet').style.display = 'none';
		document.getElementById('showt').style.display = 'block';
	}
		document.getElementById(str).style.display = 'none';
}
}

function showdiv(str) {

if (document.getElementById) { // DOM3 = IE5, NS6
	if(str=="missingdiv"){
		document.getElementById('hidem').style.display = 'block';
		document.getElementById('showm').style.display = 'none';
	}else{
		document.getElementById('hidet').style.display = 'block';
		document.getElementById('showt').style.display = 'none';
	}
//	alert(str);
//		eval("document.getElementById(\""+str+"\").style.display = \"block\"");
//		eval("document.getElementById(\"showm\").style.visibility = \"hidden\"");
		document.getElementById(str).style.display = 'block';
}
}