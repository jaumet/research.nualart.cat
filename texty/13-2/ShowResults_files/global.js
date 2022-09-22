
// Global
var myRemote;
var navURL;
var myNavPopup;
var mainEditor;

iens6=document.all||document.getElementById
ns4=document.layers

<!--GLOBAL VARIABLES-->
var thename
var theobj
var thetext
var winHeight
var winPositionFromTop
var winWidth
var startH=2
var openTimer
var scrollSpeed=30
var CURSOR_POS = 0;
var ON_DIV_MENU_ITEM = false;
<!--END GLOBAL VARIABLES-->

var description=new Array()

  
function launch(newURL, newName, newFeatures, orgName) {
remote = open(newURL, newName, newFeatures);
  if (remote.opener == null)
    remote.opener = window;

  remote.opener.name = orgName;
  return remote;
}

function openWindow(loc) {
  var winl = (screen.width-750)/2;
  var wint = (screen.height-640)/2;

  myRemote = launch(loc,"FreeSurveys1","height=640,width=750,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0,top="+wint + ",left=" + winl,"Help");
  window.myRemote.focus();  
}

function openPreview(loc) {
  var winl = (screen.width-800)/2;
  var wint = (screen.height-640)/2;

  myRemote = launch(loc,"FreeSurveys1","height=640,width=800,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0,top="+wint + ",left=" + winl,"Help");
  window.myRemote.focus();  
}

function openLargeWindow(loc) {
  var winl = (screen.width-1024)/2;
  var wint = (screen.height-640)/2;

  myRemote = launch(loc,"FreeSurveys1","height=640,width=1024,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0,top="+wint + ",left=" + winl,"Help");
  window.myRemote.focus();  
}

function openWindowWithMenu(loc) {
  var winl = (screen.width-750)/2;
  var wint = (screen.height-640)/2;
  myRemote = launch(loc,"WindowWithMenu","height=640,width=800,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=1,resizable=1,scrollbars=1,status=0,toolbar=1,top="+wint+",left="+winl,"Help");
  window.myRemote.focus();  
}


function openSlideShow(loc) {
  myRemote = launch(loc,"SlideShow1","height=640,width=800,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0","Help");
  window.myRemote.focus();  
}

function miniPopup(loc) {
  var winl = (screen.width-450)/2;
  var wint = (screen.height-300)/2;

  myRemote = launch(loc,"FreeSurveys2","height=300,width=450,channelmode=0,dependent=0,directories=0,fullscreen=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0,top=" + wint + ",left=" + winl,"Help");
  window.myRemote.focus();  
}


function gotoLoc (loc) {
  var winl = (screen.width-640)/2;
  var wint = (screen.height-750)/2;

  myRemote = launch(loc,"FreeSurveys","height=640,width=750,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0,top=" + wint + ",left=" + winl,"Help");
  window.myRemote.focus();
}

function helpWindow(loc) {
  var winl = (screen.width-640)/2;
  var wint = (screen.height-700)/2;

  myRemote = launch(loc,"FreeSurveys3","height=640,width=700,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0,top=" + wint + ",left=" + winl,"Help");
  window.myRemote.focus();
}


function addQuestion(form , base) {
   base += "?location=";
   base += form.location.options[form.location.selectedIndex].value;
   base += "&questionCategory=";
   base += form.questionCategory.options[form.questionCategory.selectedIndex].value;

   gotoLoc(base);
}


function refreshForm(form) {
    opener.document.forms[form].submit();
    window.close();
}

function refreshBuilder() {
    opener.document.DummyForm.submit();
    window.close();
}



function refreshLocation(loc) {
  if (opener && opener.document) {
    opener.document.location=loc;
    window.close();
  } else {
    document.location=loc;
  }
}

function refreshLocationWithAlert(loc, msg) {
  opener.document.location=loc;
  alert(msg);
  window.close();
}


function openWindowConditionalAlert(loc, condition, falseMessage) {
  if(condition == "true" ) {
    openWindow(loc);        
  } else {
    alert(falseMessage);
  }
}

function openPreviewConditionalAlert(loc, condition, falseMessage) {
  if(condition == "true" ) {
    openPreview(loc);        
  } else {
    alert(falseMessage);
  }
}


function closeWindow() {
  window.close();
}

function refreshAdmin() {
  refreshLocation('showUpdate.do');
}

function refreshList() {
  refreshLocation('listSurveys.do');
}

function deleteWindow (loc) {
    if (confirm("Are You Sure ?")) {
        document.location = loc;
    }
}

function confirmDelete(loc, message) {
    if (confirm(message)) {
        document.location = loc;        
    }
}

function DropDownMenu(entered) {
  with (entered) {
  ref=options[selectedIndex].value;
  document.location=ref;
  }
}


function DropDownMenuWithPrefix(prefix, entered) {
  ref=entered.options[entered.selectedIndex].value;
  prefix += ref;
  document.location=prefix;
}

function DropDownMenuWithPrefixPopup(prefix, entered) {
  if (entered.selectedIndex > 0) {
    ref = entered.options[entered.selectedIndex].value;
    prefix += ref;
    gotoLoc(prefix);
  }
}


function SetChecked(val) {
  dml=document.form[0];
  len = dml.elements.length;
  var i=0;
  for( i=0 ; i<len ; i++) {
    if (dml.elements[i].name=='questionID') {
      dml.elements[i].checked=val;
    }
  }
}


function lookupAndClose(elementName, value) {
    opener.document.forms[0].elements[elementName].value = value;
    window.close();
}

function lookupDivAndClose(elementName, value, divId) {
    opener.document.forms[0].elements[elementName].value = value;
    var divElement = opener.document.getElementById(divId);
    divElement.innerHTML = value;
    window.close();
}

function transferValueFromPopUp(openerFormName, openerFormElementName, value, loc) {
        
        loc += "&overrideStylesheet=";
        loc += value;

        top.frames["main"].document.location = loc;
        top.opener.document.forms[openerFormName].elements[openerFormElementName].value = value;
}

function gotoTopFrame(loc) {
  if (top != self) {
    // We are in a frame
    top.location = loc;
  } else {
    document.location = loc;
  }
}


function printFrame() {
    parent.frames[1].focus();
    parent.frames[1].print(); 
}

function loadFrame(url) {
    parent.frames[1].document.location = url;
}

function loadTop(url) {
    parent.document.location = url;
}


function goBack() {
  window.history.go(-1);
}

function setCookie(name, value) {
  var expFromNow = 60*24*60*60*1000;  // Expires in 60 Days
  var exp = new Date(); 
  exp.setTime(exp.getTime() + expFromNow);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}


function getCookie(Name) 
{
        var search = Name + "="   
        if (document.cookie.length > 0) 
        { 
                offset = document.cookie.indexOf(search);
                if (offset != -1) //DOES COOKIE EXIST
                { 
                        offset += search.length;
                        end = document.cookie.indexOf(";", offset);
                        if (end == -1);
                                end = document.cookie.length;
                        end = offset + 1; //SINCE THE VALUE IS 0, IT HAS A LENGTH OF 1
                        return unescape(document.cookie.substring(offset, end));
                }    
        }
}

function checkForNotNull(field, message){
	txt = field.value;	
	if(txt == null || txt.length < 1){
		alert(message);
		return false;
	}
	else{
		return true;		
	}

}


function logSiteRef() {
  var siteRef;          
  var loc = document.location.href;
  index = loc.indexOf("siteRef=");
  if ( index >= 0) {
    siteRef=loc.substring(index+8);
    setCookie("siteRef", siteRef);        
  }
}

function closeFrame() {
  top.document.location=top.frames['main'].location;
}

function processAlerts(str){
	alert(str);
}


function modifyText(id, text) {
        if(document.getElementById && text != '') {
          obj = document.getElementById(id);
          obj.innerHTML = text;
        }
}

function modifyTextNoCheck(id, text) {
        if(document.getElementById) {
          obj = document.getElementById(id);
          obj.innerHTML = text;
        }
}

function microPollOptionModifyDivColor (id, selectBox, customColorField) {
        for (i=1; i > 0; i++) {
                var idStr = id+"_"+i;
                if(document.getElementById(idStr)) {
                        modifyDivColor(idStr, selectBox, customColorField);
                } else {
                        break;
                }
        }
}

function modifyDivColor(id, selectBox, customColorField) {
        if (document.getElementById) {
           obj = document.getElementById(id);
           if (selectBox.selectedIndex >= 0) {
             var selectedValue = selectBox.options[selectBox.selectedIndex].value;
             if (selectedValue == "-1") {
                selectedValue = customColorField.value;
             }

             obj.style.color = selectedValue;
           }
        }
}

function modifyDivBackgroundColor(id, selectBox, customColorField) {
        if (document.getElementById) {
           obj = document.getElementById(id);
           if (selectBox.selectedIndex >= 0) {
             var selectedValue = selectBox.options[selectBox.selectedIndex].value;
             if (selectedValue == "-1") {
                selectedValue = customColorField.value;
             }

             //obj.style.color = selectedValue;
               obj.style.backgroundColor = selectedValue;
           }
        }
}

