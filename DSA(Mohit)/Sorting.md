### Bubble Sort

![Bubble gif](https://upload.wikimedia.org/wikipedia/commons/0/06/Bubble-sort.gif)


```go
package main
import "fmt"

func main() {
	nums := []int{4, 2, 6, 5, 1, 3}
	for i := len(nums) - 1; i > 0; i-- {
		for j := 0; j < i; j++ {
			if nums[j] > nums[j+1] {
				nums[j], nums[j+1] = nums[j+1], nums[j]
			}
		}
	}
	fmt.Println(nums)
}
```

### Selection Sort
![selection sort gif](https://www.doabledanny.com/static/1f66c277a7a820e3492149c6e499bdb1/2.gif)

```go
package main

import "fmt"

func main() {
	nums := []int{4, 2, 6, 5, 1, 3}
	min := 0
	for i := 0; i < len(nums); i++ {
		min = i
		for j := i + 1; j < len(nums); j++ {
			if nums[j] < nums[min] {
				min = j
			}
		}
		// this will happens when i reach to the end and min will 
		// also be i
		if min != i {
			nums[i], nums[min] = nums[min], nums[i]
		}
	}
	fmt.Println(nums)
}
```

### Insertion sort
![insertion sort gif](https://www.doabledanny.com/static/92b034385c440e08bc8551c97df0a2e3/2.gif)

```go
package main

import "fmt"

func main() {
	nums := []int{4, 2, 6, 5, 1, 3}
	for i := 1; i < len(nums); i++ {
		temp := nums[i]
		j := i - 1

		// Move elements of nums[0..i-1], that are greater than temp,
		// to one position ahead of their current position
		for j >= 0 && nums[j] > temp {
			nums[j+1] = nums[j]
			j--
		}
		nums[j+1] = temp
	}
	fmt.Println(nums)
}
```

### Merge sort
```go
package main

import "fmt"

func main() {
	fmt.Println(mergeSort([]int{7, 1, 5, 3, 6, 4}))
}
func mergeSort(arr []int) []int {
	if len(arr) == 1 {
		return arr
	}
	mid := len(arr) / 2
	left := arr[0:mid]
	right := arr[mid : len(arr)-1]
	return merge(mergeSort(left), mergeSort(right))
}
func merge(arr1 []int, arr2 []int) []int {
	combined := []int{}
	i := 0
	j := 0
	for i < len(arr1) && j < len(arr2) {
		if arr1[i] < arr2[j] {
			combined = append(combined, arr1[i])
			i++
		} else {
			combined = append(combined, arr2[j])
			j++
		}
	}
	for i < len(arr1) {
		combined = append(combined, arr1[i])
		i++
	}
	for j < len(arr2) {
		combined = append(combined, arr2[j])
		j++
	}
	return combined
}
```

### Quick sort
```go
package main

import "fmt"

func main() {
	nums := []int{4, 6, 1, 7, 3, 2, 5}
	sortedNums := quick(&nums, 0, len(nums)-1)
	fmt.Println(*sortedNums) // Output should be the fully sorted array
}

func quick(nums *[]int, left int, right int) *[]int {
	if left < right {
		p := pivot(nums, left, right)
		quick(nums, left, p-1)
		quick(nums, p+1, right)
	}
	return nums
}

func pivot(nums *[]int, pivotIndex int, endIndex int) int {
	swap := pivotIndex
	for i := pivotIndex + 1; i <= endIndex; i++ {
		if (*nums)[i] < (*nums)[pivotIndex] {
			swap++
			(*nums)[swap], (*nums)[i] = (*nums)[i], (*nums)[swap]
		}
	}
	(*nums)[pivotIndex], (*nums)[swap] = (*nums)[swap], (*nums)[pivotIndex]
	return swap
}
```