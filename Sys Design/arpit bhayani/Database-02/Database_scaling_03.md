# What is Database Scaling?

**Database scaling** means increasing the database's capacity so it can handle:

- More users
- More data
- More reads
- More writes
- More storage
- More concurrent connections

## The Problem

Imagine your application starts small:

```
      Users
        │
        │
   ┌────────┐
   │Database│
   └────────┘
```

It works perfectly for 100 users.

Now your app becomes popular:

```
100 Users → 10,000 Users → 1M Users → 100M Users
```

**Eventually, one database server can't keep up.**

### What Happens When a Database Becomes Overloaded?

Suppose your database can handle:

**2,000 queries/second**

But your application receives:

**10,000 queries/second**

❌ **The database becomes a bottleneck.**

### Problems You'll See

- 🐌 Slow queries
- 🔥 High CPU usage
- 💾 High memory usage
- 💿 Disk I/O saturation
- 🔌 Connection pool exhaustion
- ⏱️ Timeouts
- 💥 Crashes

**This is when you need to scale.**

---

## Two Ways to Scale

There are only two fundamental approaches:

```
Scaling
├── Vertical Scaling (Scale Up)
└── Horizontal Scaling (Scale Out)
```

---

## 1. Vertical Scaling (Scale Up)

This means making the same database server **more powerful**.

### Initial Setup

```
Database Server
  CPU : 2 Cores
  RAM : 4 GB
  SSD : 100 GB
```

### Upgrade It To

```
Database Server
  CPU : 16 Cores
  RAM : 64 GB
  SSD : 2 TB NVMe
```

The **application architecture doesn't change**. Only the hardware improves.

```
Users
  │
Database (Upgraded)
```

### Real-World Example

Suppose your MySQL server is:

```
4 CPU, 8 GB RAM
```

Your queries become slow.

You upgrade to:

```
32 CPU, 128 GB RAM
```

✅ Now it handles far more requests.

### Advantages ✅

- **Very easy** - No application changes, no data movement, no routing logic
- **No code changes** - Your Spring Boot app still connects to `mysql.company.com`
- **Strong consistency** - Only one database, no replication lag

### Disadvantages ❌

- **Hardware limits** - Eventually you hit the largest machine your cloud provider offers
- **Expensive** - Doubling CPU and RAM is costly; high-end servers cost many times more
- **Single Point of Failure** - If the database crashes, everything stops until restored

```
Users
  │
Database ❌
(Everything offline)
```

---

## 2. Horizontal Scaling (Scale Out)

Instead of buying a **bigger server**...

Buy **more servers**.

### Instead Of

```
1 Database Server
```

### Use

```
Database 1
Database 2
Database 3
Database 4
```

**This is much harder, but it scales much further.**

### Two Major Horizontal Scaling Techniques

```
Horizontal Scaling
├── Replication
└── Sharding
```

---

## Replication

Imagine one database handling everything:

```
Users
  │
Primary Database
(Reads + Writes)
```

Every request—reads and writes—goes to one server.

Suppose you get:

- **1,000 writes/sec**
- **50,000 reads/sec**

❌ **The reads are the problem.**

### Solution: Create Replicas

```
           Primary
        (Writes)

    /      │      \

Replica  Replica  Replica
(Read)   (Read)   (Read)
```

Now:

**Writes:**
```
Application → Primary Database
```

**Reads:**
```
Application → Replica 1
          → Replica 2
          → Replica 3
```

### Example

Instagram has:

- 10 million people opening feeds
- 100,000 posting photos

Most traffic is **reading**, not writing.

So:

- Posts are written to the **primary**
- Feed requests go to **replicas**

### Benefits ✅

- Reads become much faster (work is distributed)
- If one replica fails, the application continues using others

### The Problem: Replication Lag ❌

User uploads a photo.

The write goes to the primary.

Immediately afterward, they refresh their profile.

The request is sent to a replica.

❌ **The replica hasn't received the latest update yet.**

❌ **The user doesn't see their new photo.**

```
Primary
Photo exists
     ↓
Replica
Photo not yet copied
```

This delay is called **replication lag**.

---

## Sharding

**Replication** helps with read scaling.

But what if **the primary cannot handle the write load**?

### Example Problem

