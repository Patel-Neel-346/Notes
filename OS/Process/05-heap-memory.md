# Section 05 — Heap Memory

**Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## 1. Intuition

The stack is fast and self-cleaning, but it has a fatal limitation: everything in it disappears the instant its owning function returns, and its total size is small and fixed. That's fine for local variables you only need briefly — but what about data you want to create in one function and keep using long after that function has returned? Or data too large to comfortably fit in a limited stack?

That's what the **heap** is for: a large, flexible "dumping ground" for memory that the programmer explicitly requests, and — critically — must explicitly give back when done.

---

## 2. Why This Exists

Some data simply doesn't fit the stack's rigid, function-scoped lifetime model:

- Data structures that must outlive the function that created them (e.g., returned from a function, or shared across many functions).
- Large allocations (big arrays, buffers) that would exhaust the stack's limited space.
- Dynamically-sized data, where the required size isn't known until runtime.

The heap solves this by decoupling **allocation lifetime from function-call lifetime**: memory persists exactly as long as the programmer keeps it alive, regardless of which function is currently executing.

The trade-off is that this flexibility removes the stack's automatic cleanup — the heap requires manual bookkeeping, which is where a large class of classic bugs (leaks, dangling pointers, double frees) come from.

---

## 3. Core Concept

| Term | Definition |
|---|---|
| **Heap** | A region of process memory used for dynamic, programmer-controlled allocation, growing from low to high addresses. |
| **`malloc`** | A library/system call that requests a block of heap memory and returns a pointer to it. |
| **`free`** | A library/system call that releases a previously-`malloc`'d block back to the OS/allocator. |
| **Pointer** | A variable whose value is a memory address, typed according to what it points to (so the program knows how many bytes to read). |
| **Program Break** | The address marking the current "top" of the heap — the boundary between allocated heap space and the free space beyond it. |
| **Memory Leak** | Heap memory that remains allocated (never `free`d) after the program no longer holds any reference to it. |
| **Dangling Pointer** | A pointer that still holds the address of memory that has already been `free`d. |
| **Double Free** | Calling `free` twice on the same pointer — undefined behavior, typically a crash. |

> [!important] Heap growth direction
> Unlike the stack (high → low), the heap grows from **low addresses to high addresses**. Both eventually approach a shared, limited middle region of "free space" — this is why an unbounded heap or unbounded stack can eventually collide with (or exhaust space toward) the other.

---

## 4. Internal Working

### What a Pointer Actually Is

A pointer is a special data type: its value is an address, but its *type* tells the compiler how many bytes to read starting at that address to reconstruct the actual value.

```
address 33333 → holds the number 9000, stored across 4 bytes (an int pointer)
address 44444 → holds the character 'D', stored in 1 byte (a char pointer)
```

Without knowing the pointer's type, the CPU has no way to know whether to read 1, 4, or 8 bytes from that address — the type is what makes dereferencing meaningful.

> [!note] A pointer can live anywhere
> A pointer variable itself can be stored on the stack, in the data section, or even on the heap — and it can *point to* memory in the stack, data section, or heap, independent of where the pointer variable itself lives. The most common pattern is a stack-local pointer variable pointing into heap-allocated memory.

### Allocation — What `malloc` Actually Does

Calling `malloc(4)` (requesting 4 bytes) is far more involved than it looks:

1. **Parameter passed via register.** The requested size (4) is placed into a designated register (conventionally used for the first function/syscall parameter) before the call.
2. **Kernel mode switch.** `malloc` is (ultimately) backed by a system call. The process saves its current register state, base pointer, and return address — just like an ordinary function call — but also switches the CPU into **kernel mode**, since only the kernel is permitted to manage memory mappings.
3. **Allocation.** The kernel finds space, extends the process's heap (traditionally via `brk`/`sbrk`, moving the program break; modern allocators often use `mmap` instead), and — importantly — allocates in units of whole **pages** (commonly 4 KB), not the exact number of bytes requested. Requesting 4 bytes can still reserve a full 4 KB page behind the scenes.
4. **Metadata header.** Many `malloc` implementations write a small, fixed-size **header** just before the returned address, recording how large this specific allocation is. This is how a later `free(ptr)` call — which only receives the pointer, not the size — knows exactly how many bytes to release.
5. **Return address in register.** The address of the newly allocated block is placed into the return-value register, then copied by the calling code into the pointer variable.
6. **Return from kernel mode**, restoring the caller's saved registers, base pointer, and program counter.

