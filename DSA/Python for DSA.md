## 1️⃣ Fast Input / Output (VERY IMPORTANT)

### Basic Input

```python
x = int(input())
s = input()
a, b = map(int, input().split())
arr = list(map(int, input().split()))
```

### Multiple Lines

```python
n = int(input())
for _ in range(n):
    a, b = map(int, input().split())
```

### Fast I/O (for CP)

```python
import sys
input = sys.stdin.readline
print = sys.stdout.write
```

```python
print(str(x) + "\n")
```

---

## 2️⃣ Lists / Arrays

### Creation

```python
A = []
A = [1, 2, 3]
A = [0] * 10
A = list(range(10))
```

### Basic Operations

```python
len(A)
A.append(x)
A.pop()
A.pop(i)
A.insert(i, x)
A.remove(x)
A.extend(B)
```

### Slicing

```python
A[i:j]
A[i:j:k]
A[::-1]
A[:]
```

### Useful Built-ins

```python
min(A)
max(A)
sum(A)
sorted(A)
A.sort()
A.reverse()
```

---

## 3️⃣ Tuples

```python
t = (1, 2, 3)
a, b = t
```

Used as:

- dictionary keys
    
- heap elements
    
- immutable records
    

---

## 4️⃣ Strings (Very Common)

```python
s = "abc"
s.lower()
s.upper()
s.strip()
s.split()
s.replace("a", "b")
```

### String ↔ List

```python
list(s)
"".join(A)
```

---

## 5️⃣ Dictionaries (Hash Maps)

### Basic Dict

```python
d = {}
d[key] = value
d.get(key, 0)
```

### defaultdict ⭐⭐⭐

```python
from collections import defaultdict

d = defaultdict(int)
d = defaultdict(list)
d = defaultdict(set)
```

Example:

```python
d[x] += 1
d[x].append(y)
```

### Counter ⭐⭐⭐

```python
from collections import Counter

cnt = Counter(arr)
cnt.most_common(3)
```

---

## 6️⃣ Sets

```python
s = set()
s.add(x)
s.remove(x)
s.discard(x)
```

### Set Operations

```python
A | B   # union
A & B   # intersection
A - B   # difference
```

---

## 7️⃣ Heap (Priority Queue) ⭐⭐⭐

### Min Heap

```python
import heapq

h = []
heapq.heappush(h, x)
heapq.heappop(h)
```

### Max Heap

```python
heapq.heappush(h, -x)
-x = heapq.heappop(h)
```

### Heap of Tuples

```python
heapq.heappush(h, (cost, node))
```

---

## 8️⃣ Queue / Deque (BFS)

```python
from collections import deque

q = deque()
q.append(x)
q.appendleft(x)
q.popleft()
q.pop()
```

Used for:

- BFS
    
- sliding window
    
- monotonic queue
    

---

## 9️⃣ Binary Search (VERY IMPORTANT)

### bisect

```python
import bisect

bisect.bisect_left(A, x)
bisect.bisect_right(A, x)
```

---

## 🔟 Graph Algorithms

### Adjacency List

```python
from collections import defaultdict

graph = defaultdict(list)
graph[u].append(v)
```

### BFS

```python
from collections import deque

q = deque([start])
visited = set([start])

while q:
    node = q.popleft()
    for nei in graph[node]:
        if nei not in visited:
            visited.add(nei)
            q.append(nei)
```

### DFS (Recursive)

```python
def dfs(u):
    visited.add(u)
    for v in graph[u]:
        if v not in visited:
            dfs(v)
```

---

## 1️⃣1️⃣ Math Functions

```python
import math

math.gcd(a, b)
math.lcm(a, b)
math.sqrt(x)
math.ceil(x)
math.floor(x)
```

### Power

```python
pow(a, b)
pow(a, b, mod)   # FAST
```

---

## 1️⃣2️⃣ Useful Built-ins

```python
abs(x)
enumerate(A)
zip(A, B)
reversed(A)
any(A)
all(A)
```

---

## 1️⃣3️⃣ List Comprehensions ⭐⭐⭐

```python
[x*x for x in A]
[x for x in A if x % 2 == 0]
```

### 2D

```python
[[0]*m for _ in range(n)]
```

❌ NEVER DO:

```python
[[0]*m]*n
```

---

## 1️⃣4️⃣ Sorting Tricks

```python
A.sort(key=lambda x: x[1])
sorted(A, reverse=True)
```

---

## 1️⃣5️⃣ Bit Manipulation

```python
x & y
x | y
x ^ y
x << 1
x >> 1
```

Check power of two:

```python
x & (x - 1) == 0
```

---

## 1️⃣6️⃣ Prefix Sum / Accumulation

```python
from itertools import accumulate

pref = list(accumulate(A))
```

---

## 1️⃣7️⃣ Useful CP Patterns

### Frequency Array

```python
freq = [0]*26
freq[ord(c) - ord('a')] += 1
```

### Sliding Window

```python
l = 0
for r in range(n):
    # expand
    while condition:
        # shrink
        l += 1
```

---

## 1️⃣8️⃣ Time Complexity Helpers

```python
import time
```

(Not usually allowed in contests, but useful locally)

---

## 1️⃣9️⃣ Common Imports Template ⭐⭐⭐

```python
import sys
import math
import heapq
import bisect
from collections import defaultdict, deque, Counter
```

---

## 🔚 Final Advice

If you master:

- `list`, `dict`, `set`
    
- `defaultdict`, `Counter`
    
- `heapq`, `deque`
    
- `bisect`
    
- BFS / DFS templates
    

You can solve **90% of LeetCode + CP problems**.
