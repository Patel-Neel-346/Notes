- Fibonacchi sequence
```go fold
func fib(n int) int{
    if n <= 0 {
        return 0
    }
    if n == 1 {
        return 1
    }
    return fib(n - 1) + fib(n - 2)
}
```
- Print all items of the array
- Sum of all elements
```go fold
func sum(arr []int, idx int) int { // Corrected function signature
    if idx == len(arr) {
        return 0
    }
    return arr[idx] + sum(arr, idx+1)
}
```
- Find smallest element in a array
- Linear search
	- https://www.geeksforgeeks.org/problems/search-an-element-in-an-array-1587115621/1
```python fold
 def search(self, arr, x):
        def find(arr,index):
            n = len(arr)
            if n == index:
                return -1
            if arr[index] == x:
                return index
            return find(arr,index + 1)
        return find(arr,0)
```
- Binary Search
	- https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1
- Sort an array using recursion
```python fold
def put(arr,val):
    n = len(arr)
    if n == 0:
        arr.append(val)
        return
    if arr[n -1] > val:
        item = arr.pop()
        put(arr,val)
        return arr.append(item)
    else :
       return arr.append(val)
def sort(arr):
    if len(arr) == 1:
        return
    item = arr.pop()
    sort(arr)
    return put(arr,item)

a = [1,2,8,5,99,-1,232]
sort(a)
print(a)
```
- Check if string is plaindrome
```go fold
func palindrom(str string, start int, end int) bool {
    if end <= start {
        return true
    }
    if str[start] != str[end] {
        return false
    }
    return true && palindrom(str,start + 1, end - 1)
}
```
- Count Vowels in a string
```go fold
func isVowel(ch byte) bool {
    switch ch {
    case 'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U': // Check for vowels (both lowercase and uppercase)
        return true
    default:
        return false
    }
}

// Recursive function to count vowels in a string
func count(str string, idx int) int {
    if idx == len(str) { // Base case: when idx reaches the length of the string
        return 0
    }
    
    var value int
    if isVowel(str[idx]) {
        value = 1
    } else {
        value = 0
    }
    
    return value + count(str, idx+1) // Recursive call with next index
}
```
- Print all subsequence in a array
	- https://leetcode.com/problems/subsets/description/
```python fold
main = []
def printSubset(arr,idx,temp):
    n = len(arr)
    if idx == n:
        main.append(temp.copy())
        return
    temp.append(arr[idx])
    printSubset(arr,idx + 1,temp)
    temp.pop()
    printSubset(arr,idx + 1,temp)
printSubset([1,2,3],0,[])
print(main)
```
- Generate all parantheses
	- https://leetcode.com/problems/generate-parentheses/description/
```python fold
def printParanthesis(str,n,left,right):
    if left == n and right == n:
        print(str)
        return
    if right < left:
        printParanthesis(str + ")",n,left,right + 1)
    if left < n:
        printParanthesis(str + "(",n,left + 1,right)
printParanthesis("",3,0,0)
```
- Print all subsequence in a string 
```go fold
func subsequence(str string, idx int, temp string, result *[]string) {
    if idx == len(str) { // Use '==' instead of '==='
        *result = append(*result, temp) // Append to the result via pointer
        return
    }
    subsequence(str, idx+1, temp+string(str[idx]), result)
    subsequence(str, idx+1, temp, result)
}
```
- Subset sum
	- Give the sum of all the subsets of an array
```python fold
main = []
def subsetSum(arr,idx,sum):
    if idx == len(arr):
        main.append(sum)
        return
    subsetSum(arr,idx + 1,sum + arr[idx])
    subsetSum(arr,idx + 1,sum)
subsetSum([1,3,5],0,0)
print(main)
```
- Target sum
	- https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1
```python fold
def targetSum(arr,idx,sum):
# these two extra conditions because in gfg you will get TLE due to long input. These are two 
# prevent the recursion from exploring more  branches after this
    if sum == target:
        return True 
    elif sum > target:
        return False
# this is for when sum is still low and index is reached to end.
    if idx == len(arr):
        return sum == target
    return targetSum(arr,idx + 1,sum + arr[idx]) or targetSum(arr,idx + 1,sum)
targetSum([1,3,5],0,0)
```
- Perfect sum
	- !This solution won't work without DP.
	- https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1
```python fold
def targetSum(arr,idx,sum):
    if idx == len(arr):
        return sum == target if 1 else  0
    return targetSum(arr,idx + 1,sum + arr[idx]) + targetSum(arr,idx + 1,sum)
targetSum([1,3,5],0,0)
```
- Target sum with repitition
	- where we can select the elements inside the array as many times as we want
