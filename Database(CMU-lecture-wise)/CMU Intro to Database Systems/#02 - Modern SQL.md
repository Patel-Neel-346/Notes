# Complete SQL Learning Guide
**Based on:** 15-445/645 Database Systems (Fall 2025) · Carnegie Mellon University · Andy Pavlo
**Extended with:** Level 1–3 foundational topics missing from the original lecture notes

---

## 📚 5 Levels of SQL Mastery

| Level | Focus | Topics |
|---|---|---|
| **Level 1** | Basics | SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, LIMIT |
| **Level 2** | Intermediate | JOINs, GROUP BY, HAVING, Aggregates, DISTINCT |
| **Level 3** | Advanced Querying | Subqueries, CASE WHEN, UNION, String/Date functions |
| **Level 4** | Design & Optimization | Normalization, Indexes, Transactions, Views, Stored Procedures |
| **Level 5** | Expert / Performance | Window Functions, CTEs, Query Optimization, Partitioning |

---

# ═══════════════════════════════════════
# LEVEL 1 — BASICS (BEGINNER)
# ═══════════════════════════════════════

## L1-1. What Is SQL?

> **SQL** (Structured Query Language) is a **declarative** query language for relational databases. "Declarative" means you describe *what* you want, not *how* to compute it — the DBMS's query optimizer figures out the execution strategy.

SQL originated in the 1970s as IBM's **SEQUEL** (Structured English Query Language). It became an ANSI standard in 1986. It is still actively evolving.

### SQL Command Classes

SQL is composed of distinct sublanguages:

- **DML (Data Manipulation Language):** `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- **DDL (Data Definition Language):** `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`
- **DCL (Data Control Language):** `GRANT`, `REVOKE`
- **TCL (Transaction Control Language):** `BEGIN`, `COMMIT`, `ROLLBACK`

---

## L1-2. Data Types

Every column in a table has a data type. Common ones:

| Category | Types | Example |
|---|---|---|
| Integer | `INT`, `SMALLINT`, `BIGINT` | `42` |
| Decimal | `FLOAT`, `NUMERIC(p,s)`, `DECIMAL` | `3.14` |
| Text | `CHAR(n)`, `VARCHAR(n)`, `TEXT` | `'hello'` |
| Boolean | `BOOLEAN` | `TRUE`, `FALSE` |
| Date/Time | `DATE`, `TIME`, `TIMESTAMP` | `'2025-01-01'` |

---

## L1-3. CREATE TABLE & DROP TABLE (DDL)

```sql
-- Create a table
CREATE TABLE student (
    sid    INT PRIMARY KEY,
    name   VARCHAR(16),
    login  VARCHAR(32) UNIQUE,
    age    SMALLINT,
    gpa    FLOAT
);

-- Create with NOT NULL and DEFAULT
CREATE TABLE course (
    cid   VARCHAR(32) PRIMARY KEY,
    name  VARCHAR(32) NOT NULL,
    credits INT DEFAULT 3
);

-- Drop a table (permanent — use carefully!)
DROP TABLE student;

-- Drop only if it exists (safe)
DROP TABLE IF EXISTS student;

-- Modify an existing table
ALTER TABLE student ADD COLUMN email VARCHAR(64);
ALTER TABLE student DROP COLUMN email;
ALTER TABLE student RENAME COLUMN name TO full_name;
```

### 🏋️ DDL Practice Exercises

```sql
-- 1. Create a table called 'department' with columns: dept_id (INT, PK),
--    dept_name (VARCHAR 50, NOT NULL), location (VARCHAR 100).
CREATE TABLE department (
    dept_id   INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL,
    location  VARCHAR(100)
);

-- 2. Add a column 'budget' (FLOAT) to the department table.
ALTER TABLE department ADD COLUMN budget FLOAT;

-- 3. Drop the budget column from department.
ALTER TABLE department DROP COLUMN budget;

-- 4. Create a table 'professor' with prof_id (INT PK), name (VARCHAR 50),
--    dept_id (INT), salary (NUMERIC 10,2).
CREATE TABLE professor (
    prof_id  INT PRIMARY KEY,
    name     VARCHAR(50),
    dept_id  INT,
    salary   NUMERIC(10, 2)
);

-- 5. Drop the professor table if it exists.
DROP TABLE IF EXISTS professor;
```

---

## L1-4. INSERT — Adding Data

```sql
-- Insert a single row (all columns)
INSERT INTO student (sid, name, login, age, gpa)
VALUES (53666, 'RZA', 'rza@cs', 56, 4.0);

-- Insert multiple rows at once
INSERT INTO student (sid, name, login, age, gpa)
VALUES
    (53688, 'Taylor', 'swift@cs', 35, 3.9),
    (53655, 'Tupac',  'shakur@cs', 25, 3.5);

-- Insert from another table
INSERT INTO top_students (sid, name, gpa)
SELECT sid, name, gpa FROM student WHERE gpa >= 3.9;
```

### 🏋️ INSERT Practice Exercises

```sql
-- 1. Insert a new student: sid=1001, name='Alice', login='alice@cs',
--    age=22, gpa=3.7
INSERT INTO student (sid, name, login, age, gpa)
VALUES (1001, 'Alice', 'alice@cs', 22, 3.7);

-- 2. Insert two courses: ('CS-101','Intro to CS') and ('CS-201','Data Structures')
INSERT INTO course (cid, name)
VALUES ('CS-101', 'Intro to CS'), ('CS-201', 'Data Structures');

-- 3. Insert a student without specifying age (leave it NULL).
INSERT INTO student (sid, name, login, gpa)
VALUES (1002, 'Bob', 'bob@cs', 3.2);
```

---

## L1-5. SELECT — Reading Data

```sql
-- Select all columns
SELECT * FROM student;

-- Select specific columns
SELECT name, gpa FROM student;

-- Select with a computed column
SELECT name, gpa * 25 AS gpa_score FROM student;

-- Select with alias
SELECT name AS student_name, gpa AS grade_point FROM student;

-- Select distinct values (remove duplicates)
SELECT DISTINCT age FROM student;
```

---

## L1-6. WHERE — Filtering Rows

```sql
-- Basic comparison operators: =, <>, !=, <, >, <=, >=
SELECT * FROM student WHERE gpa > 3.5;
SELECT * FROM student WHERE age = 25;
SELECT * FROM student WHERE name <> 'RZA';

-- Combining conditions with AND / OR / NOT
SELECT * FROM student WHERE gpa > 3.5 AND age < 30;
SELECT * FROM student WHERE gpa > 3.9 OR name = 'Tupac';
SELECT * FROM student WHERE NOT age = 25;

-- BETWEEN (inclusive on both ends)
SELECT * FROM student WHERE gpa BETWEEN 3.0 AND 3.9;
SELECT * FROM student WHERE age BETWEEN 20 AND 35;

-- IN (match against a list)
SELECT * FROM student WHERE name IN ('RZA', 'Tupac', 'Taylor');
SELECT * FROM student WHERE sid NOT IN (53666, 53688);

-- IS NULL / IS NOT NULL
SELECT * FROM student WHERE age IS NULL;
SELECT * FROM student WHERE gpa IS NOT NULL;

-- LIKE for pattern matching
-- '%' = any sequence of characters, '_' = exactly one character
SELECT * FROM student WHERE name LIKE 'T%';       -- starts with T
SELECT * FROM student WHERE login LIKE '%@cs';    -- ends with @cs
SELECT * FROM student WHERE name LIKE '_u%';      -- 2nd char is 'u'
```

### 🏋️ SELECT & WHERE Practice Exercises

```sql
-- 1. Select all students with GPA above 3.8.
SELECT * FROM student WHERE gpa > 3.8;

-- 2. Select names and logins of students aged between 20 and 30.
SELECT name, login FROM student WHERE age BETWEEN 20 AND 30;

-- 3. Select students whose name starts with 'T' AND have GPA >= 3.5.
SELECT * FROM student WHERE name LIKE 'T%' AND gpa >= 3.5;

-- 4. Select students whose sid is in the list: 53666, 53655.
SELECT * FROM student WHERE sid IN (53666, 53655);

-- 5. Select all students who do NOT have a NULL age.
SELECT * FROM student WHERE age IS NOT NULL;

-- 6. Select all students with GPA between 3.0 and 3.8, ordered by gpa DESC.
SELECT * FROM student WHERE gpa BETWEEN 3.0 AND 3.8 ORDER BY gpa DESC;

-- 7. Select students whose login contains 'cs'.
SELECT * FROM student WHERE login LIKE '%cs%';

-- 8. Select students where GPA is NOT between 2.0 and 3.0.
SELECT * FROM student WHERE gpa NOT BETWEEN 2.0 AND 3.0;
```

---

## L1-7. UPDATE — Modifying Data

```sql
-- Update a single column for matching rows
UPDATE student SET gpa = 4.0 WHERE sid = 53655;

