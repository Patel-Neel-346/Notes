### A fair playoff
```go
package main

import "fmt"

func main() {
    var t int
    fmt.Scan( & t)
    for range t {
        solve()
    }
}
func solve() {
    var a, b, c, d int
    var largest int
    var secondLargest int
    fmt.Scan( & a)
    fmt.Scan( & b)
    fmt.Scan( & c)
    fmt.Scan( & d)
    largest, secondLargest = getLargests(largest, secondLargest, a, b)
    largest, secondLargest = getLargests(largest, secondLargest, c, d)
    firstPair: = max(a, b)
    secondPair: = max(c, d)
    count: = 0
    if firstPair == largest || firstPair == secondLargest {
        count++
    }
    if secondPair == largest || secondPair == secondLargest {
        count++
    }
    if count < 2 {
        fmt.Println("NO")
    } else {
        fmt.Println("YES")
    }

}
func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}
func getLargests(large, slarge, a, b int)(int, int) {
    if a > large {
        slarge = large
        large = a
    }
    if b > large {
        slarge = large
        large = b
    }
    if a > slarge && a < large {
        slarge = a
    }
    if b > slarge && b < large {
        slarge = b
    }
    return large, slarge
}
```
### A. System of Equations
```go
package main

import (
    "fmt"
)

func main() {
    var n, m int
    fmt.Scan( & n)
    fmt.Scan( & m)
    count: = 0
    for i: = 0;
    (i * i) <= n;
    i++{
        for j: = 0;
        (j * j) <= m;
        j++{
            calcN: = (i * i) + j
            calcM: = i + (j * j)
            if calcN == n && calcM == m {
                count++
            }
        }
    }
    fmt.Println(count)
}
```

### A - Hexadecimal's theorem
```go
package main

import (
    "fmt"
)

func main() {
    var n int
    fmt.Scan( & n)
    fmt.Println(0, 0, n)
}
```

### A. Equation
```go
```