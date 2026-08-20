
**Course:** 15-445/645 Database Systems (Fall 2025) | Carnegie Mellon University | Andy Pavlo
**Source:** https://15445.courses.cs.cmu.edu/fall2025/

---

## 1. Databases vs. DBMS
- A **database** is an organized collection of inter-related data that models some aspect of the real world (e.g., a digital music store or students in a class).
- A **Database Management System (DBMS)** is the software that manages the database (e.g., MySQL, Oracle, MongoDB, Snowflake). It is responsible for inserting, deleting, and retrieving data.

---

## 2. Flat File Strawman
Imagine storing data for a music app like Spotify using flat comma-separated value (CSV) files (`artists.csv`, `albums.csv`) managed by the application itself.

**Issues with Flat Files:**
- **Data Integrity:** How do we ensure consistency? What if someone enters an invalid year or deletes an artist who still has albums?
- **Implementation:** Finding specific records requires parsing the entire file. Sharing the database across multiple applications or machines is difficult. Concurrent thread writes can corrupt the file.
- **Durability:** What happens if the machine crashes mid-update? Replicating data for high availability is extremely complex.

---

## 3. Database Management System (DBMS)
A **general-purpose DBMS** allows the definition, creation, querying, update, and administration of databases in accordance with a specific **data model**.

- **Data Model:** A collection of concepts for describing data. Defines the rules for data types and relationships.
- **Schema:** A description of a particular collection of data using a given data model (the structural blueprint).

### Common Data Models
- **Relational** (Most common)
- **NoSQL:** Key/Value, Document, Graph, Wide-Column
- **Array / Matrix / Vector** (Machine Learning)
- **Legacy:** Hierarchical, Network, Multi-Value

### Early DBMSs (1960s)
Early systems (e.g., IDS, IMS, CODASYL) required developers to write queries using **procedural code**.
- Developers had to manually code loops to traverse data and choose execution ordering based on current data.
- **Problem:** If the physical data layout or size changed, the hard-coded queries became inefficient or invalid, forcing developers to rewrite their code constantly.

---

## 4. The Relational Model
Proposed by **Ted Codd** (IBM Research, 1969) to solve the problem of rewriting queries whenever the physical storage changed.

It defines three core concepts:
1. **Structure:** The definition of relations and their contents, completely independent of physical representation.
2. **Integrity:** Ensuring the database contents satisfy specific constraints (e.g., age cannot be negative).
3. **Manipulation:** A declarative API for accessing and modifying data via relations (sets). Programmers specify *what* they want, and the DBMS decides *how* to get it.

### Data Independence
The relational model isolates the user/application from low-level data representation. The DBMS optimizes the layout and access paths based on the environment and workload, and automatically re-optimizes if things change. 

### Key Terminology
- **Relation (Table):** An unordered set of relationships representing entities. Duplicates are allowed only if the primary key differs.
- **Tuple (Row):** A set of attribute values in the relation. Values can be scalar or nested. **NULL** signifies an undefined value.
- **n-ary Relation:** A relation with *n* attributes (a table with *n* columns).
- **Primary Key:** Uniquely identifies a single tuple. Can be auto-generated (Identity Column).
- **Foreign Key:** An attribute that maps to a tuple in another relation (usually pointing to its primary key).
- **Constraint:** A user-defined condition that must hold true (e.g., Unique Key, Foreign Key, NOT NULL).

---

## 5. Data Manipulation Languages (DMLs)
DML is the API exposed by the DBMS to store and retrieve data.

- **Procedural:** The query specifies the exact high-level execution strategy (e.g., "Use a for loop to scan all records and count them").
- **Non-Procedural (Declarative):** The query specifies *only what data is wanted*, not how to find it (e.g., `SELECT COUNT(*) FROM artist`). SQL is a declarative language.

---

## 6. Relational Algebra
A set of fundamental operations to retrieve and manipulate tuples. Operators take one or more relations as input and output a new relation. They can be chained together.
# Database Systems — Complete Notes

> [!info] Overview
> Foundations of Database Systems — covering the Relational Model, Data Models, Relational Algebra, and modern alternatives like Document and Vector databases. Based on CMU 15-445/645 Database Systems (Fall 2025).

---

## 1. Fundamentals

> [!note] What is a Database?
> An **organized collection of inter-related data** that models some aspect of the real world (e.g., a digital music store tracking artists and albums). Databases are the **core component** of most computer applications.