-- Update multiple columns at once
UPDATE student SET gpa = 3.8, age = 26 WHERE name = 'Tupac';

-- Update all rows (no WHERE — be very careful!)
UPDATE student SET gpa = 0.0;

-- Update using an expression
UPDATE student SET gpa = gpa + 0.1 WHERE gpa < 3.5;
```

> [!warning] Always use WHERE with UPDATE
> Running `UPDATE table SET col = val` without `WHERE` modifies **every row** in the table. Always double-check your `WHERE` clause before executing.

### 🏋️ UPDATE Practice Exercises

```sql
-- 1. Set the GPA of student with sid=53666 to 3.95.
UPDATE student SET gpa = 3.95 WHERE sid = 53666;

-- 2. Increase every student's age by 1.
UPDATE student SET age = age + 1;

-- 3. Set login to 'unknown@cs' for all students where login IS NULL.
UPDATE student SET login = 'unknown@cs' WHERE login IS NULL;

-- 4. Set GPA to 0.0 for students with GPA below 1.0.
UPDATE student SET gpa = 0.0 WHERE gpa < 1.0;
```

---

## L1-8. DELETE — Removing Data

```sql
-- Delete rows matching a condition
DELETE FROM student WHERE sid = 53666;

-- Delete all students with GPA below 1.0
DELETE FROM student WHERE gpa < 1.0;

-- Delete all rows (no WHERE — empties the table!)
DELETE FROM student;

-- TRUNCATE: faster way to empty a table (DDL, not DML)
TRUNCATE TABLE student;
```

> [!warning] DELETE without WHERE removes all rows.
> `TRUNCATE` is faster than `DELETE` for clearing a table but cannot be rolled back in some databases and does not fire row-level triggers.

### 🏋️ DELETE Practice Exercises

```sql
-- 1. Delete the student with sid = 53655.
DELETE FROM student WHERE sid = 53655;

-- 2. Delete all students older than 50.
DELETE FROM student WHERE age > 50;

-- 3. Delete all enrollments for course '15-445'.
DELETE FROM enrolled WHERE cid = '15-445';

-- 4. Delete students who are not enrolled in any course.
DELETE FROM student WHERE sid NOT IN (SELECT sid FROM enrolled);
```

---

## L1-9. ORDER BY and LIMIT

```sql
-- Sort ascending (default)
SELECT * FROM student ORDER BY gpa;

-- Sort descending
SELECT * FROM student ORDER BY gpa DESC;

-- Multi-column sort
SELECT * FROM student ORDER BY gpa DESC, name ASC;

-- LIMIT: return only N rows
SELECT * FROM student ORDER BY gpa DESC LIMIT 5;

-- OFFSET: skip N rows, then return next M
SELECT * FROM student ORDER BY gpa DESC LIMIT 5 OFFSET 5;
```

> [!warning] LIMIT without ORDER BY is non-deterministic — different rows may be returned each run.

---

# ═══════════════════════════════════════
# LEVEL 2 — INTERMEDIATE QUERYING
# ═══════════════════════════════════════

## L2-1. JOINs

> A **JOIN** combines rows from two or more tables based on a related column.

### Example Schema (used throughout)

```sql
CREATE TABLE student  (sid INT PK, name VARCHAR, login VARCHAR, age SMALLINT, gpa FLOAT);
CREATE TABLE course   (cid VARCHAR PK, name VARCHAR);
CREATE TABLE enrolled (sid INT → student, cid VARCHAR → course, grade CHAR(1));
```

### INNER JOIN — Only Matching Rows

```sql
-- Students who are enrolled (only rows with a match in both tables)
SELECT s.name, e.cid, e.grade
FROM student AS s
INNER JOIN enrolled AS e ON s.sid = e.sid;

-- Three-table join
SELECT s.name, c.name AS course_name, e.grade
FROM student AS s
JOIN enrolled AS e ON s.sid = e.sid
JOIN course AS c ON e.cid = c.cid;
```

### LEFT JOIN — All Left Rows + Matching Right

```sql
-- All students, even those not enrolled (grade = NULL if not enrolled)
SELECT s.name, e.cid, e.grade
FROM student AS s
LEFT JOIN enrolled AS e ON s.sid = e.sid;
```

### RIGHT JOIN — All Right Rows + Matching Left

```sql
-- All enrollments, even if the student record is missing
SELECT s.name, e.cid, e.grade
FROM student AS s
RIGHT JOIN enrolled AS e ON s.sid = e.sid;
```

### FULL OUTER JOIN — All Rows from Both Tables

```sql
-- All students and all enrollments, matched where possible
SELECT s.name, e.cid
FROM student AS s
FULL OUTER JOIN enrolled AS e ON s.sid = e.sid;
```

### CROSS JOIN — Every Combination (Cartesian Product)

```sql
-- Every student paired with every course (use carefully — can be huge)
SELECT s.name, c.name
FROM student AS s
CROSS JOIN course AS c;
```

### Self Join — Table Joined to Itself

```sql
-- Find pairs of students with the same GPA
SELECT a.name AS student1, b.name AS student2, a.gpa
FROM student AS a
JOIN student AS b ON a.gpa = b.gpa AND a.sid < b.sid;
```

### 🏋️ JOIN Practice Exercises

```sql
-- 1. List all students with their enrolled course names. (INNER JOIN)
SELECT s.name, c.name AS course_name
FROM student AS s
JOIN enrolled AS e ON s.sid = e.sid
JOIN course AS c ON e.cid = c.cid;

-- 2. List all students including those not enrolled in any course. (LEFT JOIN)
SELECT s.name, e.cid
FROM student AS s
LEFT JOIN enrolled AS e ON s.sid = e.sid;

-- 3. Find all courses that have no enrolled students. (LEFT JOIN + IS NULL)
SELECT c.name
FROM course AS c
LEFT JOIN enrolled AS e ON c.cid = e.cid
WHERE e.sid IS NULL;

-- 4. List student name, course name, and grade for all enrollments.
SELECT s.name, c.name AS course_name, e.grade
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
JOIN course AS c ON e.cid = c.cid;

-- 5. Find students enrolled in '15-445' using a JOIN.
SELECT s.name
FROM student AS s
JOIN enrolled AS e ON s.sid = e.sid
WHERE e.cid = '15-445';

-- 6. Find all pairs of students enrolled in the same course. (Self join on enrolled)
SELECT a.sid AS student1, b.sid AS student2, a.cid
FROM enrolled AS a
JOIN enrolled AS b ON a.cid = b.cid AND a.sid < b.sid;

-- 7. List every student-course combination regardless of enrollment. (CROSS JOIN)
SELECT s.name, c.name
FROM student AS s
CROSS JOIN course AS c;

-- 8. Using FULL OUTER JOIN, show all students and all enrollments,
--    even unmatched ones.
SELECT s.name, e.cid, e.grade
FROM student AS s
FULL OUTER JOIN enrolled AS e ON s.sid = e.sid;

-- 9. Count how many courses each student is enrolled in (include 0 for unenrolled).
SELECT s.name, COUNT(e.cid) AS course_count
FROM student AS s
LEFT JOIN enrolled AS e ON s.sid = e.sid
GROUP BY s.sid, s.name;

-- 10. Find the student(s) enrolled in the most courses.
SELECT s.name, COUNT(*) AS course_count
FROM student AS s
JOIN enrolled AS e ON s.sid = e.sid
GROUP BY s.sid, s.name
ORDER BY course_count DESC
LIMIT 1;
```

---

## L2-2. Aggregate Functions

> An **aggregate function** takes a bag of rows and produces a single scalar value.

```sql
COUNT(*)        -- count all rows
COUNT(col)      -- count non-NULL values in col
COUNT(DISTINCT col) -- count unique non-NULL values
SUM(col)        -- sum of values
AVG(col)        -- arithmetic mean
MIN(col)        -- minimum value
MAX(col)        -- maximum value
```

```sql
-- Basic aggregates
SELECT COUNT(*) AS total_students FROM student;
SELECT AVG(gpa) AS avg_gpa FROM student;
SELECT MAX(gpa) AS top_gpa, MIN(gpa) AS lowest_gpa FROM student;
SELECT SUM(age) AS total_age FROM student;

-- DISTINCT inside aggregate
SELECT COUNT(DISTINCT cid) AS unique_courses FROM enrolled;

-- Multiple aggregates together
SELECT AVG(gpa), COUNT(sid), MAX(gpa), MIN(age) FROM student;
```

---

## L2-3. GROUP BY

> `GROUP BY` partitions rows into groups sharing the same values, then applies aggregates per group.

```sql
-- Count students per course
SELECT cid, COUNT(*) AS student_count
FROM enrolled
GROUP BY cid;

