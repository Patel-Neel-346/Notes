### Use cases of Nginx
- Web Server
- Reverse proxy
	- Load Balancing
	- Backend Routing
	- Caching
	- API Gateway
## Layer4 VS Layer7 proxying
#### Layer 4
In layer 4 we see TCP/IP stack only nothing about the app.
So we can see things which are related to layer 4
- Source IP (from where is this segement is coming and the IP packets )
- Source Port
- Destination IP and Destination Port
- Simple packet inspectoin (SYN / TLS)
These things are not encrypted so if we do sniffing then we can easily see the data
#### Layer 7
In layer 7 we see HTTP/GRPC etc.
- In this layer we can even see which  url they are vising along with the data 
- We can do routing
- We can do API gateway
### Layer4 and Layer7 proxying in Nginx
Nginx can operate in layer4 as well as in layer7.
- Layer4 proxying is usefull when nginx doesn't understand the protocol(MySql database protocol)
- Layer7 proxying is usefull when nginx want to share backend connections and cache results. 
  To do these things he has to decrypt the data of the client which is secured by TLS, and to do that he can do TLS termination and TLS passthrough
### TLS termination and TLS passthrough
**Transport Layer Security**
- It's a way to establish one-to-one encryption between one and another
- Symmetric encryption is used for the communication(client and server has the same key)
- Asymetric encryption is used initially to exchange that symmetric key(diffie hellman)
- Server (sometimes even the client) need to authenticate themselves by supplying a certificate signed by a certificate authority
#### TLS termination
- Nginx has TLS(eg.HTTPs) and backend doesn't have (he is in HTTP)
- Nginx terminates the TLS and decrypts and send the unecrypted data to backend(! anyone can see that using sniffing)
- Nginx is TLS(HTTPS) and backend is also a TLS(HTTPS),BTW this is what recommended on the cloud. Now Nginx terminates the TLS and re-encrypt the content to the backend.
#### TLS passthrough
- Nginx proxies/streams the ip packets directly to the backend
- Just like a tunnel
- No caching, L4 check only, but more secure, Nginx doesn't need the backend certificate
### Nginx Internals
--- Still need to complete---
