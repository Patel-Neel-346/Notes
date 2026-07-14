# Why Do We Need Isolation Levels?

## The Scenario

Imagine two people are using the same bank account at the same time.

**Account Balance = ₹1000**

### Transaction A
```sql
BEGIN;
UPDATE accounts
SET balance = balance - 500
WHERE id = 1;
-- Not committed yet
```

At this point, the database temporarily has:

**Balance = ₹500**

But Transaction A **hasn't committed yet**.

### Transaction B Starts
```sql
SELECT balance
FROM accounts
WHERE id = 1;
```

❓ **What should it see?**
- ₹500 (uncommitted change)
- ₹1000 (original value)

**This is exactly what Isolation Levels decide.**

---

## What is Isolation?

**Isolation** is one of the **ACID** properties.

It means:

> Multiple transactions should execute **as if they were running one at a time**, without interfering with each other.

In reality, databases run many transactions concurrently for **performance**.

**Isolation Levels** define how much one transaction can see the changes made by another transaction.

---

## Why Not Always Isolate Everything Completely?

Imagine **Amazon**:

- Millions of users are buying products
- Updating carts
- Writing reviews
- Logging in

If every transaction **completely blocked** every other transaction, the system would become **very slow**.

So databases provide different isolation levels as a **trade-off**:

### Higher Isolation

```
More Correct
     ↓
  Slower
```

### Lower Isolation

```
Faster
     ↓
More Anomalies
```
---

## The Four Isolation Levels

```
Lowest Isolation
       ↓
READ UNCOMMITTED
       ↓
READ COMMITTED
       ↓
REPEATABLE READ
       ↓
SERIALIZABLE
       ↓
Highest Isolation
```

As you move down: **More safety, Fewer concurrency problems, More locking, Lower concurrency**
---

## 1. READ UNCOMMITTED

**This is the weakest level.**

Transactions can see **uncommitted changes** made by others.

### Example

**Transaction A**
```sql
BEGIN;
UPDATE accounts SET balance = 500;
-- Not committed
```

**Transaction B**
```sql
SELECT balance;  -- Sees 500
```

It sees `500` even though A hasn't committed.

### Problem

If A later rolls back:

```sql
ROLLBACK;  -- balance becomes 1000
```

Transaction B read data that **never actually existed**.

❌ **This is called a Dirty Read.**

---

## 2. READ COMMITTED

**This prevents dirty reads.**

Transaction B can only see **committed data**.

### Example

**Transaction A**
```sql
BEGIN;
UPDATE balance = 500;
```

**Transaction B**
```sql
SELECT balance;  -- Still sees 1000 (A not committed)
```

After A commits:

**Transaction B Now Sees**
```sql
SELECT balance;  -- Sees 500
```

### New Problem

```sql
-- Transaction B
BEGIN;
SELECT balance;  -- Gets 1000

-- Meanwhile Transaction A commits:
-- balance becomes 500

-- Transaction B reads again:
SELECT balance;  -- Now it gets 500
```

The same query returned **different values within one transaction**.

❌ **This is called a Non-Repeatable Read.**

---

## 3. REPEATABLE READ

**This is MySQL's default isolation level.**

Now every row you read stays **consistent** throughout your transaction.

### Example

**Transaction B**
```sql
BEGIN;
SELECT balance;  -- Gets 1000

-- Meanwhile Transaction A updates and commits
-- balance becomes 500

-- Transaction B reads again:
SELECT balance;  -- Still gets 1000 (consistent snapshot)
```

It keeps seeing the same snapshot of the data until it ends.

✅ **No non-repeatable reads.**

### Remaining Problem

```sql
-- Transaction B
SELECT * FROM users WHERE age > 18;  -- Gets 10 users

-- Meanwhile another transaction inserts:
INSERT INTO users(age) VALUES (25);

-- Transaction B runs the same query again:
SELECT * FROM users WHERE age > 18;  -- Now gets 11 users
```

The "extra" row is called a **Phantom Read**.

> **Note:** In MySQL's InnoDB engine, REPEATABLE READ uses MVCC and next-key locking, so many phantom reads are prevented in practice.

---

## 4. SERIALIZABLE

**This is the strongest isolation level.**

The database behaves as if transactions run **one after another**.

```
T1 Finish
    ↓
T2 Finish
    ↓
T3
```

✅ **No dirty reads**
✅ **No non-repeatable reads**
✅ **No phantom reads**

❌ **But it's also the slowest** because it greatly limits concurrent access.

---

## Common Concurrency Problems

| Problem | Meaning |
|---------|---------|
| **Dirty Read** | Reading data another transaction hasn't committed |
| **Non-Repeatable Read** | Reading the same row twice and getting different values |
| **Phantom Read** | Running the same query twice and seeing new or missing rows |

---

## Isolation Level Comparison

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-----------------|------------|---------------------|--------------|
| **Read Uncommitted** | ❌ Possible | ❌ Possible | ❌ Possible |
| **Read Committed** | ✅ Prevented | ❌ Possible | ❌ Possible |
| **Repeatable Read** | ✅ Prevented | ✅ Prevented | ⚠️ Depends on DB (MySQL InnoDB prevents many) |
| **Serializable** | ✅ Prevented | ✅ Prevented | ✅ Prevented |

---

## Which Isolation Level Should You Use?

- **Read Uncommitted:** Rarely used because it allows reading invalid data.
- **Read Committed:** A common default in PostgreSQL and Oracle. Good balance between consistency and performance.
- **Repeatable Read:** MySQL InnoDB's default. Strong consistency for repeated reads within a transaction.
- **Serializable:** Used only when absolute correctness is required and reduced concurrency is acceptable (certain financial or inventory-critical operations).

---

## System Design Perspective

Imagine you're designing an **e-commerce application**:

### Browsing Products
**READ COMMITTED** is often sufficient because slight changes between reads are acceptable.

### Viewing Your Bank Balance
**REPEATABLE READ** or stronger ensures consistency during the transaction.

### Transferring Money
**SERIALIZABLE** may be appropriate if the business rules require the strongest guarantees and the performance cost is acceptable.