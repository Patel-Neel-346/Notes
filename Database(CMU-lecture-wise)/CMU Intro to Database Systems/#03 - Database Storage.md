**Course:** 15-445/645 Database Systems (Fall 2024) · Carnegie Mellon University · Andy Pavlo

---

## 1. Storage Hierarchy

> [!info] Why Storage Matters
> Understanding how data is stored on disk is one of the **most important fundamentals** in databases. Everything — tables, indexes, queries — maps down to **pages, IOs, and bytes on disk**. This is not just theory — it's what makes a query **fast or slow**.
>
> We focus on a **disk-oriented DBMS architecture** that assumes the primary storage location of the database is on non-volatile disk(s).

At the top of the storage hierarchy you have devices closest to the CPU — fastest, smallest, most expensive. The further from the CPU, the larger, slower, and cheaper per GB.

### Volatile Storage (Memory)

- **Volatile** means data is lost if power is removed.
- Supports **fast random access** with **byte-addressable** locations — the program can jump to any byte address directly.
- We will always refer to this class as **"memory"**.

### Non-Volatile Storage (Disk)

- **Non-volatile** means the device retains data without continuous power.
- **Block/page addressable** — to read a value at a particular offset, the program must first load the 4 KB page into memory that holds that value.
- Traditionally better at **sequential access** (reading multiple contiguous chunks at once).
- We refer to this as **"disk"** — we do not make a major distinction between SSD and HDD.

### Latency Reference (Relative)

If reading from L1 cache took **1 second**:

| Storage | Equivalent Time |
|---------|----------------|
| L1 Cache | 1 second |
| SSD (NVMe) | ~4.4 hours |
| HDD | ~3.3 weeks |

> [!important] Key Takeaway
> Getting data from disk is **extraordinarily slow** relative to memory. The entire goal of a DBMS storage layer is to **hide this latency** — minimizing the number of disk reads (IOs) is the #1 performance objective.

> [!note] Persistent Memory (Side Note)
> A newer class of storage (e.g., Intel Optane) aims to be as fast as DRAM with disk persistence. Not in widespread production use and not covered in this course. NVMe SSDs are **not** the same — they're NAND flash with a faster interface.

---

## 2. Disk-Oriented DBMS Overview

> [!note] How a DBMS Moves Data
> The database lives entirely on disk. Data is organized into **pages**, with the first page being the **directory page**. To operate on data, the DBMS must bring it into memory via a **buffer pool**.

```
┌─────────────────────────────────────────────────┐
│                   DBMS Process                  │
│                                                 │
│   ┌──────────────────┐   ┌───────────────────┐  │
│   │  Execution Engine│   │   Buffer Pool     │  │
│   │  (runs queries)  │──▶│  (memory cache)   │  │
│   └──────────────────┘   └────────┬──────────┘  │
│                                   │             │
└───────────────────────────────────┼─────────────┘
                                    │ pages in / out
                              ┌─────▼──────┐
                              │    DISK     │
                              │  (database  │
                              │    files)   │
                              └────────────┘
```

- The **execution engine** asks the buffer pool for a specific page.
- The **buffer pool** brings that page from disk into memory and gives the engine a pointer.
- The buffer pool ensures the page stays in memory while the engine operates on it.

---

## 3. DBMS vs. OS — Why Not Use mmap?

> [!note] The Virtual Memory Temptation
> A high-level design goal of the DBMS is to support databases that **exceed available memory**. This sounds exactly like what the OS's virtual memory does — and you can use `mmap` to map a file into a process's address space, making the OS handle page movement automatically.

**Why mmap is a bad idea for a DBMS:**

- If `mmap` hits a page fault, the **process is blocked** — the whole engine stalls.
- The DBMS **cannot control** which pages get evicted or when.
- The DBMS knows far more about **access patterns and query intent** than the OS ever could.
- The OS is not your friend when writing a DBMS.

**What you can use instead (carefully):**

| syscall | Purpose |
|---------|---------|
| `madvise` | Hints to OS about which pages you'll read soon |
| `mlock` | Prevents OS from swapping a memory range to disk |
| `msync` | Forces OS to flush a memory range to disk |