> [!warning] Why this is expensive compared to the stack
> Every `malloc`/`free` call pays for: (1) a full kernel mode switch, (2) potential page-table/allocator bookkeeping, and (3) a metadata header read/write. None of this applies to stack allocation, which is a single register subtraction. This is the fundamental reason the stack is dramatically faster than the heap for allocation.

### Deallocation — What `free` Actually Does

`free(ptr)` looks up the header stored just before `ptr`, reads how many bytes were originally allocated, and releases exactly that much memory back to the allocator/kernel — which is how it "magically" knows the size despite only receiving a bare pointer.

Deallocating memory in the *middle* of the heap (rather than at the very top) is more complex than the stack's simple pointer-decrement, because that freed region may be surrounded by memory that's still in active use — the space can't simply be "popped." This is why heap deallocation, unlike stack deallocation, requires real bookkeeping (e.g., free lists, coalescing adjacent free blocks).

### The Program Break

Historically, heap growth was managed via `brk` (set the program break to an absolute address) and `sbrk` (adjust it by a relative amount) — think of the program break as a pointer to the current top of the heap. Calling `sbrk(+N)` claims N more bytes; `sbrk(-N)` releases N bytes from the top.

> [!note] Modern practice
> Directly using `brk`/`sbrk` is discouraged, since many other system calls and library functions rely on them internally, and manual manipulation risks fighting with the allocator. Modern allocators frequently use `mmap` instead for larger allocations.

---

## 5. Step-by-Step Execution — Worked Example

```c
int main() {
    int *ptr = (int *) malloc(sizeof(int)); // allocate 4 bytes on the heap
    *ptr = 10;                              // write 10 into that heap location
    *ptr = *ptr + 1;                        // increment it to 11
    free(ptr);                              // release the heap memory
    return 0;
}
```

**Memory layout before execution:**

| Region | State |
|---|---|
| Stack | `main`'s frame allocated: space for the pointer variable `ptr` (4 bytes on a 32-bit system) |
| Heap | Empty — no allocation yet |

**Execution trace:**

1. **Frame setup:** `main`'s prologue runs — SP moves down to make room for the local variable `ptr`. Many compilers also zero-initialize `ptr` at this point even without an explicit initializer in source.
2. **Prepare `malloc` call:** The requested size (`4`, from `sizeof(int)`) is moved into the parameter register (`r0`).
3. **Call `malloc`:** A kernel mode switch occurs. The base pointer and return address of `main` are saved (exactly like a normal function call, plus the mode switch). The kernel allocates space in the heap (in practice, a full page, ~4 KB), writes an internal metadata header, and returns the address of the usable block in `r0`.
4. **Store the returned address:** `ptr = r0` — this is a write into `main`'s **stack frame**, storing the heap address `1024` (for example) into the local pointer variable.
5. **Write through the pointer:** `*ptr = 10` — dereferencing `ptr` and writing `10` to the heap address it holds. This is a memory write to the **heap**, not the stack.
6. **Increment:** `*ptr = *ptr + 1` — reads 10 from the heap, adds 1, writes 11 back to the same heap address.
7. **Call `free(ptr)`:** The value of `ptr` (`1024`) is loaded into the parameter register and passed to `free`. Another kernel mode switch occurs; the allocator reads the metadata header preceding address `1024`, learns the block was 4 bytes, and releases it.
8. **`main` returns**, deallocating its own stack frame normally.

> [!important] The quiz from the lecture
> "How did `free` know to release exactly 4 bytes, when we only passed it a bare pointer?" Because `malloc` stored a hidden metadata header immediately before the returned address at allocation time — `free` reads that header to recover the original size.

---

## Bugs That Live in the Heap

### Memory Leaks

If a function allocates heap memory and returns *without* calling `free`, and no other part of the program retains a reference to that pointer, the memory becomes **unreachable but still allocated**. The kernel has no way to know the program "meant" to release it — it will hold that memory for the process indefinitely. This is a **memory leak**.

