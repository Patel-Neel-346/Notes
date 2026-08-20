# Caching at Different Levels

Caching works as a hierarchy. The goal is to return the response from the highest possible layer.

Fastest
---
Browser cache (client-side)
CDN cache
Load balancer / reverse proxy cache
Application local cache
Remote cache (Redis / Memcached)
Database cache
Database disk storage
---
Slowest

## 1. Client-side cache (browser cache)

This is the closest cache to the user. The browser stores assets locally for faster reloads.

### Example

When you visit `https://instagram.com`, the browser downloads:

- `logo.png`
- `style.css`
- `app.js`
- `profile.jpg`

On the next visit, the browser asks:

"Do I already have `logo.png`?"

If yes, it loads from local disk and never contacts the server.

### Architecture

User → Browser cache → Internet → Server

### How the browser knows

The server sends cache headers such as:

```http
Cache-Control: max-age=3600
```

This means the asset can be kept for 3,600 seconds (1 hour).

### Usually cached

- CSS
- JavaScript
- images
- fonts
- videos
- static HTML

### Benefits

- almost zero latency
- no network call
- no server load

## 2. CDN cache (Content Delivery Network)

A CDN caches static assets at edge locations worldwide. This lowers latency for users far from the origin server.

### Example

If your server is in Mumbai and a user is in London, a CDN edge node in London serves the request instead of contacting Mumbai.

### Flow

1. First request:
   - User → CDN → not found → origin server → store in CDN → user
2. Second request:
   - User → CDN → found → return

### Common CDN providers

- Cloudflare
- Akamai
- Amazon CloudFront
- Fastly

### Best for

- images
- videos
- CSS
- JavaScript
- downloads

## 3. Reverse proxy cache

A reverse proxy such as Nginx or Varnish can cache full HTTP responses before reaching the application.

### Example

Client → Nginx → Spring Boot → Redis → Database

If `GET /products` is requested thousands of times, Nginx can return the cached response directly, skipping the application entirely.

### Architecture

User → Nginx cache → Application

## 4. Application local cache (in-memory cache)

Each application server keeps a small cache inside its own process memory.

### Example libraries

- Caffeine (Java)
- Guava Cache
- Ehcache

### Why use it?

Memory access is much faster than network access.

- local cache: ~100 ns
- Redis: ~0.5–2 ms

### Example flow

Request → local cache → found → no Redis call

### Challenge

When Server A updates data, Server B may still have stale values in its local cache.
Keeping local caches synchronized across servers is difficult.

## 5. Remote cache (Redis / Memcached)

This is the shared cache layer most people mean by "cache." It sits on a separate machine and is shared across application servers.

### Architecture

Application → Redis → Database

Multiple app servers share the same cache.

### Flow

- If key found in Redis: return result
- If key missed: query database, store result in Redis, return result

### Best for

- sessions
- user profiles
- shopping carts
- product data
- API responses
- leaderboards

## 6. Database cache

Databases themselves maintain caches in RAM.

Many beginners think every query always reads from disk, but the database buffer pool avoids repeated disk access.

### Example

```sql
SELECT * FROM users WHERE id = 5;
```

- first time: disk → RAM → return
- second time: RAM → return

The disk is not touched on repeat reads.

## Why use Redis if the database already caches data?

Database caches are optimized for query execution, not for millions of simple key-value lookups.

Redis provides:

- TTL support
- independent scaling
- very fast lookup performance
- lower database work (no query parsing, planning, or connection overhead)

## Complete request flow

User → Browser cache → CDN → Reverse proxy → Application local cache → Redis → Database cache → Database disk

Each layer gives the request a chance to avoid going deeper.

## Summary

| Level | Location | Typical data | Speed |
|---|---|---|---|
| Browser cache | user's browser | static assets | ⭐⭐⭐⭐⭐ fastest |
| CDN cache | edge servers | static assets, videos | ⭐⭐⭐⭐⭐ |
| Reverse proxy cache | Nginx / Varnish | HTTP responses | ⭐⭐⭐⭐ |
| Application local cache | application memory | hot objects, computed results | ⭐⭐⭐⭐ |
| Remote cache | Redis / Memcached | shared app data | ⭐⭐⭐ |
| Database cache | DB RAM / buffer pool | DB pages and indexes | ⭐⭐ |
| Database disk | SSD / HDD | permanent storage | ⭐ slowest |
