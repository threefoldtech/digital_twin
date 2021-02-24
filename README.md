## Digital twin application.

This will give you the tools to take back the ownership over your digital self.

In a first phase you will be able to communicate safely and peer2peer with other people in the ThreeFold Network through a chat implementation.

In later phases, file management, video group chats, and wiki will be integrated.

### Docker build && deploy
docker build -t jimbersoftware/chat:0.5 .
docker run -d --name tobias-chat  --network=chatnet --sysctl net.ipv6.conf.all.disable_ipv6=0 --cap-add=NET_ADMIN --device=/dev/net/tun jimbersoftware/chat:0.5 