-- Average GPA per course
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid;
```

> [!important] GROUP BY Rule: Every column in SELECT that is NOT inside an aggregate MUST appear in GROUP BY.

---

## L2-4. HAVING

> `WHERE` filters rows **before** grouping. `HAVING` filters **groups** after aggregation.

```sql
-- Courses with more than 1 enrolled student
SELECT cid, COUNT(*) AS student_count
FROM enrolled
GROUP BY cid
HAVING COUNT(*) > 1;

-- Courses where average GPA of enrolled students > 3.9
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid
HAVING AVG(s.gpa) > 3.9;
```

### SQL Logical Execution Order

```
FROM / JOIN   → tables assembled
WHERE         → rows filtered (no aggregates here)
GROUP BY      → rows partitioned into groups
HAVING        → groups filtered (aggregates available)
SELECT        → output columns computed
ORDER BY      → results sorted
LIMIT/OFFSET  → results trimmed
```

### 🏋️ Aggregate + GROUP BY + HAVING Practice

```sql
-- 1. Count the total number of students.
SELECT COUNT(*) AS total_students FROM student;

-- 2. Find the highest and lowest GPA.
SELECT MAX(gpa) AS highest, MIN(gpa) AS lowest FROM student;

-- 3. Find the average age of all students.
SELECT AVG(age) AS avg_age FROM student;

-- 4. Count enrollments per course. Show cid and count.
SELECT cid, COUNT(*) AS enrollment_count FROM enrolled GROUP BY cid;

-- 5. Find the average GPA per course (join required).
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid;

-- 6. List courses with more than 1 enrolled student.
SELECT cid, COUNT(*) AS cnt FROM enrolled
GROUP BY cid HAVING COUNT(*) > 1;

-- 7. Find the number of students per grade across all enrollments.
SELECT grade, COUNT(*) AS cnt FROM enrolled
GROUP BY grade ORDER BY grade;

-- 8. Find the course with the highest average GPA.
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid ORDER BY avg_gpa DESC LIMIT 1;

-- 9. Find courses where ALL students have GPA above 3.5. (HAVING MIN)
SELECT e.cid FROM enrolled AS e
JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid HAVING MIN(s.gpa) > 3.5;

-- 10. Count distinct students enrolled (vs total enrollment rows).
SELECT COUNT(DISTINCT sid) AS unique_students FROM enrolled;
```

---

## L2-5. DISTINCT

```sql
-- Remove duplicate rows from result
SELECT DISTINCT age FROM student;

-- Distinct across multiple columns
SELECT DISTINCT cid, grade FROM enrolled;

-- Count unique values
SELECT COUNT(DISTINCT cid) FROM enrolled;
```

---

# ═══════════════════════════════════════
# LEVEL 3 — ADVANCED QUERYING
# ═══════════════════════════════════════

## L3-1. CASE WHEN — Conditional Logic

> `CASE WHEN` is SQL's if-else. It can appear in `SELECT`, `WHERE`, `ORDER BY`, and `GROUP BY`.

```sql
-- Simple CASE WHEN
SELECT name, gpa,
    CASE
        WHEN gpa >= 3.8 THEN 'Excellent'
        WHEN gpa >= 3.0 THEN 'Good'
        WHEN gpa >= 2.0 THEN 'Average'
        ELSE 'Poor'
    END AS performance
FROM student;

-- CASE in GROUP BY (age brackets)
SELECT
    CASE
        WHEN age < 25  THEN 'Under 25'
        WHEN age <= 35 THEN '25-35'
        ELSE                'Over 35'
    END AS age_group,
    COUNT(*) AS student_count,
    AVG(gpa) AS avg_gpa
FROM student
GROUP BY age_group;

-- CASE in ORDER BY (custom sort order)
SELECT name, grade FROM enrolled
ORDER BY
    CASE grade
        WHEN 'A' THEN 1
        WHEN 'B' THEN 2
        WHEN 'C' THEN 3
        ELSE 4
    END;

-- Counted pivot using CASE
SELECT
    COUNT(CASE WHEN grade = 'A' THEN 1 END) AS a_count,
    COUNT(CASE WHEN grade = 'B' THEN 1 END) AS b_count,
    COUNT(CASE WHEN grade = 'C' THEN 1 END) AS c_count
FROM enrolled;
```

### 🏋️ CASE WHEN Practice Exercises

```sql
-- 1. Label each student as 'High GPA' (>=3.8), 'Mid GPA' (>=3.0), or 'Low GPA'.
SELECT name, gpa,
    CASE
        WHEN gpa >= 3.8 THEN 'High GPA'
        WHEN gpa >= 3.0 THEN 'Mid GPA'
        ELSE 'Low GPA'
    END AS gpa_label
FROM student;

-- 2. For each enrollment, label the grade as 'Pass' (A,B,C) or 'Fail' (D,F).
SELECT sid, cid, grade,
    CASE WHEN grade IN ('A','B','C') THEN 'Pass' ELSE 'Fail' END AS result
FROM enrolled;

-- 3. Count how many students fall into each GPA bracket:
--    Excellent (>=3.8), Good (>=3.0), Below Average (<3.0).
SELECT
    CASE
        WHEN gpa >= 3.8 THEN 'Excellent'
        WHEN gpa >= 3.0 THEN 'Good'
        ELSE 'Below Average'
    END AS bracket,
    COUNT(*) AS student_count
FROM student
GROUP BY bracket;

-- 4. Show each student's name and a column 'is_senior' = 'Yes' if age > 40, else 'No'.
SELECT name, age,
    CASE WHEN age > 40 THEN 'Yes' ELSE 'No' END AS is_senior
FROM student;

-- 5. Using CASE, sort students so those with GPA >= 3.8 appear first,
--    then the rest alphabetically by name.
SELECT name, gpa FROM student
ORDER BY
    CASE WHEN gpa >= 3.8 THEN 0 ELSE 1 END,
    name ASC;
```

---

## L3-2. UNION, INTERSECT, EXCEPT

> Set operations combine results from two or more SELECT statements.

| Operator | Meaning | Duplicates |
|---|---|---|
| `UNION` | All rows from both queries | Removes duplicates |
| `UNION ALL` | All rows from both queries | Keeps duplicates |
| `INTERSECT` | Only rows in BOTH queries | Removes duplicates |
| `EXCEPT` | Rows in first but NOT second | Removes duplicates |

> Both queries must have the same number of columns with compatible types.

```sql
-- UNION: combine two result sets (removes duplicates)
SELECT sid FROM enrolled WHERE cid = '15-445'
UNION
SELECT sid FROM enrolled WHERE cid = '15-721';

-- UNION ALL: keep duplicates (faster — no deduplication step)
SELECT cid FROM enrolled WHERE grade = 'A'
UNION ALL
SELECT cid FROM enrolled WHERE grade = 'B';

-- INTERSECT: students enrolled in BOTH courses
SELECT sid FROM enrolled WHERE cid = '15-445'
INTERSECT
SELECT sid FROM enrolled WHERE cid = '15-721';

-- EXCEPT: students in 15-445 but NOT in 15-721
SELECT sid FROM enrolled WHERE cid = '15-445'
EXCEPT
SELECT sid FROM enrolled WHERE cid = '15-721';
```

### 🏋️ UNION / INTERSECT / EXCEPT Practice

```sql
-- 1. List all sids enrolled in '15-445' OR '15-721' (no duplicates).
SELECT sid FROM enrolled WHERE cid = '15-445'
UNION
SELECT sid FROM enrolled WHERE cid = '15-721';

-- 2. Find students enrolled in BOTH '15-445' AND '15-826'.
SELECT sid FROM enrolled WHERE cid = '15-445'
INTERSECT
SELECT sid FROM enrolled WHERE cid = '15-826';

-- 3. Find students in '15-445' but NOT in '15-721'.
SELECT sid FROM enrolled WHERE cid = '15-445'
EXCEPT
SELECT sid FROM enrolled WHERE cid = '15-721';

-- 4. Combine a list of student names and course names into one column.
SELECT name AS label, 'student' AS type FROM student
UNION ALL
SELECT name AS label, 'course' AS type FROM course;

-- 5. Using UNION, create a report showing total students and total courses.
SELECT 'Total Students' AS metric, COUNT(*) AS value FROM student
UNION ALL
SELECT 'Total Courses', COUNT(*) FROM course
UNION ALL
SELECT 'Total Enrollments', COUNT(*) FROM enrolled;
```

---

## L3-3. String Operations

> SQL-92 mandates strings are **case-sensitive** and use **single quotes** only.

### Pattern Matching with LIKE

```sql
-- '%' = any substring, '_' = exactly one character
SELECT * FROM student WHERE name LIKE 'T%';         -- starts with T
SELECT * FROM student WHERE login LIKE '%@cs';       -- ends with @cs
SELECT * FROM student WHERE name LIKE '_u%';         -- 2nd char is 'u'
SELECT * FROM student WHERE login LIKE '%@c_';       -- @c + one char
```

### Common String Functions

```sql
-- UPPER / LOWER — normalize case
SELECT UPPER(name) FROM student;
SELECT * FROM student WHERE UPPER(name) = 'TAYLOR';

