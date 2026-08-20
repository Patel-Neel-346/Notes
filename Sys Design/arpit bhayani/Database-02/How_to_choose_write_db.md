# Choosing the Right Database

Choose the simplest database that meets your requirements. Only move to a specialized database when your needs are clear.

## 1. Use a relational database when you need SQL and relationships

Choose:

- MySQL
- PostgreSQL
- Oracle
- SQL Server

Use it when:

- you need ACID transactions
- your data has many relationships
- you frequently perform joins
- you need constraints (foreign keys, unique, check)

Examples:

- banking
- e-commerce orders
- payment systems
- inventory management

## 2. If SQL becomes a bottleneck but you still need relational features, consider manual sharding

Instead of changing databases immediately, you can:

- partition tables
- add read replicas
- cache with Redis
- perform manual sharding

Many large companies use MySQL or PostgreSQL for years with sharding before adopting NoSQL.

## 3. If constraints limit scalability, drop constraints carefully

At very large scale, some teams:

- remove foreign keys
- enforce relationships in application code

Why?

- foreign keys slow down writes
- they make sharding harder
- they couple tables across shards

This approach is common at Meta, Uber, and Airbnb.

> Important: You are still using a relational database; you are simply relying less on database-enforced constraints.

## 4. Use a key-value store when your access pattern is mostly simple lookups

Choose:

- Redis
- DynamoDB
- Riak
- Aerospike

Use it when queries look like:

- `GET(user123)`
- `SET(cart456)`
- `GET(session789)`

No joins. No complex queries.

Examples:

- session store
- shopping cart
- cache
- user preferences

## 5. Use a document database for flexible, schema-less records

Choose:

- MongoDB
- CouchDB
- Couchbase

Good when different records have different fields.

Example:

Laptop:
```json
{
  "ram": "16GB",
  "cpu": "i7"
}
```

Shoes:
```json
{
  "size": 9,
  "color": "Black"
}
```

A SQL table would need many nullable columns. Document databases store each document independently.

Examples:

- product catalog
- CMS
- blog
- user profiles

## 6. Use a graph database when you need graph algorithms

Choose:

- Neo4j
- Amazon Neptune
- JanusGraph

Use it for:

- friends-of-friends queries
- shortest path
- recommendations
- social networks
- fraud detection

Example:

Alice → Bob → Charlie → David

Graph databases handle traversal much faster than SQL joins.

## 7. If you have no special requirements, start with PostgreSQL

Why PostgreSQL?

- ACID compliant
- excellent SQL support
- JSON support
- full-text search
- extensions like PostGIS and TimescaleDB
- mature ecosystem
- scales with replicas and partitioning

You can build most applications on PostgreSQL before needing a specialized database.

## Simple decision tree

```text
Need ACID transactions? → Yes → PostgreSQL / MySQL
                    │
                    ├── Need more scale? → Replicas → Partitioning → Sharding
                    │
                    └── No →
                         Mostly key-value? → Redis / DynamoDB
                         Flexible JSON documents? → MongoDB
                         Graph traversal? → Neo4j
                         Full-text search? → Elasticsearch
```
