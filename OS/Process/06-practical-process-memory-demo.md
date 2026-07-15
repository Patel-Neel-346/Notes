# Section 06 — Practical Demo: Inspecting a Process's Real Memory Map

**Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## 1. Intuition

All the theoretical divisions of a process's memory layout—the text section, data section, stack, and heap—are not abstract structures. They are real, concrete divisions of virtual memory that are directly visible, inspectable, and manageable in real time on any running Linux machine. 

To observe this, we use a special system window called the **`/proc` pseudo-filesystem**. `/proc` is not stored on a hard drive or SSD. Instead, it is an in-memory interface generated dynamically by the Linux kernel. 

When you navigate through `/proc`, you are peering directly into the kernel's active data structures. Reading a file inside `/proc/<pid>/` is equivalent to asking the kernel: *"Tell me what this process is doing right now."*

---

## 2. Why This Exists

Operating systems must expose internal runtime states (such as process scheduling, memory footprints, and open file descriptors) to system administrators and debugging tools. However:
* Directly exposing kernel memory addresses to user space would create catastrophic security vulnerabilities and crash risks.
* Providing complex proprietary system calls to read process states makes writing administrative scripts and tools difficult.

`/proc` solves this by utilizing the **Virtual File System (VFS)**. It translates live, binary kernel state tables into simple, human-readable ASCII text files. Because they appear as standard files, administrators can inspect processes using standard command-line utilities (like `cat`, `grep`, or `awk`) without direct memory access.

> [!note] `/proc` is a window into the kernel's brain
> Every file in `/proc/<pid>/` is auto-generated on demand by the kernel. `maps`, `status`, `fd/`, `cmdline`, `mem` — they all expose live kernel data structures with zero disk I/O. This is the exact mechanism that tools like `top`, `htop`, `ps`, and `lsof` use under the hood.

---

## 3. Core Concept

Here are the formal definitions of the system components used to inspect memory maps:

| Term | Formal Definition | Description |
|:---|:---|:---|
| **`/proc` pseudo-filesystem** | An in-memory, kernel-managed directory structure that exposes system configuration and process control tables as files. | Created dynamically; consumes 0 bytes of disk space. |
| **Memory Map (`/proc/<pid>/maps`)** | A text file listing all currently mapped virtual memory pages for a specific process, detailing address ranges, access permissions, offsets, and backing files. | Read-only from user space; changes dynamically as the process runs. |
| **Virtual Page** | A fixed-size block of virtual memory (typically 4 KB in Linux) that represents the minimum granularity of memory mapping. | Mapped to physical RAM frames via the CPU's Page Tables. |
| **VFS (Virtual File System)** | An abstract kernel layer that allows different filesystems (ext4, NTFS, /proc) to be accessed using a single interface. | Handles file operations (`open`, `read`) dynamically. |

---

## 4. Internal Working

Let's look at the mapping column schema in `/proc/<pid>/maps` and how the OS loader parses the binary.

### The `/proc/<pid>/maps` Schema

Every row inside a process's `maps` file follows a strict six-column format:

```
  address           perms offset  dev   inode      pathname
00010000-00011000   r-xp  000000  08:01 1234567    /home/pi/high_cpu
  ▲                   ▲     ▲       ▲     ▲          ▲
  │                   │     │       │     │          └─ Backing file on disk (or [heap], [stack])
  │                   │     │       │     └─ Inode number of the backing file
  │                   │     │       └─ Device major:minor number (disk partition)
  │                   │     └─ Offset within the backing file where the segment begins
  │                   └─ Page permissions (read, write, execute, shared/private)
  └─ Virtual memory range (Start Address - End Address)
```

#### Column Breakdown:
1. **Virtual Address Range**: The start and end virtual addresses of the mapping, displayed in hexadecimal.
2. **Permissions (`perms`)**:
   * `r`: Readable.
   * `w`: Writable.
   * `x`: Executable.
   * `p` / `s`: Private (Copy-on-Write) or Shared.
