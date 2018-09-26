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
			if(($1=="ipsec.0")) {
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

				#ipsec
				write_rdb_profile_to_java_variable(i,"remote_gateway","",",");
				write_rdb_profile_to_java_variable(i,"remote_lan","",",");
				write_rdb_profile_to_java_variable(i,"remote_lan2","",",");
				write_rdb_profile_to_java_variable(i,"remote_lan3","",",");
				write_rdb_profile_to_java_variable(i,"remote_lan4","",",");
				write_rdb_profile_to_java_variable(i,"remote_mask","",",");
				write_rdb_profile_to_java_variable(i,"local_gateway","",",");
				write_rdb_profile_to_java_variable(i,"local_lan","",",");
				write_rdb_profile_to_java_variable(i,"local_mask","",",");
				write_rdb_profile_to_java_variable(i,"enccap_protocol","",",");
				write_rdb_profile_to_java_variable(i,"ike_mode","",",");
				write_rdb_profile_to_java_variable(i,"pfs","",",");
				write_rdb_profile_to_java_variable(i,"ike_enc","",",");
				write_rdb_profile_to_java_variable(i,"ike_hash","",",");
				write_rdb_profile_to_java_variable(i,"ipsec_enc","",",");
				write_rdb_profile_to_java_variable(i,"ipsec_hash","",",");
				write_rdb_profile_to_java_variable(i,"ipsec_dhg","",",");
				write_rdb_profile_to_java_variable(i,"ipsec_method","none",",");
				write_rdb_profile_to_java_variable(i,"ipsec_dpd","",",");
				write_rdb_profile_to_java_variable(i,"psk_value","",",");
				write_rdb_profile_to_java_variable(i,"psk_remoteid","",",");
				write_rdb_profile_to_java_variable(i,"psk_localid","",",");
				write_rdb_profile_to_java_variable(i,"rsa_remoteid","",",");
				write_rdb_profile_to_java_variable(i,"rsa_localid","",",");
				write_rdb_profile_to_java_variable(i,"key_password","",",");
				write_rdb_profile_to_java_variable(i,"life_time","",",");
				write_rdb_profile_to_java_variable(i,"ike_time","",",");
				write_rdb_profile_to_java_variable(i,"dpd_time","",",");
				write_rdb_profile_to_java_variable(i,"dpd_timeout","",",");
			
				printf("}\n")
			}
		}
		else break;
	}
	print ("];");
	print ("newprofilenum =" ((profilenum==0)?i:profilenum) ";");
}

