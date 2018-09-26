#!/bin/sh
if [ -z  "${SESSION_ID}" -o "${SESSION_ID}" != "${sessionid}" ]; then
	exit 0
fi

cgi_split() {
	echo "$1" | awk 'BEGIN{
		hex["0"] =  0; hex["1"] =  1; hex["2"] =  2; hex["3"] =  3;
		hex["4"] =  4; hex["5"] =  5; hex["6"] =  6; hex["7"] =  7;
		hex["8"] =  8; hex["9"] =  9; hex["A"] = 10; hex["B"] = 11;
		hex["C"] = 12; hex["D"] = 13; hex["E"] = 14; hex["F"] = 15;
	}
	{
		n=split ($0,EnvString,"&");
		for (i = n; i>0; i--) {
			z = EnvString[i];
			x=gsub(/\=/,"=\"",z);
			x=gsub(/\+/," ",z);
			while(match(z, /%../)){
				if(RSTART > 1)
					printf "%s", substr(z, 1, RSTART-1)
				printf "%c", hex[substr(z, RSTART+1, 1)] * 16 + hex[substr(z, RSTART+2, 1)]
				z = substr(z, RSTART+RLENGTH)
			}
			x=gsub(/$/,"\"\n",z);
			print z;
		}
	}'
}

log() {
	echo -e "$@" | logger -t "logfile.cgi" 
}

split() {
	shift $1
	echo "$1"
}



while read v; do
	if [ -z "$v" ]; then
		continue
	fi
	
	VAR="logfile_cgi_$v"
	
	# do not accept anything else
	if echo "$VAR" | grep "^logfile_cgi_action=" || echo "$VAR" | grep "^logfile_cgi_param="; then
		eval $VAR
	fi
done << EOF
$(cgi_split "$QUERY_STRING")
EOF

htmlWrite() {
	echo -n -e "$@"
}

htmlWriteLog() {
	htmlWrite "$@"
	log "$@"
}

htmlCatFrom() {
	source="$1"
	filename="$2"
	
	if [ -z "$filename" ]; then
		filename=$(basename "$source")
	fi
	
	if [ ! -r "$source" ]; then
		htmlWriteLog "cannot access file \'$source\': Permission denied"
		return 1;
	fi
	
	realfn=$(readlink -f "$1")
	file_size=$(stat -c %s "$realfn")
	
	htmlWrite "HTTP/1.0 200 OK\n"
	htmlWrite "Content-type: application/download\n";
	htmlWrite "Content-length: $file_size\n";
	htmlWrite "Content-transfer-encodig: binary\n";
	htmlWrite "Content-disposition: attachment; filename=\"$filename\"\n";
	htmlWrite "Connection: close\n\n"

	if ! cat "$source"; then
		htmlWriteLog "cannot cat file \'$source\': Return code $?"
		return 1;
	fi
	
	return 0
}

. /etc/variant.sh

case "$logfile_cgi_action" in
	'downloadlog')
		SOFTLINK="/www/logfile.txt"
		LOGFILE="/tmp/logfile.log"
		cp -f $SOFTLINK $LOGFILE
		htmlCatFrom "$LOGFILE";
		rm $LOGFILE
		;;
	'downloadIPseclog')
		SOFTLINK="/www/ipseclog.txt"
		LOGFILE="/tmp/ipseclog.log"
		cp -f $SOFTLINK $LOGFILE
		htmlCatFrom "$LOGFILE";
		rm $LOGFILE
		;;
	'downloadMib')
		LOGFILE="/www/snmp.mib"
		htmlCatFrom "$LOGFILE";
		;;
	*)
		exit 1
		;;
esac

exit 0
