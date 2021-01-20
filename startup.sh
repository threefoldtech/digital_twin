# /bin/bash
cd /sockets 
nginx
node index.js &
tail -f /dev/null