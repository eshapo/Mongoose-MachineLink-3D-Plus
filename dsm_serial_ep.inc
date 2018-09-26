<script language="JavaScript" src="cgi-bin/end_points.cgi?getList"></script>
<script language="JavaScript" src="cgi-bin/end_points.cgi?serialList"></script>
<script language="JavaScript">
var EP_Name="@@request['QUERY_STRING']";
var host_if_list_length=0;

var scriptname="@@request['SCRIPT_NAME']"
var ep_type=scriptname.match("[0-9]+");

if (ep_type[0] == "undefined")
	ep_type[0]="1";

if(typeof(host_if_list)!="undefined") {
	$.map(host_if_list, function(x,y) {
		host_if_list_length++;
	});
}
var types_list={"1":_("type1"), "2":_("type2"), "3":_("type3"),  "4":_("type4"), "5":_("type5"), "6":_("type6"), "7":_("type7"), "8":_("type8"), "9":_("type9"), "10":_("type10")};
var baud_rate_list={"115200":"115200", "57600":"57600", "38400":"38400", "19200":"19200", "9600":"9600", "4800":"4800", "2400":"2400", "1200":"1200", "600":"600", "300":"300"};
var databits_list={"8":_("8bit"), "7":_("7bit"), "6":_("6bit"), "5":_("5bit")};
var stopbits_list={"1":"1", "2":"2"};
var parity_list={"none":_("none"), "even":_("even"), "odd":_("odd")};

function submitForm() {
#ifdef V_WEBIF_SPEC_vdf
/*********for vdf validator**********/
	if(!$("#form").valid()) {
		return;
	}
#else
	if(!$("#form").validationEngine("validate")) {
		validate_alert("","");
		return;
	}
#endif
	blockUI_wait(_("GUI pleaseWait"));
	for (var i=0; i<endpoints.length;i++) {
		if(endpoints[i].name==EP_Name) {
			break;
		}
	}
	if($("#host_if").val()=="custom") {
		host_if=$("#custom_if").val();
	}
	else {
		host_if=$("#host_if").val();
	}
	rdbCmd="/cgi-bin/rdb.cgi?service.dsm.ep.conf."+i+".name="+EP_Name+" -p&service.dsm.ep.conf."+i+".type="+ep_type[0]+" -p&";
	pf="service.dsm.ep.conf."+EP_Name+".";
	rdbCmd+=pf+"dev_name="+host_if+" -p&"+pf+"bit_rate="+$("#baud").val()+" -p&"+pf+"data_bits="+$("#databits").val()+" -p&"+pf+"stop_bits="+$("#stopbits").val()+" -p&"+pf+"parity="+$("#parity").val()+" -p&service.dsm.trigger=1";
	$.get(rdbCmd, function(){setTimeout("window.location='/end_points.html?success'", 3000)});
}

function add_sif_options(myid, mylist, def) {
	mydef="custom";
	$.each( ["#"+myid], function(idx,el) {
		$.each( mylist, function(val,attr) {
			var buildinSerial=0;
#ifndef V_SERIAL_none
			if(attr=="platform") {
				txt=_("builtinSerial");
				attr="";
				buildinSerial=1;
			}
			else if( attr.indexOf("inserted")!=-1) {
				txt=_("externalSerial")+" ("+attr.substring(8)+")";
				attr="";
			}
			else if( attr=="custom") {
				txt=_("custom");
				attr="";
			}
			else {
				txt=_("externalSerial")+" ("+attr.substring(8)+")";
				attr="disabled";
			}
#else
			if(attr!="platform") {
				if( attr.indexOf("inserted")!=-1) {
					txt=_("externalSerial")+" ("+attr.substring(8)+")";
					attr="";
				}
				else if( attr=="custom") {
					txt=_("custom");
					attr="";
				}
				else {
					txt=_("externalSerial")+" ("+attr.substring(8)+")";
					attr="disabled";
				}
			}
			else {
				return true;
			}
#endif
			if(def==val) {
				mydef=val;
			}
			if(ep_type[0]=="1" || buildinSerial == 1)
				$(el).append("<option value='"+val+"' "+attr+">"+txt+"</option>");
		});
	});
	if(def!="") {
		$("#"+myid).val(mydef);
		if(mydef=="custom") {
			$("#custom_if").val(def);
		}
	}
}

