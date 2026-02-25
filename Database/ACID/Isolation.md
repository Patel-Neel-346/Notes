### What is Isolation?
- Isolation answers: **can my in-flight transaction see changes made by other in-flight (or recently committed) transactions?**
- With many concurrent TCP connections, multiple transactions can fight over the **same data**
- Isolation controls what a transaction **can and cannot see** from the outside world while it is running
- The answer is **not black or white** — it depends on what you're building and the isolation level you choose

---

### Read Phenomena — The Problems

These are **undesirable side effects** that can happen when transactions lack proper isolation. They are some of the **nastiest bugs to debug**.

##### 1. Dirty Read
- You read a value that another transaction **wrote but hasn't committed yet**
- That write could be **rolled back**, meaning you read data that never actually existed
- **Dirty** = the write isn't flushed/committed, it might change

##### 2. Non-Repeatable Read
- You read a value, then **later in the same transaction** you (or an aggregation function) reads it again and it **changed**
- This doesn't mean running the exact same `SELECT` twice — it can be two different queries that depend on the **same underlying row**
- Example: `SELECT price` then `SELECT SUM(price)` — both depend on the same row, but in between another transaction committed a change

##### 3. Phantom Read
- A **brand new row** is inserted by another transaction that satisfies your range query
- It's not a non-repeatable read because you **never read that row** in the first place — it didn't exist
- You can't lock a row that **doesn't exist yet** — that's why it's called a "phantom"

##### 4. Lost Update
- Two transactions read the **same value** and both update it based on that original value
- The second commit **overwrites** the first commit's update
- Example: both read quantity = 10, T1 sets it to 20, T2 sets it to 15 → T1's update is **lost**

---

### Example — Dirty Read

**Sales Table:**

| product_id | quantity | price |
|------------|----------|-------|
| 1          | 10       | 5     |
| 2          | 20       | 4     |

```mermaid
sequenceDiagram
    participant T1 as Transaction 1 (Report)
    participant DB as Database
    participant T2 as Transaction 2 (Sale)

    T1->>DB: BEGIN TRANSACTION
    T1->>DB: SELECT product_id, quantity * price FROM sales
    DB->>T1: Product 1 = $50, Product 2 = $80

    T2->>DB: BEGIN TRANSACTION
    T2->>DB: UPDATE sales SET quantity = 15 WHERE product_id = 1
    Note over DB: quantity is now 15 (NOT committed)

    T1->>DB: SELECT SUM(quantity * price) FROM sales
    DB->>T1: $155 (reads uncommitted value!)
    Note over T1: Expected $130, got $155

    T1->>DB: COMMIT
    T2->>DB: ROLLBACK
    Note over DB: quantity reverts to 10
    Note over T1: T1 used data that NEVER existed
```

- T1 read a value that T2 **never committed** — the report is **wrong**
- Worse: T2 rolled back, so the data T1 used **never actually existed**

---

### Example — Non-Repeatable Read

```mermaid
sequenceDiagram
    participant T1 as Transaction 1 (Report)
    participant DB as Database
    participant T2 as Transaction 2 (Sale)

    T1->>DB: BEGIN TRANSACTION
    T1->>DB: SELECT product_id, quantity * price FROM sales
    DB->>T1: Product 1 = $50, Product 2 = $80

    T2->>DB: BEGIN TRANSACTION
    T2->>DB: UPDATE sales SET quantity = 15 WHERE product_id = 1
    T2->>DB: COMMIT
    Note over DB: quantity = 15 (COMMITTED)

    T1->>DB: SELECT SUM(quantity * price) FROM sales
    DB->>T1: $155 (reads committed but changed value)
    Note over T1: First read said $50, sum says $155
    T1->>DB: COMMIT
```

- This time T2 **actually committed** — so it's not a dirty read
- But T1 read the value as 10, then an aggregation saw it as 15 → **inconsistent within the same transaction**
- The read was **not repeatable**

---

### Example — Phantom Read

