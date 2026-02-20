###### Buffers
Buffers are used by streams node.js to handle binary data because they are more optimized for it rather than arrays.
```js
const buffer = Buffer.alloc(5)
buffer.fill("hi",0,2) // filling the buffer manual after allocating memory.

const anotherBuffer = Buffer.alloc(6)
anotherBuffer.set(buffer,buffer.byteOffset)
console.log(anotherBuffer)

const msg = 'hello'
const withBuffer = Buffer.from(msg) // this is what you will see in production.
```
The numbers what we see in buffer are the ascii representation of strings.

Here's an example markdown table with the event-highlight column:
