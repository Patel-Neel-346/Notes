# Non-Relational Databases (NoSQL)

## SQL vs NoSQL: Partitioning & Sharding

### Key Insight

> **Partitioning and sharding are concepts, not SQL-only features.**
>
> Both relational databases (MySQL, PostgreSQL) and NoSQL databases (MongoDB, Cassandra, DynamoDB, etc.) partition data. The difference is **how they do it**.

---

## SQL (MySQL) Approach

### Initially

```
Users Table
────────────
1  Pravin
2  Rahul
3  Aman
4  Neha
5  Ravi
6  Sneha
```

### After Partitioning

```
MySQL Server
    │
    Users Table
    │
   ┌┴─────────────┐
   │              │
   ▼              ▼
Partition 1   Partition 2
(Rows 1-3)    (Rows 4-6)
```

✅ **Everything is still inside ONE database server.**

Partitioning is just **table organization** within the same machine.

---

## NoSQL Approach

### Different Philosophy

In many NoSQL databases, **partitioning itself is distributed across machines**.

### Example: Cluster Setup

```
Cluster
│
├── Node 1 (Shard A)
├── Node 2 (Shard B)
├── Node 3 (Shard C)
└── Node 4 (Shard D)

Data is automatically spread among these nodes.
```

### Key Difference

> **In many NoSQL systems: `Partitioning = Sharding`**
> 
> The database **automatically distributes data across machines**.

---

## 📦 Example: MongoDB

### Data Structure

```json
users collection:
{
  "_id": 1,
  "name": "Pravin",
  "email": "pravin@...."
}
```

**Millions of documents are stored.**

### Automatic Sharding

Instead of one server, MongoDB **creates shards**:

```
         Client
            │
         mongos (Router)
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
 Shard 1  Shard 2  Shard 3
(Node A) (Node B) (Node C)
```

### Data Distribution

**Shard key: `userId`**

```
UserID Range    →  Shard
────────────────────────
1 - 1M          →  Shard 1
1M - 2M         →  Shard 2
2M - 3M         →  Shard 3
```

Each shard is **actually another MongoDB server**.

---

## MongoDB Sharding Components

### Architecture

```
Client
  │
  ▼
mongos (Router) ← Reads shard metadata
  │
  ├── Config Server (stores metadata)
  │
  ├─────┬─────┬─────┐
  ▼     ▼     ▼     ▼
 Shard 1  Shard 2  Shard 3
```

### Components Explained

#### **mongos (Router)**

Acts like a **load balancer/gateway**.

**Decides:**
- Which shard contains this document?
- Routes the query to the correct shard
- Merges results if needed

#### **Config Server**

Stores **metadata about shards**.

**Example metadata:**
```
UserID Range 0-1M     → Shard 1
UserID Range 1M-2M    → Shard 2
```

#### **Shards**

Actually **store the documents**.

Each shard is a **MongoDB instance** with replica sets for high availability.

---

## MongoDB Sharding Strategies

### 1️⃣ Range Sharding

**Very similar to MySQL Range Partitioning.**

```
UserID Range    →  Shard
────────────────────────
1 - 1000        →  Shard 1
1001 - 2000     →  Shard 2
2001 - 3000     →  Shard 3
```

#### ✅ Good For

- Range queries: `WHERE userId BETWEEN 1000 AND 2000`
- Time-based data
- Easy to understand

#### ❌ Problems

💥 **Hotspot Problem:**

Recent users all go to the newest shard:

```
Shard 1 (Old):    1000 docs
Shard 2 (Medium): 5000 docs
Shard 3 (New):    95000 docs ← HUGE!
```

One shard gets **overwhelmed** with writes.

### 2️⃣ Hash Sharding

MongoDB **computes a hash** of the shard key.

#### Example

```
UserID = 500
    ↓
hash(500)
    ↓
Result: 87654
    ↓
87654 % 3 = 2
    ↓
Shard 2
```

#### Distribution

```
Shard 1: 33% of data
Shard 2: 34% of data
Shard 3: 33% of data
```

✅ **Very balanced and uniform.**

---

## 💼 Cassandra

### Automatic Partitioning

Cassandra works **differently from MongoDB**.

**You don't manually create shards.**

Every row has a **Partition Key** that determines where it lives.

### Example

```sql
CREATE TABLE users(
  id UUID,
  name TEXT,
  email TEXT,
  PRIMARY KEY(id)
);
```

**Partition key: `id`**

### How Partitioning Works

1. Cassandra **hashes the `id`**
2. Uses **consistent hashing** to assign to a node
3. **Automatically stores** the row

### Example

```
Cluster (4 nodes)
│
├── Node 1
├── Node 2 ← Stores this row
├── Node 3
└── Node 4
```

**For User ID**: `550e8400-e29b-41d4-a716-446655440000`

