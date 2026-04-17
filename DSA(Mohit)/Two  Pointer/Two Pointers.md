- Segregate 0s and 1s
	- https://www.geeksforgeeks.org/problems/segregate-0s-and-1s5106/1
- Pair With Given Difference
	- https://www.geeksforgeeks.org/problems/find-pair-given-difference1559/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card
- Product Pair
	- https://www.geeksforgeeks.org/problems/equal-to-product3836/1
- Kadane's Algorithm
	- https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1
- Maximum Difference between 2 element
	- https://www.geeksforgeeks.org/problems/maximum-difference-1587115620/1?itm_source=geeksforgeeks&itm_medium=article&itm_campaign=practice_card
- Maximum prefix sum for a given range
	- https://www.geeksforgeeks.org/problems/maximum-prefix-sum-for-a-given-range0227/1
- Equal Sums
	- https://www.geeksforgeeks.org/problems/equal-sums4801/1
- Trapping rain water
	- https://leetcode.com/problems/trapping-rain-water/description/
- 3 Sum
	- https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1
- 4 Sum
	- https://www.geeksforgeeks.org/problems/four-elements2452/1
- Array 3 pointers
	- https://www.interviewbit.com/problems/array-3-pointers/
## Two Pointers
#### Sort array of 0's and 1's
https://www.geeksforgeeks.org/problems/segregate-0s-and-1s5106/1
****Brute***
1. count the occurances of 1
2. count the occurances of 0
3. run a loop and overwrite the the values
***Optimal***
```js
const arr = [0, 0, 1, 1, 0]
let i = 0
let j = arr.length - 1

while (i < j){
	if(arr[i] === 0 || arr[j] === 1){
		if(arr[i] === 0){
			while(arr[i] === 0){
				i++
			}	
		}else {
			while(arr[j] === 1)	{
				j--
			}
		}
	}else {
		arr[i] = 0
		arr[j] = 1
		i++
		j--			
	}	
}
console.log(arr)
```
## Pair with given difference
https://www.geeksforgeeks.org/problems/find-pair-given-difference1559/1
***Optimal***
You have to sort the array in order to use the two pointers technique

```js
const arr = [5, 20, 3, 2, 5, 80]
const diff = 78
arr.sort((a, b) => a - b)
let start = 0
let end = 1

while(start < arr.length && end < arr.length){
	const sum = arr[end] - arr[start]	
	if(sum < diff){
		end++
	}else if (sum > diff){
		start++
	}else {
		console.log('here is the answer',arr[start], arr[end])
		start++
		end++
	}
}
```