3. **Offset**: The file offset (in bytes) where the mapping begins. If the region is not backed by a physical file on disk (e.g., heap or stack), this is `000000`.
4. **Device (`dev`)**: The major and minor device numbers of the storage drive holding the backing file.
5. **Inode**: The filesystem inode number of the backing file, used by the filesystem to locate the data.
6. **Pathname**: The absolute file path of the library or executable backing the mapping. Special labels include `[heap]` (dynamic memory), `[stack]` (thread execution stack), and `[vdso]` (Virtual Dynamic Shared Object used to accelerate system calls).

> [!tip] Filter maps output by permissions
> ```sh
> # Show only executable mappings (code segments)
> grep 'r-x' /proc/$(pidof high_cpu)/maps
> 
> # Show only the heap and stack
> grep -E '\[heap\]|\[stack\]' /proc/$(pidof high_cpu)/maps
> 
> # Count total virtual memory regions
> wc -l /proc/$(pidof high_cpu)/maps
> ```

---

## 5. Step-by-Step Execution: Inspecting a Real Process

Let's write a C program, compile it, run it, and trace how its variables and structures appear in the live memory map.

### Step 1: The C Code (`high_cpu.c`)
```c
#include <stdio.h>
#include <stdlib.h>

int global_initialized = 42;          // Lives in .data

int main() {
    static long long sum = 0;         // Lives in .data
    int *heap_array = malloc(1000000 * sizeof(int)); // Allocate 4 MB on heap

    while (1) {
        sum++;                        // Keeps CPU busy and process running
    }

    return 0;
}
```

* `global_initialized` is an initialized global variable $\rightarrow$ mapped to `.data`.
* `sum` is a static local $\rightarrow$ mapped to `.data` (its state persists across the program lifecycle).
* `heap_array` allocates 4 MB on the heap $\rightarrow$ mapped to `[heap]`.

### Step 2: Compiling and Running
Compile the code and run it in the background:
```sh
gcc -o high_cpu high_cpu.c
./high_cpu &
# Output: [1] 13503  (Process runs in background with PID 13503)
```

### Step 3: Dumping the Maps File
Read the dynamic mapping file using `cat`:
```sh
cat /proc/13503/maps
```

### Step 4: Interpreting the Output

```md
> **📷 Image Placeholder: Process Maps Dump Comparison**
>
> <!-- IMAGE: proc-maps-dump-comparison.png -->
>
> This image should show the command terminal output of cat /proc/13503/maps. Lines corresponding to the main program text, rodata, data, heap, libc shared library, and stack should be highlighted and color-coded.
```

Here are the key mappings displayed by the command:

#### 1. The Text Segment (Machine Code)
```
00010000-00011000  r-xp  000000  08:01  123456   /home/pi/high_cpu
```
* **Permissions**: `r-xp` (Read + Execute). The OS prevents this page from being writable to block code-injection exploits.
* **Offset**: `000000` (mapped from the very beginning of the executable file).
* **Size**: `0x11000 - 0x10000 = 0x1000` bytes (exactly **4 KB**, or one page).

#### 2. The Read-Only Data (`.rodata`)
```
00012000-00013000  r--p  001000  08:01  123456   /home/pi/high_cpu
```
* **Permissions**: `r--p` (Read-Only). String constants and constant integers live here.
* **Size**: 4 KB (even if the program only uses 4 bytes of constants, the OS must allocate a minimum of one page).

#### 3. The Initialized Data Section (`.data`)
```
00014000-00015000  rw-p  002000  08:01  123456   /home/pi/high_cpu
```
* **Permissions**: `rw-p` (Read-Write).
* This is where `global_initialized` and the static variable `sum` reside. They are loaded directly from the executable file at launch.

#### 4. The Heap (`[heap]`)
```
00016000-00427000  rw-p  000000  00:00  0        [heap]
```
* **Permissions**: `rw-p` (Read-Write).
* **Backing File**: None (inode `0`, device `00:00`). The memory is allocated dynamically at runtime, so it is not backed by an on-disk file.
* **Size**: `0x427000 - 0x16000 = 0x411000` bytes (roughly **4.2 MB**). This matches our 4 MB `malloc` allocation plus heap allocator headers.

