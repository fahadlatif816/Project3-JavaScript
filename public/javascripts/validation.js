var approvalList=new Array();
var thapprovalList=new Array();
function textLimit(field) {
	if (field.value.length > 6)
		alert('your input has been truncated!');
	if (field.value.length > 5)
		field.value = field.value.substring(0, 5);
} 
function addRequest(j,i){
	var element =new Array();
	element[0]=j;
	element[1]=i;
	element[2]="";
	approvalList.push(element);	
}
function addthresholdRequest(j){
	var element =new Array();
	element[0]=j;
	element[1]="";
	thapprovalList.push(element);	
}
function approve(j,i){
	
	eval("document.getElementById(\"approve"+j+"_"+i+"\").style.visibility = \"hidden\"");
	eval("document.getElementById(\"disapprove"+j+"_"+i+"\").style.visibility = \"visible\"");
	
	for(count=0;count<approvalList.length;count++){
		if(approvalList[count][0]==j && approvalList[count][1]==i){
			approvalList[count][2]="approve";
			eval("document.missing.in"+j+"_"+i+".value=TrimString(document.getElementById(\"reqIn"+j+"_"+i+"\").innerHTML)");
			eval("document.missing.out"+j+"_"+i+".value=TrimString(document.getElementById(\"reqOut"+j+"_"+i+"\").innerHTML)");
			return;
		}
	}
}
function thapprove(j){
	
	eval("document.getElementById(\"thapprove"+j+"\").style.visibility = \"hidden\"");
	eval("document.getElementById(\"thdisapprove"+j+"\").style.visibility = \"visible\"");
	
	for(count=0;count<thapprovalList.length;count++){
		if(thapprovalList[count][0]==j){
			thapprovalList[count][1]="approve";
			eval("document.missing.threshold"+j+".value=TrimString(document.getElementById(\"threq"+j+"\").innerHTML)");
			eval("document.missing.reason"+j+".value=TrimString(document.getElementById(\"threason"+j+"\").innerHTML)");
			return;
		}
	}
}
function disapprove(j,i){
	eval("document.getElementById(\"disapprove"+j+"_"+i+"\").style.visibility = \"hidden\"");
	eval("document.getElementById(\"approve"+j+"_"+i+"\").style.visibility = \"visible\"");
	
	for(count=0;count<approvalList.length;count++){
		if(approvalList[count][0]==j && approvalList[count][1]==i){
			approvalList[count][2]="disapprove";
			eval("document.missing.in"+j+"_"+i+".value=actualValues[j][i][0]");
			eval("document.missing.out"+j+"_"+i+".value=actualValues[j][i][1]");
			return;
		}
	}
}
function thdisapprove(j,i){
	eval("document.getElementById(\"thdisapprove"+j+"\").style.visibility = \"hidden\"");
	eval("document.getElementById(\"thapprove"+j+"\").style.visibility = \"visible\"");
	
	for(count=0;count<thapprovalList.length;count++){
		if(thapprovalList[count][0]==j){
			thapprovalList[count][1]="disapprove";
			eval("document.missing.threshold"+j+".value=thactualValues[j][0]");
			eval("document.missing.reason"+j+".value=thactualValues[j][1]");
			return;
		}
	}
}
function approveall(){
	for(countall=0;countall<approvalList.length;countall++){
		approve(approvalList[countall][0],approvalList[countall][1]);
	}
	for(thcountall=0;thcountall<thapprovalList.length;thcountall++){
		thapprove(thapprovalList[thcountall][0]);
	}
}

function disapproveall(){
	for(countall=0;countall<approvalList.length;countall++){
		disapprove(approvalList[countall][0],approvalList[countall][1]);
	}
	for(thcountall=0;thcountall<thapprovalList.length;thcountall++){
		thdisapprove(thapprovalList[thcountall][0]);
	}
}

function validate(form,fieldname){
	var field=eval(fieldname+".value");
	if(field==""||field=="-"){
		return true;
	}
	if(field.indexOf(' ',0)!= -1){
		return false;	
	}
	var index=field.indexOf(':',0);
	if(index!= -1){
		try{
			var temp = new Array();
			temp = field.split(':');
			if(isNaN(temp[0])){
				return false;}
			var hours=parseInt(temp[0],10);
			if(!(hours>=0 && hours<=23)){
			 return false;}

			if(isNaN(temp[1])){
				return false;}
			var minutes=parseInt(temp[1],10);
			if(!(minutes>=0 && minutes<=59)){
				return false;
			}
			
			return true;
		}catch(er){
			return false;
		}
	}else{
		try{
			if(isNaN(field)){
				return false;}
			var hours=parseInt(field,10);
			if(hours>=0 && hours<=23){
				eval(fieldname+".value='"+field+":00'");
				return true;
			}else {				return false;}
		}catch(er){
			return false;
		}
	}

}

function validatefields(form){
	var valid=true;
	var recordCount=form.datecount.value;
	for(var j=0;j<recordCount;j++){
		var count1=eval("form.date"+j+".value");
		var count=parseInt(count1.substring(count1.indexOf('|')+1),10)
		for(var i=0;i<count;i++)
		{
			var parameterNameIn="form.in"+j+"_"+i;
			if(validate(form,parameterNameIn)==false){
				document.getElementById("spanIn"+j+"_"+i).innerHTML='*';
				valid = false;
			}
			else{
					document.getElementById("spanIn"+j+"_"+i).innerHTML='';
			}
			var parameterNameOut="form.out"+j+"_"+i;
			if(validate(form,parameterNameOut)==false){
				document.getElementById("spanOut"+j+"_"+i).innerHTML='*';
				valid = false;
			}
			else{
				document.getElementById("spanOut"+j+"_"+i).innerHTML='';
			}
		}
	}
	if(valid==true){
		form.submit();
	} else {
		alert("reenter time marked with *");
		return false;
	}
}

