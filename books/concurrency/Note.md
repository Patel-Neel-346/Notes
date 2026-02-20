> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=40&selection=53,0,72,17|Effective Concurrency in Go by Burak Serdar, p.23]]
> > A process is an instance of a program with certain dedicated resources, such as memory space, processor time, file handles (for example, most processes in Linux have stdin, stdout, and stderr), and at least one thread.
>
> Definition of a process

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=41&selection=1,2,15,40|Effective Concurrency in Go by Burak Serdar, p.24]]
> >  A thread is an execution context that contains all the resources required to run a sequence of instructions. Usually, this contains a stack and the values of processor registers. The stack is necessary to keep the sequence of nested function calls within that thread, as well as to store values declared in the functions executing in that thread.
>
> Definition of a thread

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=41&selection=29,0,39,27|Effective Concurrency in Go by Burak Serdar, p.24]]
> > A goroutine is an execution context that is managed by the Go runtime (as opposed to a thread that is managed by the operating system). A goroutine usually has a much smaller startup overhead than an operating system thread.
>
> Definition of a go routine

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=42&selection=10,0,18,88|Effective Concurrency in Go by Burak Serdar, p.25]]
> > There are some more subtle differences between threads and goroutines. Threads usually have priorities. When a low-priority thread competes with a high-priority thread for a shared resource, the highpriority thread has a better chance of getting it. Goroutines do not have pre-assigned priorities. That said, the language specification allows for a scheduler that favors certain goroutines.
>
> Difference between go routine and a thread

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=42&selection=117,1,120,100|Effective Concurrency in Go by Burak Serdar, p.25]]
> > fmt.Println has mutual exclusion built in to ensure that the two goroutines do not corrupt each other’s outputs.
>
> `fmt` functions like `fmt.Print`, `fmt.Println`, and `fmt.Printf` **lock an internal mutex** (in the `os.Stdout` writer) to prevent output from being interleaved or corrupted when multiple goroutines write concurrently.

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=50&selection=6,56,22,55|Effective Concurrency in Go by Burak Serdar, p.33]]
> > An instance of context.Context is passed to each request handler that contains a Done() channel. If, for example, the client closes the connection before the request handler can prepare the response, the handler can check to see whether the Done() channel is closed and terminate processing prematurely.
>
> standard Go HTTP server does this automatically

```go
func handler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	select {
	case <-time.After(5 * time.Second): // simulate work
		fmt.Fprintln(w, "Done processing")
	case <-ctx.Done():
		// Client disconnected or server cancelled the context
		log.Println("Request cancelled:", ctx.Err())
	}
}
```

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=50&selection=66,0,70,13|Effective Concurrency in Go by Burak Serdar, p.33]]
> > For a receiver, it is usually important to know whether the channel was closed when the read happened. Use the following form to test the channel state:
> > ```go
> >  y, ok := <-ch
>>  ```

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=52&selection=10,37,34,50|Effective Concurrency in Go by Burak Serdar, p.35]]
> > Transferring a value from one goroutine to another transfers a copy of the value. So, if a goroutine runs ch<-x and sends the value of x, and another goroutine receives it with y<-ch, then this is equivalent to y=x, with additional synchronization guarantees. The crucial point here is that it does not transfer the ownership of the value. If the transferred value is a pointer, you end up with a shared memory system.

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=55&selection=35,0,41,32|Effective Concurrency in Go by Burak Serdar, p.38]]
> > There is a more idiomatic way of doing this. You can range over a channel in a for loop, which will exit when the channel is closed:
>
> Implicit exist of go routines when channel is closed

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=56&selection=67,8,77,71|Effective Concurrency in Go by Burak Serdar, p.39]]
> > If a default option does not exist, the select statement blocks until one of the channel operations becomes available.

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=57&selection=3,0,9,21|Effective Concurrency in Go by Burak Serdar, p.40]]
> > One of the frequently asked questions about goroutines is how to stop them. As explained before, there is no magic function that will stop a goroutine in the middle of its operation. However, using a non-blocking receive and a channel to signal a stop request, you can terminate a long-running goroutine gracefully:

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=61&selection=80,9,87,0|Effective Concurrency in Go by Burak Serdar, p.44]]
> > the select statement will block until it becomes ready even though there is a default case
>
> Case where select statement can block

> [!PDF|] [[Effective Concurrency in Go by Burak Serdar.pdf#page=63&selection=101,80,103,67|Effective Concurrency in Go by Burak Serdar, p.46]]
> > locking a mutex twice from the same goroutine will deadlock that goroutine.
