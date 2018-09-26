#!/bin/sh

echo -e 'Content-type: text/html\n'
if [ -z  "${SESSION_ID}" -o "${SESSION_ID}" != "${sessionid}" ]; then
	exit 0
fi

#test -n "$QUERY_STRING" && date +%m%d%H%M%Y -s "$QUERY_STRING" 2>/dev/null

# export v variables
. /etc/variant.sh 2> /dev/null > /dev/null

if [ -n "$QUERY_STRING" ]; then
	rdb_set "system.browser.time" "$QUERY_STRING"
	if [ "$V_TIMEDAEMON" != "y" ]; then
		date -u -s "$QUERY_STRING" 2>/dev/null
		echo -e '200 OK\n'
	fi
else
	echo "date=\""`date`"\";"
fi