> [!warning] Never Use mmap in a DBMS for Writes
> Even though `mmap` can work for reads with hints, you should never use it for writes. Correctness and performance both suffer. The DBMS must own its own buffer management.

---

## 4. File Storage

> [!note] How a DBMS Stores Data
> In its most basic form, a DBMS stores a database as **files on disk**. Some use a file hierarchy; others use a single file (e.g., SQLite).

- The OS does **not** know anything about the contents of these files — only the DBMS knows how to decode them.
- The DBMS's **storage manager** is responsible for managing database files.
- It represents files as a **collection of pages** and tracks what data has been read/written and how much free space remains.

---

## 5. Database Pages

> [!note] Pages — The Unit of Storage
> The DBMS organizes a database across one or more files in **fixed-size blocks** called **pages**. Pages can contain different kinds of data (tuples, indexes, etc). Most systems do not mix types within a single page.

- Each page has a **unique page ID**. For a single-file DB, the page ID can just be the file offset.
- Most DBMSs have an **indirection layer** that maps page ID → file path + offset.
- The upper layers ask for a page number; the storage manager translates that to a file + offset.
- **Fixed-size pages** are preferred to avoid the engineering complexity of variable-size pages (e.g., holes left by deletions).

### Three Levels of "Page"

| Concept | Typical Size |
|---------|-------------|
| Hardware page | 4 KB (atomic write guarantee) |
| OS page | 4 KB |
| Database page | 1–16 KB (varies by DBMS) |

### Page Sizes Across Databases

| Database | Default Page Size |
|----------|------------------|
| **PostgreSQL** | 8 KB |
| **MySQL (InnoDB)** | 16 KB |
| **MongoDB (WiredTiger)** | 32 KB |
| **SQL Server** | 8 KB |
| **Oracle** | 8 KB |

> [!important] Hardware Page Atomicity
> The storage device guarantees an **atomic write** of the hardware page size (4 KB). If your database page is larger (e.g., 8 KB), the DBMS must take extra measures to ensure safe writes — a crash mid-write could leave the page corrupted.

### How Rows Map to Pages

```
┌─────────────────────────────────────────────┐
│  Page 0 (8 KB)                              │
│  ┌──────────────────────────────────────┐   │
│  │ Row 1: (10, Alice, 1990-01-15, 70k)  │   │
│  │ Row 2: (20, Adam,  1985-03-22, 80k)  │   │
│  │ Row 3: (30, Ali,   1992-07-10, 65k)  │   │
│  └──────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Page 1 (8 KB)                              │
│  │ Row 4, Row 5, Row 6                  │   │
├─────────────────────────────────────────────┤
│  ...                                        │
│  Page 333 (8 KB)                            │
│  │ Row 998, Row 999, Row 1000           │   │
└─────────────────────────────────────────────┘
```

With 3 rows per page and 1000 rows → **≈ 333 pages** on disk.

### Small vs Large Pages — Trade-offs

| | Small Pages (4–8 KB) | Large Pages (16–32 KB) |
|--|----------------------|------------------------|
| Read/write speed | Faster per IO | Slower per IO |
| Metadata overhead | High (header is larger % of page) | Low |
| Page splits | More frequent | Less frequent |
| Cold read cost | Lower | Higher (pulls 32 KB for 1 row) |
| Range scan efficiency | More IOs needed | Fewer IOs (more rows per page) |

---

## 6. Database Heap

> [!note] What Is a Heap File?
> A **heap file** is an unordered collection of pages where tuples are stored in random order. It is the simplest form of file organization — data is just piled in, no particular ordering.
>
> The DBMS can locate a specific page on disk using one of two approaches:

### 1. Linked List

- The **header page** holds pointers to a list of free pages and a list of data pages.
- Finding a specific page requires a **sequential scan** of the data page list — slow.

### 2. Page Directory (Preferred)

- The DBMS maintains special **page directory** pages to track:
  - Locations of all data pages
  - Amount of free space on each page
  - List of free/empty pages
  - Page type