**1 Million Writes/sec**

❌ One server can't keep up.

### Solution: Split Data Across Databases

Instead of:

```
All Users
   ↓
One Database
```

Create **shards**:

```
Shard 1: Users 1-25M
Shard 2: Users 25-50M
Shard 3: Users 50-75M
Shard 4: Users 75-100M
```

Now each database stores **only part of the data**.

### Example

Suppose you have **100 Million Users**:

**Without sharding:**
```
One database stores: 100 Million users
```

**With sharding:**
```
DB1 → 25 Million users
DB2 → 25 Million users
DB3 → 25 Million users
DB4 → 25 Million users
```

Each database handles **only a quarter of the workload**.

### How Do We Decide Which Shard?

#### Range-Based Sharding

```
User ID
1-1000     → DB1
1001-2000  → DB2
```

❌ **Problem:** If newer users all fall into the latest range, that shard can become **overloaded**.

#### Hash-Based Sharding

A common approach:

```
Shard = user_id % 4
```

**Examples:**

```
User 5:  5 % 4 = 1  → Shard 1
User 26: 26 % 4 = 2 → Shard 2
```

✅ This usually spreads users more **evenly**.

### Problems with Sharding ❌

#### 1. Cross-Shard Queries

Imagine:

```sql
SELECT * FROM users;
```

The application must query:

```
Shard 1, Shard 2, Shard 3, Shard 4
```

Then **combine the results**.

#### 2. Joins Become Difficult

Suppose:

- Users are in **Shard 1**
- Orders are in **Shard 3**

❌ **Joining data across shards is much more complex** and often avoided.

#### 3. Resharding

Suppose you started with:

```
4 Shards
```

Now you need:

```
8 Shards
```

❌ You have to **move data**. Moving terabytes or petabytes of data safely is **difficult and time-consuming**.

---

## Which Scaling Method Solves Which Problem?

| Problem | Solution |
|---------|----------|
| **Database is too slow** | Optimize queries and indexes first |
| **CPU is full** | Vertical scaling |
| **Too many read requests** | Replication |
| **Too many write requests** | Sharding |
| **Need more storage** | Sharding |
| **High availability** | Replication with automatic failover |

---

## Typical Evolution of a Real Application

A successful application often evolves like this:

### Stage 1
```
Application
     │
Single MySQL Database
```

### ⬇️ Stage 2
```
Bigger MySQL Server
(Vertical Scaling)
```

### ⬇️ Stage 3
```
Primary + Read Replicas
(Read Scaling)
```

### ⬇️ Stage 4
```
Multiple Shards
(Write & Storage Scaling)
```

### ⬇️ Stage 5
```
Global Distributed Database
```

> **Note:** Most startups never reach the final stage, but large internet companies often do.

# Partitioning

Partitioning is one of the most important concepts in databases and system design. It is also a topic that is often confused with sharding. We'll first understand partitioning thoroughly, and later we'll learn how sharding builds on it.

---

## What is Partitioning?

### The Problem

Imagine you have a users table:

```
Users Table
─────────────────────────────
ID | Name   | City
─────────────────────────────
1  | Pravin | Mumbai
2  | Rahul  | Delhi
3  | Aman   | Pune
... (100,000,000 rows)
```

**As the table grows:**

❌ Queries become slower
❌ Indexes become huge
❌ Backups take longer
❌ Maintenance becomes difficult

### The Solution

Instead of storing all rows in one large table, we divide the table into **smaller pieces, called partitions**:

```
Users Table
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Partition 1  Partition 2
```

**To the application, it still looks like one table.**

### Definition

> **Partitioning** splits one table into multiple smaller parts, usually within the same database server.

---

## Why Partition?

### Example: Orders Table

Suppose you have order data from multiple years:

```
Orders
├─ 2019
├─ 2020
├─ 2021
├─ 2022
├─ 2023
├─ 2024
└─ 2025
```

**Most users search only for recent orders.**

✅ Instead of scanning millions of rows, MySQL can directly search the relevant partition.

### Benefits

This reduces:

- **Disk reads** - Only scan one partition
- **Query time** - Fewer rows to search
- **Index size** - Smaller indexes per partition

---

## Types of Partitioning

**Horizontal Partitioning** and **Vertical Partitioning** are the two main approaches.

