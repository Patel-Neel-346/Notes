### **Resilience and Fault Tolerance**

1. **Circuit Breakers**:
    
    - Protect systems from cascading failures (e.g., Hystrix, Resilience4j).
2. **Retry Mechanisms**:
    
    - Automatically retry failed requests with exponential backoff.
3. **Rate Shaping and Throttling**:
    
    - Manage traffic spikes to avoid overloading the system.
4. **Chaos Engineering**:
    
    - Intentionally inject failures to test system resilience (e.g., Netflix's Chaos Monkey).

---

### **Security**

1. **OAuth2 and OpenID Connect**:
    
    - Industry standards for user authentication and authorization.
2. **JWT (JSON Web Tokens)**:
    
    - Securely transmit user claims for stateless authentication.
3. **Rate Limiting for DoS Protection**:
    
    - Safeguard APIs from abuse.
4. **End-to-End Encryption**:
    
    - Secure sensitive data across the network.
5. **HSTS (HTTP Strict Transport Security)**:
    
    - Enforce HTTPS connections.

### **Advanced Patterns**

1. **Backpressure**:
    
    - Handle data flow mismatches between producers and consumers.
2. **Idempotency**:
    
    - Ensure repeated requests have the same effect (important for retries).
3. **Dead Letter Queues**:
    
    - Capture unprocessable messages for later review.
4. **WebSocket Scalability**:
    
    - Build real-time systems with scalable WebSocket solutions.

---

### **Scalable Authentication**

1. **Federated Identity Management**:
    
    - Enable Single Sign-On (SSO) across platforms.
2. **Multi-Factor Authentication (MFA)**:
    
    - Enhance security with additional authentication steps.

---

### **High Availability and Disaster Recovery**

1. **Blue-Green Deployments**:
    
    - Seamlessly switch traffic between production and staging environments.
2. **Canary Releases**:
    
    - Gradually roll out features to a subset of users.
3. **Database Replication and Failover**:
    
    - Automatic switching to backup systems during failure.

### Microservices Patterns
- Ambassador
- Anti Corruption Layer
- Asynchronous request reply
- backend for frontends
- bulkhead
- cache aside
- choreography
- circuit breaker
- claim check
- compensating transaction
- competing consumer
- computer resource consolidation
- CQRS
- deployment stamps
- edge workload configuration
- event collaboration
- event orchestration
- event sourcing
- event notification
- event carried state transfer
- external configuration store
- fallback
- federated identity
- gatekeeper
- gateway aggregation
- gateway offloading
- gateway routing
- geode
- health endpoint monitoring
- index table
- leader election
- materialize view
- messaging bridge
- polygot persistence
- pipes and filters
- priority queue
- publisher/subscriber
- quarantine
- queue based load leveling
- rate limiting 
- retry 
- saga pattern
- schedular agent supervisor
- sequential convoy
- sharding
- sidecar
- static content hosting
- stranlger fig
- throttling
- valet key
- API composition
- command side replica
- client side discovery
- server side discvoery
- stream circuit breaker
- service template pattern
- **Deployment**
	- single service per host
	- multiple service per host
	- side car pattern
	- ambassador pattern
	- service mesh
	- blue green deployment
	- canary deployment
	- rolling release
	
---
Great question. You’re basically asking for **the “system-design primitives” layer**—the big ideas engineers mix and match when building distributed systems (like consistent hashing and Raft).

Here’s a **clean map of the main system-design–level concepts**, grouped by _what problem they solve_.

---

# 1️⃣ Data distribution & placement

**“Where does data live?”**

- **Consistent hashing**
    
- **Range partitioning**
    
- **Directory-based sharding** (lookup service → shard)
    
- **Virtual nodes**
    
- **Rebalancing / resharding**
    
- **Data locality / colocation**
    
- **Hotspot mitigation**
    

Used in: Cassandra, DynamoDB, MongoDB, Citus, CockroachDB

---

# 2️⃣ Replication & consistency

**“How many copies exist, and how consistent are they?”**

- **Leader–follower replication**
    
- **Multi-leader replication**
    
- **Leaderless replication**
    
- **Quorum reads/writes**
    
- **Read-your-writes consistency**
    
- **Linearizability**
    
- **Eventual consistency**
    
- **Causal consistency**
    

Used in: PostgreSQL, MongoDB, Cassandra, DynamoDB

---

# 3️⃣ Consensus & coordination

**“How do nodes agree on shared truth?”**

- **Raft**
    
- **Paxos / Multi-Paxos**
    
- **Viewstamped Replication**
    
- **ZAB (ZooKeeper Atomic Broadcast)**
    
- **Leader election**
    
- **Distributed locks**
    
- **Membership management**
    

Used in: etcd, ZooKeeper, Consul, CockroachDB, Kubernetes

---

# 4️⃣ Failure handling & resilience

**“What happens when things break?”**

- **Failover**
    
- **Split-brain prevention**
    
- **Fencing (STONITH)**
    
- **Heartbeats**
    
- **Gossip protocols**
    
- **Failure detectors**
    
- **Self-healing**
    

Used in: Kubernetes, Cassandra, Patroni

---

# 5️⃣ Time, ordering & clocks

**“What happened first?”**

- **Logical clocks**
    
- **Lamport clocks**
    
- **Vector clocks**
    
- **Hybrid logical clocks (HLC)**
    
- **Global ordering**
    
- **Causality tracking**
    

Used in: Dynamo, CockroachDB, Spanner

---

# 6️⃣ Transactions & correctness

**“How do we update safely?”**

- **ACID**
    
- **Two-Phase Commit (2PC)**
    
- **Three-Phase Commit**
    
- **Saga pattern**
    
- **MVCC**
    
- **Optimistic vs pessimistic locking**
    
- **Snapshot isolation**
    

Used in: PostgreSQL, MySQL, Spanner, distributed SQL

---

# 7️⃣ Scalability patterns

**“How do we grow?”**

- **Horizontal scaling**
    
- **Vertical scaling**
    
- **Elastic scaling**
    
- **Auto-scaling**
    
- **Backpressure**
    
- **Load shedding**
    
- **Work stealing**
    

Used everywhere at scale

---

# 8️⃣ Communication patterns

**“How do services talk?”**

- **Synchronous vs asynchronous**
    
- **RPC**
    
- **gRPC**
    
- **Message queues**
    
- **Pub/Sub**
    
- **Event streaming**
    
- **Idempotency**
    

Used in: Kafka, RabbitMQ, cloud systems

---

# 9️⃣ Caching & performance

**“How do we go fast?”**

- **Write-through / write-back caches**
    
- **Cache-aside**
    
- **TTL**
    
- **Cache invalidation**
    
- **Bloom filters**
    
- **Read repair**
    
- **Speculative execution**
    

Used in: Redis, Memcached, databases

---

# 🔟 Observability & operations

**“How do we see and control it?”**

- **Metrics**
    
- **Tracing**
    
- **Logging**
    
- **Health checks**
    
- **Circuit breakers**
    
- **Feature flags**
    
- **Rolling upgrades**
    
- **Blue–green deployments**
    

Used in: production systems 😄

---

# 1️⃣1️⃣ Security & isolation

**“How do we protect it?”**

- **Authentication / authorization**
    
- **mTLS**
    
- **Secrets management**
    
- **Rate limiting**
    
- **Tenant isolation**
    
- **Data encryption (at rest / in transit)**
    

---

# Mental model (important)

Think of system design as **layers**:

```
[ Clients ]
[ Load balancing ]
[ Caching ]
[ Sharding / hashing ]
[ Replication ]
[ Consensus ]
[ Storage ]
[ Hardware ]
```

Each concept lives at **one or more layers**.

---

## TL;DR cheat phrase

> **System design = placement + replication + coordination + failure + time + scale**

If you want, I can:

- Turn this into an **interview cheat sheet**
    
- Map these concepts to **real systems**
    
- Explain **which ones you must know vs nice-to-know**
    
- Go deep on any single category (like clocks or consensus)
    

Just say the word.
#### Repositories for microservices
- https://github.com/mehdihadeli/go-food-delivery-microservices
- https://github.com/meysamhadeli/shop-golang-microservices
- https://github.com/raycad/go-microservices
- https://github.com/thangchung/go-coffeeshop
- https://itnext.io/istio-observability-with-go-grpc-and-protocol-buffers-based-microservices-d09e34c1255a. Already deployed but with explanation in the  article
#### transactions in microservices
https://dev.to/federico_bevione/series/30165