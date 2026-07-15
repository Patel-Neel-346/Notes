# Section 01 — Program vs Process

**Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## 1. Intuition

Imagine you have a cooking recipe printed on a piece of paper. The paper just sits in a drawer. This is a **program** — a passive, static file stored on a hard drive or SSD (like an `.exe` file on Windows or an ELF binary on Linux). It does not cook, consume ingredients, or take up kitchen counter space; it is just a set of instructions at rest.

Now, imagine a chef takes the recipe, goes into the kitchen, turns on the stove, and begins cooking. This active, dynamic state of cooking is a **process**. A process is a program in motion. It has a life, consumes kitchen resources (CPU cycles, system RAM, network ports), and has a state that changes dynamically (e.g., "chopped onions" or variables stored in registers). 

If two different chefs are cooking the same recipe in two different kitchens, they are running two separate **processes**. One might be on Step 3 while the other is on Step 5, and if one spills soup, the other chef's kitchen remains completely unaffected.

---

## 2. Why This Exists

Operating systems introduce the **Process** abstraction to solve two fundamental problems in computer architecture:
* **Resource Allocation**: The OS needs a way to account for and allocate CPU time, RAM, and device access. The process acts as the container to which these resources are billed and assigned.
* **Process Isolation & Security**: Without a process boundary, a single bug in one running application (like a pointer writing to a random address) could overwrite the memory of another application or crash the entire operating system. The process boundary, enforced by CPU hardware, ensures that each running application is isolated in its own virtual sandbox. If a process crashes, it crashes alone.

---

## 3. Core Concept

Here are the formal definitions of program and process concepts:

| Term | Formal Definition | Description |
|:---|:---|:---|
| **Program** | A passive file containing a sequence of compiled machine instructions and static data, stored on non-volatile media. | E.g., ELF format on Linux, PE format on Windows. Consumes only disk space. |
| **Process** | An active, isolated instance of execution containing a program's code loaded into virtual memory, a program counter, registers, stack, and heap. | Created by the OS loader. Consumes RAM, CPU cycles, and OS descriptors. |
| **Process ID (PID)** | A unique integer identifier assigned to an active process by the operating system kernel. | Used to schedule, signal, and manage the process. |
| **Process Control Block (PCB)** | A kernel data structure that stores all execution and scheduling metadata for a process. | Used to save and restore process state during context switches. |
| **Linker** | A compiler-toolchain utility that combines compiled object files (`.o`) and libraries into a single executable binary. | Resolves symbols and relocates memory references. |
| **Dynamic Linker (`ld.so`)** | An OS helper utility that loads and binds shared libraries (`.so` or `.dll`) into a process's address space at launch. | Resolves external references at runtime. |

---

## 4. Internal Working

Let's explore the underlying mechanisms of compiling, linking, loading, and process metadata management.

### The Build Lifecycle: Compilation and Linking

To convert human-readable source code into a running process, the program goes through several compilation stages:

```
Source (.c) ──▶ Compiler ──▶ Object File (.o) ──▶ Linker ──▶ Executable (ELF/EXE) ──▶ OS Loader ──▶ Process in RAM
```

The **Linker** performs two critical phases:
1. **Symbol Resolution**: It matches function declarations and variables referenced in one file to their implementations defined in other files or libraries (e.g. mapping a call to `printf()` to the standard C library).
2. **Relocation**: It merges the individual code and data sections of object files and assigns final, absolute virtual addresses to instruction labels and variables.

#### Common Linker Errors
* `Undefined reference to 'x'`: Occurs when code references a function or variable `x`, but the linker cannot find its definition in any object file or linked library.
* `Multiple definition of 'x'`: Occurs when the same global symbol `x` is defined in multiple object files, breaking the *One Definition Rule (ODR)*.

---

### Static vs. Dynamic Linking

At link time, the developer choose between two linking models:

#### 1. Static Linking
The linker copies the actual machine code of every dependency library directly into the executable file.
* **Compile command**: `gcc main.c -o app_static -static`
* **Result**: A large binary file (~870 KB for a basic C program) containing all library functions (e.g., `printf` from `libc.a`).
* **RAM Footprint**: If 50 statically linked programs are running, the OS must load 50 separate copies of `printf`'s machine code into 50 different regions of RAM.

