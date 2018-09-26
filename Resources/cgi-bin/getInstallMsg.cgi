#! /usr/bin/awk -f

BEGIN
{
	print ("Content-type: text/html\n");

	print("var installMsg = \"\"\;");
	if(( "ls /tmp/flashtoolMsg.txt 2>&1" | getline) > 0) {
		if( index( $0, "No such file or directory")==0 ) {
			while(( "tail /tmp/flashtoolMsg.txt" | getline) > 0) {
				num = split ( $0, newstr, "\r");
				for( i=0; i<=num; i++) {
					myStr = "";
					for ( j=1; j<=length (newstr[i]); ++j ) {
						c = substr (newstr[i], j, 1);
						if( c == "\"" ) {
							myStr = myStr "\\" c;
						}
						else {
							myStr = myStr c;
						}
					}
					if( (length(myStr)>2) ) {
						printf( "installMsg+=\"\\n%s\";\n", myStr );
					}
				}
			}
			if( index(myStr, "Done")>0 || index(myStr, "reboot")>0)
				system( "rm /tmp/flashtoolMsg.txt >/dev/null 2>&1" ); #output once
		}
	}
}
