### **1. QueryRow vs. QueryRowContext**

- Both `QueryRow` and `QueryRowContext` are used when you expect **a single row of data** from the database.
- The difference lies in **context handling**.

#### **When to use `QueryRow`:**

- Use `QueryRow` if **you don't need cancellation or timeouts** for the query execution.
- Example:
    
    ```go
    row := db.QueryRow("SELECT name FROM users WHERE id = $1", userID)
    var name string
    if err := row.Scan(&name); err != nil {
        log.Println("Error scanning:", err)
    }
    ```
    
- Suitable for **simple, quick queries** in non-critical parts of your application.

#### **When to use `QueryRowContext`:**

- Use `QueryRowContext` if **you need to respect deadlines or handle cancellations**.
- Example:
    
    ```go
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()
    
    row := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", userID)
    var name string
    if err := row.Scan(&name); err != nil {
        log.Println("Error scanning:", err)
    }
    ```
    
- **Why use `QueryRowContext`?**
    - It ensures that your query respects the context’s timeout/cancellation, preventing resource leaks and hanging database calls.
    - Use it in **web servers, APIs, or critical systems** where you want the database operation to stop if the user cancels a request or a timeout occurs.

---

### **2. Exec vs. ExecContext**

- Both `Exec` and `ExecContext` are used when you **don't expect any rows to be returned** (e.g., `INSERT`, `UPDATE`, `DELETE`).

#### **When to use `Exec`:**

- Use `Exec` if **you don’t care about cancellations or timeouts**.
- Example:
    
    ```go
    result, err := db.Exec("UPDATE users SET name = $1 WHERE id = $2", "Alice", userID)
    if err != nil {
        log.Println("Error executing query:", err)
    }
    rowsAffected, _ := result.RowsAffected()
    fmt.Printf("Rows updated: %d\n", rowsAffected)
    ```
    

#### **When to use `ExecContext`:**

- Use `ExecContext` if **you want the query to honor context deadlines or cancellations**.
- Example:
    
    ```go
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()
    
    result, err := db.ExecContext(ctx, "DELETE FROM users WHERE inactive = TRUE")
    if err != nil {
        log.Println("Error executing query:", err)
    }
    rowsDeleted, _ := result.RowsAffected()
    fmt.Printf("Rows deleted: %d\n", rowsDeleted)
    ```
    
- **Why use `ExecContext`?**
    - Useful in production-grade systems to ensure that long-running `INSERT` or `UPDATE` queries don’t block indefinitely.
    - Always use in web APIs or services with SLAs where timely responses are critical.

---

### **3. Query vs. QueryContext**

- Both are used when you expect **multiple rows** to be returned.

#### **When to use `Query`:**

- Use `Query` if **context or cancellation is not a concern**.
- Example:
    
    ```go
    rows, err := db.Query("SELECT id, name FROM users")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()
    
    for rows.Next() {
        var id int
        var name string
        if err := rows.Scan(&id, &name); err != nil {
            log.Fatal(err)
        }
        fmt.Printf("ID: %d, Name: %s\n", id, name)
    }
    ```
    

#### **When to use `QueryContext`:**

- Use `QueryContext` if you **want the query to honor a context’s deadline or cancellation**.
- Example:
    
    ```go
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    rows, err := db.QueryContext(ctx, "SELECT id, name FROM users WHERE active = TRUE")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()
    
    for rows.Next() {
        var id int
        var name string
        if err := rows.Scan(&id, &name); err != nil {
            log.Fatal(err)
        }
        fmt.Printf("ID: %d, Name: %s\n", id, name)
    }
    ```
    
- **Why use `QueryContext`?**
    - To handle long-running queries that might hang or block due to database issues or network latency.
    - To make the query respond to user-triggered cancellations or server timeouts.

---

### **General Rules for Contextual Methods**

- **Always use `QueryContext`, `ExecContext`, and `QueryRowContext` for production code.**
    - Contextual methods are safer and more robust.
    - They make your code resilient to unexpected delays or cancellations.
- **Use non-contextual methods only for quick experiments, scripts, or small-scale projects** where query timeouts or cancellations are not a concern.

---

### **Advanced Example: Transactions with Context**

Here's an example combining transactions, contextual queries, and error handling:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
if err != nil {
    log.Fatal("Failed to start transaction:", err)
}

var balance int
if err := tx.QueryRowContext(ctx, "SELECT balance FROM accounts WHERE id = $1 FOR UPDATE", accountID).Scan(&balance); err != nil {
    tx.Rollback()
    log.Fatal("Failed to query balance:", err)
}

if balance < 100 {
    tx.Rollback()
    log.Println("Insufficient funds")
    return
}

_, err = tx.ExecContext(ctx, "UPDATE accounts SET balance = balance - 100 WHERE id = $1", accountID)
if err != nil {
    tx.Rollback()
    log.Fatal("Failed to deduct balance:", err)
}

if err := tx.Commit(); err != nil {
    log.Fatal("Failed to commit transaction:", err)
}
```

### **Summary Table**

| **Method**        | **Use Case**                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `QueryRow`        | For a single-row query without needing cancellation or timeouts.                            |
| `QueryRowContext` | For a single-row query where cancellation or timeout is important.                          |
| `Query`           | For multiple-row queries when you don’t care about context.                                 |
| `QueryContext`    | For multiple-row queries with deadlines or cancellation needs.                              |
| `Exec`            | For non-returning queries (e.g., `INSERT`, `UPDATE`, `DELETE`) when context isn’t required. |
| `ExecContext`     | For non-returning queries with cancellation or timeout handling.                            |
| `Begin`           | To start a transaction without context.                                                     |
| `BeginTx`         | To start a transaction with context and options like isolation levels.                      |