#### 2. Dynamic Linking
The linker does not copy library code. Instead, it embeds references (e.g., *"this program needs libm.so.6"*).
* **Compile command**: `gcc main.c -o app_dynamic` (default behavior)
* **Result**: A tiny binary (~16 KB) containing only your code and a list of references.
* **RAM Footprint**: All 50 running processes point to a single copy of `libc.so.6` loaded into physical memory. The OS maps this single physical page into each process's virtual memory map, saving massive amounts of RAM.

```
📄 Screenshot this: program-in-memory-layout.webp
Figure 1 — Static vs Dynamic Memory footprint
Shows: Physical RAM containing two running processes.
With Static linking: Process 1 and Process 2 have duplicate library copies in RAM.
With Dynamic linking: Process 1 and Process 2 point to a shared physical libc.so memory page.
```

> ![program-in-memory-layout](images/program-in-memory-layout.png)
> *Figure 1: Memory Footprint — dynamic linking allows multiple processes to share a single physical copy of libraries in RAM, whereas static linking duplicates them.*

---

### What the OS Grants to a Process

When the loader instantiates a process, the kernel allocates:

#### 1. A Process Control Block (PCB)
The PCB resides in kernel memory and contains the process's metadata:
* **PID**: Monotonically assigned (e.g., 1001, 1002). Dead PIDs are cached before reuse to prevent a new process from inheriting old signals or socket connections.
* **Namespaces**: Isolates PIDs, networks, and file paths for container tools like Docker.
* **File Descriptor Table**: Maps pointers to open files, network sockets, and pipes.

#### 2. CPU Registers & PC
The CPU's **Program Counter (PC)** and general registers hold the process's active execution checkpoint. During a context switch:
1. The kernel pauses the process.
2. It saves the CPU hardware registers (including the PC) to the PCB in RAM (~100 ns write cost).
3. It loads the registers of the next process from its PCB into the CPU hardware.

---

## 5. Step-by-Step Execution: Loader and Linker Lifecycle

### Trace 1: The Runtime Linker (`ld.so`) Launch Sequence
When you execute a dynamically linked program (e.g., `./app_dynamic`), the OS loader executes the following steps:

1. **VFS Interception**: The kernel intercepts the run request and reads the ELF header.
2. **Dynamic Linker Execution**: The kernel sees the binary is dynamic and loads the dynamic linker (`ld.so` or `ld-linux.so`) first.
3. **Parse `.dynamic`**: `ld.so` reads the binary's `.dynamic` section to identify required shared objects (`.so` dependencies).
4. **Locate Libraries**: It searches standard system paths (defined in `/etc/ld.so.conf` or `LD_LIBRARY_PATH`) for libraries like `libc.so.6`.
5. **Memory Mapping**: The kernel maps the shared libraries into the process's virtual memory map.
6. **Patch GOT (Global Offset Table)**: `ld.so` updates the GOT in the data section with the actual runtime memory addresses of the loaded library functions.
7. **Jump to Entry**: The dynamic linker jumps to the program's main entry point, and execution begins.

---

### Trace 2: The "DLL Not Found" Failure
This sequence demonstrates the classic 90s floppy disk error:

```
[ Copy game.exe to Floppy ] ──▶ [ Move to Home PC ] ──▶ [ Execute game.exe ] ──▶ [ ld.so searches paths ] ──▶ [ Missing DirectX.dll ] ──▶ [ Crash Dialog ]
```

1. A user copies `game.exe` to a floppy disk, leaving behind `DirectX.dll` on the source machine.
2. The user executes `game.exe` on a home PC.
3. The loader spawns the process and handoff to the runtime linker (`ld.so` / `ntdll.dll`).
4. The dynamic linker parses the binary header and reads: *"Requires DirectX.dll"*.
5. The linker searches the executable directory, `C:\Windows\System32`, and path variables.
6. `DirectX.dll` is not found. The runtime linker halts execution and triggers an error dialog: `DirectX.dll not found`.
7. **Result**: The process crashes before `main()` executes a single instruction.

---

## 6. Real Implementation Notes

### Linux ELF Segment Layout
Linux executables use the Executable and Linkable Format (ELF). You can inspect the dynamic library dependencies of any Linux binary using the `ldd` command:
```sh
ldd $(which node)
# libdl.so.2   => /lib/x86_64-linux-gnu/libdl.so.2
# libm.so.6    => /lib/x86_64-linux-gnu/libm.so.6
# libc.so.6    => /lib/x86_64-linux-gnu/libc.so.6
```

