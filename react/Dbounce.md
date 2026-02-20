Dbounce react implementation 
```tsx
import { useEffect, useState } from "react";

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```
Javascript implementation
```js
function test(data){
    console.log(`from test function ${data}`)
}

function debounce(func,time){
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
             func(args) 
        },time)
    }
}
const callDebounce = debounce(test,5000)
callDebounce('mohit1')
callDebounce('mohit2')
callDebounce('mohit3')
callDebounce('mohit4')
callDebounce('mohit5')
callDebounce('mohit6')
callDebounce('mohit7')
callDebounce('mohit8')
callDebounce('mohit9')
```