```mermaid
sequenceDiagram
    participant T1 as Transaction 1 (Report)
    participant DB as Database
    participant T2 as Transaction 2 (Insert)

    T1->>DB: BEGIN TRANSACTION
    T1->>DB: SELECT product_id, quantity * price FROM sales
    DB->>T1: Product 1 = $50, Product 2 = $80

    T2->>DB: BEGIN TRANSACTION
    T2->>DB: INSERT INTO sales VALUES (3, 10, 1)
    T2->>DB: COMMIT
    Note over DB: New row: Product 3, qty 10, price $1

    T1->>DB: SELECT SUM(quantity * price) FROM sales
    DB->>T1: $140 (includes the phantom row!)
    Note over T1: Expected $130, got $140
    T1->>DB: COMMIT
```

- Product 3 **didn't exist** when T1 started — it's a **phantom**
- It's not a non-repeatable read because T1 never read product 3 in the first place
- You **can't lock a row that doesn't exist** — that's the core problem

---

### Example — Lost Update

```mermaid
sequenceDiagram
    participant T1 as Transaction 1
    participant DB as Database
    participant T2 as Transaction 2

    T1->>DB: BEGIN TRANSACTION
    T2->>DB: BEGIN TRANSACTION
    T1->>DB: READ quantity → 10
    T2->>DB: READ quantity → 10

    T1->>DB: UPDATE quantity = 10 + 10 = 20
    T2->>DB: UPDATE quantity = 10 + 5 = 15
    Note over DB: T2 overwrites T1's update!

    T2->>DB: COMMIT (quantity = 15)
    T1->>DB: SELECT SUM(...) → wrong result
    Note over T1: T1 thinks it added 10, but quantity is 15
    Note over T1: T1's update is LOST
    T1->>DB: COMMIT
```

- Both transactions **read the original value** (10) and computed based on it
- T2's commit **overwrote** T1's update → T1's 10 units are lost
- Fix: **row-level locks** — lock the row so no one else can change it until you're done

---

### Isolation Levels

Isolation levels were invented to **control which read phenomena** a transaction is exposed to.

| Isolation Level    | Dirty Read | Non-Repeatable Read | Phantom Read | Lost Update |
|--------------------|------------|---------------------|--------------|-------------|
| Read Uncommitted   | ✅ May occur | ✅ May occur         | ✅ May occur  | ✅ May occur |
| Read Committed     | ❌ Prevented | ✅ May occur         | ✅ May occur  | ✅ May occur |
| Repeatable Read    | ❌ Prevented | ❌ Prevented         | ✅ May occur  | ❌ Prevented |
| Snapshot           | ❌ Prevented | ❌ Prevented         | ❌ Prevented  | ❌ Prevented |
| Serializable       | ❌ Prevented | ❌ Prevented         | ❌ Prevented  | ❌ Prevented |

##### Read Uncommitted
- **No isolation at all** — you can see uncommitted changes from other transactions
- Dirty reads are possible → basically the worst level
- Theoretically fast because no overhead, but questionable in practice
- Almost no database uses this as default (SQL Server supports it)

##### Read Committed
- **Most popular** isolation level — default in many databases
- Each query only sees **committed** changes by other transactions
- If another transaction commits mid-way through yours, you **will see that change**
- Protects from dirty reads but **not** from non-repeatable or phantom reads

##### Repeatable Read
- Any row you **read** is guaranteed to stay the same for the duration of your transaction
- Fixes non-repeatable reads by locking (or versioning) the rows you've read
- Still vulnerable to **phantom reads** — new inserts can sneak in
- **Exception:** Postgres implements repeatable read as **snapshot isolation**, which also prevents phantom reads

##### Snapshot Isolation
- Takes a **versioned snapshot** of the database at the start of the transaction
- Every query sees the database **as it was** when the transaction began — no matter what commits happen later
- Eliminates **all read phenomena**
- Postgres `REPEATABLE READ` = snapshot isolation (they are identical in Postgres)

