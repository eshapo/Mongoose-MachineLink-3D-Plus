#!/bin/sh

log() {
	logger -t "eth.cgi" -- "$@"
}

# splits CGI query into var="value" strings
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
			x=gsub(/$/,"\"",z);
			print z;
		}
	}'
}

qlist=`cgi_split "$QUERY_STRING"`

split() {
	shift $1
	echo "$1"
}

# Get the device node and name (but don't get any other params yet!)
while read V; do
	VAR="CGI_PARAM_$V"
	SEP="$(echo "$VAR" | tr '=' ' ')"
	NAME="$(split 1 $SEP)"
	VAL="'$(split 2 $SEP)'"

	if [ "$NAME" = "CGI_PARAM_cmd" ]; then
		eval $VAR
	fi

	# take all params starting with CGI_PARAM_opt
	if [ -n "$NAME" -a "${NAME/CGI_PARAM_*/}" = "" ]; then
		eval $VAR
	fi

done << EOF
$qlist
EOF

encodeJSON() {
	arg="$1"
	i=0
	while [ $i -lt ${#arg} ]; do c=${arg:$i:1}; printf '\u%04X' "'$c'"; i=$((i+1)); done
}

uri_decode() {
	arg="$1"
	i="0"
	while [ "$i" -lt ${#arg} ]; do
		c0=${arg:$i:1}
		if [ "x$c0" = "x%" ]; then
			c1=${arg:$((i+1)):1}
			c2=${arg:$((i+2)):1}
			printf "\x$c1$c2"
			i=$((i+3))
		else
			echo -n "$c0"
			i=$((i+1))
		fi
	done
}

print_commands() {
	cat << EOF
info
info_wan
info_profile
info_eth_profile
apply_vlan
get_existing_wan_profile
get_new_wan_profile
EOF
}

htmlWrite() {
	echo -n -e "$@"
}

htmlWriteReply() {
	htmlWrite "HTTP/1.0 200 OK\n"
	htmlWrite "Content-type: text/plain\n"
	htmlWrite "Cache-Control: no-cache\n"
	htmlWrite "Connection: keep-alive\n\n"
}

htmlCatTo() {
	target="$1"
	
	# download - max 64kb
	head -c $((64*1024*1024)) > "$target"
	
	return $?
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
	
	file_size=$(stat -c %s "$1")
	
	log "filename=$filename , file_size=$file_size"

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

htmlReadUntilBlank() {
	while read line; do
		if ! echo "$line" | tr -d '\r' | grep -q "^$"; then
			continue
		fi
		
		return 0
	done
	
	return 1
}

htmlParsePostData() {
	while read line; do
		if echo "$line" | grep -q "Content-Disposition: .* filename="; then
			continue
		elif echo "$line" | grep -q "Content-Type: "; then
			htmlReadUntilBlank
			return 0
		elif echo "$line" | grep -q "Content-Disposition: form-data; name="; then
			variable=$(echo "$line" | sed -n 's/.* name="\([a-zA-Z_]*\)".*/\1/p')
			
			htmlReadUntilBlank

			read line
			value=$(echo "$line" | tr -d '\r')
			
			log "Disposition: $variable=$value detected"
			
			case "$variable" in
				'subaction')
					vpn_cgi_subaction="$value"
					;;
					
				'param')
					vpn_cgi_param="$value"
					;;
					
				*)
					;;
			esac
		fi
			
	done
	
	return 1
}

htmlWriteJSONB() {
	# print json output
	echo "{"
}

htmlWriteJSONE() {
	echo "\"cgiresult\":$cgiresult"
	echo "}"

}

eth_cgi_get_new_wan_profile() {

	local wan="$CGI_PARAM_opt1"
	local profile

	htmlWriteReply

	htmlWriteJSONB

	# get wan profile
	profile=$(rdb_get -L "link.profile." | grep -v '^link\.profile\.0\.' | sed -n "s/^link\\.profile\\.\\([0-9]\\+\\)\\.dev $wan/\\1/p")
	# assign wan profile
	if [ -z "$profile" ]; then

		# get last profile
		last_profile=$(rdb_get -L link.profile. | grep -v '^link\.profile\.0\.' | sed -n 's/^link\.profile\.\([0-9]\+\)\.enable [0-1]/\1/p' | sort -n -u | tail -n 1)
		test -z "$last_profile" && last_profile="0"
		profile=$(($last_profile+1))
	fi

	cat << EOF
"profile":"$profile",
EOF
	cgiresult=0

	htmlWriteJSONE
}

eth_cgi_apply_vlan() {
	htmlWriteReply

	htmlWriteJSONB

	local eth

	vlan_cfg.sh "get_interfaces" "lan" | while read eth; do
		profile=$(rdb_get -L "link.profile." | grep -v '^link\.profile\.0\.' | sed -n "s/^link\\.profile\\.\\([0-9]\\+\\)\\.dev $eth/\\1/p")

		if [ -n "$profile" ]; then
			rdb_set "link.profile.$profile.enable" "0"
		fi
	done

	rdb_set "network.interface.trigger" "1"

	cgiresult=0
	htmlWriteJSONE
}

eth_cgi_get_existing_wan_profile() {

	local wan="$CGI_PARAM_opt1"
	local profile

	htmlWriteReply

	htmlWriteJSONB

	# get wan profile
	profile=$(rdb_get -L "link.profile." | grep -v '^link\.profile\.0\.' | sed -n "s/^link\\.profile\\.\\([0-9]\\+\\)\\.dev $wan/\\1/p")

	cat << EOF
"profile":"$profile",
EOF
	cgiresult=0

	htmlWriteJSONE
}

eth_cgi_info_wan() {
	htmlWriteReply
	
	local wan

	htmlWriteJSONB

	echo '"interfaces":['
	vlan_cfg.sh "get_interfaces" "wan" | while read wan; do

		if [ -n "$wan_hwclass" ]; then
			echo "	,"
		fi

		wan_hwclass="$wan"
		wan_name=$(rdb_get "sys.hw.class.$wan.name")
		wan_loc=$(rdb_get "sys.hw.class.$wan.location")
		wan_desc=$(rdb_get "sys.hw.class.$wan.desc")
		wan_stat=$(rdb_get "sys.hw.class.$wan.status")
		wan_mode=$(rdb_get "network.interface.$wan.mode")

		wan_mac=$(rdb_get "sys.hw.class.$wan.mac")

		json_wan_loc=$(encodeJSON "$wan_loc")
		json_wan_desc=$(encodeJSON "$wan_desc")
		json_wan_mac=$(encodeJSON "$wan_mac")

		cat << EOF
	{
		"hwclass":"$wan_hwclass",
		"name":"$wan_name",
		"loc":"$json_wan_loc",
		"status":"$wan_stat",
		"desc":"$json_wan_desc",
		"mode":"$wan_mode",
		"mac":"$json_wan_mac"
	}
EOF
	done

	echo '],'

	cgiresult=$?

	htmlWriteJSONE
}

eth_cgi_info_eth_profile() {
	htmlWriteReply
	
	htmlWriteJSONB
	
	local pf=""
	local pf_name=""
	local pf_dev
	local pf_metrics
	local pf_if
	local dev=""

	echo '"eth_profiles":['

	vlan_cfg.sh "get_active_profiles" | while read pf; do

		# get dev type
		dev=$(rdb_get "link.profile.$pf.dev")
		pf_dev_type=${dev/.*/}

		# print delimiter
		if [ -n "$pf_dev" ]; then
			echo "	,"
		fi

		pf_dev="$dev"
		pf_name=$(rdb_get "link.profile.$pf.name")
		pf_metrics=$(rdb_get "link.profile.$pf.defaultroutemetric")
		pf_if=$(rdb_get "link.profile.$pf.interface")

		cat << EOF
	{
		"pf":$pf,
		"name":"$pf_name",
		"dev":"$pf_dev",
		"dev_type":"$pf_dev_type",
		"metrics":"$pf_metrics",
		"status":"$(rdb_get "link.profile.$pf.status")",
		"network_if":"$pf_if",
		"conntype":"$(rdb_get "link.profile.$pf.conntype")",
		"ip":"$(rdb_get "link.profile.$pf.iplocal")",
		"gw":"$(rdb_get "link.profile.$pf.ipremote")",
		"mask":"$(rdb_get "link.profile.$pf.mask")",
		"dns1":"$(rdb_get "link.profile.$pf.dns1")",
		"dns2":"$(rdb_get "link.profile.$pf.dns2")",
		"fo_status":"$(rdb_get "service.failover.$pf.status")",
		"monitor_type":"$(rdb_get "service.failover.$pf.monitor_type")"
	}
EOF

	done

	echo '],'

	cgiresult=$?

	htmlWriteJSONE
}

eth_cgi_info_profile() {
	htmlWriteReply
	
	htmlWriteJSONB
	
	local pf=""
	local pf_name=""
	local pf_dev
	local pf_metrics
	local pf_if

	echo '"profiles":['

	vlan_cfg.sh "get_active_profiles" | while read pf; do

		if [ -n "$pf_dev" ]; then
			echo "	,"
		fi

		pf_name=$(rdb_get "link.profile.$pf.name")
		pf_dev=$(rdb_get "link.profile.$pf.dev")
		pf_metrics=$(rdb_get "link.profile.$pf.defaultroutemetric")
		pf_if=$(rdb_get "link.profile.$pf.interface")

		cat << EOF
	{
		"pf":$pf,
		"name":"$pf_name",
		"dev":"$pf_dev",
		"metrics":"$pf_metrics",
		"network_if":"$pf_if"
	}
EOF

	done

	echo '],'

	cgiresult=$?

	htmlWriteJSONE
}

eth_cgi_info() {
	htmlWriteReply
	
	htmlWriteJSONB
	
	local eth
	local eth_name=""

	echo '"interfaces":['
	vlan_cfg.sh "get_interfaces" | while read eth; do

		if [ -n "$eth_hwclass" ]; then
			echo "	,"
		fi

		eth_hwclass="$eth"
		eth_name=$(rdb_get "sys.hw.class.$eth.name")
		eth_loc=$(rdb_get "sys.hw.class.$eth.location")
		eth_desc=$(rdb_get "sys.hw.class.$eth.desc")
		eth_stat=$(rdb_get "sys.hw.class.$eth.status")
		eth_mode=$(rdb_get "network.interface.$eth.mode")

		eth_mac=$(rdb_get "sys.hw.class.$eth.mac")

		wan_link="0"
		if [ -n "$eth_name" ]; then
			eth_mac=$(ifconfig "$eth_name" | sed -rn 's/.* HWaddr ([0-9a-fA-F]+)/\1/p')

			if [ "$eth_loc" = "gadget" ]; then
				# do not include UNKNOWN state - ntc-140wx initially has UNKNOWN state.
				if ip link show "$eth_name" | grep -q ' state UP'; then
					wan_link="1"
				fi
			else
				if ifconfig "$eth_name" | grep -q 'RUNNING.* MTU:'; then
					wan_link="1"
				fi
			fi
		else
			wan_link=""
		fi
		
		# use hardware switch link status instead for cpsw (ntc-140wx)
		id=$(rdb_get "sys.hw.class.$eth.id")
		if [ "$id" = 'platform-cpsw-1' -o "$id" = 'platform-cpsw-2' ]; then

			local st
			
			if [ "$id" = 'platform-cpsw-1' ]; then
				st=$(rdb_get "hw.switch.port.0.status")
			else
				st=$(rdb_get "hw.switch.port.1.status")
			fi

			if [ -n "$st" ]; then
				if [ -z "${st/ur*/}" ]; then
					wan_link="1"
				else
					wan_link="0"
				fi
			fi
		fi
		

		json_eth_loc=$(encodeJSON "$eth_loc")
		json_eth_desc=$(encodeJSON "$eth_desc")
		json_eth_mac=$(encodeJSON "$eth_mac")



		cat << EOF
	{
		"hwclass":"$eth_hwclass",
		"name":"$eth_name",
		"loc":"$json_eth_loc",
		"link":"$wan_link",
		"status":"$eth_stat",
		"desc":"$json_eth_desc",
		"mode":"$eth_mode",
		"mac":"$json_eth_mac"
	}
EOF
	done

	echo '],'

	cgiresult=$?

	htmlWriteJSONE
}


# bypass if it is an unknown command 
if [ -z "$CGI_PARAM_cmd" ] || ! print_commands | grep -q "^$CGI_PARAM_cmd$"; then

	log "unknown command specified - cmd='$CGI_PARAM_cmd', opt1='$CGI_PARAM_opt1', opt2='$CGI_PARAM_opt2', opt3='$CGI_PARAM_opt3'"

	# return error
	cat << EOF
{
	"cgiresult":255
}
EOF

	exit 0
fi

if [ "${CGI_PARAM_cmd/_*/}" = "info" ]; then
	info_cmd=1
else
	info_cmd=0
fi

if [ "$info_cmd" = "0" ]; then
	if [ -z  "${SESSION_ID}" -o "${SESSION_ID}" != "${sessionid}" ]; then
		exit 0
	fi

fi

if [ "$info_cmd" = "0" ]; then
	log "starting command... [cmd='${CGI_PARAM_cmd}',opt1='${CGI_PARAM_opt1}']"
fi

# start command
eval eth_cgi_${CGI_PARAM_cmd} 2> /dev/null

if [ "$info_cmd" = "0" ]; then
	if [ $cgiresult -eq 0 ]; then
		log "finishing command... succ ['${CGI_PARAM_cmd}']"
	else
		log "finishing command... fail ['${CGI_PARAM_cmd}',cgiresult:$cgiresult]"
	fi	
fi

exit 0