```
hash(id) = 87654
    ↓
Node responsible = Node 2
    ↓
Row stored on Node 2
```

### No Manual Work

✅ **Application never needs to know** which node stores which data.

✅ **Cassandra handles everything automatically**.

---

## 🔓 DynamoDB

### AWS Managed Service

AWS DynamoDB **automatically partitions data** across multiple servers.

You just specify the **partition key**.

### Example

```
Partition Key: UserID
```

### Automatic Distribution

```
User 1  →  Partition A
User 2  →  Partition B
User 3  →  Partition C
User 4  →  Partition A
User 5  →  Partition B
```

### Zero Operational Overhead

✅ You **don't create partitions** yourself

✅ AWS **manages**:
- Storage allocation
- Replication
- High availability
- Auto-scaling

✅ **All operational details are hidden from you.**

---

## Why NoSQL Makes This Easier

### SQL Complexity

**With 1 billion users in MySQL:**

⚠️ You might have to:
- Create shards **manually**
- Route queries **yourself**
- Balance data **by hand**
- Monitor **everything**

### NoSQL Simplicity

**With 1 billion users in MongoDB/Cassandra:**

```
Insert Document
    ↓
Database decides
    ↓
Correct Partition
    ↓
Correct Machine
```

✅ **Much easier.** The database handles routing and distribution.

---

## Replication in NoSQL

### High Availability

Most NoSQL databases **don't keep only one copy**.

Example:

```
Node 1
  │
  └── Replica → Node 2
  │
  └── Replica → Node 3
```

### Fault Tolerance

If **Node 1 dies:**

✅ **Node 2 already has the data**

✅ **Node 3 already has the data**

**Result:**
- ✅ High Availability
- ✅ Fault Tolerance
- ✅ No data loss

### Instagram Example

**Storing posts:**

```json
Document:
{
  "postId": 100,
  "userId": 500,
  "caption": "Hello World",
  "likes": 200
}
```

**Partition key: `userId`**

```
hash(500) = 87654 → Node 3

Post stored on Node 3
(with replicas on Node 1 and Node 2)
```

**Another user:**

```
hash(200) = 12345 → Node 1

Post stored on Node 1
```

**The application doesn't care.** The database routes everything automatically.

---

## SQL vs NoSQL Partitioning Comparison

| Feature | SQL (MySQL) | NoSQL (MongoDB, Cassandra) |
|---------|-----------|-----------------------------|
| **Partitioning** | Usually within **one server** | Usually across **many servers** |
| **Sharding** | Often **manual** or app-managed | **Built into** the database |
| **Routing** | Application or **middleware** decides | Database **router** decides |
| **Scaling** | **More manual** work required | Designed for **horizontal scaling** |
| **Rebalancing** | Often **manual** rebalancing needed | Often **automatic** rebalancing |

---

# Graph Databases

## Why Were Graph Databases Created?

### The Problem: Facebook Friend Relationships

Imagine building **Facebook** with SQL:

**Users table:**

```
Users
───────────────
 ID  | Name
───────────────
 1   | Pravin
 2   | Rahul
 3   | Aman
 4   | Neha
```

**Friends table:**

```
Friends
───────────────
 User1 | User2
───────────────
  1   |  2
  1   |  3
  2   |  4
  3   |  4
```

### Simple Query: "Who are Pravin's friends?"

✅ Easy (1 JOIN):
```sql
SELECT * FROM Users u
JOIN Friends f ON u.id = f.user1
WHERE f.user1 = 1;
```

### Medium Query: "Who are my friends' friends?"

⚠️ Need **multiple JOINs**:
```sql
SELECT * FROM Users u1
JOIN Friends f1 ON u1.id = f1.user1
JOIN Users u2 ON f1.user2 = u2.id
JOIN Friends f2 ON u2.id = f2.user1
WHERE u1.id = 1;
```

### Complex Query: "Find all within 5 hops"

💥 **Nightmare in SQL:**
```
JOIN JOIN JOIN JOIN JOIN ...
```

The query becomes **exponentially expensive**.

### Real-World: LinkedIn Query

**Find:**
```
Pravin
  ↓ (Friend)
Rahul
  ↓ (Friend)
Aman
  ↓ (Works At)
Google
  ↓ (Located In)
Bangalore
  ↓ (Language)
Knows Java
```

❌ **This becomes a huge number of JOINs in SQL.**

---

## Graph Database Solution

### The Idea

**Instead of storing relationships in separate tables, the relationship becomes part of the data.**

### Example

```
Pravin
   │ FRIEND
   │
Rahul
   │ FRIEND
   │
Aman
```

The relationship is **stored directly**.

🚠 **This makes traversing connections extremely fast.**

---

## Graph Database Terminology

### Three Core Components

Everything in a graph database consists of:

1. **Node** (Entity)
2. **Relationship** (Edge connecting nodes)
3. **Property** (Data on nodes or relationships)

### 1️⃣ Node

> A **node** is an **entity**.

**Examples:**

```
(Pravin)        Person node
(Google)        Company node
(Bangalore)     City node
(Java)          Skill node
```

### 2️⃣ Relationship (Edge)

> Nodes are **connected by relationships**.

**Examples:**

```
(Pravin)  ─ FRIEND ─  (Rahul)

(Pravin)  ─ WORKS_AT ─  (Google)

(Google)  ─ LOCATED_IN ─  (Bangalore)

(Pravin)  ─ KNOWS_LANGUAGE ─  (Java)
```

**Common relationship types:**
- `FRIEND`
- `WORKS_AT`
- `LIVES_IN`
- `LIKES`
- `PURCHASED`
- `FOLLOWS`

### 3️⃣ Properties

> **Properties** store information on nodes or relationships.

**Node properties:**

```
(Pravin)
name = "Pravin"
age = 23
city = "Mumbai"
```

**Relationship properties:**

```
(Pravin) ─ FRIEND ─ (Rahul)
since = 2022
closeness = 9/10
```

---

## How Data is Stored

### Not Tables - Just Graphs

Unlike MySQL, **there are no tables** in graph databases.

Instead:

```
Nodes
  │
Relationships
  │
Properties
```

### Internal Storage

Internally, **relationships often contain references (pointers)** to connected nodes:

```
Node 1
  │
  └── Edge (with pointer to Node 2)
  │
  ▼
Node 2
```

🚀 **Following a relationship is much faster than repeatedly joining large tables.**

### Query Benefit

**Simple example:**

```
Where does my friend work?

Node (Me)
   ↓ FRIEND relationship
Node (Friend)
   ↓ WORKS_AT relationship
Node (Company)
```

✅ **No JOINs needed!** Just follow the relationships.

---

## 📚 Neo4j

### Definition

**Neo4j** is the **most popular graph database**.

- Open source option available
- Enterprise versions with clustering
- Built-in server and browser interface

### Data Model Example

```
(Person)
   │
   FRIEND
   │
(Person)
   │
   WORKS_AT
   │
(Company)
```

### Query Language: Cypher

Neo4j uses **Cypher** - a declarative query language for graphs.

**Example:**

```cypher
MATCH (p:Person)-[:FRIEND]->(f)
RETURN f;
```

**Meaning:**
- Find all `Person` nodes
- Follow `FRIEND` relationships
- Return the connected friends

---

## ☁️ Amazon Neptune

### AWS Managed Graph Database

**Neptune** is AWS's **fully managed graph database**.

### Supported Models

- **Property Graph model** (like Neo4j)
- **RDF** (Resource Description Framework)

### Common Uses

- 📚 Knowledge graphs (Google search)
- ⭐ Recommendation engines
- 🔍 Fraud detection

### Advantages

✅ Fully managed (no operational overhead)
✅ Auto-scaling
✅ High availability
✅ Secure

---

## 🔄 Dgraph

### Distributed Graph Database

**Dgraph** is a **distributed graph database** designed for **horizontal scaling from the beginning**.

**Unlike Neo4j** which started single-server and added clustering later.

### Good For

- 📈 **Massive datasets**
- ☁️ **Cloud-native applications**
- 🌐 **High availability** from day one

### Architecture

```
Cluster
  │
  ├── Alpha 1 (Graph store)
  ├── Alpha 2 (Graph store)
  └── Alpha 3 (Graph store)
```

**Designed for distribution** across nodes from the start.

---

## Graph Partitioning Challenge

### The Problem

Suppose we have a friendship graph:

```
Pravin
   │ FRIEND
   │
Rahul
   │ FRIEND
   │
Aman
   │ FRIEND
   │
Neha
```

Now imagine the nodes are **distributed across servers:**

```
Server A          Server B
   │                │
Pravin            Aman
Rahul             Neha
```

### Cross-Server Queries

Finding `Pravin → Rahul → Aman`:

```
Pravin (Server A)
   │ FRIEND (local - fast)
   │
Rahul (Server A)
   │ FRIEND (CROSSES TO SERVER B - slow!)
   │
Aman (Server B)
```

❌ **Requires network calls between servers.**

---

## How to Partition Graphs Well?

### Goal

> **Keep highly connected nodes together on the same server.**

### Bad Partitioning ❌

```
Server A          Server B
   │                │
Pravin            Rahul

Every FRIEND query crosses the network.
Performance suffers.
```

### Better Partitioning ✅

```
Server A              Server B
   │                     │
Pravin                 Google
Rahul                  Microsoft
Aman
```

**Most traversals stay inside one server.**

---

## Types of Graph Partitioning

### 1️⃣ Edge Cut

**Split nodes** across partitions.