##### Serializable
- Transactions behave **as if they ran one after the other** — no concurrency
- Eliminates all read phenomena
- Usually implemented with **optimistic concurrency control** (not actual serial execution) — if conflicts are detected, the transaction is **failed** and must be retried

---

### Isolation Level Examples

All examples use the same **`accounts` table:**

| id | name  | balance |
|----|-------|---------|
| 1  | Alice | 1000    |
| 2  | Bob   | 500     |

---

##### Example — Read Uncommitted

At this level, a transaction **can see uncommitted writes** from other transactions (dirty reads).

```sql
-- Setup
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Transaction 1 (T1)                    -- Transaction 2 (T2)
BEGIN;                                    BEGIN;
                                          UPDATE accounts
                                          SET balance = 800
                                          WHERE id = 1;
                                          -- (NOT committed yet)

SELECT balance FROM accounts
WHERE id = 1;
-- Returns 800 ← DIRTY READ!
                                          ROLLBACK;
                                          -- balance reverts to 1000

COMMIT;
-- T1 used a value (800) that NEVER existed
```

```mermaid
sequenceDiagram
    participant T1 as T1 (Read Uncommitted)
    participant DB as Database
    participant T2 as T2

    T1->>DB: BEGIN
    T2->>DB: BEGIN
    T2->>DB: UPDATE balance = 800 WHERE id = 1
    Note over DB: balance = 800 (uncommitted)

    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 800 ← dirty read!

    T2->>DB: ROLLBACK
    Note over DB: balance reverts to 1000
    T1->>DB: COMMIT
    Note over T1: Used a value that NEVER existed
```

- **Problem:** T1 reads `800` which T2 never committed — the data is **garbage**
- **Use case:** Almost never. Only for rough approximations where accuracy doesn't matter

---

##### Example — Read Committed

Each query in a transaction only sees data that was **committed before that query started**. Dirty reads are gone, but non-repeatable reads can happen.

```sql
-- Setup
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Transaction 1 (T1)                    -- Transaction 2 (T2)
BEGIN;                                    BEGIN;

SELECT balance FROM accounts
WHERE id = 1;
-- Returns 1000 ✓

                                          UPDATE accounts
                                          SET balance = 800
                                          WHERE id = 1;
                                          COMMIT;
                                          -- balance is now 800 (committed)

SELECT balance FROM accounts
WHERE id = 1;
-- Returns 800 ← NON-REPEATABLE READ!
-- Same query, same transaction, different result

COMMIT;
```

```mermaid
sequenceDiagram
    participant T1 as T1 (Read Committed)
    participant DB as Database
    participant T2 as T2

    T1->>DB: BEGIN
    T2->>DB: BEGIN

    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 1000 ✓

    T2->>DB: UPDATE balance = 800 WHERE id = 1
    T2->>DB: COMMIT
    Note over DB: balance = 800 (committed)

    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 800 ← non-repeatable read!
    Note over T1: Same query, different result

    T1->>DB: COMMIT
```

- **Fixed:** Dirty reads — T1 would NOT see `800` until T2 commits
- **Problem:** The same `SELECT` returned `1000` then `800` within the **same transaction**
- **Default in:** PostgreSQL, Oracle, SQL Server

---

##### Example — Repeatable Read

Any row you read is **locked/versioned** so it stays the same for the entire transaction. But **new rows** (phantoms) can still appear.

```sql
-- Setup
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Transaction 1 (T1)                    -- Transaction 2 (T2)
BEGIN;                                    BEGIN;

SELECT balance FROM accounts
WHERE id = 1;
-- Returns 1000

                                          UPDATE accounts
                                          SET balance = 800
                                          WHERE id = 1;
                                          COMMIT;
                                          -- committed, but T1 won't see it

SELECT balance FROM accounts
WHERE id = 1;
-- Still returns 1000 ✓ (repeatable!)

                                          -- Transaction 3 (T3)
                                          BEGIN;
                                          INSERT INTO accounts VALUES
                                          (3, 'Charlie', 300);
                                          COMMIT;

SELECT SUM(balance) FROM accounts;
-- Returns 2800 ← PHANTOM READ!
-- (1000 + 500 + 300) includes the new row

COMMIT;
```

