# How Do We Evaluate a System?

Experienced engineers usually evaluate a design using several **quality attributes**.

---

## 1. Scalability ⭐⭐⭐⭐⭐

**Can it handle more users?**

### Example
```
1,000 Users ✅
       ↓
10,000 Users ✅
       ↓
100,000 Users ✅
       ↓
10 Million Users ✅
```

### Questions to Ask
- Can I add more servers?
- Will the database become a bottleneck?
- Can I scale horizontally?
---

## 2. Availability

**Can users still use the system if something fails?**

### Example
```
        Load Balancer
          /      \
      Server A   Server B
```

If **Server A crashes**, can users still access the application?

✅ If yes, your **availability is good**.

---

## 3. Reliability

**Does the system always behave correctly?**

### Example
You send ₹1000 through UPI.

The money should **never disappear**. Even if the server crashes, the transaction should:

✅ Complete successfully

**OR**

↩️ Roll back

❌ **Never** half-complete.

---

## 4. Performance

**How fast is it?**

### Metrics: Response Time (Latency)

✅ **Better:**
```
Login → 80 ms
```

❌ **Worse:**
```
Login → 4 seconds
```
---

## 5. Throughput

**How much work can the system do?**

### Example

❌ **Lower throughput:**
```
Server → 10 Requests/sec
```

✅ **Higher throughput:**
```
Server → 100,000 Requests/sec
```

> Higher throughput = more work completed per unit time

---

## 6. Fault Tolerance

**Can it continue working when parts fail?**

### Example
```
Server 1 ❌
   ↓
Server 2 handles traffic
```

✅ **Users shouldn't notice.**

---

## 7. Cost

Imagine two systems that support the same workload:

**System A:** ₹10,000/month

**System B:** ₹10 lakh/month

❓ **Which one is better?**

Obviously, **System A**.

> A good design balances **cost** and **capability**.

---

## 8. Simplicity

**This is often overlooked.**

### Simple Design ✅
```
One Spring Boot app
         ↓
     One MySQL
```
**Easy to maintain.**

### Over-Engineered Design ❌
```
Kubernetes
    ↓
   Kafka
    ↓
   Redis
    ↓
  RabbitMQ
    ↓
  MongoDB
    ↓
Elasticsearch
    ↓
 Cassandra
```

> If you don't actually need all of that, you've **made life harder for your team**.

---

## 9. Maintainability

Suppose six months later, another developer joins.

❓ **Can they understand your system?**

Or is it so complicated that nobody knows how it works?

> A **maintainable system** is easier to debug, update, and extend.

---

## 10. Security

**Can attackers:**
- Steal data?
- Guess passwords?
- Access other users' information?

> A **good system protects its users**.

---

## Trade-offs Matter

### Example Requirement
> "Users should see new posts instantly."

You might keep everything in memory:

| Metric | Answer |
|--------|--------|
| **Fast?** | ✅ Yes |
| **Cheap?** | ❌ No |
| **Durable?** | ❌ No |

> Every decision **improves one thing** and often **makes another thing worse**.

**That's why system design is about balancing trade-offs.**

---

## Example: Designing a URL Shortener

### Requirements
- 100 million URLs
- Redirect in under 100 ms
- 99.99% uptime

### Proposed Design
```
          Client
             │
             ▼
      Load Balancer
             │
      ┌──────┴──────┐
      ▼             ▼
 API Server 1   API Server 2
      │             │
      └──────┬──────┘
             ▼
         Redis Cache
             │
             ▼
        MySQL Database
```

### Now Evaluate It

| Question | Answer |
|----------|--------|
| **Is it scalable?** | ✅ Yes, add more API servers. |
| **Is it available?** | ✅ Yes, multiple servers reduce downtime. |
| **Is it fast?** | ✅ Yes, Redis speeds up reads. |
| **Is it reliable?** | ✅ Yes, data is persisted in MySQL. |
| **Is it fault tolerant?** | ⚠️ Partially; losing Redis affects performance, not data. |
| **Is it maintainable?** | ✅ Yes, if components are well-organized. |
| **Is it cheap?** | ⚠️ More expensive than single server, but justified by scale. |

### Key Insight 💡

Notice that you're **not** asking: "Did I use Redis?"

You're asking: **"Did my design meet the requirements?"**

---

## The Mindset of Senior Engineers

### Junior Developers ❌
> "Which technology should I use?"

### Senior Engineers ✅
> "What problem am I solving, what constraints do I have, and what trade-offs am I willing to accept?"

---

## 🎯 One Formula to Remember

Whenever you finish a system design, ask yourself these questions:

- ✅ Does it satisfy the **functional requirements**?
- ✅ Can it handle the **expected traffic**?
- ✅ What happens if **one server crashes**?
- ✅ Where is the **bottleneck**?
- ✅ Can it be **scaled later**?
- ✅ Is it **secure**?
- ✅ Is it **easy to maintain**?
- ✅ Is it **cost-effective**?
- ✅ What **trade-offs** did I make?

### Result
If you can answer these **confidently**, you've likely designed a **solid system**.

> This evaluation mindset is exactly what **interviewers look for**. They don't expect a perfect architecture—they want to see that you can **reason about requirements, constraints, and trade-offs** to arrive at a practical solution.