$(document).ready(function() {
	add_options("baud", baud_rate_list, 115200);
	add_options("databits", databits_list, 8);
	add_options("stopbits", stopbits_list, 1);
	add_options("parity", parity_list, "none");
	//add_options("fc", fc_list, 0);

	var host_if="";
	if(host_if_list_length>0) {
		$.extend(true, host_if_list, {"custom":"custom"});
		add_sif_options("host_if", host_if_list, host_if);
	}
	else {
		$("#custom_if-div").css("display", "");
		$("#host_if-div").css("display", "none");
	}

	$("#host_if").change(function() {
		if(this.value=="custom") {
			$("#custom_if-div").css("display", "");
		}
		else {
			$("#custom_if-div").css("display", "none");
		}
	});
	$("#host_if").trigger("change");
	var v="";
	$("#baud").val(v==""?"115200":v);
	v="";
	$("#databits").val(v==""?"8":v);
	v="";
	$("#stopbits").val(v==""?"1":v);
	v="";
	$("#parity").val(v==""?"none":v);
 	$("#ep_name").html(types_list[ep_type[0]]+"  "+_("endPoint")+"   ("+EP_Name+")");
});
</script>

<div class="header-wrap" id="main-menu"><!--Top Menu--></div>
<div id="content" class="site-content">
<div class="container">
	<aside class="grid-3 alpha sidemenu" id="side-menu"><!--Side Menu--></aside>
	<div class="grid-9 omega">
		<form><!--place holder for validation--></form>
		<div class="right-column white-box">
			<form name="form" id="form" class="validate" novalidate="novalidate" method="POST" action="@@request['SCRIPT_NAME']">
			<div class="pad" id="setup">
				<h2 id="ep_name"></h2>
				<div class="grey-box">
					<div class="form-row" id="host_if-div">
						<label for="host_if"><script language=Javascript>document.write(_("hostPort"))</script></label>
						<div class="field">
		 					<select id="host_if" name="host_if" style="width:auto"></select>
<!-- 							<input type="text" name="host_if" id="host_if" class="large required" value=""> -->
						</div>
					</div>
					<div class="form-row" id="custom_if-div">
						<label for="custom_if"><script language=Javascript>document.write(_("customHost"))</script></label>
						<div class="field">
							<input type="text" name="custom_if" id="custom_if" class="large required validate[required]" value="">
						</div>
					</div>
					<div class="form-row">
						<label for="baud"><script language=Javascript>document.write(_("baud rate"))</script></label>
						<div class="field">
							<select id="baud" name="baud"></select>
						</div>
					</div>
					<div class="form-row">
						<label for="databits"><script language=Javascript>document.write(_("dataBits"))</script></label>
						<div class="field">
							<select id="databits" name="databits"></select>
						</div>
					</div>
					<div class="form-row">
						<label for="stopbits"><script language=Javascript>document.write(_("stopBits"))</script></label>
						<div class="field">
							<select id="stopbits" name="stopbits"></select>
						</div>
					</div>
					<div class="form-row">
						<label for="parity"><script language=Javascript>document.write(_("parity"))</script></label>
						<div class="field">
							<select id="parity" name="parity"></select>
						</div>
					</div>
				</div>
				<div class="submit-row" id="submit-div">
					<button type="button" onClick="submitForm();"><script language=Javascript>document.write(_("CSsave"))</script></button>
					<button type="button" class="secondary" onClick="window.location='end_points.html'"><script language=Javascript>document.write(_("cancel"))</script></button>
				</div>
			</div>
			</form>
		</div>
	</div>
</div>
</div>
<footer class="footer">
	<div class="container">
		<p class="copy-right"><script language=Javascript>document.write(_("powered by netComm"))</script></p>
	</div>
</footer>

<script language='javascript'>
        set_menu("Services", "EDP", "@@_val");
</script>