```mermaid
sequenceDiagram
    participant T1 as T1 (Repeatable Read)
    participant DB as Database
    participant T2 as T2
    participant T3 as T3

    T1->>DB: BEGIN
    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 1000

    T2->>DB: BEGIN
    T2->>DB: UPDATE balance = 800 WHERE id = 1
    T2->>DB: COMMIT

    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 1000 ✓ (repeatable!)

    T3->>DB: BEGIN
    T3->>DB: INSERT (3, Charlie, 300)
    T3->>DB: COMMIT

    T1->>DB: SELECT SUM(balance)
    DB->>T1: 2800 ← phantom read!
    Note over T1: New row sneaked in

    T1->>DB: COMMIT
```

- **Fixed:** Non-repeatable reads — re-reading `id = 1` always returns `1000`
- **Problem:** Charlie's row appeared mid-transaction — it's a **phantom**
- **Note:** In Postgres, `REPEATABLE READ` = snapshot isolation, so phantoms are also prevented

---

##### Example — Snapshot Isolation

A **frozen snapshot** of the entire database is taken at `BEGIN`. Every query sees the world **as it was** at that moment.

```sql
-- Setup (Postgres: REPEATABLE READ gives snapshot isolation)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ; -- Postgres
-- or: SET TRANSACTION ISOLATION LEVEL SNAPSHOT;  -- SQL Server

-- Transaction 1 (T1)                    -- Transaction 2 (T2)
BEGIN;                                    BEGIN;
-- snapshot taken at this moment

SELECT balance FROM accounts
WHERE id = 1;
-- Returns 1000

                                          UPDATE accounts
                                          SET balance = 800
                                          WHERE id = 1;
                                          COMMIT;

                                          -- Transaction 3 (T3)
                                          BEGIN;
                                          INSERT INTO accounts VALUES
                                          (3, 'Charlie', 300);
                                          COMMIT;

SELECT balance FROM accounts
WHERE id = 1;
-- Returns 1000 ✓ (snapshot!)

SELECT SUM(balance) FROM accounts;
-- Returns 1500 ✓ (1000 + 500)
-- Charlie's row is INVISIBLE — it didn't exist at snapshot time

COMMIT;
```

```mermaid
sequenceDiagram
    participant T1 as T1 (Snapshot)
    participant DB as Database
    participant T2 as T2
    participant T3 as T3

    T1->>DB: BEGIN
    Note over T1,DB: Snapshot taken here

    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 1000

    T2->>DB: UPDATE balance = 800 WHERE id = 1
    T2->>DB: COMMIT

    T3->>DB: INSERT (3, Charlie, 300)
    T3->>DB: COMMIT

    T1->>DB: SELECT balance WHERE id = 1
    DB->>T1: 1000 ✓ (from snapshot)

    T1->>DB: SELECT SUM(balance)
    DB->>T1: 1500 ✓ (only snapshot data)
    Note over T1: No dirty/non-repeatable/phantom reads

    T1->>DB: COMMIT
```

- **Fixed:** All read phenomena — T1 sees a **perfectly consistent** view of the database
- **Trade-off:** If T1 also tries to write to `id = 1`, it will get a **serialization error** (write-write conflict)

---

##### Example — Serializable

Transactions behave **as if they ran one at a time**. The database detects dependency cycles and aborts conflicting transactions.

```sql
-- Setup
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Transaction 1 (T1)                    -- Transaction 2 (T2)
BEGIN;                                    BEGIN;

SELECT SUM(balance) FROM accounts;
-- Returns 1500

                                          SELECT SUM(balance) FROM accounts;
                                          -- Returns 1500

INSERT INTO accounts VALUES
(3, 'Charlie', 1500);
-- total would be 3000

                                          INSERT INTO accounts VALUES
                                          (4, 'Dave', 1500);
                                          -- total would be 3000

COMMIT; -- ✓ succeeds
                                          COMMIT;
                                          -- ✗ ERROR: could not serialize access
                                          -- T2 must RETRY
```