```python fold
def repeat(arr,idx,sum):
    if sum == 0:
        return 1
    elif sum < 0:
        return 0
    if idx == len(arr):
        return sum == 0 if 1 else 0
    return repeat(arr,idx + 1, sum) + repeat(arr,idx, sum - arr[idx])
print(repeat([2,3,4],0,6))
```
- Permutation
```python fold
main = []
def permute(arr,temp,visited):
    if len(arr) == len(temp):
        main.append(temp.copy())
        return
    for i in range(len(arr)):
        if visited[i] == 0:
            temp.append(arr[i])
            visited[i] = 1
            permute(arr,temp,visited)
            visited[i] = 0
            temp.pop()
    
permute([1,2,3],[],[0,0,0])
print(main)
# solution with less space
main = []
def permute(arr,idx):
    n = len(arr)
    if n == idx:
        main.append(arr.copy())
        return
    for i in range(idx,n):
        arr[i],arr[idx] = arr[idx],arr[i]
        permute(arr,i + 1)
        arr[i],arr[idx] = arr[idx],arr[i]
permute([1,2,3],0)
print(main)
```
- Permutation 2
```python fold

```
- Rat in a maze
```python fold
mat = [[1, 0, 0, 0], 
       [1, 1, 0, 1], 
       [1, 1, 0, 0], 
       [0, 1, 1, 1]]
n = len(mat)
visited = [[0 for i in range(n)] for i in range(n)]
result = []
# Directions for Down, Up, Left, Right
row = [1, -1, 0, 0]
col = [0, 0, -1, 1]
direction = "DULR"

def valid(i, j):
    return i >= 0 and j >= 0 and i < n and j < n

def find(mat, path, i, j):
    # Base case: reached destination
    if i == n - 1 and j == n - 1:
        result.append(''.join(path))
        return
    
    # Mark current cell as visited
    visited[i][j] = 1
    
    # Try all 4 directions
    for k in range(4):
        new_i = i + row[k]
        new_j = j + col[k]
        if (valid(new_i, new_j) and 
            mat[new_i][new_j] == 1 and 
            not visited[new_i][new_j]):  # Fixed !visited to not visited
            
            path.append(direction[k])     # Fixed apppend to append
            find(mat, path, new_i, new_j)
            path.pop()                    # Backtrack by removing last direction
    
    # Unmark current cell when backtracking
    visited[i][j] = 0

# Check if starting position is valid
if mat[0][0] == 1:
    find(mat, [], 0, 0)
print(result)
```
- N Quees
	- https://leetcode.com/problems/n-queens/
```python fold
n = 4
ans = []
board = [["." for i in range(n)] for i in range(n)]
columns = [False] * n

def check(n, board, row, col):
    # Check upper diagonal on left side
    for i, j in zip(range(row-1, -1, -1), range(col-1, -1, -1)):
        if board[i][j] == "Q":
            return False
            
    # Check upper diagonal on right side
    for i, j in zip(range(row-1, -1, -1), range(col+1, n)):
        if board[i][j] == "Q":
            return False
            
    # No need to check downward diagonals as we're placing queens row by row
    # No need to check columns as we're using columns array
    return True

def find(row, n, board, columns):
    if row == n:
        # Deep copy the current board state
        current = []
        for r in board:
            current.append(r[:])
        ans.append(current)
        return
        
    for col in range(n):
        if not columns[col] and check(n, board, row, col):
            columns[col] = True
            board[row][col] = 'Q'
            find(row + 1, n, board, columns)
            columns[col] = False
            board[row][col] = '.'

# Start the recursion
find(0, n, board, columns)

# Print results
for solution in ans:
    for row in solution:
        print(row)
    print()
		
# optimized approach
n = 4
ans = []
board = [["." for i in range(n)] for i in range(n)]
columns = [False] * n
leftDig = [False]* (2 * n - 1)
rightDig = [False]* (2 * n - 1)

def find(row, n, board, columns):
    if row == n:
        # Deep copy the current board state
        current = []
        for r in board:
            current.append(r[:])
        ans.append(current)
        return
    # Left dignal -> n-1+col-row
    # Right dignal -> row + col
        
    for col in range(n):
        if (not columns[col] and
            not leftDig[n - 1 + col - row] and 
            not rightDig[row + col]) :
            leftDig[n - 1 + col - row] = True
            rightDig[row + col] = True
            columns[col] = True
            board[row][col] = 'Q'
            find(row + 1, n, board, columns)
            columns[col] = False
            board[row][col] = '.'
            leftDig[n - 1 + col - row] = False
            rightDig[row + col] = False

# Start the recursion
find(0, n, board, columns)
result = []
for solution in ans:
    temp = []
    for row in solution:
        temp.append("".join(row))
    result.append(temp)
print(result)

```