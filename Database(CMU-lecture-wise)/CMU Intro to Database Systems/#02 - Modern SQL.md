
**Course:** 15-445/645 Database Systems (Fall 2025) · Carnegie Mellon University · Andy Pavlo

---

## 1. SQL History & Standards

> [!info] What Is SQL and Why Does It Matter?
> **SQL** (Structured Query Language) is a **declarative** query language for relational databases. "Declarative" means you describe *what* you want, not *how* to compute it — the DBMS's query optimizer figures out the execution strategy. This is the fundamental contract: you say "join these two tables and filter by this condition," and the engine decides index scans, join algorithms, and execution order.
>
> SQL originated in the 1970s as IBM's **SEQUEL** (Structured English Query Language) as part of the System R project. The name shortened to SQL in the 1980s. It became an ANSI standard in 1986 and an ISO standard in 1987. Crucially, SQL is still actively evolving — new editions land every few years.

The standard progresses through versioned editions. Each adds significant capabilities:

| Standard | Key Additions |
|---|---|
| **SQL:1999** | Regular expressions, Triggers, Object-Oriented features |
| **SQL:2003** | XML support, Window functions, Sequences, Auto-generated IDs |
| **SQL:2008** | `TRUNCATE`, advanced sorting |
| **SQL:2011** | Temporal databases, Pipelined DML |
| **SQL:2016** | JSON support, Polymorphic tables |
| **SQL:2023** | Property Graph Queries, Multi-Dimensional Arrays |

> [!important] SQL-92 Is the Baseline
> The **minimum** standard a system must implement to claim SQL compliance is **SQL-92**. Everything above it is vendor-optional. This is why compatibility issues exist across PostgreSQL, MySQL, SQLite, MSSQL, and Oracle — each vendor extends the standard with proprietary features and may not implement every standard feature.

---

## 2. Relational Languages (SQL Command Classes)

> [!note] The Four Classes of SQL Commands
> SQL is not a monolithic language — it is composed of distinct sublanguages:
>
> - **DML (Data Manipulation Language):** `SELECT`, `INSERT`, `UPDATE`, `DELETE` — the commands developers use daily to read and mutate data.
> - **DDL (Data Definition Language):** `CREATE TABLE`, `CREATE INDEX`, `CREATE VIEW`, `ALTER TABLE`, `DROP` — schema-level structure definitions.
> - **DCL (Data Control Language):** `GRANT`, `REVOKE` — access control and permissions.
> - **Other:** View definitions, integrity constraints (`FOREIGN KEY`, `CHECK`), referential constraints, and transaction control (`BEGIN`, `COMMIT`, `ROLLBACK`).

> [!important] Sets vs. Bags — A Critical Distinction
> **Relational algebra** (the mathematical foundation) operates on **sets** — unordered collections with no duplicates.
>
> **SQL** operates on **bags** — unordered collections *that allow duplicates*. This is a deliberate engineering tradeoff: eliminating duplicates requires extra work (sorting or hashing), so SQL skips it by default for performance. You must explicitly request deduplication via the `DISTINCT` keyword.
>
> This is why `SELECT name FROM student` can return the same name multiple times if multiple rows share it, while `SELECT DISTINCT name FROM student` does not.

---

## 3. Example Database Schema

The following schema is used throughout all examples in this lecture. Internalize it.

```sql
-- Students at a university
CREATE TABLE student (
    sid   INT PRIMARY KEY,
    name  VARCHAR(16),
    login VARCHAR(32) UNIQUE,
    age   SMALLINT,
    gpa   FLOAT
);

-- Courses offered
CREATE TABLE course (
    cid  VARCHAR(32) PRIMARY KEY,
    name VARCHAR(32) NOT NULL
);

-- Enrollment junction table (many-to-many between student and course)
CREATE TABLE enrolled (
    sid   INT  REFERENCES student(sid),
    cid   VARCHAR(32) REFERENCES course(cid),
    grade CHAR(1)
);
```

Sample data used in examples:

```
student:                              enrolled:                  course:
sid    name    login      age  gpa   sid    cid     grade      cid     name
53666  RZA     rza@cs     56   4.0   53666  15-445  C          15-445  Database Systems
53688  Taylor  swift@cs   35   3.9   53688  15-721  A          15-721  Advanced DB Systems
53655  Tupac   shakur@cs  25   3.5   53688  15-826  B          15-826  Data Mining
                                     53655  15-445  B          15-799  Special Topics
                                     53666  15-721  C
```

---

## 3b. Practice Database Setup — Seed Data (1000 Students)

> [!info] Why a Seed Script?
> The lecture examples use only 3 students and 5 enrollments — not enough data to make aggregation, window ranking, or pagination exercises meaningful. The `seed.mjs` generator (attached separately) creates a fully realistic dataset: **1000 students**, **40 courses**, and **2000 enrollments** so every exercise in these notes produces interesting, non-trivial results.

### What Gets Generated

| Table | Rows | Details |
|---|---|---|
| `student` | 1,000 | Realistic names · unique logins (`name@dept`) · ages 18–60 · GPA 0.0–4.0 (bell-curve weighted) |
| `course` | 40 | Real CMU course IDs and names (15-445 through 36-401) |
| `enrolled` | 2,000 | Unique (sid, cid) pairs · grades weighted A 35% B 30% C 20% D 10% F 5% |

### Quick Start

```bash
# 1. Install the only dependency
npm install @faker-js/faker

# 2. Run the generator — produces seed.sql in the same directory
node seed.mjs

# 3. Load into PostgreSQL
psql -U youruser -d yourdb -f seed.sql

# 4. Load into SQLite (works without modification)
sqlite3 lecture.db < seed.sql
```

### How seed.mjs Works

```
seed.mjs
 ├── faker.seed(15445)          ← deterministic: same data every run
 ├── Build 40 courses           ← hardcoded CMU catalogue
 ├── Build 1000 students        ← faker names + unique login + GPA curve
 ├── Build 2000 enrollments     ← random (sid, cid) pairs, no duplicates
 └── Write seed.sql             ← wrapped in BEGIN/COMMIT, batched INSERTs
```

GPA distribution used in `seed.mjs`:

```
 0.0 – 1.49  →  5%   (struggling / academic probation)
 1.5 – 2.49  → 10%   (below average)
 2.5 – 3.29  → 25%   (average)
 3.3 – 3.79  → 35%   (good)
 3.8 – 4.00  → 25%   (excellent / dean's list)
```