#### 5. Shared C Libraries (`libc.so`)
```
7fb8f000-7fcc8000  r-xp  000000  08:01  234567   /lib/aarch64-linux-gnu/libc.so.6
7fcc8000-7fcd8000  r--p  019000  08:01  234567   /lib/aarch64-linux-gnu/libc.so.6
7fcd8000-7fcda000  rw-p  01a000  08:01  234567   /lib/aarch64-linux-gnu/libc.so.6
```
* Because our program was dynamically linked, the OS loader maps the shared C standard library (`libc.so`) into our address space.
* Notice the same structure: `r-xp` (compiled library code), `r--p` (library constants), and `rw-p` (library global state).

#### 6. The Stack (`[stack]`)
```
7ffffffdf000-7ffffffff000  rw-p  000000  00:00  0  [stack]
```
* **Permissions**: `rw-p` (Read-Write).
* **Backing File**: Labeled `[stack]`.
* Mapped at high memory addresses. This is where main's frame and the local variables (like `heap_array` pointer) are stored.

> [!important] The full memory map flow
> ```
> Virtual Address Space of high_cpu (low → high):
> 
> 0x00010000  [r-xp] .text        ◄─ Compiled machine code (Read+Execute)
> 0x00012000  [r--p] .rodata      ◄─ String constants (Read-Only)
> 0x00014000  [rw-p] .data/.bss   ◄─ Global/static variables (Read+Write)
> 0x00016000  [rw-p] [heap]       ◄─ malloc() space, grows UPWARD ↑
>                   ...
>             [rw-p] libc.so.6    ◄─ Shared library mappings
>                   ...
> 0x7fffffff  [rw-p] [stack]      ◄─ Stack frames, grows DOWNWARD ↓
> ```

> [!tip] Get a concise memory summary
> ```sh
> # See actual RSS (physical RAM used) vs virtual size
> cat /proc/$(pidof high_cpu)/status | grep -E 'VmRSS|VmSize|VmStk|VmHeap'
> # VmSize:  20480 kB   ◄ total virtual address space reserved
> # VmRSS:   1984  kB   ◄ actual physical RAM in use right now
> # VmStk:   132   kB   ◄ stack RAM
> ```
> `VmRSS` (Resident Set Size) shows how much physical RAM a process is actually using — not the virtual allocation. Swap pressure is visible when VmRSS ≪ VmSize.

---

## 6. Real Implementation Notes

### Linux VFS (Virtual File System)
The files inside `/proc` do not exist as physical bytes on a disk. When you run `cat /proc/13503/maps`, the Virtual File System intercepts the read system call, matches it to the `/proc` filesystem driver, and invokes an internal kernel function (like `show_map()` inside the memory manager). This function reads the process's active `vm_area_struct` memory descriptors and formats them on-the-fly into ASCII text.

### Virtual Memory Page Size Constraints
Virtual memory is divided into fixed-size chunks called **Pages**. 
* On most x86-64 and ARM systems, the default page size is **4 KB** (`4096 bytes`).
* **HugePages**: High-performance database engines (like Oracle or PostgreSQL) often utilize Linux **HugePages** (commonly 2 MB or 1 GB in size). HugePages reduce the number of entries in the Page Tables, decreasing CPU translation overhead and minimizing Translation Lookaside Buffer (TLB) cache misses under massive memory workloads.

```
Standard Pages (4 KB):
  1 GB of RAM requires 262,144 page table entries  ◄─ massive TLB pressure
  TLB hit rate may degrade under heavy memory load

HugePages (2 MB):
  1 GB of RAM requires only 512 page table entries  ◄─ ~512x fewer entries!
  TLB hit rate stays high, dramatic speedup for DB workloads
```

> [!tip] Check and enable HugePages on Linux
> ```sh
> # See current HugePage config
> cat /proc/meminfo | grep -i huge
> # HugePages_Total:   0
> # Hugepagesize:   2048 kB
> 
> # Reserve 512 HugePages (= 1 GB)
> echo 512 > /proc/sys/vm/nr_hugepages
> ```
> PostgreSQL, Oracle, and Redis all benefit significantly from HugePages when handling large shared memory buffers.

---

## 7. Comparison Tables

### Virtual Memory Address vs. Physical RAM Pages

