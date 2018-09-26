#! /usr/bin/awk -f 

#
# NOTE: All platforms and variants use /usr/local/cdcs/conf to maintain
# config files and statistics. /opt/cdcs/upload is used to upload files
# via Appweb.
#
# Any platform that does not natively use those locations, has symlinks
# placed to the correct ones.

function logger(str) {
	system("logger -t SaveSettings.cgi \"" str "\"")
}

function random() {
	FS = " ";
	"hexdump /dev/urandom -n 4" | getline;
	return $2;
	close ("hexdump /dev/urandom -n 4");
}

BEGIN 
{
	print ("Content-type: text/html\n");
	if( ENVIRON["SESSION_ID"]=="" || ENVIRON["SESSION_ID"] !=  ENVIRON["sessionid"] ) exit;

	# handle parameters
	split (ENVIRON["QUERY_STRING"], qrystr, "&");
	### Get V - variables ###
	# V_EXPORTCONFPREFIX = file name prefix for exported config file (e.g. NTC-6000_Settings_)
	# V_EXPORTCONFPATH = teporary storage location for exported config files
	# V_VPN = if set, save VPN certificates with config.
	cmd = "cat /etc/variant.sh 2> /dev/null"
	FS = "="
	while( cmd | getline ) {
		#eval $0
		if ( $1 == "V_EXPORTCONFPREFIX") {
			V_EXPORTCONFPREFIX = $2;
		}
		if ( $1 == "V_EXPORTCONFPATH") {
			V_EXPORTCONFPATH = $2;
			# not robst, but expected V_Variable doesn't include "'" character.
			gsub("\'", "", V_EXPORTCONFPATH);
		}
		if ( $1 == "V_VPN") {
			V_VPN = $2;
		}
	}

	close( cmd );
	# export
	if ( qrystr[1] == "form3") { #Save a copy of current settings
		# get password
		password = qrystr[3];
		saveVpnSettingFlag = 0;
		saveSsh = 0

        split (V_EXPORTCONFPREFIX, tmpstr, "\'");
        V_EXPORTCONFPREFIX = tmpstr[2];

		filename = sprintf("%s%s.cfg", V_EXPORTCONFPREFIX, random() );

		# delete old configs - caution : can be a problem when there are more than once sessions
		cmd = "rm -f " V_EXPORTCONFPATH "/*.cfg"
		system(cmd);

		cmd = "dbcfg_export -o " V_EXPORTCONFPATH "/" filename " -p \"" password "\"";
		retval = system(cmd);

		if (V_VPN != "'none'" && V_VPN != "") {
			saveVpnSettingFlag = 1;
		}

		if (V_SSH != "'none'" && V_SSH != "") {
			saveSsh = 1
		}

		if( saveVpnSettingFlag == 1 || saveSsh == 1) {

			dirs=""
			# openvpn and ipsec configuration
			if(saveVpnSettingFlag == 1) {
				dirs=dirs " ipsec.d openvpn-keys"
			}
			# ssh hostkeys
			if(saveSsh == 1) {
				dirs=dirs " ssh-hostkeys"
			}

			# the VPN settings will be des3 encrypted and then made a tarball with normal config file
			cmd=sprintf("tar -C /usr/local/cdcs -zcvf - " dirs " |openssl des3 -salt -k \"%s\" | dd of=/www/vpn.des3", password);
			retval_enc = system(cmd);

			if( retval_enc == 0) {
				cmd=sprintf("cd /www && tar -zcvf %s.tar.gz %s vpn.des3", filename, filename);
				retval_zip = system(cmd);
				if(retval_zip == 0) {
					filename=sprintf("%s.tar.gz", filename);
				}
				else {
					retval= 249; # Just to return non-zero value
				}
			}
			else {
				retval=250; # Just to return non-zero value
			}
		}
		
		# return - caution : it should check error status
		if( retval == 0 ) {
			printf("filename=\"%s\"\n", filename);
		}
		else {
			printf("filename=\"\"\n");
		}
	}
	# reboot
	else if ( qrystr[1] == "formReboot") {
		printf("rebooting...\n");
		system("rdb_set service.system.reset 1");
	}
	# import
	else if ( qrystr[1] == "form2") { #Restore saved settings
		# get filename and password
		filename = qrystr[2];
		password = qrystr[3];

		isVpnStoreSucc = 1;
		#To see whether include VPN settings
		if(index(filename,"tar.gz")>0) {
			if(password == "") {
				#The first time come in without password, we just unzip the tar ball
				#Remove all des3 and cfg files to avoid errors
				system("rm -f /opt/cdcs/upload/*.des3");
				system("rm -f /opt/cdcs/upload/*.cfg");

				#unzip tarball
				cmd = sprintf("cd /opt/cdcs/upload && tar -zxvf %s 2>/dev/null 1>/dev/null", filename);
				system (cmd);
				# Remove the tarball	
				cmd = sprintf("rm -f /opt/cdcs/upload/%s", filename);
				system(cmd);
			}
			#parse the filename from directory, it will succeed if there is only one cfg file, otherwise, it will fail.
			"basename /opt/cdcs/upload/*.cfg" | getline cfg_filename;
			# User provides password, then we process vpn settings decryption
			cmd=sprintf("cd /opt/cdcs/upload/ && dd if=/opt/cdcs/upload/vpn.des3 2>/dev/null |openssl des3 -d -k \"%s\" 2>/dev/null |tar -C /usr/local/cdcs -zxf - 2>/dev/null ", password);
			retval=system(cmd);
			if(retval == 0) {
				system("rm -f /opt/cdcs/upload/vpn.des3");
				isVpnStoreSucc = 1;
			}
			else {
				isVpnStoreSucc = 0;
			}
			
			filename = cfg_filename;
		}

		# run import (writes the override.conf file which replaces the config on next boot)
		cmd = sprintf("dbcfg_import -i /opt/cdcs/upload/%s -p \"%s\"",filename,password);

		out = sprintf("/tmp/dbcfg_import_error_%d",random());
		retval = system(cmd " 2> " out);
		getline msg < out;
		close(out);
		# delete error file
		system("rm -f " out);

		#Normal config succeeds while vpn setting not succeeds
		if(retval == 0 && isVpnStoreSucc == 0) {
			retval = 250;	
			msg="System will reboot to make the normal configuration take effect";
		}
		# return
		printf("retval=\"%d\"\n", retval);
		printf("msg=\"%s\"\n", msg);

		if( retval == 0 ) {
			# delete the uploaded file
			cmd = sprintf("rm -f /opt/cdcs/upload/%s",filename);
			system(cmd);
			# get current ip address
			"rdb_get link.profile.0.address" | getline curIpAddr;
			# get new ip address
			"grep link.profile.0.address /usr/local/cdcs/conf/override.conf | sed s/%2E/\./g | cut -c 37-" | getline newIpAddr;
			if ( newIpAddr != curIpAddr)
				printf("newip=\"%s\"\n",newIpAddr);
			else 
				printf("newip=\"\"\n");

            # some rdb variables don't need to be restored such as a flag indicating configured a feature.
            system("echo \"smstools.configured;0;0;0;32;\" >> /usr/local/cdcs/conf/override.conf");

			# reboot the unit
			system("rdb_set service.system.reset 1");
		}
	}
	# default
	else if ( qrystr[1] == "formS") { #Restore factory settings from main system
		system("dbcfg_default -f -r");
	}
	else if ( qrystr[1] == "formS_r") { #Restore factory settings from recovery system
		system("dbcfg_default -f -r");
	}
}
