#/bin/bash

FILE=/etc/yggdrasil.conf
if test -f "$FILE"; then
    echo "$FILE already exists."
else
    yggdrasil -genconf > /etc/yggdrasil.conf
    echo "Generated a new yggdrasil conf file $FILE ."
fi

exec yggdrasil -useconffile /etc/yggdrasil.conf -logto /var/log/yggdrasil/yggdrasil.log >> /var/log/yggdrasil/yggdrasil.log &

nginx

cd /backend 
echo MyYggdrasilAddress=$(yggdrasilctl  -v getSelf | sed -n -e 's/^.*IPv6 address.* //p') >> ~/.bashrc
pm2 start dist/src/index.js &


tail -f /dev/null