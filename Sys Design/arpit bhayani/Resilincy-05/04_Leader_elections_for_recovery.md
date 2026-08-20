# What is Leader Election?

Leader Election is the process of automatically selecting one node as the leader when the current leader fails.

The leader is responsible for tasks like:

Accepting writes
Coordinating operations
Managing locks
Making important decisions

All other nodes are called followers (or replicas).

Why Do We Need Leader Election?

Imagine you have three database servers.

        Database Cluster

      +---------+
      | Leader  |
      +---------+
          |
   -----------------
   |               |
+---------+    +---------+
|Follower1|    |Follower2|
+---------+    +---------+

Normally:

All writes go to the Leader.
Followers replicate data from the Leader.

Everything works perfectly.

Now suppose the Leader crashes.

Leader ❌

Follower1

Follower2

Who should accept new writes?

If nobody becomes the leader:

No new writes.
Users can't place orders.
Users can't send messages.
Users can't upload posts.

The system is available for reads (maybe), but not for writes.

So we need a mechanism that says:

"Follower1, you're the new leader."

That mechanism is Leader Election.

Real-Life Analogy

Imagine a classroom.

There is one class monitor.

The monitor is responsible for:

Maintaining discipline.
Reporting to the teacher.

Now the monitor is absent.

What happens?

The class doesn't stop functioning.

The teacher appoints another student as the monitor.

That's leader election.

Automatic Recovery

Leader election is a key part of automatic recovery.

Without it:

Leader crashes

↓

Everything waits for a human

↓

Admin logs in

↓

Promotes another server

Recovery might take several minutes.

With leader election:

Leader crashes

↓

Followers detect failure

↓

Election starts

↓

New leader chosen

↓

Application continues

No human intervention is required.

Example

Suppose we have:

Node A (Leader)

Node B (Follower)

Node C (Follower)

The leader receives all writes.

Now Node A crashes.

Node A ❌

Node B

Node C

Both followers notice that the leader has stopped responding.

They start an election.

Suppose Node B wins.

Now:

Node B (Leader)

Node C (Follower)

Applications now send writes to Node B.

Users may only notice a brief pause during the election.

How Do Followers Know the Leader is Dead?

They don't guess.

They use heartbeats.

Heartbeats

The leader periodically sends small "I'm alive" messages.

Example:

Leader

↓

Heartbeat

↓

Follower

Every second:

✓ Alive

✓ Alive

✓ Alive

Followers keep receiving them.

Now imagine the leader crashes.

Heartbeat

...

...

Nothing

Followers wait for a timeout.

Example:

No heartbeat for 5 seconds

↓

Leader considered failed

Now the election begins.

Election Process (Simplified)

Suppose:

Leader A

Follower B

Follower C

Leader A crashes.

Step 1:

Both followers detect missing heartbeats.

Leader ❌

Step 2:

Followers become candidates.

Candidate B

Candidate C

Step 3:

They ask for votes.

B → Vote for me

C → Vote for me

Step 4:

Nodes vote.

Suppose B receives more votes.

Winner:

Node B

Step 5:

Everyone updates.

Leader = B

Follower = C

System continues.

Why Can't Everyone Become Leader?

Imagine both B and C decide:

"I'm the leader."

Leader B

Leader C

Now two leaders accept writes.

Example:

User 1 deposits ₹100 into an account via Leader B.

User 2 withdraws ₹100 from the same account via Leader C.

The two leaders don't know about each other's updates immediately.

The data becomes inconsistent.

This is called a split-brain scenario.

Leader election protocols are designed to avoid this by ensuring only one leader is active at a time.

Majority Voting

Most distributed systems use a majority (quorum) to elect a leader.

Suppose we have five nodes.

A

B

C

D

E

A leader must receive more than half the votes.

5 Nodes

↓

Need 3 Votes

This prevents two different leaders from being elected at the same time.

What Happens After Election?

The new leader starts sending heartbeats.

Leader B

↓

Heartbeat

↓

Follower C

Everything returns to normal.

Applications now send writes to the new leader.

Real Example: WhatsApp

Imagine WhatsApp stores messages.

Leader DB

↓

Follower DB1

↓

Follower DB2

Leader crashes.

Automatic election:

Follower DB1

↓

New Leader

Users may experience a very brief delay, but messaging continues.

Popular Leader Election Algorithms

You don't need to know their internals immediately, but you should know their names.

1. Raft
Easier to understand.
Used in many modern distributed systems.
Popular in interviews.
2. Paxos
One of the earliest consensus algorithms.
More mathematically complex.
Foundation for many distributed systems.
3. ZooKeeper-based Election

Some applications use a coordination service (like Apache ZooKeeper) to perform leader election.

Advantages of Leader Election
1. Automatic Recovery

No administrator needs to manually promote a server.

2. High Availability

The application resumes writes quickly after a leader failure.

3. Fault Tolerance

The cluster continues operating despite node failures.

4. Consistency

Only one node is allowed to be the leader, reducing the risk of conflicting writes.

Disadvantages
Temporary Downtime

During the election:

Leader Failed

↓

Election

↓

New Leader

Some writes may pause briefly until the new leader is established.

Network Partitions

If the network splits, different groups of nodes may temporarily lose contact with each other.

Consensus algorithms use quorum rules to avoid electing multiple leaders in these situations.

Complete Flow
          Leader
             |
      Heartbeats
             |
    -----------------
    |               |
Follower A     Follower B

Leader crashes ❌

↓

No heartbeat

↓

Followers become candidates

↓

Vote

↓

New Leader Elected

↓

Heartbeats resume

↓

System recovers automatically
Interview Summary

If an interviewer asks:

"What is leader election?"

A strong answer is:

Leader election is the process by which a distributed system automatically selects a new leader when the current leader fails. Followers detect the failure through missed heartbeats, run an election using a consensus algorithm such as Raft or Paxos, and the winning node becomes the new leader. This enables automatic recovery, maintains high availability, and ensures that only one leader accepts writes at a time.

How It Fits into Resilience

You've now learned several resilience techniques, and they each address a different failure mode:

Technique	Solves What?
Load Balancer	Prevents a single server from becoming overloaded and routes around failed instances.
Circuit Breaker	Stops repeatedly calling an unhealthy service.
Data Redundancy	Ensures multiple copies of data exist.
Recovery	Restores service or data after failures.
Leader Election	Automatically chooses a new leader when the current one fails.

The next logical topic is Consensus—understanding how nodes agree on who the leader should be. Once you understand consensus (especially Raft), leader election becomes much clearer because you'll see the exact voting process, terms, and guarantees behind it.