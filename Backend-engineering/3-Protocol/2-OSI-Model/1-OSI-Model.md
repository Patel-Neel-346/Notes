# **OSI Model (Open Systems Interconnection Model)**

I recommend adding the **OSI Model as a separate major section immediately after Part 1: Understanding Protocols and before Part 2: How Protocols Work in Practice.**

Why? Because before learning TCP, UDP, HTTP, DNS, MAC addresses, and other protocols, you should understand **which layer of network communication each protocol belongs to and what responsibility that layer has.**

The OSI model gives you that foundation.

# **1. What Is the OSI Model?**

The **OSI (Open Systems Interconnection) Model** is a conceptual networking model that explains how data travels between two devices over a network.

It divides network communication into seven different layers.

Each layer has a specific responsibility and works with the layers above and below it.

The seven layers are:

1. Physical Layer
2. Data Link Layer
3. Network Layer
4. Transport Layer
5. Session Layer
6. Presentation Layer
7. Application Layer

The main purpose of the OSI model is to standardize and explain network communication so that different hardware, operating systems, and applications can communicate with one another.

**Simple example:**

Imagine you open a website in your browser.

- Your browser creates an HTTP request.
- The data is prepared for transmission.
- Transport protocols handle application communication.
- IP handles network addressing and routing.
- Ethernet or Wi-Fi handles local network delivery.
- Physical signals carry the data.

The OSI model helps us understand these responsibilities separately.

## **2. OSI Model Diagram – Recommended Image**

Recommended for your notes

