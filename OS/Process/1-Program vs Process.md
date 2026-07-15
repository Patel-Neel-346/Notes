# Section 01 — Program vs Process

**Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## 1. The Core Distinction

> [!info] The Core Question
> Why do we need an operating system (OS)? In truth, you don't *absolutely* need one. You can write an application that talks directly to hardware (bare-metal programming). However, doing so is extremely difficult. The OS exists for **abstraction and convenience** — it handles complex hardware orchestration, memory management, process isolation, and I/O operations, allowing developers to focus on application logic.

### Program vs Process: The Fundamental Difference

| Aspect | Program | Process |
|--------|---------|---------|
| **Definition** | A passive, static executable file on disk | An active, running instance of a program in memory |
| **State** | Passive — stored on persistent storage | Active — executing in RAM |
| **Lifetime** | Persistent until explicitly deleted | Ephemeral — created, runs, and terminates |
| **Resources Used** | Disk space only | RAM, CPU cycles, file descriptors, network ports, kernel resources |
| **Instance Count** | One physical file on disk | Multiple identical processes can run simultaneously |
| **Identity** | Identified by file path / filename | Identified by Process ID (PID) assigned by the kernel |
| **Example** | `/usr/bin/python3`, `C:\Windows\System32\cmd.exe` | A running Python script with PID 1234, a cmd.exe instance with PID 5678 |

> [!tip] Quick Check: Duplicate Processes
> **Q:** If you run `node app.js` twice in two separate terminals, are they the same process?
> **A:** **No.** They are the same *program* (the `node` executable on disk), but they are two **distinct processes**. Each receives:
> - A unique Process ID (PID)
> - Its own isolated virtual memory space (separate stack, heap, data segments)
> - Its own Program Counter (PC) and CPU register state
> - Its own file descriptor table
>
> Therefore, mutating a variable in one process has **zero impact** on the other — they are completely isolated by the OS.

---

## 2. The Program-to-Process Lifecycle

Transforming source code into an active process involves a multi-stage pipeline:

```
Source Code (.c, .rs, .py) ──▶ Compiler ──▶ Object File (.o) ──▶ Linker ──▶ Executable (ELF/EXE) ──▶ OS Loader ──▶ Process in RAM
```

> [!note] Key Insight
> The **compiler** and **linker** run at **build time** (when you compile your program).
> The **OS loader** runs at **runtime** (when you execute your program).

```
📄 Screenshot this: program_in_memory2.webp
Figure 1 — Program in Memory Layout
Shows: OS loading process from disk to RAM, mapping code and data sections.
```

> ![program_in_memory2](../img/program_in_memory2.webp)
> *Figure 1: OS loading process — the static executable is read from disk and mapped as an active process in virtual memory.*

### The Loader Lifecycle (Detailed)

| Stage | Actor | Input | Output | Description |
|-------|-------|-------|--------|-------------|
| 1 | **Compiler** | Source code (`main.c`) | Object file (`main.o`) | Translates high-level code into CPU-specific assembly/machine code. Handles syntax analysis, optimization, and code generation. |
| 2 | **Linker** | Object files + Libraries | Executable binary (`a.out`, `.exe`) | Resolves symbol references, combines object files, links external libraries (static or dynamic) into a single executable. |
| 3 | **OS Loader** | Executable binary | Running process in RAM | Kernel component that loads the executable into memory, sets up the process address space (stack, heap, data, text sections), initializes registers, and transfers control to the program's entry point. |

> [!important] The Entry Point
> When the OS loader finishes its work, the CPU does **not** start executing at `main()` directly. Instead:
> 1. Control transfers to the **entry point** (e.g., `_start` in C, defined in `crt0.o`)
> 2. The entry point performs runtime initialization (setting up `argc`, `argv`, environment variables)
> 3. Finally, it calls `main()` — your program's actual starting point
>
> This is why C requires `main()` as the entry — it's a convention established by the linker and runtime.

---

## 3. Linkers & Linking Strategies

### What is a Linker?
When you write a program, you almost never write everything from scratch. You call standard functions like `printf`, `malloc`, or `sqrt` which live in external libraries. The linker's job is to take your compiled object files and stitch them together with those libraries into one runnable executable.

```
your_code.o  +  math.o  +  stdio.o  ──▶ [ LINKER ] ──▶ final executable
```