-- LENGTH — character count
SELECT name, LENGTH(name) AS name_length FROM student;

-- SUBSTRING — extract part of string
SELECT SUBSTRING(name, 1, 3) AS abbr FROM student;   -- first 3 chars

-- TRIM — remove leading/trailing whitespace
SELECT TRIM('  hello  ');     -- 'hello'
SELECT LTRIM('  hello');      -- 'hello'
SELECT RTRIM('hello  ');      -- 'hello'

-- REPLACE — substitute text
SELECT REPLACE(login, '@cs', '@university') FROM student;

-- CONCAT / || — join strings
SELECT name || ' (' || login || ')' AS label FROM student;   -- standard
SELECT CONCAT(name, ' (', login, ')') AS label FROM student; -- MySQL/PG

-- POSITION / INSTR — find substring
SELECT POSITION('@' IN login) AS at_position FROM student;  -- PostgreSQL
SELECT INSTR(login, '@') AS at_position FROM student;        -- SQLite/MySQL
```

### Regex (PostgreSQL)

```sql
-- SIMILAR TO (SQL standard regex)
SELECT * FROM student WHERE login SIMILAR TO '[a-z]+@cs';

-- POSIX regex (PostgreSQL only)
SELECT * FROM student WHERE login ~ '^[a-z]+@cs$';  -- case sensitive
SELECT * FROM student WHERE login ~* '^[a-z]+@cs$'; -- case insensitive
```

### 🏋️ String Operations Practice Exercises

```sql
-- 1. Find all students whose name starts with 'T'.
SELECT * FROM student WHERE name LIKE 'T%';

-- 2. Find all students whose login ends in '@cs'.
SELECT * FROM student WHERE login LIKE '%@cs';

-- 3. Find all students whose name is exactly 5 characters long.
SELECT * FROM student WHERE name LIKE '_____';

-- 4. Select each student's name in uppercase.
SELECT UPPER(name) AS name_upper FROM student;

-- 5. Select the first 3 characters of each student's name as abbreviation.
SELECT SUBSTRING(name, 1, 3) AS abbr FROM student;

-- 6. Construct a label for each student as "name (login)".
SELECT name || ' (' || login || ')' AS label FROM student;

-- 7. Find all courses whose name contains 'Database' (case-insensitive).
SELECT name FROM course WHERE UPPER(name) LIKE '%DATABASE%';

-- 8. Replace '@cs' with '@university' in all student logins.
SELECT name, REPLACE(login, '@cs', '@university') AS new_login FROM student;

-- 9. Find the length of each student's name, ordered longest first.
SELECT name, LENGTH(name) AS name_len FROM student ORDER BY name_len DESC;

-- 10. Find students whose lowercase name matches the prefix of their login
--     (before the '@' sign).
-- PostgreSQL:
SELECT * FROM student WHERE LOWER(name) = SPLIT_PART(login, '@', 1);
-- SQLite:
SELECT * FROM student WHERE LOWER(name) = SUBSTR(login, 1, INSTR(login,'@')-1);
```

---

## L3-4. Date and Time Operations

> SQL supports `DATE`, `TIME`, `TIMESTAMP`, and `INTERVAL`. Functions vary by database.

```sql
-- Get current date/time
SELECT CURRENT_DATE;           -- today's date
SELECT CURRENT_TIME;           -- current time
SELECT CURRENT_TIMESTAMP;      -- date + time (PostgreSQL: NOW())
SELECT NOW();                  -- MySQL / PostgreSQL

-- Extract parts of a date
SELECT EXTRACT(YEAR  FROM CURRENT_DATE) AS yr;
SELECT EXTRACT(MONTH FROM CURRENT_DATE) AS mo;
SELECT EXTRACT(DAY   FROM CURRENT_DATE) AS dy;

-- Date arithmetic (PostgreSQL)
SELECT CURRENT_DATE + INTERVAL '7 days';       -- 7 days from now
SELECT CURRENT_DATE - INTERVAL '1 month';      -- 1 month ago
SELECT AGE('2025-01-01', '2000-06-15');        -- difference as interval

-- Date functions
SELECT DATE_TRUNC('month', CURRENT_DATE);      -- first day of month (PG)
SELECT DATE_TRUNC('year',  CURRENT_DATE);      -- first day of year (PG)

-- Filter by date
SELECT * FROM some_table WHERE event_date >= '2025-01-01';
SELECT * FROM some_table WHERE event_date BETWEEN '2025-01-01' AND '2025-12-31';

-- MySQL equivalents
SELECT CURDATE();              -- current date
SELECT DATEDIFF('2025-12-31', '2025-01-01');  -- days between dates
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');         -- format date
```

> [!tip] Always store timestamps as `TIMESTAMPTZ` (with timezone) in PostgreSQL to avoid timezone bugs.

---

# ═══════════════════════════════════════
# LEVEL 4 — DATABASE DESIGN & OPTIMIZATION
# ═══════════════════════════════════════

## L4-1. Normalization

> **Normalization** is the process of organizing a database to reduce data redundancy and improve data integrity.

### First Normal Form (1NF)
- Each column holds **atomic** (indivisible) values
- No repeating groups or arrays in a column
- Each row is uniquely identifiable

```sql
-- VIOLATES 1NF: courses column holds multiple values
-- student_id | name  | courses
-- 1          | Alice | 'Math, Science, English'

-- SATISFIES 1NF: each value is atomic
-- student_id | name  | course
-- 1          | Alice | Math
-- 1          | Alice | Science
-- 1          | Alice | English
```

### Second Normal Form (2NF)
- Must be in 1NF
- Every non-key column must depend on the **whole** primary key (no partial dependencies)

```sql
-- VIOLATES 2NF: student_name depends only on student_id (partial dependency)
-- (student_id, course_id) | student_name | grade
--   student_name should be in a separate student table

-- SATISFIES 2NF: split into student and enrollment tables
CREATE TABLE student (student_id INT PK, student_name VARCHAR);
CREATE TABLE enrollment (student_id INT, course_id INT, grade CHAR, PRIMARY KEY(student_id, course_id));
```

### Third Normal Form (3NF)
- Must be in 2NF
- No non-key column depends on another non-key column (no transitive dependencies)

```sql
-- VIOLATES 3NF: dept_location depends on dept_name, not on student_id
-- student_id | dept_name | dept_location

-- SATISFIES 3NF: move department data to its own table
CREATE TABLE department (dept_name VARCHAR PK, dept_location VARCHAR);
CREATE TABLE student (student_id INT PK, dept_name VARCHAR REFERENCES department);
```

---

## L4-2. Indexes

> An **index** is a data structure that speeds up lookups on a column at the cost of extra storage and slower writes.

```sql
-- Create an index on a single column
CREATE INDEX idx_student_gpa ON student(gpa);

-- Create an index on multiple columns (composite index)
CREATE INDEX idx_enrolled_cid_sid ON enrolled(cid, sid);

-- Create a unique index (enforces uniqueness like a constraint)
CREATE UNIQUE INDEX idx_student_login ON student(login);

-- Drop an index
DROP INDEX idx_student_gpa;

-- View query plan (use to check if index is being used)
EXPLAIN SELECT * FROM student WHERE gpa > 3.8;              -- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM student WHERE gpa > 3.8;      -- with actual stats
```

> [!tip] Index a column if: you filter (WHERE), join, or sort (ORDER BY) on it frequently. Avoid indexing columns with very few distinct values (like a boolean).

---

## L4-3. Constraints

```sql
-- PRIMARY KEY: uniquely identifies each row, cannot be NULL
CREATE TABLE student (sid INT PRIMARY KEY, name VARCHAR);

-- FOREIGN KEY: enforces referential integrity
CREATE TABLE enrolled (
    sid INT REFERENCES student(sid) ON DELETE CASCADE,
    cid VARCHAR REFERENCES course(cid) ON DELETE RESTRICT,
    grade CHAR(1)
);

-- UNIQUE: no two rows can have the same value
CREATE TABLE student (sid INT PK, login VARCHAR UNIQUE);

-- NOT NULL: column must always have a value
CREATE TABLE course (cid VARCHAR PK, name VARCHAR NOT NULL);

-- CHECK: custom validation rule
CREATE TABLE student (
    sid INT PK,
    gpa FLOAT CHECK (gpa >= 0.0 AND gpa <= 4.0),
    age SMALLINT CHECK (age >= 0)
);

-- DEFAULT: value used when not specified on INSERT
CREATE TABLE course (cid VARCHAR PK, credits INT DEFAULT 3);

