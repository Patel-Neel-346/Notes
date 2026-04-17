- Longest Substring without repeating characters
	- https://leetcode.com/problems/longest-substring-without-repeating-characters
```python fold
 def lengthOfLongestSubstring(self, s: str) -> int:
        seen = [0 for i in range(235)]
        j = 0
        ans = 0
        for i in range(len(s)):
            v = ord(s[i])
            if not seen[v]:
                seen[v] = 1
            else:
                ans = max(ans,i - j)
                while seen[v]:
                    seen[ord(s[j])] = 0
                    j += 1
                seen[v] = 1
        return ans
```
- Smallest distinct window
	- https://www.geeksforgeeks.org/problems/smallest-distant-window3132/1
```python fold
target = dict.fromkeys(s,0)
diff_count = len(target)
formed = 0
i,j = 0,0
start = 0
length = len(s)
while j < len(s):
    if target[s[j]] == 0:
        formed += 1
    target[s[j]] += 1
    while i <= j and formed == diff_count:
        if j - i + 1 < length:
            length = j - i + 1
            start = i
        target[s[i]] -= 1
        if target[s[i]] == 0:
            formed -= 1
        i += 1
    j += 1
print(length)
```
- Subarray Sums Divisible by K
	- https://leetcode.com/problems/subarray-sums-divisible-by-k/description/
```python fold
seen = {0:1}
prefix = 0
ans = 0

for val in nums:
    prefix += val
    operation = prefix % k
    calc = operation if operation >= 0 else operation + k  # Correct modulus adjustment for negatives
    if calc in seen:
        ans += seen[calc]
        seen[calc] += 1
    else:
        seen[calc] = 1  # Initialize count for this mod value

print(ans)
```
- Subarray Product Less Than K
	- https://leetcode.com/problems/subarray-product-less-than-k/description/
```python fold 
i,j = 0,0 
product = 1
ans = 0
while j < len(nums):
		product *= nums[j]
		while product >= k and i <= j:
				product /= nums[i]
				i += 1
		ans += j - i + 1
		j += 1
return ans
```
- Count Subarrays With Score Less Than K
	- https://leetcode.com/problems/count-subarrays-with-score-less-than-k/description/
```python fold
def countSubarrays(self, nums: List[int], k: int) -> int:
		i,j = 0,0 
		product = 0
		ans = 0
		while j < len(nums):
				product += nums[j]
				while (product * (j - i + 1))  >= k and i <= j:
						product -= nums[i]
						i += 1
				ans += j - i + 1
				j += 1
		return ans
```
- Number of subarrays having sum less than K
	- https://www.geeksforgeeks.org/number-subarrays-sum-less-k/ Solution link no practice link
- Minimum size subarray sum
	- https://leetcode.com/problems/minimum-size-subarray-sum/description/
```python fold
def minSubArrayLen(self, target: int, nums: List[int]) -> int:
		prefix = 0 
		i,j = 0,0
		ans = float("inf")
		while j < len(nums):
				prefix += nums[j]
				while prefix >= target and i <=j :
						ans = min(j - i + 1,ans)
						prefix -= nums[i]
						i += 1
				j += 1
		return ans if ans != float("inf") else 0
```
- Minimum Window Substring
	- https://leetcode.com/problems/minimum-window-substring/
```python fold
	def minWindow(self, s: str, t: str) -> str:
			if not s or not t or len(t) > len(s):
					return ""
					
			# Counter for characters in t
			counter_t = Counter(t)
			required = len(counter_t)
			
			# Tracking variables
			formed = 0
			window_counts = {}
			
			# Results
			min_len = float("inf")
			start = 0
			
			# Two pointers
			left, right = 0, 0
			
			# Expand the window
			while right < len(s):
					# Add one character from the right
					char = s[right]
					window_counts[char] = window_counts.get(char, 0) + 1
					
					# Check if we've met the requirement for this character
					if char in counter_t and window_counts[char] == counter_t[char]:
							formed += 1
					
					# Try to contract the window from the left
					while left <= right and formed == required:
							char = s[left]
							
							# Update result if current window is smaller
							if right - left + 1 < min_len:
									min_len = right - left + 1
									start = left
							
							# Remove the leftmost character
							window_counts[char] -= 1
							
							# If this character was part of t and now we don't have enough
							if char in counter_t and window_counts[char] < counter_t[char]:
									formed -= 1
							
							left += 1
					
					right += 1
					
			return s[start:start + min_len] if min_len != float("inf") else ""
```
- Length of Longest Subarray With at Most K Frequency
	- https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/description/
```python fold
seen = {} 
start = 0
end = 0
ans = 0
while end < len(nums):
		val = nums[end]
		seen[val] = seen.get(val,0) + 1
		while seen[val] > k:
				seen[nums[start]] -= 1
				start += 1
		ans = max(ans,end - start + 1) 
		end += 1
return ans
```
- Count Subarrays Where Max Element Appears at Least K Times
	- https://leetcode.com/problems/count-subarrays-where-max-element-appears-at-least-k-times/description/
```python fold
def countSubarrays(self, nums: List[int], k: int) -> int:
		target = max(nums) 
		count = 0
		ans = 0
		i,j = 0,0
		while j < len(nums):
				if nums[j] == target:
						count += 1 
				while count >= k:
						ans += len(nums) - j
						if nums[i] == target:
								count -= 1
						i += 1
				j += 1
		return ans
```
- Subarrays with K Different Integers
	- https://leetcode.com/problems/subarrays-with-k-different-integers/description/
```python fold
class Solution:
    def getLeastK(self,nums,k):
        seen = {}
        i,j = 0,0
        ans = 0
        while j < len(nums):
            seen[nums[j]] = seen.get(nums[j],0) + 1
            while len(seen) > k:
                seen[nums[i]] -= 1
                if seen[nums[i]] == 0:
                    del seen[nums[i]]
                i += 1
            ans += j - i + 1
            j += 1
        return ans
            
    def subarraysWithKDistinct(self, nums: List[int], k: int) -> int:
        return self.getLeastK(nums,k) - self.getLeastK(nums,k- 1)
```