function modifyDivBorderColor(id, selectBox, customColorField) {
        if (document.getElementById) {
           obj = document.getElementById(id);
           if (selectBox.selectedIndex >= 0) {
             var selectedValue = selectBox.options[selectBox.selectedIndex].value;
             if (selectedValue == "-1") {
                selectedValue = customColorField.value;
             }

             obj.style.borderColor = selectedValue;
           }
        }
}

function modifyTableBorderColor(id, selectBox, customColorField) {
        if (document.getElementById) {
           obj = document.getElementById(id);
           if (selectBox.selectedIndex >= 0) {
             var selectedValue = selectBox.options[selectBox.selectedIndex].value;
             if (selectedValue == "-1") {
                selectedValue = customColorField.value;
             }

             obj.style.borderColor = selectedValue;
           }
        }
}

function changeTextClass(id, stylesheetClass) {
        if(document.getElementById) {        
          obj = document.getElementById(id);
          obj.className=stylesheetClass;
        }        
}

function changeDualTextClass(id1, id2, stylesheetClass1, stylesheetClass2) {
        changeTextClass(id1, stylesheetClass1);
        changeTextClass(id2, stylesheetClass2);
}



function printLocation(loc) {
  myRemote = launch(loc,"FreeSurveys1","height=700,width=600,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=1,status=0,toolbar=0","Help");
  window.myRemote.focus();  
  if (window.print) {
    window.print();
  }

}

function deliverWebPage(appURL) {
  var url = appURL + "?url=" + document.location;
  miniPopup(url);
}

function replace(string,text,by) {
// Replaces text with by in string
    var strLength = string.length, txtLength = text.length;
    if ((strLength == 0) || (txtLength == 0)) return string;

    var i = string.indexOf(text);
    if ((!i) && (text != string.substring(0,txtLength))) return string;
    if (i == -1) return string;

    var newstr = string.substring(0,i) + by;

    if (i+txtLength < strLength)
        newstr += replace(string.substring(i+txtLength,strLength),text,by);

    return newstr;
}

function getSel() {
	if (document.getSelection) txt = document.getSelection();
	else if (document.selection) txt = document.selection.createRange().text;
	else return;
        
        return txt;
}


function checkSelection(typeVal) {
  mySelection = getSel();
  if (mySelection) {
        document.forms[0].decorationType.value = typeVal;
        document.forms[0].decorationValue.value = mySelection;
        document.forms[0].submit();
  } else {
        alert ("Please Select Text and then Click on the Icon");
  }
}

function changeMode(form, value) {
  form.singleDisplayMode.value = value;
  form.changeQuestionType.value = "true";
  form.submit();
}



function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_nbGroup(event, grpName) { //v3.0
  var i,img,nbArr,args=MM_nbGroup.arguments;
  if (event == "init" && args.length > 2) {
    if ((img = MM_findObj(args[2])) != null && !img.MM_init) {
      img.MM_init = true; img.MM_up = args[3]; img.MM_dn = img.src;
      if ((nbArr = document[grpName]) == null) nbArr = document[grpName] = new Array();
      nbArr[nbArr.length] = img;
      for (i=4; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
        if (!img.MM_up) img.MM_up = img.src;
        img.src = img.MM_dn = args[i+1];
        nbArr[nbArr.length] = img;
    } }
  } else if (event == "over") {
    document.MM_nbOver = nbArr = new Array();
    for (i=1; i < args.length-1; i+=3) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = (img.MM_dn && args[i+2]) ? args[i+2] : args[i+1];
      nbArr[nbArr.length] = img;
    }
  } else if (event == "out" ) {
    for (i=0; i < document.MM_nbOver.length; i++) {
      img = document.MM_nbOver[i]; img.src = (img.MM_dn) ? img.MM_dn : img.MM_up; }
  } else if (event == "down") {
    if ((nbArr = document[grpName]) != null)
      for (i=0; i < nbArr.length; i++) { img=nbArr[i]; img.src = img.MM_up; img.MM_dn = 0; }
    document[grpName] = nbArr = new Array();
    for (i=2; i < args.length-1; i+=2) if ((img = MM_findObj(args[i])) != null) {
      if (!img.MM_up) img.MM_up = img.src;
      img.src = img.MM_dn = args[i+1];
      nbArr[nbArr.length] = img;
  }
 }
}


function applyText(val, control) {
  control.value = val;
}


function warnForInactivity(expiryTimeInMinutes) {
  alert ("Your Session Will Expire in " + expiryTimeInMinutes + " minutes due to Inactivity. Please Respond to the Survey!");
}


function openURLWithAlert(alertMessage, url) {
  alert(alertMessage);
  document.location = url;
}


function submitAction(form, name, value) {
  form.elements[name].value = value;
  form.submit();
}

function showCollapse(id) {
  showCollapseFade(null, id);
}

function showCollapseFade(linkNode, id) {
        if(document.getElementById) {
          var signID = id + "_sign";

          obj = document.getElementById(id);
          if (obj.style.display == 'inline' || obj.style.display == "block") {
            if (linkNode) {
              dojo.lfx.html.implode(obj, document.getElementById(linkNode), 200).play();
            } else {
              obj.style.display='none';
            }
            if (document.getElementById(signID)) {
		  document.images[signID].src='http://informationr.net/images/plus.gif';
            }
	       
          } else {
            if (linkNode) {
              dojo.lfx.html.explode(document.getElementById(linkNode), obj, 200).play();
            } else {
              obj.style.display='inline';        
            }
            if (document.getElementById(signID)) {
		  document.images[signID].src='http://informationr.net/images/minus.gif';
            }
		  
          }

        }
}


function showCollapseBlock(id) {
        if(document.getElementById) {
          obj = document.getElementById(id);
          if (obj.style.display == 'block') {
            obj.style.display='none';
	       
          } else {
            obj.style.display='block';        
          }
        }
}


function showCollapseConditional(val, comparison, id) {      
      if(document.getElementById) {
          obj = document.getElementById(id);
          if (val == comparison) {
            obj.style.display='inline';        
          } else {
            obj.style.display='none';
          }
      }
}

function showMultiDiv(maxOptionIndex, selectElement, divPrefix) {
      if(document.getElementById) {
          // First Hide all the DIVS
          for (i = 0; i < maxOptionIndex; ++i) {
            elementId = divPrefix + i;
            obj = document.getElementById(elementId);
            if (obj && obj != null) {
                obj.style.display='none';
            }
          }
          elementId = divPrefix + selectElement.value;      
          obj = document.getElementById(elementId);
          if (obj && obj != null) {
            obj.style.display='inline';  
          }
      }
}

function showMultiDivIndex(maxOptionIndex, selectElement, divPrefix) {
      if(document.getElementById) {
          // First Hide all the DIVS
          for (i = 0; i < maxOptionIndex; ++i) {
            elementId = divPrefix + i;
            obj = document.getElementById(elementId);
            if (obj && obj != null) {
                obj.style.display='none';
            }
          }
          elementId = divPrefix + selectElement.selectedIndex;
          obj = document.getElementById(elementId);
          if (obj && obj != null) {
            obj.style.display='inline';  
          }
      }
}

function showCollapseConditional1(val, questionDiv, ansDiv, ansStr, questionStr) {

 	if(document.getElementById) {
		qObj = document.getElementById(questionDiv);
		aObj = document.getElementById(ansDiv);
	  	if(val != -1) {
			document.getElementById(questionDiv).innerHTML = questionStr;
			document.getElementById(ansDiv).innerHTML = ansStr;
			qObj.style.display='inline';	          	
			aObj.style.display='inline';	          	
	  	}else{
			qObj.style.display='none';
			aObj.style.display='none';
	  	}
      	}
}

function showCollapseConditionalCheckbox(checkboxElement, id) {    
      if(document.getElementById) {
          obj = document.getElementById(id);
          if (checkboxElement.checked) {
            obj.style.display='';        
          } else {
            obj.style.display='none';
          }
      }
}

function rolloverDiv(tableRow, inout, divid) {
  if (document.getElementById) {
        var obj = document.getElementById(divid);
        if (obj) {
          if (inout) {
            obj.style.display='block';
          } else {
            obj.style.display='none';
          }
        }
  }
  if (tableRow) {
        if (inout) {
          tableRow.style.background='#ffc';
        } else {
          tableRow.style.background='#fff';
        }
  }
}


function rolloverHighlight(element, inout, hColor) {
  if (element) {
        if (inout) {
                element.style.background=hColor;
        } else {
                element.style.background="";
        }
  }
}

function fillSelectList(selectInput, targetSelectBox, myArray) {
  var target = selectInput.form.elements[targetSelectBox];
        
  while(target.options.length) {
        target.options[0] = null;
  }

  var arr = myArray[selectInput.selectedIndex];

  for(i = 0; i < arr.length; ++i) {
        target.options[i] = arr[i];
  }

}

function showHelp(selectInput, sourceDivId) {
        if (selectInput.selectedIndex >= 0) {
                var index = selectInput.selectedIndex;
                docLocation = "/help/" + selectInput.options[index].value + "-ajax.html";
                ajaxInlinePopup(sourceDivId, docLocation);
        }
}

function enableTextbox(textBox, checkBoxState){	
	if(checkBoxState==true){
		textBox.disabled=false;
	}       
	else{   
		textBox.disabled=true;
	}       
}