-- Add constraint to existing table
ALTER TABLE student ADD CONSTRAINT chk_gpa CHECK (gpa BETWEEN 0 AND 4);
```

---

## L4-4. Transactions (ACID)

> A **transaction** is a sequence of SQL operations treated as a single unit of work.

### ACID Properties

| Property | Meaning |
|---|---|
| **Atomicity** | All operations succeed or all are rolled back — no partial updates |
| **Consistency** | Database moves from one valid state to another |
| **Isolation** | Concurrent transactions don't interfere with each other |
| **Durability** | Committed changes survive crashes |

```sql
-- Basic transaction
BEGIN;                          -- start transaction (also: START TRANSACTION)
    UPDATE student SET gpa = 4.0 WHERE sid = 53666;
    INSERT INTO enrolled (sid, cid, grade) VALUES (53666, '15-826', 'A');
COMMIT;                         -- save all changes permanently

-- Rollback on error
BEGIN;
    DELETE FROM student WHERE sid = 53666;
    -- Something goes wrong...
ROLLBACK;                       -- undo all changes since BEGIN

-- SAVEPOINT: partial rollback within a transaction
BEGIN;
    UPDATE student SET gpa = 3.5 WHERE sid = 53688;
    SAVEPOINT before_delete;
    DELETE FROM enrolled WHERE sid = 53688;
    ROLLBACK TO before_delete;  -- undo only the DELETE
COMMIT;                         -- commit the UPDATE
```

---

## L4-5. Views

> A **view** is a saved SQL query that behaves like a virtual table.

```sql
-- Create a view
CREATE VIEW high_gpa_students AS
SELECT sid, name, gpa FROM student WHERE gpa >= 3.8;

-- Query the view like a table
SELECT * FROM high_gpa_students;

-- View joining tables
CREATE VIEW student_enrollments AS
SELECT s.name, c.name AS course_name, e.grade
FROM student AS s
JOIN enrolled AS e ON s.sid = e.sid
JOIN course AS c ON e.cid = c.cid;

-- Drop a view
DROP VIEW high_gpa_students;

-- Replace/update a view
CREATE OR REPLACE VIEW high_gpa_students AS
SELECT sid, name, gpa, age FROM student WHERE gpa >= 3.8;
```

> [!tip] Views don't store data — they re-execute the query each time. For performance on complex queries, use **Materialized Views** (PostgreSQL) which cache the result.

```sql
-- Materialized view (PostgreSQL)
CREATE MATERIALIZED VIEW course_stats AS
SELECT e.cid, COUNT(*) AS cnt, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW course_stats;
```

---

## L4-6. Stored Procedures and Functions

> A **stored procedure** is a reusable block of SQL (and procedural logic) stored in the database.

```sql
-- PostgreSQL stored procedure (using PL/pgSQL)
CREATE OR REPLACE PROCEDURE enroll_student(p_sid INT, p_cid VARCHAR, p_grade CHAR)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO enrolled (sid, cid, grade) VALUES (p_sid, p_cid, p_grade);
    RAISE NOTICE 'Enrolled student % in course %', p_sid, p_cid;
END;
$$;

-- Call a procedure
CALL enroll_student(53666, '15-826', 'A');

-- PostgreSQL function (returns a value)
CREATE OR REPLACE FUNCTION get_avg_gpa(p_cid VARCHAR)
RETURNS FLOAT
LANGUAGE plpgsql AS $$
DECLARE
    avg_result FLOAT;
BEGIN
    SELECT AVG(s.gpa) INTO avg_result
    FROM student AS s
    JOIN enrolled AS e ON s.sid = e.sid
    WHERE e.cid = p_cid;
    RETURN avg_result;
END;
$$;

-- Call a function
SELECT get_avg_gpa('15-445');
```

---

# ═══════════════════════════════════════
# LEVEL 5 — EXPERT / PERFORMANCE
# ═══════════════════════════════════════

## L5-1. SQL History & Standards

> **SQL** is a **declarative** query language — you describe *what* you want, not *how* to compute it. The DBMS optimizer decides the execution strategy.

SQL originated in the 1970s as IBM's **SEQUEL**. ANSI standard 1986, ISO standard 1987.

| Standard | Key Additions |
|---|---|
| **SQL:1999** | Regular expressions, Triggers, OO features |
| **SQL:2003** | XML support, Window functions, Sequences |
| **SQL:2008** | `TRUNCATE`, advanced sorting |
| **SQL:2011** | Temporal databases |
| **SQL:2016** | JSON support |
| **SQL:2023** | Property Graph Queries, Multi-Dimensional Arrays |

> **SQL-92** is the minimum compliance baseline. Each vendor extends it differently — hence compatibility issues across PostgreSQL, MySQL, SQLite, MSSQL, Oracle.

---

## L5-2. Aggregates — Advanced

> Standard aggregates: `AVG`, `MIN`, `MAX`, `SUM`, `COUNT`.
> SQL operates on **bags** (allow duplicates), not sets. Use `DISTINCT` to deduplicate.

```sql
-- All three are equivalent for counting
SELECT COUNT(*)     FROM student WHERE login LIKE '%@cs';
SELECT COUNT(login) FROM student WHERE login LIKE '%@cs';
SELECT COUNT(1)     FROM student WHERE login LIKE '%@cs';

-- DISTINCT inside aggregate
SELECT COUNT(DISTINCT login) FROM student WHERE login LIKE '%@cs';
```

### GROUPING SETS — Multiple Groupings in One Pass

```sql
SELECT c.name AS course_name, e.grade, COUNT(*) AS num_students
FROM enrolled AS e
JOIN course AS c ON e.cid = c.cid
GROUP BY GROUPING SETS (
    (c.name, e.grade),  -- per course AND grade
    (c.name),           -- per course only
    ()                  -- grand total
);
```

> `ROLLUP(a, b)` = `GROUPING SETS ((a,b),(a),())` — hierarchical subtotals.
> `CUBE(a, b)` = all combinations: `GROUPING SETS ((a,b),(a),(b),())`.

### 🏋️ Aggregate Practice Exercises

```sql
-- 1. Count the total number of students in the database.
SELECT COUNT(*) AS total_students FROM student;

-- 2. Find the highest GPA among all students.
SELECT MAX(gpa) AS highest_gpa FROM student;

-- 3. Find the lowest GPA among all students.
SELECT MIN(gpa) AS lowest_gpa FROM student;

-- 4. Find the average age of all students.
SELECT AVG(age) AS avg_age FROM student;

-- 5. Count the number of distinct courses that have at least one enrollment.
SELECT COUNT(DISTINCT cid) AS active_courses FROM enrolled;

-- 6. For each student, count how many courses they are enrolled in.
SELECT sid, COUNT(*) AS course_count FROM enrolled
GROUP BY sid ORDER BY course_count DESC;

-- 7. Find the average GPA of students enrolled in course '15-445'.
SELECT AVG(s.gpa) AS avg_gpa
FROM student AS s JOIN enrolled AS e ON s.sid = e.sid
WHERE e.cid = '15-445';

-- 8. List all courses where the number of enrolled students is greater than 1.
SELECT cid, COUNT(*) AS student_count FROM enrolled
GROUP BY cid HAVING COUNT(*) > 1;

-- 9. Find the course with the highest average student GPA.
SELECT e.cid, AVG(s.gpa) AS avg_gpa
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid ORDER BY avg_gpa DESC LIMIT 1;

-- 10. Count the number of students per grade (A, B, C) across all enrollments.
SELECT grade, COUNT(*) AS student_count FROM enrolled
GROUP BY grade ORDER BY grade;

-- 11. For each course, show count per grade using GROUPING SETS.
SELECT e.cid, e.grade, COUNT(*) AS num_students
FROM enrolled AS e
GROUP BY GROUPING SETS ((e.cid, e.grade),(e.cid),());

-- 12. Find courses where ALL enrolled students have GPA above 3.5.
SELECT e.cid FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
GROUP BY e.cid HAVING MIN(s.gpa) > 3.5;

-- 13. Find the course with the most enrolled students.
SELECT cid, COUNT(*) AS student_count FROM enrolled
GROUP BY cid ORDER BY student_count DESC LIMIT 1;

-- 14. Get count and average GPA grouped by age bracket.
SELECT
    CASE WHEN age < 30 THEN 'Under 30' WHEN age <= 40 THEN '30-40' ELSE 'Over 40' END AS age_bracket,
    COUNT(*) AS student_count, AVG(gpa) AS avg_gpa
FROM student GROUP BY age_bracket;

-- 15. Find students whose GPA is above the overall average.
SELECT name, gpa FROM student
WHERE gpa > (SELECT AVG(gpa) FROM student) ORDER BY gpa DESC;
```

---

## L5-3. Nested Queries (Subqueries)

> A **subquery** is a full SELECT embedded inside another query.

### Where Subqueries Can Appear

```sql
-- 1. In SELECT (scalar subquery)
SELECT sid, (SELECT name FROM student AS s WHERE s.sid = e.sid) AS student_name
FROM enrolled AS e;