var actualValues =new Array();
var thactualValues =new Array();
function loadArray(form){
	var recCount=form.datecount.value;
	for(var j=0;j<recCount;j++){
		var cnt1=eval("form.date"+j+".value");
		var cnt=parseInt(cnt1.substring(cnt1.indexOf('|')+1),10)
		thactualValues[j]=new Array(2);
			var paramthreshold="form.threshold"+j;
			thactualValues[j][0]=eval(paramthreshold+".value");
			var paramreason="form.reason"+j;
			thactualValues[j][1]=eval(paramreason+".value");
		actualValues[j]=new Array(cnt);
		for(var i=0;i<cnt;i++){
			actualValues[j][i]=new Array(2);
			var parameterNameIn="form.in"+j+"_"+i;
			actualValues[j][i][0]=eval(parameterNameIn+".value");
			var parameterNameOut="form.out"+j+"_"+i;
			actualValues[j][i][1]=eval(parameterNameOut+".value");
		}
	}
}
function getApprovalString(form){

	var apStr="";
	for(f=0;f<approvalList.length;f++){
		if(approvalList[f][2]=="approve" || approvalList[f][2]=="disapprove"){
		eval("apStr += missing.request"+approvalList[f][0]+"_"+approvalList[f][1]+".value");
		apStr +="|";
		}
	}
	apStr+='_';

		for(th=0;th<thapprovalList.length;th++){
//	alert(th+" in for");alert(thapprovalList[th][1]+" value");alert(thapprovalList[th][1]=="disapprove");
if(thapprovalList[th][1]=="approve" || thapprovalList[th][1]=="disapprove"){
//			alert(th+" in if");
		var dateValue=eval("missing.date"+thapprovalList[th][0]+".value");
		var index=dateValue.indexOf("|");
		var date=dateValue.substring(0,index);
		apStr +=date+"|";
		}
	}
//      alert(apStr);
	return apStr;
}
function TrimString(sInString) {
  sInString = sInString.replace( /^\s+/g, "" );// strip leading
  return sInString.replace( /\s+$/g, "" );// strip trailing
}
var threshold = new Array();
function addCount(element){
	threshold.push(element);
}
function thresholdChange(form){
	eval("var thresholdvalue =form.thresholdhrs.value");
	for(f=0;f<threshold.length;f++){
		eval("form.thresholdhrs"+threshold[f]+".value=thresholdvalue");
	}
}
function reasonChange(form){
	eval("var reasonvalue =form.reason.value");
	for(f=0;f<threshold.length;f++){
		eval("form.reason"+threshold[f]+".value=reasonvalue");
	}
}
function decreaseThreshold(form){
	var field=eval('form.thresholdhrs.value');
		if(field==""||field=="-"){
		return ;
	}
	var decvalue =getnewThreshold(form,'form.thresholdhrs.value');
	for(f=0;f<threshold.length;f++){
		var th=getnewThreshold(form,'TrimString(document.getElementById(\"actual"+threshold[f]+"\").innerHTML)');
		eval("form.thresholdhrs"+threshold[f]+".value=cal(\"-\",th,decvalue)");
	}
}
function increaseThreshold(form){
		var field=eval('form.thresholdhrs.value');
		if(field==""||field=="-"){
		return ;
	}
	var decvalue =getnewThreshold(form,'form.thresholdhrs.value');
	for(f=0;f<threshold.length;f++){
		var th=getnewThreshold(form,'TrimString(document.getElementById(\"actual"+threshold[f]+"\").innerHTML)');
		eval("form.thresholdhrs"+threshold[f]+".value=cal(\"+\",th,decvalue)");
	}
}
function getnewThreshold(form,fieldName){
		var field=eval(fieldName);
		var index=field.indexOf(':',0);
		var temp = new Array();
		temp = field.split(':');
		var dhours=parseInt(temp[0],10);
		var dminutes=parseInt(temp[1],10);
		return dhours * 60 +dminutes;
}
function cal(op,th,dec){
	eval("var val="+th +op+dec);
    var minutes = val % 60;
    var hours = Math.floor(val / 60);
    return (hours > 9 ? hours : "0" + hours) + ":" +(minutes > 9 ? minutes : "0" + minutes);
}
function selectall(form,str){
//		alert("form."+str+".checked");
	var value=eval("form."+str+".checked");
//	alert(value);
	for(f=0;f<threshold.length;f++){
		//alert(eval("form."+str+threshold[f]+".checked")+" = "+value);
		eval("form."+str+threshold[f]+".checked="+value);
	}
}
function selected(form){
	for(f=0;f<threshold.length;f++){
		if(eval("form.checkBox"+threshold[f]+".checked")){
			return true;
		}
	}
	alert("No user has been selected to mark threshold change");
	return false;
}
function holidaycheck(count){
	if(eval("compensate.holiday"+count+".checked==true")){
		eval("compensate.workingday"+count+".checked=false");
     	eval("compensate.delete"+count+".checked=false");
	}
}
function workingdaycheck(count){
		if(eval("compensate.workingday"+count+".checked==true")){
		eval("compensate.holiday"+count+".checked=false");
     	eval("compensate.delete"+count+".checked=false");
		}
}
function deletecheck(count){
		if(eval("compensate.delete"+count+".checked==true")){
		eval("compensate.workingday"+count+".checked=false");
     	eval("compensate.holiday"+count+".checked=false");
		}
}