### Sanity-Check Queries (Run After Seeding)

```sql
-- Verify row counts (expect: student=1000, course=40, enrolled=2000)
SELECT 'student'  AS tbl, COUNT(*) AS cnt FROM student
UNION ALL
SELECT 'course'   AS tbl, COUNT(*) AS cnt FROM course
UNION ALL
SELECT 'enrolled' AS tbl, COUNT(*) AS cnt FROM enrolled;

-- GPA distribution
SELECT ROUND(gpa::numeric, 0) AS bucket, COUNT(*) AS students
FROM student
GROUP BY bucket
ORDER BY bucket;

-- Grade distribution with percentages (uses a window function — see §12)
SELECT grade,
       COUNT(*) AS cnt,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM enrolled
GROUP BY grade
ORDER BY grade;

-- Top 5 most enrolled courses
SELECT c.name, COUNT(*) AS enrolled_count
FROM enrolled AS e
JOIN course AS c ON e.cid = c.cid
GROUP BY c.name
ORDER BY enrolled_count DESC
FETCH FIRST 5 ROWS ONLY;

-- Students taking the most courses
SELECT s.name, COUNT(*) AS course_count
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY s.name
ORDER BY course_count DESC
LIMIT 5;
```

> [!tip] Regenerate Anytime
> `faker.seed(15445)` makes every run produce identical data. Change the number to any integer to get a fresh randomized dataset. Useful if you want to practice on different distributions.

---

## 4. Aggregates

> [!note] What Are Aggregate Functions?
> An **aggregate function** takes a *bag of tuples* as input and produces a *single scalar value* as output. They collapse multiple rows into one summary value. Aggregate functions can almost only appear in the `SELECT` output list (or in `HAVING` clauses).
>
> The five standard aggregates:
> - `AVG(col)` — arithmetic mean of values in `col`
> - `MIN(col)` — minimum value in `col`
> - `MAX(col)` — maximum value in `col`
> - `SUM(col)` — sum of all values in `col`
> - `COUNT(col)` — number of non-NULL values in `col`; `COUNT(*)` counts all rows including NULLs

### Counting — Three Equivalent Forms

All three of the following produce identical results:

```sql
-- Count students with a CS login — all three are equivalent
SELECT COUNT(*) AS cnt    FROM student WHERE login LIKE '%@cs';
SELECT COUNT(login) AS cnt FROM student WHERE login LIKE '%@cs';
SELECT COUNT(1) AS cnt    FROM student WHERE login LIKE '%@cs';
```

`COUNT(*)` counts every row. `COUNT(col)` counts rows where `col` is NOT NULL. `COUNT(1)` evaluates the constant `1` for each row and counts those — same result.

### DISTINCT Inside Aggregates

```sql
-- Count only unique logins (deduplicate before counting)
SELECT COUNT(DISTINCT login) AS unique_logins
FROM student
WHERE login LIKE '%@cs';

-- Multiple aggregates in one SELECT
SELECT AVG(gpa) AS avg_gpa, COUNT(sid) AS num_students
FROM student
WHERE login LIKE '%@cs';
```

> [!warning] Non-Aggregated Columns Outside GROUP BY Are Undefined
> This is one of the most common SQL mistakes. If you `SELECT` a column that is *not* wrapped in an aggregate AND *not* listed in `GROUP BY`, the result for that column is undefined.
>
> ```sql
> -- WRONG: e.cid is not aggregated and not in GROUP BY
> SELECT AVG(s.gpa), e.cid
> FROM enrolled AS e JOIN student AS s ON e.sid = s.sid;
> -- Result: AVG(s.gpa) = 3.86, e.cid = ??? (arbitrary value)
> ```
>
> Most production databases (PostgreSQL, Oracle, MSSQL) will **error** here. SQLite silently picks an arbitrary value — dangerous in production. The SQL:2023 standard added `ANY_VALUE()` to explicitly request this "pick any" behavior:
>
> ```sql
> -- EXPLICIT: I know this is arbitrary, I'm okay with it
> SELECT AVG(s.gpa), ANY_VALUE(e.cid)
> FROM enrolled AS e JOIN student AS s ON e.sid = s.sid;
> ```

### GROUP BY — Partitioned Aggregation

`GROUP BY` partitions the result set into subsets sharing the same values for the specified columns, then computes aggregates per subset.

```sql
-- Average GPA broken down by each course
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid;
```

```
Result:
cid     avg_gpa
15-445  3.75
15-721  3.95
15-826  3.90
```

> [!important] GROUP BY Rule
> Every column in the `SELECT` list that is NOT inside an aggregate function MUST appear in the `GROUP BY` clause. This is enforced by standard-compliant databases.

### GROUPING SETS — Multiple Groupings in One Pass

`GROUPING SETS` lets you compute multiple `GROUP BY` levels in a single query, avoiding multiple passes over the data that `UNION ALL` would require.

```sql
-- Compute enrollment counts at three granularities simultaneously
SELECT c.name AS course_name, e.grade, COUNT(*) AS num_students
FROM enrolled AS e
JOIN course AS c ON e.cid = c.cid
GROUP BY GROUPING SETS (
    (c.name, e.grade),  -- per course AND grade
    (c.name),           -- per course only
    ()                  -- grand total
);
```

```
Result:
course_name              grade  num_students
NULL                     NULL   5            ← grand total
Database Systems         C      1
Database Systems         B      1
Advanced DB Systems      A      1
Advanced DB Systems      C      1
Data Mining              B      1
Database Systems         NULL   2            ← course subtotal
Advanced DB Systems      NULL   2
Data Mining              NULL   1
```

`NULL` in the grouping columns indicates "rolled up" / aggregated across all values at that level.

> [!tip] ROLLUP and CUBE as Shortcuts
> `ROLLUP(a, b)` is shorthand for `GROUPING SETS ((a, b), (a), ())` — all hierarchical subtotals.
> `CUBE(a, b)` is shorthand for all possible combinations: `GROUPING SETS ((a,b), (a), (b), ())`.
> These are common in OLAP/reporting queries.

### HAVING — Filtering Groups

`WHERE` filters individual rows *before* grouping. `HAVING` filters *groups* after aggregation has been computed.