- Much faster lookup than a linked list.

> [!tip] Why the Heap Matters for Performance
> The heap is the **entire collection of pages** that make up a table — every row, every column, all the data. Scanning it without an index is extremely expensive. This is why indexes exist: to avoid full heap scans.

---

## 7. Page Layout

Every page includes a **header** that records metadata about the page's contents:

- Page size
- Checksum
- DBMS version
- Transaction visibility
- Self-containment (some systems like Oracle require pages to be self-contained)

### Postgres Page Layout — Deep Dive

Here's how a single 8 KB Postgres page is structured:

```
┌──────────────────────────────────────────────────────┐
│  Page Header (24 bytes)                              │
│  - metadata: free space, page pointers, flags        │
├──────────────────────────────────────────────────────┤
│  ItemId Array (4 bytes each)                         │
│  - pointer 1 → offset:length of tuple 1             │
│  - pointer 2 → offset:length of tuple 2             │
│  - pointer 3 → offset:length of tuple 3             │
│  - ... grows downward ↓                             │
├──────────────────────────────────────────────────────┤
│                                                      │
│              Free Space                              │
│                                                      │
├──────────────────────────────────────────────────────┤
│  ← grows upward ↑                                   │
│  Tuple 3 (variable length)                           │
│  Tuple 2 (variable length)                           │
│  Tuple 1 (variable length)                           │
├──────────────────────────────────────────────────────┤
│  Special Space (B+Tree leaf pages only)              │
│  - pointers to previous/next leaf pages              │
└──────────────────────────────────────────────────────┘
```

**Page Header (24 bytes):** Fixed-size metadata — free space offset, page flags, start/end of items.

**ItemId Array (4 bytes per item):** An array of pointers — each 4-byte entry records: *"the tuple is at offset X and is Y bytes long."* Grows downward from the top. This indirection enables the HOT optimization.

> [!warning] ItemId Overhead
> Each ItemId is **4 bytes**. If a page holds 1000 items, that's **4 KB just for pointers** — half the 8 KB page! This is a real trade-off between indirection flexibility and space efficiency.

**Special Space:** Only used in **index pages** (not heap/data pages). Stores pointers to previous/next B+Tree leaf pages for traversal.

### Two Main Page Layout Approaches

#### 1. Slotted Pages (Most Common Today)

- Header keeps track of: number of used slots, offset of last used slot's start, and a **slot array** tracking each tuple's location.
- To add a tuple: slot array grows **beginning → end**; tuple data grows **end → beginning**.
- Page is full when the two regions meet.

```
[Header][Slot 1][Slot 2][Slot 3]→    ←[Tuple 3][Tuple 2][Tuple 1]
```

#### 2. Log-Structured

- Instead of updating pages in place, append **log records** of changes.
- Covered in the next lecture.

---

## 8. Tuple Layout

> [!note] What Is a Tuple?
> A tuple is essentially a **sequence of bytes** (not necessarily contiguous). It is the DBMS's job to interpret those bytes into attribute types and values.

### Row ID (Tuple ID)

Most databases internally assign a **system-maintained identifier** to each row — the **Row ID**.

- This is **not** your primary key — it's an internal pointer managed by the database.
- It uniquely identifies a row and tells the database **which page** the row lives on.

| Database | Row ID Behavior |
|----------|----------------|
| **PostgreSQL** | Creates its own **tuple ID (ctid)** — separate from any user-defined column |
| **MySQL (InnoDB)** | The **primary key becomes** the pseudo Row ID — if you don't define one, InnoDB creates a hidden 6-byte one |

```sql
-- Postgres: you can actually see the tuple ID
SELECT ctid, * FROM employees LIMIT 5;

-- ctid format: (page_number, row_offset)
-- Example: (0,1) means page 0, row 1
```

### Tuple Header

Contains metadata about the tuple:

- **Visibility information** for the concurrency control protocol (which transaction created/modified this tuple)
- **Bit map for NULL values**
- Note: the DBMS does **not** store schema metadata here — that lives in the system catalog

