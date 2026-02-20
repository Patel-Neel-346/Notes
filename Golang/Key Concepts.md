#### 🧠 Recap: Value vs Pointer Receiver

In Go, methods can be defined on **value receivers** or **pointer receivers**:

- **Value receiver**: `func (p Person) Greet()`
    - Works on both `Person` and `*Person`
        
- **Pointer receiver**: `func (p *Person) Greet()`
    - Only works on `*Person`

---
###### 🧪 Example 1: Value receiver works with both value and pointer

```go
package main
import "fmt"

type Greeter interface {
    Greet()
}

type Person struct {
    name string
}

// Value receiver
func (p Person) Greet() {
    fmt.Println("Hello,", p.name)
}

func main() {
    var g1 Greeter = Person{name: "Alice"}   // ✅ OK
    var g2 Greeter = &Person{name: "Bob"}    // ✅ OK

    g1.Greet() // Hello, Alice
    g2.Greet() // Hello, Bob
}
```

✅ **Why it works**: A value receiver method (`Person.Greet`) can be called on both a value and a pointer.

---
###### 🧪 Example 2: Pointer receiver works only with pointer

```go
package main
import "fmt"

type Greeter interface {
    Greet()
}

type Person struct {
    name string
}

// Pointer receiver
func (p *Person) Greet() {
    fmt.Println("Hello,", p.name)
}

func main() {
    var g1 Greeter = &Person{name: "Alice"} // ✅ OK
    // var g2 Greeter = Person{name: "Bob"} // ❌ ERROR: Person does not implement Greeter

    g1.Greet() // Hello, Alice
}
```

❌ **Why g2 fails**: `Person` does not have the method `Greet()` (it's only defined for `*Person`). So assigning a **value** (non-pointer) to the interface doesn't satisfy it.

---
###### 🧪 Example 3: Interface method with pointer receiver — assignment must match

```go
type Doer interface {
    Do()
}

type Task struct{}

func (t *Task) Do() {
    fmt.Println("Doing task...")
}

func main() {
    var d1 Doer = &Task{} // ✅ OK
    // var d2 Doer = Task{} // ❌ ERROR: Task does not implement Doer

    d1.Do()
}
```

🔧 Fix for `d2`: Use a pointer: `&Task{}`

---
###### 🔍 Summary Table

|Method Type|Assign `Struct` to Interface|Assign `*Struct` to Interface|
|---|---|---|
|`func (p Person) Method()`|✅ OK|✅ OK|
|`func (p *Person) Method()`|❌ Not OK|✅ OK|
#### Type Assertions
###### Type assertions
Then given below statement can panic while doing type discovery, in the current example we are able to the see the value of the variable and that's why it's not that problematic.
```go
var a any = "hello"
b := a.(string)
```
Doing type assertions with checks
```go
var a any = 3
if b,ok := a.(string); ok {
	fmt.Println(b)
}
```
###### Difference between Type assertion and Type discovery
- Type assertion is type discovery which can panic(throw error) if the type is different what we are expecting it to be.
- Type casting is converting the value into another type
```go
a := 3
b := string(a)
```
###### An example with interfaces
```go
type PersonActivities interface {
    Sleep() 
}
type Person struct {
    name    string
    age     int
}

func (p *Person) Sleep(){
    fmt.Printf("Person: %s is sleeping",p.name)
}
func (p *Person) Play(){
    fmt.Printf("Person: %s is playing",p.name)
}

func main(){
    var mohit PersonActivities = &Person{
        name: "mohit",
        age:16,
    }
    if val,ok := mohit.(interface {Sleep()}); ok {
        val.Sleep()
    }else {
        fmt.Println("method sleep does not exist")
    }
}
```

#### HTTP server in GO
```go
http.ListenAndServer(":3000",nil)
```
`ListenAndServer` method accepts two arguments first is port and the second is `mux` a multiplexer to which go can send the request.
If we provide the nil in the second parameter then go will use the default server mux and it will send all the requeste to default server mux.
###### Way to register controllers in the default server mux
```go
http.Handle("/hello",http.HandlerFunc(func(_ http.ResponseWriter, r *http.Request){
	
}))
http.ListenAndServer(":3000",nil)
```
`http.Handle` function accept two things route path and then a type(function,struct,int,bool) which has a method receiver of `ServeHTTP` which accepts response and request as arguments.
For developers sake there a already a type called `http.HandlerFunc` so that we don't have to create our own type.
```go
// --- From Go std
type HandlerFunc func(ResponseWriter, *Request)

// ServeHTTP calls f(w, r).
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	f(w, r)
}
```
🫵​ Wait there's another way instead of wrapping every function in this type 
```go
http.HandleFunc("/hello",func(_ http.ResponseWriter, r *http.Request){
	
})
http.ListenAndServer(":3000",nil)
```
this function in the http module called `HandleFunc` internally wrapps the function with the `HandlerFunc` type then calls the function
```go
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {
	if use121 {
		DefaultServeMux.mux121.handleFunc(pattern, handler)
	} else {
		DefaultServeMux.register(pattern, HandlerFunc(handler)) // 👈​ here
	}
}
```
Now what is this use121 it is for those who want to use the router implementation of go 1.21.

​🤜​ One more  way of creating the servers in go
```go
func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("/greet", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Greetings!")
    })

    mux.Handle("/custom", HelloHandler{})

    server := &http.Server{
        Addr:    ":8080",
        Handler: mux,
    }

    fmt.Println("Server running on http://localhost:8080")
    server.ListenAndServe()
}
```
