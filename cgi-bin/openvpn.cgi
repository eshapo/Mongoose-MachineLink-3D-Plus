#! /usr/bin/awk -f 

#
# $1 = type of dev (openvpn.0 , pptp.0 , gre.0)
# $2 = 
#

function read_rdb_profile(profile_no,profile_var,default_value) {
	
	cmd = sprintf("rdb_get link.profile.%s.%s",profile_no,profile_var)
	if( (cmd | getline) == 1 ) {
		var=$0
	}
	else {
		var=default_value
	}
	close(cmd);
	
	return var
}

function write_java_variable(javascript_var,javascript_val,suffix) {
	printf("\"%s\":\"%s\"%s\n",javascript_var,javascript_val,suffix);
}

function write_rdb_profile_to_java_variable(profile_no,profile_var,default_value,suffix) {
	javascript_val=read_rdb_profile(profile_no,profile_var,default_value)
	write_java_variable(profile_var,javascript_val,suffix);
}

BEGIN 
{
	print ("Content-type: text/html\n");
	if( ENVIRON["SESSION_ID"]=="" || ENVIRON["SESSION_ID"] !=  ENVIRON["sessionid"] ) exit;

	print ("var st=[");
	i=0;
	j=0;
	profilenum = 0;
	while(++i)
	{		
		cmd = sprintf("rdb_get link.profile.%s.dev",i);
		if(( cmd | getline) > 0)
		{
			if( $1=="openvpn.0" ) {
				# keep type
				type = $1;
				
				rdb_var = read_rdb_profile(i,"delflag","")
				if (rdb_var == "1")
					continue;
				# put seperator if any previous exists
				if(j++>0) 
					print(",");
				
				printf("{\n")

				# read name
				rdb_var = read_rdb_profile(i,"name","")
				# write name
				write_java_variable("name",rdb_var,",");
				
				# put enable
				write_rdb_profile_to_java_variable(i,"enable","0",",");

				# put profile number
				write_java_variable("profilenum",i,",");
				# put profile type
				write_java_variable("type",type,",");

				# openvpn type
				write_rdb_profile_to_java_variable(i,"vpn_type","",",");
				
				# put network address
				write_rdb_profile_to_java_variable(i,"network_addr","",",");
				# put network mask
				write_rdb_profile_to_java_variable(i,"network_mask","",",");
				# put authentication type
				write_rdb_profile_to_java_variable(i,"vpn_authtype","",",");
				
				# TODO: print generated certificates - array
				
				# put user name and password
				write_rdb_profile_to_java_variable(i,"user","",",");
				write_rdb_profile_to_java_variable(i,"pass","",",");
				# put server address and port
				write_rdb_profile_to_java_variable(i,"serveraddress","",",");
				write_rdb_profile_to_java_variable(i,"serverport","",",");
				write_rdb_profile_to_java_variable(i,"serverporttype","",",");
				write_rdb_profile_to_java_variable(i,"conn_type","",",");
				write_rdb_profile_to_java_variable(i,"defaultgw","0",",");

				write_rdb_profile_to_java_variable(i,"certi","",",");

				# TODO: print installed certificates - array
				
				# put network address
				write_rdb_profile_to_java_variable(i,"local_ipaddr","",",");
				write_rdb_profile_to_java_variable(i,"remote_ipaddr","",",");
				write_rdb_profile_to_java_variable(i,"remote_nwaddr","",",");
				write_rdb_profile_to_java_variable(i,"remote_nwmask","",",");
				
				printf("}\n")
			}
		}
		else break;
	}
	print ("];");
	print ("newprofilenum =" ((profilenum==0)?i:profilenum) ";");
}