> [!note] What is a DBMS?
> A **Database Management System (DBMS)** is software that allows applications to store and analyze information in a database. It handles **definition, creation, querying, update, and administration** of databases.
> - Examples: MySQL, Oracle, MongoDB, Snowflake, PostgreSQL

> [!warning] Common Confusion
> People often confuse "databases" with "database management systems". A **database** is the data itself. A **DBMS** is the software that manages it.

---

## 2. Flat File Strawman (Why Not CSV?)

Store data as comma-separated value (CSV) files managed manually in application code — one file per entity.

```
Artist(name, year, country)
"Wu-Tang Clan", 1992, "USA"
"Notorious BIG", 1992, "USA"
"GZA", 1990, "USA"

Album(name, artist, year)
"Enter the Wu-Tang", "Wu-Tang Clan", 1993
"Liquid Swords", "GZA", 1995
```

**Example query — "Get the year GZA went solo":**

```python
for line in file.readlines():
    record = parse(line)
    if record[0] == "GZA":
        print(int(record[1]))
```

> [!important] Three Core Problems with Flat Files

### Problem 1 — Data Integrity
- How do we ensure the artist is the **same** for each album entry?
- What if somebody overwrites the album year with an **invalid string**?
- What if there are **multiple artists** on an album?
- What happens if we **delete an artist** that still has albums?

### Problem 2 — Implementation
- How do you **find a particular record** efficiently?
- What if a new application on a **different machine** needs the same data?
- What if **two threads** try to write to the same file simultaneously?

### Problem 3 — Durability
- What if the machine **crashes** while updating a record?
- What if we want to **replicate** the database across multiple machines for high availability?

---

## 3. Data Models

> [!note] What is a Data Model?
> A **data model** is a collection of concepts for describing the data in a database — rules defining what types of things exist and how they relate.

> [!note] What is a Schema?
> A **schema** is a description of a particular collection of data using a given data model. It defines the **structure** of the database. Without a schema, you have random bits with no meaning.

### Common Data Models

| Data Model | Category | Use Case |
|---|---|---|
| **Relational** | Traditional | Most DBMSs — structured tabular data |
| **Key/Value** | NoSQL | Simple apps, caching (Redis) |
| **Graph** | NoSQL | Social networks, relationships |
| **Document / JSON / XML** | NoSQL | Hierarchical, nested records |
| **Wide-Column / Column-family** | NoSQL | Time-series, analytics (Cassandra) |
| **Array / Matrix / Vector** | ML/Science | Machine learning embeddings |
| **Hierarchical** | Legacy | Obsolete/rare |
| **Network** | Legacy | Obsolete/rare |

> [!tip] Focus Area
> This course focuses primarily on the **Relational Model** — the most widely used data model in production systems today.

---

## 4. Early Database Systems

> [!note] The Problem with Early DBMSs
> In the late 1960s, early DBMSs (IDS, IMS, CODASYL) required developers to write queries using **procedural code**. The developer had to manually choose access paths and execution ordering based on current database contents.

**Early procedural query (CODASYL style) — "Get artists on an album":**

```
PROCEDURE GET_ARTISTS_FOR_ALBUM;
BEGIN
  FIND ALBUM USING ALBUM.NAME = "Mooshoo Tribute"
    ON ERROR DISPLAY "Album not found" AND EXIT;
  FIND FIRST APPEARS WITHIN APPEARS_ALBUM OF ALBUM_RECORD
    ON ERROR DISPLAY "No artists found" AND EXIT;
  REPEAT
    FIND OWNER WITHIN ARTIST_APPEARS OF APPEARS_RECORD
      ON ERROR DISPLAY "Error finding artist";
    DISPLAY ARTIST_RECORD.NAME;
    FIND NEXT APPEARS WITHIN APPEARS_ALBUM OF ALBUM_RECORD
      ON ERROR EXIT;
  END REPEAT;
END PROCEDURE;
```

**The same query in modern SQL:**

```sql
SELECT ARTIST.NAME
  FROM ARTIST, APPEARS, ALBUM
 WHERE ARTIST.ID = APPEARS.ARTIST_ID
   AND APPEARS.ALBUM_ID = ALBUM.ID
   AND ALBUM.NAME = "Mooshoo Tribute"
```

