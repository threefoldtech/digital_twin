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