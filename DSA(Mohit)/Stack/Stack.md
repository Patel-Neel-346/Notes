# Stack
- Make the array beautiful
	- https://www.geeksforgeeks.org/problems/make-the-array-beautiful--170647/1
- String manipulation
	- https://www.geeksforgeeks.org/problems/string-manipulation3706/1?page=1&difficulty%5B%5D=0&category%5B%5D=Stack&sortBy=submissions
- Minimum Add to Make Parentheses Valid
	- https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/description/?source=submission-ac
- Valid Parentheses
	- https://leetcode.com/problems/valid-parentheses/submissions/1167021401/
- Backspace String Compare
	- https://leetcode.com/problems/backspace-string-compare/description/
- Print Bracket Number
	- https://www.geeksforgeeks.org/problems/print-bracket-number4058/1?page=1&difficulty%5B%5D=0&category%5B%5D=Stack&sortBy=submissions
- Get min at pop
	- https://www.geeksforgeeks.org/problems/get-min-at-pop/1?page=1&category=Stack&difficulty=Easy&sortBy=submissions
- Next Greater Element
	- https://www.geeksforgeeks.org/problems/next-greater-element/1
 <details>
	Here we will use a stack technique called monotonic stack. 
	And there are possibly two solutions of this problem but the approach is same for  both of them.
	```js
		const result = new Array(n).fill(-1)
        const stack = []
        for(let i = 0; i < n; i++){
            if (i == 0){
                stack.push(i)
                continue;
            }
            
            while(arr[stack[stack.length - 1]] < arr[i]){
                result[stack[stack.length - 1]] = arr[i]
                stack.pop()
            }
            stack.push(i)
        }
        return result
	```js
	```js
	const result = new Array(arr.length).fill(-1)
	const stack =  []

	for(let i = arr.length - 1; i >= 0; i--){
		while(stack.length){
			const top = stack[stack.length - 1]	
			if(arr[top] > arr[i]){
				result[i] = arr[top]
				break;
			}else {
				
				stack.pop()
			}
		}
		stack.push(i)
	}
	```
 </details>
- Next Smaller Element
	- https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/description/
- Smallest Number on Left
	- https://www.geeksforgeeks.org/problems/smallest-number-on-left3403/1
- Stock Span
	- https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1
- Next Greater Element 2
	- https://leetcode.com/problems/next-greater-element-ii/description/
- Largest Rectangle in Histogram
	- https://leetcode.com/problems/largest-rectangle-in-histogram/description/
- Maximal Rectangle 
	- https://leetcode.com/problems/maximal-rectangle/description/