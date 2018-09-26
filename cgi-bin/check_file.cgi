#!/bin/sh
echo -e 'Content-type: text/html\n'

if [ -z  "${SESSION_ID}" -o "${SESSION_ID}" != "${sessionid}" ]; then
	exit 0
fi

v=`ls $QUERY_STRING 2>/dev/null`
echo "var result=\""$v"\";"