[Network Protocols Run the Internet - by Alex Xu](https://images.openai.com/static-rsc-4/2AK2O50AJLr9FtagDK63gtKtEkQXckuoCDbE6O2bH93R1zK3KlNyIYej6UQSdRvogcpfhd4x3jnoNj2qd_HklCK77gknYguWQKwNOea6isACRBSf5VqB7__zJfnDL5MDICOQRSElQeCb3PMxarckkyXkjIF0on6hcwWpFvGszlE?purpose=inline)

[blog.bytebytego.com](https://blog.bytebytego.com/p/network-protocols-run-the-internet?utm_source=chatgpt.com)

This diagram is particularly useful because it shows:

- All seven OSI layers.
- The responsibility of each layer.
- Protocol examples.
- The relationship between OSI and TCP/IP models.

**Where to put this image in your notes:**

Place it immediately after the introduction and before the heading **"3. The Seven Layers of the OSI Model."**

Image source: [ByteByteGo – Network Protocols Run the Internet](https://blog.bytebytego.com/p/network-protocols-run-the-internet?utm_source=chatgpt.com).

## **3. The Seven Layers of the OSI Model**

[My Experience with the TryHackMe Room: Networking Concepts | by Arthibalaji | Medium](https://images.openai.com/static-rsc-4/N28C9hah6GITlvT73zHU8wfLel36rlpkizRwUDDvqK3oTqw9JybStoENVxgjSo_uGiA85KUMl557EK-zMzmMi6F_UZI0hytrftbyyTHTkwAYAXcexX2Ir9wKdSd_iBaL7tZP841OdOue15zXuIHG9lAk7ZFpwcKk3Wna_j-nnMs?purpose=inline)

[medium.com](https://medium.com/%40arthibalaji0705/my-experience-with-the-tryhackme-room-networking-concepts-26298226a9da?utm_source=chatgpt.com)

The OSI model is numbered from bottom to top when explaining the actual transmission process.

| Layer | Name         | Main responsibility                                   |
| ----- | ------------ | ----------------------------------------------------- |
| 7     | Application  | Provides network services to applications             |
| 6     | Presentation | Data formatting, encoding, encryption and compression |
| 5     | Session      | Establishes, manages and terminates sessions          |
| 4     | Transport    | End-to-end data delivery                              |
| 3     | Network      | IP addressing and routing                             |
| 2     | Data Link    | Local network delivery and framing                    |
| 1     | Physical     | Transmits raw bits through physical media             |

Let's understand each layer in detail.

## **4. Layer 1 – Physical Layer**

OSI Layer 1

[OSI Layer 1  :  The Physical Layer LEARNWITHMEGHA](https://images.openai.com/static-rsc-4/KdM82cHSAYhNxz6ZPr76WeddIC3CjLXZoJriEIGZ5t908oFJ7z7uInNtV6X-j_OflJfeBigvx9VZbhulheK-FqBHBzXNNE3v6cJtIQP3bDKoiKIC-v3POkwIJdNLSrh7khMAHwlVH7HP9ktGcnaya-HBu0xexJAfccCJ4fKJQbM?purpose=inline)

[linkedin.com](https://www.linkedin.com/pulse/osi-layer-1-physical-learnwithmegha-meghanath-reddy-deouc?utm_source=chatgpt.com)

The Physical Layer is responsible for transmitting raw bits (0s and 1s) through a physical communication medium.

It deals with the actual signals used to transfer data between devices.

**Main responsibilities:**

- Transmitting bits.
- Defining electrical signals.
- Defining optical signals.
- Defining radio signals.
- Managing transmission speed.
- Defining cables and connectors.
- Defining physical network interfaces.

**Examples of physical media:**

- Ethernet cables.
- Fiber-optic cables.
- Wireless radio signals.
- Coaxial cables.

**Example:**

Imagine connecting your computer to a router using an Ethernet cable.

Your computer needs to convert digital data into electrical signals that can travel through the cable.

At the receiving end, the other device interprets those signals as bits.

That is the responsibility of the Physical Layer.

**Examples of technologies and components:**

| Example                     | Purpose                               |
| --------------------------- | ------------------------------------- |
| Ethernet physical standards | Define physical signaling             |
| Fiber optics                | Transmit data using light             |
| USB physical signaling      | Transmit signals between devices      |
| Repeaters                   | Regenerate signals                    |
| Hubs                        | Connect devices at the physical layer |

**Data Unit (PDU):** Bits

PDU means Protocol Data Unit. It describes the unit of data associated with a particular layer.

## **5. Layer 2 – Data Link Layer**

OSI Layer 2

[Ada Computer Science](https://images.openai.com/static-rsc-4/SaH4ItKXwwLMRauZpQV-dxWkejH-qJUt2N8-lJPYVc1-mZgGs1pi6T8R4iuqAKfAszvoAwX6Es83oD8KPXxkdBYf2kz3hQmsWoct-_JX5ExfZHGMArcDFHsUvXZ-vavD9BXf-fjcZAektzigUkdgM3ar1l9RhhXrHKPd_t3jhXE?purpose=inline)

[adacomputerscience.org](https://adacomputerscience.org/concepts/internet_tcp_ip?topic=the_internet\&utm_source=chatgpt.com)

The Data Link Layer is responsible for communication between devices on the same local network link.

It takes data from the Network Layer and organizes it into frames.

**Main responsibilities:**

- Framing.
- MAC addressing.
- Local network delivery.
- Error detection.
- Media access control.
- Managing communication over the local link.

### **A. What Is a MAC Address?**

A MAC address is a link-layer address associated with a network interface.

Example:

```
00:1A:2B:3C:4D:5E
```

When devices communicate over an Ethernet or Wi-Fi link, MAC addresses help identify the sender and receiver on that link.

### **B. What Is a Frame?**

A frame is the data unit used at the Data Link Layer.

An Ethernet frame contains information such as:

```
+-----------------------+
| Destination MAC       |
+-----------------------+
| Source MAC            |
+-----------------------+
| Type / Length         |
+-----------------------+
| Payload               |
+-----------------------+
| Frame Check Sequence  |
+-----------------------+
```

The Frame Check Sequence (FCS) is used for error detection.

### **C. What Is ARP?**

ARP stands for Address Resolution Protocol.

It helps a device discover the MAC address associated with a known IPv4 address on the local network.

Example:

```
IP Address: 192.168.1.10
MAC Address: 00:1A:2B:3C:4D:5E
```

ARP is commonly associated with the boundary between the Network and Data Link layers.

**Examples of technologies and protocols:**

- Ethernet (IEEE 802.3).
- Wi-Fi (IEEE 802.11).
- PPP.
- VLAN (IEEE 802.1Q).
- ARP (commonly associated with Layer 2).

**Networking devices:**

- Switches.
- Bridges.

**Data Unit (PDU):** Frame

## **6. Layer 3 – Network Layer**

OSI Layer 3

[Routing - DEV Community](https://images.openai.com/static-rsc-4/bUPSDtrjYh4gXR3pAsLQcT9A2Ca3q8FNXzFiuYsfRyWE8ujQHQ2PDI0CPTG0JuLE-aUScgpgv4CN0sM28qoQds-9V_eVThIUeyA1dT_v_AOF9adrI0D1_H-dV6wE5bcJNzSnDfvDf2fAhib2xxRmrgkJMIzRRzwcGxFmnLphKWw?purpose=inline)

[dev.to](https://dev.to/meerthika/routing-10l7?utm_source=chatgpt.com)

The Network Layer is responsible for delivering data between different networks.

Its most important responsibility is routing.

Imagine two computers:

```
Computer A              Computer B

192.168.1.10            192.168.2.20
     |                        |
     |                        |
   Router ---------------- Router
```

These computers belong to different IP networks.

They need a router to forward packets toward the destination.

**Main responsibilities:**

- Logical addressing.
- IP addressing.
- Routing.
- Packet forwarding.
- Path selection.
- Fragmentation in IPv4 where applicable.

### **A. What Is an IP Address?**

An IP address identifies a network interface at the network layer.

Example:

```
192.168.1.10
```

Two common IP versions:

| Version | Address size |
| ------- | ------------ |
| IPv4    | 32 bits      |
| IPv6    | 128 bits     |

### **B. What Is Routing?**

Routing determines how packets travel from their source network toward their destination network.

For example:

```
Computer A
    |
    v
Router 1
    |
    v
Router 2
    |
    v
Router 3
    |
    v
Computer B
```

Each router examines the destination IP address and determines where to forward the packet next.

### **C. What Is a Router?**

A router connects different IP networks and forwards packets between them.

For example, your home router connects your local network to your ISP's network.

**Examples of protocols:**

- IPv4.
- IPv6.
- ICMP.
- IPsec.
- Routing protocols such as OSPF and BGP.

**Networking devices:**

- Routers.
- Layer 3 switches.

**Data Unit (PDU):** Packet

## **7. Layer 4 – Transport Layer**

Especially important for backend developers

[Understanding the OSI Model: A Practical Walkthrough (Layers 4–7) | by Allen Ace | Medium](https://images.openai.com/static-rsc-4/ANCEIkKEJJARDm8sYvHlb1yOC9lDBFik8F7WM-tTwDo44yIGznWmpP66ggS8GylZdgvlQRuJmQFiQgHlL7Q45I8A_QV2agEmLEnx3YuDUASlLMeQzO2ymcZbrmsRSon07IjVAKa7aQ7m94UMC3lrQM9pSLY30JfF4HVRPLLxEc8?purpose=inline)

[allenace.medium.com](https://allenace.medium.com/understanding-the-osi-model-a-practical-walkthrough-layers-4-7-2ab73c922f1d?utm_source=chatgpt.com)

The Transport Layer is responsible for communication between applications running on different devices.

It provides transport services between endpoints.

This is where TCP and UDP operate.

**Main responsibilities:**

- End-to-end transport.
- Segmentation and reassembly.
- Port addressing.
- Reliability when provided by the transport protocol.
- Flow control.
- Error detection.
- Congestion control where provided.

### **A. TCP – Transmission Control Protocol**

TCP provides:

- Reliable delivery.
- Ordered delivery.
- Acknowledgments.
- Retransmission.
- Flow control.
- Congestion control.
- Connection management.

Example:

```
Client                 Server
  |                       |
  |------ TCP SYN ------->|
  |                       |
  |<----- SYN-ACK --------|
  |                       |
  |------ ACK ----------->|
  |                       |
  |   Connection Ready    |
```

This is called the TCP three-way handshake.

### **B. UDP – User Datagram Protocol**

UDP provides lightweight datagram-based communication.

Unlike TCP, UDP does not guarantee delivery or ordering.

Examples of use cases:

- DNS queries.
- Online gaming.
- Real-time audio.
- Real-time video.

### **C. What Is a Port Number?**

A port identifies an application endpoint on a device.

Example:

```
IP Address: 192.168.1.10
Port: 3000
```

Your Node.js application might run on:

```
localhost:3000
```

The IP address identifies the network interface, while the port identifies the transport-layer endpoint.

Some common ports:

| Port  | Common service |
| ----- | -------------- |
| 20/21 | FTP            |
| 22    | SSH            |
| 25    | SMTP           |
| 53    | DNS            |
| 80    | HTTP           |
| 443   | HTTPS          |
| 3306  | MySQL          |
| 5432  | PostgreSQL     |
| 6379  | Redis          |
| 27017 | MongoDB        |

**Data Unit (PDU):**

- TCP: Segment.
- UDP: Datagram.

## **8. Layer 5 – Session Layer**

OSI Layer 5

[Session Layer in OSI Model](https://images.openai.com/static-rsc-4/zHpuWXdDwi40d6bLmtz57_nyX0xVYKSPVbo5Uh27Uz1KEXcLLNnci-Ou67L-UjzAyY2ZNRk8i4nubjpQgE8Q0fw-MpJVmsyJMg5sJ6SXKoQP-zJkperuIsXt9SjwzMpm-mPVzTxVMD4Pjehw7MstGND7O6qBIZQwFP2SLwhq6bs?purpose=inline)

[tutorialspoint.com](https://www.tutorialspoint.com/data_communication_computer_network/session_layer.htm?utm_source=chatgpt.com)

The Session Layer is responsible for establishing, managing, and terminating communication sessions between applications.

Think of it as managing the logical conversation between two communicating systems.

**Main responsibilities:**

- Establishing sessions.
- Maintaining sessions.
- Terminating sessions.
- Synchronization.
- Managing communication dialogs.
- Providing recovery checkpoints in some systems.

### **Example**

Imagine a video conferencing application.

```
User A                 User B
  |                       |
  |---- Start Session --->|
  |                       |
  |<--- Session Ready ----|
  |                       |
  |<==== Communication ===>|
  |                       |
  |---- End Session ----->|
```

The session concept represents the ongoing communication between the participants.

**Examples and related technologies:**

- NetBIOS session services.
- RPC session management concepts.
- Session management in application protocols.

**Data Unit (PDU):** Data

Important: In modern Internet networking, session-management responsibilities are often implemented by application protocols and libraries rather than by a separate, clearly identifiable Layer 5 protocol.

## **9. Layer 6 – Presentation Layer**

OSI Layer 6

[The Blueprint of the Internet: From OSI Theory to TCP/IP Reality | by SOORAJ SUBRAMANIAN | Jan, 2026 | Medium](https://images.openai.com/static-rsc-4/L9uEo02Lnw4TOtuHjK1E2pMYF6MHaec03GfCVIcvqzETo2SP-YnAchqYd6Uuk2pQVANfEjopJZ2CpcyUEILKsKKGdYkWvaIUK5fjreS0xg3nXvAurJKJi8OfbMUkWx2Qgu9Q5VzDvgHfLSUY_KVfmnGgOedp02qD6bqBeLn66oI?purpose=inline)

[medium.com](https://medium.com/%40i__am_sooraj/the-blueprint-of-the-internet-from-osi-theory-to-tcp-ip-reality-124414dcf6ea?utm_source=chatgpt.com)

The Presentation Layer is responsible for ensuring that data is represented in a format that the receiving application can understand.

Think of it as the data translation and representation layer.

**Main responsibilities:**

- Data encoding.
- Data formatting.
- Data serialization.
- Data compression.
- Data encryption and decryption.

### **A. Data Encoding**

Imagine one application sends text:

```
Hello World
```

The data needs a defined character encoding.

For example:

- UTF-8.
- ASCII.
- UTF-16.

Both sides need to interpret the data consistently.

### **B. Data Serialization**

Serialization converts structured application data into a format that can be transmitted or stored.

For example:

JavaScript object:

```
const user = {
  name: "Neel",
  age: 25
};
```

Serialized JSON:

```
{
  "name": "Neel",
  "age": 25
}
```

### **C. Data Compression**

Compression reduces the amount of data that needs to be transmitted.

Examples:

- gzip.
- Brotli.

### **D. Encryption**

Encryption protects information from being read by unauthorized parties.

TLS provides encryption for modern Internet communication.

A conceptual OSI mapping often associates encryption with the Presentation Layer, but TLS does not fit perfectly into a single OSI layer in real-world implementations.

**Data Unit (PDU):** Data

## **10. Layer 7 – Application Layer**

Very important for backend developers

[Programming Blog & Tutorials - Unwired Learning](https://images.openai.com/static-rsc-4/TVRapB2WvrnFx7dqVCPLBe_5W-YO8dT1EASKK8Sfgh_fjhKWVMeLOVXCBp_1PZ_1mLPhA7qNhSEE7vYqV78A066VQiUrjbNUZTsIiBUV3IF-otiyFefJnvL0n5Zdqx4uKo7WJZzm8M9-tZjrnVKd0Cnmh3gvAvlFMzB7_DbcXP4?purpose=inline)

[unwiredlearning.com](https://unwiredlearning.com/blog/application-protocols-guide?utm_source=chatgpt.com)

The Application Layer is the layer closest to the applications used by humans.

It provides network communication services that applications use.

It does not mean the actual user interface itself is the protocol. It means the network services exposed to applications.

**Main responsibilities:**

- Providing application-level network services.
- Defining request and response formats.
- Supporting resource access.
- Supporting file transfers.
- Supporting email communication.
- Supporting domain-name resolution.

### **Examples of Application-Layer Protocols**

| Protocol  | Purpose                         |
| --------- | ------------------------------- |
| HTTP      | Web communication               |
| HTTPS     | Secure HTTP communication       |
| DNS       | Domain-name resolution          |
| FTP       | File transfer                   |
| SMTP      | Sending email                   |
| SSH       | Secure remote access            |
| DHCP      | Automatic network configuration |
| WebSocket | Bidirectional communication     |
| MQTT      | Lightweight messaging           |

### **Example: HTTP Request**

Imagine your frontend sends:

```
GET /users HTTP/1.1
Host: example.com
```

HTTP defines:

- The request method.
- The resource path.
- The headers.
- The response structure.
- The status codes.

Your backend receives and processes the request.

This is Application Layer communication.

**Data Unit (PDU):** Data

# **11. How All Seven Layers Work Together**

Now let's connect everything with a real-world example.

Imagine you send a message from your computer to another computer.

```
"Hello Neel"
```

On the sending computer, data moves from Layer 7 down to Layer 1.

On the receiving computer, it moves from Layer 1 up to Layer 7.

This process is called **encapsulation and decapsulation**.

## **A. Encapsulation (Sender Side)**

Each layer adds the information it needs to the data before passing it down.

[Network Protocols Run the Internet - by Alex Xu](https://images.openai.com/static-rsc-4/n_9dCOJMRBB2a2gD9uWWEuUYKYDMeys-k6cfH-ZlPDyhSPOeuKFt9Fr500H0-c59i6ply0q-GcaC7-or3dQ5V8XAwPA-u_N1K6zgrf9OVcqaB0bEOn5zmTF0WevmZ7QqRK6ByGoS_WU95fLuSktkS5saHnBY1nD9rckdgc1krD0?purpose=inline)

[blog.bytebytego.com](https://blog.bytebytego.com/p/network-protocols-run-the-internet?utm_source=chatgpt.com)

| Layer        | What happens                                |
| ------------ | ------------------------------------------- |
| Application  | Creates application data                    |
| Presentation | Formats, encodes or encrypts data           |
| Session      | Manages the communication session           |
| Transport    | Adds TCP or UDP information                 |
| Network      | Adds IP addressing information              |
| Data Link    | Adds frame and MAC addressing information   |
| Physical     | Converts data into transmitted bits/signals |

For example:

```
Application:
    Hello Neel

Transport:
    [TCP Header][Hello Neel]

Network:
    [IP Header][TCP Header][Hello Neel]

Data Link:
    [Ethernet Header][IP Header][TCP Header][Hello Neel][FCS]

Physical:
    010101010101010101...
```

Each layer adds its own information.

## **B. Decapsulation (Receiver Side)**

The receiving computer performs the reverse process.

```
Physical Layer
      |
      v
Data Link Layer
      |
      v
Network Layer
      |
      v
Transport Layer
      |
      v
Session Layer
      |
      v
Presentation Layer
      |
      v
Application Layer
      |
      v
"Hello Neel"
```

Each layer processes and removes the information relevant to it, then passes the remaining data upward.

Eventually, the receiving application gets the original message.

**Remember:**

- Sender: Encapsulation (Layer 7 → Layer 1).
- Receiver: Decapsulation (Layer 1 → Layer 7).

Intermediate routers do not normally process all seven layers. They primarily process the lower networking layers needed to forward packets.

# **12. PDU – Protocol Data Unit**

PDU is another important networking concept.

It describes how data is represented at each layer.

| OSI Layer        | PDU                            |
| ---------------- | ------------------------------ |
| Application (7)  | Data                           |
| Presentation (6) | Data                           |
| Session (5)      | Data                           |
| Transport (4)    | Segment (TCP) / Datagram (UDP) |
| Network (3)      | Packet                         |
| Data Link (2)    | Frame                          |
| Physical (1)     | Bits                           |

[Information Technology (IT) Certifications & Tech Training | CompTIA](https://images.openai.com/static-rsc-4/zkyASyptA9LCwtBc7BslvucPOHI26NLYKtYYxi18wEAbfR5XCvLYINTHWeNSlYtPsDfJDGG9d66P35zlS8FNj2kYp86VNdYQMWzm1rtnoTY6abXA9jj6IgGltWtAq38WqilGX30dTUo_NN-IxCdpyfA8LsFYXIWaau-SjbJQAwM?purpose=inline)

[production-comptiawebsite.azurewebsites.net](https://production-comptiawebsite.azurewebsites.net/blog/open-systems-interconnection-reference-model?utm_source=chatgpt.com)

A simple way to remember:

```
Data
  |
Segment / Datagram
  |
Packet
  |
Frame
  |
Bits
```

The data gets wrapped with additional information as it moves down the layers.

# **13. OSI Model vs TCP/IP Model**

This is another important concept, especially because your previous protocol lessons cover TCP, UDP, and HTTP.

The OSI model contains seven layers.

The TCP/IP model commonly uses four layers.

[Network Protocols Run the Internet - by Alex Xu](https://images.openai.com/static-rsc-4/2AK2O50AJLr9FtagDK63gtKtEkQXckuoCDbE6O2bH93R1zK3KlNyIYej6UQSdRvogcpfhd4x3jnoNj2qd_HklCK77gknYguWQKwNOea6isACRBSf5VqB7__zJfnDL5MDICOQRSElQeCb3PMxarckkyXkjIF0on6hcwWpFvGszlE?purpose=inline)

[blog.bytebytego.com](https://blog.bytebytego.com/p/network-protocols-run-the-internet?utm_source=chatgpt.com)

### **Comparison**

| OSI Model       | TCP/IP Model   |
| --------------- | -------------- |
| 7. Application  | Application    |
| 6. Presentation | Application    |
| 5. Session      | Application    |
| 4. Transport    | Transport      |
| 3. Network      | Internet       |
| 2. Data Link    | Network Access |
| 1. Physical     | Network Access |

The TCP/IP model combines some of the responsibilities that are separated in the OSI model.

### **TCP/IP Model Explained**

**1. Application Layer**

Combines OSI Layers 5, 6, and 7.

Examples:

- HTTP.
- HTTPS.
- DNS.
- SMTP.
- FTP.

**2. Transport Layer**

Corresponds to OSI Layer 4.

Examples:

- TCP.
- UDP.

**3. Internet Layer**

Corresponds to OSI Layer 3.

Examples:

- IPv4.
- IPv6.
- ICMP.

**4. Network Access Layer**

Combines OSI Layers 1 and 2.

Examples:

- Ethernet.
- Wi-Fi.

The OSI model is mainly a conceptual reference model, while TCP/IP describes the architecture underlying Internet communication.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.cloudflare.com\&sz=32)

Cloudflare+2



# **14. Which Protocol Belongs to Which OSI Layer?**

This connects directly with your previous protocol notes.

| Protocol / Technology       | Common OSI mapping                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| HTTP / HTTPS                | Layer 7                                                                                           |
| DNS                         | Layer 7                                                                                           |
| SMTP                        | Layer 7                                                                                           |
| FTP                         | Layer 7                                                                                           |
| WebSocket                   | Layer 7                                                                                           |
| gRPC                        | Primarily Layer 7                                                                                 |
| TLS                         | Between application and transport in practical stacks; often associated with Layer 6 conceptually |
| TCP                         | Layer 4                                                                                           |
| UDP                         | Layer 4                                                                                           |
| IPv4 / IPv6                 | Layer 3                                                                                           |
| ICMP                        | Layer 3                                                                                           |
| Ethernet                    | Layer 2                                                                                           |
| Wi-Fi MAC                   | Layer 2                                                                                           |
| ARP                         | Layer 2 / Layer 3 boundary                                                                        |
| Ethernet physical signaling | Layer 1                                                                                           |
| Fiber-optic transmission    | Layer 1                                                                                           |

**Important:** These are conceptual mappings. Some technologies span multiple layers or do not fit perfectly into the seven-layer model.

# **15. Networking Devices and Their OSI Layers**

| Device                              | Common OSI layer              |
| ----------------------------------- | ----------------------------- |
| Hub                                 | Layer 1                       |
| Repeater                            | Layer 1                       |
| Switch                              | Layer 2                       |
| Bridge                              | Layer 2                       |
| Router                              | Layer 3                       |
| Firewall                            | Layers 3–7, depending on type |
| Application gateway / reverse proxy | Layer 7                       |

For example:

- A switch forwards Ethernet frames using MAC addresses.
- A router forwards IP packets using destination IP addresses.
- An application reverse proxy can inspect HTTP requests and route them to different backend services.

This is particularly useful when learning Nginx, load balancers, reverse proxies, and API gateways.

# **16. How to Remember All Seven Layers**

**Mnemonic – Top to Bottom**

# **All People Seem To Need Data Processing**

**7**

**Application**

A

**6**

**Presentation**

P

**5**

**Session**

S

**4**

**Transport**

T

**3**

**Network**

N

**2**

**Data Link**

D

**1**

**Physical**

P

You can also remember the model from bottom to top using:

**Please Do Not Throw Sausage Pizza Away**

- Physical
- Data Link
- Network
- Transport
- Session
- Presentation
- Application

# **17. Important Interview Questions**

Test whether you understand the concepts instead of simply memorizing them.

**OSI knowledge test**

0/10 answered

**1. Which OSI layer is responsible for IP addressing and routing?**

Transport

Network

Data Link

Application

**2. Which OSI layer is responsible for MAC addressing?**

Physical

Network

Data Link

Transport

**3. At which layer do TCP and UDP operate?**

Layer 2

Layer 3

Layer 4

Layer 7

**4. What is the PDU of the Data Link Layer?**

Packet

Frame

Segment

Bits

**5. Which layer handles encryption and data representation conceptually?**

Presentation

Session

Network

Physical

**6. Which layer transmits raw bits?**

Network

Data Link

Transport

Physical

**7. Which layer is responsible for HTTP?**

Layer 4

Layer 3

Layer 7

Layer 2

**8. What is encapsulation?**

Removing headers

Adding layer-specific information as data moves down the stack

Encrypting every packet

Assigning IP addresses

**9. How many layers does the traditional TCP/IP model have?**

3

4

5

7

**10. Which device primarily operates at Layer 3?**

Hub

Switch

Router

Repeater

Check my answers

# **18. Recommended Images and References for Your Notes**

Here are the visual resources I recommend keeping alongside your study notes.

[Please Do Not Throw Sausage Pizza Away! — OSI Model Mnemonic | by Anupriya Verma | Jan, 2026 | Medium](https://images.openai.com/static-rsc-4/DNfKIPaUMlSysePmRNzbETJT-DSnDv6-2-peHlT5kIEInoVCO4ct6zV0FbTdwYLZkHmRMh9IKsO3bZc5VpxPfrMdG3c4AXqSy5tNqi6s83upaBVLIYZfBg_x1SsswPXClzrkYmcdxGPwD_ZPKQWk4v9LSYU7c05tNM8pQbuJX-Q?purpose=inline)

**Image 1 – Seven OSI Layers**

Insert after introduction

Best for memorizing layer numbers, responsibilities and examples.

[Open diagram](https://medium.com/%40anupriyaverma/please-do-not-throw-sausage-pizza-away-osi-model-mnemonic-daa8b92a7324?utm_source=chatgpt.com)

[Network Protocols Run the Internet - by Alex Xu](https://images.openai.com/static-rsc-4/2AK2O50AJLr9FtagDK63gtKtEkQXckuoCDbE6O2bH93R1zK3KlNyIYej6UQSdRvogcpfhd4x3jnoNj2qd_HklCK77gknYguWQKwNOea6isACRBSf5VqB7__zJfnDL5MDICOQRSElQeCb3PMxarckkyXkjIF0on6hcwWpFvGszlE?purpose=inline)

**Image 2 – OSI vs TCP/IP**

Insert in Section 13

Shows how the seven OSI layers map to the four TCP/IP layers.

[Open diagram](https://blog.bytebytego.com/p/network-protocols-run-the-internet?utm_source=chatgpt.com)

[OSI Model Cheat Sheet](https://images.openai.com/static-rsc-4/4YyNZYgkWFvukzAi0fxtSNIYvh1qqw3MNqfZabbc0bFtFYQg1VziSNPAqk34Qd69aDMWeSE8NgrSOM6jM96Wqqve9VnJqulYS0834-_5i1mgYsZB0ljrtmiClOiKIhrwACTl_ph6e4-sEcCnHeaAZvx9O3jIjYn-z0sZBt3jPEI?purpose=inline)

**Image 3 – OSI Cheat Sheet**

Insert in Section 3

Useful for revision because it includes functions, examples and data units.

[Open diagram](https://techoverloaded.hashnode.dev/osi-model-cheat-sheet?utm_source=chatgpt.com)

[The OSI Model Through a Cybersecurity Lens | by DIPNARAYAN NANDI | Apr, 2026 | Medium](https://images.openai.com/static-rsc-4/6vK-XEgiKEwAo1h6hgNpghxuFB8QcbcJgg2OnWszllHHb4FNV_ArjKpOx4n5xVMAY2GbrxcyZOzALK2hBhrzJ_skl79eQOVd6EvXFZPHmSIXGIHkh3GPCVFngfzZQmcp3SxNLnrVD2pdtxeyspk24dhF8htm5LuclWyOg_KLseI?purpose=inline)

**Image 4 – Encapsulation and Decapsulation**

Insert in Section 11

Explains how headers are added and removed during network communication.

**Further reading:**

- [Cloudflare – What is the OSI Model?](https://www.cloudflare.com/en-ca/learning/ddos/glossary/open-systems-interconnection-model-osi/?utm_source=chatgpt.com)
- [Oracle – OSI Reference Model](https://docs.oracle.com/cd/E19683-01/806-4075/6jd69oa77/index.html?utm_source=chatgpt.com)
- [Cisco – TCP/IP and OSI Model](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13769-5.pdf?utm_source=chatgpt.com)

# **19. Where to Integrate This Into Your Existing Networking Notes**

Your previous notes cover protocols and their properties. I recommend arranging your complete networking document in this order:

| Section | Topic                               |
| ------- | ----------------------------------- |
| 1       | Introduction to Computer Networking |
| 2       | What Is a Protocol?                 |
| 3       | OSI Model – Seven Layers            |
| 4       | TCP/IP Model                        |
| 5       | OSI vs TCP/IP Comparison            |
| 6       | Encapsulation and Decapsulation     |
| 7       | TCP and UDP                         |
| 8       | HTTP/1.1, HTTP/2 and HTTP/3         |
| 9       | WebSocket and WebRTC                |
| 10      | gRPC and Apache Thrift              |
| 11      | Protocol Properties                 |
| 12      | Addressing, DNS, IP and MAC         |
| 13      | Routing, Proxies and Gateways       |
| 14      | Flow Control and Congestion Control |
| 15      | Reliability and Error Management    |
| 16      | Custom Protocol Design              |

**The most important connection to remember:**

OSI tells you *where* networking responsibilities belong. Protocols tell you *how* communication is actually performed.

For backend development, focus especially on Layers 4 and 7, but understand Layers 1–3 too. That knowledge will make debugging API connections, database connectivity, TCP sockets, reverse proxies, and network issues much easier.