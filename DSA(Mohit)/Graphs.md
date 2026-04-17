-  BFS
	- https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1
```python fold 
from collections import deque
adj = [[2, 3, 1], [0], [0, 4], [0], [2]]
result = []
visited = [0] * len(adj)

queue = deque()
queue.append(0)
visited[0] = 1
while len(queue):
    item = queue.popleft()
    result.append(item)
    for i in adj[item]:
        if visited[i] == 0:
            queue.append(i)
            visited[i] = 1
print(result)
```
- DFS
	- https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1
```python fold
adj = [[2, 3, 1], [0], [0, 4], [0], [2]]
result = []
visited = [0] * len(adj)

def dfs(graph, key):
    visited[key] = 1          # mark immediately
    result.append(key)
    for item in graph[key]:
        if visited[item] == 0:
            dfs(graph, item)

dfs(adj, 0)
print(result)
```

