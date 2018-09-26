#!/bin/sh
if [ -z  "${SESSION_ID}" -o "${SESSION_ID}" != "${sessionid}" ]; then
	# Login failure notification should be sent before login
	if [ "$CMD" != "EVTNOTI_WEBUI_LOGIN_FAILURE" ]; then
	exit 0
	fi
fi

#---------------------------------------------------------------------------
# For help text
#---------------------------------------------------------------------------
if [ "$1" = "--help" -o "$1" = "-h" ]; then
	echo "This shell script is for internal system use only."
	echo "It is used to interface with Event Notification WEBUI to provide NetCommWireless Event Notification functionality."
    echo "Please do not run this script manually."
	exit 0
fi

log()
{
	logger "event `basename ${0}`: ${1}"
}

#log "query str = $QUERY_STRING"
#log "contents len = $CONTENT_LENGTH"
#log "contents type = $CONTENT_TYPE"
#log "cgi cmd = $CMD"

TMP_FILE="/tmp/event_temp"
# read http req. contents to temp file & include to set variables
cat > $TMP_FILE && cat $TMP_FILE | sed -r 's/&/\n/g' > $TMP_FILE"2" && mv $TMP_FILE"2" $TMP_FILE
. $TMP_FILE

#-------------------------------------------------------------------------
# Build common html header
#-------------------------------------------------------------------------
if [ "$CMD" != "EVTNOTI_DOWNLOADLOG" ]; then
	echo -n -e "HTTP/1.0 200 OK\n"
	echo -n -e "Content-type: text/plain\n"
	echo -n -e "Cache-Control: no-cache\n"
	echo -n -e "Connection: keep-alive\n\n"
fi

#-------------------------------------------------------------------------
# parse command
#-------------------------------------------------------------------------

#-------------------------------------------------------------------------
# Get Event Notification Configuration
#-------------------------------------------------------------------------
if [ "$CMD" = "EVTNOTI_CONF_GET" ]; then
	echo "EventNotiEn=\"`rdb_get service.eventnoti.conf.enable`\";"
	echo "MaxEventNotiBufSize=\"`rdb_get service.eventnoti.conf.max_size`\";"
	echo "MaxEventNotiRetryCount=\"`rdb_get service.eventnoti.conf.max_retry`\";"
	echo "WriteEventNotiToFile=\"`rdb_get service.eventnoti.conf.save_to_file`\";"
	echo "EventNotiLogFile=\"`rdb_get service.eventnoti.conf.log_file`\";"
	echo "EventNotiPrefixText=\"`rdb_get service.eventnoti.conf.prefix_text`\";"

	let "idx=1"
	while true; do
		eval $(rdb_get -L service.eventnoti.conf.type | sed -n "s/^service\.eventnoti\.conf\.type\.$idx\.\([^[:space:]]*\)[[:space:]]\(.*\)/\1=\"\2\"/p")
		test -z "$dest_idx" && break
		echo "EventNotiEnabledClients[$idx]=\"$enabled_clients\";"
		enabled_clients=""
		echo "EventNotiDestIdx[$idx]=\"$dest_idx\";"
		dest_idx=""
		let "idx+=1"
	done
fi

update_config_variable()
{
	if [ "$1" != "$2" ]; then
		rdb_set "$3" "$2" -p
		log "update config : '$3' : $1 --> $2"
	fi
}

delete_config_variable()
{
	rdb_del "$1" >/dev/null 2>&1
	log "deleted config : $1"
}