> [!warning] Key Problem
> If the **database structure changes**, the developer must **rewrite all query code** from scratch. The execution plan is hard-coded — queries become inefficient or invalid as data grows or changes.

---

## 5. Relational Model

Ted Codd at IBM Research (1969) proposed the relational model to solve the problem of rewriting DBMSs every time the physical layer changed.

> [!note] Three Core Concepts of the Relational Model

### Structure
Definition of relations and their contents **independent of physical representation**. Each relation has a set of attributes, each with a domain of values.

### Integrity
Ensure the database contents satisfy certain **constraints** at all times (e.g., age cannot be negative, year must be > 1900).

### Manipulation
A **declarative API** for accessing and modifying data via relations. Programmers specify *what* they want — the DBMS decides *how* to get it.

---

### Key Relational Concepts

> [!note] Relation
> An **unordered set** containing the relationship of attributes that represent entities. Since relations are unordered, the DBMS can store and optimize them freely.

> [!note] Tuple
> A **set of attribute values** (its domain) in the relation. Values are normally atomic/scalar. The special value `NULL` is a member of every domain (if allowed).

```
Artist(id, name, year, country)

id  | name           | year | country
----|----------------|------|--------
101 | Wu-Tang Clan   | 1992 | USA
102 | Notorious BIG  | 1992 | USA
103 | GZA            | 1990 | USA
```

---

### Primary Keys

> [!note] Primary Key
> A relation's **primary key uniquely identifies a single tuple**. Some DBMSs auto-create an internal primary key if none is defined.

**Auto-generation options by DBMS:**

| DBMS | Keyword |
|---|---|
| SQL Standard | `IDENTITY` |
| PostgreSQL / Oracle | `SEQUENCE` |
| MySQL | `AUTO_INCREMENT` |

---

### Foreign Keys

> [!note] Foreign Key
> A **foreign key** specifies that an attribute from one relation maps to a tuple in another relation — typically pointing to a primary key in another table.

```
Artist(id, name, year, country)        Album(id, name, year)
id  | name           | year | country  id | name              | year
101 | Wu-Tang Clan   | 1992 | USA      11 | Enter the Wu-Tang | 1993
102 | Notorious BIG  | 1992 | USA      22 | St.Ides Mix Tape  | 1994
103 | GZA            | 1990 | USA      33 | Liquid Swords     | 1995

ArtistAlbum(artist_id, album_id)   ← junction table for many-to-many
artist_id | album_id
101       | 11
101       | 22
103       | 22
102       | 22
```

---

### Constraints

> [!note] Constraints
> **User-defined conditions** that must hold for any instance of the database. The DBMS prevents any modification that would violate a constraint.

```sql
CREATE TABLE Artist (
  name    VARCHAR NOT NULL,
  year    INT,
  country CHAR(60),
  CHECK (year > 1900)
);

-- Global assert (SQL:92 — rarely used, too slow)
CREATE ASSERTION myAssert CHECK ( <SQL> );
```

**Most common constraint types:**
- `NOT NULL` — attribute cannot be null
- `UNIQUE` / Primary Key — no duplicate values
- `FOREIGN KEY` — referential integrity between tables
- `CHECK` — custom condition per tuple

---

## 6. Data Independence

> [!note] What is Data Independence?
> Isolating the user/application from **low-level data representation**. The user only worries about high-level application logic. The DBMS optimizes storage layout based on operating environment, database contents, and workload — and re-optimizes when these factors change.

```
Application       Application
     ↕                 ↕
External Schema   External Schema    ← Views (SQL)
          ↕
     Logical Schema                  ← Schema, Constraints (SQL)
          ↕
    Physical Schema                  ← Pages, Files, Extents...
          ↕
       Storage
```

> [!tip] Why This Matters
> A change in the **physical data layout** (e.g., adding an index, changing storage format) does **not** break any application code. The DBMS handles the translation transparently.

---

## 7. Data Manipulation Languages (DML)

The API a DBMS exposes to applications for storing and retrieving data.

| Type | Description | Example |
|---|---|---|
| **Procedural** | Specifies *how* to find the result — explicit execution strategy | Relational Algebra, early CODASYL |
| **Non-Procedural (Declarative)** | Specifies *what* data is wanted, not *how* to find it | SQL |

