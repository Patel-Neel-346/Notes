---
title: Debounce & Throttle Patterns in React & JavaScript
tags:
  - react
  - javascript
  - frontend
  - performance
  - hooks
type: technical-note
status: active
---

# ⏱️ Debounce & Throttle Patterns in React & JavaScript

### Fundamentals

- **Debouncing** and **Throttling** are performance optimization techniques used to limit how often a function executes in response to high-frequency events (e.g., keystrokes, window resizing, scroll events, mouse movements).
- **Debounce**: Delays execution until a specified quiet period (e.g., 300 ms) has passed since the *last* invocation. Every new event resets the timer.
- **Throttle**: Guarantees execution at a regular, fixed interval (e.g., at most once every 300 ms), regardless of how frequently events occur.

---

### Debounce vs. Throttle Comparison

```
Keystrokes:   ──|──|──|──────|────────|──|──|───────▶
                A  B  C      D        E  F  G

Debounced (300ms): ───────────[C]──────────[D]──────────[G]──▶
                   (Fires only after typing stops)

Throttled (300ms): ──[A]─────────[C]─────────[E]─────────[G]──▶
                   (Fires at steady, capped intervals)
```

| Technique | Core Behavior | Best Used For |
| :--- | :--- | :--- |
| **Debounce** | Executes only after user stops firing events for $N$ ms. | Search bar autocomplete, form auto-save, window resize calculations |
| **Throttle** | Executes at most once every $N$ ms. | Infinite scroll triggers, drag-and-drop tracking, mouse move canvas drawing |

---

### 1. ⚛️ React Custom Hook (`useDebounce`)

A clean, type-safe React hook that returns a debounced version of a changing state value:

```typescript
import { useState, useEffect } from "react";

/**
 * useDebounce Hook
 * @param value The reactive value to debounce
 * @param delay Milliseconds to wait before updating debouncedValue
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timer to update state after specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value changes (e.g., user is still typing) or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

#### Usage in Search Component
```tsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400); // 400ms delay

  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Trigger API search only after user pauses typing for 400ms
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then(res => res.json())
        .then(data => console.log('Search Results:', data));
    }
  }, [debouncedQuery]);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

---

### 2. 🟨 Vanilla JavaScript Implementation with `cancel()`

```javascript
/**
 * Creates a debounced function that delays invoking func until after wait ms
 */
function debounce(func, wait) {
  let timeoutId = null;

  function debounced(...args) {
    const context = this;
    
    // Clear previous pending timer
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Schedule new execution
    timeoutId = setTimeout(() => {
      func.apply(context, args);
      timeoutId = null;
    }, wait);
  }

  // Utility to cancel pending invocation (e.g. on route change)
  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

// Example usage:
const logSearch = (query) => console.log(`Searching for: ${query}`);
const debouncedSearch = debounce(logSearch, 300);

debouncedSearch("react");
debouncedSearch("react hooks");
debouncedSearch("react performance"); // Only this one will execute after 300ms!
```

---

### 🚨 Common React Gotchas

| Pitfall | Why It Breaks | Fix |
| :--- | :--- | :--- |
| **Inline Debounce in Render** | `const handle = debounce(fn, 300)` inside functional component creates a **brand new debounce instance on every render**. | Wrap with `useCallback` or `useMemo`: `useCallback(debounce(fn, 300), [])`. |
| **Unmounted State Updates** | Debounce timer fires after user navigated away, setting state on an unmounted component. | Always clear the timer in `useEffect` cleanup function. |