#### Linker Phases
- **Symbol Resolution**: Maps symbol references (declaring `extern int x;` or calling `sqrt()`) to their correct definitions in other object files or libraries.
- **Relocation**: Merges code and data sections of object files, assigning final memory addresses to instruction labels and variables so the CPU can execute them correctly.

#### Common Linker Errors
- **Undefined reference to 'x'**: Occurs when a symbol is declared and referenced, but the linker cannot find its implementation in any object file or library (e.g. failing to link with `-lm` for math operations).
- **Multiple definition of 'x'**: Occurs when the same function or global variable is defined in multiple object files, breaking the *One Definition Rule* (ODR).

> [!tip] Modern Linkers
> Traditional linkers (like `ld`) operate sequentially and can become build bottlenecks. Modern linkers like **Mold** (designed by Rui Ueyama) are heavily parallelized and highly optimized for modern multi-core systems, making linking steps exponentially faster.

---

### Static Linking — "Pack everything in the suitcase"

The linker copies the actual machine code of every library your program uses directly into your binary. The final `.exe` / `ELF` file is entirely self-contained.

#### Concrete Example
Consider a C program (`main.c`):
```c
#include <stdio.h>
#include <math.h>

int main() {
    double result = sqrt(144.0);
    printf("Result: %.1f\n", result);
    return 0;
}
```

If we compile this with static linking:
```sh
gcc main.c -o app_static -lm -static
```

The resulting binary looks like this:
```
app_static (ELF)
├── your main() code          ← your code
├── sqrt() machine code       ← copied from libm.a
├── printf() machine code     ← copied from libc.a
└── all other libc internals  ← copied in too
```

```sh
ls -lh app_static
# -rwxr-xr-x  872 KB   ← fat binary, everything is inside
```

- **✅ Benefit**: High portability. You can copy this one file to any Linux machine and it just works — no external library dependencies needed.
- **❌ Cost**: Wasted memory. If 50 different static programs are running on your machine, each one loads its own duplicate copy of `printf` and `sqrt` into RAM, causing massive memory bloat.

---

### Dynamic Linking — "Just bring the address of the shop"

The linker does not copy library code. Instead, it embeds references: *"at runtime, find libm.so and load sqrt from it."* The actual library code is loaded by the OS only when you run the program.

```sh
gcc main.c -o app_dynamic -lm
# (dynamic is the default — no -static flag)
```

The binary contains references instead of copied machine code:
```
app_dynamic (ELF)
├── your main() code
└── .dynamic section:
    ├── "I need libm.so.6 → find sqrt there"
    └── "I need libc.so.6 → find printf there"
```

```sh
ls -lh app_dynamic
# -rwxr-xr-x  16 KB   ← tiny, just your code + references
```

You can view these dynamic library dependencies using `ldd`:
```sh
ldd app_dynamic
# libm.so.6  =>  /lib/x86_64-linux-gnu/libm.so.6
# libc.so.6  =>  /lib/x86_64-linux-gnu/libc.so.6
```

- **✅ Benefit**: RAM savings. If 50 running programs all use `printf`, the OS loads `libc.so` once into physical RAM. All 50 processes share the exact same physical pages of memory.
- **❌ Cost**: Dependency errors. Copying the binary to a machine missing those library `.so` files causes the program to fail to launch.

---

### The Runtime Linker (`ld.so`)

When you run a dynamically linked binary, the OS doesn't jump straight to `main()`. Instead, it fires up the **dynamic runtime linker** first:

```
You run ./app_dynamic
    │
    ▼
OS loads the ELF binary
    │
    ▼
ld.so (the dynamic linker) kicks in
    │
    ▼
Reads .dynamic section: "I need libm.so.6, libc.so.6"
    │
    ▼
Locates shared libraries in paths (/lib, /usr/lib)
    │
    ▼
Maps libraries into the process's virtual address space
    │
    ▼
Patches the GOT (Global Offset Table) with real memory addresses
    │
    ▼
Jumps to main()
```

---

### The "DLL Not Found" Story

In the late 90s, users often copied a game's executable (e.g., `game.exe`) from a friend's PC to a floppy disk and took it home:

```
Floppy Disk:
└── game.exe        ← dynamically linked binary
                      contains ref: "needs DirectX.dll"

Home PC:
└── (no DirectX.dll installed)
```