```sql
-- Wrong: cannot use aggregate alias in WHERE
SELECT AVG(s.gpa) AS avg_gpa, e.cid
FROM enrolled AS e, student AS s
WHERE e.sid = s.sid
  AND avg_gpa > 3.9        -- ERROR: avg_gpa doesn't exist yet at this stage
GROUP BY e.cid;

-- Correct: use HAVING to filter on aggregate results
SELECT AVG(s.gpa) AS avg_gpa, e.cid
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid
HAVING AVG(s.gpa) > 3.9;
```

```
Result:
avg_gpa   cid
3.950000  15-721
```

> [!warning] HAVING Alias Compatibility
> Some databases (like PostgreSQL) allow `HAVING avg_gpa > 3.9` using the alias defined in `SELECT`. The SQL standard technically requires repeating the full expression `HAVING AVG(s.gpa) > 3.9`. For portability, prefer the full expression.

### SQL Logical Execution Order

Understanding this order is key to knowing what is available where:

```
FROM / JOIN        ← tables are assembled
WHERE              ← rows are filtered (no aggregates here)
GROUP BY           ← rows are partitioned into groups
HAVING             ← groups are filtered (aggregates available)
SELECT             ← output columns are computed
ORDER BY           ← results are sorted
LIMIT / OFFSET     ← results are trimmed
```

### 🏋️ Aggregate Practice Exercises

```sql
-- 1. Count the total number of students in the database.

-- 2. Find the highest GPA among all students.

-- 3. Find the lowest GPA among all students.

-- 4. Find the average age of all students.

-- 5. Count the number of distinct courses that have at least one enrollment.

-- 6. For each student, count how many courses they are enrolled in.
--    Show sid and the count. Order by count descending.

-- 7. Find the average GPA of students enrolled in course '15-445'.

-- 8. List all courses where the number of enrolled students is greater than 1.
--    Show cid and the student count.

-- 9. Find the course with the highest average student GPA.
--    Show cid and avg_gpa.

-- 10. Count the number of students per grade (A, B, C) across all enrollments.

-- 11. For each course, show the count of students per grade using GROUPING SETS
--     to also include per-course subtotals and a grand total.

-- 12. Find courses where ALL enrolled students have a GPA above 3.5.
--     (Hint: use HAVING with MIN)

-- 13. Find the course with the most enrolled students. Show just that one course.

-- 14. Get the number of students and average GPA grouped by age bracket:
--     age < 30, 30-40, > 40. (Hint: use CASE inside GROUP BY)

-- 15. Find students whose GPA is above the overall average GPA of all students.
```

---

## 5. String Operations

> [!note] String Behavior Across Databases
> SQL-92 mandates that strings are **case-sensitive** and must use **single quotes** only. Real-world systems vary significantly:

| System | Case Sensitive | Quote Style |
|---|---|---|
| SQL-92 Standard | ✅ Yes | Single `'` only |
| PostgreSQL | ✅ Yes | Single `'` only |
| MySQL | ❌ No | Single `'` or double `"` |
| SQLite | ✅ Yes | Single `'` or double `"` |
| MSSQL | ✅ Yes | Single `'` only |
| Oracle | ✅ Yes | Single `'` only |

This means `WHERE name = 'tupac'` would fail in PostgreSQL (case-sensitive), but succeed in MySQL. Use `UPPER()` or `LOWER()` for safe case-insensitive comparisons.

### Pattern Matching with LIKE

```sql
-- '%' matches any substring (including empty string)
-- '_' matches exactly one character

-- Find all courses starting with '15-'
SELECT * FROM enrolled WHERE cid LIKE '15-%';

-- Find students whose login ends with '@c' followed by exactly one character
SELECT * FROM student WHERE login LIKE '%@c_';
-- Matches: rza@cs, swift@cs, shakur@cs

-- Case-insensitive match using UPPER
SELECT * FROM student WHERE UPPER(name) = UPPER('TuPaC');
```

### SIMILAR TO — Regex Pattern Matching

```sql
-- SIMILAR TO uses SQL regex syntax (supported in PostgreSQL, not all systems)
SELECT * FROM student
WHERE login SIMILAR TO '[a-z]+@cs';

-- Many systems (PostgreSQL, MySQL) also support POSIX regex:
SELECT * FROM student WHERE login ~ '^[a-z]+@cs$'; -- PostgreSQL
```

### String Functions

```sql
-- SUBSTRING: extract characters 1 through 5 from name
SELECT SUBSTRING(name, 1, 5) AS short_name
FROM student WHERE sid = 53688;
-- Result: 'Taylo'

-- UPPER/LOWER for normalization
SELECT * FROM student WHERE UPPER(name) LIKE 'R%';

-- CONCAT or || operator for string joining
SELECT name FROM student WHERE login = LOWER(name) || '@cs';
SELECT name FROM student WHERE login = CONCAT(LOWER(name), '@cs');
```

> [!warning] Concatenation Operator Varies by System
> `||` is the SQL standard concatenation operator. MSSQL uses `+`. MySQL uses `CONCAT()`. Always check the target system. PostgreSQL supports both `||` and `CONCAT()`.

### 🏋️ String Operations Practice Exercises

```sql
-- 1. Find all students whose name starts with the letter 'T'.

-- 2. Find all students whose login ends in '@cs'.

-- 3. Find all students whose name is exactly 5 characters long.
--    (Hint: use LIKE with '_')

-- 4. Select each student's name converted to uppercase.

-- 5. Find all students where the login starts with exactly 3 lowercase letters
--    followed by '@cs'. Use SIMILAR TO or LIKE.

-- 6. Select the first 3 characters of every student's name as an abbreviation.

-- 7. Construct a full label for each student as "name (login)".
--    Example: "Taylor (swift@cs)" using concatenation.

-- 8. Find students whose name, when lowercased, matches their login prefix
--    (the part before '@'). (Hint: LOWER and SUBSTRING or SPLIT_PART)

-- 9. List all course names that contain the word 'Database' (case-insensitive).

-- 10. Find all enrollments where the course id contains a dash '-'.
```

---

## 6. Date and Time Operations

> [!note] DATE and TIME in SQL
> SQL supports `DATE`, `TIME`, `TIMESTAMP`, and `INTERVAL` types for representing temporal data. These can appear in both the `SELECT` output list and in `WHERE` predicates.

> [!warning] Massive Vendor Variation
> Date/time syntax and function names vary wildly across database systems. The SQL standard defines these types, but the functions to manipulate them are largely vendor-specific. Always check the docs for your target system.