### Windows PE imports & DLLs
Windows uses the Portable Executable (PE) format. Dynamic libraries are Dynamic Link Libraries (`.dll`). The OS loader resolves dynamic pointers using the **Import Address Table (IAT)** at process startup.

### Musl vs. Glibc (Docker Alpine Compatibility)
Docker containers based on Alpine Linux are small because Alpine utilizes **musl libc** instead of the GNU C Library (**glibc**). If a pre-compiled native Node.js module (dynamically linked against `glibc`) is executed inside a `node:alpine` Docker container, the runtime linker will fail with a `cannot find shared library` error because it cannot find the expected `glibc` symbols.

---

## 7. Comparison Tables

### Static vs. Dynamic Linking

| Feature | Static Linking | Dynamic Linking |
|:---|:---|:---|
| **Binary File Size** | Large (~870 KB for basic C) | Small (~16 KB for basic C) |
| **RAM Footprint (50 apps)**| 50 separate copies loaded in RAM | 1 shared copy in physical RAM |
| **Portability** | High (runs without host dependencies) | Low (requires libraries on target host) |
| **Security Patching** | Must recompile every binary | Update the shared library once |
| **Startup Speed** | Fast (no address resolution needed) | Slightly slower (`ld.so` must resolve maps) |
| **File Formats** | `.a` (Linux) / `.lib` (Windows) | `.so` (Linux) / `.dll` (Windows) |

---

## 8. Interview Questions

### Beginner
* **Q: What is the main difference between a program and a process?**
  * **A:** A program is a passive, compiled executable file sitting on disk. A process is an active, running instance of that program loaded into RAM, consuming CPU cycles, memory, and kernel resources.

### Intermediate
* **Q: Why are process PIDs not recycled immediately by the kernel upon termination?**
  * **A:** To prevent race conditions and security vulnerabilities. If a PID were recycled immediately, a new process could receive the same PID and accidentally intercept delayed network packets, signals, or IPC messages intended for the terminated process.

### Advanced
* **Q: Explain how dynamic linking saves physical RAM using virtual memory page mapping.**
  * **A:** When a dynamically linked program executes, the OS loads the shared library (e.g., `libc.so`) into physical RAM once. When other processes launch that require `libc.so`, the OS does not duplicate the library in RAM. Instead, the virtual memory manager maps the same physical RAM page descriptors into the page tables of all executing processes, sharing the read-only text memory segments.

---

## 9. Common Mistakes

* **Copying Shortcuts**:
  * **Why it's wrong**: Copying a `.lnk` (shortcut) file to a flash drive does not copy the program. The shortcut is simply a tiny text pointer file holding the path to the executable.
* **Alpine Docker Crashes**:
  * **Why it's wrong**: Deploying a pre-compiled Go or Node native module to a `node:alpine` container without realizing the binary is dynamically compiled against `glibc`. Alpine uses `musl libc`, which will cause a silent execution failure or library missing crash. Compile the binary statically to run safely on Alpine.

---

## 10. Revision Notes

### Key Points
* A program is a passive file on disk; a process is a program executing in RAM.
* Process isolation is enforced by CPU hardware to prevent processes from modifying each other's memory.
* Static linking embeds dependencies (large size, high portability).
* Dynamic linking maps shared libraries at startup (small size, memory saving).
* The dynamic linker (`ld.so`) parses the `.dynamic` section to resolve dynamic library addresses.

### Important Definitions
* **Process Control Block (PCB)**: A kernel memory block storing process registers, PC, scheduling state, and open descriptors.
* **Import Address Table (IAT)**: A PE header structure on Windows used by the loader to resolve DLL symbols.

### Memory Tricks
* **"Static is a suitcase, Dynamic is a library card"**: With static linking, you pack the dependencies with you. With dynamic, you check them out from the system library at runtime.
* **"Processes are isolated, Threads are shared"**: Two processes share nothing by default; their virtual address spaces are strictly sandboxed.

---

## 11. Image Suggestions

* **Program to Process Loading Mapping**: Showing an ELF file on disk mapping into virtual memory segments in RAM.
* **Static vs. Dynamic RAM Pages**: Illustrating shared memory page mapping for dynamic libraries.
* **The Dynamic Linker `ld.so` Resolution Flowchart**: Showing the step-by-step search and relocation mapping.
* **Docker Alpine glibc Missing Symbol Conflict**: Visualizing symbol mapping failure between musl and glibc.
