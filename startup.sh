# /bin/bash
cd /backend 
nginx
pm2 start dist/src/index.js &
tail -f /dev/null