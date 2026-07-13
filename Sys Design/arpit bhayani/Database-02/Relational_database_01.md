# What is a Relational Database?

A **Relational Database** stores data in the form of tables, where the tables can be related to each other using keys.

Think of it like **Excel spreadsheets**, but much more powerful.

## Example: Users and Orders

### Users Table
| id | name | email |
|----|------|-------|
| 1 | Pravin | pravin@gmail.com |
| 2 | Rahul | rahul@gmail.com |

### Orders Table
| id | user_id | product |
|----|---------|---------|
| 101 | 1 | Laptop |
| 102 | 1 | Mouse |
| 103 | 2 | Keyboard |

### The Relationship

Notice: The **Orders** table has a column called `user_id` that refers to the `id` in the **Users** table.

```
Users
+----+--------+
| id | name   |
+----+--------+
| 1  | Pravin |
| 2  | Rahul  |
+----+--------+
        ▲
        │ user_id
        │
Orders
+-----+---------+----------+
| id  | user_id | product  |
+-----+---------+----------+
| 101 |    1    | Laptop   |
| 102 |    1    | Mouse    |
| 103 |    2    | Keyboard |
+-----+---------+----------+
```

**This relationship between tables is why it's called a Relational Database.**

---

## Why Do We Need Relationships?

### Problem: Storing Everything in One Table

| Order ID | User Name | Email | Product |
|----------|-----------|-------|---------|
| 101 | Pravin | pravin@gmail.com | Laptop |
| 102 | Pravin | pravin@gmail.com | Mouse |
| 103 | Pravin | pravin@gmail.com | Keyboard |

❌ **What happens if Pravin changes their email?**

You need to update **every row**. If you forget one, your data becomes **inconsistent**.

### Solution: Separate the Data

```
Users                    Orders
┌────────┐              ┌────────┐
│ Pravin │ ──────────→  │ Laptop │
│ Email  │              │ Mouse  │
└────────┘              │ Keyboard│
                        └────────┘
```

The user's information is stored **once**, and every order simply points to that user.

✅ **Much better!**

---

## What Does "Relation" Actually Mean?

Many people think "Relational" only means tables connected by foreign keys.

**That's not the original meaning.**

### In Relational Database Theory:

- **Relation** = a Table
- **Tuple** = a Row
- **Attribute** = a Column

So when we say **Relational Database**, we mean a database based on the **relational model**, where data is organized into relations (tables). Foreign keys are a common way to represent relationships between those tables.

---

## Example: Instagram

Imagine Instagram stored everything in one table:

| Username | Profile Picture | Followers | Posts | Comments | Likes |
|----------|-----------------|-----------|-------|----------|-------|

❌ **This creates massive data duplication.**

### Solution: Separate Into Multiple Tables

```
Users          Posts          Comments       Likes
──────────────────────────────────────────────────
id             id             id             user_id
username       user_id        post_id        post_id
email          caption        user_id
               ...            comment
                              ...
```

**Each table has a specific responsibility**, and they are connected through IDs.

---

## What Makes an RDBMS Powerful?

### 1. Relationships

You can connect tables.

```
Users
   │
Orders
   │
Payments
```

### 2. SQL

You can ask complex questions:

```sql
SELECT users.name, orders.product
FROM users
JOIN orders
ON users.id = orders.user_id;
```

**Output**

| name | product |
|------|---------|
| Pravin | Laptop |
| Pravin | Mouse |
| Rahul | Keyboard |

The database **combines information from multiple related tables**.

### 3. Data Integrity

Suppose someone tries to insert:

```sql
INSERT INTO orders(user_id, product)
VALUES (1000, 'Laptop');
```

But **there is no user with ID 1000**.

✅ If `user_id` is defined as a **foreign key**, the database **rejects the insert**.

This helps keep your data valid.

### 4. Transactions (ACID)

If you're transferring money between two bank accounts:

1. Deduct ₹100 from Account A
2. Add ₹100 to Account B

**Both steps must succeed together**, or neither should happen.

Relational databases support this through **transactions**.

---

## Real-World Examples of Relational Databases

Popular relational databases:

- **MySQL**
- **PostgreSQL**
- **Oracle Database**
- **Microsoft SQL Server**
- **SQLite**

All of them store data using the **relational model** and are queried using **SQL**.

---

## Why Are Relational Databases So Popular?

They are a great choice when your application has:

✅ **Well-defined data structures**

✅ **Relationships between different kinds of data**

✅ **A need for strong consistency**

✅ **Transactions that must be reliable** (banking, e-commerce, payments)

---

## One Thing to Remember

> A relational database is **not just "a database with tables."** Many databases use tables or table-like structures.
>
> A relational database **follows the relational model**, which organizes data into relations (tables), allows those relations to be connected logically, and provides mechanisms like keys, constraints, SQL, and transactions to maintain **correctness and consistency**.