When trying to run `game.exe` on the home PC:
1. `ld.so` starts up and reads the `.dynamic` section.
2. It looks for `DirectX.dll` in all standard system paths.
3. Since it is missing, execution aborts with a crash dialog: `ERROR: DirectX.dll not found`.
4. The process never even executes its first line of code.

If the developer had statically compiled the binary, the machine instructions for the game and libraries would have been self-contained, and the game would have booted directly off the floppy disk.

```
📄 Screenshot this: dynamic-linking-failure.jpg
Figure 2 — Floppy Disk DLL Error
Shows: Windows pop-up dialog: "The code execution cannot proceed because MSVCR100.dll was not found."
```

> ![dynamic-linking-failure](../img/dynamic-linking-failure.jpg)
> *Figure 2: Late 90s Floppy Disk Trap — copying only the `.exe` file without its required `.dll` files resulted in dynamic linking failures on target systems.*

---

### Linking Strategy Comparison

| Metric | Static Linking | Dynamic Linking |
|--------|----------------|-----------------|
| **Library Format** | `.a` (Linux Archive) / `.lib` (Windows) | `.so` (Linux Shared Object) / `.dll` (Windows) |
| **Binary Size** | Large (~870 KB for basic C) | Small (~16 KB for basic C) |
| **RAM footprints (50 apps)** | 50 separate copies in memory | 1 shared copy in RAM |
| **Portability** | Runs anywhere | Needs runtime libraries installed |
| **Security Patches** | Must recompile every binary | Update the `.so`/`.dll` once, all apps benefit |
| **Startup Speed** | Slightly faster (no address resolution) | Slightly slower (`ld.so` runs first) |

---

### Node.js Connection

Node.js itself is dynamically linked. You can verify this by checking the binary dependencies of Node:

```sh
ldd $(which node)
# libdl.so.2   => /lib/x86_64-linux-gnu/libdl.so.2
# libm.so.6    => /lib/x86_64-linux-gnu/libm.so.6
# libc.so.6    => /lib/x86_64-linux-gnu/libc.so.6
# ...
```

This is why `npm install` for native modules (compiled with node-gyp) sometimes breaks on fresh Linux servers with `"cannot find shared library"` — Node expects certain dynamic system libraries to be present.

> [!important] Docker Alpine vs. Debian (Glibc vs. Musl)
> Docker images based on `node:alpine` are extremely small, but sometimes fail to run native compiled Node modules. This is because Alpine Linux uses **musl libc** as its default standard library, whereas mainstream Linux distros use **glibc**. If a pre-compiled native Node module is dynamically linked against **glibc**, running it on Alpine causes dynamic linking failures.

---

## 4. What Every Process Gets from the OS

When the kernel initializes a process, it provisions an identity and an execution state:

### A. Identity
- **Process ID (PID)**: A unique integer assigned monotonically by the kernel.
  > [!warning] Monotonic Assignment & PID Reuse
  > Dead PIDs are not immediately recycled by the kernel. If a process dies, its PID remains idle for a duration to prevent race conditions and security bugs — such as a new process being assigned the same PID and accidentally gaining access to lingering socket descriptors or file descriptors belonging to the dead process.
- **Namespaces**: Key to containerization tools like Docker. Namespaces virtualize OS resources so that a process inside a container jail sees its own sandboxed PIDs, network interfaces, mounts, and file descriptors — completely isolated from the host system and other containers.
- **Process Control Block (PCB)**: An in-memory data structure managed by the kernel that stores all metadata about a process.
  ```
  ┌────────────────────────────────────────────────────────┐
  │              Process Control Block (PCB)               │
  ├────────────────────────────────────────────────────────┤
  │  - Process ID (PID)                                    │
  │  - Program Counter (PC) / Instruction Pointer          │
  │  - Saved CPU Registers (R0, R1, SP, etc.)              │
  │  - Page Table Pointer (Virtual Memory Map)             │
  │  - File Descriptor Table (open files, sockets)         │
  │  - CPU Scheduling & Usage Statistics                   │
  └────────────────────────────────────────────────────────┘
  ```

### B. Execution State
- **Program Counter (PC) / Instruction Pointer (IP)**: A dedicated CPU register holding the memory address of the next instruction to execute.
- **Registers**: The CPU's ultra-fast local scratchpad. Accessing registers takes fraction of a nanosecond, compared to ~100 ns for system RAM.
- **Virtual Memory Map**: The process's isolated address space. By default, processes cannot access each other's memory, though they can explicitly request shared memory segments (e.g., via `mmap` or `shmget`).

