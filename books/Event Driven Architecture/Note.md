> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=100&selection=91,0,95,56|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.81]]  
> > The communication between the modules is entirely synchronous and uses protocol buffers and gRPC.  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=100&selection=140,0,142,36|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.81]]  
> > We could use any other synchronous method to connect the modules that doesn't result in a cyclic dependency and a compile-time error.  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=103&selection=41,0,43,85|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.84]]  
> > When a bounded context needs data belonging to another bounded context, it has three options  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=104&selection=86,0,88,70|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.85]]  
> > To get a command to the bounded context that needs it, two options come to mind  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=105&selection=95,0,95,15|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.86]]  
> > Types of events  
>  
> Domain, Event Sourcing, Integration  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=107&selection=57,0,59,35|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.88]]  
> > Domain events will allow us to explicitly handle system changes, decoupling the work of handling the event from the point it was raised.  
>  
> putting the whole logic in the order created controller itself to send the notification and do other things.  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=109&selection=3,0,11,75|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.90]]  
> > We could add a slice for events with []Event and the methods to manage them, but we know better, and there are going to be other aggregates and handlers we will be updating  
>  
> Sharing common logic between aggregates  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=109&selection=78,67,84,28|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.90]]  
> > You may have noticed in the recent code snippets that all the fields of our Order domain aggregate are public.  
>  
> Why you will need to create getters and setters manually in go  
  
> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=110&selection=6,23,8,80|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.91]]  
> > If you decide to be very strict, then you would not implement any of the getters and would instead need to use builders and factories to construct the aggregates  
>  
> Using builders and factories to create aggregates

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=106&selection=6,0,12,73|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.87]]
> > A domain event is a concept that comes from domain-driven design. It is used to inform other parts of a bounded context about state changes. The events can be handled asynchronously but will most often be handled synchronously within the same process that spawned them.
> 
> 

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=106&selection=21,0,33,78|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.87]]
> > An event sourcing event is one that shares a lot in common with a domain event. These events will need to be serialized into a format so that they can be stored in event streams. Whereas domain events are only accessible during the duration of the current process, these events are retained for as long as they are needed. Event sourcing events also belong to an aggregate and will be accompanied by metadata containing the identity of the aggregate and when the event occurred.

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=106&selection=47,0,59,53|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.87]]
> > An integration event is one that is used to communicate state changes across context boundaries. Like the event sourcing event, it too is serialized into a format that allows it to be shared with other modules and applications. Consumers of these events will need access to information on how to deserialize to use the event at their end. Integration events are strictly asynchronous and use an event broker to decouple the event producer from the event consumers.

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=120&selection=22,0,34,31|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.101]]
> > Event streaming is when events are used to communicate state changes with other bounded contexts of an application. Event sourcing is when events are used to keep a history of the changes in a single context and can be considered an implementation detail and not an architectural choice that has application-wide ramifications.

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=123&selection=26,0,33,1|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.104]]
> > This variadic parameter will be used to modify the event prior to it being returned by the constructor as an Event.
> 
> Using variadic parameters for configurtion

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=170&selection=21,77,23,21|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.151]]
> > competing consumer pattern got its name.

> [!PDF|] [[Event-Driven_Architecture_in_Golang_-_Michael_Stack.pdf#page=219&selection=31,75,54,14|Event-Driven_Architecture_in_Golang_-_Michael_Stack, p.200]]
> > The first will be the Two-Phase Commit (2PC), which can offer the strongest consistency but has some large drawbacks. The other two are the Choreographed Saga and the Orchestrated Saga, which still offer a good consistency model and are excellent options when 2PCs are not an option.