### Tuple Data

- Attributes are typically stored **in the order you define them** in `CREATE TABLE`.
- Most DBMSs do not allow a tuple to exceed the size of a page.

### Terminology

| Term | Meaning |
|------|---------|
| **Row** | What the user sees — the logical record |
| **Tuple** | A physical instance of the row stored in a page |
| **Item** | Same as tuple — the actual bytes in the page |

The **same logical row** can have **multiple physical tuples** — one active, several for older transactions (MVCC), and dead tuples waiting for `VACUUM` in Postgres.

### Denormalized Tuple Data (Pre-Joins)

If two tables are related, the DBMS can **pre-join** them so related data ends up on the same page:

- **Reads faster** — only one page load instead of two.
- **Updates more expensive** — more space needed per tuple.

---

## 9. Buffer Pool

> [!note] The Buffer Pool — Pages in Memory
> Databases allocate a pool of memory called the **shared buffer pool**. Pages read from disk are placed into this pool — subsequent reads of the same page are served from **memory** instead of disk.

### How Reads Work

```
Application → Query Engine → Buffer Pool → (cache hit) → Return page
                                         → (cache miss) → Read from Disk → Cache → Return page
```

- The **smaller your rows**, the **more rows fit per page**, the more useful data a single IO gives you.
- Lean, well-modeled rows = fewer IOs = faster queries.

### How Writes Work

```
UPDATE → Pull page into buffer pool
       → Modify row in memory (page is now "dirty")
       → Write change to WAL (Write-Ahead Log) on disk
       → Dirty page accumulates more writes
       → Eventually flushed to disk
```

- The database does **not** write directly to the data file on every update.
- The dirty page can receive **many writes** before being flushed — minimizing IOs.
- Deletes and inserts follow the same pattern.

> [!important] WAL — Write-Ahead Log
> Before any dirty page is flushed to disk, its changes are recorded in the **WAL (journal)**. This guarantees that even if the system crashes before the flush, the changes can be **replayed** from the WAL. This is the foundation of database durability (the D in ACID).

---

## 10. IO — The Currency of Databases

> [!note] What Is an IO?
> An **IO** is a read request to disk to fetch one or more pages. **IO is the most expensive operation in a database** — minimizing IO is the #1 goal of storage design.

### Key Rules of IO

| Rule | Explanation |
|------|------------|
| An IO fetches **pages**, not rows | You cannot ask the disk for a single row |
| One IO = one or more pages | Depends on disk settings |
| You get **everything in the page** | Can't say "give me only the name column" |
| Extra rows come **for free** | If your row is on page 5, you get all rows on page 5 |

### Why Even `SELECT name` Is Expensive (Row Store)

```sql
-- Both require fetching the FULL page from disk
SELECT * FROM employees WHERE id = 42;
SELECT name FROM employees WHERE id = 42;
```

In a **row store**, the entire row is packed together. Even if you only want `name`, the IO fetches the **entire page**. The database then discards the columns you didn't ask for — but the IO cost is already paid.

### How Pages Are Stored and Read from Disk

Pages are stored as a **sequential array** in a file:

```
┌────────┬────────┬────────┬────────┬────────┬────────┐
│ Page 0 │ Page 1 │ Page 2 │ Page 3 │ Page 4 │ Page 5 │
└────────┴────────┴────────┴────────┴────────┴────────┘
```

To read page N:

```
Offset = page_number × page_size
Length = number_of_pages × page_size
```

**Example:** Reading pages 2–9 from a table with 8 KB pages:

```
File:    employees.dat
Offset:  2 × 8192 = 16,384 bytes
Length:  8 × 8192 = 65,536 bytes
```

The OS issues **one read** from byte 16,384 for 65,536 bytes — returning pages 2–9 in a single sequential operation. This is why **sequential reads** are fast.

---

## 11. Storage Models — What Goes Inside a Page?

What gets packed into a page depends on the storage model:

| Storage Model | How Data Is Packed | Optimized For |
|--------------|-------------------|---------------|
| **Row Store (NSM)** | All columns of a row packed together → next row | OLTP (transactional writes, single-row lookups) |
| **Column Store (DSM)** | All values of one column packed together | OLAP (aggregations: `SUM`, `AVG` on few columns) |
| **Document Store** | Compressed documents stored like rows | Flexible schemas, nested data |
| **Graph Store** | Edges/connectivity stored for traversal | Graph traversals (BFS, DFS) |

> [!tip] The Universal Goal
> Pack items in the page so that a single page read gives you **as much useful information as possible** for your workload. If you're reading many pages to do tiny amounts of work — rethink your data model.

---

## 12. Indexes — The Shortcut into the Heap

> [!note] Why Indexes Exist
> Without an index, finding a specific row requires scanning **every page** in the heap — called a **full table scan**. With an index, the database goes directly to the correct page.

### Full Table Scan (No Index)

```sql
SELECT * FROM employees WHERE employee_id = 10000;
-- No index → must scan ALL 333 pages
```

```
Page 0: rows 1-3   → not found
Page 1: rows 4-6   → not found
...
Page 333: row 1000 → FOUND! (333 IOs 💀)
```

### Index Lookup (B-Tree)

An index stores:
1. The **indexed column value** (e.g., `employee_id`)
2. A **pointer** to the row — the row ID + page number in the heap

```
Index on employee_id:
  10    → (row 1,   page 0)
  20    → (row 2,   page 0)
  ...
  10000 → (row 1000, page 333)
```

```sql
-- With index: B-Tree traversal (~3 IOs) + 1 heap fetch = ~4 IOs total ⚡
SELECT * FROM employees WHERE employee_id = 10000;
```

### Important Facts About Indexes

| Fact | Explanation |
|------|------------|
| Indexes are **stored on disk** | They have their own pages and require IO to read |
| Indexes use **B-Trees** | Go left if less, right if more |
| Not all indexes fit in **memory** | Large indexes may need disk IO just to search |
| Smaller indexes = faster | More of the index fits in memory = fewer IOs |
| You can't index **everything** | Each index has a write cost — only index what you search on |

---

## 13. Clustered vs Non-Clustered Indexes

### Non-Clustered Index (Secondary Index)

- The index is a **separate structure** from the heap.
- The heap itself is **unordered** — rows are wherever they were inserted.
- After finding the row in the index, you must do an **extra IO** to fetch the heap page.

### Clustered Index (Index-Organized Table)

- The heap is **physically ordered** around a single index.
- The table **IS** the index — no separate structure, no extra heap lookup.
- Also called **IOT (Index-Organized Table)** in Oracle.

| Feature | Clustered Index | Non-Clustered Index |
|---------|----------------|-------------------|
| Heap order | Sorted by index key | Unordered |
| Extra heap lookup? | ❌ No — data is in the index | ✅ Yes — must jump to heap |
| How many per table? | **Only 1** | Many |
| Range queries | Very fast (data is contiguous) | Slower (random page jumps) |

---

## 14. Postgres vs MySQL — Key Differences

| Feature | PostgreSQL | MySQL (InnoDB) |
|---------|------------|----------------|
| **Primary key** | Just a secondary index — no special treatment | **Clustered index** — table is organized around it |
| **Row ID** | System-maintained **ctid (tuple ID)** | Primary key **IS** the row ID |
| **All indexes point to** | The ctid | The primary key value |
| **UUID as primary key** | Fine — heap is unordered anyway | **Terrible** — random writes scatter across pages |

### Why Random UUIDs Kill MySQL Performance

In MySQL, the table is **physically ordered** by primary key. A random UUID means each insert hits a **different page** — cache misses, random disk IO, B-Tree rebalancing.

- **MySQL:** Use auto-increment or **UUIDv7** (time-sortable) for primary keys.
- **PostgreSQL:** UUID is fine — the heap is unordered, inserts are sequential appends.

### HOT Optimization (PostgreSQL)

When a row is updated, Postgres creates a **new tuple** (MVCC). If the new tuple fits in the **same page**:

```
Old ItemId → redirected to point at new tuple
Indexes    → still point to old ItemId → NO index update needed ⚡
```

If the new tuple goes to a **different page** → all indexes must update. Keeping rows small enough to stay on the same page is a significant performance optimization.

```sql
-- The Postgres HOT optimization in action
-- Updates that stay on the same page = no index churn
UPDATE employees SET salary = 90000 WHERE id = 42;
```

---

## 15. Summary / Checklist

> [!success] What You Must Know Cold
> - ✅ A **table** is a logical concept — physically it is a collection of **fixed-size pages** on disk
> - ✅ A **page** is the unit of storage — databases read/write entire pages, never individual rows
> - ✅ **IO** is the most expensive database operation — minimizing IO is the #1 goal
> - ✅ The **buffer pool** caches pages in memory — cache hits avoid disk IO entirely
> - ✅ The **heap** is an unordered collection of all pages for a table — scanning it is expensive
> - ✅ An **index** is a separate B-Tree structure that maps column values → page + row ID
> - ✅ **Full table scan** = read every page (expensive); **index lookup** = go directly to the page (fast)
> - ✅ A **clustered index** physically orders the heap by the index key — only 1 per table (MySQL default)
> - ✅ A **non-clustered index** is separate from the heap — requires an extra heap fetch (Postgres default)
> - ✅ **Slotted pages** are the most common layout — ItemId array grows down, tuples grow up
> - ✅ **Tuple = physical instance** of a row; **Row ID (ctid in Postgres)** = page + slot offset
> - ✅ The **WAL (Write-Ahead Log)** ensures durability — changes are journaled before pages are flushed
> - ✅ **HOT optimization** (Postgres) — if new tuple fits in same page, indexes don't need updating
> - ✅ **Random UUID primary keys** hurt MySQL (clustered) but not Postgres (non-clustered heap)
> - ✅ Logical execution: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`
>   Storage execution: `Query → Buffer Pool → (miss) → Disk IO → Page → Deserialize → Filter`

---

## 16. Tips

> [!tip] Keep Rows Lean
> The smaller your rows, the more rows fit per page, the more data you get per IO. Fat rows with many large columns mean fewer rows per page — more IOs per query. Only store what you actually need, and use proper data types (don't use `TEXT` when `VARCHAR(32)` is enough).

> [!tip] Index Only What You Search On
> Every index has a **write cost** — inserts, updates, and deletes must update every index on that table. Only index columns that appear in `WHERE`, `JOIN`, or `ORDER BY` clauses. Over-indexing is a real problem in production systems.

> [!tip] Use EXPLAIN ANALYZE to Count IOs
> In PostgreSQL, `EXPLAIN (ANALYZE, BUFFERS) SELECT ...` shows you exactly how many buffer hits and disk reads your query caused. Look for `seq scan` (full heap scan) on large tables — that's your signal to add an index.

> [!tip] Backend / Node.js Developer Notes
> When using PostgreSQL with Node.js (`pg`, Prisma, Drizzle), prefer **sequential UUIDs (UUIDv7)** or **auto-increment integers** for primary keys. Random UUIDs cause index fragmentation. For bulk inserts, use `COPY` or batched `INSERT` statements — each individual insert is a separate IO + WAL write. Batch to reduce overhead.

> [!tip] Understand Your Storage Model
> Row stores (Postgres, MySQL) pay the full row IO cost even for single-column queries. If you run heavy analytics (`SUM`, `AVG`, `GROUP BY` on 1–2 columns of a wide table), consider a columnar store (Redshift, BigQuery, DuckDB, Timescale's columnar compression) — they only read the columns you ask for.

> [!tip] The Buffer Pool Is Your Friend
> Frequently accessed pages stay in the buffer pool (memory). This is why "hot" tables (frequently queried small tables) are extremely fast — they're essentially always in memory. Design your schema so the hot path hits cached pages: use covering indexes, keep lookup tables small.

---

## 17. Practice Exercises

### Section A — Storage Concepts

```
-- 1. What is the difference between volatile and non-volatile storage?
--    Give one example of each and explain the access model.

