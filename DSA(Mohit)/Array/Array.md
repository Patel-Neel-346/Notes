- Check if rotated array is sorted
	- https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/description/
	- Find the dip and after getting the dip use a function which return true or false if array is sorted. 
	  And now check if the two parts of the array separated by dip are sorted or not 
```python fold
from typing import List
class Solution:
    def check(self, nums: List[int]) -> bool:
        dip = False
        idx = 0
        n = len(nums)
        
        # Check for the dip point using modulo to handle circular array
        while idx < n:
            next_idx = (idx + 1) % n
            if nums[idx] > nums[next_idx]:
                if dip:  # If we already found a dip before
                    return False
                dip = True
            idx += 1
            
        return True
		# another
		    def check(self, nums: List[int]) -> bool:
        n = len(nums)
        count = 0
        
        for i in range(n):
            if nums[i] > nums[(i + 1) % n]:  # use modulo to compare last and first
                count += 1
        return count <= 1
```
##### Two pointers
- Pair with given difference
	- https://www.geeksforgeeks.org/problems/find-pair-given-difference1559/1
- Number of ways to split an array
	- https://leetcode.com/problems/number-of-ways-to-split-array/
  - The first solution would be an n^2 solution get the sum from the and the right and compare if left is greater or equal to the right so that we can increment the counter and return it at the end. 
```python fold
# Prefix Sum
class Solution:
    def waysToSplitArray(self, nums: List[int]) -> int:
        total  = sum(nums) 
        left_total = 0
        count = 0
        for i in range(len(nums)):
            val = nums[i]
            left_total += val
            right = total - left_total
            print(left_total,right)
            if left_total >= right:
                count += 1
        return count
```

- Zero sum subarray
	- https://www.geeksforgeeks.org/problems/zero-sum-subarrays1825/1
```python fold
 def findSubarray(self, arr):
        #code here.
        seen = {0:1}
        prefix = 0
        count = 0
        for val in arr:
            prefix += val
            if prefix in seen:
                count += seen[prefix]
                seen[prefix] += 1
            else:
                seen[prefix] = 1
        return  count
```

- Longest subarray  with sum k
	- https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1
```python fold
# brute force: get all the subarrays
n = len(arr)
ans = 0
for i in range(n):
    for j in range(i,n):
        curr = 0
        for l in range(i,j + 1):
            curr += arr[l]
        if curr == k:
            ans = max((j - i + 1), ans)
print(ans)
# better: get all the subarrays
n = len(arr)
ans = 0
for i in range(n):
    curr = 0
    for j in range(i,n):
        curr += arr[j]
        if curr == k:
            ans = max((j - i + 1), ans)
print(ans)
# prefix sum: it works for both array with only positive and array with negative. This is the optimal solution when array
# hash both negative and positive.
		prefix_map = {0: -1}  # Initialize with 0 sum at index -1

		max_length = 0
		current_sum = 0
		
		for i in range(len(nums)):
				# Update running sum
				current_sum += nums[i]
				
				# If (current_sum - k) exists in map, we found a subarray with sum k
				if current_sum - k in prefix_map:
						max_length = max(max_length, i - prefix_map[current_sum - k])
				
				# Only add to map if this sum hasn't been seen before
				# (we want the earliest occurrence to get the longest subarray)
				if current_sum not in prefix_map:
						prefix_map[current_sum] = i
		
		return max_length

# Sliding window: This solution won't work in array which includes both the positive and negative values.
def longestSubarrayWithSumK_slidingWindow(nums, k):
    left = 0
    current_sum = 0
    max_length = 0
    
    for right in range(len(nums)):
        # Add the current element to our running sum
        current_sum += nums[right]
        
        # If current_sum exceeds k, shrink window from the left
        # until we're back to <= k
        while current_sum > k and left <= right:
            current_sum -= nums[left]
            left += 1
        
        # If we have exactly k, update max_length
        if current_sum == k:
            max_length = max(max_length, right - left + 1)
    
    return max_length
```

- Longest consequtive subsequence in an array
```python fold
# brute force to check for every subsequence
nums = [100,4,200,1,3,2]
ans = 0
for val in nums:
    count = 1
    while val + count in nums:
        count += 1
    ans = max(ans,count)

print(ans)
# better
nums = [0,3,7,2,5,8,4,6,0,1]
nums.sort()

curr = float("-inf")
count = 0
ans = 0

for i in range(len(nums)):
    if curr == float("-inf"):
        curr = nums[i]
        count += 1
        continue
    if curr == nums[i] :
        continue
    if curr + 1 == nums[i]:
        count += 1
        curr = nums[i]
    else :
        ans = max(ans,count)
        count = 0
        curr = nums[i]
print(ans)
# optimal
seen = set(nums)
ans = 0
for val in seen:
		if val - 1 not in seen:
				count = 0 
				while val + count in seen:
						count += 1
				ans = max(count,ans)
return ans
```

- 3 Sum
	- https://leetcode.com/problems/3sum/
```python fold
        arr.sort()
        result = []
        for i in range(len(arr)):
            j = i + 1
            k = len(arr) - 1
            if i > 0 and arr[i] == arr[i - 1]:
                continue
            while j < k:
                s = arr[i] + arr[j] + arr[k]
                if s > 0:
                    k -= 1
                elif s < 0:
                    j += 1
                else:
                    result.append([arr[i],arr[j],arr[k]])
                    j += 1
                    k -= 1
                    # skip the duplicates:
                    while j < k and arr[j] == arr[j - 1]:
                        j += 1
                    while j < k and arr[k] == arr[k + 1]:
                        k -= 1
        return result
```
