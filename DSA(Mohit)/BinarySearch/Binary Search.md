1. Find First and Last Position of Element in Sorted Array
	- https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/
2. Search Insert Position  
	- https://leetcode.com/problems/search-insert-position/description/
3. Sqrt(x): 
	- https://leetcode.com/problems/sqrtx/description/
4. Kth Missing Positive Number: 
	- https://leetcode.com/problems/kth-missing-positive-number/description/
5. Count the Zeros: 
	- https://www.geeksforgeeks.org/problems/count-the-zeros2550/1?page=1&difficulty
6. Number of occurrence: 
	- https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1
7. Cube root of a number: this is left make sure to solve this.
	- https://www.geeksforgeeks.org/problems/cube-root-of-a-number0915/1
8. Peak Index in a Mountain Array
	- https://leetcode.com/problems/peak-index-in-a-mountain-array/description/
9. Find Minimum in Rotated Sorted Array
	- https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
10. Search in Rotated Sorted Array
	- https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
11. Allocate minimum number of pages
	- https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1
12. The Painter's Partition Problem
	- https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1
13. Capacity To Ship Packages Within D Days
	- https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/
14. Koko Eating Bananas
	- https://leetcode.com/problems/koko-eating-bananas/description/ 
15. Split Array Largest Sum
	- https://www.geeksforgeeks.org/problems/split-array-largest-sum--141634/1
16. Aggressive cow
	- https://www.geeksforgeeks.org/problems/aggressive-cows/0
17. Magnetic Force Between Two Balls
	- https://leetcode.com/problems/magnetic-force-between-two-balls/description/
 
### Search Insert Position
```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        n = len(nums)
        i = 0
        j = n - 1
        ans = n
        while i <= j :
            mid = (i + j) // 2
            if nums[mid] >= target :
                ans = mid
                j = mid - 1
            else :
                i = mid + 1
        return ans

```
### Floor and Ceil
```python
def getFloorAndCeil(a, n, x):
    c = ceil(a, n, x)
    f = floor(a, n, x)
    
    ceil_val = a[c] if c != -1 else None
    floor_val = a[f] if f != -1 else None
    
    return floor_val, ceil_val


def ceil(a, n, x):
    ans = -1 
    i = 0
    j = n - 1
    while i <= j:
        mid = (i + j) // 2
        if a[mid] >= x:
            ans = mid
            j = mid - 1
        else:
            i = mid + 1
    return ans


def floor(a, n, x):
    ans = -1
    i = 0
    j = n - 1
    while i <= j:
        mid = (i + j) // 2
        if a[mid] <= x:
            ans = mid
            i = mid + 1
        else:
            j = mid - 1
    return ans
```

### Find first and last occurance 
```python
class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        if len(nums) == 1 and nums[0] == target:
            return [0, 0]
        
        l = lowerBound(nums, target)
        u = upperBound(nums, target)
        
        # Adjust to find the last occurrence of target
        if l == len(nums) or nums[l] != target:
            return [-1, -1]
        
        return [l, u - 1 if u != -1 else len(nums) - 1]
        
def lowerBound(nums,target):
    n = len(nums)
    i = 0
    j = n - 1
    ans = n
    while i <= j:
        mid = (i + j) // 2
        if nums[mid] >= target :
            ans = mid
            j = mid - 1
        else :
            i = mid + 1
    return ans

def upperBound(nums,target) :
    n = len(nums)
    i = 0
    j = n - 1
    ans = n
    while i <= j:
        mid = (i + j) // 2
        if nums[mid] > target :
            ans = mid
            j = mid - 1
        else :
            i = mid + 1
    return ans 
```