---

## 5. Memory Layout of a Process

The OS allocates a virtual address space bounded by a minimum address and a maximum address, split into four primary regions:

```
High Memory Addresses (e.g., 0xFFFFFFFF)
┌────────────────────────────────────────────────────────┐
│  Stack (grows downward ↓)                              │
│  - Local variables, function parameters, return        │
│    addresses for active functions                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     Free Space                         │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Heap (grows upward ↑)                                 │
│  - Dynamically allocated memory (malloc/new)           │
├────────────────────────────────────────────────────────┤
│  Data Section                                          │
│  - Global variables, static variables                  │
├────────────────────────────────────────────────────────┤
│  Text Section (Code)                                   │
│  - Read-only machine code instructions loaded from disk│
└────────────────────────────────────────────────────────┘
Low Memory Addresses (e.g., 0x00000000)
```

```
📄 Screenshot this: memory_layout.webp
Figure 3 — Process Memory Layout
Shows: Stack growing down, Heap growing up, Data section, Text section (Machine Code).
```

> ![memory_layout](../img/memory_layout.webp)
> *Figure 3: Process Memory Layout — high memory addresses host stack frames, while low addresses contain static variables and machine instructions.*

- **Stack**: Grows downward (high to low addresses). Stores local variables, return addresses, and function execution frames.
- **Heap**: Grows upward (low to high addresses). Managed manually by the programmer (via `malloc` in C or `new` in C++).
- **Data Section**: Stores global and static variables initialized before runtime.
- **Text Section**: Stores the compiled, read-only CPU instructions.

---

## 6. Context Switch Cost

When the OS preempts a running process to allocate CPU time to another process, it triggers a **Context Switch**:

```
[ Process A Running ] 
       │
       ▼ (Timer Interrupt / Preemption)
1. Pause Process A
2. Save CPU Registers & PC to Process A's PCB (RAM)  ──▶ (~100 ns overhead)
3. Load Process B's Registers & PC from PCB (RAM)    ──▶ (~100 ns overhead)
4. Update CPU Program Counter
       │
       ▼
[ Process B Running ]
```

> [!important] The Multitasking Tax
> Context switching is the hidden cost of concurrent operating systems. Because writing and reading to RAM takes roughly **100 ns** per operation, saving dozens of CPU registers to a PCB in RAM during a context switch introduces noticeable latency. High context-switch rates degrade CPU efficiency, spending clock cycles on overhead rather than executing application code.

---

## 7. Language Runtimes — Where Does Your Code Run?

Not all programming languages map execution to processes in the same way.

- **Compiled Languages (C, Rust, Go)**: Compile directly to native CPU machine code. The CPU runs their instructions directly. Your code *is* the process.
- **Interpreted / VM Languages (JavaScript, Python, Java)**: Compile to bytecode or run through an interpreter. The CPU executes the *runtime interpreter binary* (e.g., `node`, `python`, `java`), which spins up its own stack and heap. Your code runs as a guest *inside* that binary.

```
sh$ node server.js
└── Active OS Process: the `node` binary (native machine code)
    └── Your server.js runs inside Node's virtual heap/stack
```

> [!note] Node.js Process Check
> In Node.js, calling `process.pid` returns the PID of the underlying `node` binary execution engine. The JavaScript file itself is not the OS process; it is executing inside the memory structures of the runner binary.

### Why This Matters — The LinkerD Story

The developers of **LinkerD** (a high-performance service mesh proxy) originally wrote the proxy in Java. However, Java's Virtual Machine (JVM) runtime and Garbage Collection (GC) pauses introduced latency spikes that violated microsecond-level proxy requirements. 

To solve this, they rewrote the proxy in **Rust**. Because Rust compiles directly to native machine code with no runtime or garbage collector, it eliminated the GC pauses, bringing predictable, ultra-low latencies.

### Language Execution Comparison

| Metric | Compiled (C / Rust / Go) | Interpreted / VM (JS / Python / Java) |
|--------|--------------------------|---------------------------------------|
| **CPU Execution** | Runs your code directly | Runs the runtime binary |
| **Memory Stack** | Uses your process's OS stack | Managed inside the runtime's memory |
| **Latency Profile**| Deterministic | Subject to Garbage Collection pauses |

---

## 8. Practical Demo: Assembly, GDB, and Process Inspection

