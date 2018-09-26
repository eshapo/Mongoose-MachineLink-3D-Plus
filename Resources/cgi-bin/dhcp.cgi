#! /usr/bin/awk -f

function exec(mycmd) {
value="";
	while(mycmd | getline) {
		value = sprintf("%s%s", value, $0);
	}
	close(mycmd);
	return value;
}

BEGIN {
	print ("Content-type: text/html\n");
	if( ENVIRON["SESSION_ID"]=="" || ENVIRON["SESSION_ID"] !=  ENVIRON["sessionid"] ) exit;
	print ("var reservationdata=[");
	i=0;
	while( (cmd = sprintf("rdb_get service.dhcp.static.%s",i) | getline) > 0 ) {
	# interface.0.dhcp.static.x;0;0;0;computer name,mac address,ip address;enabled or disabled
		n=split($0,myarr,",")
		if(n!=4) {
			continue;
		}
		if(i>0) print(",");
		printf("{\n");
		printf("\"computerName\":\"%s\",\n", myarr[1]);
		printf("\"mac\":\"%s\",\n", myarr[2]);
		printf("\"ip\":\"%s\",\n", myarr[3]);
		printf("\"enable\":\"%s\"\n", myarr[4]);
		printf("}");
		i++;
	}
	close( cmd );
	print ("\n];\n");
	print ("var leasesdata=[");
	i=1;

	# check with Bovine/Platypus2 file
	catcmd = "cat /tmp/dnsmasq.leases 2>/dev/null";
	lscmd = "ls /tmp/dnsmasq.leases 2>/dev/null";
	exist = exec(lscmd);
	if (exist == 0) {
		catcmd = "cat /tmp/var/lib/misc/dnsmasq.leases 2>/dev/null";
	}

	while((catcmd | getline) > 0 ) {
		if(i>1) print(",");
		printf("{\n");
		mac=$2;
		ends=$1;
		ip=$3;
		hostname=$4;
		###checking the change of the system time
		if( ends<1355266923 ) {
			### the endtime was setup before the system time updated, adjust the leasetime by time offset.
			cmd = "cat /proc/uptime";
			cmd |getline;
			uptime = int($1);
			close(cmd);
			timeoffset = exec("date +%s")-uptime;
			ends += timeoffset;
		}
		printf("\"ends\":\"%s\",\n", ends);
		printf("\"mac\":\"%s\",\n", mac);
		printf("\"ip\":\"%s\",\n", ip);
		printf("\"hostname\":\"%s\"\n", hostname);
		printf("}");
		i++;
	}
	print ("\n];\n");
	close(catcmd);
	close(lscmd);
}