### The Hierarchy

```
Partitioning
│
├── Horizontal Partitioning (Split Rows)
│      ├── Range
│      ├── Hash
│      ├── List
│      └── Key
│
└── Vertical Partitioning (Split Columns)
```

> **Range, Hash, List, and Key are all ways of doing Horizontal Partitioning.**

Let's understand them in detail.

---

## Horizontal Partitioning

### Definition

> **Horizontal partitioning** means: Split the table by rows.

### Example

Suppose you have a Users table:

```
UserID | Name   | Age | City
─────────────────────────────
1      | Pravin | 23  | Mumbai
2      | Rahul  | 25  | Delhi
3      | Aman   | 28  | Pune
4      | Neha   | 24  | Jaipur
5      | Ravi   | 27  | Chennai
6      | Sneha  | 30  | Kolkata
```

**Instead of storing all rows together, we divide them into smaller tables (partitions):**

```
Users Table
│
├── Partition 1
│   ├─ UserID 1: Pravin
│   ├─ UserID 2: Rahul
│   └─ UserID 3: Aman
│
└── Partition 2
    ├─ UserID 4: Neha
    ├─ UserID 5: Ravi
    └─ UserID 6: Sneha
```

**Notice:** Every partition still has **all the columns** (UserID, Name, Age, City).
**Only the rows are divided.**

### Examples

#### Range Partitioning

```
Orders by Year

    2019-2020  →  Partition 1
    2021-2022  →  Partition 2
    2023-2025  →  Partition 3
```

#### Hash Partitioning

```
hash(UserID) % 4

    → Partition 1
    → Partition 2
    → Partition 3
    → Partition 4

Rows are split based on hash value.
```

---

## Advantages of Horizontal Partitioning

### 1. 📊 Smaller Tables

**Before:**
```
100 Million Rows
```

**After:**
```
10 Million Rows
  +
10 Million Rows
  +
10 Million Rows
```

Each partition is **easier to manage**.

### 2. ⚡ Faster Queries

**Example:**
```sql
SELECT *
FROM Orders
WHERE OrderDate='2025-01-01';
```

✅ Only **one partition** needs to be searched.

This optimization is called **Partition Pruning**.

### 3. 🎯 Better Index Performance

Each partition has a **smaller index**.

✅ Smaller indexes fit better in memory and are **faster to search**.

### 4. 📦 Easier Archiving

- ✅ Drop one partition instead of deleting millions of rows
- ✅ Archive old partitions separately

---

## Disadvantages of Horizontal Partitioning

### 1. 🔑 Choosing a Good Partition Key is Hard

**Bad Example:**
```
- Partition by date
- But query mostly by customer
- Partitioning does NOT help ❌
```

### 2. 🔄 Uneven Data Distribution

```
2025: 90 Million Rows  → Partition 2025 (HUGE)
2022: 5 Million Rows   → Partition 2022 (SMALL)
```

One partition becomes much larger than the others.

### 3. 🌉 Cross-Partition Queries

If a query spans **multiple partitions**, the database must **search each relevant partition**.

This defeats the purpose of partitioning.

---

## Vertical Partitioning

### Definition

> **Vertical partitioning** is completely different. Instead of splitting rows, we split **columns**.

### Example

Suppose we have a User table:

```
UserID | Name  | Email         | Password      | ProfilePhoto | Bio
─────────────────────────────────────────────────────────────────────
1      | Jiya  | jiya@...      | hashed_pwd    | photo.jpg    | Bio 1
2      | Aman  | aman@...      | hashed_pwd    | photo.jpg    | Bio 2
```

**Problem:** Some columns are accessed frequently. Some are rarely accessed.

### The Split

**Instead of one table, we create multiple related tables:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Basic Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UserID | Name  | Email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Profile Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UserID | Bio | ProfilePhoto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UserID | Password
```

**Notice:** Every table contains the **same users**.
- We are **not dividing rows**.
- We are **dividing columns**.

### Use Case: Instagram Login

```sql
SELECT email, password
FROM Users;
```

❌ Why load unnecessary data?
- 100KB profile picture
- Bio text
- Followers count
- Posts

✅ **Read fewer columns → Less disk I/O → Less memory → Faster query**

---

## Advantages of Vertical Partitioning

### 1. ⚡ Faster Reads

Queries retrieve **only the needed columns**.

Example:
```sql
-- Fast: 2 columns
SELECT email, password
FROM Authentication;

