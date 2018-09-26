/* Copyright (C) 1991-2012 Free Software Foundation, Inc.
   This file is part of the GNU C Library.

   The GNU C Library is free software; you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public
   License as published by the Free Software Foundation; either
   version 2.1 of the License, or (at your option) any later version.

   The GNU C Library is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public
   License along with the GNU C Library; if not, see
   <http://www.gnu.org/licenses/>.  */
/* This header is separate from features.h so that the compiler can
   include it implicitly at the start of every compilation.  It must
   not itself include <features.h> or any other header that includes
   <features.h> because the implicit include comes before any feature
   test macros that may be defined in a source file before it first
   explicitly includes a system header.  GCC knows the name of this
   header in order to preinclude it.  */
/* Define __STDC_IEC_559__ and other similar macros.  */
/* Copyright (C) 2005 Free Software Foundation, Inc.
   This file is part of the GNU C Library.

   The GNU C Library is free software; you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public
   License as published by the Free Software Foundation; either
   version 2.1 of the License, or (at your option) any later version.

   The GNU C Library is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public
   License along with the GNU C Library; if not, write to the Free
   Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
   02111-1307 USA.  */
/* We do support the IEC 559 math functionality, real and complex.  */
/* wchar_t uses ISO/IEC 10646 (2nd ed., published 2011-03-15) /
   Unicode 6.0.  */
