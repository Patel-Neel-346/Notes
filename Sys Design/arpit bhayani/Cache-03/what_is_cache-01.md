# Why We Need Cache

## The problem

Imagine a simple application:

Client
│
Backend
│
Database

If the database stores 10 million users and every request runs:

```sql
SELECT * FROM users WHERE id = 100
```

The database must:

- find the data
- read from disk (or memory)
- build the result
- send it back

Even a single request may take 50 ms. At 100,000 requests/sec, the database becomes overloaded.

### Common issues

- high latency
- more CPU usage
- more disk I/O
- more memory usage
- more network traffic

Eventually, the database can crash.

## Example: a popular profile

Suppose Instagram has a celebrity profile that is opened 1 million times per minute.

Without cache:

Client → Backend → Database → Backend → Client

The database receives 1 million identical queries even though the profile changes only occasionally.

## What is cache?

Cache is temporary storage that keeps frequently accessed data in very fast memory, so future requests are served without fetching from the original source again.

### Simple flow

Without cache:

User → Server → Database

With cache:

User → Server → Cache → Database (only if needed)

## Real-life analogy

Imagine a library.

Without cache, every student asks for a book and the librarian walks to storage each time.

With cache, the librarian keeps the most popular books on the desk.

Student → Desk → Done

The desk is the cache and storage is the database.

## Why is cache fast?

Cache usually lives in RAM, while databases often rely on disk storage.

| Storage | Time |
|---|---|
| CPU register | ~0.3 ns |
| CPU cache (L1) | ~1 ns |
| RAM | ~100 ns |
| SSD | ~100 µs |
| HDD | ~5–10 ms |

RAM is about 1,000× faster than SSD and tens of thousands of times faster than HDD.

## Cache hit vs cache miss

### Cache hit

When the data is already in cache:

User → Server → Cache → Found → Return

The database is never touched. Response time may be ~5 ms.

### Cache miss

When the data is not in cache:

User → Server → Cache → Not found → Database → Cache → User

The result is stored in the cache for future requests.

## Cache flow

- request data
- check cache
- if found, return immediately
- if not found, read from database
- store result in cache
- return response

## Benefits of cache

- much faster response times
- reduces database load
- supports more concurrent users
- improves user experience
- lowers infrastructure cost

## Where is cache used?

Common examples:

- user profiles
- product details
- shopping carts
- session data
- authentication tokens
- news feeds
- trending hashtags
- API responses
- search results
- configuration values
- feature flags
