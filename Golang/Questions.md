### Articles
- Intervew bit contains question for fresher and as well for experienced
	- https://www.interviewbit.com/golang-interview-questions/

---

### 🧠 **1. Go Language Internals & Advanced Topics**

- What are the exact semantics of `defer`, and how does it impact performance?
    
- How does Go's memory model work (escape analysis, stack vs heap)?
    
- How are Goroutines scheduled under the hood (runtime.M, P, G)?
    
- What's the difference between buffered and unbuffered channels in terms of practical use cases?
    
- How does garbage collection in Go affect low-latency applications?
    

---

### 🧱 **2. Project Architecture & Design**

- What’s a scalable folder structure for a large Go application (with or without Clean Architecture)?
    
- How do you structure domain models, services, repositories, and handlers in a Go backend?
    
- When would you choose `interface` vs concrete type?
    
- How do you manage dependency injection in Go without a DI framework?
    

---

### 📦 **3. Working with Libraries & Ecosystem**

- Which logging, config, testing, or database libraries do you recommend and why?
    
- How do you handle database access — raw `sql`, `pgx`, or ORM like `gorm`?
    
- How do you use `context.Context` effectively in production code?
    

---

### ⚙️ **4. Concurrency, Channels, and Goroutines**

- How do you handle timeouts, cancellation, and retries with `context` and `select`?
    
- What's a good pattern for fan-in, fan-out, or worker pools?
    
- When do you use a channel vs a mutex?
    

---

### 🌐 **5. HTTP Servers & Middleware**

- How do you structure middleware in `net/http`?
    
- How do you handle authentication, CORS, and request validation in Go?
    
- What are good patterns for graceful shutdown of HTTP servers?
    

---

### 🔐 **6. Security & Best Practices**

- How do you securely manage JWTs and sessions in Go?
    
- How do you protect against common web vulnerabilities like CSRF, XSS, SQL injection?
    
- How do you store and rotate secrets or keys in Go applications?
    

---

### 🔧 **7. Testing & Observability**

- How do you structure unit, integration, and E2E tests in Go?
    
- How do you test HTTP handlers, middlewares, and external API interactions?
    
- What are good observability practices — logging, metrics, tracing in Go apps?
    

---

### 🚀 **8. Performance & Optimization**

- How do you profile and optimize Go applications (pprof, trace, benchmarks)?
    
- How do you reduce allocations and improve throughput?
    
- What’s your approach to load testing Go services?
    

---

### 📚 **9. Production Deployment & CI/CD**

- How do you build, version, and deploy Go applications (Docker, GitHub Actions, etc)?
    
- How do you handle configuration across environments (env vars, config files)?
    
- What’s your advice for zero-downtime deployments with Go?
    

---

### 📌 **10. Code Review & Patterns**

- Can you review this function/module for idiomatic Go?
    
- Is this design idiomatic or does it “feel like Java in Go”?
    
- What are common anti-patterns you’ve seen in Go?

## ⚙️ **1. Go Runtime, Internals & Compiler**

- **How does the Go scheduler work under the hood? What are M, P, G in the runtime?**
    
- **What are the phases of Go’s garbage collector? How does STW (stop-the-world) behave?**
    
- **How does the compiler decide whether to allocate on stack vs heap (escape analysis)?**
    
- **What exactly does inlining, bounds check elimination, and dead code elimination look like in Go?**
    
- **How can you inspect or influence compiler decisions (e.g., `go build -gcflags`, `go tool compile`, `go tool objdump`)**?
    

---

## 🧵 **2. Advanced Concurrency Patterns**

- **When should you avoid Goroutines despite their low cost?**
    
- **How would you implement a bounded worker pool with backpressure handling?**
    
- **Can you walk through a lock-free algorithm or how Go’s channels avoid locks?**
    
- **How to safely shut down a system with multiple goroutines, some blocked on channel ops?**
    
- **What are the concurrency risks with global variables in HTTP servers?**
    

---

## 🧱 **3. Clean Architecture in Practice**

- **How to implement Clean Architecture in Go without forcing layers that don’t add value?**
    
- **How do you decouple interfaces but still avoid over-engineering in small Go codebases?**
    
- **What’s a practical example of Hexagonal Architecture (Ports & Adapters) in Go, including real database/file/etc. implementations?**
    
- **How do you isolate side effects at the edges (e.g., repositories, API calls) and test core domain logic independently?**
    

---

## 🔍 **4. Performance Engineering & Profiling**

- **How do you profile a production Go service for CPU, memory, goroutine leaks (pprof, trace, metrics)?**
    
- **What are allocation hotspots, and how do you identify and fix them?**
    
- **What are techniques to reduce GC pressure — object pooling, prealloc, slice reuse?**
    
- **How do you debug goroutine leaks or blocked goroutines (runtime/pprof, trace analysis)?**
    

---

## 🔐 **5. Advanced Security**

- **How do you sign and verify JWTs or JWS using secure key management (e.g., with `lestrrat-go/jwx`)?**
    
- **How would you securely implement OAuth2 in a Go backend?**
    
- **How do you enforce proper TLS usage and verify certs manually when needed?**
    
- **How do you do secure logging (avoid secrets, redact PII)?**
    

---

## 📦 **6. Zero-Downtime Systems & Infrastructure**

- **How do you implement zero-downtime deploys in Go (graceful shutdown, readiness probes, signal handling)?**
    
- **What’s your approach to rolling out config changes without restarts (hot reloading, SIGHUP handlers)?**
    
- **How do you build highly available Go services (load balancing, failover, retries with backoff)?**
    
- **How would you manage distributed locks (e.g., Redis, Etcd) in Go safely?**
    

---

## 📊 **7. Deep Observability**

- **What’s your approach to distributed tracing (OpenTelemetry) in Go?**
    
- **How do you add structured logging with context propagation (Zap, zerolog, slog)?**
    
- **How do you correlate logs, metrics, and traces to troubleshoot production issues?**
    

---

## 🔁 **8. Building Go Tooling & Metaprogramming**

- **How do you write custom linters using `golang.org/x/tools/go/analysis`?**
    
- **How do you use `go generate` for code generation (e.g., mocks, boilerplate)?**
    
- **Can you explain how Go reflection works under the hood (`reflect.Value`, `reflect.Type`)?**
    
- **How do you implement plugin systems in Go (`plugin` package, interfaces, dynamic loading)?**
    

---

## 🧪 **9. Advanced Testing**

- **How do you structure tests to validate concurrency correctness (race conditions, data races)?**
    
- **How do you mock time or I/O for deterministic tests in Go?**
    
- **How do you create realistic integration test setups with containers (e.g., `testcontainers-go`)?**
    
- **How do you fuzz test Go functions (built-in `go test -fuzz`) for correctness and panic safety?**
    

---

## 🧠 **10. Real-World Design and Tradeoffs**

- **How do you balance idiomatic Go vs general software engineering principles (DRY, SOLID)?**
    
- **What are signs you're overengineering interfaces or abstractions in Go?**
    
- **How do you handle multi-tenant or multi-namespace architecture in Go services?**
    
- **How do you split monoliths into microservices while keeping data consistency and observability?**
    