> [!note] Leaks are wasteful, not dangerous
> A leak bloats memory usage and can eventually degrade performance or exhaust available memory, but it doesn't corrupt data or crash the program directly — unlike dangling pointers.

### Dangling Pointers and Double Free

```
function_two() frees `ptr` and returns.
function_one() still holds a pointer to the same address and tries to use it.
```

Once memory is freed, using that pointer again is undefined behavior — the OS may:
- Still show the old (now technically invalid) data, if nothing has overwritten it yet, or
- Trigger a **segmentation fault**, if the OS has already reclaimed or protected that page.

Calling `free()` a **second time** on the same already-freed pointer (a **double free**) is especially dangerous: the allocator expects a valid metadata header at that location, and freeing something that's already been freed corrupts the allocator's internal bookkeeping — commonly causing an immediate crash, and in the worst case, an exploitable vulnerability. A maliciously crafted request that reliably triggers a double free in a server process can be used as a **denial-of-service** attack.

### Reference Counting and Garbage Collection

Languages that avoid manual `free()` calls (C#, Java, JavaScript) typically use **garbage collection**, which often relies internally on **reference counting**: every heap allocation carries a hidden counter tracking how many active references point to it. Creating a new reference increments the counter (a memory write); a reference going out of scope decrements it. When the counter hits zero, the object is eligible for collection.

> [!warning] Reference counting isn't free either
> Every increment/decrement is itself a memory write, and full garbage-collection sweeps require scanning the heap to find unreferenced blocks — genuinely expensive operations, which is why garbage-collected languages trade some raw performance for memory-safety convenience.

---

## Performance: Why the Stack Beats the Heap

| Reason | Explanation |
|---|---|
| **Built-in cleanup** | Stack deallocation is automatic and instantaneous (pointer decrement); heap deallocation requires an explicit `free` call and kernel involvement. |
| **No kernel mode switch** | Stack allocation never leaves user mode; every `malloc`/`free` does. |
| **No metadata overhead** | Stack frames don't carry per-allocation headers; every heap block does. |
| **Locality** | Stack variables within one frame are guaranteed adjacent; heap allocations can land anywhere, hurting cache-line reuse. |
| **Randomness** | The OS gives no guarantee about where successive heap allocations will land relative to each other — unlike sequential stack growth. |

> [!tip] Escape Analysis (Go, and similar in the JVM)
> Modern compilers can perform **escape analysis**: scanning code to determine whether a heap-allocated value's pointer ever "escapes" the function that created it (e.g., is returned, or passed to another function that outlives the caller). If it provably never escapes, the compiler can silently allocate it on the **stack** instead — getting heap-like syntax with stack-like performance, entirely transparently to the programmer.

### Batch Allocation — A Real-World Optimization

Allocating in a tight loop, one small object at a time, is one of the worst things you can do for performance:

```c
for (int i = 0; i < 100; i++) {
    Packet *p = malloc(sizeof(Packet)); // BAD: 100 separate mode switches + 100 headers
    ...
}
```

Every iteration pays the full cost of a kernel mode switch and a metadata header. If the total need is known in advance, it's far more efficient to allocate the entire block once:

```c
Packet *packets = malloc(100 * sizeof(Packet)); // ONE allocation, ONE header
```

> [!note] Real-world case study — memcached
> `memcached`'s "slab allocator" is built on exactly this principle: pre-allocating large, uniformly-sized chunks ("slabs") up front rather than performing many small individual allocations, dramatically reducing per-object allocation overhead.

### Structure Field Ordering — A Real-World Case Study

> [!important] Linux kernel TCP/IP stack optimization
> Google engineers achieved a **40% performance improvement** in the Linux kernel's TCP/IP stack purely by **reordering struct fields** — no algorithmic change at all. The insight: fields are typically declared in a "logical" order for human readability (e.g., grouping `source_ip` next to `source_port`), but the code frequently accesses fields in a *different* order (e.g., reading `source_ip` immediately followed by `destination_ip`). By reordering fields to match actual access patterns, related data ends up in the same cache line, turning what used to be two separate ~100 ns memory fetches into a single cached burst. This applies equally to heap-allocated and stack-allocated structures — it's purely about co-location in memory.

---

## Stack vs Heap — Full Comparison

| Aspect | Stack | Heap |
|---|---|---|
| Allocation speed | Extremely fast (register subtract) | Slow (kernel mode switch, bookkeeping) |
| Deallocation | Automatic, on function return | Manual (`free`) — must be explicit |
| Growth direction | High → low | Low → high |
| Size limit | Small, fixed | Large, limited mainly by system memory |
| Cache locality | Excellent, guaranteed adjacency | Poor, unpredictable placement |
| Common bugs | Dangling pointers to returned locals | Memory leaks, double free, dangling pointers |
| Cleanup cost if unused | None | Memory leak if never freed |

---

## Interview Questions

**Beginner**
- Q: What is a memory leak?
  A: Heap memory that is never `free`d, and for which no reachable reference remains in the program, so it stays allocated for the life of the process even though nothing uses it anymore.

**Intermediate**
- Q: Why is `malloc` significantly slower than a stack allocation?
  A: `malloc` requires a kernel mode switch (saving/restoring full process state), potential page-level allocation from the OS, and reading/writing an allocation metadata header — none of which apply to a simple stack-pointer subtraction.

**Advanced**
- Q: How does `free(ptr)` know how many bytes to release, given that it only receives a bare pointer?
  A: Most allocator implementations store a small metadata header immediately preceding the returned address at allocation time, recording the block's size (and often other bookkeeping). `free` reads this header to determine exactly how much memory to release.

- Q: What's the practical difference in danger between a memory leak and a dangling pointer?
  A: A leak wastes memory but doesn't corrupt program state — the worst outcome is resource exhaustion or degraded performance. A dangling pointer, if dereferenced, can read garbage data or crash the process (segfault), and a double free specifically can corrupt allocator metadata, potentially becoming a security vulnerability.

---

## Common Mistakes

- **Mistake:** Assuming `free(ptr)` needs to know the size you originally allocated.
  **Why it's wrong:** The allocator tracks this itself via a hidden metadata header — you only ever need to pass the pointer.
- **Mistake:** Returning a pointer to a heap allocation and forgetting who is responsible for freeing it.
  **Why it's wrong:** Without a clear ownership convention, either nobody frees it (a leak) or multiple owners free it (a double free) — both are common real-world heap bugs.
- **Mistake:** Allocating and freeing memory inside a tight loop, one small object at a time.
  **Why it's wrong:** Each call pays the full cost of a kernel mode switch and metadata bookkeeping; batching allocations up front is far more efficient when the total size is known ahead of time.

---

## Revision Notes

**Key Points**
- The heap is for dynamically-sized, long-lived, or large allocations that don't fit the stack's function-scoped lifetime.
- `malloc`/`free` involve a kernel mode switch and metadata headers — much more expensive than stack operations.
- Memory leaks are wasteful but not directly dangerous; dangling pointers and double frees can crash or compromise a program.
- Escape analysis (Go, JVM) can transparently move heap-eligible allocations onto the stack when safe.
- Struct field ordering and batch allocation are real, measurable performance levers — proven at scale in the Linux kernel and memcached.

**Quick Revision**
> Heap = flexible, manual, slow-but-necessary. Stack = rigid, automatic, fast.

**Memory Trick**
> "Heap: you break it, you fix it." Every `malloc` demands a matching `free`, or it leaks.

---

## Image Suggestions

- Heap allocation lifecycle (`malloc` → write → `free`)
- Memory leak diagram (orphaned heap block, no remaining reference)
- Dangling pointer / double-free diagram (two functions pointing to the same freed block)
- Program break diagram (heap top pointer)
- Stack vs heap side-by-side memory layout

> **📷 Image Placeholder:** Heap Allocation and the Program Break
>
> <!-- IMAGE: heap-program-break.png -->
>
> This image should show the heap growing upward from a fixed starting point, with the program break marking its current top, and a `malloc` call extending that boundary.

---

*Next: Section 06 — Practical Demo: Inspecting a Process's Real Memory Map on Linux*
