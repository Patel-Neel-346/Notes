# 🐇 **RabbitMQ Exercises + Use Cases**

| **#** | **Pattern**                         | **Exercise Description**                             | **Use Case**                        | **Real-World Example**                          | **When to Use**                    |
| ----- | ----------------------------------- | ---------------------------------------------------- | ----------------------------------- | ----------------------------------------------- | ---------------------------------- |
| 1     | Simple Producer-Consumer            | Producer sends messages, single consumer processes   | Basic async task processing         | E-commerce order email                          | Decouple tasks, simple services    |
| 2     | Work Queue                          | Multiple consumers pull from one queue (round-robin) | Load balancing, scalable processing | Image resizing pipeline                         | CPU-intensive work, task queues    |
| 3     | Publish-Subscribe (Fanout Exchange) | Broadcast messages to multiple consumers             | Event broadcasting                  | New user sign-up → email, analytics, onboarding | Multiple services need same data   |
| 4     | Routing (Direct Exchange)           | Route messages based on exact routing key            | Conditional processing              | Logging: ERROR → alerting, INFO → storage       | Message-type routing               |
| 5     | Topic Exchange                      | Wildcard-based dynamic routing                       | Flexible topic matching             | IoT sensors: `sensor.*.critical` → alerts       | Hierarchical, multi-tenant routing |
| 6     | RPC (Remote Procedure Call)         | Use reply queues + correlation IDs                   | Request-response in async systems   | Payment confirmation from payment service       | Synchronous result needed          |
| 7     | Dead Letter Queue                   | Failed messages are rerouted to special queue        | Error recovery                      | Retry payment 3x → manual review                | Poison message handling            |
| 8     | Message TTL                         | Auto-expire messages or queues                       | Time-sensitive operations           | Flash sale notifications expire post-event      | Expiring cache, promo messages     |
| 9     | Priority Queues                     | Messages consumed by priority                        | SLA-based or urgency-based handling | Hospital alerts: emergency > routine            | Service-level distinction          |
| 10    | Exchange-to-Exchange Binding        | Chain multiple exchanges for complex logic           | Layered routing logic               | Financial trade checks → compliance → routing   | Enterprise routing, ESB-like logic |

---

# 🦄 **Kafka Exercises + Use Cases**

| **#** | **Pattern**                       | **Exercise Description**                          | **Use Case**                                  | **Real-World Example**                           | **When to Use**                    |
| ----- | --------------------------------- | ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------ | ---------------------------------- |
| 1     | Simple Producer-Consumer          | Produce and consume from a Kafka topic            | Event logging, simple stream                  | Clickstream from web app                         | Intro to Kafka, low complexity     |
| 2     | Partitioned Topics                | Create topic with multiple partitions             | Parallelism, ordering per key                 | User activity → partition by user ID             | Scale consumers, per-key ordering  |
| 3     | Consumer Groups                   | Multiple consumers in one group                   | Load-balanced message processing              | Payment transactions across workers              | High throughput, fault-tolerant    |
| 4     | Multiple Consumer Groups          | Different consumers independently read same topic | Fan-out processing                            | Order placed → inventory, billing, shipping      | Multiple independent consumers     |
| 5     | Kafka Streams Word Count          | Streaming aggregation/counting                    | Real-time dashboards, metrics                 | Trending topics from tweet streams               | Streaming analytics                |
| 6     | Event Sourcing                    | Model domain state via events                     | State reconstruction, auditing                | Banking ledger → replay all deposits/withdrawals | Temporal queries, full history     |
| 7     | CQRS Pattern                      | Separate read/write logic using Kafka             | Performance tuning for read/write             | Write: Orders → Kafka; Read: projections         | Query-heavy systems                |
| 8     | Saga Pattern                      | Orchestrate distributed transactions              | Long-running, compensating transactions       | Travel booking: flight, hotel, car               | Microservices coordination         |
| 9     | Offset Management                 | Manual offset handling, replays                   | Reprocessing, exactly-once workflows          | Replaying orders after bug fix                   | Failure recovery, backfill         |
| 10    | Schema Evolution                  | Use schema registry and evolve formats            | Compatibility between producers and consumers | Backward compatible API changes                  | Long-living systems                |
| 11    | Kafka Connect                     | Data movement with no code                        | ETL, real-time sync                           | Sync DB to warehouse, CDC                        | System integration                 |
| 12    | Stream Processing (Joins/Windows) | Correlate events across streams                   | Real-time decisions, joins                    | Login event + high-value txn → fraud alert       | Complex event workflows            |
| 13    | Exactly-Once Semantics            | Avoid duplicates across retries/failures          | Financial systems, sensitive updates          | Payment processing once per event                | Data correctness, critical systems |
| 14    | Log Compaction                    | Keep only latest record per key                   | Changelog streams                             | Latest user profile info only                    | Current state tracking, CDC use    |

---

# 🔁 **RabbitMQ vs Kafka — When to Choose**

| **Use Case**                            | **Best With**                        |
| --------------------------------------- | ------------------------------------ |
| Real-time messaging with routing logic  | 🐇 RabbitMQ                          |
| High-throughput event streaming         | 🦄 Kafka                             |
| Short-lived, transient tasks            | 🐇 RabbitMQ                          |
| Durable, replayable event history       | 🦄 Kafka                             |
| Pub-sub with filters and wildcards      | 🐇 RabbitMQ (via topic exchange)     |
| Horizontal scale, partitioned workloads | 🦄 Kafka                             |
| Complex workflows (saga, CQRS, ESB)     | Both (Kafka often for orchestration) |
| Integration between databases, services | 🦄 Kafka (via Connect)               |

---

# ✅ **How to Use This Practically**

- Start with basic exercises and add **metrics/logs** to monitor message flow.
    
- Simulate **failures** and observe behavior (e.g. RabbitMQ dead-letter, Kafka reprocessing).
    
- Track **message IDs** or **keys** to understand **ordering, routing**, and **idempotency**.
    
- Use tools:
    
    - 🐇 RabbitMQ: Management UI, message TTL settings, shovel plugin.
        
    - 🦄 Kafka: Kafka UI (like AKHQ, Confluent Control Center), schema registry, `kafka-console-*` tools.
        

---

Would you like this exported to a markdown file or Notion-style format for easy reference during practice?