//----------------------------------------------------------------------------------------------------
// This file includes Windows popup box overriding function and it these overriding function is
// defined twice it will make web browsers hang up. To prevent this problem, include
// overriding function only once.
//----------------------------------------------------------------------------------------------------
//   UTIL.JS FILE INCLUDING CHECK START
//----------------------------------------------------------------------------------------------------
if ( (typeof(util_js_included) == "undefined") || util_js_included == false )
{
 var util_js_included = true;
//----------------------------------------------------------------------------------------------------
function isHexaDigit(digit) {
var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
var len = hexVals.length;
var i = 0;
var ret = false;
 for ( i = 0; i < len; i++ )
  if ( digit == hexVals[i] ) break;
 if ( i < len )
  ret = true;
 return ret;
}
function isValidKey(val, size) {
var ret = false;
var len = val.length;
var dbSize = size * 2;
 if ( len == size )
  ret = true;
 else if ( len == dbSize ) {
  for ( i = 0; i < dbSize; i++ )
   if ( isHexaDigit(val.charAt(i)) == false )
    break;
  if ( i == dbSize )
   ret = true;
 } else
  ret = false;
 return ret;
}
function isValidHexKey(val, size) {
var ret = false;
 if (val.length == size) {
  for ( i = 0; i < val.length; i++ ) {
   if ( isHexaDigit(val.charAt(i)) == false ) {
    break;
   }
  }
  if ( i == val.length ) {
   ret = true;
  }
 }
 return ret;
}
function nameFilter(field) {
 for ( i = 0; i < field.value.length; i++ ) {
  if ( isNameUnsafe(field.value.charAt(i)) == true ) {
   field.value=field.value.replace(field.value.charAt(i), '');
  }
 }
}
// Allows '0-9','a-z','A-Z','-','.'
function hostNameFilter(field) {
 for ( i = 0; i < field.value.length; i++ ) {
  if ( isHostNameUnsafe(field.value.charAt(i)) == true ) {
   field.value=field.value.replace(field.value.charAt(i), '');
  }
 }
}
function isHostNameUnsafe(compareChar) {
 // Numbers are ok
 if ( compareChar.charCodeAt(0) >=48 && compareChar.charCodeAt(0) <= 57 )
  return false;
 // Alphabetic characters are ok
 if ( compareChar.charCodeAt(0) >=65 && compareChar.charCodeAt(0) <= 90 )
  return false;
 // Alphabetic characters are ok
 if ( compareChar.charCodeAt(0) >=97 && compareChar.charCodeAt(0) <= 122 )
  return false;
 // '-' '_' and '.' are ok. '_'=95 '.'=46 '-'=45
 if ( compareChar.charCodeAt(0) == 95 || compareChar.charCodeAt(0) == 46 || compareChar.charCodeAt(0) == 45 )
  return false;
 // Everything else is bad
 return true;
}
// Allowed URL characters from RFC 3986
// * unreserved	= ALPHA / DIGIT / "-" / "." / "_" / "~"
// * reserved	= gen-delims / sub-delims
// * gen-delims	= ":" / "/" / "?" / "#" / "[" / "]" / "@"
// * sub-delims	= "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
function urlFilter(field) {
 for ( i = 0; i < field.value.length; i++ ) {
  if ( isURLUnsafe(field.value.charAt(i)) == true ) {
   field.value=field.value.replace(field.value.charAt(i), '');
  }
 }
}
function isURLUnsafe(compareChar) {
 //var patt=new RegExp("[^a-zA-Z0-9\-._~!*'();:@&=+$,\/?#\[\]]");
 var patt=/[^a-zA-Z0-9-._~!*'();:@&=+$,\/?#\[\]]/
 return patt.test(compareChar);
}
function isNameUnsafe(compareChar) {
var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.:\t";
 if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
   && compareChar.charCodeAt(0) < 123 ) {
  return false; // found no unsafe chars, return false
 }
 else {
  return true;
 }
}
// Check if a name valid
function isValidName(name) {
var i = 0;
 for ( i = 0; i < name.length; i++ ) {
  if ( isNameUnsafe(name.charAt(i)) == true )
   return false;
 }
 return true;
}
// same as is isNameUnsafe but allow spaces
function isCharUnsafe(compareChar) {
var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.:\t";
 if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) >= 32
  && compareChar.charCodeAt(0) < 123 )
  return false; // found no unsafe chars, return false
 else
  return true;
}
function isValidNameWSpace(name) {
var i = 0;
 for ( i = 0; i < name.length; i++ ) {
  if ( isCharUnsafe(name.charAt(i)) == true )
   return false;
 }
 return true;
}
function isSameSubNet(lan1Ip, lan1Mask, lan2Ip, lan2Mask) {
var count = 0;
 lan1a = lan1Ip.split('.');
 lan1m = lan1Mask.split('.');
 lan2a = lan2Ip.split('.');
 lan2m = lan2Mask.split('.');
 for (i = 0; i < 4; i++) {
  l1a_n = parseInt(lan1a[i]);
  l1m_n = parseInt(lan1m[i]);
  l2a_n = parseInt(lan2a[i]);
  l2m_n = parseInt(lan2m[i]);
  if ((l1a_n & l1m_n) == (l2a_n & l2m_n))
   count++;
 }
 if (count == 4)
  return true;
 else
  return false;
}
function KeyCode(e) {
 if(e&&e.which){ //NN
  e=e;
  return(e.which);
 }
 else{
  e=event;
  return(e.keyCode);
 }
}
function isBlank(s) {
 for (i=0;i<s.length;i++) {
  c=s.charAt(i);
  if ((c!=' ') && (c!='\n') && (c!='\t'))
   return false;
 }
 return true;
}
function isNValidIP(s) {
 if((isBlank(s))||(isNaN(s))||(s<0||s>255))
  return true;
 else
  return false;
}
function IPfieldEntry(field) {
 if(isNaN(field.value.charAt(field.value.length-1))&&field.value.charAt(field.value.length-1)!='.')
  field.value=field.value.slice(0,field.value.length-1);
 field.value=parseInt(field.value);
}
function NumfieldEntry(field) {
 field.value=field.value.replace(/[^0-9]+/g, "");
}
function lastEntryChar(field,spchar) {
 if(field.value.charAt(field.value.length-1)==spchar) {
  field.value=field.value.slice(0,field.value.length-1);
  if(field.value.length)
   return(1);
 }
 return(0);
}
function isValidIpEntry(field,e) {
//	if(KeyCode(e)!=9) {
  IPfieldEntry(field);
  if(lastEntryChar(field,' '))
   field.value=field.value.substring(0,field.value.length);
  if(lastEntryChar(field,'.')||field.value.length==3) {
   if(isNValidIP(field.value)) {
    field.value="255";
    field.select();
    return false;
   }
   else if(field.value.length<3)
    focusOnNext(field);
  }
 //}
 return true;
}
function isValidIpEntry_1(field,e) {
//	if(KeyCode(e)!=9) {
  IPfieldEntry(field);
  if(lastEntryChar(field,' '))
   field.value=field.value.substring(0,field.value.length);
   if(lastEntryChar(field,'.')||field.value.length==3) {
    if(isNValidIP(field.value) || field.value <1 || field.value >223) {
     field.value="192";
     field.select();
     return -1;
    }
   else if(field.value==127) {
    field.value="192";
    field.select();
    return -2;
   }
   else if(field.value.length<3)
    focusOnNext(field);
  }
 //}
 return 1;
}
function is_valid_domain_name(addr) {
 /*  this domain name validation check is following  */
 var valid=false;
 $.each(addr.split("."),function(i,v){
  /* RFC 1035 (Domain Implementation and Specification) */
  valid=v.match(/^[a-zA-Z]([a-zA-Z0-9\\-]*[a-zA-Z0-9]$|[a-zA-Z0-9]*$)/)!=null;
  return valid;
 });
 return valid;
}
function isValidIpAddress(address) {
var i = 0;
 if ( address == '0.0.0.0' || address == '255.255.255.255' )
  return false;
 addrParts = address.split('.');
 if ( addrParts.length != 4 ) return false;
 for (i = 0; i < 4; i++) {
  if (isNaN(addrParts[i]) || addrParts[i] =="")
   return false;
  num = parseInt(addrParts[i]);
  if ( num < 0 || num > 255 )
   return false;
 }
 return true;
}
function isValidIpAddress0(address) {
var i = 0;
 if ( address == '255.255.255.255' )
  return false;
 addrParts = address.split('.');
 if ( addrParts.length != 4 ) return false;
 for (i = 0; i < 4; i++) {
  if (isNaN(addrParts[i]) || addrParts[i] =="")
   return false;
  num = parseInt(addrParts[i]);
  if ( num < 0 || num > 255 )
   return false;
 }
 return true;
}
function getLeftMostZeroBitPos(num) {
var i = 0;
var numArr = [128, 64, 32, 16, 8, 4, 2, 1];
 for ( i = 0; i < numArr.length; i++ )
  if ( (num & numArr[i]) == 0 )
   return i;
 return numArr.length;
}
function getRightMostOneBitPos(num) {
var i = 0;
var numArr = [1, 2, 4, 8, 16, 32, 64, 128];
 for ( i = 0; i < numArr.length; i++ )
  if ( ((num & numArr[i]) >> i) == 1 )
   return (numArr.length - i - 1);
 return -1;
}
function printf(fmt) {
var reg = /%s/;
var result = new String(fmt);
 for (var i = 1; i < arguments.length; i++)
  result = result.replace(reg, new String(arguments[i]));
 document.write(result);
}
function RevIpBlocks(address, blocks){
var addrParts = address.split('.');
 if ( addrParts.length != 4 ) return false;
 for (i = 0; i < 4; i++) {
  if (isNaN(addrParts[i]) || addrParts[i] =="")
   return false;
  num = parseInt(addrParts[i]);
  if ( num < 0 || num > 255 )
   return false;
  eval(blocks+(i+1)+".value="+num);
 }
 return true;
}
function isValidSubnetMask(mask) {
//m[0] can be 128, 192, 224, 240, 248, 252, 254, 255
//m[1] can be 128, 192, 224, 240, 248, 252, 254, 255 if m[0] is 255, else m[1] must be 0
//m[2] can be 128, 192, 224, 240, 248, 252, 254, 255 if m[1] is 255, else m[2] must be 0
//m[3] can be 128, 192, 224, 240, 248, 252, 254, 255 if m[2] is 255, else m[3] must be 0
var correct_range = {128:1,192:1,224:1,240:1,248:1,252:1,254:1,255:1,0:1};
var m = mask.split('.');
 for (var i = 0; i <= 3; i ++) {
  if (!(m[i] in correct_range)) {
   return -2;
  }
 }
 if (m.length!=4 || (m[0] != 255 && m[1] != 0) || (m[1] != 255 && m[2] != 0) || (m[2] != 255 && m[3] != 0)) {
  return -1;
 }
 return 1;
}
function isValidPort(port) {
var fromport = 0;
var toport = 100;
 portrange = port.split(':');
 if ( portrange.length < 1 || portrange.length > 2 ) {
  return false;
 }
 if ( isNaN(portrange[0]) )
  return false;
 fromport = parseInt(portrange[0]);
 if ( portrange.length > 1 ) {
  if ( isNaN(portrange[1]) )
   return false;
  toport = parseInt(portrange[1]);
  if ( toport <= fromport )
   return false;
 }
 if ( fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535 )
  return false;
 return true;
}
function isValidNatPort(port) {
var fromport = 0;
var toport = 100;
 portrange = port.split('-');
 if ( portrange.length < 1 || portrange.length > 2 ) {
  return false;
 }
 if ( isNaN(portrange[0]) )
  return false;
 fromport = parseInt(portrange[0]);
 if ( portrange.length > 1 ) {
  if ( isNaN(portrange[1]) )
   return false;
  toport = parseInt(portrange[1]);
  if ( toport <= fromport )
   return false;
 }
 if ( fromport < 1 || fromport > 65535 || toport < 1 || toport > 65535 )
  return false;
 return true;
}
function isValidMacAddress(address) {
var c = '';
var i = 0, j = 0;
 // Trim any trailing whitespace first
 address = address.replace(/\s+$/g,'');
 if ( address == 'ff:ff:ff:ff:ff:ff' ) return false;
 addrParts = address.split(':');
 if ( addrParts.length != 6 ) return false;
 for (i = 0; i < 6; i++) {
  if ( addrParts[i] == '' )
   return false;
  for ( j = 0; j < addrParts[i].length; j++ ) {
   c = addrParts[i].toLowerCase().charAt(j);
   if ( (c >= '0' && c <= '9') ||
    (c >= 'a' && c <= 'f') )
    continue;
   else
    return false;
  }
 }
 return true;
}
function maskBits(mask) {
 var bits=0;
 mask_array = mask.split('.');
 for (i = 0; i < 4; i++) {
  bits+=parseInt(mask_array[i]).toString(2).replace(/0/g, "").length;
 }
 return bits;
}
var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
              "A", "B", "C", "D", "E", "F");