#-------------------------------------------------------------------------
# Set Event Notification Configuration
#-------------------------------------------------------------------------
if [ "$CMD" = "EVTNOTI_CONF_SET" ]; then
	#read_config_and_eval_local_vars()
	eval $(rdb_get -L service.eventnoti.conf | grep -v type | grep -v dest | sed -n "s/^service\.eventnoti\.conf\.\([^[:space:]]*\)[[:space:]]\(.*\)/\1=\"\2\"/p")

	# save changed variables only
	update_config_variable "$enable" "$new_enable" "service.eventnoti.conf.enable"
	update_config_variable "$max_size" "$new_max_size" "service.eventnoti.conf.max_size"
	update_config_variable "$max_retry" "$new_max_retry" "service.eventnoti.conf.max_retry"
	update_config_variable "$save_to_file" "$new_save_to_file" "service.eventnoti.conf.save_to_file"
	update_config_variable "$log_file" "$new_log_file" "service.eventnoti.conf.log_file"
	update_config_variable "$prefix_text" "$new_prefix_text" "service.eventnoti.conf.prefix_text"

	let "idx=1"
	while true; do
		eval new_dest_idx=\${"new_dest_idx"$idx}
		test -z "$new_dest_idx" && break
		eval $(rdb_get -L service.eventnoti.conf.type | sed -n "s/^service\.eventnoti\.conf\.type\.$idx\.\([^[:space:]]*\)[[:space:]]\(.*\)/\1=\"\2\"/p")
		update_config_variable "$dest_idx" "$new_dest_idx" "service.eventnoti.conf.type.$idx.dest_idx"
		dest_idx=""
		eval new_clients=\${"new_clients"$idx}
		update_config_variable "$enabled_clients" "$new_clients" "service.eventnoti.conf.type.$idx.enabled_clients"
		enabled_clients=""
		let "idx+=1"
	done

fi

#-------------------------------------------------------------------------
# Send WEBUI Login failure Notification
#-------------------------------------------------------------------------
if [ "$CMD" = "EVTNOTI_WEBUI_LOGIN_FAILURE" ]; then
	elogger 10 "WEBUI login failed, username $USER, password $PASS" 2>/dev/null >/dev/null
fi

#-------------------------------------------------------------------------size
# Read Event Notification log data from the file
#-------------------------------------------------------------------------
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

	log "here..."
	log "source = $source, filename = $filename"

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

if [ "$CMD" = "EVTNOTI_GETLOG" ]; then
	ENOTI_LOGFILE=`rdb_get service.eventnoti.conf.log_file`
	if [ ! -e "$ENOTI_LOGFILE" ]; then
		htmlWriteLog "$ENOTI_LOGFILE does not exist"
	else
		while read line; do
			echo -e "${line}"
		done <$ENOTI_LOGFILE
	fi
fi

#-------------------------------------------------------------------------
# Check if Event Notification log file exists
#-------------------------------------------------------------------------

if [ "$CMD" = "EVTNOTI_LOGFILE_CHECK" ]; then
	ENOTI_LOGFILE=`rdb_get service.eventnoti.conf.log_file`
	if [ -e "$ENOTI_LOGFILE" ]; then
		echo "EventNotiLogFileExist=1;"
	else
		echo "EventNotiLogFileExist=0;"
	fi
fi

#-------------------------------------------------------------------------
# Download Event Notification log file
#-------------------------------------------------------------------------

if [ "$CMD" = "EVTNOTI_DOWNLOADLOG" ]; then
	ENOTI_LOGFILE=`rdb_get service.eventnoti.conf.log_file`
	if [ ! -e "$ENOTI_LOGFILE" ]; then
		echo -n -e "HTTP/1.0 200 OK\n"
		echo -n -e "Content-type: text/plain\n"
		echo -n -e "Cache-Control: no-cache\n"
		echo -n -e "Connection: keep-alive\n\n"
		htmlWriteLog "$ENOTI_LOGFILE does not exist"
	else
		htmlCatFrom $ENOTI_LOGFILE
	fi
fi

#-------------------------------------------------------------------------
# Clear Event Notification log file
#-------------------------------------------------------------------------

if [ "$CMD" = "EVTNOTI_CLEARLOG" ]; then
	elogger 0 "clearlog"
fi