```sql
-- Declarative (SQL) — just say what you want
SELECT year FROM artists WHERE name = 'GZA';

-- vs. Procedural (Python flat file) — manually describe every step
for line in file.readlines():
    record = parse(line)
    if record[0] == "GZA":
        print(int(record[1]))
```

> [!important] Key Insight
> SQL is the **de facto standard** for relational DBMSs because it is declarative. The user does not need to know anything about internals — the DBMS's **query optimizer** finds the best execution plan automatically.

---

## 8. Relational Algebra

> [!note] What is Relational Algebra?
> A set of **fundamental operations** to retrieve and manipulate tuples in a relation. Each operator takes one or more relations as input and outputs a new relation. Operators can be **chained** together to build complex queries.

| Operator | Symbol | SQL Equivalent |
|---|---|---|
| Select | `σ` | `WHERE` |
| Projection | `π` | `SELECT` (columns) |
| Union | `∪` | `UNION` |
| Intersection | `∩` | `INTERSECT` |
| Difference | `−` | `EXCEPT` |
| Product | `×` | `CROSS JOIN` |
| Join | `⋈` | `JOIN` |

---

### σ — Select

Choose a **subset of tuples** satisfying a selection predicate. Can combine multiple predicates using conjunctions (`∧`) and disjunctions (`∨`).

**Syntax:** `σ predicate(R)`

```
Input R(a_id, b_id):         σ a_id='a2'(R):      σ a_id='a2' ∧ b_id>102(R):
a_id | b_id                  a_id | b_id           a_id | b_id
a1   | 101                   a2   | 102             a2   | 103
a2   | 102                   a2   | 103
a2   | 103
a3   | 104
```

```sql
SELECT * FROM R WHERE a_id = 'a2' AND b_id > 102;
```

---

### π — Projection

Generate a relation with tuples containing **only specified attributes**. Can rearrange ordering, remove attributes, or create derived (computed) attributes.

**Syntax:** `π A1, A2, ..., An(R)`

```
π b_id-100, a_id(σ a_id='a2'(R)):
b_id-100 | a_id
2        | a2
3        | a2
```

```sql
SELECT b_id - 100, a_id FROM R WHERE a_id = 'a2';
```

---

### ∪ — Union

Generate a relation containing all tuples that appear in **either or both** input relations (duplicates eliminated). Both relations must have the **same attributes**.

**Syntax:** `(R ∪ S)`

```
R(a_id, b_id):    S(a_id, b_id):    (R ∪ S):
a1 | 101          a3 | 103           a1 | 101
a2 | 102          a4 | 104           a2 | 102
a3 | 103          a5 | 105           a3 | 103
                                     a4 | 104
                                     a5 | 105
```

```sql
(SELECT * FROM R) UNION (SELECT * FROM S);
```

---

### ∩ — Intersection

Generate a relation containing only tuples that appear in **both** input relations. Both relations must have the **same attributes**.

**Syntax:** `(R ∩ S)`

```
R(a_id, b_id):    S(a_id, b_id):    (R ∩ S):
a1 | 101          a3 | 103           a3 | 103
a2 | 102          a4 | 104
a3 | 103          a5 | 105
```

```sql
(SELECT * FROM R) INTERSECT (SELECT * FROM S);
```

---

### − — Difference

Generate a relation containing tuples that appear in the **first but not the second** relation. Both relations must have the **same attributes**.

**Syntax:** `(R − S)`

```
R(a_id, b_id):    S(a_id, b_id):    (R − S):
a1 | 101          a3 | 103           a1 | 101
a2 | 102          a4 | 104           a2 | 102
a3 | 103          a5 | 105
```

```sql
(SELECT * FROM R) EXCEPT (SELECT * FROM S);
```

---

### × — Product

Generate a relation with **all possible combinations** of tuples from both input relations. Input relations do not need the same attributes.

**Syntax:** `(R × S)`

```
R(a_id, b_id) × S(a_id, b_id)  →  9 rows (3 × 3):
R.a_id | R.b_id | S.a_id | S.b_id
a1     | 101    | a3     | 103
a1     | 101    | a4     | 104
a1     | 101    | a5     | 105
a2     | 102    | a3     | 103
...
```

```sql
SELECT * FROM R CROSS JOIN S;
-- or simply:
SELECT * FROM R, S;
```

---

### ⋈ — Join

Generate a relation containing all tuples that are a **combination of two tuples** (one from each relation) with **common values** for shared attributes.