function insertRowDisplayTag(textBox, checkBoxState){

	var str = textBox.value;

	
	if(checkBoxState==true && str.indexOf("<display=row>") < 0){
		textBox.value = str+ "\r\n\r\n\r\n" +
				"<display=row>";
        }
        else if(str.indexOf("<display=row>") >= 0 && checkBoxState==false){
        	sindex = str.indexOf("<display=row>");
		str = str.substring(0,sindex) + 
			str.substring(sindex+"<display=row>".length +1, str.length);
		textBox.value = str;
        }

}


function populateConversionSurveys(url){
	document.location = url
}

function openSmallWindow (loc) {
  myRemote = launch(loc,"FreeSurveys","height=100,width=250,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=1,scrollbars=0,status=0,toolbar=0","Help");
  window.myRemote.focus();
}


function navPopup(id, title, itemTitle, itemURL, itemPopup) {
   var mye,mye2,menu;
   var open=0;
   // Set the navURL;
   navURL = itemURL;
   myNavPopup = itemPopup;

   var startx=0,starty=0;
   if (!id || id == "") {
        id = 0;
   }

   if ((mye = document.getElementById(id)) == null) return;


   for(var p = mye; p && p.tagName!='BODY'; p = p.offsetParent){
      startx += p.offsetLeft;
      starty += p.offsetTop;
   }

   if ((mye2 = document.getElementById("navcontrol_title")) == null) return;
   mye2.innerHTML = title;

   if ((menu = document.getElementById("navcontrol")) == null) return;
   menu.style.left = (startx-3)+"px";
   menu.style.top  = (starty-3)+"px";

   
   for (i = 0; i < itemTitle.length; ++i) {
        mye = document.getElementById("navcontrol_" + i);
        if (mye == null) {
          return;
        }
        mye.innerHTML = itemTitle[i];

        mye2 = document.getElementById("navcontrol_" + i + "_row");
        if (mye2 == null) {
          return;
        }
        mye2.style.display = "";
   }


   menu.style.display="";
   return;
}

function navClick(optionNumber) {
  if (navURL != null && optionNumber < navURL.length) {
    if (myNavPopup != null && optionNumber < myNavPopup.length) {
        if (myNavPopup[optionNumber]) {
                navClose();
                gotoLoc(navURL[optionNumber]);
                return;
        }
    }
    document.location = navURL[optionNumber];
  }
}


function navClose() {
  var mye2;
  if ((mye2 = document.getElementById("navcontrol")) == null) return;
  mye2.style.display="none";
}

function clearExistingData(mForm) {

  for (i=0; i < mForm.action.length; i++) {
    if (mForm.action[i].checked) {
       if(i == 1){
         delConfirm(mForm);
       } else {
         mForm.submit();
       }
     }
  }

}

function delConfirm(mForm){

        retVal = confirm("Once data is deleted there is no way to recover it.\r\n"+
                        "Are you sure you want to delete the data?");
        if(retVal == true){
                mForm.submit();
        }

}

function runningTotal(ary, outputDiv, validationTotal){

	var formObj = document.forms['run'];
	if(formObj == null){
		formObj= document.forms[2];
	}

	if (formObj.elements == null ){
		return;
	}
	var total=0;
	var filledBoxes =0;

	for (i=0; i<ary.length; i++){

                if (formObj.elements[ary[i]]) {
        		val = formObj.elements[ary[i]].value;
	        	if(!isNaN(val) && val.length>0){
		        		total += parseInt(val)
			        	filledBoxes++;
		        }
                }
	}


	if (filledBoxes == ary.length-1){

		for (i=0; i<ary.length; i++){
                        if (formObj.elements[ary[i]]) {
        			val = formObj.elements[ary[i]].value;
	        		if(isNaN(val) || val.length ==0){
		        		formObj.elements[ary[i]].value = (validationTotal-total) +"";
			        	total = validationTotal;
				        break;
			        }
                        }
		}
	}

	document.getElementById(outputDiv).innerHTML = "" + total;

}

function intValidation(val){

	for(i =0; i < val.length; i++){
		if(isNaN(val.charAt(i)+"")){			
			return false;
		}
	}
	return true;

}

function cSumIntValidation(textBox){

	if(!intValidation(textBox.value)){
		alert("Please enter a numeric value as Constant Sum Value");
		textBox.focus();
	}

}

function ajaxSubmitFormObjectAction(divID, url, htmlForm, evaluateJS, elementName, val) {
  htmlForm.elements[elementName].value = val;
  ajaxSubmitFormObjectFinal(divID, url, htmlForm, evaluateJS);
}

function ajaxSubmitForm(divID, url, formName) {
  var htmlForm = document.forms[formName];
  return ajaxSubmitFormObject(divID, url, htmlForm);
}
function ajaxSubmitFormObject(divID, url, htmlForm) {
  return ajaxSubmitFormObjectFinal(divID, url, htmlForm, false);
        
}

function ajaxSubmitFormObjectFinal(divID, url, htmlForm, evaluateJS) {
  var container = document.getElementById(divID);
  if (container && htmlForm) {
        // Sanity Check Passed
        dojo.io.bind({
            url: url,
            content: {
                ajax: true,
                engine: 'dojo',
                evaluateJS:evaluateJS
            },
            formNode: htmlForm,
            load: function(type, data) {
                if (evaluateJS) {
                  eval(data);
                  container.innerHTML = "";
                } else {
                  container.innerHTML = data;
                }
            },
            encoding: "utf8"
        });
        container.innerHTML = '<div align="center"><img src="http://informationr.net/images/ajax.gif"><br/>Processing</div>';
  } else {
    alert("Container or Form Not Found");
  }


  return false;
}



function ajaxDeleteRow(rowID, url, identifierValue) {
  container = document.getElementById(rowID);
  if (confirm("Are you sure?") && container) { 
    dojo.io.bind({
        url: url,
        content: {
            ajax:true,
            engine: 'dojo',
            id:identifierValue
        },
        load:function(type, data, event) {
          container.parentNode.deleteRow(container.rowIndex);
        }
    });
    // Update the Status Containter
    statusSpan = document.getElementById("status_" + identifierValue);
    if (statusSpan) {
        statusSpan.innerHTML = '<img src="http://informationr.net/images/ajax.gif">';
    }
  }
}

function ajaxFormValidation(divID, url, htmlForm) {

  var container = document.getElementById(divID);
  if (container && htmlForm) {
        dojo.io.bind({
            url: url,
            content: {
                ajax: true,
                engine: 'dojo'
            },
            formNode: htmlForm,
            load: function(type, data) {
                eval(data);
            }
        });
        container.innerHTML = '<div align="center"><img src="http://informationr.net/images/ajax.gif"><br/>Validation in processs..</div>';
  }

}



function ajaxAddTableRowForm(tableID, formDiv, htmlForm, url) {
        
  container = document.getElementById(tableID);
  if (container) {
        dojo.io.bind (
           {  url: url,
              content: {
                ajax:true, 
                engine: 'dojo'
              },
              formNode: htmlForm,
              load:function(type, data, event) {
                addTableRow (tableID, data);
              }
           }
        );  
        formDiv.innerHTML = 'Processing...';
  }       
               
}

function addTableRow(tableID, data) {
        
   var tableRef = document.getElementById(tableID);
   var newRow   = tableRef.insertRow(tableRef.rows.length);

   eval(data);

   for (i=0; i < tableRow.length; i++) {        
        var newCell  = newRow.insertCell(i);
        var newText  = document.createTextNode(tableRow[i]);
        newCell.appendChild(newText);
   }       
           
}

//Sorry, cant make this function generic
function updateQuickPollAnswers (tableID, data) {

        var answerTable = document.getElementById(tableID);        
        var ary = new Array();
        ary = data.split("\n");
        var aryLen = 0;
        
        for (i=0; i < (answerTable.rows.length); i++) {
                answerTable.deleteRow(i);
        }

        for (i=0; i < ary.length; i++) {
                if (ary[i].length > 0) {
                        var newRow = answerTable.insertRow(i);
                        col1 = newRow.insertCell(0);
                        col2 = newRow.insertCell(1);
                        col2.style.fontSize = "8pt";
                                                
                        col1.innerHTML = "<input type=\"radio\" name=\"u_quickPoll\" value=\""+(i+1)+"\">";
                        col2.innerHTML = " " + ary[i];
                        aryLen++;
                }
        }       

        for (i = answerTable.rows.length -1; i >= aryLen; i--) {
                answerTable.deleteRow(i);
        }

}