```mermaid
sequenceDiagram
    participant T1 as T1 (Serializable)
    participant DB as Database
    participant T2 as T2

    T1->>DB: BEGIN
    T2->>DB: BEGIN

    T1->>DB: SELECT SUM(balance)
    DB->>T1: 1500

    T2->>DB: SELECT SUM(balance)
    DB->>T2: 1500

    T1->>DB: INSERT (3, Charlie, 1500)
    T2->>DB: INSERT (4, Dave, 1500)

    T1->>DB: COMMIT ✓
    T2->>DB: COMMIT
    DB->>T2: ✗ Serialization Error!
    Note over T2: Must RETRY the entire transaction
```

- **How it works:** The database detects that T1 and T2 both read the `SUM` and then inserted rows that would change each other's `SUM` → **dependency cycle**
- **Result:** One transaction succeeds, the other is **aborted** and must retry
- **Trade-off:** Safest level but the **slowest** — high contention means lots of retries

---

### Isolation Levels — When to Use What?

| Level | Use When… | Avoid When… |
|-------|-----------|-------------|
| **Read Uncommitted** | Quick dirty aggregations, monitoring dashboards | Anything that needs correctness |
| **Read Committed** | General OLTP, most web apps | Financial calculations, reports needing consistency |
| **Repeatable Read** | Reports that re-read same rows, balance checks | Write-heavy workloads (lock contention) |
| **Snapshot** | Long-running reports, analytics on consistent data | Write-write conflicts are frequent |
| **Serializable** | Financial systems, booking systems, critical correctness | High-throughput OLTP (too many retries) |

---

### How Databases Implement Isolation

##### Pessimistic Concurrency Control (Locks)
- Obtain **locks** when reading/writing data
- Other transactions **wait** until the lock is released
- Lock types: **row-level**, **page-level**, **table-level**
- Table locks are very expensive — lock escalation can accidentally promote row locks to table locks
- Lock management itself is expensive (tracking which rows are locked in memory)

##### Optimistic Concurrency Control (No Locks)
- No locks obtained — transactions run freely
- When transactions **conflict**, one is **failed** with a serialization error
- The application must **retry** the failed transaction
- NoSQL databases prefer this approach because locking is expensive

```mermaid
flowchart LR
    A[Concurrency Control] --> B{Approach}
    B -->|Pessimistic| C[Use Locks]
    B -->|Optimistic| D[No Locks]
    C --> E[Other transactions WAIT]
    D --> F[Conflicts → FAIL & retry]
```

---

### How Postgres vs MySQL Handle Versioning

| Feature | Postgres | MySQL / Oracle |
|---------|----------|----------------|
| **On UPDATE** | Creates a **new version** of the row | Modifies the row **in place** |
| **Old value** | Old version still exists (MVCC) | Stored in an **undo log** on disk |
| **Reading old version** | Reads the old row version directly | Must crack open the undo log (can be expensive for long transactions) |
| **Repeatable Read** | Implemented as **snapshot isolation** (no phantom reads) | True repeatable read (phantom reads still possible) |

---

### Summary
- Isolation = controls **what a transaction can see** from other concurrent transactions
- Four read phenomena: **dirty reads**, **non-repeatable reads**, **phantom reads**, **lost updates**
- Five isolation levels (from weakest to strongest): **Read Uncommitted → Read Committed → Repeatable Read → Snapshot → Serializable**
- Most databases default to **Read Committed**
- Postgres `REPEATABLE READ` = snapshot isolation (prevents phantom reads too)
- Pessimistic = **locks** (other transactions wait), Optimistic = **no locks** (conflicts cause retry)
- Fixing isolation issues is **expensive** — understand what your application needs before choosing a level
