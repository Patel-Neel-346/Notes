- Check if string is rotated by two places
	- https://www.geeksforgeeks.org/problems/check-if-string-is-rotated-by-two-places-1587115620/1
- Check if the Sentence Is Pangram
	- https://leetcode.com/problems/check-if-the-sentence-is-pangram/description/
```python fold
	seen = [0 for i in range(26)]
	for s in sentence:
			seen[ord(s) - ord('a')] = 1
	for val in seen :
			if val == 0:
					return False
	return True
```
- Sort a String
	- https://www.geeksforgeeks.org/problems/sort-a-string2943/1
```python fold
sentence = "leetcode"
seen = [0 for i in range(26)]
for s in sentence:
    seen[ord(s) - ord("a")] += 1
result = ""
for i in range(len(seen)):
    val = seen[i]
    while val:
        result += chr(i + ord("a"))
        val -= 1
print(result)
```
- Longest Palindrome
	- https://leetcode.com/problems/longest-palindrome/description/
```python fold
string = "abccccdd"
capital = [0 for i in range(26)]
small = [0 for i in range(26)]

for s in string:
    val = ord(s)
    if val >= ord("A") and val <= ord("Z"):
        capital[val - ord("A")] += 1
    else:
        small[val - ord("a")] += 1
ans = 0
isOdd = False
for val in small:
    if val == 0:
        continue

    if val % 2 == 0:
        ans += val 
    else :
        isOdd = True
        ans += val - 1

for val in capital:
    if val == 0:
        continue

    if val % 2 == 0:
        ans += val 
    else :
        isOdd = True
        ans += val - 1
print(ans + isOdd)
```
- Sorting the Sentence
	- https://leetcode.com/problems/sorting-the-sentence/description/
- Add Strings
	- https://leetcode.com/problems/add-strings/description/
- Sort Vowels in a String
	- https://leetcode.com/problems/sort-vowels-in-a-string/description/
- Case-specific Sorting of Strings
	- https://www.geeksforgeeks.org/problems/case-specific-sorting-of-strings4845/1?page=2&difficulty
- Integer to Roman
	- https://leetcode.com/problems/integer-to-roman/description/
- Roman to Integer
	- https://leetcode.com/problems/roman-to-integer/description/
- Longest substring without repeating characters
	- https://leetcode.com/problems/longest-substring-without-repeating-characters/description/
- Smallest distinct window
	- https://www.geeksforgeeks.org/problems/smallest-distant-window3132/1?page=1&difficulty
- Longest Prefix Suffix
	- https://www.geeksforgeeks.org/problems/longest-prefix-suffix2527/1
	