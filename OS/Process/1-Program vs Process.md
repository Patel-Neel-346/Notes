# Section 01 — Program vs Process

> **Course:** Fundamentals of Operating Systems · Hussein Nasser

---

## The core distinction

People use these words interchangeably. They mean very different things.

A **program** is a passive executable file sitting on disk — an ELF binary on Linux, a `.exe` on Windows. It persists until deleted. It consumes only disk space. There is one copy of it.

A **process** is what happens when the OS loads that program into RAM and starts executing it. It is active, temporary, and alive. Two processes can run the same program and behave completely differently based on their input and state.

---

## Side-by-side comparison

| Feature | Program | Process |
|---------|---------|---------|
| State | Passive — stored on disk | Active — running in RAM |
| Lifetime | Persistent until deleted | Temporary — starts, runs, terminates |
| Resources | Disk space only | RAM, CPU cycles, file descriptors |
| Uniqueness | One file on disk | Many instances can run simultaneously |
| Identity | File path / name | Process ID (PID) assigned by the kernel |

---

## How a program becomes a process

The OS reads the executable off disk, maps its sections into virtual memory, sets up the stack and heap, and hands control to the entry point. The CPU starts ticking through instructions.

```
Source (.c) → Compiler → Object file (.o) → Linker → Executable (ELF) → OS loads → Process
```

### Static vs dynamic linking

The linker has two strategies:

- **Static linking** — copies all library machine code directly into the binary. Large file, but runs anywhere with no dependencies.
- **Dynamic linking** — embeds pointers to external libraries loaded at runtime (`.so` on Linux, `.dll` on Windows). Small binary, but requires those files to exist on the target machine.

That's why copying just the `.exe` in the 90s gave you "DLL not found" errors — the program was dynamically linked and its dependencies weren't there.

| | Static | Dynamic |
|--|--------|---------|
| File size | Large | Small |
| Portability | High | Low (needs libs installed) |
| Format (Linux/Win) | `.a` / `.lib` | `.so` / `.dll` |

---

## What every process gets from the OS

When the kernel launches a process, it gives it identity and execution state:

### Identity
- **PID** — a unique integer assigned monotonically by the kernel. Dead PIDs are not immediately reused to avoid security bugs (a new process accidentally accessing lingering resources of a dead process).
- **Namespaces** — used in containerization (Docker). Virtualizes OS resources so a process inside a container sees its own sandboxed PIDs, network interfaces, mount points, and file descriptors — isolated from the host and other containers.
- **PCB (Process Control Block)** — an in-memory kernel data structure storing all process metadata: PID, Program Counter, CPU registers, page table pointer, file descriptor table, CPU usage stats.

### Execution state
- **PC / IP (Program Counter / Instruction Pointer)** — a CPU register holding the memory address of the next instruction to execute. The kernel saves and restores this on every context switch.
- **Registers** — the CPU's ultra-fast local scratchpad. On a context switch, all register values are saved to the PCB (RAM, ~100 ns), and the new process's registers are loaded back in. Think of it as saving a game checkpoint.
- **Memory map** — four regions mapped at process start: Text, Data, Heap, Stack.

---

## Language runtimes — where does your code actually run?

Not all languages create processes the same way.

**Compiled languages (C, Rust, Go)** compile directly to native machine code. The CPU runs their instructions directly. Your code *is* the process.

**Interpreted / VM languages (JavaScript, Python, Java)** work differently — the CPU executes the *runtime binary* (`node`, `python`, `java`), which has its own stack and heap. Your code runs *inside* that binary.

```
node server.js
└── Process: the `node` binary (machine code)
    └── Your JS runs inside Node's heap and stack
        └── Never directly a process
```

> **Node.js:** `process.pid` gives you the PID of the `node` instance. Your JavaScript is not the process — it's a guest inside it.

### Why this matters — the LinkerD story

LinkerD rewrote their service mesh proxy from Java to Rust. Java's runtime and garbage collector introduced latency spikes. Rust compiles to native machine code with no GC, giving deterministic, ultra-low latency. The runtime overhead was the bottleneck.

| | Compiled (C / Rust / Go) | Interpreted (JS / Python / Java) |
|--|--------------------------|----------------------------------|
| CPU runs | Your code directly | The runtime binary |
| Stack | Your process's stack | The runtime's stack |
| Latency | Deterministic | GC pauses possible |

---

## Context switch cost

When the OS preempts a process and runs another one:

1. Pause the current process
2. Save all CPU register values (including PC) to the PCB in RAM — ~100 ns per write
3. Load the new process's registers from its PCB into the CPU
4. Resume execution from the new PC

This is the hidden tax behind every multitasking moment. The more context switches, the more overhead.

---

## Quick checks

**Q: You run `node app.js` twice in two terminals. Are they the same process?**

No. Same *program* (the node binary on disk), but two separate *processes* — each gets its own PID, its own memory layout (stack, heap, data), and its own Program Counter. Changes to one don't affect the other.

---

**Q: Can two processes share the same program? Can two processes share memory?**

Yes to both. Multiple processes can run the same executable (e.g. two `node` processes). And processes *can* share memory via shared memory segments (`mmap` / `shmget`) or memory-mapped files — but their default virtual address spaces are completely isolated by default.

---

## Key concepts to remember

- **Program** = static file on disk. **Process** = program loaded in memory and running.
- Every process gets a PID, a PCB, a Program Counter, and its own virtual memory layout.
- PIDs are assigned monotonically; dead PIDs aren't immediately reused.
- Namespaces are how Docker creates container isolation.
- Context switches save registers to RAM (~100 ns) — this is the cost of multitasking.
- Compiled languages run natively. Interpreted languages run inside a runtime binary.
- Static linking = portable but large. Dynamic linking = small but requires dependencies.

---

*Next: Section 02 — How a Process Executes (fetch-decode-execute cycle, Program Counter, Text section)*