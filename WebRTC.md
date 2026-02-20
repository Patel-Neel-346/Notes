### NAT (Network Address Translation)
There are four methods of Network Translation
1. One To One NAT(Full Cone NAT)
- Router will only try to match its public ip with external port
3. Address Restricted NAT
- Router will also match Destination ip(Address) along with its public ip and external port
5. Port Restricted NAT
- Router will also try to match Destination port along with satisfying above conditions
7. Symmetric NAT
- Router will match the whole pair in this
### STUN (Session Traversal Utility for NAT)
- When we make request to these type of server they will send our public ip as response but this info will be meaningless if we are under symmetric NAT
### TURN (Traversal Using Relay Around NAT)
### ICE (Interactive Connectivity Establishment)
- ICE collects all the avilable candidates (local IP address, reflexive IP address(IP's inside same same wifi/router), STUN ones and relayed addresses and TURN ones). These candidates are called ICE candidates
- All the collected candidates send to remote in a SDP form