//Sorry, cant make this function generic
function cyopDummyResults (tableID, data) {

        var answerTable = document.getElementById(tableID);
        var ary = new Array();
        ary = data.split("\n");
        var aryLen = 0;
        var tableRowCode = "<TR><TD style=\"font-size:8pt;\"> {option_text} </TD></TR>" +
                           "<TR><TD>" +
                           "<TABLE cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\">" +
                           "<TR><TD bgcolor=\"#606060\" width=\"{percent_value}%\" height=\"10\"></TD>" +
                           "<TD width=\"{remander_percent_value}%\" height=\"10\" style=\"border:0; font-size: 8px; font-family:Tahoma;\">" +
                           "&nbsp;{percent_value}% "+
                           "</TD></TR>" +
                           "</TABLE>" +
                           "</TD></TR>";
 
           
        
        for (i=0; i < (answerTable.rows.length); i++) {
                answerTable.deleteRow(i);
        }

        var newRow = answerTable.insertRow(0);
        col1 = newRow.insertCell(0);
        var colData =  "<TABLE STYLE=\"font-family: Tahoma; font-size: 8.5pt;\" width=\"180\">";

        for (i=0; i < ary.length; i++) {
                if (ary[i].length > 0) {
                        var percentValue = Math.floor(Math.random()*70);        
                        var str = tableRowCode.replace(/\{option_text\}/g , ary[i]);
                        str = str.replace(/\{percent_value\}/g, percentValue.toString());
                        str = str.replace(/\{remander_percent_value\}/g, (100 - percentValue).toString());
                        colData += str;
                }
        }
        colData += "<TR><TD align=\"right\" class=\"special\" style=\"font-size:7pt;\"></TD></TR>";
        colData += "</TABLE>";
        col1.innerHTML = colData;        
        for (i = answerTable.rows.length -1; i > 0; i--) {
                answerTable.deleteRow(i);
        }

}


function updateMicroPollAnswersDropDown (tableID, data, styleClass) {

        var answerTable = document.getElementById(tableID);
        var ary = new Array();
        ary = data.split("\n");
        var aryLen = 0;
        var selectMenu = "<select name=\"mpDropDown\" class=\"" + styleClass  + "\">\n";
        var opt = "<option value=\"dummy\">${opt_text}</option>";

        for (i=0; i < (answerTable.rows.length); i++) {
                answerTable.deleteRow(i);
        }

        for (i=0; i < ary.length; i++) {
                if (ary[i].length > 0) {
                        tmp = opt.replace("${opt_text}", ary[i]);
                        selectMenu += "\n" + tmp + "\n";
                        aryLen++;
                }
        }

        selectMenu += "</select>";
        //alert(selectMenu);
        var newRow = answerTable.insertRow(0);
        col1 = newRow.insertCell(0);
        col2 = newRow.insertCell(1);
        col2.style.fontSize = "8pt";

        col1.innerHTML = " ";
        col2.innerHTML = "<div class=\""+styleClass+"\">" + selectMenu + "</div>";


        for (i = answerTable.rows.length -1; i > 0; i--) {
                answerTable.deleteRow(i);
        }

        
}

function updateMicroPollAnswers (tableID, data, styleClass, inputType) {
        
        //alert(inputType);
        if (inputType == 2) {
                updateMicroPollAnswersDropDown (tableID, data, styleClass);
                return;
        }
        var inputTypeStr = (inputType == 0 ? "radio" : "checkbox");
        //alert(inputTypeStr);
        var answerTable = document.getElementById(tableID);
        var ary = new Array();
        ary = data.split("\n");
        var aryLen = 0;

        for (i=0; i < (answerTable.rows.length); i++) {
                answerTable.deleteRow(i);
        }

        for (i=0; i < ary.length; i++) {
                if (ary[i].length > 0) {
                        var newRow = answerTable.insertRow(i);
                        col1 = newRow.insertCell(0);
                        col2 = newRow.insertCell(1);
                        col2.style.fontSize = "8pt";

                        col1.innerHTML = "<input type=\"" + inputTypeStr  + "\" name=\"u_quickPoll\" value=\""+(i+1)+"\">";
                        col2.innerHTML = "<div class=\""+styleClass+"\" id=\"mp_option_view_" + (i+1) + "\">" + ary[i] + "</div>";
                        aryLen++;
                }
        }
        for (i = answerTable.rows.length -1; i >= aryLen; i--) {
                answerTable.deleteRow(i);
        }

}



function ajaxInlinePopup(id, url) {
  if (isInternetExplorer()) {
      hideSeeThroughElements();
  }
  container = document.getElementById('shadowedBox');
  dataContainer = document.getElementById('shadowedBoxBody');
  linkNode = document.getElementById(id);

  if (container && linkNode) {
        dojo.io.bind({
                url:url,
                content: {
                        ajax:true,
                        engine: 'dojo'
                },
                load:function(type, data, event) {
                        dataContainer.innerHTML = data;
                },
                error:function(type, error) {
                        alert("Error : " + error);
                }
        });

        // Update the Status Container
        dataContainer.innerHTML = '<img src="http://informationr.net/images/ajax.gif">';
        container.style.left=220;
        container.style.top=100 + document.body.scrollTop;
        dojo.lfx.html.explode(linkNode, container, 200).play();
  } else {
        if (container) {
          // Link Node Not Found
          alert("Link Node : " + id + " Not Found");
        } else {
          alert('Inline Popup Container Not Found');
        }
  }
}

function ajaxLinkConfirm(divID, url, text) {
  if (confirm(text)) {
        ajaxLink(divID, url);
  }
}

function ajaxLinkTab(tabIndexClass, divID, url) {
  var tabbedMenu = document.getElementById('TabbedMenu');
  if (tabbedMenu) {
    tabbedMenu.className = tabIndexClass;
    ajaxLink(divID, url);
  } else {
    alert('TabbedMenu Div Not Found');
  }
}

function ajaxLink(divID, url) {
  var mycontainer = document.getElementById(divID);
  dojo.io.bind({
        url: url,
        content: {
            ajax:true,
            engine: 'dojo'
        },
        load:function(type, data, event) {
          mycontainer.innerHTML = data;
        }
  });
  // Update the Status Container
  mycontainer.innerHTML = '<img src="http://informationr.net/images/ajax.gif">';
}

function ajaxLinkForControl(controlID, url) {
    ajaxLinkForControl1(document.getElementById(controlID), url, true);
}

function ajaxLinkForControl1(mycontainer, url, append) {
    //var mycontainer = document.getElementById(controlID);
  dojo.io.bind({
        url: url,
        content: {
            ajax:true,
            engine: 'dojo'
        },
        load:function(type, data, event) {
              mycontainer.value = stringTrim(data) + (append ? mycontainer.value.replace(/Please wait\.\.\./i,""): "");
        }
  });
  // Update the Status Container
  mycontainer.value = 'Please wait...' + mycontainer.value;
}

//container is passed in. 
function ajaxLink1(container, url) {
  dojo.io.bind({
        url: url,
        content: {
            ajax:true,
            engine: 'dojo'
        },
        load:function(type, data, event) {
          container.innerHTML = data;
        }
  });
  // Update the Status Container
  container.innerHTML = '<img src="http://informationr.net/images/ajax.gif">';
}

//Same as ajaxLink except we do an eval on the returned data
function ajaxLink2(divID, url) {
  container = document.getElementById(divID);
  dojo.io.bind({
        url: url,
        content: {
            ajax:true,
            engine: 'dojo'
        },
        load:function(type, data, event) {
                eval(data);
        }
  });
  // Update the Status Container
  container.innerHTML = '<img src="http://informationr.net/images/ajax.gif">';
}


//Same as ajaxLink except we do a silent call (no gif image progressbar)
function ajaxLinkSilent(divID, url) {
  container = document.getElementById(divID);
  dojo.io.bind({
        url: url,
        content: {
            ajax:true,
            engine: 'dojo'
        },
        load:function(type, data, event) {
          container.innerHTML = data;
        }
  });
}


function preAjax() {
        var statusMessageDiv = document.getElementById("promptMessage");
        if (statusMessageDiv) {
            statusMessageDiv.innerHTML = 'Processing...';
        }
}

function ajaxCall0(url, params) {
        preAjax();
        ajaxEngine.registerRequest('AjaxCall', url);
        ajaxEngine.registerAjaxElement('promptMessage');
        ajaxEngine.sendRequest('AjaxCall', 'ajax=true', params);  
}
function ajaxCall(url, params, div) {
        preAjax();
        if (document.getElementById(div)) {
                ajaxEngine.registerRequest('AjaxCall', url);
                ajaxEngine.registerAjaxElement(div);
                ajaxEngine.registerAjaxElement('promptMessage');
                ajaxEngine.sendRequest('AjaxCall', 'ajax=true', params);  
        }
}

function ajaxCall2(url, param1, param2, div) {
        preAjax();
        if (document.getElementById(div)) {
                ajaxEngine.registerRequest('AjaxCall', url);
                ajaxEngine.registerAjaxElement(div);
                ajaxEngine.sendRequest('AjaxCall', 'ajax=true', param1, param2);  
        }
}


function  refreshBuilderGoToSection(loc,secID){
	goToSection(loc,secID);
}

function goToSection(loc,secID){
        loc = loc + "?xrnd=" + Math.random() + "#" + secID;
        window.opener.location = loc;
}


function showSelectedQuestionContentInDiv(mnu,dispDiv){

        var qIDDiv = 1;
        mnuOptions = mnu.options;

        for(var i=1; i< mnuOptions.length; i++){
                if(mnuOptions[i].selected){
                        qIDDiv = (mnuOptions[i].value);
                }
        }

        if(qIDDiv==1){
                qIDDiv = mnuOptions[0].value;
        }
        divObj = document.getElementById(dispDiv);
        document.getElementById(dispDiv).innerHTML = document.getElementById(qIDDiv+"").innerHTML
        divObj.style.display='inline';

}