#-------------------------------------------------------------------------
# Get Event Destination Configuration
#-------------------------------------------------------------------------
if [ "$CMD" = "EVTNOTI_DEST_GET" ]; then
	let "idx=1"
	while true; do
		dest_name=`rdb_get service.eventnoti.conf.dest.$idx.name`
		test -z "$dest_name" && break
		echo "EventNotiDestName[$idx]=\"$dest_name\";"
		echo "EventNotiDestEmailAddr[$idx]=\"`rdb_get service.eventnoti.conf.dest.$idx.email_addr`\";"
		echo "EventNotiDestSmsAddr[$idx]=\"`rdb_get service.eventnoti.conf.dest.$idx.sms_addr`\";"
		echo "EventNotiDestTcpAddr[$idx]=\"`rdb_get service.eventnoti.conf.dest.$idx.tcp_addr`\";"
		echo "EventNotiDestTcpPort[$idx]=\"`rdb_get service.eventnoti.conf.dest.$idx.tcp_port`\";"
		echo "EventNotiDestUdpAddr[$idx]=\"`rdb_get service.eventnoti.conf.dest.$idx.udp_addr`\";"
		echo "EventNotiDestUdpPort[$idx]=\"`rdb_get service.eventnoti.conf.dest.$idx.udp_port`\";"
		let "idx+=1"
	done

fi

#-------------------------------------------------------------------------
# Set Event Destination Configuration
#-------------------------------------------------------------------------
if [ "$CMD" = "EVTNOTI_DEST_SET" ]; then
	#read_config_and_eval_local_vars()

	let "idx=1"
	while true; do
		eval new_name=\${"new_name"$idx}
		if [ -z "$new_name" ]; then
			while true; do
				rdb_get service.eventnoti.conf.dest.$idx.name; test "$?" == "255" && break
				delete_config_variable service.eventnoti.conf.dest.$idx.name
				delete_config_variable service.eventnoti.conf.dest.$idx.email_addr
				delete_config_variable service.eventnoti.conf.dest.$idx.sms_addr
				delete_config_variable service.eventnoti.conf.dest.$idx.tcp_addr
				delete_config_variable service.eventnoti.conf.dest.$idx.tcp_port
				delete_config_variable service.eventnoti.conf.dest.$idx.udp_addr
				delete_config_variable service.eventnoti.conf.dest.$idx.udp_port

				#keep checking and deleting service.eventnoti.conf.dest.<index>.XXX while the index=$idx+n
				let "idx+=1"
			done
			break
		else
			eval $(rdb_get -L service.eventnoti.conf.dest | sed -n "s/^service\.eventnoti\.conf\.dest\.$idx\.\([^[:space:]]*\)[[:space:]]\(.*\)/\1=\"\2\"/p")
			update_config_variable "$name" "$new_name" "service.eventnoti.conf.dest.$idx.name"
			name=""

			eval new_sms_address=\${"new_sms_address"$idx}
			update_config_variable "$sms_addr" "$new_sms_address" "service.eventnoti.conf.dest.$idx.sms_addr"
			sms_addr=""

			eval new_email_address=\${"new_email_address"$idx}
			update_config_variable "$email_addr" "$new_email_address" "service.eventnoti.conf.dest.$idx.email_addr"
			email_addr=""

			eval new_tcp_address=\${"new_tcp_address"$idx}
			update_config_variable "$tcp_addr" "$new_tcp_address" "service.eventnoti.conf.dest.$idx.tcp_addr"
			tcp_addr=""

			eval new_tcp_port=\${"new_tcp_port"$idx}
			update_config_variable "$tcp_port" "$new_tcp_port" "service.eventnoti.conf.dest.$idx.tcp_port"
			tcp_port=""

			eval new_udp_address=\${"new_udp_address"$idx}
			update_config_variable "$udp_addr" "$new_udp_address" "service.eventnoti.conf.dest.$idx.udp_addr"
			udp_addr=""

			eval new_udp_port=\${"new_udp_port"$idx}
			update_config_variable "$udp_port" "$new_udp_port" "service.eventnoti.conf.dest.$idx.udp_port"
			udp_port=""
		fi
		let "idx+=1"
	done

	# save service.eventnoti.conf.type.X.dest_idx since it possible be rectified
	let "idx=1"
	while true; do
		eval new_dest_idx=\${"new_dest_idx"$idx}
		test -z "$new_dest_idx" && break
		eval $(rdb_get -L service.eventnoti.conf.type | sed -n "s/^service\.eventnoti\.conf\.type\.$idx\.\([^[:space:]]*\)[[:space:]]\(.*\)/\1=\"\2\"/p")
		update_config_variable "$dest_idx" "$new_dest_idx" "service.eventnoti.conf.type.$idx.dest_idx"
		dest_idx=""
		let "idx+=1"
	done

fi

exit 0