| Aspect | Virtual Address Space (maps file) | Physical RAM Space (Hardware) |
|:---|:---|:---|
| **Scope** | Unique and private to each process | Shared globally by the hardware and kernel |
| **Size Limit** | $2^{64}$ bytes (16 Exabytes) on 64-bit | Limited by physical RAM sticks (e.g., 16 GB) |
| **Adjacency** | Mappings can look contiguous | Scattered across physical memory chips |
| **Permissions** | Managed via page-table flags (`r-x`, `rw-`) | Raw hardware memory cells |
| **Device Mapping** | Direct mapping to disk files | Virtual mappings resolved via MMU TLB cache |

---

## 8. Interview Questions

### Beginner
* **Q: Why does the `/proc` directory consume zero bytes of disk space?**
  * **A:** `/proc` is a virtual pseudo-filesystem generated dynamically by the kernel VFS layer directly in RAM. It does not exist on any physical storage media. It functions as a presentation interface to read and write active kernel state tables using standard file commands.

### Intermediate
* **Q: Why are the permissions of the text (code) segment in `/proc/<pid>/maps` marked as `r-xp` (Read + Execute) rather than `rwxp` (Read + Write + Execute)?**
  * **A:** This is a core security design known as **W^X (Write XOR Execute)**. By marking code pages as non-writable, the OS prevents self-modifying code and code-injection security vulnerabilities (e.g. buffer overflows attempting to write executable shellcode directly into memory). 

### Advanced
* **Q: What is a HugePage in Linux, and why would database administrators configure their systems to use them?**
  * **A:** A HugePage increases the standard page size from 4 KB to 2 MB or 1 GB. Large memory systems (like database servers with hundreds of gigabytes of RAM) experience significant Translation Lookaside Buffer (TLB) cache miss overhead when translating millions of 4 KB pages. Using HugePages reduces the total page count, shrinks the page table memory footprint, and increases TLB cache hit rates, improving memory access speeds.

---

## 9. Common Mistakes

* **Mistake: Thinking addresses in `/proc/<pid>/maps` are physical RAM addresses.**
  * **Why it's wrong:** The maps file displays **virtual** addresses. The kernel maps these virtual addresses to physical locations dynamically via page tables. Multiple separate processes can display overlapping virtual address ranges, but they point to different physical memory cells.
* **Mistake: Confusing `static` local variables with stack variables.**
  * **Why it's wrong:** Even though a static variable (like `static int sum`) is declared inside a function, its storage duration is global. It is stored in the initialized data section (`rw-p`) rather than the stack frame (`[stack]`), ensuring its state persists across function calls.

---

## 10. Revision Notes

### Key Points
* `/proc/<pid>/maps` exposes the live virtual memory mapping of a running process.
* The maps file columns detail address ranges, access permissions, offsets, and backing files.
* Text (`r-x`), rodata (`r--`), and data (`rw-`) are mapped from files; heap and stack are constructed dynamically in RAM.
* All virtual memory mappings operate in blocks called **Pages** (commonly 4 KB).
* Shared libraries (`libc.so`) display the same split permissions as the main executable binary.

### Important Definitions
* **Pseudo-filesystem**: A virtual filesystem interface dynamically generated by the kernel.
* **VFS (Virtual File System)**: An abstraction layer enabling standard file commands to read kernel states.
* **VDSO**: A kernel-provided virtual shared library that speeds up select system calls.

### Memory Tricks
* **"File path = Code or Data; No path = Heap or Stack"**: Backed segments show files; dynamic structures show empty device descriptors or labels like `[heap]`.
* **"W^X prevents the crash"**: If a page is writable, it must not be executable; if executable, it must not be writable.

---

## 11. Image Suggestions

* **Process Map Layout Diagram**: Overlaying the `/proc/<pid>/maps` hex addresses onto the standard textbook memory segment diagram.
* **VFS Translation Path**: Showing how a `cat /proc/13503/maps` command traverses VFS, calls `show_map()` in the kernel, and formats RAM data structures.
* **HugePage vs. Standard Page Size Mapping**: Illustrating TLB translation page count reductions.
* **Copy-On-Write Page Mapping**: Showing shared libc memory pages until modification occurs.