-- 2. In FROM (derived table)
SELECT s.name FROM student AS s,
    (SELECT sid FROM enrolled WHERE cid = '15-445') AS enrolled_445
WHERE s.sid = enrolled_445.sid;

-- 3. In WHERE (most common)
SELECT name FROM student WHERE sid IN (SELECT sid FROM enrolled WHERE cid = '15-445');
```

### Subquery Operators

| Operator | Meaning |
|---|---|
| `IN` | Value is in the subquery result set |
| `NOT IN` | Value is not in the subquery result set (watch out for NULLs!) |
| `EXISTS` | True if subquery returns at least one row |
| `NOT EXISTS` | True if subquery returns zero rows |
| `ANY` | True for at least one row in subquery |
| `ALL` | True for every row in subquery |

```sql
-- IN: students enrolled in 15-445
SELECT name FROM student WHERE sid IN (SELECT sid FROM enrolled WHERE cid = '15-445');

-- NOT EXISTS: courses with no students (safer than NOT IN)
SELECT * FROM course WHERE NOT EXISTS (
    SELECT 1 FROM enrolled WHERE course.cid = enrolled.cid
);

-- ANY: students whose GPA > at least one student in 15-826
SELECT name FROM student WHERE gpa > ANY (
    SELECT s.gpa FROM student AS s JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = '15-826'
);

-- ALL: students whose GPA > every student in 15-445
SELECT name FROM student WHERE gpa > ALL (
    SELECT s.gpa FROM student AS s JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = '15-445'
);
```

> [!warning] NOT IN vs NOT EXISTS: if the subquery returns any NULL, `NOT IN` returns zero rows. Always prefer `NOT EXISTS`.

### 🏋️ Nested Query Practice Exercises

```sql
-- 1. Find names of all students enrolled in at least one course.
SELECT name FROM student WHERE sid IN (SELECT sid FROM enrolled);

-- 2. Find names of students NOT enrolled in any course. (NOT EXISTS)
SELECT name FROM student AS s
WHERE NOT EXISTS (SELECT 1 FROM enrolled AS e WHERE e.sid = s.sid);

-- 3. Find all courses with at least one enrolled student. (EXISTS)
SELECT * FROM course AS c
WHERE EXISTS (SELECT 1 FROM enrolled AS e WHERE e.cid = c.cid);

-- 4. Find the name of the student with the highest GPA.
SELECT name FROM student WHERE gpa = (SELECT MAX(gpa) FROM student);

-- 5. Find all students with GPA above the average.
SELECT name, gpa FROM student WHERE gpa > (SELECT AVG(gpa) FROM student);

-- 6. Find students enrolled in both '15-445' AND '15-721'.
SELECT sid FROM enrolled WHERE cid = '15-445'
INTERSECT
SELECT sid FROM enrolled WHERE cid = '15-721';

-- 7. Find courses where every enrolled student has grade 'A'.
SELECT * FROM course AS c WHERE NOT EXISTS (
    SELECT 1 FROM enrolled AS e WHERE e.cid = c.cid AND e.grade <> 'A'
);

-- 8. Find the avg GPA of students enrolled in at least one course (subquery in FROM).
SELECT AVG(gpa) AS avg_gpa FROM (
    SELECT DISTINCT s.sid, s.gpa FROM student AS s JOIN enrolled AS e ON s.sid = e.sid
) AS enrolled_students;

-- 9. Find students enrolled in more courses than student 53688.
SELECT s.name FROM student AS s
WHERE (SELECT COUNT(*) FROM enrolled AS e WHERE e.sid = s.sid) >
      (SELECT COUNT(*) FROM enrolled AS e WHERE e.sid = 53688);

-- 10. Find students in '15-445' but NOT in '15-721'.
SELECT sid FROM enrolled WHERE cid = '15-445'
EXCEPT
SELECT sid FROM enrolled WHERE cid = '15-721';

-- 11. Using ANY, find students whose GPA > at least one student in '15-826'.
SELECT name, gpa FROM student WHERE gpa > ANY (
    SELECT s.gpa FROM student AS s JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = '15-826'
);

-- 12. Using ALL, find students whose GPA > every student in '15-445'.
SELECT name, gpa FROM student WHERE gpa > ALL (
    SELECT s.gpa FROM student AS s JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = '15-445'
);

-- 13. Find courses with enrollment equal to the maximum enrollment.
SELECT cid, COUNT(*) AS cnt FROM enrolled GROUP BY cid
HAVING COUNT(*) = (SELECT MAX(course_cnt) FROM (SELECT COUNT(*) AS course_cnt FROM enrolled GROUP BY cid) AS counts);

-- 14. Find students who share GPA with at least one other student.
SELECT name, gpa FROM student WHERE gpa IN (
    SELECT gpa FROM student GROUP BY gpa HAVING COUNT(*) > 1
);

-- 15. Find the course(s) with the lowest enrollment count.
SELECT c.cid, COUNT(e.sid) AS student_count
FROM course AS c LEFT JOIN enrolled AS e ON c.cid = e.cid
GROUP BY c.cid
HAVING COUNT(e.sid) = (
    SELECT MIN(cnt) FROM (
        SELECT c2.cid, COUNT(e2.sid) AS cnt
        FROM course AS c2 LEFT JOIN enrolled AS e2 ON c2.cid = e2.cid
        GROUP BY c2.cid
    ) AS counts
);
```

---

## L5-4. Lateral Joins

> `LATERAL` allows a subquery in `FROM` to reference columns from tables appearing earlier (to its left) in the same `FROM` clause. Like a SQL for-loop: for each left row, execute the lateral subquery.

```sql
-- For each course: enrollment count + average GPA in one query
SELECT *
FROM course AS c,
     LATERAL (SELECT COUNT(*) AS cnt FROM enrolled WHERE enrolled.cid = c.cid) AS t1,
     LATERAL (SELECT AVG(s.gpa) AS avg_gpa
              FROM student AS s JOIN enrolled AS e ON s.sid = e.sid
              WHERE e.cid = c.cid) AS t2
ORDER BY t1.cnt ASC;
```

> `LEFT JOIN LATERAL ... ON TRUE` preserves courses with zero enrollments. A plain comma join also works but filters them out depending on the inner query.

### 🏋️ Lateral Join Practice Exercises

```sql
-- 1. For each course, find number of enrolled students.
SELECT c.name, t.cnt FROM course AS c,
     LATERAL (SELECT COUNT(*) AS cnt FROM enrolled WHERE cid = c.cid) AS t;

-- 2. For each student, find number of courses enrolled in.
SELECT s.name, t.cnt FROM student AS s,
     LATERAL (SELECT COUNT(*) AS cnt FROM enrolled WHERE sid = s.sid) AS t;

-- 3. For each course, find the most frequent grade.
SELECT c.name, t.grade FROM course AS c,
     LATERAL (SELECT grade, COUNT(*) AS cnt FROM enrolled WHERE cid = c.cid
              GROUP BY grade ORDER BY cnt DESC LIMIT 1) AS t;

-- 4. For each course, compute both enrollment count and MAX GPA.
SELECT c.name, t1.cnt, t2.max_gpa FROM course AS c,
     LATERAL (SELECT COUNT(*) AS cnt FROM enrolled WHERE cid = c.cid) AS t1,
     LATERAL (SELECT MAX(s.gpa) AS max_gpa
              FROM student AS s JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = c.cid) AS t2;

-- 5. For each student, find their grade in '15-445' (NULL if not enrolled).
SELECT s.name, t.grade FROM student AS s
LEFT JOIN LATERAL (SELECT grade FROM enrolled WHERE sid = s.sid AND cid = '15-445') AS t ON TRUE;

-- 6. For each course, get the name of the highest-GPA enrolled student.
SELECT c.name AS course_name, t.student_name FROM course AS c,
     LATERAL (SELECT s.name AS student_name FROM student AS s
              JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = c.cid
              ORDER BY s.gpa DESC LIMIT 1) AS t;

-- 7. For each student, find how many other students share their GPA.
SELECT s.name, s.gpa, t.shared_count FROM student AS s,
     LATERAL (SELECT COUNT(*) - 1 AS shared_count FROM student AS s2 WHERE s2.gpa = s.gpa) AS t;

-- 8. List all courses with enrollment count and average student age.
SELECT c.name, t1.cnt, t2.avg_age FROM course AS c,
     LATERAL (SELECT COUNT(*) AS cnt FROM enrolled WHERE cid = c.cid) AS t1,
     LATERAL (SELECT AVG(s.age) AS avg_age
              FROM student AS s JOIN enrolled AS e ON s.sid = e.sid WHERE e.cid = c.cid) AS t2;
