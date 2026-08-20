### Way to check if the given number is prime or not
```go
func solve(n int) bool {
	for i := 2; i < n; i++ {
		if n%i == 0 {
			return false
		}
	}
	if n == 1 || n == 0 {
		return false
	}
	return true
}
// optimized version
func prime(n int) bool {
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	if n == 1 || n == 0 {
		return false
	}
	return true
}
```