function openPreviewMultiLingual(){

        var loc = "{"+document.location+"}";

        if(loc.indexOf("surveyconsole") > 0) {
                loc = "http://www.surveyconsole.com/userimages/1630/Multi_Lingual_Surveys.html";
        } else {
                loc = "http://www.questionpro.com/akira/TakeSurvey?id=231362&amp;responseCheck=false";
        }

        openPreview(loc);
        

}

function checkSelection (mnu, invalidVal, submitFrm) {

        var val = mnu[mnu.selectedIndex].value;

        if (val == invalidVal) {
                alert("Please select a valid option");
        } else {
                submitFrm.submit();
        }


}

function setObj(text,theswitch,inwidth,inheight) {
        thetext=text
        if(iens6){
                thename = "viewer"
                theobj=document.getElementById? document.getElementById(thename):document.all.thename
                winHeight=100
                        if(iens6&&document.all) {
                                winPositionFromTop=document.body.clientHeight
                                winWidth=(document.body.clientWidth-document.body.leftMargin)
                        }
                        if(iens6&&!document.all) {
                                winPositionFromTop=window.innerHeight
                                winWidth=(window.innerWidth-(document.body.offsetLeft+30))
                        }
                        if(theswitch=="override") {
                                winWidth=inwidth
                                winHeight=inheight
                        }
                theobj.style.width=winWidth
                theobj.style.height=startH
                        if(iens6&&document.all) {
                                theobj.style.top=document.body.scrollTop+winPositionFromTop
                                theobj.innerHTML = ""
                                theobj.insertAdjacentHTML("BeforeEnd","<table cellspacing=0 width="+winWidth+" height="+winHeight+" border=1><tr><td width=100% valign=top class=popupText>"+thetext+"</td></tr></table>")
                        }
                        if(iens6&&!document.all) {
                                theobj.style.top=window.pageYOffset+winPositionFromTop
                                theobj.innerHTML = ""
                                theobj.innerHTML="<table cellspacing=0 width="+winWidth+" height="+winHeight+" border=1><tr><td width=100% valign=top class=popupText>"+thetext+"</td></tr></table>"
                        }
        }
        if(ns4){
                thename = "nsviewer"
                theobj = eval("document."+thename)
                winPositionFromTop=window.innerHeight
                winWidth=window.innerWidth
                winHeight=100
                        if(theswitch=="override") {
                                winWidth=inwidth
                                winHeight=inheight
                        }
                theobj.moveTo(0,eval(window.pageYOffset+winPositionFromTop))
                theobj.width=winWidth
                theobj.clip.width=winWidth
                theobj.document.write("<table cellspacing=0 width="+winWidth+" height="+winHeight+" border=1><tr><td width=100% valign=top class=popupText>"+thetext+"</td></tr></table>")
                theobj.document.close()
        }
        viewIt()
}

function viewIt() {
        if(startH<=winHeight) {
                if(iens6) {
                        theobj.style.visibility="visible"
                                if(iens6&&document.all) {
                                        theobj.style.top=(document.body.scrollTop+winPositionFromTop)-startH
                                }
                                if(iens6&&!document.all) {
                                        theobj.style.top=(window.pageYOffset+winPositionFromTop)-startH
                                }
                        theobj.style.height=startH
                        startH+=2
                        openTimer=setTimeout("viewIt()",scrollSpeed)
                }
                if(ns4) {
                        theobj.visibility = "visible"
                        theobj.moveTo(0,(eval(window.pageYOffset+winPositionFromTop)-startH))
                        theobj.height=startH
                        theobj.clip.height=(startH)
                        startH+=2
                        openTimer=setTimeout("viewIt()",scrollSpeed)
                }
        }else{
                clearTimeout(openTimer)
        }
}

function stopIt() {
        if(iens6) {
                theobj.innerHTML = ""
                theobj.style.visibility="hidden"
                startH=2
        }
        if(ns4) {
                theobj.document.write("")
                theobj.document.close()
                theobj.visibility="hidden"
                theobj.width=0
                theobj.height=0
                theobj.clip.width=0
                theobj.clip.height=0
                startH=2
        }
}

function openMicroPoll (loc) {       
        win = open(loc,"pollWin", "width=500,height=350");        
}

function popupForm(formObject, baseURL) {
  // Submits a Form on a new Popup Window
  baseURL += "?";
        
  for (i = 0; i < formObject.elements.length; ++i) {
    baseURL += (formObject.elements[i].name + "=" + escape(formObject.elements[i].value) + "&");
  }
  gotoLoc(baseURL);
}

function checkSpamCompliance (actn, submitForm, popupURL) {

     if (submitForm.spamCompliance.checked) {
          if (actn == "upload" ) {
              submitForm.submit();
          } else  {
              miniPopup(popupURL);
          }
     } else {
         alert("Please read and check the SPAM Compliance Policy check-box");
     }

}

function checkboxSubmit(checkboxControl,  message) {
  if (checkboxControl.checked) {
        checkboxControl.form.submit();
  } else {
        alert(message);
  }
}

