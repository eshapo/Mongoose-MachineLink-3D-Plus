#! /usr/bin/awk -f

function exec(mycmd) {
	value="";
	while( mycmd | getline ) {
		value = sprintf("%s%s:", value, $1);
		$1="";
		gsub(/^[ ]+/, "");
		gsub(/"/, "\\\"");
		value = sprintf("%s%s;", value, $0);
	}
	close( mycmd );
	return value;
}

BEGIN {
	print ("Content-type: text/html\n");
	if( ENVIRON["SESSION_ID"]=="" || ENVIRON["SESSION_ID"] !=  ENVIRON["sessionid"] ) exit;
	split (ENVIRON["QUERY_STRING"], qry, "&");
	if( qry[1] == "getList") {
	########################## End Points List ###############################
		print ("var endpoints=[");
		i=0;
		while( ( en=sprintf("rdb_get service.dsm.ep.conf.%s.name", i) | getline) > 0  && $0!="") {
			if(i>0) print(",");
			printf("{\n");
			name=$1;
			printf("\"name\":\"%s\",\n", name);

			cmd = sprintf("rdb_get service.dsm.ep.conf.%s.type", i);
			cmd | getline;
			type=$0;
			printf("\"type\":\"%s\",\n", $0);
			close(cmd);

			cmd="rdb_get service.dsm.ep.conf."name". -L";

			if (type == "4") # to hide max_client in udp server endpoint, UDP-LISTEN endpoint does not support "max-children" option
				cmd=cmd" | grep -v service.dsm.ep.conf."name".max_children"

			val=exec(cmd);
			printf("\"sum\":\"%s\"\n", val);
			printf("}");
			i++;
			close(en);
		}
		print ("\n];\n");

		cmd = "rdb_get service.dsm.ep.validated";
		if( cmd | getline ) {
			printf("var validated=\"%s\";\n", $0);
		}
		else {
			printf("var validated=\"\";\n");
		}
		close(cmd);

		cmd = "rdb_get service.dsm.ep.error_msg";
		if( cmd | getline ) {
			printf("var error_msg=\"%s\";\n", $0);
		}
		else {
			printf("var error_msg=\"\";\n");
		}
		close(cmd);
	}
	else if( qry[1] == "setup") {
		i=0;
		# remove service.dsm.ep.conf.x and keep the name list
		while( (name = sprintf("rdb_get service.dsm.ep.conf.%s.name", i) | getline) > 0  && $0!="") {
			name_list[i]=$0;
			system("dsm_tool -d -r service.dsm.ep.conf."i );
			i++;
		}

		# write new end points
		split (qry[2], m, ",");
		i=0;
		for( k in m ) {
			split (m[k], n, ":");
			system( "rdb_set service.dsm.ep.conf."i".name \"" n[1] "\" -p" );
			system( "rdb_set service.dsm.ep.conf."i".type \"" n[2] "\" -p" );
			i++;
		}

		# list is empty
		if(i==0) {
			# remove all items
			system("dsm_tool -d -r service.dsm.ep.conf" );
		}
		else {
			# remove deleted items
			for( x in name_list ) {
				find=0;
				for( k in m ) {
					split (m[k], n, ":");
					if(n[1]==name_list[x]) {
						find=1;
						break;
					}
				}
				if( !find ) {
					system("dsm_tool -d -r service.dsm.ep.conf."name_list[x]".");
				}
			}
		}
		system("rdb_set service.dsm.trigger 1");
	}
	if( qry[1] == "serialList") {
	########################## Get dynamic serial port list ##########################
		serial_list="";
		for ( i=0; (cmd = sprintf("rdb_get sys.hw.class.serial.%s.location", i) | getline) > 0  && $0!=""; i++) {
			if($0=="platform") {
				if (cmd = sprintf("rdb_get sys.hw.class.serial.%s.enable", i) | getline <= 0 ) {
					break;
				}
				if ($0 != "1" ) {
					continue
				}
				st="platform";
			}
			else {
				if (cmd = sprintf("rdb_get sys.hw.class.serial.%s.enable", i) | getline <= 0 ) {
					break;
				}
				en=$0
				if (cmd = sprintf("rdb_get sys.hw.class.serial.%s.status ", i) | getline <= 0 ) {
					break;
				}
				if($0=="inserted" && en==1) {
					st="inserted";
				}
				else {
					st="disabled";
				}
			}
			name=sprintf("sys.hw.class.serial.%s.name", i)
			if ("rdb_get " name | getline <= 0 ) {
				break;
			}

			if (cmd = sprintf("rdb_get sys.hw.class.serial.%s.id", i) | getline <= 0 ) {
				break;
			}
			id=$0;

			if(serial_list=="") {
				serial_list="{";
			}
			else {
				serial_list = serial_list ",";
			}

			if(st=="platform") {
				serial_list = serial_list "\"" name "\":\"" st "\""
			}
			else {
				serial_list = serial_list "\"" name "\":\"" st " " id "\""
			}
		}
		close(cmd);
		if(serial_list=="") {
			serial_list="{";
			if( "rdb_get wwan.0.host_if.1" | getline ) {
				serial_list = serial_list "\"" $0 "\":\"platform\""
			}
		}
		serial_list=serial_list dyn_serial"};";
		printf ("var host_if_list=%s\n", serial_list);
	}
}