-- Slow: Many columns
SELECT *
FROM Users;
```

### 2. 💾 Better Cache Efficiency

Smaller rows mean **more rows fit into memory**.

Cache hit rate **increases** significantly.

### 3. 🔐 Better Security

**Authentication data can be isolated.**

```
Password Table
├─ Only authentication services can access
├─ Separate security policies
└─ Better audit trails
```

### 4. 📦 Better Organization

- **Large BLOB fields** (images, videos) can be moved to separate tables
- **Text fields** can be isolated
- **Frequently accessed columns** stay together

---

## Disadvantages of Vertical Partitioning

### 1. 🔗 Joins Become Necessary

**Before:**
```sql
SELECT name, photo
FROM Users;
```

**After:**
```sql
SELECT u.name, p.photo
FROM Users u
JOIN Profile p ON u.UserID = p.UserID;
```

Extra joins can **slow down queries**.

### 2. 🔧 More Complex

Instead of **one table**, you now manage **several related tables**.

Requires careful schema design.

### 3. 🔄 Harder Updates

Updating information across multiple tables **may require transactions**.

```sql
UPDATE Users SET name='New' WHERE UserID=1;
UPDATE Profile SET bio='New Bio' WHERE UserID=1;
```

If first succeeds but second fails → **Data inconsistency**.

### Real-World Example: LinkedIn

A user profile contains:

```
Name, Email (frequent access)
Experience, Skills, Education (moderate access)
Certificates, Resume PDF, Profile Picture (less frequent)
```

### Optimal Split:

**Table 1: Authentication**
- Email, Password

**Table 2: Basic Profile**
- Name, Headline, Profile Picture

**Table 3: Detailed Profile**
- Experience, Skills, Education

**Table 4: Documents**
- Resume PDF, Certificates

Each table is **optimized for its access pattern**.

---

## Horizontal vs Vertical Partitioning

| Aspect | Horizontal | Vertical |
|--------|-----------|----------|
| **Splits** | Rows | Columns |
| **Columns per partition** | All columns | Subset of columns |
| **Rows per partition** | Subset of rows | All rows |
| **Use case** | Too many records | Too many/wide columns |
| **Benefits** | Scalability, query speed | Reduced I/O, cache efficiency |
| **Example** | Orders by year | Separate Auth, Profile, Media |

---

## Visual Comparison

### Horizontal Partitioning

Think of cutting an Excel sheet **horizontally**:

```
┌────────────────────┐
│ ID | Name | Age    │
├────────────────────┤ ← Cut here
│ 1  | Jiya | 23     │
│ 2  | Aman | 25     │
├────────────────────┤ ← Cut here
│ 3  | Neha | 24     │
│ 4  | Ravi | 27     │
└────────────────────┘
```

### Vertical Partitioning

Think of cutting an Excel sheet **vertically**:

```
┌──────────────┬──────────────┐
│ ID | Name   │ Age | Salary │ ← Cut here
├──────────────┼──────────────┤
│ 1  | Jiya   │ 23  | 50K    │
│ 2  | Aman   │ 25  | 60K    │
└──────────────┴──────────────┘
```

---

## Types of Horizontal Partitioning

There are **four major partitioning strategies**:

```
Horizontal Partitioning
├── Range
├── List
├── Hash
└── Key
```

Let's study each one.

---

## 1️⃣ Range Partitioning

### Definition

> Rows are divided based on a **range of values**.

### Example

**Orders partitioned by year:**

```
Orders Table
├─ Partition 1: 2019-2020
├─ Partition 2: 2021-2022
└─ Partition 3: 2023-2025
```

### SQL Example

```sql
PARTITION BY RANGE (YEAR(order_date))
(
  PARTITION p2022 VALUES LESS THAN (2023),
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

### Query Optimization

```sql
SELECT *
FROM orders
WHERE YEAR(order_date)=2023;
```

✅ MySQL only checks **Partition p2023** instead of every row.

This optimization is called **Partition Pruning**.

### ✅ Advantages

- ✅ Very fast for **date-based queries**
- ✅ Excellent for **historical data**
- ✅ Easy to **archive old partitions** (just DROP PARTITION)
- ✅ Natural fit for **time-series data**

### ❌ Disadvantages

- ❌ **Data may become uneven**

```
2025: 90 Million Rows  → LARGE
2022: 2 Million Rows   → SMALL
```

- ❌ Range boundaries must be carefully chosen
- ❌ Adding new ranges can be cumbersome

---

## 2️⃣ List Partitioning

### Definition

> Rows are divided according to **specific discrete values**.

### Example

**Users partitioned by country:**

```
Country
├─ India   → Partition 1
├─ USA     → Partition 2
└─ Japan   → Partition 3
```

### SQL Example

```sql
PARTITION BY LIST(country_id)
(
  PARTITION india VALUES IN (1),
  PARTITION usa VALUES IN (2),
  PARTITION japan VALUES IN (3)
);
```

### Good Use Cases

- **Fixed categories:** Country, Department, Region, Status
- **Enum-like values:** Department ID, Product Category
- **Hierarchical classification:** Region → Zone → Area

### ✅ Advantages

- ✅ Very useful when **categories are fixed**
- ✅ **Intuitive partitioning scheme**
- ✅ Good for **business logic grouping**
- ✅ Easy to understand and debug

### ❌ Disadvantages

- ❌ **Adding a new value may require repartitioning**

Example:
```
Need to add Pakistan?
PARTITION pakistan VALUES IN (4)
```

- ❌ Not suitable for **continuous or many-valued data**
- ❌ Requires careful maintenance

---

## 3️⃣ Hash Partitioning

### Definition

> The database calculates a **hash value** and distributes rows based on the hash.

### How It Works

```
UserID: 25
      ↓
hash(25) % 4 = 1  → Partition 1

UserID: 38
      ↓
hash(38) % 4 = 2  → Partition 2
```

### SQL Example

```sql
PARTITION BY HASH(user_id)
PARTITIONS 4;
```

### Distribution

Data becomes **approximately evenly distributed** across all partitions.

```
Partition 1: ~25%
Partition 2: ~25%
Partition 3: ~25%
Partition 4: ~25%
```

### ✅ Advantages

- ✅ **Uniform distribution** - No hot partitions
- ✅ **Prevents one partition from becoming huge**
- ✅ **Good for write-heavy workloads**
- ✅ Automatic balancing

### ❌ Disadvantages

- ❌ **No partition pruning for range queries**

Example:
```sql
WHERE city='Mumbai'
```

Every partition must be checked ❌

- ❌ If you want all users from Mumbai, **hash partitioning doesn't help**
- ❌ Cannot efficiently query by business logic

---

## 4️⃣ Key Partitioning

### Definition

> Very similar to **hash partitioning**, but the database uses its **internal hashing algorithm** instead of your own hash function.

### SQL Example

```sql
PARTITION BY KEY(user_id)
PARTITIONS 8;
```

### ✅ Advantages

- ✅ **Easier to use** - No custom hash function
- ✅ **Good distribution**
- ✅ **Database manages hashing internally**
- ✅ Less error-prone

### ❌ Disadvantages

- ❌ **Same as hash partitioning**
- ❌ **Range queries become inefficient**
- ❌ No partition pruning for business logic queries

---

## Visual Comparison of All Four Types

| Type | Concept | Distribution | Best For |
|------|---------|--------------|----------|
| **Range** | Date/value ranges | Uneven (may hotspot) | Time-series, dates |
| **List** | Discrete categories | Even (if balanced) | Fixed categories, enums |
| **Hash** | Hash function | Even (uniform) | Write-heavy, uniform load |
| **Key** | Database's hash | Even (uniform) | Simpler alternative to Hash |

### Visual

```
Range:               List:                Hash:              Key:
2019-2020 → P1       India → P1           hash()%4 → P1      hash()→ P1
2021-2022 → P2   USA → P2           hash()%4 → P2      hash()→ P2
2023-2025 → P3       Japan → P3           hash()%4 → P3      hash()→ P3
                                         hash()%4 → P4      hash()→ P4
```
---

## ✅ Advantages of Partitioning

### 1. 🚀 Faster Queries

**Before partitioning:**
```
Scan 100 million rows
↓
Index: 10GB
↓
Slow query
```

**After partitioning:**
```
Scan only ONE partition
↓
Index: 1GB per partition
↓
Fast query with partition pruning
```

### 2. 🛠️ Easier Maintenance

**Delete old data:**

Instead of:
```sql
DELETE FROM orders
WHERE year=2020;  -- Takes minutes/hours
```

Do:
```sql
DROP PARTITION p2020;  -- Instant!
```

Much faster, no lock contention.

### 3. 📇 Smaller Indexes

Instead of one enormous index:

```
Single Index: 50GB
```

Each partition has a smaller index:

```
Partition 1 Index: 5GB
Partition 2 Index: 5GB
Partition 3 Index: 5GB
...
```

✅ Index operations **much more efficient**.

### 4. 💾 Better Backup

- ✅ Back up only the **active partitions**
- ✅ Archive old partitions **separately**
- ✅ Restore **individual partitions** without full restore

### 5. 🎯 Better Performance

- ✅ Large tables become **manageable**
- ✅ Better **cache locality**
- ✅ Parallel processing across partitions

---

## ❌ Disadvantages of Partitioning

### 1. 🔧 More Complex

Partitioning adds **operational complexity**:

- Need to choose the right **partition key**
- Need to manage **partition lifecycles**
- Monitoring becomes more nuanced
- Debugging can be harder

### 2. 📊 Not Every Query Benefits

**Bad example:**

```sql
SELECT *
FROM users
WHERE name='Pravin';
```

If the partition key is `user_id`, MySQL **may still need to search every partition** ❌

### 3. ⚠️ Uneven Distribution

**Range partitioning problem:**

```
2025: 90 Million Rows  → HOT PARTITION
2024: 5 Million Rows   → COLD PARTITION
```

Uneven distribution causes **performance bottlenecks**.

### 4. 🔑 Partition Key Matters

**Wrong partition key:**

```
Mostly query by:  order_date
But partition by: customer_id
```

Result: **No partition pruning** ❌

---

## Real-World Examples

### 🛍️ E-commerce Platform

**Orders table partitioned by year:**

```
Orders
├─ Partition 2022 (archived)
├─ Partition 2023
├─ Partition 2024
└─ Partition 2025 (current)
```

**Why?**

- Most queries target **recent orders**
- Old orders rarely accessed
- Can **archive 2022** to cheaper storage
- Backups are **faster**

### 🏦 Banking System

**Transactions table partitioned by month:**

```
Transactions
├─ Partition 2025-01
├─ Partition 2025-02
├─ Partition 2025-03
└─ Partition 2025-04 (current)
```

**Why?**

- Most queries target **recent transactions**
- Compliance: **Archive by month**
- Faster reconciliation
- Better query performance

### 📱 Social Media

**Posts table partitioned by creation date:**

```
Posts
├─ Partition 2025-01-01
├─ Partition 2025-01-02
├─ Partition 2025-01-03
└─ Partition 2025-01-04 (today)
```

**Why?**

- Recent posts stay in **active partitions** (hot)
- Older posts **archived to slower storage**
- Feed queries are **super fast**
- User analytics queries can **skip old data**

---

## Partitioning vs Sharding

This is one of the **most common interview questions**.

### Key Differences

| Aspect | Partitioning | Sharding |
|--------|-------------|----------|
| **Servers** | One database server | Multiple database servers |
| **Data split** | Splits a table into partitions | Splits data across databases |
| **Application Awareness** | Transparent to application | Application/middleware decides shard |
| **Scalability** | Improves manageability | Improves storage & horizontal scalability |
| **Complexity** | Less complex to manage | More complex to operate |
| **Network** | Single server (no network calls) | Cross-network communication |
| **Consistency** | Single database ACID | May need distributed transactions |

### Visual Comparison

**Partitioning:**

```
One Database Server
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Partition 1  Partition 2
```

**Sharding:**

```
Server 1      Server 2      Server 3
  │             │             │
  ▼             ▼             ▼
Shard A       Shard B       Shard C
```

### Remember

> **Partitioning** helps organize and optimize data within a **single database**.
> 
> **Sharding** helps scale **beyond the limits of a single database server**.