Some edges **cross partition boundaries**.

```
Server A          Server B
   │                │
Pravin ────────────────── Aman
Rahul
```

**The friendship edge between Rahul and Aman crosses servers.**

**Objective:** Minimize these cross-partition edges.

### 2️⃣ Vertex Cut

**Instead of splitting nodes**, split the **edges**.

**Sometimes a high-degree node** (like a celebrity with millions of followers) is **replicated across partitions**.

```
Server A          Server B
   │                │
Celebrity         Celebrity (Replica)
(Original)        
│                    │
└────────────────────┘
 Followers list
```

**Advantages:** Better balance for certain workloads
**Disadvantages:** Increased complexity

---

## Sharding in Graph Databases

### 📚 Neo4j

**Originally:** Single machine only

**Now:** Enterprise deployments support clustering with replication

❌ **But:** Large-scale graph sharding is still **difficult** because traversals frequently cross relationships.

### 🔄 Dgraph

**Designed for sharding from day one.**

```
Cluster
  │
  ├── Alpha 1 (Shard A)
  ├── Alpha 2 (Shard B)
  └── Alpha 3 (Shard C)
```

✅ **Dgraph automatically distributes data.**

### ☁️ Neptune

**AWS automatically manages:**
- Storage
- Replication
- High availability

**Most operational details are hidden.**

---

## Why is Sharding Hard for Graphs?

### The Cascade Problem

Imagine traversing a chain:

```
Pravin (Server 1)
   │ FRIEND
   ▼
Rahul (Server 2)
   │ FRIEND
   ▼
Aman (Server 3)
   │ FRIEND
   ▼
Neha (Server 4)
   │ FRIEND
   ▼
Ravi (Server 5)
```

**Every hop requires a network call:**

```
Network Call → Network Call → Network Call → Network Call → Network Call
```

### Performance Impact

⏱️ **Latency multiplies:**

```
1 local query: 1ms
1 network call: 10ms (10x slower!)
5 hops across servers: 50ms
```

❌ **Performance suffers significantly.**

### Why Graph Databases Invest Heavily

That's why **graph databases invest heavily in partitioning strategies** that try to **keep related data together**.

Optimal partitioning **can be the difference between milliseconds and seconds**.

---

## 🌍 Where are Graph Databases Used?

### 👥 Social Networks

```
Person
  │ FRIEND
  │
Person
  │ FRIEND
  │
Person
  │ FRIEND
  │
Person
```

**Examples:** Facebook, Twitter, LinkedIn
**Query:** "Find friends, followers, mutual connections"

---

### 🛍️ Recommendation Systems

```
User
  │ PURCHASED
  │
Product
  │ PURCHASED_BY
  │
Other Users
```

**Insight:** "People who bought this also bought..."

**Examples:** Amazon, Netflix, Spotify
**Query:** "What should I recommend to this user?"

---

### 🔍 Fraud Detection

```
Account A
  │ TRANSFERRED_MONEY
  │
Account B
  │ TRANSFERRED_MONEY
  │
Account C
  │ TRANSFERRED_MONEY
  │
Account D
```

**Finding suspicious money-transfer patterns becomes much easier.**

**Examples:** Bank fraud detection, PayPal
**Query:** "Detect money laundering rings"

---

### 📚 Knowledge Graphs

**Google Search Example:**

```
Einstein
  │ BORN_IN
  │
Germany
  │ LOCATED_IN
  │
Europe
```

**Examples:** Google Knowledge Graph, Wikipedia
**Query:** "What do we know about Einstein?"

---

### 🌐 Network Routing

```
Router
  │
Router
  │
Router
  │
Destination
```

**Finding efficient paths is naturally a graph problem.**

**Examples:** Internet routing, GPS navigation, Network optimization

---

## Relational vs Graph Databases

| Feature | MySQL (Relational) | Neo4j (Graph) |
|---------|-------------------|---------------|
| **Storage** | Tables with rows/columns | Nodes & Relationships |
| **Relationships** | Foreign Keys + JOINs | Native Relationships |
| **Friend-of-Friend** | Multiple expensive JOINs | Simple graph traversal |
| **Performance** | Degrades with depth | Constant performance regardless of depth |
| **Best For** | Banking, ERP, Inventory | Social Networks, Recommendations, Fraud Detection |
| **Scalability** | Vertical (add more memory) | Horizontal (add more nodes) |
| **Query Complexity** | Increases with connections | Stays simple (traversals) |

---

## Summary

✅ **Use Relational Databases** for:
- Structured data with clear schemas
- Banking and financial systems
- Transactional consistency (ACID)
- Well-defined relationships

✅ **Use Graph Databases** for:
- Highly connected data
- Social networks and recommendations
- Fraud detection patterns
- Knowledge graphs and relationships
- When query complexity depends on depth of relationships