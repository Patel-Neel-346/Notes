**Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## 1. Introduction to execution units

> [!info] The Core Question
> Why do we need an operating system (OS)? In truth, you don't *absolutely* need one. You can write an application that talks directly to the hardware. However, doing so is extremely difficult. The OS exists for **convenience** — it handles the complex orchestration of hardware, allowing developers to focus on application logic.

### Units of Execution
To manage code execution, the OS defines the **Process** as the fundamental unit. In the kernel, process management is so critical that it defines how code runs, how variables are stored, and how hardware resources are allocated. 

### Language Runtime & Hardware execution
Different programming languages interact with the CPU differently:
- **Compiled Languages (e.g., C, Rust, Go)**: Compile directly to native CPU machine code. They are highly efficient because the CPU runs their instructions directly.
- **Interpreted/Runtime Languages (e.g., JavaScript/Node.js, Python, Java)**: Do not run directly on the CPU. Instead, the CPU executes the interpreter binary (e.g., `node.exe` or `python`), which has its own stack and heap, and that binary interprets and executes the JS/Python code.

> [!tip] Optimization & Language Choice
> When optimizing software for microseconds, runtime overhead becomes critical. For example, **LinkerD** (a service mesh proxy) famously rewrote their proxy from Java to Rust. Java's runtime and Garbage Collection (GC) overhead introduced latency spikes. Moving to Rust (which compiles directly to native machine code and has no garbage collector) allowed them to eliminate these pauses and achieve ultra-low, predictable latencies.

---

## 2. Program vs. Process

> [!note] Definitions
> - **Program**: A passive entity. It is the compiled, linked executable file stored at rest on disk (e.g., `.exe` on Windows or an ELF binary on Linux).
> - **Process**: An active entity. It is a **program in motion** — an instance of a program loaded into memory and executing instructions.

```
📄 Screenshot this: fig1-program-vs-process.jpg
Figure 1 — Program vs Process Diagram
Shows: [ Disk: Program File (ELF/EXE) ] ──▶ ( Loaded by Launcher ) ──▶ [ RAM: Active Process (PID, Stack, Heap, Text) ]
```

> ![fig1-program-vs-process](img/fig1-program-vs-process.jpg)
> *Figure 1: Program vs. Process — a passive executable file on disk is loaded into memory to become an active, dynamic process.*

### Key Differences

| Feature | Program | Process |
|---------|---------|---------|
| **State** | Passive (stored on disk) | Active (running in RAM) |
| **Life Cycle** | Persistent until deleted | Temporary (starts, runs, terminates) |
| **Resources** | Consumes only disk space | Consumes RAM, CPU cycles, File Descriptors, etc. |
| **Uniqueness** | One file on disk | Can have multiple active instances (processes) running simultaneously |
| **Identified By** | File path / name | Process ID (PID) assigned by the kernel |

### Inside a Running Process

When the OS launches a process, it gives it a unique identity and personality:
1. **Process ID (PID)**: A unique integer that identifies the process. PIDs are assigned monotonically (e.g., 7, 8, 9) by the kernel, though dead PIDs are not immediately reused to avoid security bugs (e.g., a new process accidentally accessing lingering resources of a dead process).
2. **Namespaces**: Used in containerization (like Docker). Namespaces virtualize OS resources so that a process inside a "container jail" sees its own sandboxed PIDs, network interfaces, mount points, and file descriptors, isolated from other containers and the host.
3. **Program Counter (PC) / Instruction Pointer (IP)**: A special register in the CPU that holds the memory address of the **next instruction** to be executed.
4. **Process Control Block (PCB)**: An in-memory data structure managed by the kernel that stores all metadata about a process (PID, PC, CPU registers, Page Table pointer, File Descriptor table, and CPU usage statistics).

---

## 3. Compilation and Linking

To create an executable program from source code, we use a compiler and a linker.

```
┌──────────────┐      ┌──────────┐      ┌─────────────┐      ┌──────────┐      ┌──────────────┐
│  C Source    │─────▶│ Compiler │─────▶│ Object File │─────▶│  Linker  │─────▶│  Executable  │
│  (*.c, *.h)  │      └──────────┘      │  (*.o / *.s)│      └────┬─────┘      │  (ELF / EXE) │
└──────────────┘                        └─────────────┘           │            └──────────────┘
                                                                  ▲
                                                       Libraries ─┘
```

### The Compiling & Linking Process
1. **Compiling**: The compiler translates high-level code (like C) into assembly and then into CPU-specific object files containing raw machine instructions.
2. **Linking**: Modern programs rely on multiple files and external libraries (like `printf` from the C standard library). The linker resolves these references and merges all object files into a single executable file.

### Static vs. Dynamic Linking

There are two primary approaches to linking dependencies:

| Feature | Static Linking | Dynamic Linking |
|---------|----------------|-----------------|
| **Mechanism** | Copies the machine code of all dependency libraries **directly into** the final executable file. | Embeds **pointers and version constraints** in the executable to load libraries at runtime. |
| **File Size** | **Large** (contains all library code). | **Small** (lightweight binary). |
| **Portability** | **High** (runs on the target machine without requiring external libraries). | **Low** (relies on the target machine having the required libraries installed). |
| **Library Formats** | `.a` (Linux), `.lib` (Windows) | `.so` (Linux), `.dll` (Windows) |

> [!warning] The Copy-Paste Floppy Disk Trap
> In the late 90s, users often copied only the `.exe` file of a game or application to a floppy disk, leaving behind the required Dynamic Link Libraries (`.dll` files). Running the executable on another computer resulted in a "DLL not found" error because the program was dynamically linked and couldn't find its dependencies on the target system. 
> To bypass this, some developers used static linkers to package all DLL dependencies inside a single executable, making it easy to distribute.

