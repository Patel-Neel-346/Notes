# Cache Population and Scaling

## When should data be put into cache?

There are two broad approaches:

- Lazy population (cache on demand)
- Eager population (pre-populate cache)

### 1. Lazy population (cache on demand)

This is the most common strategy.

- Do not cache data until a request actually needs it.
- The first request misses and reads from the database.
- The result is then stored in cache.

#### Flow

User → Application → Cache
  - hit: return result
  - miss: Database → Cache → response

#### Advantages

- stores only data that is actually used
- memory-efficient
- easy to implement
- adapts automatically to changing access patterns

#### Disadvantages

- the first request is slower
- cold cache or cold start occurs on first access

### 2. Eager population (pre-populate cache)

Instead of waiting for reads, the cache is filled before users request the data.

#### Type 1: Write-through cache

When data is updated, write to both the database and the cache.

Example:

- update product price from ₹500 to ₹600
- write to database
- update cache

This keeps the cache fresh and avoids stale reads after writes.

##### Advantages

- cache is always fresh
- no first-read miss after update
- reads remain fast

##### Disadvantages

- every write involves both database and cache
- slow cache increases write latency

#### Type 2: Proactive push

A background job fills the cache before users request the data.

Examples:

- Netflix preloads top movies before peak viewing
- Amazon caches popular products before a sale
- a weather app populates recent weather data every minute

Flow:

Scheduler → Database → Cache → Users

##### Advantages

- fast first request
- ideal for predictable hot data

##### Disadvantages

- can waste memory and bandwidth if predictions are wrong

## Comparison

| Feature | Lazy Population | Eager (Write-Through) | Eager (Proactive Push) |
|---|---|---|---|
| When cache is filled | On first read | During every write | Before users request it |
| First request | Slow (cache miss) | Fast | Fast |
| Memory usage | Efficient | Efficient for updated entries | Can be wasteful |
| Write cost | Normal | Higher (DB + Cache) | Background job cost |
| Best for | General applications | Freshly updated data | Predictable hot data |

## Real systems often combine strategies

Most large systems use a hybrid approach:

- lazy population for general data
- write-through for data that must stay fresh
- proactive preloading for highly predictable hot data

Example for e-commerce:

- lazy cache for most product pages
- update DB and cache when price changes
- preload "Top Deals" before a sale

## Cache scaling

Scaling cache is critical. Many engineers mistakenly think "just add more Redis servers." In reality, there are several techniques.

### The scaling problem

Suppose Redis stores:

- user profiles
- feed data
- session tokens
- frequently viewed posts

When traffic grows from hundreds to millions of users, Redis can become the bottleneck:

- CPU hits 100%
- RAM fills up
- network bandwidth saturates

### Method 1: Vertical scaling

Add a bigger machine.

#### Pros

- very easy
- no architecture change
- no application change

#### Cons

- limited by the biggest available server

### Method 2: Read replicas

If Redis is mostly reads, use replicas.

- primary handles writes
- replicas serve reads
- application spreads read traffic across replicas

#### Tradeoff

- improves read throughput
- introduces eventual consistency delays

### Method 3: Cache sharding

Split data across multiple cache servers.

Example:

- Redis A: keys 1–30M
- Redis B: keys 31–60M
- Redis C: keys 61–100M

The application routes each key to the correct server.

#### Challenge

Simple hash-based sharding changes mappings when you add servers, causing many keys to move.

### Method 4: Consistent hashing

Use a logical ring to assign keys to servers.

- hash each server into the ring
- hash each key into the ring
- assign the key to the next server clockwise

When a server joins or leaves, only a small subset of keys moves.

### Method 5: Virtual nodes

Use multiple virtual positions per physical server on the ring.

- improves balance
- reduces hot partitions
- eases rebalancing

### Method 6: Multi-level cache

Add a local cache in the application before remote Redis.

Application → Local cache → Redis → Database

This reduces remote cache traffic for extremely hot data.

### Method 7: Geo-distributed cache

Locate cache servers near users.

- India users → Redis India
- USA users → Redis USA
- Europe users → Redis Europe

This reduces latency but increases replication complexity.

## Summary table

| Scaling method | What it solves | Limitation |
|---|---|---|
| Vertical scaling | More RAM/CPU | hardware limit |
| Read replicas | more read throughput | eventual consistency, not more storage |
| Sharding | more storage and throughput | requires routing logic |
| Consistent hashing | minimal key movement when scaling | more complex implementation |
| Virtual nodes | better load balance | more metadata overhead |
| Multi-level cache | fewer remote cache calls | harder invalidation |
| Geo-distributed cache | lower regional latency | replication / consistency challenges |
