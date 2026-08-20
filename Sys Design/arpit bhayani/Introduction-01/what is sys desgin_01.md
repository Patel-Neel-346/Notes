# What is System Design?

## The Starting Point

Imagine someone asks you: **"Build WhatsApp."**

You don't start by writing Java code. Instead, you ask questions like:

- How many users will use it?
- Where will messages be stored?
- How will messages be delivered instantly?
- What if one server crashes?
- How do we store billions of messages?
- How can millions of users chat at the same time?

**Answering these questions is System Design.**

## Definition

> **System Design** is the process of designing the architecture, components, and interactions of a software system so that it meets functional and non-functional requirements.

---

## Think Like an Architect

Suppose someone wants to build a house:

- A **mason** starts laying bricks
- An **architect** first creates a blueprint

### House Building Process
```
Blueprint → Foundation → Walls → Electricity → Plumbing → Painting
```

### Software Development Process
```
Requirements → Architecture → Database → Servers → Caching → Deployment → Code
```

**Key insight:** A software engineer writes code. A system designer decides how everything fits together.

### Example: URL Shortener

Instead of thinking:
```java
class UrlService {
   ...
}
```

You think about the architecture:
```
User → API → Application Server → Database
```

Then you ask:
- Which database? SQL or NoSQL?
- What if 10 million users shorten URLs?
- Should I cache popular URLs?
- What if the database crashes?

These are system design questions.

---

## Two Types of Requirements

Every system has two categories of requirements:

### 1. Functional Requirements

**What the system should do** (features):

For WhatsApp:
- Send messages
- Receive messages
- Show online status
- Create groups
- Send images

### 2. Non-Functional Requirements

**How well the system should work** (quality attributes):

Examples:
- Respond within 100 ms
- Support 100 million users
- Never lose messages
- Stay available 99.99% of the time
- Handle server failures gracefully

> ⚠️ **Note:** Non-functional requirements are usually the hardest part of system design.

---

## Why System Design Exists

Imagine you've built a Spring Boot application:

### Initially (10 users)
```
Users → Spring Boot → MySQL
```
Everything works fine.

### Problem (1 million users arrive)
- 🐌 Database becomes slow
- 🔥 CPU reaches 100%
- 💾 Memory fills up
- ⏱️ Requests take several seconds
- ❌ Users start seeing errors

**System design is about solving these scaling problems.**

---

## What Problems Does System Design Solve?

### 1. **Scalability**
Can the system handle more users?
```
100 Users → 1,000 Users → 100,000 Users → 10 Million Users
```

### 2. **Availability**
Can the system stay online even if something fails?
```
Server A ❌  →  Server B still serves requests
```

### 3. **Reliability**
Can users trust the system?

Example: You transfer ₹10,000. The money should never disappear, even if the server crashes.

### 4. **Performance**
Can the system respond quickly?

Nobody wants a page that takes 15 seconds to load.

### 5. **Fault Tolerance**
If one machine fails, the system should keep working.
```
Server 1 ❌  →  Traffic automatically goes to  →  Server 2
```

### 6. **Cost**
Can you support millions of users without spending unnecessary money?

A good design balances **performance** with **cost**.

---

## What Does a System Consist Of?

Most modern applications include several building blocks:

```
                    Users
                      │
                      ▼
              Load Balancer
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Application 1          Application 2
          │                       │
          └───────────┬───────────┘
                      ▼
                  Redis Cache
                      │
                      ▼
                  Database
                      │
                      ▼
              Object Storage
```

As your course progresses, you'll learn what each component does and why it's needed.

---

## Why Not Just Use One Big Server?

Imagine Instagram runs on one machine:

```
Users → One Server
```

### Problems with Single Server:
- ❌ If the server crashes, Instagram goes offline
- ❌ If 5 million users connect, it becomes overloaded
- ❌ Storage eventually fills up
- ❌ Upgrading hardware gets expensive

### Solution: Distribute Across Multiple Machines

```
              Users
                │
                ▼
          Load Balancer
                │
        ┌───────┼───────┐
        ▼       ▼       ▼
      Server 1 Server 2 Server 3
                │
                ▼
          Database Cluster
```

**This is the foundation of distributed systems.**

---

## What Skills Does System Design Combine?

System design brings together many areas:

```
Networking
    │
Operating System
    │
Database
    │
Caching
    │
Load Balancing
    │
Distributed Systems
    │
Cloud
    │
Backend Development
    │
System Design
```

> 💡 **That's why it feels broad at first. Over time, these pieces start fitting together.**

---

## How System Design Interviews Usually Work

### A Typical Question:
> **"Design WhatsApp."**

The interviewer **isn't** expecting production-ready diagrams immediately. They're evaluating **how you think**.

### A Common Approach:

1. **Clarify** the requirements
2. **Estimate** the scale (users, requests, storage)
3. **Design** a simple architecture
4. **Identify** bottlenecks
5. **Improve** the design step by step (caching, load balancing, replication, etc.)
6. **Discuss** trade-offs

---

## One Important Mindset

### Common Misconception ❌
> "System Design is about learning Redis, Kafka, or Kubernetes."

### The Reality ✅
Those are **tools**.

**System design** is about:
1. Understanding the **problem** first
2. Then choosing the **right tools** to solve it

Remember: **Problem → Solution**, not **Tools → Problem**.