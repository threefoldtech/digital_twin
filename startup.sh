#!/bin/bash

set -euxo pipefail

[ -f "${conf_file}" ] || yggdrasil -genconf >/etc/yggdrasil.conf

exec yggdrasil -useconffile /etc/yggdrasil.conf

cd /backend 
nginx
pm2 start dist/src/index.js &
tail -f /dev/null