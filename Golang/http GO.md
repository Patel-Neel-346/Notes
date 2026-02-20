There is **one single interface** that matters:  
```go  
type Handler interface {  
    ServeHTTP(ResponseWriter, *Request)  
}  
```  
Anything that implements `ServeHTTP` **is a handler**.  
A helper utility to use functions as a `handler`  
```go  
type HandlerFunc func(ResponseWriter, *Request)func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {  
    f(w, r)  
}  
```
### Important  
- `ServeMux` **implements `Handler`**  
- Routing happens *inside* `ServeHTTP`  
**ServeMux** the router the handler and registry  
- `ServeMux` **implements `Handler`**  
- It is itself a handler  
- Routing happens _inside_ `ServeHTTP`  
```go  
type ServeMux struct {  
    // internal maps for patterns → handlers  
}func (mux *ServeMux) Handle(pattern string, handler Handler)  
func (mux *ServeMux) HandleFunc(pattern string, handler func(ResponseWriter, *Request))  
func (mux *ServeMux) ServeHTTP(w ResponseWriter, r *Request)  
```  
### Default instance  
```go  
var DefaultServeMux = &ServeMux{}  
```  
When you call:  
```go  
http.HandleFunc("/", fn)  
```  
You are really doing:  
```go  
http.DefaultServeMux.Handle("/", HandlerFunc(fn))  
```  
### What `http.Handle` really is (this is the adapter layer)  
```go  
func Handle(pattern string, handler Handler) {  
    DefaultServeMux.Handle(pattern, handler)  
}  
```  
And:  
```go  
func HandleFunc(pattern string, handler func(ResponseWriter, *Request)) {  
    DefaultServeMux.Handle(pattern, HandlerFunc(handler))  
}  
```  
So when you write:  
```go  
http.Handle("/", http.HandlerFunc(fn))  
```  
You are literally doing:  
```go  
http.DefaultServeMux.Handle("/", http.HandlerFunc(fn))  
```