```sql
-- PostgreSQL: days since start of year
SELECT CURRENT_DATE - DATE_TRUNC('year', CURRENT_DATE)::date AS days_since_jan1;

-- MySQL equivalent
SELECT DATEDIFF(CURDATE(), DATE_FORMAT(CURDATE(), '%Y-01-01')) AS days_since_jan1;

-- Filtering by date range (PostgreSQL)
SELECT * FROM some_event_table
WHERE event_date BETWEEN '2025-01-01' AND '2025-12-31';

-- Extracting parts of a date
SELECT EXTRACT(YEAR FROM CURRENT_DATE) AS year,
       EXTRACT(MONTH FROM CURRENT_DATE) AS month;
```

> [!tip] Backend Advice
> In Node.js/PostgreSQL applications, always store timestamps as `TIMESTAMPTZ` (timestamp with timezone) rather than `TIMESTAMP`. This avoids timezone-related bugs when your server or data spans multiple regions. Libraries like `date-fns` or `Temporal` API on the JS side pair well with PostgreSQL's rich temporal functions.

---

## 7. Output Redirection

Instead of returning query results to the client, you can persist them into another table for later use.

> [!note] Two Modes of Output Redirection
> **Into a new table** — creates the table on the fly with the same schema as the query output:
> ```sql
> -- PostgreSQL / SQL standard CREATE TABLE AS
> CREATE TABLE CourseIds AS
>     SELECT DISTINCT cid FROM enrolled;
>
> -- SQL Server / Sybase syntax
> SELECT DISTINCT cid INTO CourseIds FROM enrolled;
> ```
>
> **Into an existing table** — the target must already exist with compatible column types:
> ```sql
> INSERT INTO CourseIds (SELECT DISTINCT cid FROM enrolled);
> ```
>
> **Into a temporary table** — scoped to the current session, auto-dropped on disconnect:
> ```sql
> SELECT DISTINCT cid INTO TEMPORARY CourseIds FROM enrolled; -- PostgreSQL
> CREATE TEMP TABLE CourseIds AS SELECT DISTINCT cid FROM enrolled;
> ```

> [!tip] When to Use This
> Output redirection is especially useful in multi-step ETL pipelines where you compute intermediate results and store them before the next transformation step. In production, prefer CTEs or views over proliferating temp tables — they're cleaner and the query planner can optimize across them.

---

## 8. Output Control

> [!note] ORDER BY — Imposing Sort Order
> SQL results are unordered by default (the relational model has no inherent row order). Use `ORDER BY` to sort output. The default direction is `ASC` (ascending); use `DESC` for descending. Multiple columns create a lexicographic sort where later columns break ties from earlier ones.

```sql
-- Simple sort ascending (default)
SELECT sid, grade FROM enrolled WHERE cid = '15-721'
ORDER BY grade;

-- Descending sort
SELECT sid, grade FROM enrolled WHERE cid = '15-721'
ORDER BY grade DESC;

-- Multi-column sort: primary by grade descending, break ties by sid ascending
SELECT sid, grade FROM enrolled WHERE cid = '15-721'
ORDER BY grade DESC, sid ASC;

-- Sort by an expression
SELECT sid FROM enrolled WHERE cid = '15-721'
ORDER BY UPPER(grade) DESC, sid + 1 ASC;
```

### LIMIT and OFFSET — Pagination

```sql
-- Return only the first 10 results
SELECT sid, name FROM student
WHERE login LIKE '%@cs'
LIMIT 10;

-- Skip 10 rows, then return the next 20 (pagination)
SELECT sid, name FROM student
WHERE login LIKE '%@cs'
ORDER BY sid
LIMIT 20 OFFSET 10;

-- SQL Standard syntax (also valid in PostgreSQL)
SELECT sid, name FROM student
WHERE login LIKE '%@cs'
ORDER BY gpa DESC
FETCH FIRST 5 ROWS ONLY;

-- WITH TIES: include rows that tie for the last position
SELECT sid, name FROM student
ORDER BY gpa DESC
OFFSET 0 ROWS
FETCH FIRST 3 ROWS WITH TIES;

-- SQL Server proprietary syntax
SELECT TOP 10 sid, name FROM student WHERE login LIKE '%@cs';
```

> [!warning] LIMIT Without ORDER BY Is Non-Deterministic
> Without `ORDER BY`, the DBMS may return *different rows* on repeated invocations of the same `LIMIT` query — it depends on physical storage order and query plan. Always pair `LIMIT` with `ORDER BY` when you care about which rows are returned.

### 🏋️ Output Control Practice Exercises

```sql
-- 1. List all students ordered by GPA from highest to lowest.

-- 2. List the top 3 students by GPA.

-- 3. List all enrolled courses for student 53688, ordered by grade A to C.

-- 4. Find the 2nd and 3rd highest GPA students.
--    (Hint: LIMIT 2 OFFSET 1)

-- 5. List all students sorted by name alphabetically, then by age descending
--    if names are equal.

-- 6. List all courses ordered by course id descending.

-- 7. Find the student with the lowest GPA. Show only that one row.

-- 8. Paginate students: show students 6 through 10 when sorted by sid ascending.

-- 9. List all enrollments sorted first by grade (A before B before C),
--    then by course id alphabetically.

-- 10. Create a new table TopStudents containing students with GPA >= 3.9.
```

---

## 9. Nested Queries (Subqueries)

> [!note] What Are Nested Queries?
> A **nested query** (subquery) is a full `SELECT` statement embedded inside another query. They allow expressing complex logic that would otherwise require multiple round trips or temporary tables. The inner query executes and its result is used by the outer query.
>
> **Scope rule:** The inner query can reference columns from the outer query (correlated subquery), but the outer query cannot reference columns computed inside the inner query.

### Where Can Subqueries Appear?

```sql
-- 1. In SELECT output list (scalar subquery)
SELECT sid,
       (SELECT name FROM student AS s WHERE s.sid = e.sid) AS student_name
FROM enrolled AS e;

-- 2. In FROM clause (derived table / inline view)
SELECT s.name
FROM student AS s,
     (SELECT sid FROM enrolled WHERE cid = '15-445') AS enrolled_445
WHERE s.sid = enrolled_445.sid;

-- 3. In WHERE clause (most common)
SELECT name FROM student
WHERE sid IN (SELECT sid FROM enrolled WHERE cid = '15-445');
```

