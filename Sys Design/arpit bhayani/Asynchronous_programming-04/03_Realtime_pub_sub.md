What is Pub/Sub?

Imagine a YouTube channel.

You subscribe to a creator.

When the creator uploads a new video:

You get notified.
Millions of other subscribers also get notified.

The creator doesn't know who all the subscribers are.

          YouTube

      +----------------+
      |  MrBeast       |
      +----------------+
             |
      Upload Video
             |
             V
       Notification System
      /       |        \
     /        |         \
 Alice      Bob      Charlie

This is Publish-Subscribe.

Publisher → publishes an event.
Subscribers → receive the event.
Broker → connects them.

The publisher never talks directly to subscribers.

Software Example

Suppose an order is placed.

Instead of:

Order Service

↓

Call Email Service

↓

Call Analytics

↓

Call Inventory

↓

Call Notification

We publish an event.

Order Service

↓

Publish

"Order Created"

The broker distributes it.

                Kafka

          Order Created

      /        |        \

 Inventory  Analytics  Email

The Order Service doesn't know who receives it.

Why is this called Real-Time?

Because subscribers receive the event almost instantly.

Imagine WhatsApp.

You send

Hello
You

↓

Publish Message

↓

Message Broker

↓

Friend receives instantly

No polling every minute.

The broker pushes the message as soon as it arrives.

Traditional Polling

Without Pub/Sub:

Phone

↓

"Any new messages?"

↓

Server

↓

"No"

(1 second later)

↓

"Any new messages?"

↓

"No"

↓

"Any new messages?"

↓

"Yes"

Lots of unnecessary requests.

Pub/Sub

Instead:

Phone connects

↓

Wait...

↓

Someone sends a message

↓

Server immediately pushes it

↓

Phone displays it

Much faster and more efficient.

Example: Live Cricket Score

Millions of users are watching.

Score changes.

India 250/4

The scoring system publishes:

Score Updated

The broker immediately sends it to:

Mobile App

Website

TV Broadcast

Analytics

Commentary

All subscribers receive the same update.

Kafka Pub/Sub

Suppose we have a topic:

orders

Producer:

Order Created

Kafka stores:

Offset 0

Order Created

Now multiple consumers subscribe.

Kafka Topic

↓

Inventory

↓

Analytics

↓

Notification

↓

Fraud Detection

Every subscriber receives the event independently.

RabbitMQ Pub/Sub

RabbitMQ also supports Pub/Sub using Exchanges.

Imagine this:

Publisher

↓

Fanout Exchange

↓

Queue A

↓

Queue B

↓

Queue C

Every queue gets a copy.

Each service consumes its own queue.

This differs from a simple RabbitMQ work queue, where typically one worker processes one message.

Real-World Example: Instagram

You upload a photo.

Instagram publishes:

Photo Uploaded

Subscribers:

Feed Service

↓

Notification Service

↓

AI Moderation

↓

Analytics

↓

Recommendation Engine

Everyone reacts independently.

Why Not Just Call APIs?

Imagine five services.

Without Pub/Sub:

Order Service

↓

Inventory API

↓

Notification API

↓

Analytics API

↓

Recommendation API

↓

Email API

Problems:

Slow
Tight coupling
If one service fails, the request may fail or be delayed

With Pub/Sub:

Order Service

↓

Publish Event

↓

Broker

↓

All subscribers receive it

The publisher doesn't need to know:

Who is listening
How many subscribers exist
Whether new subscribers are added later

This makes the system much more flexible.

Common Pub/Sub Systems
System	Best For
RabbitMQ	Background jobs and messaging with Pub/Sub support
Kafka	High-throughput event streaming and Pub/Sub
Redis Pub/Sub	Lightweight real-time notifications (messages aren't persisted)
Google Cloud Pub/Sub	Managed cloud messaging
Apache Pulsar	Large-scale distributed messaging
Queue vs Pub/Sub
Queue (Work Queue)

One message is processed by one worker.

Job

↓

Queue

↓

Worker A

Worker B does not process the same job.

Pub/Sub

One published event is delivered to all interested subscribers.

Event

↓

Broker

↓

Service A

↓

Service B

↓

Service C

Each subscriber gets its own copy or view of the event, depending on the messaging system.

An Easy Way to Remember
Queue: "Who will do this task?" → One worker handles it.
Pub/Sub: "Who should know this happened?" → Everyone who subscribed is notified.

This distinction is fundamental in system design:

Use a queue for distributing work.
Use Pub/Sub for broadcasting events to multiple independent consumers.