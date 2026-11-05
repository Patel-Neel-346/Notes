---
title: HTTP & TCP Servers in Go
tags:
  - golang
  - networking
  - backend
  - tcp
  - http
  - concurrency
  - security
type: technical-note
status: active
---

# 🚀 HTTP & TCP Servers in Go

### Go Network Servers

- Go's standard library (`net` and `net/http`) provides production-grade, non-blocking I/O primitives powered by the Go runtime's internal network poller (integrated with Linux `epoll` / macOS `kqueue`).
- At the wire level, **HTTP/1.1** is a plain-text protocol defined by RFC 9112 where requests and responses share a structured grammar separated by `CRLF` (`\r\n`).
- In Go, each accepted connection is handled in its own lightweight goroutine (~2 KB initial stack), allowing thousands of concurrent connections with minimal memory overhead.
- Failing to set timeouts (`ReadTimeout`, `WriteTimeout`) on Go network servers leaves them vulnerable to **Slowloris DoS attacks** and socket leaks.

---

### 1. 📜 HTTP/1.1 Wire Protocol Anatomy

Every HTTP/1.1 message consists of 4 parts separated by carriage returns and line feeds:

```
┌────────────────────────────────────────────────────────┐
│ 1. Start Line (Request-Line or Status-Line)            │
│ 2. Headers (0 or more "Key: Value" lines)              │
│ 3. Empty Blank Line (CRLF `\r\n` marker)               │
│ 4. Optional Message Body (Payload data)                │
└────────────────────────────────────────────────────────┘
```

#### HTTP Request Structure
- **Grammar**: `Method SP Request-URI SP HTTP-Version CRLF`
- **Example**:
  ```http
  GET /api/v1/users HTTP/1.1\r\n
  Host: example.com\r\n
  User-Agent: curl/7.88.1\r\n
  Accept: application/json\r\n
  \r\n
  ```

#### HTTP Response Structure
- **Grammar**: `HTTP-Version SP Status-Code SP Reason-Phrase CRLF`
- **Example**:
  ```http
  HTTP/1.1 200 OK\r\n
  Content-Type: application/json; charset=utf-8\r\n
  Content-Length: 26\r\n
  Date: Thu, 05 Nov 2026 21:50:00 GMT\r\n
  \r\n
  {"status":"healthy"}
  ```

---

### 2. 🔌 Low-Level TCP Server in Go

A basic TCP listener accepts incoming TCP connections and spawns a dedicated goroutine per connection:

```go
package main

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"net"
	"time"
)

func handleConnection(conn net.Conn) {
	defer conn.Close()

	// ⚠️ Crucial: Set read/write deadlines to prevent slow connection leaks
	_ = conn.SetDeadline(time.Now().Add(10 * time.Second))

	reader := bufio.NewReader(conn)
	for {
		message, err := reader.ReadString('\n')
		if err != nil {
			if err != io.EOF {
				log.Printf("Connection error: %v\n", err)
			}
			return
		}

		fmt.Printf("Received: %s", message)
		_, _ = conn.Write([]byte(fmt.Sprintf("Echo: %s", message)))
	}
}

func main() {
	listener, err := net.Listen("tcp", ":3001")
	if err != nil {
		log.Fatalf("Failed to bind TCP port: %v\n", err)
	}
	defer listener.Close()

	log.Println("TCP server listening on :3001")

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Accept error: %v\n", err)
			continue
		}

		// Handle connection concurrently without blocking main accept loop
		go handleConnection(conn)
	}
}
```

---

### 3. 🌐 Production-Ready HTTP Server with Graceful Shutdown

> [!WARNING] **Never Use Default `http.ListenAndServe` in Production!**
> The default `http.ListenAndServe(":8080", nil)` uses `http.DefaultServer`, which has **no timeouts**. A slow client can hold a connection open indefinitely, starving your file descriptors.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"up"}`))
	})

	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,   // Max duration for reading entire request
		WriteTimeout: 10 * time.Second,  // Max duration for writing response
		IdleTimeout:  120 * time.Second, // Max time to keep idle keep-alive connections
	}

	// Channel to listen for OS interrupt signals
	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("HTTP server listening on %s\n", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v\n", err)
		}
	}()

	<-shutdownChan
	log.Println("Initiating graceful server shutdown...")

	// Allow pending in-flight requests 5 seconds to complete
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Graceful shutdown failed: %v\n", err)
	}

	log.Println("Server stopped cleanly.")
}
```

---

### 4. 🔐 Secure Password Hashing with Bcrypt

Bcrypt incorporates a salt and configurable work factor (cost) to protect stored passwords against rainbow tables and GPU brute-force attacks:

```go
package main

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a raw password using bcrypt with recommended default cost (10)
func HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedBytes), nil
}

// CheckPasswordHash compares a hashed password with its possible plaintext equivalent
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func main() {
	password := "mySuperSecurePassphrase!"

	hashed, err := HashPassword(password)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Bcrypt Hash:", hashed)

	// Verification
	match := CheckPasswordHash(password, hashed)
	fmt.Println("Password Matches?:", match) // true

	wrongMatch := CheckPasswordHash("wrongPassword", hashed)
	fmt.Println("Wrong Password Matches?:", wrongMatch) // false
}
```

---

### 5. 🚨 Common Production Traps

| Gotcha | Root Cause | Fix / Prevention |
| :--- | :--- | :--- |
| **FD Exhaustion** | Client connections never close and server has no `IdleTimeout`. | Set explicit `IdleTimeout` and `ReadTimeout` on `http.Server`. |
| **Response Body Leak** | Client code omits `defer resp.Body.Close()`. | Always close and drain response bodies to allow TCP connection reuse. |
| **Goroutine Leak on TCP** | Blocking read loop in connection handler never unblocks on dead peer. | Always enforce `conn.SetDeadline()` before blocking I/O calls. |
| **Low Bcrypt Cost** | Cost factor set below 10 allows quick offline GPU attacks. | Keep cost factor between 10–12 for modern server security. |
