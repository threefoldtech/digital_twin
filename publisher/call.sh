#!/bin/bash
set -x

endpoint=$1
method=$2
dataval=$3
header=""
host="10.241.0.240"
port="3000"

if [ "$method" == "" ]; then
    method="GET"
fi

if [ "$method" != "GET" ]; then
    content="Content-type: application/json"
fi

curl -v -s -w "\n" -H "$content" -X $method http://${host}:${port}${endpoint} -d "$dataval" | jq
