#!/bin/sh
echo -e 'Content-type: text/html\n'

if [ -z  "${SESSION_ID}" -o "${SESSION_ID}" != "${sessionid}" ]; then
	exit 0
fi

v=`cat /etc/cdcs/conf/default.conf 2> /dev/null |sed -n 's/^link.profile.0.address;0;0;0;32;\(.*\)/\1/p' | tail -n 1`
echo "var default_ip=\""$v"\";"

v=`cat /etc/cdcs/conf/default.conf 2> /dev/null |sed -n 's/^admin.user.root;0;0;0;[0-9][0-9];\(.*\)/\1/p' | tail -n 1`
echo "var default_root_pass=\""$v"\";"
						  
v=`cat /etc/cdcs/conf/default.conf 2> /dev/null |sed -n 's/^admin.user.admin;0;0;0;96;\(.*\)/\1/p' | tail -n 1`
echo "var default_admin_pass=\""$v"\";"