-- 2. A database has pages of 8 KB and 1000 rows where each row is ~2.5 KB.
--    Approximately how many pages does the table need?
--    (Hint: rows per page = floor(8192 / 2560))

-- 3. Why does the DBMS prefer fixed-size pages over variable-size pages?

-- 4. Name the three levels of "page" in a DBMS context and their typical sizes.

-- 5. If reading from L1 cache takes 1 second relative, how long does reading
--    from an HDD take? What does this tell you about disk IO strategy?
```

**Answers:**

```
-- 1. Volatile (DRAM/memory): loses data on power loss; byte-addressable, random
--    access; extremely fast.
--    Non-volatile (SSD/HDD): persists data without power; block/page-addressable;
--    must load 4 KB page into memory to access a value; slower but persistent.

-- 2. Rows per page = floor(8192 / 2560) = 3 rows per page
--    Pages needed = ceil(1000 / 3) ≈ 334 pages

-- 3. Variable-size pages create holes when deleted — hard to fill with new pages.
--    Fixed-size pages allow simple offset math (offset = page_id × page_size)
--    and predictable IO behavior.

-- 4. Hardware page: 4 KB (atomic write unit of the storage device)
--    OS page:       4 KB (OS virtual memory granularity)
--    Database page: 1–16 KB (DBMS-defined; Postgres=8KB, MySQL=16KB)

-- 5. HDD takes ~3.3 weeks relative to 1 second for L1.
--    This means: never wait for disk if avoidable. Use buffer pool, indexes,
--    and sequential IO patterns to reduce how often and how much you read from disk.
```

---

### Section B — Page Layout & Tuples

```
-- 6. Explain the slotted page layout. Where does the slot array grow?
--    Where does tuple data grow? When is the page considered full?

-- 7. What is stored in a tuple header? What is NOT stored there?

-- 8. What is the difference between a Row, a Tuple, and an Item?

-- 9. What is the HOT optimization in PostgreSQL and when does it trigger?

-- 10. What is a ctid in PostgreSQL? What does (3, 5) mean?
```

**Answers:**

```
-- 6. Slotted page layout:
--    - Header at the top (page size, checksum, num slots, offsets)
--    - ItemId/slot array grows downward from the header
--    - Tuple data grows upward from the bottom
--    - Page is full when the slot array and tuple data regions meet