Let's trace a simple program to see how variables, CPU registers, and the Program Counter interact.

### Step 1: Writing the Code (`test.c`)
```c
#include <stdio.h>

int main() {
    int a = 1;
    int b = 2;
    int c = a + b;
    c = c + 1;
    printf("a + b = %d\n", c);
    return 0;
}
```

### Step 2: Compiling to Assembly
To output the assembly code generated by the compiler, use the `-S` flag:
```sh
gcc -S -o test.s test.c
```

Open `test.s` to see how the C variables map to registers:
```assembly
# Partial ARM Assembly Output
push    {fp, lr}
add     fp, sp, #4
sub     sp, sp, #12
mov     r3, #1          @ Move value 1 into register r3 (a = 1)
str     r3, [fp, #-8]   @ Store r3 on the stack
mov     r3, #2          @ Move value 2 into register r3 (b = 2)
str     r3, [fp, #-12]  @ Store r3 on the stack
ldr     r2, [fp, #-8]   @ Load stack value (1) into r2
ldr     r3, [fp, #-12]  @ Load stack value (2) into r3
add     r3, r2, r3      @ Add r2 and r3, store in r3 (c = a + b)
str     r3, [fp, #-16]  @ Store result (c) on stack
```

> [!tip] Compiler Optimizations
> Compilers are highly intelligent. If you compile code with optimizations turned on (e.g. using `gcc -O3`), the compiler may realize that `a` and `b` are never used individually. It will completely skip allocating memory on the stack for them, executing the addition directly in the registers or pre-calculating the final value (`3`) at compile time.

### Step 3: Compiling for Debugging
Compile the code with debug symbols (`-g`). Debug symbols preserve the mapping between compiled instruction addresses and high-level C source code lines:
```sh
gcc -g -o test test.c
```

### Step 4: Debugging with GDB
Open the binary inside the GNU Debugger:
```sh
gdb ./test
```

Inside the debugger console:
```gdb
(gdb) start
# Starts process execution and pauses at the entry breakpoint in main()

(gdb) info registers
# Or 'i r'. Displays current register states, including the Program Counter (pc)
```

```
📄 Screenshot this: gdb-registers-output.jpg
Figure 4 — GDB info registers command
Shows: r0 (value 1), pc (0x10414), sp registers.
Key: The Program Counter (pc) holds the active instruction address in memory.
```

> ![gdb-registers-output](../img/gdb-registers-output.jpg)
> *Figure 4: GDB Output — showing general registers and the PC.*

Step to the next execution line:
```gdb
(gdb) next
# Executes the current line of code

(gdb) info registers
# Observe the Program Counter (pc) has increased to point to the next instruction address.
```

---

## 9. Diagnostic Tools — Your Best Friends

To inspect active processes and debug executables, use standard Linux utilities:

### A. Process Viewers
- `top`: Command-line system monitor displaying CPU usage, memory, and PIDs. It reads data directly from the kernel-exposed `/proc` filesystem.
- `htop`: Interactive, color-coded, user-friendly system monitor. Displays core threads and allows real-time filtering, sorting, and sending signals (like SIGKILL).

### B. Debuggers
- `gdb`: The GNU Debugger. Attaches to processes, sets execution breakpoints, steps line-by-line, and directly monitors CPU register changes. Requires compiling with `-g` to map instruction addresses back to source code.

---

## 10. Key Takeaways

- **Program vs. Process**: A program is static code on disk; a process is active instructions executing in RAM.
- **Isolated Memory**: Every process gets its own virtual memory layout consisting of Stack (local variables, downward-growing), Heap (dynamic allocations, upward-growing), Data (global variables), and Text (read-only code).
- **Process ID (PID)**: Unique identifier assigned monotonically. Dead PIDs are cached before reuse to prevent resource assignment bugs.
- **Process Control Block (PCB)**: Kernel memory block storing a process's metadata, open file descriptors, and register state.
- **Context Switch Tax**: Preempting a process requires saving registers to RAM (~100 ns per write), introducing scheduling overhead.
- **Linking Strategies**: Static linking embeds dependencies producing large, portable files. Dynamic linking maps references at runtime, creating lightweight binaries with host dependencies.
- **Runtime Jails (Containers)**: Namespaces isolate PIDs, networks, and file paths to create sandbox process instances.

---

*Next: Section 02 — How a Process Executes (fetch-decode-execute cycle, Program Counter, Text section)*