var unsafeString = "\"<>%\\^[]`\+\$\,'#&";
// deleted these chars from the include list ";", "/", "?", ":", "@", "=", "&" and #
// so that we could analyze actual URLs
function isUnsafe(compareChar) {
// this function checks to see if a char is URL unsafe.
// Returns bool result. True = unsafe, False = safe
 if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
   && compareChar.charCodeAt(0) < 123 )
  return false; // found no unsafe chars, return false
 else
  return true;
}
function decToHex(num, radix) {
// part of the hex-ifying functionality
var hexString = "";
 while ( num >= radix ) {
  temp = num % radix;
  num = Math.floor(num / radix);
  hexString += hexVals[temp];
 }
 hexString += hexVals[num];
 return reversal(hexString);
}
function reversal(s) {
// part of the hex-ifying functionality
var len = s.length;
var trans = "";
 for (i = 0; i < len; i++)
  trans = trans + s.substring(len-i-1, len-i);
 s = trans;
 return s;
}
function convert(val) {
// this converts a given char to url hex form
var hstr = decToHex(val.charCodeAt(0), 16);
 if (hstr.length > 1)
  return "%" + hstr;
 else if (hstr.length > 0)
  return "%0" + hstr;
 //return  "%" + decToHex(val.charCodeAt(0), 16);
}
function encodeUrl(val) {
var len = val.length;
var i = 0;
var newStr = "";
var original = val;
 for ( i = 0; i < len; i++ ) {
  if ( val.substring(i,i+1).charCodeAt(0) < 255 ) {
   // hack to eliminate the rest of unicode from this
   if (isUnsafe(val.substring(i,i+1)) == false)
    newStr = newStr + val.substring(i,i+1);
   else
    newStr = newStr + convert(val.substring(i,i+1));
  } else {
   // woopsie! restore.
   validate_alert ( "", "Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
   newStr = original;
   // short-circuit the loop and exit
   i = len;
  }
 }
 return newStr;
}
var markStrChars = "\"'";
// Checks to see if a char is used to mark begining and ending of string.
// Returns bool result. True = special, False = not special
function isMarkStrChar(compareChar) {
 if ( markStrChars.indexOf(compareChar) == -1 )
  return false; // found no marked string chars, return false
 else
  return true;
}
// use backslash in front one of the escape codes to process
// marked string characters.
// Returns new process string
function processMarkStrChars(str) {
var i = 0;
var retStr = '';
 for ( i = 0; i < str.length; i++ ) {
  if ( isMarkStrChar(str.charAt(i)) == true )
   retStr += '\\';
  retStr += str.charAt(i);
 }
 return retStr;
}
// Web page manipulation functions
function showhide(element, sh) {
var status;
 if (document.getElementById) {
  if (sh == 1)
   status = "";
  else
   status = "none"
  // standard
  document.getElementById(element).style.display = status;
 }
 else if (document.all) {
  if (sh == 1)
   status = "block";
  else
   status = "none"
  // old IE
  document.all[element].style.display = status;
 }
 else if (document.layers) {
  if (sh == 1)
   status = "block";
  else
   status = "none"
  // Netscape 4
  document.layers[element].display = status;
 }
}
// Load / submit functions
function getSelect(item) {
var idx;
 if (item.options.length > 0) {
     idx = item.selectedIndex;
     return item.options[idx].value;
 }
 else {
  return '';
    }
}
function setSelect(item, value) {
 for (i=0; i<item.options.length; i++) {
  if (item.options[i].value == value) {
   item.selectedIndex = i;
   break;
  }
 }
}
function setCheck(item, value) {
 if ( value == '1' )
  item.checked = true;
 else
  item.checked = false;
}
function setDisable(item, value) {
 if ( value == 1 || value == '1' )
  item.disabled = true;
 else
  item.disabled = false;
}
function submitText(item) {
 return '&' + item.name + '=' + item.value;
}
function submitSelect(item) {
 return '&' + item.name + '=' + getSelect(item);
}
function submitCheck(item) {
var val;
 if (item.checked == true) {
  val = 1;
 }
 else {
  val = 0;
 }
 return '&' + item.name + '=' + val;
}
function HostDate() {
var currentTime = new Date();
var seconds = currentTime.getUTCSeconds();
var minutes = currentTime.getUTCMinutes();
var hours = currentTime.getUTCHours();
var month = currentTime.getUTCMonth() + 1;
var day = currentTime.getUTCDate();
var year = currentTime.getFullYear();
var seconds_str = " ";
var minutes_str = " ";
var hours_str = " ";
var month_str = " ";
var day_str = " ";
var year_str = " ";
 if(seconds < 10)
  seconds_str = "0" + seconds;
 else
  seconds_str = ""+seconds;
 if(minutes < 10)
  minutes_str = "0" + minutes;
 else
  minutes_str = ""+minutes;
 if(hours < 10)
  hours_str = "0" + hours;
 else
  hours_str = ""+hours;
 if(month < 10)
  month_str = "0" + month;
 else
  month_str = ""+month;
 if(day < 10)
  day_str = "0" + day;
 else
  day_str = day;
//	return  month_str+day_str+hours_str+minutes_str+year;
 return year+"."+month_str+"."+day_str+"-"+hours_str+":"+minutes_str;
}
function f_filterResults(n_win, n_docel, n_body) {
var n_result = n_win ? n_win : 0;
 if (n_docel && (!n_result || (n_result > n_docel)))
  n_result = n_docel;
 return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}
function f_clientWidth() {
 return f_filterResults (
  window.innerWidth ? window.innerWidth : 0,
  document.documentElement ? document.documentElement.clientWidth : 0,
  document.body ? document.body.clientWidth : 0
 );
}
var pre_wwidth = 0;
var left;
var currentLeft;
var top;
var currentTop;
function init_moveGUI() {
 var wwidth = f_clientWidth();
 if(wwidth>1024) {
  left = currentLeft = 558;
  top = currentTop = 110;
  document.getElementById( "banner" ).style['display']='';
 }
 else if(wwidth>666) {
  left = currentLeft = wwidth-460;
  top = currentTop = 110;
  document.getElementById( "banner" ).style['display']='';
 }
 else {
  left = currentLeft = 20;
  top = currentTop = 20;
  document.getElementById( "banner" ).style['display']='none';
 }
 document.getElementById( "basicGUI" ).style['left']=currentLeft+'px';
 document.getElementById( "basicGUI" ).style['top']=currentTop+'px';
}
function moveGUI() {
 var wwidth = f_clientWidth();
 if( Math.abs(wwidth - pre_wwidth)>20 ) {
  pre_wwidth = wwidth;
  if(wwidth>1024) {
   left=558;
   top=110;
   document.getElementById( "banner" ).style['display']='';
  }
  else if(wwidth>666) {
   left=wwidth-460;
   top=110;
   document.getElementById( "banner" ).style['display']='';
  }
  else {
   left=20;
   top=20;
   document.getElementById( "banner" ).style['display']='none';
  }
 }
 diff=Math.abs( currentLeft-left );
 if( diff>=2 ) {
  if( currentLeft<left )
   currentLeft=currentLeft+diff/2;
  else if( currentLeft>left )
   currentLeft=currentLeft-diff/2;
  document.getElementById( "basicGUI" ).style['left']=currentLeft+'px';
 }
 diff=Math.abs( currentTop-top );
 if( diff>=2 ) {
  if( currentTop<top )
   currentTop=currentTop+diff/2;
  else if( currentTop>top )
   currentTop=currentTop-diff/2;
  document.getElementById( "basicGUI" ).style['top']=currentTop+'px';
 }
}
function toAdvV(url) {
 $('#basicGUI').animate({
 opacity: 0.25,
 left: '+=50',
 height: 'toggle'
 }, 1000, function() {
 /*	$('#banner').animate({
			opacity: 0.25,
			left: '+=50',
			height: 'toggle'
		}, 1000, function() { */
   location.href=url;
 //	});
 });
}
function IpCheck(IP1,IP2,IP3,IP4) {
 if (((isBlank(IP1))||(isNaN(IP1))||(IP1<0||IP1>255))||((isBlank(IP2))||(isNaN(IP2))||(IP2<0||IP2>255))||((isBlank(IP3))||(isNaN(IP3))||(IP3<0||IP3>255)) || ((isBlank(IP4))||(isNaN(IP4))||(IP4<0||IP4>255)))
  return false;
 else
  return true;
}
function set_var_tag() {
 $("var").css("font-style","normal");
 $("var").each(function(e) {
  this.innerHTML=eval($(this).html());
 });
}
function sprintf(fmt) {
 var reg = /%s/;
 var result = new String(fmt);
 for (var i = 1; i < arguments.length; i++) {
  result = result.replace(reg, new String(arguments[i]));
 }
 return result;
}
function isValidNameEntry(field,e) {
 if(KeyCode(e)!=9){
  if(isCharUnsafe(field.value.charAt(field.value.length-1))) {
   field.value=field.value.slice(0,field.value.length-1);
   return false;
  }
 }
 return true;
}
function atoi(str, num) {
i=1;
 if(num != 1 ) {
  while (i != num && str.length != 0){
   if(str.charAt(0) == '.'){
    i++;
   }
   str = str.substring(1);
  }
  if(i != num )
   return -1;
 }
 for(i=0; i<str.length; i++) {
  if(str.charAt(i) == '.') {
   str = str.substring(0, i);
   break;
  }
 }
 if(str.length == 0)
  return -1;
 return parseInt(str, 10);
}
function isAllNum(str) {
 for (var i=0; i<str.length; i++){
  if((str.charAt(i) >= '0' && str.charAt(i) <= '9') || (str.charAt(i) == '.'))
   continue;
  return 0;
 }
 return 1;
}
function isAllNumAndSlash(str) {
 for (var i=0; i<str.length; i++){
  if( (str.charAt(i) >= '0' && str.charAt(i) <= '9') || (str.charAt(i) == '.') || (str.charAt(i) == '/'))
   continue;
  return 0;
 }
 return 1;
}
function isNumOnly(str) {
 for (var i=0; i<str.length; i++){
  if((str.charAt(i) >= '0' && str.charAt(i) <= '9') )
   continue;
  return 0;
 }
 return 1;
}
function checkRange(str, num, min, max) {
 d = atoi(str,num);
 if(d > max || d < min)
  return false;
 return true;
}
function hasSubStr(str, substr) {
 return str.search(substr) >= 0;
}
function multiLangRadio(txt) {
 if(Butterlate.getLang()=="ar")
  document.write("<font dir=\"rtl\">"+_(txt));
 else
  document.write("<font>"+_(txt));
}
function toUpTime( uptime ) {
var upday = parseInt(uptime / (24 * 3600));
var uphr = parseInt((uptime - upday * 24 * 3600) / (3600));
var upmin = parseInt((uptime - upday * 24 * 3600 - uphr * 3600) / 60);
var upsec = parseInt(uptime - upday * 24 * 3600 - uphr * 3600 - upmin * 60);
 uphr=uphr<10?"0"+uphr.toString():uphr.toString();
 upmin=upmin<10?"0"+upmin.toString():upmin.toString();
 upsec=upsec<10?"0"+upsec.toString():upsec.toString();
 if (upday) {
  var buf2=upday.toString() + " Day";
  if (upday > 1)
   buf2=buf2+"s";
  buf2=buf2+"  ";
 }
 else {
  buf2="";
 }
 return buf2+uphr+":"+upmin+":"+upsec;// printf("uptime=\"%s%02u : %02u : %02u\";", buf2, uphr, upmin, upsec);
}
function checkIE10() {
var pos=navigator.userAgent.indexOf("MSIE");
 if(pos!=-1 && (parseInt(navigator.userAgent.substr(pos+4, 10))>=9) ) {
  $('.Rotate-90').removeClass('Rotate-90').addClass('Rotate-90-IE10');
 }
}
function breakWord(inString, maxWordLength) {
 if( inString=="" || inString==null || inString.length==null ) {
  return "";
 }
 var mystr = inString.match(new RegExp('[\\S]{1,}', 'g'));
 var retstr="";
 for(x=0;x<mystr.length;x++) {
  var mystr2 = mystr[x].match(new RegExp('[\\s\\S]{1,'+maxWordLength+'}', 'g'));
  if(mystr2.length==1) {
   retstr+=mystr[x]+" ";
  }
  else {
   for(y=0;y<mystr2.length;y++) {
    retstr+=mystr2[y]+"<br/>";
   }
  }
 }
 return retstr;
}
function add_options(myid, mylist, def) {
 $.each( ["#"+myid], function(idx,el) {
  $.each(
   mylist, function(val,txt) { $(el).append("<option value='"+val+"'>"+txt+"</option>");}
  );
 });
 if(def!="") {
  $("#"+myid).val(def);
 }
}

function getCookie(c_name) {
var i,x,y,ARRcookies=document.cookie.split(";");
 for (i=0;i<ARRcookies.length;i++) {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name) {
   return unescape(y);
  }
 }
 return "";
}
function setCookie(c_name, value) {
 document.cookie=c_name + "=" + value;
}