-- 7. Tuple header contains:
--    - Visibility info (which transaction created/modified it — for MVCC)
--    - NULL bitmap (which attributes are NULL)
--    NOT stored in tuple header:
--    - Schema information (that's in the system catalog, not per-tuple)

-- 8. Row    = the logical record as the user sees it (rows and columns)
--    Tuple  = a physical instance of the row stored in a page
--    Item   = same as tuple — the actual bytes stored in the page
--    The same logical row can have multiple physical tuples (MVCC versions)

-- 9. HOT (Heap-Only Tuple): when a row is updated, Postgres creates a new tuple.
--    If the new tuple fits on the SAME page as the old tuple:
--    → the old ItemId pointer is redirected to the new tuple
--    → indexes don't need updating (they still point to the same ItemId)
--    If the new tuple goes to a DIFFERENT page:
--    → all indexes on the table must be updated (expensive)

-- 10. ctid = tuple ID — Postgres's internal row identifier
--    Format: (page_number, tuple_offset_within_page)
--    (3, 5) = page number 3, 5th tuple in that page
--    You can see it with: SELECT ctid, * FROM tablename;
```

---

### Section C — Buffer Pool & IO

```
-- 11. What is the buffer pool and what problem does it solve?

-- 12. When does a write operation actually hit the disk in a typical DBMS?
--     Describe the write path.

-- 13. Why does `SELECT name FROM employees WHERE id = 42` still read the
--     entire page even though only the `name` column is needed?

-- 14. You need to read pages 5 through 12 from a table file with 8 KB pages.
--     Calculate the byte offset and length of the read operation.

-- 15. What is the WAL and why is it written before the dirty page is flushed?
```

**Answers:**

```
-- 11. Buffer pool = a fixed pool of memory where the DBMS caches pages from disk.
--     It solves the speed gap between memory and disk: if a page is already
--     in the buffer pool, it's served from memory (fast) instead of disk (slow).
--     Subsequent reads of the same page are free.

-- 12. Write path:
--     1. Page is pulled into buffer pool (if not already there)
--     2. Row is modified in memory → page becomes "dirty"
--     3. WAL record is written to disk (the journal)
--     4. The dirty page accumulates more writes (batching)
--     5. Eventually the dirty page is flushed to the data file on disk
--     The actual data file write is deferred — WAL hits disk immediately.

-- 13. In a row store, all columns are packed together in the page.
--     An IO operation fetches an entire page (e.g., 8 KB) — you cannot ask
--     for a partial page. Even if you SELECT only `name`, the disk IO brings
--     the full page with all columns. The DB then projects out just `name`.

-- 14. Offset = 5 × 8192 = 40,960 bytes
--     Length  = 8 × 8192 = 65,536 bytes  (pages 5,6,7,8,9,10,11,12 = 8 pages)
--     One OS read call: file.read(offset=40960, length=65536)

-- 15. WAL (Write-Ahead Log): the journal of changes before they hit the data file.
--     It is written FIRST because:
--     - If the system crashes before the dirty page flushes, the WAL allows
--       the DBMS to replay the change and recover to a consistent state
--     - Without WAL, a crash mid-flush could leave the data file corrupted
--     - This is the foundation of the Durability guarantee in ACID
```

---

### Section D — Indexes & Heap

```
-- 16. Why is a full table scan expensive? What is the worst-case number of
--     IOs for finding one row in a 1,000,000-row table with 3 rows per page?

-- 17. What two things does an index entry store?

-- 18. What is the difference between a clustered and a non-clustered index?
--     How many clustered indexes can a table have?

-- 19. Why are random UUIDs a bad choice for a MySQL primary key but acceptable
--     in PostgreSQL?

-- 20. You have a table with 500,000 rows, a B-Tree index has height 4,
--     and each page is 8 KB. Estimate the total IOs for an indexed lookup
--     vs a full heap scan (assume 3 rows per page).
```

**Answers:**

```
-- 16. Full table scan: the DBMS has no shortcut — it must read every page.
--     Pages for 1,000,000 rows at 3 rows/page = ceil(1,000,000/3) ≈ 333,334 pages
--     Worst case: the row is on the LAST page → 333,334 IOs 💀

-- 17. An index entry stores:
--     1. The indexed column value (e.g., employee_id = 10000)
--     2. A pointer to the row — the Row ID / page number + slot in the heap

-- 18. Clustered index: the heap is physically sorted by the index key.
--     - The table IS the index (no separate heap lookup needed)
--     - Only ONE clustered index per table (MySQL InnoDB uses PK by default)
--     Non-clustered index: separate structure from the heap.
--     - After finding the row in the index, an extra IO to the heap is needed
--     - Many non-clustered indexes can exist per table (Postgres default)

-- 19. MySQL (clustered): the table is physically ordered by primary key.
--     A random UUID lands on a random page each insert → cache miss, random IO,
--     B-Tree rebalancing → very slow for high-insert workloads.
--     PostgreSQL (non-clustered heap): the heap is unordered. Inserts just
--     append to the next available slot. UUID is fine — no ordering maintained.
--     Solution for MySQL: use auto-increment INT or UUIDv7 (time-sortable).

-- 20. Indexed lookup:
--     B-Tree traversal: 4 IOs (one per level of the tree)
--     Heap fetch: 1 IO
--     Total: ~5 IOs ⚡

--     Full heap scan:
--     Pages = ceil(500,000 / 3) ≈ 166,667 pages
--     Total: ~166,667 IOs 💀

--     Index is ~33,000× fewer IOs in this case.
```

---

*Sources: CMU 15-445/645 Database Systems Lecture #03 — Database Storage Part I · Andy Pavlo · Fall 2024 · https://15445.courses.cs.cmu.edu/fall2024/*