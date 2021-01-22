# /bin/bash
cd /backend 
nginx
pm2 start dist/index.js &
tail -f /dev/null