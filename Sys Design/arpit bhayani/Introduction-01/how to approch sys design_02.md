# How to Approach System Design

This is one of the most important questions in system design.

### Common Misconception ❌
> "I need to know Redis, Kafka, Load Balancers, Sharding..."

### The Reality ✅
Those come **later**.

The first thing you need is a **thinking process**. Every experienced engineer follows almost the same approach when designing a system.

---

## The 7-Step System Design Approach

Whenever someone asks you to design a system, follow this order:

```
1. Understand the Requirements
            ↓
2. Estimate the Scale
            ↓
3. Design High-Level Architecture
            ↓
4. Design the Database
            ↓
5. Identify Bottlenecks
            ↓
6. Scale the System
            ↓
7. Discuss Trade-offs
```

---

## Step 1: Understand the Requirements

### ⚠️ Don't start drawing boxes!

Imagine the interviewer says: **"Design Instagram."**

❌ **Don't start with:**
```
User → Server → Database
```

✅ **Instead, ask questions.**

### Functional Requirements
**What should the system do?**

For Instagram:
- Upload photos
- Like posts
- Comment
- Follow users
- View feed
- Search users

### Non-Functional Requirements
**How should it behave?**

- Support 500 million users
- 99.99% uptime
- Feed should load within 300 ms
- Images should never be lost
---

## Step 2: Estimate the Scale

Now estimate the numbers.

### Example: Instagram Scale
```
100 Million Users
        ↓
10 Million Daily Active Users
        ↓
5 Million Posts per Day
        ↓
50 Million Likes per Day
```

### Storage Estimation

Suppose:
- One Image = 2 MB
- 5 Million Images/day

```
5 Million Images × 2 MB = 10 TB/day
```

### Key Insight 💡
**We cannot store everything on one machine.**

This is why **estimation comes before architecture**.

---

## Step 3: Draw a High-Level Design

Draw the **simplest possible system**:

```
User → API Server → Database
```

That's **enough initially**.

### ⚠️ Don't Introduce Complex Components Yet
- ❌ No Redis
- ❌ No Kafka
- ❌ No CDNs

> **Key principle:** A good system design starts simple and evolves.

---

## Step 4: Design the Database

### What Data Needs to be Stored?

For Instagram:
- Users
- Posts
- Comments
- Likes
- Followers

### Then Ask
- SQL or NoSQL?
- What are the access patterns?
- What are the consistency requirements?

> **Important:** Choose based on **requirements**, not because one is "better."

---

## Step 5: Find Bottlenecks

Now imagine your simple design has **100 million users**:

```
Users → One Server → One Database
```

### Ask These Questions
- Will the server become **overloaded**?
- Can one database handle all **reads**?
- Will **uploads** slow down the system?
- Is **searching** too slow?

**Now you know what needs improvement.**

---

## Step 6: Improve the Design

This is where system design becomes **interesting**.

> **Golden rule:** Every improvement solves a **specific bottleneck**.

### Problem: Too Many Reads ❌
**Solution:** Add a cache
```
User → Redis → Database
```

### Problem: One Server Overloaded ❌
**Solution:** Add more servers
```
    Load Balancer
         ↓
    ┌────┼────┐
    ↓    ↓    ↓
 Server 1, Server 2, Server 3
```

### Problem: Database Overloaded ❌
**Solution:** Add read replicas
```
Primary Database → Replica → Replica
```

### Problem: Images Consume Too Much Storage ❌
**Solution:** Move to object storage
```
Server → Object Storage (e.g., S3)
```

### Problem: Uploads Are Slow ❌
**Solution:** Make them asynchronous
```
User → Queue → Worker → Database
```

### Key Insight 💡
**Every new component is introduced to solve a specific problem.**

---

## Step 7: Discuss Trade-offs

### 🏆 This is what separates senior engineers!

**Every decision has advantages and disadvantages.**

### Redis Cache
✅ **Advantages:**
- Faster reads
- Reduced database load

❌ **Disadvantages:**
- Extra infrastructure cost
- Cache invalidation is hard
- Data can become stale

### SQL
✅ **Advantages:**
- ACID transactions
- Strong consistency

❌ **Disadvantages:**
- Harder to scale horizontally
- Join operations can be slow at scale

### NoSQL
✅ **Advantages:**
- Easy to scale horizontally
- Flexible schema

❌ **Disadvantages:**
- Often weaker consistency
- Joins can be difficult

> **Truth:** There is no perfect solution—only **trade-offs**.

---

## A Complete Example: URL Shortener

Imagine the interviewer says: **"Design a URL Shortener."**

Your thought process:

```
1. REQUIREMENTS
   ├─ Shorten URLs
   └─ Redirect to original URL
        ↓
2. SCALE
   └─ 100 million URLs
        ↓
3. SIMPLE DESIGN
   Client → API → Database
        ↓
4. PROBLEM: Database gets too many reads
   SOLUTION: Add Redis cache
        ↓
5. PROBLEM: Single server overloaded
   SOLUTION: Load balancer + multiple API servers
        ↓
6. PROBLEM: Database writes increase
   SOLUTION: Replication or sharding (if needed)
        ↓
7. TRADE-OFFS
   Discuss consistency, cache, and cost
```

**That's a structured design process.**

---

## 🎯 The Golden Rule

### ❌ Don't Ask
> "What is Redis?"

### ✅ Instead Ask
- What **problem** does Redis solve?
- **When** should I use it?
- **When** should I avoid it?
- What are the **alternatives**?
- What **new problems** does it introduce?

> If you think this way, you're learning **system design**—not just memorizing tools.