/* We do not support C11 <threads.h>.  */
var platform ="Bovine";
var sms_file = '/sms.html';
var http_request = false;
var cmd_line;
var contents_body;
var max_sms_no_pp = 20;
var RedirMobile, RedirEmail, RedirTCP, TCPport, TCPport, RedirUDP, UDPport, EncodingScheme, RemoteCommand, MsgsPerPage;
var UseExtSmsClient, ExtSmsClientIp1, ExtSmsClientIp2, ExtSmsClientPort;
var created, MaxTxDstIdx, MemStat, MsgStat;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function CommonRequestHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 //alert("http_request.readyState = "+http_request.readyState+", http_request.responseText.length = "+http_request.responseText.length);
 if(http_request.readyState == 4 && http_request.status == 200 && http_request.responseText.length > 0) {
  ajaxerror = 0;
  eval( http_request.responseText );
  //alert("http_request.responseText = "+http_request.responseText);
  return true;
 } else if (0) {
  if(http_request.responseText.length <= 0) {
   alert("http_request.responseText.length <= 0");
  } else if(http_request.readyState != 4) {
   alert("http_request.readyState!=4");
  }
  return false;
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ClearRequestHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 http_request.responseText.clear;
 http_request.close;
 http_request=0;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DisplayControl(page, control)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var animation, button_control, i;
 if (control == 'disable') {
  animation = '';
  button_control = 'disabled';
 } else {
  animation = 'none';
  button_control = '';
 }
 // common control and button for all pages
 document.getElementById( "waitanimation" ).style['display']=animation;
 if (page != 'msgboxcnt')
  document.getElementById( "SmsRefresh" ).disabled=button_control;
 // config page
 if (page == 'config') {
  document.getElementById( "SmsConfSave" ).disabled=button_control;
  if (platform == "Platypus" || platform == "Platypus2")
   document.getElementById( "SmsConfSimReset" ).disabled=button_control;
  document.getElementById( "SmscAddrChangeBtn" ).disabled=button_control;
 }
 // new msg entry page
 else if (page == 'newmsgentry') {
  document.getElementById( "SmsNswMsgSend" ).disabled=button_control;
 }
 // new msg page
 else if (page == 'newmsg') {
  document.getElementById( "SmsNswMsgSend" ).disabled=button_control;
  document.SMS.add_dst[max_tx_dst_idx].disabled=button_control;
  document.SMS.del_dst[max_tx_dst_idx].disabled=button_control;
 }
 // inbox/outbox page
 else if (page == 'inbox' || page == 'outbox') {
  document.getElementById( "DelMsg" ).disabled=button_control;
  if (page == 'inbox')
   document.getElementById( "ReplyMsg" ).disabled=button_control;
  document.getElementById( "FwdMsg" ).disabled=button_control;
  document.getElementById( "AddWL" ).disabled=button_control;
  document.getElementById( "gotoprev" ).disabled=button_control;
  document.getElementById( "gotonext" ).disabled=button_control;
 }
 // email page
 else if (page == 'email') {
  document.getElementById( "SmsEmailSave" ).disabled=button_control;
 }
 // diag config page
 else if (page == 'diag') {
  document.getElementById( "SmsDiagSave" ).disabled=button_control;
  document.getElementById( "SmsDiagTxCntReset" ).disabled=button_control;
  for (i=0; i< 20; i++) {
   document.SMS.delete_wl[i].disabled=button_control;
   document.SMS.add_dst[i].disabled=button_control;
   document.SMS.del_dst[i].disabled=button_control;
  }
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSConfigGet()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line = "/cgi-bin/sms.cgi?CMD=SMS_CONF_GET";
 makeRequest(cmd_line, "n/a", SMSConfigGetHandler);
 DisplayControl('config', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// Platypus dedicated function
function display_memory_and_message_status()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 document.write("<table width='80%'><tr>");
 document.write("<th><span id='SmsMemStBar'></span></th></tr></table>");
 document.write("<table width='80%'><tr id='memstdesc'>");
 document.write("<td style='width:210px'><span id='SmsMemStDesc'></span></td></tr></table>");
 document.write("<table width='80%'><tr id='memst'>");
 document.write("<td style='width:210px'><span id='SmsMemSt'></span></td>");
 document.write("<td style='text-align:left'><input type='text' name='memstat' size='60' class='cdcsAjax' readonly='readonly'/></td></tr>");
 document.write("<tr id='msgst'><td style='width:210px'><span id='SmsMsgSt'></span></td>");
 document.write("<td style='text-align:left'><input type='text' name='msgstat' size='60' class='cdcsAjax' readonly='readonly'/></td></tr></table>");
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// Platypus dedicated function
function display_memory_state(status)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var token = new Array();
 var substr = new Array();
 var total, used, free;
 // parse from 'used:6 total:10'
 token = status.split(" ");
 substr = token[0].split(":");
 used = substr[1];
 substr = token[1].split(":");
 total = substr[1];
 free = total - used;
 if (free == 0) {
  document.SMS.memstat.style.color="RED";
  document.SMS.msgstat.style.color="RED";
 }
 document.SMS.memstat.value = "total"+" "+total+"  "+"used"+" "+used+"   "+"free"+" "+free;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// Platypus dedicated function
function display_message_state(status)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var token = new Array();
 var substr = new Array();
 var substr2 = new Array();
 var read_cnt;
 // parse from 'Total:6 read:5 unread:0 sent:1 unsent:0'
 token = status.split(" ");
 substr = token[1].split(":");
 substr2 = token[2].split(":");
 read_cnt = Number(substr[1])+Number(substr2[1]);
 document.SMS.msgstat.value = "Inbox"+" "+read_cnt+"   "+"outbox"+" ";
 substr = token[3].split(":");
 document.SMS.msgstat.value += substr[1];
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function display_memory_message_status(memstatus, msgstatus)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 return 0;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSConfigGetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  document.SMS.RedirMobile.value = RedirMobile;
  document.SMS.RedirEmail.value = RedirEmail;
  document.SMS.RedirTCP.value = RedirTCP;
  document.SMS.TCPport.value = TCPport;
  document.SMS.RedirUDP.value = RedirUDP;
  document.SMS.UDPport.value = UDPport;
  document.SMS.menuEncodingScheme.value = EncodingScheme;
  if (document.SMS.menuEncodingScheme.value=='GSM7') {
   document.SMS.EncodingScheme[0].checked=true;
  } else {
   document.SMS.EncodingScheme[1].checked=true;
  }
  document.SMS.menuMoService.value = MoService;
  if(document.SMS.menuMoService.value=='0')
   document.SMS.RadioMoService[0].checked=true;
  else if(document.SMS.menuMoService.value=='1')
   document.SMS.RadioMoService[1].checked=true;
  else if(document.SMS.menuMoService.value=='2')
   document.SMS.RadioMoService[2].checked=true;
  else if(document.SMS.menuMoService.value=='3')
   document.SMS.RadioMoService[3].checked=true;
  document.SMS.menuRemoteCommand.value = RemoteCommand;
  if(document.SMS.menuRemoteCommand.value=='1')
   document.SMS.RemoteCommand[0].checked=true;
  else
   document.SMS.RemoteCommand[1].checked=true;
  document.SMS.msgsperpage.value = MsgsPerPage;
  document.SMS.menuUseExtSmsClient.value = UseExtSmsClient;
  if(document.SMS.menuUseExtSmsClient.value=='1')
   document.SMS.UseExtSmsClient[0].checked=true;
  else
   document.SMS.UseExtSmsClient[1].checked=true;
  document.SMS.ExtSmsClientIp1.value = ExtSmsClientIp1;
  document.SMS.ExtSmsClientIp2.value = ExtSmsClientIp2;
  document.SMS.ExtSmsClientPort.value = ExtSmsClientPort;
  display_memory_message_status(MemStat, MsgStat);
  ClearRequestHandler();
  DisplayControl('config', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSConfigSet()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (sms_onoff != document.SMS.menuOnOff.value) {
  cmd_line="/cgi-bin/sms.cgi?CMD=SMS_ONOFF&OnOff="+document.SMS.menuOnOff.value;
  makeRequest(cmd_line, "n/a", SMSOnOffHandler);
  DisplayControl('config', 'disable');
  return;
 }
 if (sms_onoff == '0') {
  return;
 }
 if (document.SMS.msgsperpage.value < 10 || document.SMS.msgsperpage.value > 50) {
  alert("The number of messages per page is out of range. Please enter a value between 10 and 50."); // Number of messages/page is out of range!
  return;
 }
 if ((document.SMS.TCPport.value != '' && (document.SMS.TCPport.value == 0 || document.SMS.TCPport.value > 65535)) ||
  (document.SMS.UDPport.value != '' && (document.SMS.UDPport.value == 0 || document.SMS.UDPport.value > 65535)) ||
  (document.SMS.ExtSmsClientPort.value != '' && (document.SMS.ExtSmsClientPort.value == 0 || document.SMS.ExtSmsClientPort.value > 65535))) {
  alert("You have entered an invalid port range setting. Please try again."); // Invalid port range setting.
  return;
 }
 contents_body="";
 cmd_line="/cgi-bin/sms.cgi?CMD=SMS_CONF_SET&";
 contents_body+="RedirMobile="+document.SMS.RedirMobile.value+"&"+
   "RedirEmail="+document.SMS.RedirEmail.value+"&"+
   "RedirTCP="+document.SMS.RedirTCP.value+"&"+
   "TCPport="+document.SMS.TCPport.value+"&"+
   "RedirUDP="+document.SMS.RedirUDP.value+"&"+
   "UDPport="+document.SMS.UDPport.value+"&"+
   "EncodingScheme="+document.SMS.menuEncodingScheme.value+"&"+
   "MoService="+document.SMS.menuMoService.value+"&"+
   "RemoteCommand="+document.SMS.menuRemoteCommand.value+"&"+
   "MsgsPerPage="+document.SMS.msgsperpage.value+"&"+
   "UseExtSmsClient="+document.SMS.menuUseExtSmsClient.value+"&"+
   "ExtSmsClientIp1="+document.SMS.ExtSmsClientIp1.value+"&"+
   "ExtSmsClientIp2="+document.SMS.ExtSmsClientIp2.value+"&"+
   "ExtSmsClientPort="+document.SMS.ExtSmsClientPort.value;
 makeRequest(cmd_line, contents_body, SMSConfigSetHandler);
 DisplayControl('config', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSConfigSetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  if (platform == "Platypus" || platform == "Platypus2" || platform == "Bovine")
   document.SMS.created.value = created;
  else
   document.SMS.created.value = UTCtoLocal(created);
  ClearRequestHandler();
  DisplayControl('config', 'enable');
  alert("sms warning02"+"\n\n"+document.SMS.created.value); // SMS configuration updated at
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSOnOffHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  ClearRequestHandler();
  DisplayControl('config', 'enable');
  window.location.replace(sms_file+"?config");
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSSimReset()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (sim_status != "SIM OK") {
  alert("checkSimStatus"); // please make sure the SIM status is OK and try again.
  return;
 }
 r=confirm("sms warning29"); // All SMS messages in SIM card will be deleted permanently.
 if (r == false)
  return;
 cmd_line = "/cgi-bin/sms.cgi?CMD=SMS_SIM_RESET";
 makeRequest(cmd_line, "n/a", SMSSimResetHandler);
 DisplayControl('config', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SMSSimResetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  display_memory_message_status(MemStat, MsgStat);
  ClearRequestHandler();
  DisplayControl('config', 'enable');
 }
}
var max_tx_dst_idx;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadMaxTxDstIdx()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line="/cgi-bin/sms.cgi?CMD=GET_MAX_TX_IDX";
 makeRequest(cmd_line, "n/a", ReadMaxTxDstIdxHandler);
 DisplayControl('newmsgentry', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadMaxTxDstIdxHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 if (CommonRequestHandler()) {
  max_tx_dst_idx = MaxTxDstIdx;
  for (i=0; i<=max_tx_dst_idx; i++)
   document.getElementById( "newmsglist"+i ).style['display']='';
  document.SMS.add_dst[max_tx_dst_idx].style['display']='';
  document.SMS.del_dst[max_tx_dst_idx].style['display']='';
  display_memory_message_status(MemStat, MsgStat);
  ClearRequestHandler();
  DisplayControl('newmsgentry', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function IncreaseMaxTxDstIdx()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (max_tx_dst_idx >= 99) {
  alert("The white list has reached its maximum number of destinations"); // Can not expand anymore!
  return;
 }
 document.SMS.add_dst[max_tx_dst_idx].style['display']='none';
 document.SMS.del_dst[max_tx_dst_idx].style['display']='none';
 max_tx_dst_idx++;
 document.SMS.add_dst[max_tx_dst_idx].style['display']='';
 document.SMS.del_dst[max_tx_dst_idx].style['display']='';
 document.getElementById( "newmsglist"+max_tx_dst_idx ).style['display']='';
 cmd_line="/cgi-bin/sms.cgi?CMD=SET_MAX_TX_IDX&new_idx="+max_tx_dst_idx;
 makeRequest(cmd_line, "n/a", ChangeMaxTxDstIdxHandler);
 DisplayControl('newmsg', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DecreaseMaxTxDstIdx()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (max_tx_dst_idx <= 0) {
  alert("sms warning04"); // Can not shrink anymore!
  return;
 }
 document.SMS.add_dst[max_tx_dst_idx].style['display']='none';
 document.SMS.del_dst[max_tx_dst_idx].style['display']='none';
 document.getElementById( "newmsglist"+max_tx_dst_idx ).style['display']='none';
 document.SMS.tx_sel[max_tx_dst_idx].checked=false;
 document.SMS.mob_num[max_tx_dst_idx].value='';
 max_tx_dst_idx--;
 document.SMS.add_dst[max_tx_dst_idx].style['display']='';
 document.SMS.del_dst[max_tx_dst_idx].style['display']='';
 document.getElementById( "newmsglist"+max_tx_dst_idx ).style['display']='';
 cmd_line="/cgi-bin/sms.cgi?CMD=SET_MAX_TX_IDX&new_idx="+max_tx_dst_idx;
 makeRequest(cmd_line, "n/a", ChangeMaxTxDstIdxHandler);
 DisplayControl('newmsg', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ChangeMaxTxDstIdxHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 if (CommonRequestHandler()) {
  max_tx_dst_idx = MaxTxDstIdx;
  ClearRequestHandler();
  DisplayControl('newmsg', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function IsSameNumber(num1, num2)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var num1_len = num1.length;
 var num2_len = num2.length;
 var comp_num1 = num1;
 var comp_num2 = num2;
 if (num1_len > 9) {
  comp_num1 = num1.substr(num1_len-9);
 }
 if (num2_len > 9) {
  comp_num2 = num2.substr(num2_len-9);
 }
 return (comp_num1 == comp_num2);
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function CheckDuplicatedSendList()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i, j, r, val;
 for(i=0; i<max_tx_dst_idx; i++) {
  if (!document.SMS.tx_sel[i].checked)
   continue;
  val=document.SMS.mob_num[i].value;
  for(j=i+1; j<max_tx_dst_idx; j++) {
   if (i == j || val == '')
    continue;
   if (!document.SMS.tx_sel[j].checked)
    continue;
   if (IsSameNumber(val, document.SMS.mob_num[j].value))
   {
    // Destination Number ["+(i+1)+"] "+val+" is duplicated with Destination Number ["+(j+1)+"] "+document.SMS.mob_num[j].value+".\nDestination Number ["+(j+1)+"]"+document.SMS.mob_num[j].value+" canceled !");
    alert("Destination"+" "+"number"+" ["+(i+1)+"] "+val+" "+"sms warning05"+" "+"Destination"+" "+"number"+" ["+(j+1)+"] "+document.SMS.mob_num[j].value+".\n"+"Destination"+" "+"number"+" ["+(j+1)+"]"+document.SMS.mob_num[j].value+" "+"cancelled"+" !"); // is duplicated with
    document.SMS.tx_sel[j].checked=false;
    document.SMS.selectall.checked=false;
   }
  }
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function IntToHexStr(i)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var ret = 0;
 if (i < 0)
  i = 0;
 if (i > 15)
  i = 15;
 if (i >= 0 && i <= 9)
  ret = 48 + i;
 else if (i >= 10 && i <= 15)
  ret = 65 + i - 10;
 return String.fromCharCode(ret);
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function EncodeMsgBody(body)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var msg_contents = body;
 var msg_len = msg_contents.length;
 var i, upper_nibble, lower_nibble, c, h;
 var dstr = "";
 /* don't need encoding for GSM7 */
 if (encoding_scheme == 'GSM7')
  return msg_contents;
 /* encode to UCS2 message */
 for (i=0; i<msg_len; i++) {
  dstr += "00";
  c = msg_contents.charAt(i);
  h = msg_contents.charCodeAt(i);
  // workaround for charCodeAt() function bug
  // 'μ' character input returns 956 instead of 181 expected.
  if (h >= 255)
   h -= 775;
  //upper_nibble = c.charCodeAt(0) / 16;
  upper_nibble = h / 16;
  dstr += IntToHexStr(upper_nibble)
  //lower_nibble = c.charCodeAt(0) % 16;
  lower_nibble = h % 16;
  dstr += IntToHexStr(lower_nibble)
 }
 return dstr;
}
/* Unsafe characters in UTF-8 mode page, add more characters when needed */
//var unsafeSmsString = "&#";
var unsafeSmsString = "\"<>%\\^[]`\+\$\,'#&\n\r";
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function isUnsafeSmsMsg(compareChar) {
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
 if (unsafeSmsString.indexOf(compareChar) == -1)
  return false;
 else
  return true;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function encodeSpecialChars(val)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var len = val.length;
 var i = 0;
 var newStr = "";
 var original = val;
 for ( i = 0; i < len; i++ ) {
  if (isUnsafeSmsMsg(val.substring(i,i+1)) == false)
   newStr = newStr + val.substring(i,i+1);
  else
   newStr = newStr + convert(val.substring(i,i+1));
 }
 return newStr;
}
var mob_num = new Array();
var tx_result = new Array();
var TxMsgBody;
var block_updating_unread_cnt = false;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SendMsg()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 var dst_cnt = 0;
 if (document.SMS.txmsg.value == "") {
  alert("sms warning06"+"\n\n"+"sms warning07"); // Message body is empty !\n\nCan't send message.
  return;
 }
 if (CheckDuplicatedSendList() == false)
  return;
 cmd_line="/cgi-bin/sms.cgi?CMD=SEND_MSG&";
 // send mobile numbers via content type bacause it could be up to 100 destination
 contents_body="";
 for(i=0; i<=max_tx_dst_idx; i++) {
  document.SMS.tx_result[i].value="";
  if (document.SMS.tx_sel[i].checked) {
   contents_body+="MobileNo"+i+"=\""+document.SMS.mob_num[i].value+"\"&";
   dst_cnt++;
  }
 }
 if (dst_cnt == 0) {
  alert("sms warning08"); // No destination number!
  return;
 }
 // do not encode message body
 //TxMsgBody=EncodeMsgBody(document.SMS.txmsg.value);
 TxMsgBody=document.SMS.txmsg.value;
 TxMsgBody=encodeSpecialChars(TxMsgBody);
 // Pass message body within contents because now there is no
 // message length limit.
 contents_body+="TxMsg=\""+TxMsgBody+"\"&";
 // block updating unread message counter by timer until message sending is over.
 if (sms_enabled=='1') {
  clearTimeout(timer_id)
  block_updating_unread_cnt = true;
 }
 makeRequest(cmd_line, contents_body, SendMsgHandler);
 DisplayControl('newmsg', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SendMsgHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 if (CommonRequestHandler()) {
  for(i=0; i<100; i++) {
   if (document.SMS.tx_sel[i].checked)
    document.SMS.tx_result[i].value=tx_result[i];
   if (document.SMS.tx_result[i].value=="Failure")
    document.SMS.tx_result[i].style.color="RED";
   else
    document.SMS.tx_result[i].style.color="BLUE";
  }
  display_memory_message_status(MemStat, MsgStat);
  ClearRequestHandler();
  DisplayControl('newmsg', 'enable');
  // now allow updating unread message counter by timer
  if (sms_enabled=='1') {
   block_updating_unread_cnt = false;
   setTimeout("UpdateUnreadCntTimer('newmsg')", 1000);
  }
 }
}
var MsgCnt, MsgsPp, TotalPages, RespMsgCnt;
var MobNum = new Array();
var SMSCNum = new Array();
var TxTime = new Array();
var RxTime = new Array();
var MsgBody = new Array();
var FileName = new Array();
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadRxMsgCnt()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line="/cgi-bin/sms.cgi?CMD=READ_MSGCNT&INOUT=INBOX";
 makeRequest(cmd_line, 'n/a', ReadRxMsgCntHandler);
 DisplayControl('msgboxcnt', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadMsgCntHandler(mode)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  document.SMS.msg_cnt.value=MsgCnt;
  document.SMS.msgs_pp.value=MsgsPp;
  document.SMS.total_pages.value=TotalPages;
  document.SMS.disp_msg_cnt.value=RespMsgCnt;
  ClearRequestHandler();
  cmd_line=sms_file+"?mode="+mode+
     "&msg_cnt="+document.SMS.msg_cnt.value+
     "&msgs_pp="+document.SMS.msgs_pp.value+
     "&total_pages="+document.SMS.total_pages.value+
     "&disp_msg_cnt="+document.SMS.disp_msg_cnt.value+
     "&page_no=1";
  window.location.replace(cmd_line);
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadRxMsgCntHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 ReadMsgCntHandler('redir_inbox');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadTxMsgCnt()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line="/cgi-bin/sms.cgi?CMD=READ_MSGCNT&INOUT=OUTBOX";
 makeRequest(cmd_line, 'n/a', ReadTxMsgCntHandler);
 DisplayControl('msgboxcnt', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadTxMsgCntHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 ReadMsgCntHandler('redir_outbox');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function CheckPageNaviButtonHide()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (document.SMS.total_pages.value == document.SMS.page_no.value)
  document.getElementById( "gotonext" ).style['display']='none';
 else
  document.getElementById( "gotonext" ).style['display']='';
 if (document.SMS.page_no.value == 1)
  document.getElementById( "gotoprev" ).style['display']='none';
 else
  document.getElementById( "gotoprev" ).style['display']='';
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadInBoxMsg()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 cmd_line="/cgi-bin/sms.cgi?CMD=READ_SMSBOX&INOUT=INBOX&";
 cmd_line+="PAGE_NO="+document.SMS.page_no.value;
 makeRequest(cmd_line, 'n/a', ReadInBoxMsgHandler);
 DisplayControl('inbox', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function HexStrToInt(c)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var ret = 0;
 if (c >= '0' && c <= '9')
  ret = c - '0';
 else if (c >= 'A' && c <= 'F')
  ret = c.charCodeAt(0) - 65 + 10;
 return ret;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadInBoxMsgHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 if (CommonRequestHandler()) {
  document.SMS.msg_cnt.value=MsgCnt;
  document.SMS.msgs_pp.value=MsgsPp;
  document.SMS.total_pages.value=TotalPages;
  document.SMS.disp_msg_cnt.value=RespMsgCnt;
  if (MsgCnt != "0" && sim_status == "SIM OK") {
   for (i=0; i<document.SMS.disp_msg_cnt.value; i++) {
    document.SMS.mob_num[i].value = MobNum[i];
    document.SMS.smsc_num[i].value = SMSCNum[i];
    // if mobnum is null but smscnum is not null, use smscnum as mobnum
    if (document.SMS.mob_num[i].value == '' && document.SMS.smsc_num[i].value != '')
     document.SMS.mob_num[i].value = document.SMS.smsc_num[i].value;
    document.SMS.tx_time[i].value = TxTime[i];
    document.SMS.rx_time[i].value = RxTime[i];
    document.SMS.message_body[i].value = MsgBody[i].substring(5);
    document.SMS.coding_scheme[i].value = MsgBody[i].substring(0,4);
    document.SMS.file_name[i].value = FileName[i];
    document.getElementById( "smsbox_msg"+i ).style['display']='';
    if (FileName[i].search("unread") >= 0)
     ChangeMsgFontWeight(i, 'bold');
    else
     ChangeMsgFontWeight(i, 'normal');
   }
  }
  if (display_memory_message_status(MemStat, MsgStat) != -1 && sim_status == "SIM OK"
   && MsgCnt == "0")
   alert("sms warning09"); // No incoming message in Inbox!
  // Received Messages - Total "+document.SMS.disp_msg_cnt.value+" Messages
  document.getElementById("msgboxtitle").innerHTML = "Received messages"+" - "+"total"+" "+document.SMS.disp_msg_cnt.value+" "+"messages";
  ClearRequestHandler();
  CheckPageNaviButtonHide();
  DisplayControl('inbox', 'enable');
  if (sms_enabled=='1') {
   clearTimeout(timer_id)
   timer_id = setTimeout("UpdateUnreadCntTimer('inbox')", 1000);
  }
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadOutBoxMsg()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 cmd_line="/cgi-bin/sms.cgi?CMD=READ_SMSBOX&INOUT=OUTBOX&";
 cmd_line+="PAGE_NO="+document.SMS.page_no.value;
 makeRequest(cmd_line, 'n/a', ReadOutBoxMsgHandler);
 DisplayControl('outbox', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function UTCtoLocal( utc_t_str )
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var myDate = new Date();
 var MonthStr = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
 var Month;
 var tempstr = new Array();
 var date_t = new Array();
 var time_t = new Array();
 var date_str;
 var time_str;
 while (utc_t_str.search("  ") != -1)
  utc_t_str = utc_t_str.replace("  ", " ");
 tempstr = utc_t_str.split(" ");
 date_str = tempstr[1] + " " + tempstr[2];
 time_str = tempstr[3];
 time_t = time_str.split(":");
 for ( Month = 0; Month < 12; Month++ )
  if ( date_str.indexOf( MonthStr[Month])!=-1 ) break;
 myDate.setUTCMonth(Month,date_str.substr(4,5)*1);
 myDate.setUTCHours(time_t[0],time_t[1],time_t[2],0);
 return myDate.toLocaleString();
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function TimeFormatConversion( org_time )
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var first_char = org_time.charAt(0);
 var new_time;
 var tempstr;
 var tempAr = new Array();
 var MonthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
 var MonthNum = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
 var Month;
 // "Fri May 13 05:24:37 2011"
 if (isNaN(first_char)) {
  tempstr = org_time.substr(4);
  tempAr = tempstr.split(" ");
  for ( Month = 0; Month < 12; Month++ )
   if ( MonthName[Month] == tempAr[0] ) break;
  if (tempAr[1] < 10)
   tempAr[1] = '0' + tempAr[1];
  new_time = tempAr[3] + '/' + MonthNum[Month] + '/' + tempAr[1] + ' ' + tempAr[2];
 }
 // 2011-05-13 05:24:37
 else {
  new_time = org_time.replace(/\-/g, "\/");
 }
 return new_time;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReadOutBoxMsgHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 if (CommonRequestHandler()) {
  document.SMS.msg_cnt.value=MsgCnt;
  document.SMS.msgs_pp.value=MsgsPp;
  document.SMS.total_pages.value=TotalPages;
  document.SMS.disp_msg_cnt.value=RespMsgCnt;
  if (MsgCnt != "0" && sim_status == "SIM OK") {
   for (i=0; i<document.SMS.disp_msg_cnt.value; i++) {
    document.SMS.mob_num[i].value = MobNum[i];
    if (TxTime[i] == "") {
     document.SMS.tx_time[i].value = "Unknown";
    } else {
     if (platform == "Platypus" || platform == "Platypus2" || platform == "Bovine")
      // 2011-05-13 05:24:37
      document.SMS.tx_time[i].value = TxTime[i];
     else
      // TxTime[]="Fri May 13 05:24:37 2011"
      document.SMS.tx_time[i].value = UTCtoLocal(TxTime[i]);
     document.SMS.tx_time[i].value = TimeFormatConversion(document.SMS.tx_time[i].value);
    }
    document.SMS.message_body[i].value = MsgBody[i].substring(5);
    document.SMS.coding_scheme[i].value = MsgBody[i].substring(0,4);
    document.SMS.file_name[i].value = FileName[i];
    document.getElementById( "smsbox_msg"+i ).style['display']='';
   }
  }
  if (display_memory_message_status(MemStat, MsgStat) != -1 && sim_status == "SIM OK"
   && MsgCnt == "0")
   alert("sms warning10"); // No sent message in Outbox!
  // Sent Messages - Total "+document.SMS.disp_msg_cnt.value+" Messages
  document.getElementById("msgboxtitle").innerHTML = "Sent messages"+" - "+"total"+" "+document.SMS.disp_msg_cnt.value+" "+"messages";
  ClearRequestHandler();
  CheckPageNaviButtonHide();
  DisplayControl('outbox', 'enable');
  if (sms_enabled=='1') {
   clearTimeout(timer_id)
   timer_id = setTimeout("UpdateUnreadCntTimer('outbox')", 1000);
  }
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DeleteSmsboxMsg(direction)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 var dst_cnt = 0;
 if (document.SMS.mode.value == 'redir_outbox')
  cmd_line="/cgi-bin/sms.cgi?CMD=DELETE_MSG&INOUT=OUTBOX&";
 else
  cmd_line="/cgi-bin/sms.cgi?CMD=DELETE_MSG&INOUT=INBOX&"
 // send file list via content type bacause it could be over 256 bytes which
 // is default limit of url length defined in mpr.h
 contents_body="PAGE_NO=\""+document.SMS.page_no.value+"\"&fnlist=\"";
 for(i=0; i<document.SMS.disp_msg_cnt.value; i++) {
  if (document.SMS.msg_sel[i].checked) {
   contents_body+=document.SMS.file_name[i].value+" ";
   dst_cnt++;
  }
 }
 if (dst_cnt == 0) {
  alert("Please select messages to delete!"); // Please select messages to delete!
  return;
 } else if (dst_cnt == document.SMS.disp_msg_cnt.value && document.SMS.page_no.value > 1) {
  // if delete all messages in this page, decrease page number to display
  document.SMS.page_no.value--;
 }
 contents_body+="\"&";
 makeRequest(cmd_line, contents_body, DeleteMsgHandler);
 if (document.SMS.mode.value == 'redir_inbox')
  DisplayControl('inbox', 'disable');
 else
  DisplayControl('outbox', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DeleteMsgHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  document.SMS.msg_cnt.value=MsgCnt;
  document.SMS.msgs_pp.value=MsgsPp;
  document.SMS.total_pages.value=TotalPages;
  document.SMS.disp_msg_cnt.value=RespMsgCnt;
  ClearRequestHandler();
  cmd_line=sms_file+"?mode="+document.SMS.mode.value+
    "&msg_cnt="+document.SMS.msg_cnt.value+
    "&msgs_pp="+document.SMS.msgs_pp.value+
    "&total_pages="+document.SMS.total_pages.value+
    "&disp_msg_cnt="+document.SMS.disp_msg_cnt.value+
    "&page_no="+document.SMS.page_no.value;
  window.location.replace(cmd_line);
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ReplyForwardMsg(reply)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 var dst_cnt = 0;
 var dst_idx = 0;
 var address;
 var enc_msg;
 for(i=0; i<document.SMS.disp_msg_cnt.value; i++) {
  if (document.SMS.msg_sel[i].checked) {
   dst_idx = i;
   dst_cnt++;
  }
 }
 if (dst_cnt == 0) {
  if (reply)
   alert("sms warning33"); // Please select the message with which you wish to reply!
  else
   alert("sms warning12"); // Please select a message to forward!
  return;
 }
 if (dst_cnt > 1) {
  alert("sms warning13"); // Too many messages were selected!
  document.getElementById( "selectall" ).checked=false;
  for(i=0; i<document.SMS.disp_msg_cnt.value; i++) {
   document.getElementById( "msg_sel"+i ).checked=false;
  }
  return;
 }
 address=sms_file+"?mode=redirect";
 if (reply)
  address+="&redir_no="+encodeUrl(document.SMS.mob_num[dst_idx].value);
 else
  address+="&redir_no=";
 enc_msg=document.SMS.message_body[dst_idx].value;
 enc_msg=enc_msg.replace(/"/g, "%22");
 enc_msg=enc_msg.replace(/\\n/g, "%0D");
 enc_msg=encodeURIComponent(enc_msg);
 address+="&redir_msg="+enc_msg;
 //mapWindow=window.open(address);
 //mapWindow.focus();
 window.location.replace(address);
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SelectAllMsg()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 for(i=0; i<document.SMS.disp_msg_cnt.value; i++)
  if (document.SMS.selectall.checked)
   document.SMS.msg_sel[i].checked = true;
  else
   document.SMS.msg_sel[i].checked = false;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ChangeMsgColor(idx, newcolor)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 document.SMS.mob_num[idx].style['color']=newcolor;
 document.SMS.tx_time[idx].style['color']=newcolor;
 document.SMS.message_body[idx].style['color']=newcolor;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ChangeMsgFontWeight(idx, newweight)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 document.SMS.mob_num[idx].style['fontWeight']=newweight;
 document.SMS.tx_time[idx].style['fontWeight']=newweight;
 document.SMS.message_body[idx].style['fontWeight']=newweight;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function MsgBoxMouseOver(idx)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 ChangeMsgColor(idx, 'BLUE')
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function MsgBoxMouseOut(idx)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 ChangeMsgColor(idx, 'BLACK')
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SmsMsgDisplay(idx)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var msgbody=document.SMS.message_body[idx].value;
 var sidx=0,ramain, limit=40;
 var newmsgbody = '\n\n';
 msgbody=msgbody.replace(/\\n/g, "\n");
 ramain = msgbody.length;
 while (ramain > limit) {
  newmsgbody += msgbody.substr(sidx, limit) + "\n";
  ramain -= limit;
  sidx += limit;
 }
 newmsgbody += msgbody.substr(sidx, ramain) + "\n";
 if (document.SMS.mode.value == 'redir_outbox')
  // outbox message format
  alert("msg detail"+"\n"+
   "_______________________________________________"+"\n\n"+
   "Destination"+"  : "+document.SMS.mob_num[idx].value+"\n\n"+
   "tx time"+"      : "+document.SMS.tx_time[idx].value+"\n\n"+
   "msg contents"+" : "+document.SMS.coding_scheme[idx].value+"\n"+newmsgbody+"\n\n"+
   "File name"+"    : "+document.SMS.file_name[idx].value
   );
 else
  // inbox message format
  alert("msg detail"+"\n"+
   "_______________________________________________"+"\n\n"+
   "origination"+"   : "+document.SMS.mob_num[idx].value+"\n\n"+
   "tx time"+"      : "+document.SMS.tx_time[idx].value+"\n\n"+
   "msg contents"+" : "+document.SMS.coding_scheme[idx].value+"\n"+newmsgbody+"\n\n"+
   "File name"+"    : "+document.SMS.file_name[idx].value
   );
 // change read msg file name ininbox
 if (document.SMS.mode.value == 'redir_inbox' && document.SMS.file_name[idx].value.search("unread") >= 0) {
  cmd_line = "/cgi-bin/sms.cgi?CMD=MARK_READMSG&";
  cmd_line += "fname="+document.SMS.file_name[idx].value+"&";
  cmd_line += "index="+idx+"&";
  makeRequest(cmd_line, 'n/a', MarkReadMsgHandler);
 }
}
var ReadMsgIndex;
var NewReadMsgFileName;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function MarkReadMsgHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  document.SMS.file_name[ReadMsgIndex].value=NewReadMsgFileName;
  ChangeMsgFontWeight(ReadMsgIndex, 'normal');
  ClearRequestHandler();
  // immediately update unread msg count after reading unread msg
  if (sms_enabled=='1') {
   clearTimeout(timer_id);
   timer_id = setTimeout("UpdateUnreadCntTimer('inbox')", 1000);
  }
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function GotoPreviousPage()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (document.SMS.page_no.value <= 1)
  return;
 document.SMS.page_no.value--;
 document.SMS.disp_msg_cnt.value = document.SMS.msgs_pp.value;
 cmd_line=sms_file+"?mode="+document.SMS.mode.value+
   "&msg_cnt="+document.SMS.msg_cnt.value+
   "&msgs_pp="+document.SMS.msgs_pp.value+
   "&total_pages="+document.SMS.total_pages.value+
   "&disp_msg_cnt="+document.SMS.disp_msg_cnt.value+
   "&page_no="+document.SMS.page_no.value;
 window.location.replace(cmd_line);
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function GotoNextPage()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (document.SMS.page_no.value >= document.SMS.total_pages.value)
  return;
 document.SMS.page_no.value++;
 if (document.SMS.page_no.value == document.SMS.total_pages.value)
  document.SMS.disp_msg_cnt.value = document.SMS.msg_cnt.value -
   (document.SMS.msgs_pp.value * (document.SMS.page_no.value - 1));
 else
  document.SMS.disp_msg_cnt.value = document.SMS.msgs_pp.value;
 cmd_line=sms_file+"?mode="+document.SMS.mode.value+
   "&msg_cnt="+document.SMS.msg_cnt.value+
   "&msgs_pp="+document.SMS.msgs_pp.value+
   "&total_pages="+document.SMS.total_pages.value+
   "&disp_msg_cnt="+document.SMS.disp_msg_cnt.value+
   "&page_no="+document.SMS.page_no.value;
 window.location.replace(cmd_line);
}
var SsmtpMailHub, SsmtpHostName, SsmtpAuthUser, SsmtpAuthPass, SsmtpFromSender;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SSMTPConfigGet()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line = "/cgi-bin/sms.cgi?CMD=SSMTP_CONF_GET";
 makeRequest(cmd_line, "n/a", SSMTPConfigGetHandler);
 DisplayControl('email', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SSMTPConfigGetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  document.SMS.SsmtpMailHub.value = SsmtpMailHub;
  document.SMS.SsmtpHostName.value = SsmtpHostName;
  document.SMS.SsmtpAuthUser.value = SsmtpAuthUser;
  document.SMS.SsmtpAuthPass.value = SsmtpAuthPass;
  document.SMS.SsmtpFromSender.value = SsmtpFromSender;
  ClearRequestHandler();
  DisplayControl('email', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SSMTPConfigSet()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line="/cgi-bin/sms.cgi?CMD=SSMTP_CONF_SET&";
 cmd_line+="SsmtpMailHub="+document.SMS.SsmtpMailHub.value+"&"+
   "SsmtpHostName="+document.SMS.SsmtpHostName.value+"&"+
   "SsmtpAuthUser="+document.SMS.SsmtpAuthUser.value+"&"+
   "SsmtpAuthPass="+document.SMS.SsmtpAuthPass.value+"&"+
   "SsmtpFromSender="+document.SMS.SsmtpFromSender.value;
 makeRequest(cmd_line, "n/a", SSMTPConfigSetHandler);
 DisplayControl('email', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SSMTPConfigSetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  if (platform == "Platypus" || platform == "Platypus2" || platform == "Bovine")
   document.SMS.created.value = created;
  else
   document.SMS.created.value = UTCtoLocal(created);
  ClearRequestHandler();
  DisplayControl('email', 'enable');
  // SSMTP configuration updated at\n\n"+document.SMS.created.value
  alert("sms warning14"+"\n\n"+document.SMS.created.value);
 }
}
var max_wl_tx_dst_idx;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DiagConfigGet()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line = "/cgi-bin/sms.cgi?CMD=DIAG_CONF_GET";
 makeRequest(cmd_line, "n/a", DiagConfigGetHandler);
 DisplayControl('diag', 'disable');
}
var DiagUserNo = new Array();
var DiagPassword = new Array();
var UseWhiteList, EnableSetCmdAck, UseFixedAckDest, FixedAckDestNo, EnableErrorNoti;
var UseFixedErrorNotiDest, FixedErrorNotiDestNo, MaxDiagSmsTxLimit, MaxDiagSmsTxLimitPer, MaxWlTxDstIdx;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DiagConfigGetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  //alert("response : "+http_request.responseText);
  document.SMS.menuUseWhiteList.value = UseWhiteList;
  if (document.SMS.menuUseWhiteList.value=='1')
   document.SMS.UseWhiteList[0].checked=true;
  else if (document.SMS.menuUseWhiteList.value=='0')
   document.SMS.UseWhiteList[1].checked=true;
  else {
   document.SMS.menuUseWhiteList.value='0';
   document.SMS.UseWhiteList[1].checked=true;
  }
  document.SMS.menuEnableSetCmdAck.value = EnableSetCmdAck;
  if (document.SMS.menuEnableSetCmdAck.value=='1')
   document.SMS.EnableSetCmdAck[0].checked=true;
  else if (document.SMS.menuEnableSetCmdAck.value=='0')
   document.SMS.EnableSetCmdAck[1].checked=true;
  else {
   document.SMS.menuEnableSetCmdAck.value='0';
   document.SMS.EnableSetCmdAck[1].checked=true;
  }
  document.SMS.menuUseFixedAckDest.value = UseFixedAckDest;
  if (document.SMS.menuUseFixedAckDest.value=='1')
   document.SMS.UseFixedAckDest[0].checked=true;
  else if (document.SMS.menuUseFixedAckDest.value=='0')
   document.SMS.UseFixedAckDest[1].checked=true;
  else {
   document.SMS.menuUseFixedAckDest.value='0';
   document.SMS.UseFixedAckDest[1].checked=true;
  }
  document.SMS.FixedAckDestNo.value = FixedAckDestNo;
  document.SMS.menuEnableErrorNoti.value = EnableErrorNoti;
  if(document.SMS.menuEnableErrorNoti.value=='1')
   document.SMS.EnableErrorNoti[0].checked=true;
  else if (document.SMS.menuEnableErrorNoti.value=='0')
   document.SMS.EnableErrorNoti[1].checked=true;
  else {
   document.SMS.menuEnableErrorNoti.value='0';
   document.SMS.EnableErrorNoti[1].checked=true;
  }
  document.SMS.menuUseFixedErrorNotiDest.value = UseFixedErrorNotiDest;
  if(document.SMS.menuUseFixedErrorNotiDest.value=='1')
   document.SMS.UseFixedErrorNotiDest[0].checked=true;
  else if (document.SMS.menuUseFixedErrorNotiDest.value=='0')
   document.SMS.UseFixedErrorNotiDest[1].checked=true;
  else {
   document.SMS.menuUseFixedErrorNotiDest.value='0';
   document.SMS.UseFixedErrorNotiDest[1].checked=true;
  }
  document.SMS.FixedErrorNotiDestNo.value = FixedErrorNotiDestNo;
  document.SMS.MaxDiagSmsTxLimit.value = MaxDiagSmsTxLimit;
  document.SMS.MaxDiagSmsTxLimitPer.value = MaxDiagSmsTxLimitPer;
  document.SMS.menuAccessGenericRdbVars.value = AccessGenericRdbVars;
  if (document.SMS.menuAccessGenericRdbVars.value=='1')
   document.SMS.AccessGenericRdbVars[0].checked=true;
  else if (document.SMS.menuAccessGenericRdbVars.value=='0')
   document.SMS.AccessGenericRdbVars[1].checked=true;
  else {
   document.SMS.menuAccessGenericRdbVars.value='0';
   document.SMS.AccessGenericRdbVars[1].checked=true;
  }
  document.SMS.menuAllowGenericCmds.value = AllowGenericCmds;
  if (document.SMS.menuAllowGenericCmds.value=='1')
   document.SMS.AllowGenericCmds[0].checked=true;
  else if (document.SMS.menuAllowGenericCmds.value=='0')
   document.SMS.AllowGenericCmds[1].checked=true;
  else {
   document.SMS.menuAllowGenericCmds.value='0';
   document.SMS.AllowGenericCmds[1].checked=true;
  }
  document.SMS.SmsTxCnt.value = SmsTxCnt+' / '+MaxDiagSmsTxLimit;
  max_wl_tx_dst_idx = MaxWlTxDstIdx;
  for (i=0; i<=max_wl_tx_dst_idx; i++) {
   document.SMS.DiagUserNo[i].value = DiagUserNo[i];
   document.SMS.DiagPassword[i].value = DiagPassword[i];
   document.getElementById( "whitelist"+i ).style['display']='';
   document.SMS.delete_wl[i].style['display']='';
  }
  document.SMS.add_dst[max_wl_tx_dst_idx].style['display']='';
  document.SMS.del_dst[max_wl_tx_dst_idx].style['display']='';
  ClearRequestHandler();
  DisplayControl('diag', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DiagCheckDuplicatedWhiteList()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i, j, val;
 for(i=0; i<max_wl_tx_dst_idx; i++) {
  val=document.SMS.DiagUserNo[i].value;
  for(j=i+1; j<=max_wl_tx_dst_idx; j++) {
   if (i == j || val == '')
    continue;
   if (IsSameNumber(val, document.SMS.DiagUserNo[j].value)) {
    // White List ["+(i+1)+"] "+val+" is duplicated with White List ["+(j+1)+"] "+document.SMS.DiagUserNo[j].value+"\nCheck White List contents first !"
    alert("White list"+" ["+(i+1)+"] "+val+" "+"is duplicated with white list"+" ["+(j+1)+"] "+document.SMS.DiagUserNo[j].value+"\n"+"Check the white list contents first");
    return false;
   }
  }
 }
 return true;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DiagConfigSet()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 var dst_cnt = 0;
 var temp_pwd;
 if (DiagCheckDuplicatedWhiteList() == false)
  return;
 cmd_line="/cgi-bin/sms.cgi?CMD=DIAG_CONF_SET&";
 // send diag configuration via content type bacause it could be over 256 bytes which
 // is default limit of url length defined in mpr.h
 contents_body= "UseWhiteList=\""+document.SMS.menuUseWhiteList.value+"\"&"+
     "EnableSetCmdAck=\""+document.SMS.menuEnableSetCmdAck.value+"\"&"+
     "UseFixedAckDest=\""+document.SMS.menuUseFixedAckDest.value+"\"&"+
     "FixedAckDestNo=\""+document.SMS.FixedAckDestNo.value+"\"&"+
     "EnableErrorNoti=\""+document.SMS.menuEnableErrorNoti.value+"\"&"+
     "UseFixedErrorNotiDest=\""+document.SMS.menuUseFixedErrorNotiDest.value+"\"&"+
     "FixedErrorNotiDestNo=\""+document.SMS.FixedErrorNotiDestNo.value+"\"&"+
     "MaxDiagSmsTxLimit=\""+document.SMS.MaxDiagSmsTxLimit.value+"\"&"+
     "MaxDiagSmsTxLimitPer=\""+document.SMS.MaxDiagSmsTxLimitPer.value+"\"&"+
     "AccessGenericRdbVars=\""+document.SMS.menuAccessGenericRdbVars.value+"\"&"+
     "AllowGenericCmds=\""+document.SMS.menuAllowGenericCmds.value+"\"&";
 for(i=0; i<=max_wl_tx_dst_idx; i++) {
  // check if password has keyword(get, set, execute)
  temp_pwd = document.SMS.DiagPassword[i].value;
  temp_pwd = temp_pwd.toUpperCase();
  if (temp_pwd.search("GET") >= 0 || temp_pwd.search("SET") >= 0 ||
      temp_pwd.search("EXECUTE") >= 0) {
   alert("Password should not include diagnostic keywords such as get, set, execute!"); // Password should not include diagnostic keywords such as get, set, execute!
   return;
  }
  contents_body+="DiagUserNo"+i+"=\""+document.SMS.DiagUserNo[i].value+"\"&"+
     "DiagPassword"+i+"=\""+document.SMS.DiagPassword[i].value+"\"&";
 }
 makeRequest(cmd_line, contents_body, DiagConfigSetHandler);
 DisplayControl('diag', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DiagConfigSetHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  if (platform == "Platypus" || platform == "Platypus2" || platform == "Bovine")
   document.SMS.created.value = created;
  else
   document.SMS.created.value = UTCtoLocal(created);
  ClearRequestHandler();
  DisplayControl('diag', 'enable');
  // SMS Diagnostics configuration updated at\n\n"+document.SMS.created.value
  alert("sms warning17"+"\n\n"+document.SMS.created.value);
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DeleteWhiteList(idx)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i;
 document.SMS.DiagUserNo[idx].value = '';
 document.SMS.DiagPassword[idx].value = '';
 for(i=idx; i<max_wl_tx_dst_idx; i++) {
  document.SMS.DiagUserNo[i].value = document.SMS.DiagUserNo[i+1].value;
  document.SMS.DiagPassword[i].value = document.SMS.DiagPassword[i+1].value;
 }
 document.SMS.DiagUserNo[i].value = '';
 document.SMS.DiagPassword[i].value = '';
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function IncreaseWlMaxTxDstIdx()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (max_wl_tx_dst_idx >= 19) {
  alert("The white list has reached its maximum number of destinations"); // Can not expand anymore!
  return;
 }
 document.SMS.add_dst[max_wl_tx_dst_idx].style['display']='none';
 document.SMS.del_dst[max_wl_tx_dst_idx].style['display']='none';
 max_wl_tx_dst_idx++;
 document.SMS.delete_wl[max_wl_tx_dst_idx].style['display']='';
 document.SMS.add_dst[max_wl_tx_dst_idx].style['display']='';
 document.SMS.del_dst[max_wl_tx_dst_idx].style['display']='';
 document.getElementById( "whitelist"+max_wl_tx_dst_idx ).style['display']='';
 cmd_line="/cgi-bin/sms.cgi?CMD=SET_MAX_WL_TX_IDX&new_idx="+max_wl_tx_dst_idx;
 makeRequest(cmd_line, "n/a", ChangeWlMaxTxDstIdxHandler);
 DisplayControl('diag', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DecreaseWlMaxTxDstIdx()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (max_wl_tx_dst_idx <= 0) {
  alert("sms warning04"); // Can not shrink anymore!
  return;
 }
 document.SMS.delete_wl[max_wl_tx_dst_idx].style['display']='none';
 document.SMS.add_dst[max_wl_tx_dst_idx].style['display']='none';
 document.SMS.del_dst[max_wl_tx_dst_idx].style['display']='none';
 document.getElementById( "whitelist"+max_wl_tx_dst_idx ).style['display']='none';
 max_wl_tx_dst_idx--;
 document.SMS.add_dst[max_wl_tx_dst_idx].style['display']='';
 document.SMS.del_dst[max_wl_tx_dst_idx].style['display']='';
 document.getElementById( "whitelist"+max_wl_tx_dst_idx ).style['display']='';
 cmd_line="/cgi-bin/sms.cgi?CMD=SET_MAX_WL_TX_IDX&new_idx="+max_wl_tx_dst_idx;
 makeRequest(cmd_line, "n/a", ChangeWlMaxTxDstIdxHandler);
 DisplayControl('diag', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ChangeWlMaxTxDstIdxHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  max_wl_tx_dst_idx = MaxWlTxDstIdx;
  ClearRequestHandler();
  DisplayControl('diag', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function CheckAddList()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 // get Diag. Conf. to check duplication number and list limit
 cmd_line = "/cgi-bin/sms.cgi?CMD=DIAG_CONF_GET";
 if(!makeRequest(cmd_line, 'n/a', CheckAddListHandler)) {
  alert("xml make request error");
  return;
 }
 if (document.SMS.mode.value == 'redir_inbox')
  DisplayControl('inbox', 'disable');
 else
  DisplayControl('outbox', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function CheckAddListHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i, j, val;
 var dst_cnt = 0, empty_wl_idx;
 if (CommonRequestHandler()) {
  //alert("response : "+http_request.responseText);
  ClearRequestHandler();
  if (document.SMS.mode.value == 'redir_inbox')
   DisplayControl('inbox', 'enable');
  else
   DisplayControl('outbox', 'enable');
  // check duplicated numbers & existing number in white list
  max_wl_tx_dst_idx = MaxWlTxDstIdx;
  for(i=0; i<document.SMS.disp_msg_cnt.value; i++) {
   if (!document.SMS.msg_sel[i].checked)
    continue;
   val=document.SMS.mob_num[i].value;
   // check duplicated numbers
   for(j=i+1; j<document.SMS.disp_msg_cnt.value; j++) {
    if (!document.SMS.msg_sel[j].checked)
     continue;
    if (IsSameNumber(val, document.SMS.mob_num[j].value)) {
     // Index ["+(i+1)+"] "+val+" is duplicated with index ["+(j+1)+"] "+document.SMS.mob_num[j].value+"\nSkip adding and reset checkbox !
     alert("Index"+" ["+(i+1)+"] "+val+" "+"sms warning19"+" ["+(j+1)+"] "+document.SMS.mob_num[j].value+"\n"+"sms warning20");
     document.SMS.msg_sel[j].checked = false;
     document.getElementById( "selectall" ).checked=false;
    }
   }
   // check existing number in white list
   for(j=0; j<=max_wl_tx_dst_idx; j++) {
    if (DiagUserNo[j] == '') {
     empty_wl_idx = j;
     break;
    }
    if (IsSameNumber(val, DiagUserNo[j])) {
     // Index["+(i+1)+"] "+val+" is already in White List. Skip adding and reset checkbox !
     alert("Index"+"["+(i+1)+"] "+val+" "+"is already in the white list"+" "+"sms warning20"+" !");
     document.SMS.msg_sel[i].checked = false;
     document.getElementById( "selectall" ).checked=false;
     break;
    }
   }
   if (IsSameNumber(val, DiagUserNo[j]))
    continue;
   dst_cnt++;
  }
  document.getElementById( "waitanimation" ).style['display']='none';
  if (dst_cnt == 0) {
   alert("sms warning24"); // Please select messages to add their destination numbers to White List !
  } else if (19 < empty_wl_idx+dst_cnt) {
   // Can not add to White List.\nToo many destination number are selected.\n\n"+dst_cnt+"numbers are selected and only "+(19-empty_wl_idx)+" numbers can be added to White List.
   alert("sms warning25"+"\n"+("sms warning26")+"\n\n"+dst_cnt+"sms warning27"+(19-empty_wl_idx)+" "+"sms warning28");
  } else {
   AddWhiteList();
  }
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function AddWhiteList()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var i, j, val;
 cmd_line = "/cgi-bin/sms.cgi?CMD=DIAG_ADD_WL&numlist=";
 for(i=0; i<document.SMS.disp_msg_cnt.value; i++) {
  if (!document.SMS.msg_sel[i].checked)
   continue;
  cmd_line+=document.SMS.mob_num[i].value+" ";
 }
 if (!makeRequest(cmd_line, 'n/a', AddWhiteListHandler)) {
  alert("xml make request error");
  return;
 }
 if (document.SMS.mode.value == 'redir_inbox')
  DisplayControl('inbox', 'disable');
 else
  DisplayControl('outbox', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function AddWhiteListHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var r;
 if (CommonRequestHandler()) {
  if (platform == "Platypus" || platform == "Platypus2" || platform == "Bovine")
   document.SMS.created.value = created;
  else
   document.SMS.created.value = UTCtoLocal(created);
  ClearRequestHandler();
  if (document.SMS.mode.value == 'redir_inbox')
   DisplayControl('inbox', 'enable');
  else
   DisplayControl('outbox', 'enable');
  document.getElementById( "selectall" ).checked=false;
  // White List updated at\n\n"+document.SMS.created.value+"\n\nMove to White List page
  r=confirm("The white list was updated at"+"\n\n"+document.SMS.created.value+"\n\n"+"Move to the white list");
  if (r == true)
   window.location.replace(sms_file+"?diag");
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ResetTxSmsCnt()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line="/cgi-bin/sms.cgi?CMD=RESET_TX_SMS_CNT";
 makeRequest(cmd_line, "n/a", ResetTxSmsCntHandler);
 DisplayControl('diag', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ResetTxSmsCntHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if (CommonRequestHandler()) {
  document.SMS.SmsTxCnt.value = '0 / '+document.SMS.MaxDiagSmsTxLimit.value;
  ClearRequestHandler();
  DisplayControl('diag', 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function multiLangRadio(txt)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 if(Butterlate.getLang()=="ar")
  document.write("<font dir=\"rtl\">"+txt);
 else
  document.write("<font>"+txt);
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DisplaySimError()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 alert("checkSimStatus"); // please make sure the SIM status is OK and try again.
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DisplayCharCount()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var msg = document.SMS.txmsg.value;
 var gsm7_char_set="@£$¥èéùÇØøÅåΔ_ΦΓΛΩΠΨΣΘÆæßÉ!\"\#¤%&'()*+,-./:;<=>?¡ÄÖÑÜ§¿äöñüà \n\r";
 var gsm7_char_set_ext="@£$¥èéùÇØøÅåΔ_ΦΓΛΩΠΨΣΘÆæßÉ!\"\#¤%&'()*+,-./:;<=>?¡ÄÖÑÜ§¿äöñüà \n\rìòΞ^\\[]{}~|€";
 var t1, t2;
 var max_limit, i, ch;
 if (tx_concat_en == '0') {
  if (encoding_scheme == 'UCS2') {
   max_limit = 70;
  } else {
   max_limit = 160;
   for (i=0; i<msg.length; i++) {
    ch = msg.charAt(i);
    if (is_sierra) {
     t1 = ch.search(/[@£$¥èéùÇØøÅåΔ_ΦΓΛΩΠΨΣΘÆæßÉ!"\#¤%&'()*+,-./:;<=>?¡ÄÖÑÜ§¿äöñüà \n\r]/g);
    } else {
     t1 = ch.search(/[@£$¥èéùÇØøÅåΔ_ΦΓΛΩΠΨΣΘÆæßÉ!"\#¤%&'()*+,-./:;<=>?¡ÄÖÑÜ§¿äöñüà \n\rìòΞ^\\\[\]{}~|€]/g);
    }
    t2 = ch.search(/[a-zA-Z0-9]/g);
    if (t1 < 0 && t2 < 0) {
     max_limit = 70;
     break;
    }
   }
  }
  document.getElementById( "CharCount" ).innerHTML = msg.length+" / "+max_limit;
  if (msg.length >= max_limit)
   document.getElementById( "CharCount" ).style.color="Red";
  else if (msg.length >= max_limit - 10)
   document.getElementById( "CharCount" ).style.color="Orange ";
  else
   document.getElementById( "CharCount" ).style.color="Blue";
 } else {
  document.getElementById( "CharCount" ).innerHTML = msg.length;
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function DisplaySmscAddrError()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 alert("sms warning32"); // SMSC address is invalid. Please set SMSC address in Setup Page.
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SaveSmscAddr()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line="/cgi-bin/sms.cgi?CMD=SAVE_SMSC_ADDR&NEW_SMSC_ADDR=";
 cmd_line+=encodeUrl(document.SMS.SmscAddrNo.value);
 makeRequest(cmd_line, "n/a", SaveSmscAddrHandler);
 DisplayControl('config', 'disable');
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function SaveSmscAddrHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var Result;
 if (CommonRequestHandler()) {
  ClearRequestHandler();
  DisplayControl('config', 'enable');
  if (Result == '1') {
   document.SMS.SmscAddrNo.value=NewSmscAddr;
  }
 }
}
var current_page, UnreadMsgCnt, span_id_str, timer_id;
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function UpdateUnreadCntTimer(page)
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 cmd_line = "/cgi-bin/sms.cgi?CMD=SMS_UPDATE_UNREAD_CNT";
 makeRequest(cmd_line, "n/a", UpdateUnreadCntTimerHandler);
 DisplayControl(page, 'disable');
 current_page = page;
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function UpdateUnreadCntTimerHandler()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var title_str, title_ar;
 if (CommonRequestHandler()) {
  clearTimeout(timer_id);
  if (current_page == 'config') {
   span_id_str = "SmsGenConf";
   timer_id = setTimeout("UpdateUnreadCntTimer('config')", 10000);
  } else if (current_page == 'newmsg') {
   span_id_str = "SmsCreateNewMsg";
   // block updating unread message counter by timer until message sending is over.
   if (!block_updating_unread_cnt)
    timer_id = setTimeout("UpdateUnreadCntTimer('newmsg')", 10000);
  } else if (current_page == 'inbox') {
   span_id_str = "msgboxtitle";
   timer_id = setTimeout("UpdateUnreadCntTimer('inbox')", 10000);
  } else if (current_page == 'outbox') {
   span_id_str = "msgboxtitle";
   timer_id = setTimeout("UpdateUnreadCntTimer('outbox')", 10000);
  } else if (current_page == 'email') {
   span_id_str = "SmsEmailFwdSetting";
   timer_id = setTimeout("UpdateUnreadCntTimer('email')", 10000);
  } else if (current_page == 'diag') {
   span_id_str = "SmsDiagConfTitle";
   timer_id = setTimeout("UpdateUnreadCntTimer('diag')", 10000);
  }
  title_str = document.getElementById(span_id_str).innerHTML;
  title_ar = title_str.split(",");
  document.getElementById(span_id_str).innerHTML = title_ar[0];
  document.getElementById(span_id_str).innerHTML += ",    "+UnreadMsgCnt+" "+"sms unread";
  ClearRequestHandler();
  DisplayControl(current_page, 'enable');
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ConfirmGenericRdbAccessOption()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var r;
 r=confirm(" This may have security implications. Are you sure you wish to proceed?");
 if (r == true) {
  document.SMS.menuAccessGenericRdbVars.value='1';
 } else {
  document.SMS.menuAccessGenericRdbVars.value='0';
  document.SMS.AccessGenericRdbVars[1].checked=true;
  document.SMS.AccessGenericRdbVars[1].focus();
 }
}
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
function ConfirmGenericCmdsOption()
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
{
 var r;
 r=confirm(" This may have security implications. Are you sure you wish to proceed?");
 if (r == true) {
  document.SMS.menuAllowGenericCmds.value='1';
 } else {
  document.SMS.menuAllowGenericCmds.value='0';
  document.SMS.AllowGenericCmds[1].checked=true;
  document.SMS.AllowGenericCmds[1].focus();
 }
}
