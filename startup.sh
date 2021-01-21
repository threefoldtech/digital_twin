# /bin/bash
cd /backend 
nginx
node index.js &
tail -f /dev/null