### Nested Query Result Expressions

| Operator | Meaning |
|---|---|
| `ALL` | Expression must be true for **every** row in the subquery result |
| `ANY` | Expression must be true for **at least one** row in the subquery result |
| `IN` | Equivalent to `= ANY()` — value appears in the subquery result set |
| `EXISTS` | True if the subquery returns **at least one row** (doesn't compare values) |
| `NOT EXISTS` | True if the subquery returns **zero rows** |

### Example: Students Enrolled in a Specific Course

```sql
-- Get names of students enrolled in '15-445'
SELECT name FROM student
WHERE sid IN (
    SELECT sid FROM enrolled
    WHERE cid = '15-445'
);
-- Result: RZA, Tupac
```

### Example: Student with Highest Enrollment ID

```sql
-- Find the student record with the maximum sid among enrolled students
-- Method 1: Using IN with MAX
SELECT sid, name FROM student
WHERE sid IN (
    SELECT MAX(sid) FROM enrolled
);

-- Method 2: Using JOIN with derived table (cleaner, optimizer-friendly)
SELECT s.sid, s.name
FROM student AS s
JOIN (SELECT MAX(sid) AS sid FROM enrolled) AS max_e
    ON s.sid = max_e.sid;

-- Method 3: Using ORDER BY + FETCH (explicit)
SELECT sid, name FROM student
WHERE sid IN (
    SELECT sid FROM enrolled
    ORDER BY sid DESC
    FETCH FIRST 1 ROW ONLY
);
```

### Example: Courses with No Students (Correlated NOT EXISTS)

```sql
-- Find courses that have zero enrollments
-- This is a correlated subquery: the inner query references course.cid from outer
SELECT * FROM course
WHERE NOT EXISTS (
    SELECT * FROM enrolled
    WHERE course.cid = enrolled.cid
);
-- Result: 15-799 Special Topics in Databases
```

The `NOT EXISTS` pattern is generally preferred over `NOT IN` because `NOT IN` has subtle NULL-handling bugs: if the subquery returns any NULL, `NOT IN` returns no rows at all.

> [!warning] NOT IN vs. NOT EXISTS and NULLs
> ```sql
> -- DANGEROUS: if any enrolled.cid is NULL, this returns zero rows
> SELECT * FROM course WHERE cid NOT IN (SELECT cid FROM enrolled);
>
> -- SAFE: NOT EXISTS handles NULLs correctly
> SELECT * FROM course
> WHERE NOT EXISTS (SELECT 1 FROM enrolled WHERE enrolled.cid = course.cid);
> ```
> Always prefer `NOT EXISTS` over `NOT IN` when NULLs may be present in the subquery.

> [!tip] Nested Queries Are Hard to Optimize
> The DBMS may not be able to "un-nest" a correlated subquery efficiently — it might re-execute the inner query for each row of the outer table. For large datasets, rewriting with a `JOIN` or `CTE` often yields dramatically better performance. Use `EXPLAIN ANALYZE` (PostgreSQL) to verify.

### 🏋️ Nested Query Practice Exercises

```sql
-- 1. Find the names of all students who are enrolled in at least one course.

-- 2. Find the names of all students who are NOT enrolled in any course.
--    (Use NOT EXISTS)

-- 3. Find all courses that have at least one enrolled student.
--    (Use EXISTS)

-- 4. Find the name of the student with the highest GPA.
--    (Use a subquery with MAX)

-- 5. Find all students whose GPA is above the average GPA of all students.

-- 6. Find all students enrolled in both '15-445' AND '15-721'.
--    (Hint: nested IN or intersect)

-- 7. Find all courses where every enrolled student has a grade of 'A'.
--    (Hint: NOT EXISTS with a NOT = 'A' inner query)

-- 8. Using a subquery in the FROM clause, find the average GPA
--    of students who are enrolled in at least one course.

-- 9. Find students who are enrolled in more courses than student 53688.
--    (Hint: correlated subquery with COUNT)

-- 10. Find the course(s) with the lowest number of enrolled students
--     (could be 0). Show cid and count.

-- 11. Find all students enrolled in '15-445' but NOT in '15-721'.

-- 12. Using ANY, find students whose GPA is greater than at least one
--     student enrolled in course '15-826'.

-- 13. Using ALL, find students whose GPA is greater than every student
--     enrolled in course '15-445'.

-- 14. Find courses where the number of enrolled students equals the
--     maximum enrollment count of any course.

-- 15. Find students who share the same GPA as at least one other student.
```

---

## 10. Lateral Joins

> [!note] What Is LATERAL?
> The `LATERAL` keyword allows a subquery in the `FROM` clause to reference columns from tables that appear *earlier* (to its left) in the same `FROM` clause. Without `LATERAL`, a subquery in `FROM` is independent — it cannot see other tables in the same query's `FROM` list.
>
> Conceptually, a `LATERAL` join behaves like a **for loop**: for each row in the left table, execute the lateral subquery using that row's values, then combine the results.

```
Conceptual execution:
for each course c in course:
    t1 = COUNT(*) of enrolled rows where cid = c.cid
    t2 = AVG(gpa) of students enrolled in c.cid
    emit (c.*, t1.cnt, t2.avg)
```

```sql
-- Calculate enrollment count and average GPA per course
-- t1 sees c.cid; t2 sees c.cid (both reference the outer course table)
SELECT *
FROM course AS c,
     LATERAL (
         SELECT COUNT(*) AS cnt
         FROM enrolled
         WHERE enrolled.cid = c.cid
     ) AS t1,
     LATERAL (
         SELECT AVG(s.gpa) AS avg_gpa
         FROM student AS s
         JOIN enrolled AS e ON s.sid = e.sid
         WHERE e.cid = c.cid
     ) AS t2
ORDER BY t1.cnt ASC;
```

```
Result:
cid     name                         cnt  avg_gpa
15-799  Special Topics in Databases   0   NULL
15-826  Data Mining                   1   3.90
15-445  Database Systems              2   3.75
15-721  Advanced DB Systems           2   3.95
```

Notice that `15-799` appears with `cnt = 0` and `avg_gpa = NULL` — a course with no enrollments. A regular `JOIN` would have eliminated it entirely. `LATERAL` with a comma join (implicit cross join) preserves all rows.

> [!tip] LATERAL vs. Correlated Subquery in WHERE
> A correlated subquery in `WHERE` runs once per outer row but can only return a scalar (single value). `LATERAL` in `FROM` can return multiple columns and multiple rows per outer row, making it far more powerful for computing multiple derived values simultaneously without repeating the join logic.
>
> In PostgreSQL, `JOIN LATERAL ... ON TRUE` is an explicit form. Many ORMs (like Prisma, TypeORM) generate lateral-style queries internally for N+1 avoidance.

### Simple LATERAL Illustration

```sql
-- t1 produces x=1; t2 references t1.x and produces y=2
SELECT *
FROM (SELECT 1 AS x) AS t1,
     LATERAL (SELECT t1.x + 1 AS y) AS t2;
-- Result: x=1, y=2
```

### 🏋️ Lateral Join Practice Exercises

```sql
-- 1. For each course, use LATERAL to find the number of enrolled students.
--    Show course name and count.

-- 2. For each student, use LATERAL to find the number of courses they are enrolled in.
--    Show student name and course count.

-- 3. For each course, use LATERAL to find the grade given most frequently.
--    (Hint: LATERAL with ORDER BY + LIMIT 1)

-- 4. For each student, use LATERAL to find the course they are enrolled in
--    that has the highest average GPA. Show student name and course cid.

-- 5. Use LATERAL to compute, for each course, both the enrollment count
--    and the MAX GPA of enrolled students in one query.

-- 6. For each course, use LATERAL to get the name of the student
--    with the highest GPA enrolled in that course.

-- 7. For each student, use LATERAL to find the grade they received
--    in course '15-445' (NULL if not enrolled). Show student name and grade.

-- 8. List all courses with their enrollment count and average student age
--    using two LATERAL subqueries.

-- 9. Use LATERAL to simulate a row number per course, listing
--    all students enrolled with their position (1, 2, ...) in that course.

-- 10. For each student, LATERAL join to find how many other students
--     share the same GPA.
```

---

## 11. Common Table Expressions (CTEs)

> [!note] What Is a CTE?
> A **Common Table Expression** (CTE) is a named, temporary result set defined with the `WITH` clause that exists only for the duration of a single query. It functions like an inline view or a temporary table scoped to that one statement.
>
> CTEs are an alternative to nested subqueries, explicit temp tables, and views. They improve readability, allow reuse of the same result multiple times in one query, and enable recursion.

```sql
-- Basic CTE: define cteName, then use it like a table
WITH cteName AS (
    SELECT 1 AS value
)
SELECT * FROM cteName;
-- Result: value = 1

-- Column aliasing before AS keyword
WITH cteName (col1, col2) AS (
    SELECT 1, 2
)
SELECT col1 + col2 AS total FROM cteName;
-- Result: total = 3
```

### Multiple CTEs in One Query

```sql
-- Chain multiple CTEs — later ones can reference earlier ones
WITH
    enrolled_counts (cid, cnt) AS (
        SELECT cid, COUNT(*) FROM enrolled GROUP BY cid
    ),
    high_enrollment (cid) AS (
        SELECT cid FROM enrolled_counts WHERE cnt > 1
    )
SELECT c.name
FROM course AS c
JOIN high_enrollment AS h ON c.cid = h.cid;
```

### CTE Replacing a Nested Subquery

```sql
-- Find student with highest sid among enrolled students — using CTE
WITH max_enrolled (max_sid) AS (
    SELECT MAX(sid) FROM enrolled
)
SELECT s.name
FROM student AS s
JOIN max_enrolled ON s.sid = max_enrolled.max_sid;
```

This is functionally identical to the nested subquery version, but significantly more readable.

### Recursive CTEs

Adding `RECURSIVE` after `WITH` allows the CTE to reference itself. This enables expressing recursive computations — hierarchies, graph traversals, sequences — that would otherwise require procedural code.

> [!important] Recursive CTE Structure
> A recursive CTE has two mandatory parts separated by `UNION` or `UNION ALL`:
> 1. **Base case** — the non-recursive seed query (executed once)
> 2. **Recursive case** — the query that references the CTE itself (executed repeatedly until no new rows are produced)
>
> ```sql
> WITH RECURSIVE cte_name (columns) AS (
>     -- Base case
>     SELECT initial_values
>     UNION [ALL]
>     -- Recursive case (references cte_name)
>     SELECT next_values FROM cte_name WHERE stop_condition
> )
> SELECT * FROM cte_name;
> ```

```sql
-- Generate integers 1 through 10 using recursion
WITH RECURSIVE counter (n) AS (
    SELECT 1                              -- Base case: start at 1
    UNION ALL
    SELECT n + 1 FROM counter WHERE n < 10  -- Recursive: add 1 until n=10
)
SELECT * FROM counter;
-- Result: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
```

```sql
-- Practical example: traverse an org chart hierarchy
-- Assuming a table: employee(id, name, manager_id)
WITH RECURSIVE org_tree (id, name, depth) AS (
    -- Base case: the CEO (no manager)
    SELECT id, name, 0 FROM employee WHERE manager_id IS NULL
    UNION ALL
    -- Recursive: find direct reports of already-found employees
    SELECT e.id, e.name, t.depth + 1
    FROM employee AS e
    JOIN org_tree AS t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY depth, name;
```

> [!important] SQL Is Turing-Complete with Recursive CTEs
> `WITH RECURSIVE` makes SQL provably **Turing-complete** — it can express any computation that a general-purpose programming language can (given enough time and memory). This is not just trivia: it means complex graph algorithms (shortest paths, connectivity checks) can be expressed purely in SQL without application-side logic.

> [!tip] CTE vs. Subquery — When to Use Which
> Prefer **CTEs** when: the same subquery result is referenced multiple times, the query has more than two levels of nesting, or you need recursion.
> Prefer **subqueries** when: the logic is a one-liner used in exactly one place and a CTE would add verbosity without clarity.
> In PostgreSQL, CTEs before version 12 were **optimization fences** (always materialized). From PostgreSQL 12+, the planner can inline non-recursive CTEs unless you add `MATERIALIZED`. Be aware of this when writing performance-critical queries.

### 🏋️ CTE Practice Exercises

```sql
-- 1. Write a CTE that finds all students with GPA above 3.8,
--    then select their names and GPAs from it.

-- 2. Write a CTE that computes enrollment counts per course,
--    then select courses with more than 1 student.

-- 3. Rewrite the "find student with highest sid enrolled" query using a CTE.

-- 4. Write two chained CTEs: first get all enrolled sids, then
--    from those get names of students with GPA >= 3.5.

-- 5. Write a CTE that finds the average GPA per course,
--    then list courses where avg GPA is above the overall average GPA
--    (which should also come from a CTE).

-- 6. Use a recursive CTE to generate a sequence of even numbers from 2 to 20.

-- 7. Use a recursive CTE to compute the factorial of 10.
--    (Output: n and n! for each row from 1 to 10)

-- 8. Write a CTE that for each course computes the number of
--    students with grade 'A'. Then show courses with zero 'A' grades.

-- 9. Write a CTE to find students enrolled in more than one course,
--    then show their names and enrollment counts.

-- 10. Use a recursive CTE to generate a Fibonacci sequence up to the
--     15th term. (Output columns: position, fibonacci_value)

-- 11. Write a CTE that ranks courses by enrollment count (most enrolled first),
--     then select the top 2 courses.

-- 12. Write two CTEs: one for students with GPA > 3.5, another for
--     students enrolled in '15-721'. Then find the intersection.

-- 13. Write a CTE that computes, for each student, their grade in '15-445'
--     and their overall GPA. Then filter to students who got a 'C' but
--     have GPA above 3.5.

-- 14. Use a recursive CTE to compute the sum of integers 1 through 100.

-- 15. Write a multi-CTE query that: (a) finds the course with max enrollment,
--     (b) finds the average GPA of students in that course,
--     (c) selects the course name and that average GPA as the final output.
```

---

## 12. Window Functions

> [!note] What Are Window Functions?
> A **window function** computes a value for each row based on a set of related rows (its "window"), without collapsing those rows into a single output row. This is the key difference from regular aggregates: `GROUP BY` produces one row per group; window functions produce one row per input row, augmented with a computed value derived from neighboring rows.
>
> Window functions are essential for: running totals, moving averages, rankings, row numbering, lead/lag access, and percentile computations.

```sql
-- Syntax template
SELECT FUNC_NAME(...) OVER (
    [PARTITION BY col1, col2, ...]  -- how to group rows
    [ORDER BY col3 ASC|DESC]        -- how to order within the window
    [ROWS/RANGE BETWEEN ...]        -- optional frame specification
)
FROM table_name;
```

### Standard Aggregate Functions as Window Functions

Any standard aggregate (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`) can be used as a window function by adding `OVER (...)`.

```sql
-- Running total of enrollment count across all rows (no partitioning)
SELECT sid, cid, grade,
       COUNT(*) OVER () AS total_enrollments
FROM enrolled;
-- total_enrollments = 5 for every row (global count, no partitioning)
```

### Special Window Functions

| Function | Description |
|---|---|
| `ROW_NUMBER()` | Assigns a unique sequential integer to each row within the window (no ties) |
| `RANK()` | Assigns rank within window; ties receive the same rank, next rank skips (1,1,3) |
| `DENSE_RANK()` | Like RANK but no gaps after ties (1,1,2) |
| `LEAD(col, n)` | Value of `col` from n rows ahead |
| `LAG(col, n)` | Value of `col` from n rows behind |
| `NTILE(n)` | Divides rows into n equal buckets, returns bucket number |
| `FIRST_VALUE(col)` | Value of `col` in the first row of the window frame |
| `LAST_VALUE(col)` | Value of `col` in the last row of the window frame |

### ROW_NUMBER — Basic Usage

```sql
-- Assign a row number to every enrollment (arbitrary order)
SELECT *, ROW_NUMBER() OVER () AS row_num
FROM enrolled;
```

```
sid    cid     grade  row_num
53666  15-445  C      1
53688  15-721  A      2
53688  15-826  B      3
53655  15-445  B      4
53666  15-721  C      5
```

### PARTITION BY — Per-Group Row Numbers

```sql
-- Row numbers reset per course (partitioned by cid)
SELECT cid, sid,
       ROW_NUMBER() OVER (PARTITION BY cid) AS row_num
FROM enrolled
ORDER BY cid;
```

```
cid     sid    row_num
15-445  53666  1
15-445  53655  2
15-721  53688  1
15-721  53666  2
15-826  53688  1
```

### ORDER BY Inside OVER — Deterministic Ordering

```sql
-- Row numbers assigned in cid order (globally, not per partition)
SELECT *, ROW_NUMBER() OVER (ORDER BY cid) AS row_num
FROM enrolled
ORDER BY cid;
```

> [!important] ROW_NUMBER vs. RANK — Timing of Sort
> The DBMS computes `RANK()` **after** the window's `ORDER BY` sort, so ties in the sort key get the same rank. `ROW_NUMBER()` is computed **before** the sort stabilizes — each row always gets a unique number even for tied values. This means `ROW_NUMBER()` is non-deterministic among tied rows unless a tiebreaker column is added to `ORDER BY`.

### RANK — Finding Top N Per Group

```sql
-- Find the student with the 2nd highest grade (alphabetically: A < B < C)
-- for each course — i.e., the student with the second-best grade
SELECT * FROM (
    SELECT *,
           RANK() OVER (
               PARTITION BY cid
               ORDER BY grade ASC  -- ASC: 'A' ranks 1st, 'B' ranks 2nd
           ) AS rnk
    FROM enrolled
) AS ranked
WHERE rnk = 2;
```

The outer `WHERE` on the window rank must be done in a subquery or CTE because window functions are computed after `WHERE` in the logical execution order.

> [!tip] Window Function Execution Order
> Window functions are computed in the `SELECT` phase, *after* `WHERE`, `GROUP BY`, and `HAVING`. This means you cannot filter on a window function result in the same query's `WHERE` clause — you must wrap the query in a subquery or CTE and filter in the outer query.

### Window Frame Specification

```sql
-- Running sum of enrollments ordered by cid
-- ROWS BETWEEN defines exactly which rows are included in each window
SELECT cid, sid,
       SUM(COUNT(*)) OVER (
           ORDER BY cid
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM enrolled
GROUP BY cid, sid;
```

### 🏋️ Window Function Practice Exercises

```sql
-- 1. Assign a global row number to all students ordered by GPA descending.

-- 2. For each course, assign row numbers to enrolled students ordered by
--    grade ascending (best grade first).

-- 3. Rank all students by GPA (highest = rank 1). Use RANK().
--    Show ties with the same rank.

-- 4. Find all students who rank in the top 2 by GPA using DENSE_RANK().

-- 5. For each course, find the student with the highest GPA (rank = 1).
--    Use RANK() with PARTITION BY.

-- 6. Find the student with the 2nd highest GPA overall. Handle ties.

-- 7. For each enrollment row, show the grade and the average grade
--    across all enrollments in the same course (as a window aggregate).

-- 8. Compute a running count of enrollments ordered by sid ascending.

-- 9. For each enrollment, use LAG() to show the previous student's grade
--    when ordered by sid within each course.

-- 10. For each course, use FIRST_VALUE() to show the name of the
--     student with the best grade (alphabetically first grade).

-- 11. Assign NTILE(3) buckets to all students ordered by GPA.
--     Show which third each student falls into.

-- 12. For each student, show their GPA and the GPA of the student
--     immediately above them (when sorted by GPA DESC) using LEAD().

-- 13. Compute the cumulative sum of student GPAs ordered by sid.

-- 14. Find courses where the student with rank 1 (best grade) has a GPA
--     above 3.8. (Hint: window rank in subquery, then filter outer query)

-- 15. For each course, show the difference between each student's GPA
--     and the average GPA of all students in that course.
```

---

## 13. Comparisons — Choosing the Right Construct

| Feature | Nested Subquery | CTE | Lateral Join | Window Function |
|---|---|---|---|---|
| **Reusability in same query** | ❌ Repeat it | ✅ Reference by name | ❌ Per-row only | N/A |
| **Row-level output** | ❌ Returns scalar/set | ❌ Returns a table | ✅ Per outer row | ✅ One row per input |
| **Multiple derived columns** | Needs multiple subqueries | One CTE per computation | ✅ Multiple lateral blocks | ✅ Multiple OVER clauses |
| **Recursion** | ❌ | ✅ With RECURSIVE | ❌ | ❌ |
| **Optimizer transparency** | Variable | Good (PG 12+) | Good | Excellent |
| **Readability** | Poor for >2 levels | ✅ Excellent | Moderate | Moderate |
| **Ranking / Running totals** | ❌ Awkward | ❌ Awkward | ❌ Awkward | ✅ Purpose-built |

| String Function | PostgreSQL | MySQL | SQLite | MSSQL |
|---|---|---|---|---|
| Concat | `||` or `CONCAT()` | `CONCAT()` | `||` | `+` |
| Regex match | `~` (POSIX) | `REGEXP` | `REGEXP` | `LIKE` only |
| Substring | `SUBSTRING(s,b,e)` | `SUBSTRING(s,b,e)` | `SUBSTR(s,b,e)` | `SUBSTRING(s,b,e)` |
| String length | `LENGTH()` | `LENGTH()` | `LENGTH()` | `LEN()` |
| Case convert | `UPPER()` / `LOWER()` | Same | Same | Same |

---

## 14. Summary / Checklist

> [!success] What You Must Know Cold
> - ✅ SQL is **declarative** and operates on **bags** (not sets) — duplicates are allowed by default
> - ✅ SQL-92 is the **minimum compliance baseline**; know what features are standard vs. proprietary
> - ✅ Aggregate functions (`AVG`, `MIN`, `MAX`, `SUM`, `COUNT`) collapse bags into scalars
> - ✅ Any `SELECT`-ed column not inside an aggregate **must appear in `GROUP BY`**
> - ✅ `WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregation
> - ✅ `GROUPING SETS` computes multiple GROUP BY levels in one pass — far more efficient than UNION ALL
> - ✅ `ORDER BY` is mandatory for deterministic results; `LIMIT` without `ORDER BY` is non-deterministic
> - ✅ `NOT EXISTS` is safer than `NOT IN` when NULLs may appear in the subquery
> - ✅ `LATERAL` allows subqueries in `FROM` to reference earlier tables — like a SQL for-loop
> - ✅ CTEs use `WITH` and are scoped to one query; `WITH RECURSIVE` enables recursion (Turing-complete)
> - ✅ Window functions compute per-row values over a related set **without collapsing rows**
> - ✅ `ROW_NUMBER()` always unique; `RANK()` allows ties with gaps; `DENSE_RANK()` ties without gaps
> - ✅ Window function filters must go in a subquery/CTE outer query — not in the same `WHERE`
> - ✅ The logical execution order is: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`

---

## 15. Tips

> [!tip] Always Write Explicit JOINs
> Never use implicit join syntax (`FROM a, b WHERE a.id = b.id`). Always use `JOIN ... ON ...`. The implicit form is a legacy from SQL-89 and makes queries harder to read and maintain. Most linters and style guides flag it.

> [!tip] Use CTEs for Readability, Not Just Functionality
> Even when a single nested subquery would work, consider a CTE if the query has more than 2 levels of nesting. Future-you (and your teammates) will thank you. In production codebases, unreadable SQL is a major maintenance burden.

> [!tip] EXPLAIN ANALYZE Is Your Best Friend
> For any query that runs slow, run `EXPLAIN ANALYZE <your_query>` in PostgreSQL. It shows the actual execution plan, actual row counts, and time spent at each step. Look for sequential scans on large tables (often means a missing index) and nested loop joins on large datasets (consider hash join by adding indexes or rewriting).

> [!tip] Window Functions Over Application-Side Loops
> If you find yourself fetching rows in a loop and computing running totals, rankings, or comparisons to neighboring rows in your application code — stop. Rewrite it as a window function. The DBMS can do this in a single pass over sorted data, far more efficiently than N round-trips from the application.

> [!tip] Strive for One SQL Statement
> As Pavlo says: "You should (almost) always compute your answer as a single SQL statement." Multiple round trips (fetch, compute in app, insert back) are slow, not atomic, and hard to reason about. Window functions, CTEs, lateral joins, and subqueries exist specifically to let you express complex computations declaratively in one query.

> [!tip] Backend / Node.js Developer Notes
> When using ORMs (Prisma, TypeORM, Sequelize), know when to drop down to raw SQL. ORMs generate suboptimal queries for complex aggregations, window functions, and CTEs. Use `$queryRaw` (Prisma) or `query()` directly for performance-critical reporting queries. Always validate ORM-generated SQL with `EXPLAIN ANALYZE`.

---

*Sources: CMU 15-445/645 Database Systems Lecture #02 — Modern SQL · Andy Pavlo · Fall 2025 · https://15445.courses.cs.cmu.edu/fall2025/*