**Syntax:** `(R ⋈ S)`

```
R(a_id, b_id):    S(a_id, b_id, val):    (R ⋈ S):
a1 | 101          a3 | 103 | XXX          a_id | b_id | val
a2 | 102          a4 | 104 | YYY          a3   | 103  | XXX
a3 | 103          a5 | 105 | ZZZ
```

```sql
SELECT * FROM R NATURAL JOIN S;
SELECT * FROM R JOIN S USING (a_id, b_id);
SELECT * FROM R JOIN S ON R.a_id = S.a_id AND R.b_id = S.b_id;
```

---

### Extra Operators

| Operator | Symbol | Purpose |
|---|---|---|
| Rename | `ρ` | Rename relation or attributes |
| Assignment | `R ← S` | Assign result of expression to a variable |
| Duplicate Elimination | `δ` | Remove duplicate tuples |
| Aggregation | `γ` | Compute aggregate values (SUM, COUNT, AVG…) |
| Sorting | `τ` | Order tuples by attribute(s) |
| Division | `R ÷ S` | Find tuples in R associated with all tuples in S |

---

### Query Optimization Observation

> [!important] Order Matters in Relational Algebra
> Relational algebra defines an **explicit ordering** of steps. Two expressions can produce the same result but with **vastly different performance**.

```
σ b_id=102(R ⋈ S)         — Join first, then filter → expensive if R and S are large
(R ⋈ (σ b_id=102(S)))     — Filter S first, then join → much cheaper if only 1 row matches
```

> [!tip] Why SQL is Better
> SQL (declarative) lets you state *what* you want. The DBMS's **query optimizer** automatically picks the best relational algebra expression to execute — you never need to think about this manually.

---

## 9. Document Data Model

> [!note] What is the Document Model?
> A collection of record documents containing a **hierarchy of named field/value pairs**. A field's value can be a scalar, an array, or a nested document. Modern implementations use **JSON**; older systems use XML or custom objects.

**Key motivation — avoid object-relational impedance mismatch** by tightly coupling application objects with database records.

```json
{
  "name": "GZA",
  "year": 1990,
  "albums": [
    { "name": "Liquid Swords",       "year": 1995 },
    { "name": "Beneath the Surface", "year": 1999 }
  ]
}
```

**Equivalent relational model requires 3 separate tables + joins:**

```
Artist(id, …)  ⋈  ArtistAlbum(artist_id, album_id)  ⋈  Album(id, …)
```

> [!warning] Document Model Still Has Problems
> The document model avoids some relational complexity but still runs into many of the same flat-file issues — data integrity, duplication, and complex cross-document queries remain challenging.

---

## 10. Vector Data Model

> [!note] What is the Vector Model?
> **One-dimensional arrays** used for **nearest-neighbor (NN) search** — exact or approximate. Used for semantic search on embeddings generated by ML-trained transformer models (e.g., ChatGPT, OpenAI).

**How it works:**

```
Album(id, name, year, lyrics)
  ↓  Transformer model
Embeddings:
  Id1 → [0.32, 0.78, 0.30, ...]   ← "Enter the Wu-Tang"
  Id2 → [0.99, 0.19, 0.81, ...]   ← "Run the Jewels 2"
  Id3 → [0.01, 0.18, 0.85, ...]   ← "Liquid Swords"
  Id4 → [0.19, 0.82, 0.24, ...]   ← "We Got It from Here"
        ↓
     Vector Index (HNSW / IVFFlat)
        ↓
Query: "albums with lyrics about running from the police"
  → converted to query vector [0.02, 0.10, 0.24, ...]
  → NN search returns ranked list of IDs
```

**Combined query (vector + relational filter):**
```
Query: "albums about running from the police AND released after 2005"
  → Vector NN search  +  year > 2005 filter
```

### Vector Index Technologies

| Tool | Type |
|---|---|
| Meta FAISS | Library |
| Spotify Annoy | Library |
| Microsoft DiskANN | Library |
| HNSW / IVFFlat | Index algorithms |
| pgvector | PostgreSQL extension |

> [!note] Vector DBMSs vs Traditional DBMSs
> The vector model is **not a major architectural departure** from existing models. Every major DBMS now provides **native vector index support**. Dedicated vector DBMSs (Pinecone, Weaviate, Qdrant) offer better integration with AI tooling (LangChain, OpenAI).