---

## 4. Memory Layout & CPU Registers

> [!important] Simplified Memory View
> To simplify process execution, we assume the process accesses **physical memory addresses** directly (even though modern operating systems virtualize memory via page tables). A process's memory layout is bounded by a minimum address and a maximum address.

### Process Memory Layout Diagram

```
High Memory Addresses (e.g., 0xFFFFFFFF)
┌────────────────────────────────────────────────────────┐
│  Stack (grows downward ↓)                              │
│  - Local variables, function call parameters,          │
│    return addresses                                    │
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
│  - Native machine code instructions loaded from disk   │
└────────────────────────────────────────────────────────┘
Low Memory Addresses (e.g., 0x00000000)
```

- **Stack**: Grows downward from high memory to low memory. Every function call allocates a new "stack frame" containing local variables.
- **Heap**: Grows upward from low memory to high memory. Used for variable-sized memory allocations during runtime.
- **Text Section**: A read-only memory region where the compiled executable code is loaded.

### CPU Registers
CPUs use registers as an ultra-fast local scratchpad to perform computations. Accessing registers is **lightning fast** — orders of magnitude faster than accessing system RAM.
- **General-Purpose Registers (e.g., R0, R1, R3)**: Hold temporary values and operands for operations.
- **Program Counter (PC) / Instruction Pointer (IP)**: A special register pointing to the next instruction in memory to execute.

> [!important] Context Switching & The Checkpoint Analogy
> Reading and writing to RAM is slow. The CPU performs calculations using its local registers. However, when the OS decides to run another process, it must perform a **context switch**:
> 1. It pauses the current process.
> 2. It saves all register values (including the Program Counter) of the active process into its **Process Control Block (PCB)** in RAM. Think of this as saving a game checkpoint.
> 3. It loads the register values and PC of the new process from its PCB into the CPU registers.
> 4. The CPU resumes execution from the new PC checkpoint.

---

## 5. Practical Demo: Assembly, GDB, and Process Inspection

Let's compile a simple C program, inspect its assembly, and debug it to watch the Program Counter change in real time.

### Step 1: Writing the Code (`test.c`)
Create a file named `test.c` with the following content:

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
To see the direct mapping of high-level code to CPU instructions, compile the program with the `-S` flag to output assembly:

```sh
gcc -S -o test.s test.c
```

Open `test.s` to see the assembly instructions:

```assembly
# Partial assembly output (ARM Architecture)
# Pushing registers and moving values
push    {fp, lr}
add     fp, sp, #4
sub     sp, sp, #12
mov     r3, #1      @ Move value 1 into register r3 (a = 1)
str     r3, [fp, #-8]
mov     r3, #2      @ Move value 2 into register r3 (b = 2)
str     r3, [fp, #-12]
ldr     r2, [fp, #-8]
ldr     r3, [fp, #-12]
add     r3, r2, r3  @ Add registers and store in r3 (c = a + b)
str     r3, [fp, #-16]
...
```

> [!tip] Compiler Optimizations at Play
> Compilers are highly intelligent. If you compile code with optimizations turned on (e.g., using `-O2` or `-O3`), the compiler may realize that variables `a` and `b` are never used individually. Instead of writing them to the stack in memory (which is slow), it will optimize them out and load the values directly into registers to add them, saving clock cycles and RAM.

### Step 3: Compiling for Debugging
Compile the code with the `-g` flag to include **debug symbols**. Debug symbols map the compiled machine code offsets back to the original source file and line numbers, making it possible for debuggers to step through the program:

```sh
gcc -g -o test test.c
```

### Step 4: Debugging with GDB
We can use GDB (GNU Debugger) to attach to our executable and inspect registers in real time:

```sh
# Start GDB with the test binary
gdb ./test
```

Inside the GDB prompt, execute the following commands:

```gdb
(gdb) start
# Starts the program and pauses at the first instruction in main()

(gdb) info registers
# Or 'i r'. Prints the current values of all CPU registers
```

```
📄 Screenshot this: gdb-registers-output.jpg
Figure 2 — GDB info registers output
Shows: r0 (value 1), pc (0x10414), sp, lr registers, etc.
Key: The Program Counter (pc) points to the active instruction address in memory.
```

> ![gdb-registers-output](img/gdb-registers-output.jpg)
> *Figure 2: Inspecting registers in GDB — showing the PC and general-purpose registers.*

To step to the next line of code, use:

```gdb
(gdb) next
# Or 'n'. Executes the current line of code and pauses at the next one.

(gdb) info registers
# The PC (Program Counter) address increases, indicating that the CPU has progressed in memory.
```

---

## 6. Diagnostic Tools — Your Best Friends

To inspect processes running on a Linux system, use the following tools:

### Process Viewers

| Tool | Purpose | Key Features |
|------|---------|--------------|
| `top` | Standard OS command-line process viewer. | Displays CPU, memory, PIDs, and running time. Read directly from the `/proc` filesystem by the kernel. |
| `htop` | Interactive, color-coded, user-friendly process viewer. | Allows filtering, searching, custom layouts, and interactive process termination. |

### Debuggers

| Tool | Purpose | Indicators |
|------|---------|------------|
| `gdb` | GNU Debugger. Used to step through C/C++ programs, inspect memory, set breakpoints, and view CPU registers. | ✅ Excellent for low-level process analysis.<br>🚨 Requires debug symbols (`-g`) for high-level source mapping. |
