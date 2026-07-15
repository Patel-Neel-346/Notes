# Section 06 — Practical Demo: Inspecting a Process's Real Memory Map

**Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## 1. Intuition

All of the theory covered so far — text, data, heap, stack — isn't abstract; it's directly visible on a live, running Linux process. The kernel exposes this information through a special pseudo-filesystem, `/proc`, which isn't backed by physical disk files at all — it's a live window into the kernel's own internal data structures, rendered as if it were a filesystem for convenience.

This section walks through inspecting a real running C program's memory layout, connecting every abstract concept from the previous sections to an actual command-line output.

---

## 2. Why This Exists

Operating systems need a way to expose internal kernel state — process metadata, memory mappings, open file descriptors — to user-space tools and administrators, without giving those tools direct, unrestricted access to kernel memory (which would be a massive security and stability risk). `/proc` solves this by presenting a curated, read-only (mostly) view of exactly the information that's safe and useful to expose, in a format any standard file-reading tool (`cat`, scripts, etc.) can consume.

---

## 3. Core Concept

| Term | Definition |
|---|---|
| **`/proc`** | An in-memory, kernel-generated pseudo-filesystem exposing live process and system information. Not backed by disk. |
| **`/proc/<pid>/maps`** | A per-process file listing every virtual memory mapping (address range) that process currently has — code, data, heap, stack, and shared libraries. |
| **`top` / `htop`** | Process viewers that read from `/proc` and render it in a human-friendly, often interactive, format. |

---

## 4. Internal Working — The Demo Program

The demo uses a simple C program (`high_cpu.c`) intentionally designed to touch every memory region discussed so far:

```c
#include <stdio.h>
#include <stdlib.h>

int global_initialized = 42;          // lives in .data (initialized data section)

int main() {
    static long long sum = 0;         // static local: also lives in .data
    int *heap_array = malloc(1000000 * sizeof(int)); // large heap allocation

    while (1) {
        sum++;                        // infinite loop, so the process stays alive
    }

    return 0;
}
```

- `global_initialized` is a genuine global variable → lands in the initialized data section.
- `sum`, despite being declared *inside* `main`, is `static` → it also lives in the data section (not the stack), because `static` locals persist across the entire program lifetime rather than being tied to one function call.
- `heap_array` is a large `malloc`'d block → lands in the heap, deliberately sized (1 million integers) to make it easy to spot in the memory map.
- The infinite loop keeps the process alive long enough to inspect while running.

> [!note] Why a static local variable is *not* on the stack
> This is a common point of confusion: `static` changes a local variable's *storage duration*, not its *scope*. `sum` is still only accessible by name inside `main` (scope), but its memory is allocated once, in the data section, and persists for the entire life of the program — it does not get created and destroyed with each call to `main`, and it is not part of `main`'s stack frame.

---

## 5. Step-by-Step Execution — Reading `/proc/<pid>/maps`

**Step 1 — Find the running process:**
```sh
top
```
Locate the process by name (`high_cpu`) and note its PID (e.g., `13503`).

**Step 2 — Dump its memory map:**
```sh
cat /proc/13503/maps
```

**Step 3 — Interpret each entry.** A typical `maps` output has lines shaped like:

```
<start_addr>-<end_addr> <perms> <offset> <dev> <inode> <pathname>
```

Walking through what the lecture's demo actually showed, entry by entry:

### Entry 1 — The Text Segment
```
00010000-00011000  r-xp  ...  /home/pi/high_cpu
```
- **Permissions:** `r-xp` → read + execute, private, **not** writable. This is the machine code itself — the OS enforces that running code cannot be modified in memory, both for security (preventing code injection) and for performance (allowing the CPU to safely cache it as immutable).
- **Size:** `0x11000 - 0x10000 = 0x1000` = 4 KB — the minimum unit of memory mapping on this system (one page).
- **Mapped from:** the executable file itself on disk (`/home/pi/high_cpu`) — the code doesn't need to be "constructed" at runtime; it's mapped directly from the file.

### Entry 2 — Read-only Data (Constants / `.rodata`)
```
00012000-00013000  r--p  ...  /home/pi/high_cpu
```
- **Permissions:** `r--p` → read-only, not executable, not writable. This is the `.rodata` portion of the data section — string literals and `const` values.
- Also mapped directly from the same executable file, also exactly 4 KB (again, the minimum page granularity — even a single constant integer would still reserve a full page).

### Entry 3 — Initialized Data Section
```
00014000-00015000  rw-p  ...  /home/pi/high_cpu
```
- **Permissions:** `rw-p` → read and write, but not executable. This is where `global_initialized` and the `static long long sum` both live.
- Also mapped from the executable file (their initial values are stored in the file), and also 4 KB — even though the actual data used is only a handful of bytes, the OS's minimum mapping granularity (the **page size**, typically 4 KB) still applies. This same page-granularity constraint governs virtual memory generally, covered in depth in the next section.