```

---

## L5-5. Common Table Expressions (CTEs)

> A **CTE** is a named temporary result set defined with `WITH`, scoped to one query. Improves readability and allows result reuse and recursion.

```sql
-- Basic CTE
WITH high_gpa AS (
    SELECT name, gpa FROM student WHERE gpa > 3.8
)
SELECT * FROM high_gpa ORDER BY gpa DESC;

-- Multiple chained CTEs
WITH
    enrolled_counts (cid, cnt) AS (
        SELECT cid, COUNT(*) FROM enrolled GROUP BY cid
    ),
    high_enrollment (cid) AS (
        SELECT cid FROM enrolled_counts WHERE cnt > 1
    )
SELECT c.name FROM course AS c JOIN high_enrollment AS h ON c.cid = h.cid;
```

### Recursive CTEs

```sql
-- Generate integers 1–10
WITH RECURSIVE counter (n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM counter WHERE n < 10
)
SELECT * FROM counter;

-- Factorial of 10
WITH RECURSIVE factorial (n, fact) AS (
    SELECT 1, 1
    UNION ALL
    SELECT n + 1, fact * (n + 1) FROM factorial WHERE n < 10
)
SELECT n, fact FROM factorial;
```

> `WITH RECURSIVE` makes SQL **Turing-complete** — it can express any computation, including graph traversals and hierarchies.

### 🏋️ CTE Practice Exercises

```sql
-- 1. CTE to find students with GPA > 3.8, then select names.
WITH high_gpa AS (SELECT name, gpa FROM student WHERE gpa > 3.8)
SELECT * FROM high_gpa ORDER BY gpa DESC;

-- 2. CTE for enrollment counts, then select courses with more than 1 student.
WITH enrollment_counts AS (SELECT cid, COUNT(*) AS cnt FROM enrolled GROUP BY cid)
SELECT cid, cnt FROM enrollment_counts WHERE cnt > 1;

-- 3. Rewrite "find student with highest sid enrolled" using CTE.
WITH max_enrolled (max_sid) AS (SELECT MAX(sid) FROM enrolled)
SELECT s.name FROM student AS s JOIN max_enrolled ON s.sid = max_enrolled.max_sid;

-- 4. Two chained CTEs: enrolled sids → good students (GPA >= 3.5).
WITH
    enrolled_sids AS (SELECT DISTINCT sid FROM enrolled),
    good_students AS (
        SELECT s.name, s.gpa FROM student AS s
        JOIN enrolled_sids AS e ON s.sid = e.sid WHERE s.gpa >= 3.5
    )
SELECT * FROM good_students ORDER BY gpa DESC;

-- 5. CTE for course avg GPA vs overall avg GPA.
WITH
    course_avg AS (
        SELECT e.cid, AVG(s.gpa) AS avg_gpa
        FROM enrolled AS e JOIN student AS s ON e.sid = s.sid GROUP BY e.cid
    ),
    overall_avg AS (SELECT AVG(gpa) AS avg_gpa FROM student)
SELECT c.cid, c.avg_gpa FROM course_avg AS c, overall_avg AS o WHERE c.avg_gpa > o.avg_gpa;

-- 6. Recursive CTE: even numbers 2 to 20.
WITH RECURSIVE evens (n) AS (
    SELECT 2 UNION ALL SELECT n + 2 FROM evens WHERE n < 20
)
SELECT * FROM evens;

-- 7. Recursive CTE: factorial of 10.
WITH RECURSIVE factorial (n, fact) AS (
    SELECT 1, 1 UNION ALL SELECT n + 1, fact * (n + 1) FROM factorial WHERE n < 10
)
SELECT n, fact AS factorial FROM factorial;

-- 8. CTE: for each course, count students with grade 'A'. Show courses with zero A's.
WITH a_counts AS (
    SELECT c.cid, COUNT(e.sid) AS a_count
    FROM course AS c LEFT JOIN enrolled AS e ON c.cid = e.cid AND e.grade = 'A'
    GROUP BY c.cid
)
SELECT cid FROM a_counts WHERE a_count = 0;

-- 9. CTE: students enrolled in more than one course, show names and count.
WITH multi_enrolled AS (
    SELECT sid, COUNT(*) AS course_count FROM enrolled GROUP BY sid HAVING COUNT(*) > 1
)
SELECT s.name, m.course_count FROM student AS s JOIN multi_enrolled AS m ON s.sid = m.sid
ORDER BY m.course_count DESC;

-- 10. Recursive CTE: Fibonacci sequence, first 15 terms.
WITH RECURSIVE fib (pos, a, b) AS (
    SELECT 1, 0, 1
    UNION ALL
    SELECT pos + 1, b, a + b FROM fib WHERE pos < 15
)
SELECT pos AS position, a AS fibonacci_value FROM fib;

-- 11. CTE ranking courses by enrollment, select top 2.
WITH ranked_courses AS (
    SELECT cid, COUNT(*) AS cnt, RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk
    FROM enrolled GROUP BY cid
)
SELECT cid, cnt FROM ranked_courses WHERE rnk <= 2;

-- 12. Recursive CTE: sum of integers 1 to 100.
WITH RECURSIVE sum_series (n, running_sum) AS (
    SELECT 1, 1
    UNION ALL
    SELECT n + 1, running_sum + (n + 1) FROM sum_series WHERE n < 100
)
SELECT running_sum AS total FROM sum_series WHERE n = 100;
```

---

## L5-6. Window Functions

> A **window function** computes a value for each row based on a related set of rows — without collapsing them like GROUP BY does.

```sql
-- Syntax
SELECT FUNC_NAME(...) OVER (
    [PARTITION BY col1, ...]   -- grouping (optional)
    [ORDER BY col2 ASC|DESC]   -- ordering within window (optional)
    [ROWS/RANGE BETWEEN ...]   -- frame specification (optional)
)
FROM table_name;
```

### Standard Aggregates as Window Functions

```sql
-- Global count on every row (no partitioning)
SELECT sid, cid, COUNT(*) OVER () AS total_enrollments FROM enrolled;

