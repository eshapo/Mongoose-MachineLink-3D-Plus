#! /usr/bin/awk -f 
function read_rdb_mbssid(mbssid_no,mbssid_var,default_value) {
	cmd = sprintf("rdb_get wlan.%s.%s",mbssid_no,mbssid_var)
	if( (cmd | getline) == 1 ) {
		if( $0!="" )
			var=$0
		else
			var=default_value
	}
	else {
		var=default_value
	}
	close(cmd);
	return var
}

function escape(i_Str) {
	retVal="";
	srcStr=i_Str;
	while (match(srcStr, /[\\\"\']/)) {
		retVal = retVal substr(srcStr, 1, RSTART-1) "\\" substr(srcStr, RSTART, RLENGTH);
		srcStr = substr(srcStr, RSTART+RLENGTH);
	}
	retVal = retVal srcStr;

	return retVal;
}

function write_java_variable(javascript_var,javascript_val,suffix) {
	printf("\"%s\":\"%s\"%s\n",javascript_var,javascript_val,suffix);
}

function write_rdb_mbssid_to_java_variabale(mbssid_no,mbssid_var, default_value, suffix) {
	javascript_val=read_rdb_mbssid(mbssid_no,mbssid_var, default_value);
	javascript_val=escape(javascript_val);
	write_java_variable(mbssid_var, javascript_val, suffix);
}

BEGIN 
{
	print ("Content-type: text/html\n");
	if( ENVIRON["SESSION_ID"]=="" || ENVIRON["SESSION_ID"] !=  ENVIRON["sessionid"] ) exit;

	print ("var mbssidST=[");
	j=0;

	for( i=0; i<5; i++) {
		# put seperator if any previous exists
		if(j++>0) 
			print(",");
		# put name
		printf("{\n")
		write_rdb_mbssid_to_java_variabale(i,"enable","0",",");
		write_rdb_mbssid_to_java_variabale(i,"ssid","",",");
		write_rdb_mbssid_to_java_variabale(i,"hide_accesspoint","0",",");
		write_rdb_mbssid_to_java_variabale(i,"network_key_id","0",",");
		write_rdb_mbssid_to_java_variabale(i,"network_key1","",",");
		write_rdb_mbssid_to_java_variabale(i,"network_key2","",",");
		write_rdb_mbssid_to_java_variabale(i,"network_key3","",",");
		write_rdb_mbssid_to_java_variabale(i,"network_key4","",",");
		write_rdb_mbssid_to_java_variabale(i,"wep8021x","",",");
		write_rdb_mbssid_to_java_variabale(i,"encryption_type","AES",",");
		write_rdb_mbssid_to_java_variabale(i,"wpa_pre_shared_key","a1b2c3d4e5",",");
		write_rdb_mbssid_to_java_variabale(i,"wpa_group_rekey_interval","600",",");
		write_rdb_mbssid_to_java_variabale(i,"radius_port","1812",",");
		write_rdb_mbssid_to_java_variabale(i,"radius_key","NetComm",",");
		write_rdb_mbssid_to_java_variabale(i,"net_re_auth_interval","0",",");
		write_rdb_mbssid_to_java_variabale(i,"radius_server_ip","0.0.0.0",",");
		write_rdb_mbssid_to_java_variabale(i,"network_auth","WPA2PSK",",");
		write_rdb_mbssid_to_java_variabale(i,"wpa2_preauthentication","off","");
		printf("}\n")
	}
	print ("];");
}
