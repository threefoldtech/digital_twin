# Dev environment
## Digitaltwin spawner
* `clone https://github.com/threefoldtech/digitaltwin_spawner`
* `cd digitaltwin_spawner`
* Create certificates in ./certs
* `docker-compose up -d --build`

## hosts file
Add the following records to your hosts file
```
127.0.0.1  development.digitaltwin.jimbertesting.be
127.0.0.1  doublename.digitaltwin.jimbertesting.be
127.0.0.1  digitaltwin.jimbertesting.be
```

## Run digitaltwin development docker (Linux)
docker network create chatnet
docker-compose up --build

### Spin up other digitaltwins
docker run -d --name doublename-chat  --network=chatnet --sysctl net.ipv6.conf.all.disable_ipv6=0 --cap-add=NET_ADMIN --device=/dev/net/tun jimbersoftware/chat:0.5 