### Entry 4 — The Heap
```
00016000-00035000  rw-p  ...  [heap]
```
- **Permissions:** `rw-p` — readable and writable, and notice there is **no backing file path** (or it's explicitly labeled `[heap]`) — because heap memory doesn't exist on disk at all. It's constructed dynamically as the process runs, exactly as covered in Section 05.
- **Size:** in the lecture's example, roughly 135 KB — consistent with having `malloc`'d space for 1,000,000 integers (~4 MB in a real scenario; the lecture's own demo used a smaller allocation, illustrating the same mapping principle at whatever scale was actually requested).

### Entries 5+ — Shared Libraries (`libc`)
```
...  r-xp  ...  /lib/aarch64-linux-gnu/libc.so.6
...  r--p  ...  /lib/aarch64-linux-gnu/libc.so.6
...  rw-p  ...  /lib/aarch64-linux-gnu/libc.so.6
```
- Because the program uses standard library functions (`printf`, `malloc`, etc.) and was **dynamically linked**, the C standard library itself must be mapped into the process's address space at startup.
- Notice the same three-way split appears again — a read+execute portion (the library's own code), a read-only portion (its constants), and a read-write portion (its own global/static data) — because a shared library is, internally, structured exactly like any other compiled program.
- This directly connects back to the dynamic linking concepts from Section 01: the executable's `.dynamic` section records that it needs `libc.so.6`, the runtime linker (`ld.so`) locates it on disk at startup, and the kernel maps it into the process the same way it maps the process's own code.

> [!warning] Security implication
> Because shared libraries are located by *path* and mapped at runtime, an attacker who can replace the on-disk `libc` (or manipulate the library search path) before a program starts could cause the process to map a malicious version instead — a real, if difficult-to-execute, attack vector tied directly to how dynamic linking works.

### The Stack
```
7fffffff0000-7ffffffff000  rw-p  ...  [stack]
```
- Also labeled explicitly, also `rw-p`, also with no backing file — like the heap, it's constructed and torn down dynamically, not loaded from disk.
- In the lecture's demo, it measured similarly to the heap's size (~135 KB) — a coincidence of this particular program, not a general rule; the stack's default maximum size is configurable per-process (commonly via `ulimit -s`) and is independent of heap size.

---

## Summary Table — What Each Region Looks Like in `/proc/<pid>/maps`

| Region | Typical Permissions | Backed by a file? | Notes |
|---|---|---|---|
| Text (code) | `r-xp` | Yes — the executable | Never writable; enforced by the OS |
| Read-only data (`.rodata`) | `r--p` | Yes — the executable | Constants, string literals |
| Initialized data (`.data`) | `rw-p` | Yes — the executable | Global and static variables |
| Heap | `rw-p` | No — labeled `[heap]` | Constructed dynamically at runtime |
| Stack | `rw-p` | No — labeled `[stack]` | Constructed dynamically at runtime |
| Shared libraries (e.g. `libc`) | Mixed `r-xp` / `r--p` / `rw-p` | Yes — the `.so` file | Same 3-way split as the main executable |

---

## Real Implementation Notes

- The minimum granularity for every single mapping is the OS **page size** (commonly 4 KB on most systems) — this is why even a single global integer or a single string constant still reserves a full 4 KB entry in the map. This ties directly into the upcoming Virtual Memory section, where paging is covered in depth.
- `/proc/<pid>/maps` is one of the most useful tools for debugging real-world memory issues — spotting an unexpectedly large or rapidly growing `[heap]` entry over time is a classic way to catch a memory leak in production.
- Tools like `pmap <pid>` present the same underlying information in a more human-readable, summarized form.

---

## Interview Questions

**Beginner**
- Q: What is `/proc` and why doesn't it exist as real files on disk?
  A: It's a kernel-generated pseudo-filesystem that exposes live, in-memory process and system state through a familiar file-reading interface — it's a presentation layer over kernel data structures, not actual persisted files.

**Intermediate**
- Q: Why do the heap and stack entries in `/proc/<pid>/maps` have no backing file, while the text and data sections do?
  A: The text and data sections' *initial* contents come directly from the executable file on disk and are mapped from it. The heap and stack are constructed dynamically as the process runs — they have no corresponding on-disk representation.

**Advanced**
- Q: Why would even a single 4-byte global variable still result in a full 4 KB entry in the data section mapping?
  A: The OS's virtual memory system operates in fixed-size pages (commonly 4 KB) as its minimum unit of mapping — you cannot map a partial page. Any allocation, however small, is rounded up to at least one full page.

---

## Common Mistakes

- **Mistake:** Assuming `/proc/<pid>/maps` shows physical RAM addresses.
  **Why it's wrong:** These are **virtual** addresses, specific to that process's own address space — a completely different process could show overlapping or identical-looking address ranges that map to entirely different physical memory.
- **Mistake:** Assuming a `static` local variable appears in the stack region of the memory map.
  **Why it's wrong:** `static` locals are placed in the data section, not the stack, regardless of which function they're declared inside.

---

## Revision Notes

**Key Points**
- `/proc/<pid>/maps` gives a direct, live view of everything covered theoretically in Sections 01–05: text, rodata, data, heap, stack, and shared library mappings.
- Every mapping is a minimum of one page (commonly 4 KB), regardless of how little data actually lives there.
- Text, rodata, and initialized data are all backed by the executable file on disk; heap and stack are not — they're purely runtime constructs.
- Dynamically linked libraries appear in the map with the same three-way permission split as the main program itself.

**Quick Revision**
> `cat /proc/<pid>/maps` → see text (r-x), rodata (r--), data (rw-), heap ([heap], rw-), libraries, and stack ([stack], rw-) — every concept from this course, visible in one command.

**Memory Trick**
> "If it's on disk, it's mapped with a path. If it's not, it's `[heap]` or `[stack]`."

---

## Image Suggestions

- Annotated `/proc/<pid>/maps` output, labeling each region against the concepts it represents
- Full process virtual address space diagram (text → rodata → data → heap → ... → stack), matched to real hex address ranges
- Dynamic library mapping diagram showing `ld.so` resolving and mapping `libc.so`

> **📷 Image Placeholder:** Annotated `/proc/<pid>/maps` Output
>
> <!-- IMAGE: proc-maps-annotated.png -->
>
> This image should show a real `/proc/<pid>/maps` terminal output with each line's region (text, rodata, data, heap, libc, stack) labeled and color-coded, matching the address ranges to the memory layout diagram from Section 01.

---

*Next: Section 07 — Virtual Memory (paging, page tables, the MMU)*