//------------- functions for V2 UI-------------------------------
function set_menu(top, side, user) {
var user=getCookie("c_name");
var top_menu_list = ["Status", "Internet", "Services", "System", "Help"];
// if(typeof(user)=="undefined"){user="";}
var c=new Array();
 $.each(top_menu_list, function(i,j) {c[j]="";});
 c[top]=" class='active'";
 c["Help"]=" class='help' "
/*var h_top="<div class='container'><header class='site-header'>	<nav class='top-right grid-9 omega'>		<ul class='main-menu list-inline'>			<li"+c["Status"]+"><a href='status.html' style='border-left:none;'>"+"Status"+"</a></li>			<li"+c["Internet"]+"><a href='Profile_Name_List.html'>"+"Networking"+"</a></li>			<li"+c["Services"]+"><a href='ddns.html'>"+"Services"+"</a></li>			<li"+c["System"]+"><a href='logfile.html'>"+"System"+"</a></li>			<li"+c["Help"]+"><a href='help.html' style='border-right:1px solid #E6EBED;'>"+"Help"+"</a></li>		</ul>		<div class='top-right-btn'>		<div class='power-btn'>";
   if(typeof(user)=="undefined" || user=="&nbsp;" || user=="") {
    h_top+="<a href='index.html' class='power-btn' id='log-off'><span class='btn-text'>"+"Login"+"</span></a>";
   }*/
   //else {
   if (user == "root" || user == "admin") {

	var h_top="<div class='container'><header class='site-header'>	<nav class='top-right grid-9 omega'>		<ul class='main-menu list-inline'>			<li"+c["Status"]+"><a href='status.html' style='border-left:none;'>"+"Status"+"</a></li>			<li"+c["Internet"]+"><a href='Profile_Name_List.html'>"+"Networking"+"</a></li>			<li"+c["Services"]+"><a href='ddns.html'>"+"Services"+"</a></li>			<li"+c["System"]+"><a href='logfile.html'>"+"System"+"</a></li>			<li"+c["Help"]+"><a href='help.html' style='border-right:1px solid #E6EBED;'>"+"Help"+"</a></li>		</ul>		<div class='top-right-btn'>		<div class='power-btn'>";

    h_top+="<a href='index.html?logoff' class='power-btn' id='log-off'><span class='btn-text'>"+"Log out"+"</span></a>";
   //}
   h_top+="</div>			<div class='account-btn'>				<span class='login-foot'></span><span class='btn-text'>"+user+"</span>			</div>		</div>	</nav></header>";
 //h_top+="<div class='logo'><a href='status.html'><img src='img/logo.png?l=1' alt='Vodafone Home'></a></div></div>";
 $("#main-menu").append(h_top);
 if(side!="") {
 switch(top) {
 case "Internet":
  if( roam_simcard=="1" ) {
   var wwan_menu_list = ["Profile_List", "DOD", "BAND", "ROAMINGSETTING", "SIM_Security"];
  }
  else {
   var wwan_menu_list = ["Profile_List", "DOD", "BAND", "SIM_Security"];
  }
  var wwan_menu_o = "";
  var wwan_menu_h = " hide";
  $.each(wwan_menu_list, function(i,j) {if (j==side){wwan_menu_o = " class='open'";wwan_menu_h = "";} });
  var lan_menu_list = ["LAN", "DHCP"];
  var lan_menu_o = "";
  var lan_menu_h = " hide";
  $.each(lan_menu_list, function(i,j) {if (j==side){lan_menu_o = " class='open'";lan_menu_h = "";} });
  var ethwan_menu_list = [];
  var routing_menu_list = ["STATIC_ROUTING", "RIP", "VRRP", "NAT", "DMZ", "FIREWALL", "PORT_FILTER"];
  var routing_menu_o = "";
  var routing_menu_h = " hide";
  $.each(routing_menu_list, function(i,j) {if (j==side){routing_menu_o = " class='open'";routing_menu_h = "";} });
  var vpn_menu_list = ["IP_Sec", "OpenVPN", "pptpClient", "GRE"];
  var vpn_menu_o = "";
  var vpn_menu_h = " hide";
  $.each(vpn_menu_list, function(i,j) {if (j==side){vpn_menu_o = " class='open'";vpn_menu_h = "";} });
  var ethwan_list=[];
  var side_menu_list = wwan_menu_list.concat(ethwan_list, ethwan_menu_list, lan_menu_list, routing_menu_list, vpn_menu_list);
  var c=new Array();
  $.each(side_menu_list, function(i,j) {c[j]=" ";});
  c[side]=" class='active' ";
  var h_side="<ul>		<li"+wwan_menu_o+">			<a class='expandable'>"+"Wireless WAN"+"</a>			<div class='submenu"+wwan_menu_h+"'>				<a"+c["Profile_List"]+"href='Profile_Name_List.html'>"+"Data connection"+"</a>";
   h_side+="<a"+c["BAND"]+"href='setband.html'>"+"Operator settings"+"</a>";
   if( roam_simcard=="1" ) {
    h_side+="<a"+c["ROAMINGSETTING"]+"href='roaming_settings.html'>"+"Roaming settings"+"</a>";
   }
   h_side+="<a"+c["SIM_Security"]+"href='pinsettings.html'>"+"SIM security settings"+"</a>";
   h_side+="<a"+c["DOD"]+"href='dod.html'>"+"Connect on demand"+"</a>";
   h_side+="</div>					</li>					<li"+lan_menu_o+">						<a class='expandable'>"+"LAN"+"</a>						<div class='submenu"+lan_menu_h+"'>							<a"+c["LAN"]+"href='LAN.html'>"+"LAN"+"</a>							<a"+c["DHCP"]+"href='DHCP.html'>"+"DHCP"+"</a>						</div>					</li>";
  h_side+="<li"+routing_menu_o+">			<a class='expandable'>"+"Routing"+"</a>			<div class='submenu"+routing_menu_h+"'>				<a"+c["STATIC_ROUTING"]+"href='routing.html'>"+"Static"+"</a>				<a"+c["RIP"]+"href='RIP.html'>"+"RIP"+"</a>				<a"+c["VRRP"]+"href='VRRP.html'>"+"Redundancy (VRRP)"+"</a>";
   h_side+="<a"+c["NAT"]+"href='NAT.html'>"+"Port forwarding"+"</a>				<a"+c["DMZ"]+"href='DMZ.html'>"+"DMZ"+"</a>				<a"+c["FIREWALL"]+"href='firewall.html'>"+"Router firewall"+"</a>";
   h_side+="<a"+c["PORT_FILTER"]+"href='port_filtering.html'>"+"MAC / IP / Port filtering"+"</a>			</div>		</li>		<li"+vpn_menu_o+">			<a class='expandable'>"+"VPN"+"</a>			<div class='submenu"+vpn_menu_h+"'>				<a"+c["IP_Sec"]+"href='VPN_ipsec.html'>"+"IPSec"+"</a>				<a"+c["OpenVPN"]+"href='VPN_openvpn.html'>"+"Open VPN"+"</a>				<a"+c["pptpClient"]+"href='VPN_pptpc.html'>"+"PPTP client"+"</a>				<a"+c["GRE"]+"href='VPN_gre.html'>"+"GRE tunnelling"+"</a>			</div>		</li><ul>";
 break;
 case "Services":
  var sms_menu_list = ["SMS_Setup", "SMS_NewMag", "SMS_Inbox", "SMS_Outbox", "SMS_Diag"];
  var sms_menu_o = "";
  var sms_menu_h = " hide";
  $.each(sms_menu_list, function(i,j) {if (j==side){sms_menu_o = " class='open'";sms_menu_h = "";} });
  var serial_menu_list = ["EMU", "PADD"];
  var serial_menu_o = "";
  var serial_menu_h = " hide";
  $.each(serial_menu_list, function(i,j) {if (j==side){serial_menu_o = " class='open'";serial_menu_h = "";} });
  var dss_menu_list = ["EDP", "DSS"];
  var dss_menu_o = "";
  var dss_menu_h = " hide";
  $.each(dss_menu_list, function(i,j) {if (j==side){dss_menu_o = " class='open'";dss_menu_h = "";} });
  var gps_menu_list = [
   "GPS",
      "MSB",
         "ODOMETER"
  ];
  var gps_menu_o = "";
  var gps_menu_h = " hide";
  $.each(gps_menu_list, function(i,j) {if (j==side){gps_menu_o = " class='open'";gps_menu_h = "";} });
  var eventnoti_menu_list = [
   "EVENT_NOTI",
   "EVENT_DEST"
  ];
  var eventnoti_menu_o = "";
  var eventnoti_menu_h = " hide";
  $.each(eventnoti_menu_list, function(i,j) {if (j==side){eventnoti_menu_o = " class='open'";eventnoti_menu_h = "";} });
  var admin_menu_list = ["ADMINISTRATION", "HTTPS", "SSH", "LED"];
  var admin_menu_o = "";
  var admin_menu_h = " hide";
  $.each(admin_menu_list, function(i,j) {if (j==side){admin_menu_o = " class='open'";admin_menu_h = "";} });
  var side_menu_list = ["DDNS", "NTP", "SNMP", "TR"
  , "EDP"
  , "DSS"
  , "EMU"
  , "PADD"
  , "GPS"
  , "MSB"
  , "ODOMETER"
  , "IOCONFIG"
  , "POWERSAVE"
  , "EVENT_NOTI"
  , "EVENT_DEST"
  , "EMAIL_CLIENT"
  ];
  side_menu_list = side_menu_list.concat(sms_menu_list);
  var c=new Array();
  $.each(side_menu_list, function(i,j) {c[j]=" ";});
  c[side]=" class='active' ";
  var h_side="<ul>			<li><a"+c["DDNS"]+"href='ddns.html'>"+"Dynamic DNS"+"</a></li>			<li><a"+c["NTP"]+"href='NTP.html'>"+"Network time (NTP)"+"</a></li>";
  //h_side+="<li><a"+c["DSS"]+"href='data_stream.html'>"+"Data stream manager"+"</a></li>";
  h_side+="<li"+dss_menu_o+">			<a class='expandable'>"+"Data stream manager"+"</a>			<div class='submenu"+dss_menu_h+"'>				<a"+c["EDP"]+"href='end_points.html'>"+"Endpoints"+"</a>				<a"+c["DSS"]+"href='data_stream.html'>"+"Streams"+"</a>			</div>		</li>";
  h_side+="<li"+serial_menu_o+">			<a class='expandable'>"+"Legacy data managers"+"</a>			<div class='submenu"+serial_menu_h+"'>				<a"+c["EMU"]+"href='v250.html'>"+"Modem emulator"+"</a>				<a"+c["PADD"]+"href='padd.html'>"+"PADD"+"</a>			</div>		</li>";
  h_side+="<li><a"+c["SNMP"]+"href='snmp.html'>"+"SNMP"+"</a></li>"
  h_side+="<li><a"+c["TR"]+"href='TR069.html'>"+"TR-069"+"</a></li>";
  h_side+="<li"+gps_menu_o+">			<a class='expandable'>"+"GPS"+"</a>			<div class='submenu"+gps_menu_h+"'>				<a"+c["GPS"]+"href='gps.html'>"+"GPS configuration"+"</a>"+
    "<a"+c["MSB"]+"href='msb.html'>"+"MSB (A-GPS)"+"</a>"+
    "<a"+c["ODOMETER"]+"href='odometer.html'>"+"Odometer"+"</a>"+"			</div>		</li>";
  h_side+="<li><a"+c["IOCONFIG"]+"href='IO_configuration.html'>"+"IO configuration"+"</a></li>";
   h_side+="<li><a"+c["POWERSAVE"]+"href='low_power_standby.html'>"+"Low power mode"+"</a></li>";
  h_side+="<li"+eventnoti_menu_o+">			<a class='expandable'>"+"Event notification"+"</a>			<div class='submenu"+eventnoti_menu_h+"'>				<a"+c["EVENT_NOTI"]+"href='event_noti.html'>"+"Notification configuration"+"</a>"+
    "<a"+c["EVENT_DEST"]+"href='event_dest.html'>"+"Destination configuration"+"</a>"+"			</div>		</li>";
  h_side+="<li><a"+c["EMAIL_CLIENT"]+"href='email_client.html'>"+"Email server"+"</a></li>";
  h_side+="<li"+sms_menu_o+">			<a class='expandable'>"+"SMS messaging"+"</a>			<div class='submenu"+sms_menu_h+"'>				<a"+c["SMS_Setup"]+"href='SMS_Setup.html'>"+"Setup"+"</a>				<a"+c["SMS_NewMag"]+"href='SMS_New_Message.html'>"+"New message"+"</a>				<a"+c["SMS_Inbox"]+"href='SMS_Inbox.html'>"+"Inbox"+"</a>				<a"+c["SMS_Outbox"]+"href='SMS_Outbox.html'>"+"Sent items"+"</a>				<a"+c["SMS_Diag"]+"href='SMS_Diagnostics.html'>"+"Diagnostics"+"</a>			</div>		</li></ul>";
 break;
 case "System":
  var log_menu_list = ["LOG", "IPSECLOG", "EVENTNOTILOG" ];
  var log_menu_o = "";
  var log_menu_h = " hide";
  $.each(log_menu_list, function(i,j) {if (j==side){log_menu_o = " class='open'";log_menu_h = "";} });
  var admin_menu_list = ["ADMINISTRATION", "HTTPS", "SSH", "LED"];
  var admin_menu_o = "";
  var admin_menu_h = " hide";
  $.each(admin_menu_list, function(i,j) {if (j==side){admin_menu_o = " class='open'";admin_menu_h = "";} });
  if(user=="root") {
   var loadsave_menu_list = ["SETTINGS", "UPLOAD", "PKG_MANAGER"];
   var loadsave_menu_o = "";
   var loadsave_menu_h = " hide";
   $.each(loadsave_menu_list, function(i,j) {if (j==side){loadsave_menu_o = " class='open'";loadsave_menu_h = "";} });
   var side_menu_list = log_menu_list.concat("Sys_Monitor", loadsave_menu_list, admin_menu_list, ["CustomMenu", "RESET"]);
  }
  else {
   var side_menu_list = log_menu_list.concat(admin_menu_list, ["RESET"]);
  }
  var c=new Array();
  $.each(side_menu_list, function(i,j) {c[j]=" ";});
  c[side]=" class='active' ";
  if(user=="root") {
   var h_side="<ul>			<li"+log_menu_o+">				<a class='expandable'>"+"Log"+"</a>				<div class='submenu"+log_menu_h+"'>					<a"+c["LOG"]+"href='logfile.html'>"+"System log"+"</a>					<a"+c["IPSECLOG"]+"href='ipseclog.html'>"+"IPSec log"+"</a>";
   h_side+="<a"+c["EVENTNOTILOG"]+"href='eventnotilog.html'>"+"Event notification log"+"</a>";
   h_side+="</div>			</li>			<li><a"+c["Sys_Monitor"]+"href='ltph.html'>"+"Ping watchdog"+"</a></li>			<li"+loadsave_menu_o+">				<a class='expandable'>"+"System configuration"+"</a>				<div class='submenu"+loadsave_menu_h+"'>					<a"+c["SETTINGS"]+"href='SaveLoadSettings.html'>"+"Settings backup and restore"+"</a>					<a"+c["UPLOAD"]+"href='AppUpload.html'>"+"Upload"+"</a>					<a"+c["PKG_MANAGER"]+"href='pkManager.html'>"+"Software applications manager"+"</a>";
     h_side+="</div>			</li>			<li"+admin_menu_o+">				<a class='expandable'>"+"Administration"+"</a>				<div class='submenu"+admin_menu_h+"'>					<a"+c["ADMINISTRATION"]+"href='administration.html'>"+"Administration settings"+"</a>";
    h_side+="<a"+c["HTTPS"]+"href='https_certificate.html'>"+"HTTPS key management"+"</a>";
    h_side+="<a"+c["SSH"]+"href='SSH.html'>"+"SSH key management"+"</a>";
    h_side+="<a"+c["LED"]+"href='led_mode.html'>"+"LED operation mode"+"</a>";
    h_side+="</div>			</li>			<li id='customMenu' style='display:none'>				<a class='expandable'>"+"Custom menu"+"</a>				<div class='submenu' id='subCustomMenu'></div>			</li>";
   h_side+="<li><a"+c["RESET"]+"href='Reboot.html'>"+"Reboot"+"</a></li></ul>";
  }
  else {
   var h_side="<ul>			<li"+log_menu_o+">				<a class='expandable'>"+"Log"+"</a>				<div class='submenu"+log_menu_h+"'>					<a"+c["LOG"]+"href='logfile.html'>"+"System log"+"</a>					<a"+c["IPSECLOG"]+"href='ipseclog.html'>"+"IPSec log"+"</a>";
   h_side+="<a"+c["EVENTNOTILOG"]+"href='eventnotilog.html'>"+"Event notification log"+"</a>";
   h_side+="</div>			</li>			<li"+admin_menu_o+">				<a class='expandable'>"+"Administration"+"</a>				<div class='submenu"+admin_menu_h+"'>					<a"+c["ADMINISTRATION"]+"href='administration.html'>"+"Administration settings"+"</a>					<a"+c["HTTPS"]+"href='https_certificate.html'>"+"HTTPS key management"+"</a>					<a"+c["SSH"]+"href='SSH.html'>"+"SSH key management"+"</a>";
    h_side+="<a"+c["LED"]+"href='led_mode.html'>"+"LED operation mode"+"</a>";
    h_side+="</div>			</li>			<li><a"+c["RESET"]+"href='Reboot.html'>"+"Reboot"+"</a></li></ul>";
  }
 break;
 }
 $("#side-menu").append(h_side);
 }
 set_var_tag();
 $.get("/cgi-bin/rdb.cgi?service.pppoe.server.0.enable", function(v) {
  eval(v);
  if(service_pppoe_server_0_enable=="1") {
   $(".hide_for_pppoe_en").css("display", "none");
   $(".pppoeEnablesMsg").css("display", "");
  }
 });
 $.get("/cgi-bin/usermenu.cgi", function(v) {
  if (v!="") {
   $("#customMenu").css("display", "");
   $("#subCustomMenu").html(v);
  }
 });
 $("input[type=text]").keyup(function(e) {
  var code = e.keyCode || e.which;
  if (code == '9') {
   $(this).select();
  }
 });
 $(this).attr("title", "MachineLink 3G");
}else {

	   var h_top="<div class='container'><header class='site-header'>	<nav class='top-right grid-9 omega'>		<ul class='main-menu list-inline'>			<li"+c["Status"]+"><a href='status.html' style='border-left:none;'>"+"Status"+"</a></li>			<li"+c["Internet"]+"><a href='index.html'>"+"Networking"+"</a></li>			<li"+c["Services"]+"><a href='index.html'>"+"Services"+"</a></li>			<li"+c["System"]+"><a href='index.html'>"+"System"+"</a></li>			<li"+c["Help"]+"><a href='help.html' style='border-right:1px solid #E6EBED;'>"+"Help"+"</a></li>		</ul>		<div class='top-right-btn'>		<div class='power-btn'>";

    h_top+="<a href='index.html' class='power-btn' id='log-off'><span class='btn-text'>"+"Login"+"</span></a>";


      h_top+="</div>			<div class='account-btn'>				<span class='login-foot'></span><span class='btn-text'>"+user+"</span>			</div>		</div>	</nav></header>";
 //h_top+="<div class='logo'><a href='status.html'><img src='img/logo.png?l=1' alt='Vodafone Home'></a></div></div>";
   $("#main-menu").append(h_top);

	}
}


