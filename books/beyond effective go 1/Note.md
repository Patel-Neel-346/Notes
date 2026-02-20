## Chapter 1

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=32&selection=0,0,0,30|beyond-effective-go-part-1-achieving-high-performance-code, p.32]]
> > Concurrency is not parallelism

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=41&selection=6,0,8,49|beyond-effective-go-part-1-achieving-high-performance-code, p.41]]
> > If the primary performance-limiting factor of a piece of work is the speed of the CPU or the number of CPU cores, then it is said to be CPU-bound. The performance of CPU-bound work can be improved by:
> 
> Points to consider

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=41&selection=15,0,17,12|beyond-effective-go-part-1-achieving-high-performance-code, p.41]]
> > On the other hand, if performance is primarily limited by I/O operations, then it is considered I/O bound. The performance of I/O bound work can be improved by:
> 
> Points to consider

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=42&selection=8,0,10,43|beyond-effective-go-part-1-achieving-high-performance-code, p.42]]
> > If performance is limited by synchronization or communication between the different concurrent parts of the application, then to improve performance, we need to do one or more of the following:
> 
> Points to consider

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=44&selection=2,0,3,70|beyond-effective-go-part-1-achieving-high-performance-code, p.44]]
> > We should also consider the additional costs of writing the code in the concurrent style and maintaining the resulting, more complicated code.
> 
> How to approach concurrent code

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=59&selection=1,0,2,22|beyond-effective-go-part-1-achieving-high-performance-code, p.59]]
> > Fan-in is used to combine the data from multiple input channels into a single output channel.
> 
> Fan in example

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=64&selection=1,0,2,9|beyond-effective-go-part-1-achieving-high-performance-code, p.64]]
> > Fan-out is used to split or spread one source of data over several output channels.
> 
> fan out example

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=68&selection=1,0,2,34|beyond-effective-go-part-1-achieving-high-performance-code, p.68]]
> > Multiplexing is a combination of fan-in and fan-out used to map multiple producers with multiple consumers.
> 
> multiplexing example

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=75&selection=2,0,3,30|beyond-effective-go-part-1-achieving-high-performance-code, p.75]]
> > Deadlocks occur when two or more goroutines are blocked waiting for resources held by each other. 
> 
> Definition and example of dead lock

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=79&selection=5,0,7,71|beyond-effective-go-part-1-achieving-high-performance-code, p.79]]
> > Starvation differs from deadlock as it does not cause all the goroutines to become blocked. Rather the effectiveness of the goroutine is hampered because it cannot run without frequent and/or prolonged interruptions. 
> 
> Definition and example

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=86&selection=2,0,4,24|beyond-effective-go-part-1-achieving-high-performance-code, p.86]]
> > Livelocks are a particular form of resource starvation where two or more goroutines are stuck repeating the same interaction without actually achieving any real work.
> 
> Live lock definition and example

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=90&selection=5,0,6,48|beyond-effective-go-part-1-achieving-high-performance-code, p.90]]
> > When appropriate, we should remove shared data and its associated locks. And instead, pass the data around via channels. 
> 
> Replace shared data with communication

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=99&selection=3,0,7,45|beyond-effective-go-part-1-achieving-high-performance-code, p.99]]
> > As we saw in our deadlock and livelock examples, when we have two synchronization primitives and both are required to perform our task, we create the possibility for a goroutine to acquire one and not the other. The most straightforward fix is to remove one synchronization primitive and group the data (for example, our chopsticks).
> 
> Reduce the number of synchronization primitives used

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=105&selection=2,1,6,16|beyond-effective-go-part-1-achieving-high-performance-code, p.105]]
> > n many cases, we lock a variable to ensure it does not change while we are using it. This sounds like a good idea, but we are thinking about the problem from the wrong perspective. We are not trying to prevent an update from happening; instead, we don’t want the update to impact our use of the data.
> 
> Trade memory for lock time

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=107&selection=0,0,0,28|beyond-effective-go-part-1-achieving-high-performance-code, p.107]]
> > Serialize access to the data
> 
> Do R&D what serializing it in the context of the given example.

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=113&selection=3,0,3,68|beyond-effective-go-part-1-achieving-high-performance-code, p.113]]
> > By len() like this, we can observe the amount of data in the channel
> 
> using buffered channels

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=117&selection=0,0,0,32|beyond-effective-go-part-1-achieving-high-performance-code, p.117]]
> > Avoid indeterminate select cases
> 
> How not to block the other cases when working with select statement

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=123&selection=5,0,5,12|beyond-effective-go-part-1-achieving-high-performance-code, p.123]]
> > A torn read 
> 
> What is/are torn read.

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=128&selection=0,0,0,20|beyond-effective-go-part-1-achieving-high-performance-code, p.128]]
> > Detecting data races
> 
> A paragraph about race detection 

### Sync/Atomic package
> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=133&selection=0,0,0,5|beyond-effective-go-part-1-achieving-high-performance-code, p.133]]
> > Add()

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=136&selection=0,0,0,18|beyond-effective-go-part-1-achieving-high-performance-code, p.136]]
> > Load() and Store()

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=139&selection=0,0,0,16|beyond-effective-go-part-1-achieving-high-performance-code, p.139]]
> > CompareAndSwap()

### The Sync Package
> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=146&selection=0,0,0,6|beyond-effective-go-part-1-achieving-high-performance-code, p.146]]
> > Once()

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=148&selection=0,0,0,17|beyond-effective-go-part-1-achieving-high-performance-code, p.148]]
> > Mutex and RWMutex

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=152&selection=0,0,0,4|beyond-effective-go-part-1-achieving-high-performance-code, p.152]]
> > Pool

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=155&selection=0,0,0,3|beyond-effective-go-part-1-achieving-high-performance-code, p.155]]
> > Map

> [!PDF|] [[beyond-effective-go-part-1-achieving-high-performance-code.pdf#page=156&selection=0,0,0,4|beyond-effective-go-part-1-achieving-high-performance-code, p.156]]
> > Cond

## Chapter 2
