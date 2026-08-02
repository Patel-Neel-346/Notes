What is a Circuit Breaker?

A Circuit Breaker is a design pattern that stops your application from repeatedly calling a service that is already failing.

Instead of continuing to send requests to a broken service and making things worse, the circuit breaker detects the failures and temporarily blocks further calls.

Its job is to:

Prevent cascading failures.
Reduce unnecessary load on failing services.
Allow the failing service time to recover.
Keep the rest of the system responsive.
Why is it called a "Circuit Breaker"?

The name comes from electrical circuit breakers.

Imagine your house.

Normally:

Electricity
      |
      V
  Appliance

Now suppose there's a short circuit.

Without a circuit breaker:

Electricity
      |
      V
 Short Circuit
      |
      V
 Fire 🔥

With a circuit breaker:

Electricity
      |
      V
Circuit Breaker
      |
      X  (Cuts the power)

The breaker immediately disconnects the circuit to prevent further damage.

Software circuit breakers work the same way.

The Problem Without a Circuit Breaker

Imagine an e-commerce application.

Customer

    |

Order Service

    |

Payment Service

    |

Database

A customer places an order.

The Order Service calls the Payment Service.

Everything is fine.

Now imagine the Payment Service crashes.

What happens?

The Order Service still tries to call it.

Request 1 → Fail

Request 2 → Fail

Request 3 → Fail

Request 4 → Fail

Request 1000 → Fail

Thousands of useless requests keep hitting the already unhealthy Payment Service.

This causes several problems:

Network bandwidth is wasted.
Threads stay blocked waiting for timeouts.
CPU is consumed processing doomed requests.
Users wait longer for failures.
The Payment Service has an even harder time recovering.

This can create a cascading failure, where one failing service causes problems in other services too.

Solution: Circuit Breaker

Instead of allowing every request through:

Order Service

      |

Circuit Breaker

      |

Payment Service

The circuit breaker monitors the results.

If it notices repeated failures:

Order Service

      |

Circuit Breaker

      |

X Payment Service

It opens the circuit.

Now the Order Service immediately gets a failure (or fallback) without contacting the Payment Service at all.

A Real-Life Example

Imagine calling a restaurant.

First call:

No answer.

Second call:

No answer.

Third call:

No answer.

Would you keep calling every second?

Probably not.

You'd think:

"They're probably closed. I'll wait 10 minutes before trying again."

That's exactly what a circuit breaker does.

How Does It Work?

A circuit breaker has three states.

1. Closed State (Normal)

Despite the name, Closed means everything is working normally.

Client

   |

Circuit Breaker

   |

Service

Requests are allowed through.

The circuit breaker watches:

Successes
Failures
Response times

Example:

100 Requests

98 Success

2 Failures

Nothing unusual.

Remain Closed.

2. Open State

Suppose suddenly:

100 Requests

95 Failures

The failure threshold is exceeded.

The circuit breaker decides:

This service is unhealthy.

It opens the circuit.

Client

    |

Circuit Breaker

    |

    X

Service

Now every request is rejected immediately.

No network call is made.

The client gets an error or fallback instantly.

Why is Open Better?

Imagine the Payment Service takes 30 seconds to time out.

Without a circuit breaker:

Request

↓

Wait 30 seconds

↓

Timeout

Every user waits 30 seconds.

With a circuit breaker:

Request

↓

Circuit Open

↓

Return immediately (e.g., in milliseconds)

The user receives a quick response instead of waiting.

3. Half-Open State

After waiting for a configured period (say 30 seconds), the circuit breaker doesn't immediately assume the service is healthy again.

Instead, it sends a small number of test requests.

Client

    |

Circuit Breaker

    |

(Test Request)

    |

Service

Two outcomes are possible:

If the test succeeds

The service appears healthy again.

The breaker returns to Closed.

Traffic resumes.

If the test fails

The service is still unhealthy.

The breaker goes back to Open.

It waits again before testing later.

State Diagram
               Success
        +-------------------+
        |                   |
        V                   |
     +---------+            |
     | Closed  |------------+
     +---------+
          |
 Many Failures
          |
          V
     +---------+
     |  Open   |
     +---------+
          |
 Wait Timeout
          |
          V
   +--------------+
   | Half-Open    |
   +--------------+
      |        |
Success      Failure
      |        |
      V        V
   Closed     Open
Example

Suppose your circuit breaker is configured like this:

Failure Threshold = 50%

Minimum Requests = 20

Wait Time = 30 seconds

During the last 20 requests:

12 Failed

8 Succeeded

Failure rate:

12 / 20 = 60%

60% exceeds the 50% threshold.

The breaker opens.

Thirty seconds later:

It sends one test request.

If successful:

Closed

If it fails:

Open again
Fallbacks

Often, a circuit breaker doesn't just return an error.

It can return a fallback.

Example:

Instagram cannot load comments.

Instead of failing the entire post:

Post

❤️ Likes

🖼 Image

❌ Comments unavailable

The user can still view the post.

Netflix recommendation service fails.

Instead of showing nothing:

Trending Movies

are displayed.

This is a fallback response.

Benefits of Circuit Breakers
1. Prevents Cascading Failures

One failing service doesn't overwhelm the rest of the system.

2. Faster Failure

Instead of waiting for long timeouts, requests fail immediately.

Users get quicker feedback.

3. Protects Unhealthy Services

The failing service gets breathing room to recover because it isn't flooded with more requests.

4. Improves User Experience

Fallbacks or cached data can be returned instead of a complete failure.

5. Conserves Resources

Without a circuit breaker:

Threads stay blocked.
Connections remain open.
CPU is wasted.
Memory usage increases.

With a circuit breaker, those resources are preserved for healthy operations.

Real-World Example

Imagine:

API Gateway

     |

User Service

     |

Recommendation Service

The Recommendation Service becomes unavailable.

Without a circuit breaker:

Every user request waits for the recommendation call to time out.

Eventually, the User Service runs out of threads, and now even basic profile requests slow down.

With a circuit breaker:

The recommendation call is skipped after repeated failures.

Profiles still load, but recommendations are temporarily unavailable.

Only one feature is degraded instead of the entire application.

Circuit Breaker vs Retry

These two patterns are often used together but solve different problems.

Retry	Circuit Breaker
Assumes the failure is temporary.	Assumes repeated failures indicate a larger problem.
Tries the request again.	Stops sending requests for a while.
Useful for transient issues like brief network glitches.	Useful when a service is consistently unhealthy.

A common approach is:

Try the request.
Retry a few times if it fails.
If failures continue and exceed a threshold, open the circuit.
After a cooldown period, test with a few requests (half-open).
Close the circuit when the service proves healthy again.
Popular Java Library

In Java and Spring Boot, the most widely used circuit breaker library is Resilience4j. It integrates well with Spring Boot and supports circuit breakers, retries, rate limiters, bulkheads, and time limiters.

Interview Summary

If an interviewer asks:

"What is a circuit breaker?"

You can answer:

A circuit breaker is a resilience pattern that monitors calls to a downstream service. When failures exceed a configured threshold, it opens the circuit and temporarily stops forwarding requests to that service. This prevents cascading failures, reduces resource consumption, and allows the service time to recover. After a cooldown period, it enters a half-open state to test whether the service has recovered before allowing normal traffic again.

Where Circuit Breakers Fit in a Request Flow
Client
   |
API Gateway
   |
Order Service
   |
Circuit Breaker
   |
Payment Service
   |
Database

The circuit breaker sits between the caller and the downstream service, acting like a smart gatekeeper. It decides whether a request should proceed based on the recent health of that downstream service. This makes it a fundamental building block for resilient microservices.