function blockUI_alert(msg, func) {
 if($.type(func)!="undefined") {
  myfunc=func;
 }
 else {
  myfunc=function() {
  };
 }
 $.blockUI( {message: msg+"		<div class='button-raw med'>		<button class='secondary med' onClick='$.unblockUI();myfunc();'>"+"OK"+"</button>		</div>", css: {width:'320px', padding:'20px 20px'}
 });
}
function blockUI_alert_l(msg, func) {
 if($.type(func)!="undefined") {
  myfunc=func;
 }
 else {
  myfunc=function() {
  };
 }
 if($.type(msg)!="undefined" && msg.length>50) {
  align="left";
 }
 else {
  align="center";
 }
 $.blockUI( {message: "<div style='text-align:"+align+";'>"+msg+"		<div class='button-raw med'>		<button class='secondary med' onClick='$.unblockUI();myfunc();'>"+"OK"+"</button>		</div></div>", css: {width:'320px', padding:'20px 20px'}
 });
}
function blockUI_confirm(msg, func) {
 myfunc=func;
 $.blockUI( {message: msg+"		<div class='button-double'>		<button class='secondary med' onClick='$.unblockUI();myfunc();'>"+"OK"+"</button><button class='secondary med' onClick='$.unblockUI();'>"+"Cancel"+"</button>		</div>", css: {width:'380px', padding:'20px 20px'}
 });
}
function blockUI_confirm_l(msg, func) {
 myfunc=func;
  if(msg.length>50) {
  align="left";
 }
 else {
  align="center";
 }
 $.blockUI( {message: "<div style='text-align:"+align+";'>"+msg+"		<div class='button-double'>		<button class='secondary med' onClick='$.unblockUI();myfunc();'>"+"OK"+"</button><button class='secondary med' onClick='$.unblockUI();'>"+"Cancel"+"</button>		</div></div>", css: {width:'380px', padding:'20px 20px'}
 });
}
/************************* Validator *******************************/
var VALIDATOR=VF;
function validate_alert( t1, t2 ) {
 $.unblockUI();
 if(typeof(t1)=="undefined" || t1=="") {
  t1="Oops, something went wrong...";
 }
 if(typeof(t2)=="undefined" || t2=="") {
  t2=VALIDATOR.config.errors.summary;
 }
 var e=$(window.document.forms[0]), g="form-error";
 a='<li><a class="link-text jump-link" href="#{id}"><span class="icon icon-arrow-r"></span>{error}</a></li>';
 h='<div class="note" id="'+g+'">			<div class="wrap failure">				<h2><span class="access">'+VALIDATOR.config.strings.error+'</span>'+t1+'</h2>				<p>'+t2+'</p>				<ul class="list-plain"></ul>			</div>		</div>';
 h=$(h);
 if(e.attr("data-summary")==="false") {
  return;
 }
 e.prev(".note").remove();
 e.before(h);
 window.location.hash=g;
}
function clear_alert() {
 $(".note").remove();
}
function success_alert(t1, t2) {
 if(typeof(t1)=="undefined" || t1=="") {
  t1="Success!";
 }
 if(typeof(t2)=="undefined" || t2=="") {
  t2="Your configuration changes were successfully saved and applied";
 }
 var e=$(window.document.forms[0]), g="form-success";
 a='<li><a class="link-text jump-link" href="#{id}"><span class="icon icon-arrow-r"></span></a></li>';
 h='<div class="note">			<div class="wrap success" style="padding-bottom:6px">				<h2>'+t1+'</h2>				<p>'+t2+'</p>			</div>		</div>';
 h=$(h);
 if(e.attr("data-summary")==="false") {
  return;
 }
 e.prev(".note").remove();
 e.before(h);
 window.location.hash=g;
}
VF.config.errors.summary="Please correct these error(s)";
function blockUI_wait(msg) {
 $.blockUI({centerX: false, centerY: false, css: { left: parseInt($(window).width()/2-150)+"px", top:"320px", width: "300px"}, message:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+msg+"&nbsp;&nbsp;<i class='progress-sml' style='padding-bottom:2px;'></i>"});
}
/******** rdb tool class ********/
function rdb_tool() {
 /* init. mset opt */
 var opt_idx=1;
 var opt_obj=new Object();
 this.reset=function() {
  opt_idx=1;
  opt_obj=new Object();
 };
 this.set_flag=function(flags) {
  opt_obj["flag"]=flags;
 };
 this.add_to_mget=function(cfg){
  var rdb=this;
  $.each(cfg,function(i,o){
   rdb.add(o.rdb);
  });
 };
 this.add_to_mset=function(cfg) {
  var rdb=this;
  $.each(cfg,function(i,o){
   var val;
   /* use default value if element not specified */
   if(o.el==null)
    val=o.def;
   else
    val=load_value_from_element(o.el);
   rdb.add(o.rdb,val);
  });
 };
 this.get_ctrls=function(cfg) {
  var ctrls=new Array();
  $.each(cfg,function(i,o){
   if(o.el==null)
    return;
   if(is_ip_address_element(o.el))
    ctrls.push(get_ip_address_elements(o.el));
   else
    ctrls.push(o.el);
  });
  return ctrls.join(",");
 };
 this.disable_ctrl=function(cfg,dis) {
  $(this.get_ctrls(cfg)).attr("disabled",dis);
 };
 this.pour_to_ctrl=function(res,cfg) {
  $.each(cfg,function(i,o){
   /* bypass if element not specified */
   if(o.el==null)
    return true;
   var val;
   if($.type(res[o.rdb]) === "undefined" || $.type(res[o.rdb]) === "null" || res[o.rdb] == "")
    val=o.def;
   else
    val=res[o.rdb];
   load_value_to_element(o.el,val);
  });
 };
 /* add */
 this.add=function(rdb_var,rdb_val) {
  var rdbs=Array();
  /* add rdb_var to rdbs */
  if(rdb_var instanceof Array) {
   $.merge(rdbs,rdb_var)
  }
  else {
   rdbs.push(rdb_var);
  }
  /* add rdb_val to rdbs */
  if(rdb_val instanceof Array) {
   $.merge(rdbs,rdb_val)
  }
  else if(rdb_val!==undefined) {
   rdbs.push(rdb_val);
  }
  /* convert rdbs to opt */
  $.each(rdbs,function(i,v){
   opt_obj["opt"+opt_idx]=v;
   opt_idx++;
  });
 };
 /* submit mget json */
 this.mget=function(func) {
  opt_obj["cmd"]="rdb_mget";
  $.getJSON(
   "./cgi-bin/rdb_tool.cgi",
   opt_obj,
   func
  );
 };
 /* submit mset json */
 this.mset=function(func) {
  opt_obj["cmd"]="rdb_mset";
  $.getJSON(
   "./cgi-bin/rdb_tool.cgi",
   opt_obj,
   func
  );
 };
 this.wait_for_rdb_chg=function(rdb_to_wait,cur,timeout,func) {
  var timer;
  var s;
  var n;
  /* get start time */
  s=$.now();
  var rdb=this;
  /* periodic timer function */
  var timer_func=function(){
   /* check timeout */
   n=$.now();
   if( n-s >= timeout ) {
    func(cur);
    return;
   }
   /* check rdb */
   rdb.reset();
   rdb.add(rdb_to_wait);
   rdb.mget(function(res){
    if(res[rdb_to_wait]==cur) {
     timer=setTimeout(timer_func,500);
    }
    else {
     func(res[rdb_to_wait]);
    }
   });
  };
  /* start timer */
  timer=setTimeout(timer_func,500);
 };
 /* wait for rdb result */
 this.wait_for_rdb_result=function(rdb_to_wait,timeout,func) {
  this.wait_for_rdb_chg(rdb_to_wait,"",timeout,func);
 }
}
/* standard cgi call */
function cgi(bin) {
 var url=bin;
 /* init. mset opt */
 var opt_idx=1;
 var opt_obj=new Object();
 this.reset=function() {
  opt_idx=1;
  opt_obj=new Object();
 };
 this.dn=function(cmd,func) {
  opt_obj["cmd"]=cmd;
  /* build form */
  var form=$("<form/>");
  form.attr("action",url+"?"+$.param(opt_obj));
  form.attr("method","post");
  form.attr("encType","multipart/form-data");
  form.attr("style","display:none");
  /* hook up elements */
  form.appendTo("body");
  /* submit */
  form.submit();
  /* destory */
  form.remove();
 }
 /* reset upload */
 this.reset_up=function(el) {
  $(el).closest("form").each(function(){
   this.reset();
  });
 }
 /* upload */
 this.up=function(el,complete_func) {
  var upload_input=$(el);
  /* create iframe */
  if(!$("#postiframe").length) {
   $("<iframe id='postiframe' name='postiframe' style='width: 0; height: 0; border: none;'></iframe>").appendTo("body");
  }
  /* get form */
  var form = $(el).closest("form");
  /* hook up func to iframe load */
  $("#postiframe").unbind("load");
  $("#postiframe").load(function(){
   /* get body of iframe */
   var doc=$("#postiframe").contents();
   var res=doc.find("body pre").html();
   /* call func */
   complete_func($.parseJSON(res));
  });
  /* setup attrs */
  form.attr("action", url+"?"+$.param(opt_obj));
  form.attr("method", "post");
  form.attr("enctype", "multipart/form-data");
  form.attr("encoding", "multipart/form-data");
  form.attr("target", "postiframe");
  /* submit */
  form.submit();
 };
 /* add */
 this.add=function(opt) {
  var opts=Array();
  /* add */
  if(opt instanceof Array) {
   $.merge(opts,opt)
  }
  else {
   opts.push(opt);
  }
  /* convert rdbs to opt */
  $.each(opts,function(i,v){
   opt_obj["opt"+opt_idx]=v;
   opt_idx++;
  });
 };
 this.setcmd=function(cmd) {
  opt_obj["cmd"]=cmd;
 };
 /* submit mget json */
 this.run=function(cmd,func) {
  opt_obj["cmd"]=cmd;
  $.getJSON(
   url,
   opt_obj,
   func
  );
 };
 this.poll=function(interval,cmd,func) {
  var this_cgi=this;
  this.run(cmd,function(r){
   var res=func(r);
   if((res===undefined || res==true) && (interval>0))
    setTimeout(
     function() {
      this_cgi.poll(interval,cmd,func);
     },
     interval
    );
  });
 }
}
//--------------------------------------------------------------------------------
var windowConfirm;
var windowPrompt;
function check_insert_rtl( txt ) {
 if(Butterlate.getLang()!="ar")
  return txt;
 var ray = new Array();
 var retStr="";
 ray = txt.split("\n");
 for(i=0; i<ray.length; i++)
  retStr = retStr+"\u202b"+ray[i]+"\n";
 return retStr;
}
function check_phoneRegex(e) {
//var phoneRegEx=/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
//if(!e.value.match(phoneRegEx))
var phoneRegEx = /[^(\d+\+)]/g;
 e.value=e.value.replace(phoneRegEx,'');
}
function overridewindowAlert() {
 windowConfirm=window.confirm;
 windowPrompt=window.prompt;
 // alert
 window.alert = function(txt) {
  blockUI_alert_l( check_insert_rtl( txt ) );
 }
 // confirm
 window.confirm = function(txt) {
  return windowConfirm( check_insert_rtl( txt ) );
 }
 // prompt
 window.prompt = function(txt,def) {
  return windowPrompt(check_insert_rtl( txt ),check_insert_rtl( def ));
 }
}
overridewindowAlert();
function row_display(id, display) {
 if(document.getElementById){
  var el = document.getElementById(id);
  el.style.display = display ? '' : 'none';
 }
}
function get_ip_address_elements(el) {
 if(el[0]=="#")
  return false;
 var els=new Array();
 /* build element names */
 for(i=1;i<=4;i++)
  els.push("#" + el + i);
 var ids=els.join(",");
 if( $(ids).filter(".ip-adress").length==4 )
  return ids;
 return "";
}
function is_ip_address_element(el) {
 return get_ip_address_elements(el)!="";
}
function load_value_from_element(el) {
 if(is_ip_address_element(el))
  return parse_ip_from_fields(el);
 else if($(el).is("input:radio.access")) {
  if( $(el).filter(":checked").length>0 )
   return $(el).filter(":checked").val();
 }
 return $(el).val();
}
function load_value_to_element(el,val) {
 var toggle_element;
 if($(el).is("input:checkbox"))
  $(el).prop("checked",val);
 else if($(el).is("input:radio.access")) {
  if($.type(val)=="string") {
   val=(val=="on" || val=="1")?true:false;
  }
  else if($.type(val)=="number") {
   val=(val>0)?true:false;
  }
  if($.type(val)=="boolean") {
   if( $(el).filter("[value=on]").length>0 )
    filter=val?"[value=on]":"[value=off]";
   if( $(el).filter("[value=yes]").length>0 )
    filter=val?"[value=yes]":"[value=no]";
   else if( $(el).filter("[value=1]").length>0 )
    filter=val?"[value=1]":"[value=0]";
   else
    filter=val?":first":":last";
  }
  else if ( ($.type(val)=="undefined") || (val=="") )
   filter=":first";
  else
   filter="[value="+val+"]";
  $(el).filter(filter).prop("checked",true);
  $(el).blur();
  toggle_element=$(el).parent().attr("data-toggle-element");
  if(toggle_element!==undefined) {
   $("#"+toggle_element).toggle(val);
  }
 }
 else if($(el).is("select")) {
  $(el).children("[value='"+val+"']").attr("selected",true);
  $(el).val(val);
 }
 else if(is_ip_address_element(el)) {
  parse_ip_into_fields(val,el);
 }
 else {
  $(el).val(val);
 }
}
/*
	cfg={
		"#enable":"link.profile.1.enable"
		.
		.
	}
*/
function load_values_from_elements(cfg) {
 var res={};
 $.each(cfg, function(el,rdb) {
  res[rdb]=load_value_from_element(el);
 });
 return res;
}
/*
	cfg={
		"#priority":1,
		.
		.
	}
*/
function load_values_to_elements(cfg) {
 $.each(cfg,
  function(el,val) {
   load_value_to_element(el,val);
  }
 );
}
function lang_sentence(stc, arr) {
 for(i in arr) {
  stc=stc.replace("%%"+i, arr[i]);
 }
 return stc;
}
function is_touch_device() {
 return ('ontouchstart' in window) || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
//----------------------------------------------------------------------------------------------------
//   UTIL.JS FILE INCLUDING CHECK END
//----------------------------------------------------------------------------------------------------
}