-- Running total of GPA ordered by sid
SELECT sid, gpa, SUM(gpa) OVER (ORDER BY sid ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_sum
FROM student;
```

### Ranking Functions

| Function | Behavior |
|---|---|
| `ROW_NUMBER()` | Always unique — no ties |
| `RANK()` | Ties get same rank; next rank skips (1,1,3) |
| `DENSE_RANK()` | Ties get same rank; no gap (1,1,2) |
| `NTILE(n)` | Divides into n equal buckets |

```sql
-- Global row number ordered by GPA
SELECT name, gpa, ROW_NUMBER() OVER (ORDER BY gpa DESC) AS row_num FROM student;

-- Per-course row numbers
SELECT cid, sid, ROW_NUMBER() OVER (PARTITION BY cid ORDER BY grade ASC) AS row_num FROM enrolled;

-- Rank with ties
SELECT name, gpa, RANK() OVER (ORDER BY gpa DESC) AS rnk FROM student;

-- Dense rank (no gaps)
SELECT name, gpa, DENSE_RANK() OVER (ORDER BY gpa DESC) AS dr FROM student;

-- Top 2 per course
SELECT * FROM (
    SELECT e.cid, s.name, s.gpa,
           RANK() OVER (PARTITION BY e.cid ORDER BY s.gpa DESC) AS rnk
    FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
) AS ranked
WHERE rnk <= 2;
```

### Lead / Lag / First / Last

```sql
-- LAG: previous row's value
SELECT cid, sid, grade, LAG(grade, 1) OVER (PARTITION BY cid ORDER BY sid) AS prev_grade
FROM enrolled;

-- LEAD: next row's value
SELECT name, gpa, LEAD(gpa, 1) OVER (ORDER BY gpa DESC) AS next_lower_gpa FROM student;

-- FIRST_VALUE: first value in the window frame
SELECT e.cid, s.name, e.grade,
       FIRST_VALUE(s.name) OVER (PARTITION BY e.cid ORDER BY e.grade ASC) AS best_grade_student
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid;
```

> [!tip] Window functions are computed **after** WHERE, GROUP BY, and HAVING. To filter on a window result, wrap the query in a subquery or CTE.

### 🏋️ Window Function Practice Exercises

```sql
-- 1. Assign a global row number to all students ordered by GPA descending.
SELECT name, gpa, ROW_NUMBER() OVER (ORDER BY gpa DESC) AS row_num FROM student;

-- 2. For each course, assign row numbers to enrolled students ordered by grade.
SELECT cid, sid, grade, ROW_NUMBER() OVER (PARTITION BY cid ORDER BY grade ASC) AS row_num
FROM enrolled;

-- 3. Rank all students by GPA (highest = rank 1) using RANK().
SELECT name, gpa, RANK() OVER (ORDER BY gpa DESC) AS rnk FROM student;

-- 4. Find students in top 2 by GPA using DENSE_RANK().
SELECT name, gpa, dr FROM (
    SELECT name, gpa, DENSE_RANK() OVER (ORDER BY gpa DESC) AS dr FROM student
) AS ranked WHERE dr <= 2;

-- 5. For each course, find the student with the highest GPA (rank = 1).
SELECT cid, sid, gpa FROM (
    SELECT e.cid, s.sid, s.gpa, RANK() OVER (PARTITION BY e.cid ORDER BY s.gpa DESC) AS rnk
    FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
) AS ranked WHERE rnk = 1;

-- 6. Compute a running count of enrollments ordered by sid.
SELECT sid, cid, COUNT(*) OVER (ORDER BY sid ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_count
FROM enrolled;

-- 7. For each enrollment, show the prev student's grade within the same course (LAG).
SELECT cid, sid, grade, LAG(grade, 1) OVER (PARTITION BY cid ORDER BY sid) AS prev_grade
FROM enrolled;

-- 8. Show each student's GPA and the GPA of the student immediately above (LEAD).
SELECT name, gpa, LEAD(gpa, 1) OVER (ORDER BY gpa DESC) AS next_lower_gpa FROM student;

-- 9. Assign NTILE(3) buckets to all students ordered by GPA.
SELECT name, gpa, NTILE(3) OVER (ORDER BY gpa DESC) AS bucket FROM student;

-- 10. Compute cumulative sum of GPAs ordered by sid.
SELECT sid, gpa, SUM(gpa) OVER (ORDER BY sid ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_gpa
FROM student;

-- 11. For each course, show each student's GPA vs course avg GPA difference.
SELECT e.cid, s.name, s.gpa, s.gpa - AVG(s.gpa) OVER (PARTITION BY e.cid) AS diff_from_avg
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid;

-- 12. Find courses where the top-ranked student (best grade) has GPA > 3.8.
SELECT cid FROM (
    SELECT e.cid, s.gpa, RANK() OVER (PARTITION BY e.cid ORDER BY e.grade ASC) AS rnk
    FROM enrolled AS e JOIN student AS s ON e.sid = s.sid
) AS ranked WHERE rnk = 1 AND gpa > 3.8;

-- 13. For each enrollment, show FIRST_VALUE of student name ordered by grade per course.
SELECT e.cid, s.name, e.grade,
       FIRST_VALUE(s.name) OVER (PARTITION BY e.cid ORDER BY e.grade ASC) AS top_student
FROM enrolled AS e JOIN student AS s ON e.sid = s.sid;
```

---

## L5-7. Query Optimization & EXPLAIN

```sql
-- View the query plan (what the optimizer will do)
EXPLAIN SELECT * FROM student WHERE gpa > 3.8;

-- View plan WITH actual execution stats (PostgreSQL)
EXPLAIN ANALYZE SELECT * FROM student WHERE gpa > 3.8;

-- Things to look for in EXPLAIN output:
-- Seq Scan    → full table scan (consider adding an index)
-- Index Scan  → using an index (good!)
-- Hash Join   → joining via hash table
-- Nested Loop → joining via loop (can be slow on large tables)
-- Cost        → estimated cost units (lower is better)
-- Rows        → estimated rows returned
```

> [!tip] If you see a `Seq Scan` on a large table in a WHERE or JOIN, consider adding an index on that column.

---

## L5-8. Partitioning & Advanced Indexing

### Table Partitioning (PostgreSQL)

```sql
-- Range partitioning: split table by GPA range
CREATE TABLE student_partitioned (
    sid  INT,
    name VARCHAR,
    gpa  FLOAT
) PARTITION BY RANGE (gpa);

CREATE TABLE student_low  PARTITION OF student_partitioned FOR VALUES FROM (0.0) TO (2.0);
CREATE TABLE student_mid  PARTITION OF student_partitioned FOR VALUES FROM (2.0) TO (3.5);
CREATE TABLE student_high PARTITION OF student_partitioned FOR VALUES FROM (3.5) TO (4.01);
```

### Composite and Covering Indexes

```sql
-- Composite index: speeds up queries filtering on both columns
CREATE INDEX idx_enrolled_cid_grade ON enrolled(cid, grade);

-- Covering index: index includes all columns needed by the query
-- (avoids going back to the table at all)
CREATE INDEX idx_student_covering ON student(gpa, name, sid);

-- Partial index: only index rows matching a condition
CREATE INDEX idx_high_gpa ON student(gpa) WHERE gpa >= 3.8;
```

---

## L5-9. Output Redirection

```sql
-- Create a new table from a query result
CREATE TABLE CourseIds AS SELECT DISTINCT cid FROM enrolled;

-- Insert query results into an existing table
INSERT INTO CourseIds (SELECT DISTINCT cid FROM enrolled);

-- Temporary table (dropped automatically when session ends)
CREATE TEMP TABLE CourseIds AS SELECT DISTINCT cid FROM enrolled;
```

---

## L5-10. Output Control (ORDER BY, LIMIT, OFFSET)

```sql
-- Sort and limit
SELECT * FROM student ORDER BY gpa DESC LIMIT 10;

-- Pagination: page 2 of 10 results per page
SELECT * FROM student ORDER BY sid LIMIT 10 OFFSET 10;

-- SQL Standard syntax
SELECT * FROM student ORDER BY gpa DESC FETCH FIRST 5 ROWS ONLY;

-- WITH TIES: include tied rows at the boundary
SELECT * FROM student ORDER BY gpa DESC FETCH FIRST 3 ROWS WITH TIES;
```

---

# ═══════════════════════════════════════
# QUICK REFERENCE
# ═══════════════════════════════════════

## Construct Comparison

| Feature | Subquery | CTE | Lateral Join | Window Function |
|---|---|---|---|---|
| Reusability in same query | ❌ | ✅ | ❌ | N/A |
| Row-level output | ❌ | ❌ | ✅ | ✅ |
| Multiple derived columns | Needs multiples | One per CTE | ✅ | ✅ multiple OVER |
| Recursion | ❌ | ✅ WITH RECURSIVE | ❌ | ❌ |
| Ranking / Running totals | ❌ Awkward | ❌ Awkward | ❌ Awkward | ✅ Purpose-built |
| Readability | Poor at >2 levels | ✅ Excellent | Moderate | Moderate |

## String Functions by Database

| Function | PostgreSQL | MySQL | SQLite | MSSQL |
|---|---|---|---|---|
| Concat | `\|\|` or `CONCAT()` | `CONCAT()` | `\|\|` | `+` |
| Regex | `~` (POSIX) | `REGEXP` | `REGEXP` | `LIKE` only |
| Substring | `SUBSTRING(s,b,e)` | `SUBSTRING(s,b,e)` | `SUBSTR(s,b,e)` | `SUBSTRING(s,b,e)` |
| Length | `LENGTH()` | `LENGTH()` | `LENGTH()` | `LEN()` |

## Logical Execution Order

```
FROM / JOIN   → tables assembled
WHERE         → rows filtered
GROUP BY      → rows grouped
HAVING        → groups filtered
SELECT        → output computed
ORDER BY      → results sorted
LIMIT/OFFSET  → results trimmed
```

---

## ✅ Master Checklist

- [ ] Write basic SELECT / WHERE / ORDER BY / LIMIT queries
- [ ] INSERT, UPDATE, DELETE with proper WHERE clauses
- [ ] Use all JOIN types: INNER, LEFT, RIGHT, FULL, CROSS, SELF
- [ ] Aggregate functions: COUNT, SUM, AVG, MIN, MAX
- [ ] GROUP BY + HAVING for grouped filtering
- [ ] DISTINCT for deduplication
- [ ] CASE WHEN for conditional logic
- [ ] UNION, INTERSECT, EXCEPT for set operations
- [ ] String functions: UPPER, LOWER, LIKE, SUBSTRING, REPLACE, LENGTH
- [ ] Date functions: CURRENT_DATE, EXTRACT, DATE_TRUNC, INTERVAL
- [ ] Normalization: 1NF, 2NF, 3NF
- [ ] Indexes: CREATE INDEX, composite, covering, partial
- [ ] Constraints: PK, FK, UNIQUE, NOT NULL, CHECK, DEFAULT
- [ ] Transactions: BEGIN, COMMIT, ROLLBACK, SAVEPOINT, ACID
- [ ] Views and Materialized Views
- [ ] Subqueries: IN, NOT IN, EXISTS, NOT EXISTS, ANY, ALL
- [ ] Lateral Joins for per-row derived values
- [ ] CTEs with WITH and WITH RECURSIVE
- [ ] Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE
- [ ] EXPLAIN / EXPLAIN ANALYZE for query optimization
- [ ] GROUPING SETS, ROLLUP, CUBE for multi-level aggregation
- [ ] Partitioning and advanced indexing strategies

---

*Sources: CMU 15-445/645 Database Systems Lecture #02 — Modern SQL · Andy Pavlo · Fall 2025*
*Extended with Level 1–3 foundational content for complete SQL learning roadmap*