---

## 11. Quick Comparison — Data Models

| Model | Structure | Best For | Example Systems |
|---|---|---|---|
| **Relational** | Tables + rows | General-purpose structured data | PostgreSQL, MySQL, Oracle |
| **Key/Value** | Key → Value pairs | Caching, simple lookups | Redis, DynamoDB |
| **Document** | JSON/XML documents | Nested, hierarchical records | MongoDB, Couchbase |
| **Graph** | Nodes + edges | Relationship-heavy data | Neo4j, Amazon Neptune |
| **Wide-Column** | Column families | Time-series, analytics | Cassandra, HBase |
| **Vector** | Embedding arrays | Semantic / similarity search | Pinecone, pgvector |

---

## 12. Summary & Key Takeaways

> [!success] Core Concepts Checklist
> - **Database** = organized, inter-related data modeling a real-world aspect
> - **DBMS** = software managing definition, creation, querying, and admin of a database
> - **Flat files fail** on data integrity, implementation complexity, and durability
> - **Relational model** = Structure + Integrity + Manipulation (declarative)
> - **Schema** = structure definition for a data model; without it, data is meaningless
> - **Primary key** = uniquely identifies one tuple; **Foreign key** = maps to another relation
> - **Data independence** = application logic is isolated from physical storage changes
> - **Relational algebra** = the formal foundation behind SQL query execution
> - **SQL is declarative** — the DBMS query optimizer picks the best execution plan
> - **Document model** embeds related data as nested JSON to reduce joins
> - **Vector model** enables semantic NN search — now native in most major DBMSs

> [!tip] Relational Algebra Operators — One-Line Summary
> - `σ` (Select) → filter rows by predicate
> - `π` (Projection) → keep only specified columns
> - `∪` (Union) → all rows from both relations
> - `∩` (Intersection) → rows in both relations
> - `−` (Difference) → rows in first but not second
> - `×` (Product) → every combination of rows
> - `⋈` (Join) → combine rows sharing common attribute values

---

*Sources: CMU 15-445/645 Database Systems (Fall 2025) · Andy Pavlo · Lecture #01: Relational Model & Algebra*
| Operator | Description | Syntax | SQL Equivalent |
| :--- | :--- | :--- | :--- |
| **Select** | Filters a subset of tuples that satisfy a predicate. | `σ_predicate(R)` | `SELECT * FROM R WHERE ...` |
| **Projection** | Outputs a relation with only specified attributes (columns). | `π_A1,A2(R)` | `SELECT A1, A2 FROM R` |
| **Union** | Outputs tuples appearing in at least one of two relations (must have exact same attributes). | `(R ∪ S)` | `... UNION ALL ...` |
| **Intersection**| Outputs tuples appearing in *both* relations. | `(R ∩ S)` | `... INTERSECT ...` |
| **Difference** | Outputs tuples in the first relation but *not* the second. | `(R - S)` | `... EXCEPT ...` |
| **Product** | Outputs all possible combinations of tuples from both relations (Cartesian product). | `(R × S)` | `CROSS JOIN` |
| **Join** | Outputs combined tuples where shared attributes match. | `(R ⋈ S)` | `JOIN S USING (A1)` |

### The Power of Declarative Queries (Query Optimization)
In relational algebra, `σ_b_id=102(R ⋈ S)` and `(R ⋈ (σ_b_id=102(S)))` produce the same result. However, filtering `S` *before* joining is significantly faster if `S` is massive. 
Because SQL is declarative, the **DBMS Query Optimizer** automatically figures out the most efficient execution plan (like filtering before joining) without the developer needing to know the internals.

---

## 7. Other Data Models

### Document Data Model
- Collection of record documents containing hierarchical named field/value pairs.
- Values can be scalars, arrays, or pointers. Modern systems use JSON (older used XML).
- Avoids some relational constraints but can suffer from flat-file-like integrity issues if not carefully managed.

### Vector Data Model
- Represents one-dimensional arrays used for Nearest-Neighbor (NN) search (exact or approximate).
- Essential for semantic search on Machine Learning embeddings (e.g., ChatGPT, LangChain).
- Uses specialized indexes for fast NN search.
- Modern relational DBMSs (like PostgreSQL with `pgvector`) are integrating vector capabilities directly into the relational model.