function modifyMicroPollProgressBarColor (sudoID, selectBox, customColorField, threeD) {
         
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if (selectedValue == "-1") {
                selectedValue = customColorField.value;
        }

        for (i=1; i > 0; i++) {
                var id = sudoID+"_"+i;
                if (document.getElementById(id)) {
                        if (threeD) {
                              selectedValue = selectedValue.toLowerCase().replace(/#/g, "");
                              modifyTableCellBackgroundImage(id, "/images/micropoll/chart/chart_"+selectedValue+".gif", 0,0);
                        } else {
                              modifyTableCellBackgroundColor(id, selectedValue, 0,0);
                        }
                } else {
                        break;
                }
        }
}

function modifyTableCellBackgroundColor (id, customColor, rowIndex, colIndex) {

        if (document.getElementById(id)) {
           obj = document.getElementById(id).rows[rowIndex].cells;
           tableCell = obj[colIndex];
           tableCell.style.backgroundImage="";
           tableCell.style.backgroundColor = customColor;
           //bgColor = customColor;
        }
}

function modifyTableCellBackgroundImage (id, imgSrc , rowIndex, colIndex) {
        //alert(imgSrc);
        if (document.getElementById(id)) {
           obj = document.getElementById(id).rows[rowIndex].cells;
           tableCell = obj[colIndex];
           tableCell.style.backgroundColor="";
           tableCell.style.backgroundImage="url('" + imgSrc + "')";
           tableCell.style.backgroundRepeat="repeat-x";
           tableCell.style.backgroundPosition="center center";
           //bgColor = customColor;
        }
}

function copyText (txtBox) {
        txtBox.focus();
        txtRange = txtBox.createTextRange();
        txtRange.execCommand("SelectAll");
        txtRange.execCommand("Copy");
}

function closeDiv(id) {
  container = document.getElementById(id);
  if (container) {
        container.style.display='none';
  }
}

function closeInlinePopup (id) {
    if (isInternetExplorer()) {
        showSeeThroughElements();
    }
    closeDiv(id);
}

function showSeeThroughElements () {
    changeSeeThroughElementsDisplay("");
}

function hideSeeThroughElements () {
    changeSeeThroughElementsDisplay("none");
}

function changeSeeThroughElementsDisplay (display) {
    //add more elements that need to be hidden / shown here
    changeDisplayForElements("select", display);
}

function changeDisplayForElements (type, display) {
    for(var i=0;i<document.all.length;i++){
        var ele = document.all[i];
        try {
          if (ele.type.indexOf(type) >= 0) {
              ele.style.display=display;
          }
        } catch (e) {
            //eat it
        }
    }
}

function frameWithAjaxImageSubmit (imageDiv, frmSrc, frmID) {
        document.getElementById(imageDiv).style.display="inline";
        document.getElementById(imageDiv).innerHTML = "<img src=\"/images/ajax.gif\"><br>Getting Images...";
        var frm = document.getElementById(frmID);
        frm.src = frmSrc;
}

function isValidURL (url) {
        var regExp= /[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/
        if (regExp.test(url)) {
                return true;
        }
        else {
                window.alert("Invalid URL");
                return false; 
        }
}

function ajaxLinkInParentWindow (divID, actionSrc) {
        this.parent.ajaxLink1(this.parent.document.getElementById(divID),actionSrc);
}

function loadMainEditor() {
        var editorArgs = {
                items: ["textGroup", "blockGroup", "listGroup", "justifyGroup", 
                        "colorGroup", "indentGroup", "linkGroup"]
        };
        mainEditor = dojo.widget.fromScript("Editor", editorArgs, dojo.byId("mainEditor"));
        mainEditor.onLoad = function() {
            mainEditor.disableToolbar();
            document.getElementById("mainEditor").innerHTML = "";
        }
}

function hideDiv (divID) {
        obj = document.getElementById(divID);
        if (obj) {
          obj.style.display="none";
        }
}

function showDiv (divID) {        
        obj = document.getElementById(divID);
        if (obj) {
          obj.style.display="";
        }
}


function hideParentDiv (divID) {
        this.parent.document.getElementById(divID).style.display="none";
}

function formatStr (txtBoxNameOrID, v, formIndex) {
    e = getObject1(txtBoxNameOrID, formIndex); 
    var str = getSelected(e);
    if (str.indexOf("\r") > 0 || str.indexOf("\n") > 0) {
        alert("Please select one line at a time.");
        return;    
    }
    if (str) setSelection(e, '<' + v + '>' + str + '</' + v + '>');
    return false;
}



function getSelected (e) {
    if (document.selection) {
        e.focus();
        var range = document.selection.createRange();
        return range.text;
    } else {
        var length = e.textLength;
        var start = e.selectionStart;
        var end = e.selectionEnd;
        if (end == 1 || end == 2 && length != undefined) end = length;
        return e.value.substring(start, end);
    }
}

function setSelection (e, v) {
    if (document.selection) {
        e.focus();
        var range = document.selection.createRange();
        range.text = v;
    } else {
        var length = e.textLength;
        var start = e.selectionStart;
        var end = e.selectionEnd;
        if (end == 1 || end == 2 && length != undefined) end = length;
        e.value = e.value.substring(0, start) + v + e.value.substr(end, length);
        e.selectionStart = start + v.length;
        e.selectionEnd = start + v.length;
    }
    e.focus();
}

function insertLink (txtBoxNameOrID, isMail, formIndex) {
    e = getObject1(txtBoxNameOrID, formIndex);
    var str = getSelected(e);
    var link = '';
    if (!isMail) {
        if (str.match(/^https?:/)) {
            link = str;
        } else if (str.match(/^(\w+\.)+\w{2,5}\/?/)) {
            link = 'http://' + str;
        } else if (str.match(/ /)) {
            link = 'http://';
        } else {
            link = 'http://' + str;
        }
    } else {
        if (str.match(/@/)) {
            link = str;
        }
    }
    var my_link = prompt((isMail ? "Enter email address:" : "Enter URL:"), "");
    if (my_link != null) {
         if (str == '') str = my_link;
         if (isMail) my_link = 'mailto:' + my_link;
        setSelection(e, '<a href="' + my_link + '" target="_blank">' + str + '</a>');
    }
    return false;
}

function getObject (elementNameOrID) {
        return getObject1(elementNameOrID, -1);
}
function getObject1 (elementNameOrID, formIndex) {
        
        if (formIndex < 0 && document.getElementById(elementNameOrID)) {
                return document.getElementById(elementNameOrID);
        } else if (formIndex >= 0 && 
                   document.forms[formIndex] &&
                   document.forms[formIndex].elements[elementNameOrID]) {
                return document.forms[formIndex].elements[elementNameOrID];
        }

        for (i=0; (document.forms && i < document.forms.length); i++) {
                if (document.forms[i].elements[elementNameOrID]) {
                      return  document.forms[i].elements[elementNameOrID];
                }
        }

}

function ajaxInlinePopup1 (popupWidth, popupHeight, appURL) {  
        var container = document.getElementById("contentEnclosingDivID");
        container.style.left=220;
        container.style.top=100 + document.body.scrollTop;

        var rightShadowDiv = document.getElementById("rightShadowDivID"); 
        var bottomShadowDiv = document.getElementById("bottomShadowDivID");
        var contentTable = document.getElementById("contentTableID");
        
        if (popupWidth > 0) {
                contentTable.style.width = popupWidth;
        }        
        if (popupHeight > 0) {
                contentTable.style.height = popupHeight;
        }                
        var shadowOffset = 10;        
        var ieAdjustment = 0;
        if (navigator.appName.indexOf("Microsoft Internet Explorer") >= 0) {
                 ieAdjustment = -7;
        }

        rightShadowDiv.style.left = parseInt(container.style.left) + parseInt(contentTable.style.width);
        bottomShadowDiv.style.left = parseInt(container.style.left) + shadowOffset;

        rightShadowDiv.style.top = parseInt(container.style.top) + shadowOffset ;
        rightShadowDiv.style.height = parseInt(contentTable.style.height) - shadowOffset + ieAdjustment;
        
        bottomShadowDiv.style.top = parseInt(container.style.top) +
                              parseInt(contentTable.style.height) + ieAdjustment;
        bottomShadowDiv.style.width = parseInt(contentTable.style.width);
        
        container.style.display="inline";
        bottomShadowDiv.style.display="inline";
        rightShadowDiv.style.display="inline";
        
        ajaxLink("contentDivID", appURL);
         
}

function closeLiteInlinePopup() {
        document.getElementById("contentEnclosingDivID").style.display="none";
        document.getElementById("rightShadowDivID").style.display="none";
        document.getElementById("bottomShadowDivID").style.display="none";
}

function insertImageCode (inputField, imageURL) {        
        var imageCode = "<img src=\""+imageURL+"\">";
        inputField.value = inputField.value + "\r\n" + imageCode;
}

function writeDiv (div, txt) {
        div.innerHTML = txt;        
}

//ReOrder methods
function moveSelectionUp (mnu) {
        mnuOptions = mnu.options;
        if(mnuOptions[0].selected){
            return;
        }

        for(var i=0; i < mnuOptions.length; i++){
                if(mnuOptions[i].selected && i > 0) {
                        mnuOptions[i].selected = false;
                        tmpVal = mnuOptions[i].value;
                        tmpTxt = mnuOptions[i].text;
                        mnuOptions[i].value = mnuOptions[i-1].value;
                        mnuOptions[i].text = mnuOptions[i-1].text;
                        mnuOptions[i-1].value = tmpVal;
                        mnuOptions[i-1].text = tmpTxt;
                        mnuOptions[i-1].selected = true;
                        return;

                }
        }
}


function moveSelectionDown(mnu) {

        mnuOptions = mnu.options;

        if(mnuOptions[ mnuOptions.length -1].selected){
            return;
        }

        for(var i=0; i < mnuOptions.length; i++){
                if(mnuOptions[i].selected && i <  (mnuOptions.length-1)) {
                        mnuOptions[i].selected = false;
                        tmpVal = mnuOptions[i+1].value;
                        tmpTxt = mnuOptions[i+1].text;

                        mnuOptions[i+1].value = mnuOptions[i].value;
                        mnuOptions[i+1].text = mnuOptions[i].text;

                        mnuOptions[i].value = tmpVal;
                        mnuOptions[i].text = tmpTxt;
                        mnuOptions[i+1].selected = true;
                        return;

                }
        }
}

function selectAllAndSubmitForm (frm, mnu) {
    selectAll(frm.elements[mnu]);
    frm.submit();
}

function selectAll (mnu) {
    mnuOptions = mnu.options;
    for(var i=0; i < mnuOptions.length; i++) {
        mnuOptions[i].selected = true;
    }
}

function modifyTableRowBGColor(id,rowIndex,  selectBox, customColorField) {
        if (document.getElementById) {
           obj = document.getElementById(id);
           if (selectBox.selectedIndex >= 0) {
             var selectedValue = selectBox.options[selectBox.selectedIndex].value;
             if (selectedValue == "-1") {
                selectedValue = customColorField.value;
             }
             if (rowIndex < 0) {
                obj.style.backgroundColor = selectedValue;
             } else {
                obj.rows[rowIndex].style.backgroundColor = selectedValue;
             }             
           }
        }
}

function modifyTableBGColor(id, selectBox, customColorField) {
        modifyTableRowBGColor(id, -1, selectBox, customColorField);
}



function getPos(obj) {
  var coord = new Object();
  o = obj;
  coord.left = o.offsetLeft;
  coord.top = o.offsetTop;
  while(o.offsetParent != null) {
    oParent = o.offsetParent;
    coord.left += oParent.offsetLeft;
    coord.top += oParent.offsetTop;
    o = oParent;
  }
  return coord;
}

function RaterControl(promptBoxId, strings, questionId, responseUri) {
  var imagePath = "http://informationr.net/images/ratercontrol/";
  var promptBox = document.getElementById(promptBoxId);

  if (!promptBox) return;

  var promptDiv = document.createElement("div");
  var thanksDiv = document.createElement("div");
  var raterDiv = document.createElement("div");

  promptDiv.className = "raterPrompt";
  thanksDiv.className = "ratherThanks";

  var this_ = this;

  // create the thank you
  thanksDiv.style.display = "none";
  thanksDiv.className = "raterThanks";
  thanksDiv.innerHTML = strings["ThankYou"];
  promptBox.appendChild(thanksDiv);

  // create the rater
  raterDiv.style.display = "block";
  raterDiv.innerHTML = "<table cellpadding='0' cellspacing='0' border='0'>"
      + "<tr><td class='raterContent'></td></tr></table>";
  var contents = raterDiv.getElementsByTagName("td")[0];
  var span = document.createElement("span");

  span.innerHTML = strings["RateThisTool"] + ":&nbsp;";

  /**
   * Creates an image object
   * @private
   */
  function createImage(uri){
    var img = document.createElement("img");
    img.src = uri;
    img.align = "absmiddle";
    return img;
  }

  faces = new Array();
  faces[0] = createImage(imagePath + 'sad.gif');
  faces[1] = createImage(imagePath + 'normal.gif');
  faces[2] = createImage(imagePath + 'happy.gif');

  for (var i=0; i< faces.length; i++){
    var face = faces[i];
    face.submitValue = i+1;
    face.rater = this;
    face.onclick = function(){
      this.rater.submitResponse(this.submitValue);
    }
    face.descText = strings["value_" + face.submitValue];
    face.onmouseover = function(){
      this.className = "faceOver";
      var coord = getPos(this);
      Bubble.show(this.descText, coord.left, coord.top);
    }
    face.onmouseout = function(){
      this.className = "";
      Bubble.hide();
    }
    face.style.cursor = "pointer";
    span.appendChild(face);
  }

  contents.appendChild(span);
  promptBox.appendChild(raterDiv);

  /**
   * Hides the rater control
   * @public
   */
  this.hide = function(opt_didSubmit){
    raterDiv.style.display = "none";
    Bubble.hide();
    if (opt_didSubmit) {
      thanksDiv.style.display = "block";
      window.setTimeout(this_.hide, 25000);
    } else {
      promptBox.style.display = "none";
    }
  }

  /**
   * Submits a response to the servlet URI using GET, and hides the
   * prompt box.  Does not check to make sure the data was sent without
   * error.
   * @param value numerical response value.
   * @param handler handler to invoke once the request is complete.
   */
  this.submitResponse = function(value) {
    var url = "/akira/RaterServlet";
    try {
        var pars = 'raterId=' + escape(questionId) + '&raterResponse=' + escape(value);
        ajaxLink1(thanksDiv, (url + "?" + pars));
    } catch (e) {
        // eat?
    }
    this_.hide(true);
  }
}


var Bubble = {
  imagePath:  "/images/ratercontrol/bubble/",

  init: function() {
    if (Bubble.bubbleDiv == null) {
      // initialize the bubble div if there isn't already one declared.
      var div = document.createElement("div");
      div.style.position = "absolute";
      div.style.top = 0;
      div.style.left = 0;

      // innerHTML building.  Multiple table wrapping for IE compatibility.
      var html = '<table cellpadding="0" cellspacing="0" border="0"><tr>'
          + '<td colspan="5"><div style="font-family:Arial;background:#fff;'
          + 'padding:6px;border-width:1px 1px 0px 1px;border-style:solid;'
          + 'border-color:#000;cursor:pointer;" id="bubble_msg"></div></td></tr>'
          + '<tr><td>'
          + '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>'
          + '<td style="width:2px" valign="top"><img src="'
          + Bubble.imagePath + 'bubble_left.gif" height="2" width="2">'
          + '</td><td valign="top"'
          + ' style="width:*;background-repeat:repeat-x;background-image:url(\''
          + Bubble.imagePath +'bubble_bg.gif\')"><img src="'
          + Bubble.imagePath + '1.gif"></td>'
          + '<td style="width:10px" valign="top"><img src="'
          + Bubble.imagePath+ 'bubble_tail.gif" height="11" width="10">'
          + '</td><td style="width:9px" '
          + 'valign="top"><img src="'
          + Bubble.imagePath + 'bubble_bg.gif" width="9" height="2"></td>'
          + '<td style="width:2px" valign="top"><img src="'
          + Bubble.imagePath + 'bubble_right.gif" height="2" width="2">'
          + '</td></tr>'
          + '</table></td></tr></table>';

      div.innerHTML = html;

      // Add to the document, reference as necessary.
      div.style.display = "none";
      div.style.visibility = "hidden";
      document.body.appendChild(div);
      Bubble.msgBox = document.getElementById("bubble_msg");
      Bubble.bubbleDiv = div;
    }
    Bubble.msgBox.innerHML = "&nbsp;";
  },

  showTip: function( message, obj ) {
    var coordinate = getPos(obj);
    Bubble.show(message, coordinate.left, coordinate.top);
    
    Bubble.msgBox.onclick = function() {
        Bubble.hide();
    };
    // Hide after 5 seconds
    setTimeout("Bubble.hide()", 5000);
  },
  show: function( message, absLeft, absTop ) {
    Bubble.init();
    var imagesOffsetY = 12;
    var imagesOffsetX = 16;
    Bubble.bubbleDiv.style.display = "block";
    Bubble.msgBox.innerHTML = message;

    Bubble.bubbleDiv.style.left = absLeft - Bubble.msgBox.offsetWidth
        + imagesOffsetX;
    Bubble.bubbleDiv.style.top = absTop - Bubble.msgBox.offsetHeight
        - imagesOffsetY;
    Bubble.bubbleDiv.style.visibility = "visible";
  },

  hide: function() {
    Bubble.bubbleDiv.style.visible = "hidden";
    Bubble.bubbleDiv.style.display = "none";
    Bubble.bubbleDiv.style.top = "0px";
    Bubble.bubbleDiv.style.left = "0px";

  }
}


function enablePollRoundedCorners (pollID) {
        pollRoundedCorners (pollID, "inline");        
}

function disablePollRoundedCorners (pollID) {
        pollRoundedCorners (pollID, "none");        
}

function pollRoundedCorners (pollID, displayMode) {
                
        document.getElementById("mp_table_view_top_left_" + pollID).style.display = displayMode;
        document.getElementById("mp_table_view_top_right_" + pollID).style.display = displayMode;
        document.getElementById("mp_table_view_bottom_right_" + pollID).style.display = displayMode;
        document.getElementById("mp_table_view_bottom_left_" + pollID).style.display = displayMode;        

        document.getElementById("mp_table_result_top_left_" + pollID).style.display = displayMode;
        document.getElementById("mp_table_result_top_right_" + pollID).style.display = displayMode;
        document.getElementById("mp_table_result_bottom_right_" + pollID).style.display = displayMode;
        document.getElementById("mp_table_result_bottom_left_" + pollID).style.display = displayMode;        
}

function changeElementValue (elementID, val) {
        document.getElementById(elementID).value = val;
}

function changeBackgroundImage (elementID, val) {
        document.getElementById(elementID).style.backgroundImage="url(" + val + ")";
}

function getHTMLFormat (text) {        
        text = text.replace(/\n/gi,"<br>");
        return text;
}

function formatEmailInvitationPreview (text) {
        text = getHTMLFormat(text);
        text = "<br><br><TABLE width='95%' align='center' style='border: 1px solid #cccccc;'><TR><TD>" + text +
               "</TD><TR></TABLE>";
        return text;
}

function ajaxInlinePopup1 (data, id) {
        container = document.getElementById('shadowedBox');
        dataContainer = document.getElementById('shadowedBoxBody');
        linkNode = document.getElementById(id);
        // Update the Status Container
        dataContainer.innerHTML = '<img src="http://informationr.net/images/ajax.gif">';
        container.style.left=220;
        container.style.top=100 + document.body.scrollTop;
        dojo.lfx.html.explode(linkNode, container, 200).play();
        dataContainer.style.height=300;
        dataContainer.style.overflow = "auto";
        dataContainer.innerHTML = data;
}

function markCursorPosition (textArea) {
        //alert (getCaterStartPosition (textArea)
        CURSOR_POS = getCaterStartPosition (textArea);
        //IE
        if (document.selection) {        
                if (textArea.value.charAt(CURSOR_POS + 1) == '\n') {
                        CURSOR_POS = CURSOR_POS + 1;
                }
        }
}

function insertTextAtCursor (textArea, value) {
        var str = textArea.value;
        str = str.substring (0, CURSOR_POS) + value + (CURSOR_POS < str.length ? str.substring(CURSOR_POS, str.length) : "");
        textArea.value = str;        
}

function monitorCursor (textArea) {
    textArea.onblur = function (e) {
        try{
            markCursorPosition(textArea);
        } catch(err){}
    };
    textArea.onfocus = function (e) {
        try{
            markCursorPosition(textArea);
        } catch(err){}
    };
    textArea.onkeyup = function (e) {
        try{
            markCursorPosition(textArea);
        } catch(err){}
    };
}

function getCaterStartPosition (textArea) {

  if ( document.selection ) { 
    // The current selection 
    var range = document.selection.createRange(); // We'll use this as a 'dummy' 
    var stored_range = range.duplicate(); // Select all text 
    stored_range.moveToElementText( textArea ); // Now move 'dummy' end point to end point of original range 
    stored_range.setEndPoint( 'EndToEnd', range ); // Now we can calculate start and end points 
    textArea.selectionStart = stored_range.text.length - range.text.length; 
    textArea.selectionEnd = textArea.selectionStart + range.text.length; 
    return textArea.selectionStart;
  }
        
  return textArea.selectionStart;

}

function closeWindowCallAjaxLink (myWin, divID, actionSrc) {
        ajaxLink(divID, actionSrc);
        myWin.close();
}

// Custom Reference Data Validator
function validateUSZip(value, divID, ajaxProcessorURL) {
  if (value != null && value.length == 5) {
        ajaxLink(divID, ajaxProcessorURL);
  } else {
     modifyTextNoCheck(divID, '');
  }
}       

function validateCAZip(value, divID, ajaxProcessorURL) {
  if (value != null && value.length == 7) {
        ajaxLink(divID, ajaxProcessorURL);
  } else {
        modifyTextNoCheck(divID, '');
  }
}       

function validateAUZip(value, divID, ajaxProcessorURL) {
  if (value != null && value.length == 4) {
        ajaxLink(divID, ajaxProcessorURL);
  } else {
        modifyTextNoCheck(divID, '');
  }
}       




if(typeof infosoftglobal == "undefined") var infosoftglobal = new Object();
if(typeof infosoftglobal.PowerMapUtil == "undefined") infosoftglobal.PowerMapUtil = new Object();
infosoftglobal.PowerMap = function(swf, id, w, h, debugMode, registerWithJS, c, scaleMode, lang){
	if (!document.getElementById) { return; }
	
	//Flag to see whether data has been set initially
	this.initialDataSet = false;
	
	//Create container objects
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Array();
	
	//Set attributes for the SWF
	if(swf) { this.setAttribute('swf', swf); }
	if(id) { this.setAttribute('id', id); }
	if(w) { this.setAttribute('width', w); }
	if(h) { this.setAttribute('height', h); }
	
	//Set background color
	if(c) { this.addParam('bgcolor', c); }
	
	//Set Quality	
	this.addParam('quality', 'high');
	
	//Add scripting access parameter
	this.addParam('allowScriptAccess', 'always');
	
	//Pass width and height to be appended as mapWidth and mapHeight
	this.addVariable('mapWidth', w);
	this.addVariable('mapHeight', h);

	//Whether in debug mode
	debugMode = debugMode ? debugMode : 0;
	this.addVariable('debugMode', debugMode);
	//Pass DOM ID to Map
	this.addVariable('DOMId', id);
	//Whether to registed with JavaScript
	registerWithJS = registerWithJS ? registerWithJS : 0;
	this.addVariable('registerWithJS', registerWithJS);
	
	//Scale Mode of Map
	scaleMode = scaleMode ? scaleMode : 'noScale';
	this.addVariable('scaleMode', scaleMode);
	//Application Message Language
	lang = lang ? lang : 'EN';
	this.addVariable('lang', lang);
}

infosoftglobal.PowerMap.prototype = {
	setAttribute: function(name, value){
		this.attributes[name] = value;
	},
	getAttribute: function(name){
		return this.attributes[name];
	},
	addParam: function(name, value){
		this.params[name] = value;
	},
	getParams: function(){
		return this.params;
	},
	addVariable: function(name, value){
		this.variables[name] = value;
	},
	getVariable: function(name){
		return this.variables[name];
	},
	getVariables: function(){
		return this.variables;
	},
	getVariablePairs: function(){
		var variablePairs = new Array();
		var key;
		var variables = this.getVariables();
		for(key in variables){
			variablePairs.push(key +"="+ variables[key]);
		}
		return variablePairs;
	},
	getSWFHTML: function() {
		var swfNode = "";
		if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) { 
			// netscape plugin architecture			
			swfNode = '<embed type="application/x-shockwave-flash" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"  ';
			swfNode += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
			var params = this.getParams();
			 for(var key in params){ swfNode += [key] +'="'+ params[key] +'" '; }
			var pairs = this.getVariablePairs().join("&");
			 if (pairs.length > 0){ swfNode += 'flashvars="'+ pairs +'"'; }
			swfNode += '/>';
		} else { // PC IE			
			swfNode = '<object id="'+ this.getAttribute('id') +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
			swfNode += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
			var params = this.getParams();
			for(var key in params) {
			 swfNode += '<param name="'+ key +'" value="'+ params[key] +'" />';
			}
			var pairs = this.getVariablePairs().join("&");			
			if(pairs.length > 0) {swfNode += '<param name="flashvars" value="'+ pairs +'" />';}
			swfNode += "</object>";
		}
		return swfNode;
	},
	setDataURL: function(strDataURL){
		//This method sets the data URL for the Map.
		//If being set initially
		if (this.initialDataSet==false){
			this.addVariable('dataURL',strDataURL);
			//Update flag
			this.initialDataSet = true;
		}else{
			//Else, we update the Map data using External Interface
			//Get reference to map object
			var mapObj = infosoftglobal.PowerMapUtil.getMapObject(this.getAttribute('id'));
			mapObj.setDataURL(strDataURL);
		}
	},
	setDataXML: function(strDataXML){
		//If being set initially
		if (this.initialDataSet==false){
			//This method sets the data XML for the map INITIALLY.
			this.addVariable('dataXML',strDataXML);
			//Update flag
			this.initialDataSet = true;
		}else{
			//Else, we update the map data using External Interface
			//Get reference to map object
			var mapObj = infosoftglobal.PowerMapUtil.getMapObject(this.getAttribute('id'));
			mapObj.setDataXML(strDataXML);
		}
	},
	render: function(elementId){
		var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
		n.innerHTML = this.getSWFHTML();
		return true;		
	}
}

// ------------ Fix for Out of Memory Bug in IE in FP9 ---------------//
/* Fix for video streaming bug */
infosoftglobal.PowerMapUtil.cleanupSWFs = function() {
	if (window.opera || !document.all) return;
	var objects = document.getElementsByTagName("OBJECT");
	for (var i=0; i < objects.length; i++) {
		objects[i].style.display = 'none';
		for (var x in objects[i]) {
			if (typeof objects[i][x] == 'function') {
				objects[i][x] = function(){};
			}
		}
	}
}
// Fixes bug in fp9
infosoftglobal.PowerMapUtil.prepUnload = function() {
	__flash_unloadHandler = function(){};
	__flash_savedUnloadHandler = function(){};
	if (typeof window.onunload == 'function') {
		var oldUnload = window.onunload;
		window.onunload = function() {
			infosoftglobal.PowerMapUtil.cleanupSWFs();
			oldUnload();
		}
	} else {
		window.onunload = infosoftglobal.PowerMapUtil.cleanupSWFs;
	}
}
if (typeof window.onbeforeunload == 'function') {
	var oldBeforeUnload = window.onbeforeunload;
	window.onbeforeunload = function() {
		infosoftglobal.PowerMapUtil.prepUnload();
		oldBeforeUnload();
	}
} else {
	window.onbeforeunload = infosoftglobal.PowerMapUtil.prepUnload;
}

/* Add Array.push if needed (ie5) */
if (Array.prototype.push == null) { Array.prototype.push = function(item) { this[this.length] = item; return this.length; }}

/* Function to return Flash Object from ID */
infosoftglobal.PowerMapUtil.getMapObject = function(id)
{
  if (window.document[id]) {
      return window.document[id];
  }
  if (navigator.appName.indexOf("Microsoft Internet")==-1) {
    if (document.embeds && document.embeds[id])
      return document.embeds[id]; 
  } else {
    return document.getElementById(id);
  }
}

function stringTrim (str) {
    str = str.replace(/^([ \r\n]+)([^ \r\n])/i, "$2");
    str = str.replace(/([ \r\n]+)$/i, "");
    return str;
}


/* Aliases for easy usage */
var getMapFromId = infosoftglobal.PowerMapUtil.getMapObject;
var PowerMap = infosoftglobal.PowerMap;

function showAllDivs (sudoID,start, limit) {
  changeAllDivsDisplay(sudoID, start, limit, true);
}

function hideAllDivs (sudoID,start, limit) {
  changeAllDivsDisplay(sudoID, start, limit, false);
}

function changeAllDivsDisplay (sudoID,start, limit, show) {
  for (i=start; i < limit; i++) {
    id = sudoID.replace(/\{0\}/gi,parseInt(i));
    if (document.getElementById(id)) {
      if (show) {
        showDiv(id);
      } else {
        hideDiv(id);
      }
    }
  }
}

function isInternetExplorer () {
    var browserName=navigator.appName;
    return (browserName && browserName.indexOf("Microsoft") > -1);
}


function displayInlineUploadInfo(id, value) {
  obj = document.getElementById(id);
  obj.innerHTML = "<img src='http://informationr.net/images/iconshock/tick_16.gif'>&nbsp;" + value;
}

function refreshOpener (loc) {
     window.opener.document.location=loc;
}

function addOptionToSelectBox(selectElement, name, value) {
  if (selectElement) { 
    selectElement.options[selectElement.options.length] = new Option(name, value);
    selectElement.value = value;
  } else {
    alert("Select Element Not Found");
  }
} 


function transferFieldValue(form, sourceName, targetName) {
  var target = form.elements[targetName];
  target.value = form.elements[sourceName].value;
  target.focus();
  target.select();
}

function syncCheckBox(masterCheckBoxObject) {
    var myForm = masterCheckBoxObject.form;
    for (i=0; i < myForm.elements.length; i++) {
        var formElement = myForm.elements[i];
        if (formElement.type && formElement.type == "checkbox") {            
            formElement.checked = masterCheckBoxObject.checked;        
        }
    }
}

function sectionMenu(itemArray, currentItem) {
    for (i = 0; i < itemArray.length; ++i) {
        var tableId = 'section_menu_' +  itemArray[i];
        var obj = document.getElementById(tableId);
        if (obj) {
            if (itemArray[i] != currentItem) {
                obj.className = 'sectionMenuNormal';
                var contentObj = document.getElementById('section_menu_content_' + itemArray[i]);
                if (contentObj) {    
                  contentObj.style.display = 'none';
                }
            }
        }
    }

    var obj = document.getElementById('section_menu_' + currentItem);
    if (obj) {
        obj.className = 'sectionMenuHighlight';
        var contentObj = document.getElementById('section_menu_content_' + currentItem);
        if (contentObj) {    
            contentObj.style.display = 'block';
        }        
    }
}

