What is a Load Balancer?

A Load Balancer (LB) is a component that sits between clients and servers and distributes incoming requests across multiple servers.

Instead of every client directly choosing a server, the client sends the request to the load balancer, and the load balancer decides which server should handle it.

Without a load balancer:

          User 1  --------> Server A
          User 2  --------> Server A
          User 3  --------> Server A
          User 4  --------> Server A
          User 5  --------> Server A

One server handles everything.

Problems:

CPU becomes overloaded.
Memory usage increases.
Response time becomes slow.
If the server crashes, the application is unavailable.

With a load balancer:

                  +----------------+
User Requests --->| Load Balancer  |
                  +----------------+
                     /     |      \
                    /      |       \
                   /       |        \
              Server A  Server B  Server C

The load balancer distributes requests across all available servers.

Why Do We Need a Load Balancer?

Imagine you built an online shopping website.

Initially:

100 users/day

One server is enough.

Later:

10 million users/day

One server cannot handle that traffic.

So you add more servers.

Server A
Server B
Server C
Server D

Now a new question arises:

How does a user know which server to connect to?

You don't want clients to randomly guess or hardcode server addresses. Instead, all requests go to the load balancer, which forwards each request to an appropriate server.

Real Life Analogy

Imagine a supermarket.

There are 10 checkout counters.

If customers choose counters randomly:

One counter might have 100 people.
Another might have only 2 people.

That's inefficient.

Instead, imagine a manager at the entrance.

Every customer arrives.

The manager looks at all counters and says:

"Go to counter 4."

Then the next customer:

"Go to counter 7."

This manager is exactly like a load balancer.

Request-Response Flow

Let's understand every step.

Suppose you open Instagram.

Step 1

Browser sends request.

GET /feed

Instead of going directly to a server, it goes to the load balancer.

Browser

     |

Load Balancer
Step 2

The load balancer checks:

Which servers are healthy?
Which servers are overloaded?
Which algorithm is configured?

Suppose it decides:

Server B
Step 3

The request is forwarded.

Browser

      |

Load Balancer

      |

Server B
Step 4

Server B processes the request.

Maybe it:

reads from the database,
talks to a cache,
generates the response.
Step 5

The response goes back.

Server B

     |

Load Balancer

     |

Browser

The browser usually has no idea which backend server handled the request.

Complete Flow
             Client

                |

                v

        +----------------+
        | Load Balancer  |
        +----------------+

          |     |      |

          v     v      v

      Server1 Server2 Server3

          |

          v

      Database/Cache
What Does the Load Balancer Actually Do?

Many beginners think:

"It simply forwards requests."

Actually, it does much more:

Distributes traffic.
Detects unhealthy servers.
Removes failed servers from rotation.
Routes requests using different algorithms.
Can terminate SSL/TLS.
Sometimes performs authentication.
Sometimes compresses responses.
Can enforce rate limits.

Think of it as the traffic controller for your backend.

# Load Balancing Algorithms

The load balancer needs a strategy to choose a server.

Let's look at the common ones.

1. Round Robin

The simplest algorithm.

Servers:

A
B
C

Requests:

Request 1 → A
Request 2 → B
Request 3 → C
Request 4 → A
Request 5 → B
Request 6 → C

Diagram:

Client

   |

Load Balancer

   |

A → B → C → A → B → C
Advantages
Very simple.
Fair when servers have similar capacity.
Disadvantages

Suppose:

A = 32 CPUs
B = 4 CPUs
C = 2 CPUs

Round Robin still sends the same number of requests to each server, even though they have very different capabilities.

2. Weighted Round Robin

Each server gets a weight.

Example:

A = Weight 5
B = Weight 3
C = Weight 2

Traffic:

AAAAA BBB CC

Out of every 10 requests:

A gets 5
B gets 3
C gets 2

This works well when servers have different hardware.

3. Least Connections

The load balancer checks how many active connections each server currently has.

Example:

Server A : 120 users

Server B : 15 users

Server C : 60 users

New request:

→ Server B

This is useful when requests have different durations, such as video streaming or file uploads.

4. Least Response Time

The load balancer measures how quickly servers are responding.

Example:

Server A : 20 ms

Server B : 15 ms

Server C : 90 ms

New request:

→ Server B

This helps route traffic to the fastest server at that moment.

5. IP Hash (or Consistent Routing)

The user's IP address is hashed.

The hash determines the server.

Example:

User A

↓

Hash

↓

Server 2

The same user is likely to be routed to the same server, which is useful when sessions are stored locally on application servers.

6. Random

The load balancer picks a server randomly.

Simple, but usually less efficient than other strategies.

Health Checks

A key feature of load balancers is checking whether servers are healthy.

Example:

Server A

Server B

Server C

Suppose Server B crashes.

Without health checks:

Request

↓

Server B

↓

Failure

Users get errors.

With health checks:

Load Balancer

↓

Server B

↓

No response

↓

Mark as unhealthy

↓

Stop sending traffic

Future requests only go to A and C until B recovers.

# Advantages of Load Balancers
1. High Availability

If one server crashes:

Server A ❌

Server B ✅

Server C ✅

Traffic automatically goes to B and C.

The application stays online.

2. Better Performance

Instead of one server handling everything:

1000 Requests

↓

1 Server

You can distribute the load:

1000 Requests

↓

250

250

250

250

Each server handles fewer requests, improving response times.

3. Scalability

Need more capacity?

Simply add another server.

Before:

A
B
C

After:

A
B
C
D

The load balancer starts sending traffic to the new server without changing the client.

4. Fault Tolerance

If a server fails, the load balancer routes traffic to healthy servers, reducing downtime.

5. Zero-Downtime Deployments

Suppose you need to update Server A.

The load balancer can temporarily stop sending traffic to it:

Traffic

↓

B

↓

C

You update A, verify it's healthy, and then add it back.

Users continue using the application during the deployment.

6. Flexibility

Different algorithms can be chosen depending on the workload:

CPU-intensive applications
Streaming services
Chat applications
File uploads
APIs

Each may benefit from a different balancing strategy.

Types of Load Balancers

There are two common categories based on the OSI model.

Layer 4 (Transport Layer)

Works with:

TCP
UDP

It forwards traffic based on IP addresses and ports without inspecting HTTP data.

Fast and efficient.

Layer 7 (Application Layer)

Works with:

HTTP
HTTPS

It understands URLs, headers, cookies, and request paths.

For example:

/api/*     → API Servers

/images/*  → Image Servers

/admin/*   → Admin Servers

This is called content-based routing.

Popular Load Balancers

Some widely used load balancers include:

NGINX
HAProxy
Envoy
AWS Application Load Balancer (ALB)
AWS Network Load Balancer (NLB)
Google Cloud Load Balancer
Azure Load Balancer
Interview Summary

If an interviewer asks, "What is a load balancer?", a strong answer is:

A load balancer is a component that sits between clients and backend servers, distributing incoming requests across multiple healthy servers using configurable algorithms. It improves scalability, availability, performance, and fault tolerance by preventing any single server from becoming overloaded and by automatically routing around failed instances.