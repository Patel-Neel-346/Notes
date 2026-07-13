# Must-Look Questions About Replication

## Question 1: Are Replicas Separate Databases?

**Yes.**

A replica is a **separate database server** running its own database software (e.g., MySQL, PostgreSQL).

### Example Architecture

```
Primary
MySQL Server
IP: 10.0.0.10

Users Table
Orders Table
Products Table
        │
        │
    ┌───┴───┐
    │       │
Replica 1   Replica 2
MySQL       MySQL
IP:         IP:
10.0.0.11   10.0.0.12

Users       Users
Orders      Orders
Products    Products
```

Each replica has:
- Its own **CPU**
- Its own **RAM**
- Its own **Disk**
- Its own **MySQL process**

They are **independent machines**, but the data is kept in sync with the primary.

✅ Think of them as **copies of the primary database**.

### Why Not Just Copy the Data Once?

Imagine **Instagram**.

Every second:
- Thousands of new posts
- Thousands of likes
- Thousands of comments

The replicas must **continuously receive** these changes.

**Replication is continuous, not a one-time copy.**

---

## Question 2: How Do Replicas Get Updated?

This is the interesting part.

### The Binary Log (Binlog)

Let's say the primary receives:

```sql
UPDATE users
SET name = 'Pravin'
WHERE id = 10;
```

The primary doesn't just update the table and forget about it.

**Instead, it records what changed** in the **binary log (binlog)**.

Think of the binlog as a **journal**:

```
Binlog

1. INSERT INTO users...
2. UPDATE users...
3. DELETE FROM orders...
4. UPDATE products...
```

**Every committed write is appended to this log.**

### What Does the Replica Do?

The replica **connects to the primary** and says:

> "Give me all the changes after the last one I received."

The primary replies by sending log entries:

```
Binlog
101, 102, 103, 104, 105
```

The replica **downloads those log entries** and **replays them locally**.

### Flow

```
Application
      │
      │
      ▼
  ┌────────────┐
  │ Primary    │
  │   MySQL    │
  └────────────┘
       │
       │ 1. Execute UPDATE
       │
       ▼
  ┌────────────┐
  │ Binary Log │
  │ UPDATE...  │
  │ INSERT...  │
  └────────────┘
       │
       │ 2. Replica requests new log entries
       │
       ▼
  ┌────────────┐
  │ Replica    │
  │   MySQL    │
  └────────────┘
```

**The replica is constantly fetching and applying new changes.**

---

## Is Replication Synchronous or Asynchronous?

**It can be either.**

### 1. Asynchronous Replication (Most Common)

#### Flow

```
Application
      │
      ▼
Primary Database
      │
      ▼
COMMIT
      │
      ▼
User gets SUCCESS immediately
      │
      ▼
Later...
      │
      ▼
Replica updates
```

#### Timeline

```
10:00:00.100  → Write reaches Primary
10:00:00.110  → Primary commits
10:00:00.111  → Application receives success ✅
10:00:00.140  → Replica receives update
10:00:00.150  → Replica applies update
```

Notice the **user got the response before the replica was updated**.

This delay is called **replication lag**.

#### Why Use Asynchronous Replication?

**It's fast.** The application doesn't wait for replicas.

Example:
```
Primary commit:     2 ms
Replica 1:         15 ms
Replica 2:         18 ms
Replica 3:         22 ms

With async:         2 ms (Done! No waiting)
```

#### The Downside ❌

```
You upload a photo.
      ▼
Primary stores it.
      ▼
Immediately you refresh.
      ▼
Request goes to Replica 2.
      ▼
Replica 2 hasn't received the update yet.
      ▼
Result: "Where's my photo?"
```

**This is eventual consistency** - data becomes consistent eventually, but not immediately.

### 2. Synchronous Replication

#### Flow

```
Application
      │
      ▼
Primary
      │
      ├─→ Replica 1
      ├─→ Replica 2
      ├─→ Replica 3
      │
      ▼
All replicas acknowledge
      │
      ▼
Primary commits
      │
      ▼
Application gets success
```

#### Timeline

```
Primary commit
      ▼
Replica 1 updated
      ▼
Replica 2 updated
      ▼
Replica 3 updated
      ▼
SUCCESS
```

Now **every replica has the latest data** before the client gets a response.

#### Advantage ✅

**No replication lag.** Any replica can immediately serve the latest data.

#### Disadvantage ❌

**It's slower.** If one replica is slow or unavailable, the write may be delayed (or fail, depending on the configuration).

> That's why **fully synchronous replication is less common** for internet-scale applications.

### Real-World Usage

#### MySQL

- By default: **Asynchronous replication**
- Also supports: **Semi-synchronous replication**
  - Primary waits until at least **one replica confirms** it has received the transaction
  - **Improves durability** while avoiding the cost of waiting for every replica

#### PostgreSQL

- Supports both **asynchronous** and **synchronous** replication
- You choose based on your requirements

### Why Don't Companies Always Use Synchronous Replication?

Imagine **WhatsApp**.

**Millions of messages arrive every second.**

If every message had to wait for replicas in different data centers:

```
India → Singapore → London → USA
```

**Every send operation would become much slower.**

✅ Instead, most large systems accept a tiny delay and use **asynchronous replication** for better performance and availability.

---

## Advanced Questions: Failover & Leader Election

### Key Question

Suppose you have:

```
Primary → Replica A → Replica B
```

**The primary crashes before Replica A receives the latest transaction.**

❓ **What happens to that transaction?**
❓ **Could it be lost?**
❓ **How do databases decide which replica should become the new primary?**

