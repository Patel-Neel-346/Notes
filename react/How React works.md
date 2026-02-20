### A simple overview how react react works
![[Screenshot 2023-10-22 192624.png]]

### Life cycles of react
![[Screenshot 2023-10-22 193437.png]]
#### The two situations that triggers rerender
- **Initial render** of the application
- **State update** anywhere in the component tree

Render process is triggered for entire application dom tree not just a particular component *but that doesn't mean the entire dom is updated.*

_In react render means calling the component functions and figuring out what need to be changed in the DOM later._

Dom updates do not triggered immediately when update happens but it is schedules when the javascript engine has the free time **but this difference can be for few mili seconds that we don't notice.**

There are some situations like multiple **setState** call in the same function where renders will be batched.

# How rendering works
In the intial render react will take entire component tree and transform it into one big react element tree ***this is also called as virtual dom, this tree is made of React.createElment() method under the hood.*** 

this is very cheap to create and even itrating over it rather than original browser dom. 

if any thing changes in a particullar tree node then react will rerender everything thing starting from that particullar node to the end of the tree _it won't matter that the props are changed or state has been updated._

![[Screenshot 2023-10-22 201546.png]]

This means if we change state in top level of the tree then entire tree will be rerendered.
It is happen because react doesn't know beforehand that the change will affect the child or not so have to render entire tree from that node.

![[Screenshot 2023-10-22 202020.png]]

That doesn't mean entire dom will be updated it's just the virtual dom which will be recreated which not really a big problem in small or medium size applications.

So what happens next that the new virtual dom which was created after the state update will get **Reconciled** with current **Fiber tree** as it exists before the state update.

This **Reconciliation** is done in react **Reconciler** which is called **Fiber** now that's we have a **Fiber tree**.

So the result of this reconciliation will be updated **Fiber tree** which will eventually be used to write to the DOM

![[Screenshot 2023-10-22 202919.png]]

## What is Reconciliation
#### Why do we need a reconciler and fiber tree instead of just updating the DOM whenver state changes ?
- Creating the virtual DOM *(React element tree)* is cheap and fast because it's just an javascript object. Writing to the DOM is not cheap and fast 
- When states changes only a particullar node need to be updated and rest of the DOM can be **reused**
- In the intial render there is not choice rather than creating a entire DOM from scratch, from there on doing so doesn't  make any sense 
_So react only updates the DOM when it sees differences between renders so to know these differences it uses the process called  **Reconcilation** under the hood._

**The current Reconciler in react is called *Fiber***

The reconcilation process is performed by reconciler. Reconciler never let's the react to touch the original dom directly instead it simly tells react what the next snapshot of the ui should look like based on state.

So in the intial render of the application **Fiber** takes entire *React elmenet tree* and builds another tree called **Fiber tree**

Fiber tree is the internal tree which has a separate fiber for each element in the tree.
***unlinke react elements in the virtual dom Fibers are not recreated in every rerender***.
So the fiber tree never destroyed or recreated instead it is a mutable data structure and once it has been created during the intial render it simply mutated over and over again in future reconciliation steps.
So this makes the **Fiber** perfect choice for tracking the things like *props,states,current component state* and more.
Each fiber also contains a queue of work to do like updating state updating refs running registered sideEffects performing DOM updates and so on,this is why fiber is also defined as a unit of work.

At fiber tree we will see that the fibers are arranged on different way than the elements in react element tree.
So instead of just parent child relationship Each first has a link to its parent and all the other parent have the link to their previous siblings.

![[Screenshot 2023-10-22 211930 1.png]]

In fiber work can be performed asynchronously, it means rendering process can be splited into chunks and can be paused ![[Screenshot 2023-10-22 212440.png]]
There are some parcticle uses of the asynchronous rendering like modern concurrent features of `react 18` like `suspense` and `transitions`
### Reconciliation proces
## Render face and Browser pain
Commit face is the final face where react write into the DOM 
Commiting face is synchronous so that react ensures that ui statys consistent

>[!inof] The render face is performed by react library which is core library of react and commit face is performed  by ReactDOM library

## Diffing algorithm

## How reaact handles events
React registers all the events to the root dom container(_div with root id in case of vite or CRA_)