Those questions lead us into **failover, leader election, and consensus protocols** - the next layer of distributed database design.

---

## Crash Scenario Example

### Architecture

```
             Primary
                │
       ─────────┼─────────
       │                 │
   Replica A         Replica B
```

**Replication is asynchronous.**

### Timeline

#### Step 1: Purchase Transaction Reaches Primary

```sql
INSERT INTO orders(id, amount)
VALUES (101, 5000);
```

```
Application
      │
      ▼
Primary
      │
      ▼
Orders Table
Order 101 (written to disk)
```

**The application gets: 200 OK**

✅ Everything looks fine.

#### Step 2: Replication Starts

```
Primary
     │
Replication starts
     │
Replica A
Replica B
```

But **before the replicas receive it...**

💥 **The primary machine crashes.**

### What Happened?

**Replica A has: Order 100 (and earlier)**
**Replica B has: Order 100 (and earlier)**

❌ **Neither has Order 101** - it died with the primary.

### The Problem

❌ **Order 101 is lost.**

The client already received: **200 OK**

But **no remaining server has that transaction.**

This is one of the **major trade-offs of asynchronous replication**.

### Why?

Remember the timeline:

```
Primary commits
      ▼
Client receives: 200 OK
      ▼
Replication starts
      ▼
Primary crashes ❌
```

**The success response came BEFORE replication finished.**

---

## How Can We Reduce This Risk?

### Option 1: Synchronous Replication

Instead of:
```
Commit → Success → Replication
```

Do:
```
Commit → Replicate → Success
```

Now if the primary crashes after sending success, **at least one replica already has the data**.

### Option 2: Semi-Synchronous Replication (Very Common)

The primary **waits until at least one replica acknowledges receipt**.

```
Application
      │
      ▼
Primary
      │
      ▼
Replica A ✓ (acknowledged)
Replica B (doesn't matter)
      │
      ▼
Success
```

This provides **better durability** without waiting for every replica.

---

## Failover: The Primary is Dead

Now we have a new problem:

```
     Primary ❌

    /      \

Replica A  Replica B
```

**Someone has to become the new leader.**

This process is called **Failover**.

### What is Failover?

**Failover** means:

> Automatically replacing the failed primary with another server.

#### Before

```
Primary
   │
Replica A
Replica B
```

#### After the Crash

```
Replica A (New Primary)
   │
Replica B
```

The application **reconnects to the new primary**.

✅ **Users can continue using the system.**

---

## But How Do We Choose the New Primary?

### The Problem: Split-Brain

Imagine:

```
Replica A says: "I should become primary."
Replica B says: "No, I should become primary."
```

Now you have:

```
Primary A (accepting writes)
Primary B (accepting writes)
```

❌ **This is a split-brain situation.**

### Why is Split-Brain Dangerous?

**Replica A accepts:**
```
Balance = 500
```

**Replica B accepts:**
```
Balance = 800
```

Later the network heals.

❌ **Now there are two different truths.**

❓ **Which one is correct?**

**There is no easy answer.**

This can lead to **data corruption** or **lost updates**.

---

## How Do Databases Prevent Split-Brain?

They use a **leader election mechanism**.

✅ **Only one server is allowed to become the leader.**

**Distributed systems use consensus algorithms to guarantee this.**

### Well-Known Consensus Algorithms

- **Raft**
- **Paxos**

These algorithms ensure that, **even in the presence of failures**, the cluster agrees on **exactly one leader**.

---

## Example: 3-Node Cluster

### If A Crashes

```
Node A ❌
Node B
Node C
      ▼
B and C communicate
      ▼
If a majority agrees:
      ▼
B = Leader
```

Now everyone sends writes to **B**.

### Why Do We Need an Odd Number of Nodes?

#### Problem: 2 Nodes Only

```
A ─── B
Network breaks
A thinks: "B is dead."
B thinks: "A is dead."
Both try to become primary.
```

❌ **Split-brain!**

#### Solution: 3 Nodes

```
A ─── B ─── C
```

If **A crashes**:

```
B and C can still communicate.
Two out of three = majority.
They can safely elect a new leader.
```

✅ **That's why distributed systems use 3, 5, or 7 nodes—odd numbers make it easier to reach a clear majority.**

---

## What Happens in Large Companies?

### Example: Instagram

```
Clients
   │
   ▼
Load Balancer
   │
   ▼
Application Servers
   │
   ▼
Database Cluster
```

The database cluster typically consists of:

- **One primary** handling writes
- **Multiple replicas** handling reads
- **Monitoring software** that detects failures
- **Automatic failover** to promote a replica if primary dies
- **Consensus mechanisms** to avoid split-brain

**To the application**, it often looks like there is still just **one writable database**, even though the underlying cluster may be **changing leaders behind the scenes**.

---

## The Big Picture

You've now learned the sequence:

```
Single Database
       ↓
Vertical Scaling
       ↓
Replication
       ↓
Replication Lag
       ↓
Primary Failure
       ↓
Failover
       ↓
Leader Election
       ↓
Consensus (Raft/Paxos)
```

**This progression is exactly how database architecture evolves** as systems become more distributed.

---

## Challenge Question

Imagine you have:
- **1 Primary**
- **3 Replicas**

Each replica can handle: **10,000 read requests/second**

The primary can handle:
- **5,000 writes/second**
- **10,000 reads/second**

Your application receives:
- **35,000 reads/second**
- **5,000 writes/second**

❓ **How would you distribute the traffic?**

Think about:
- Which requests should go where?
- Should any reads go to the primary?