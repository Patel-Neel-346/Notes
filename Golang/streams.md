# **Streaming APIs: Go vs Node.js - Code-First Comparison**

## **1. BASIC COPY: Reader → Writer**

### **Go (io.Copy)**
```go
package main

import (
    "io"
    "os"
)

func main() {
    src, _ := os.Open("input.txt")
    defer src.Close()
    
    dst, _ := os.Create("output.txt")
    defer dst.Close()
    
    // Blocking copy with automatic backpressure
    bytes, err := io.Copy(dst, src)
    if err != nil {
        panic(err)
    }
    println("Copied", bytes, "bytes")
}
```

### **Node.js (pipeline)**
```javascript
const fs = require('fs');
const { pipeline } = require('stream');

const src = fs.createReadStream('input.txt');
const dst = fs.createWriteStream('output.txt');

// Async pipeline with error handling
pipeline(src, dst, (err) => {
    if (err) {
        console.error('Pipeline failed:', err);
    } else {
        console.log('Pipeline succeeded');
    }
});
```

## **2. TEE / FAN-OUT: One source, multiple destinations**

### **Go (io.TeeReader - NATIVE)**
```go
func teeExample() {
    src := strings.NewReader("Hello, World!")
    
    // Create a buffer to capture the "tee'd" data
    var buf bytes.Buffer
    
    // TeeReader reads from src and writes to &buf simultaneously
    tee := io.TeeReader(src, &buf)
    
    // Read from tee (which also writes to buf)
    data, _ := io.ReadAll(tee)
    fmt.Println("Main data:", string(data))  // Hello, World!
    fmt.Println("Tee'd data:", buf.String()) // Hello, World!
}
```

### **Node.js (Manual with PassThrough)**
```javascript
const { PassThrough } = require('stream');

function teeStream(inputStream) {
    const stream1 = new PassThrough();
    const stream2 = new PassThrough();
    
    // Manual fan-out - easy to mess up backpressure!
    inputStream.pipe(stream1);
    inputStream.pipe(stream2);
    
    return [stream1, stream2];
}

// Usage
const fs = require('fs');
const src = fs.createReadStream('input.txt');

const [copy1, copy2] = teeStream(src);

copy1.pipe(fs.createWriteStream('copy1.txt'));
copy2.pipe(fs.createWriteStream('copy2.txt'));
```

## **3. MULTI-SOURCE: Combine multiple readers**

### **Go (io.MultiReader - NATIVE)**
```go
func combineFiles() {
    file1 := strings.NewReader("First part\n")
    file2 := strings.NewReader("Second part\n")
    file3 := strings.NewReader("Third part\n")
    
    // Seamlessly combine multiple sources
    combined := io.MultiReader(file1, file2, file3)
    
    // Read as if it's one continuous stream
    data, _ := io.ReadAll(combined)
    fmt.Print(string(data))
    // Output:
    // First part
    // Second part
    // Third part
}
```

### **Node.js (No native equivalent - need workaround)**
```javascript
const { Readable, PassThrough } = require('stream');

class MultiStream extends Readable {
    constructor(streams) {
        super();
        this.streams = streams;
        this.currentIndex = 0;
    }
    
    _read() {
        if (this.currentIndex >= this.streams.length) {
            this.push(null); // EOF
            return;
        }
        
        const currentStream = this.streams[this.currentIndex];
        const chunk = currentStream.read();
        
        if (chunk === null) {
            this.currentIndex++;
            this._read(); // Try next stream
        } else {
            this.push(chunk);
        }
    }
}

// Much more verbose and error-prone!
```

## **4. TRANSFORM: Modify data on the fly**

### **Go (Custom Reader/Writer)**
```go
type UpperCaseReader struct {
    src io.Reader
}

func (u *UpperCaseReader) Read(p []byte) (int, error) {
    n, err := u.src.Read(p)
    
    // Transform in place
    for i := 0; i < n; i++ {
        p[i] = byte(unicode.ToUpper(rune(p[i])))
    }
    
    return n, err
}

func main() {
    src := strings.NewReader("hello world")
    upper := &UpperCaseReader{src: src}
    
    io.Copy(os.Stdout, upper) // HELLO WORLD
}
```

### **Node.js (Transform stream)**
```javascript
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        // Transform the data
        const upper = chunk.toString().toUpperCase();
        this.push(upper);
        callback();
    }
}

const src = fs.createReadStream('input.txt');
const transform = new UpperCaseTransform();
const dst = fs.createWriteStream('output.txt');

pipeline(src, transform, dst, (err) => {
    if (err) console.error(err);
});
```

## **5. BACKPRESSURE DEMO**

### **Go (Automatic - Blocking)**
```go
func slowConsumer() {
    src := &SlowReader{} // Produces 1MB/sec
    dst := &SlowWriter{} // Consumes 100KB/sec
    
    // This just works - automatically throttled!
    io.Copy(dst, src)
    
    // No buffers explode, no memory issues
}

type SlowWriter struct{}
func (s *SlowWriter) Write(p []byte) (int, error) {
    time.Sleep(10 * time.Millisecond) // Slow write
    fmt.Printf("Wrote %d bytes\n", len(p))
    return len(p), nil
}
```

### **Node.js (Manual Control Required)**
```javascript
class SlowWriter extends stream.Writable {
    constructor() {
        super({ highWaterMark: 64 * 1024 }); // 64KB buffer
    }
    
    _write(chunk, encoding, callback) {
        console.log(`Buffer size: ${this.writableLength} bytes`);
        
        // Simulate slow processing
        setTimeout(() => {
            console.log(`Processed ${chunk.length} bytes`);
            
            // MANUAL backpressure control
            if (this.writableLength > 50 * 1024) {
                console.log('High pressure - would pause source here');
            }
            
            callback();
        }, 100);
    }
}

// Easy to get wrong - might buffer entire file in memory!
```

## **6. ERROR HANDLING COMPARISON**

### **Go (Explicit, Can't Ignore)**
```go
func processWithErrors() error {
    src, err := os.Open("input.txt")
    if err != nil {
        return fmt.Errorf("open failed: %w", err)
    }
    defer src.Close()
    
    // Compiler warns if err is not checked
    _, err = io.Copy(dst, src)
    if err != nil {
        return fmt.Errorf("copy failed: %w", err)
    }
    
    return nil // Must return error
}
```

### **Node.js (Easy to Miss)**
```javascript
// ❌ BAD - Silent error
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));
// Error? Who knows!

// ✅ GOOD - With pipeline
pipeline(
    fs.createReadStream('input.txt'),
    fs.createWriteStream('output.txt'),
    (err) => {
        if (err) {
            console.error('Error:', err);
        }
    }
);
```

## **7. COMPLEX PIPELINE EXAMPLE**

### **Go (Clean and Composable)**
```go
func processPipeline(input io.Reader) io.Reader {
    // Decompress
    decompressed, _ := gzip.NewReader(input)
    
    // Log what passes through
    logged := io.TeeReader(decompressed, os.Stdout)
    
    // Transform
    transformed := &UpperCaseReader{src: logged}
    
    // Compress output
    pr, pw := io.Pipe()
    go func() {
        gz := gzip.NewWriter(pw)
        io.Copy(gz, transformed)
        gz.Close()
        pw.Close()
    }()
    
    return pr
}
```

### **Node.js (Verbose but Functional)**
```javascript
const zlib = require('zlib');
const { pipeline, Transform } = require('stream');

function processPipeline(input) {
    const gunzip = zlib.createGunzip();
    const gzip = zlib.createGzip();
    
    const logger = new Transform({
        transform(chunk, encoding, callback) {
            console.log('Processing:', chunk.length, 'bytes');
            this.push(chunk);
            callback();
        }
    });
    
    const uppercase = new Transform({
        transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }
    });
    
    // Chain them
    return pipeline(
        input,
        gunzip,
        logger,
        uppercase,
        gzip,
        (err) => {
            if (err) console.error('Pipeline error:', err);
        }
    );
}
```

## **8. CONCURRENCY: Process with workers**

### **Go (Channels + Goroutines)**
```go
func processWithWorkers(input io.Reader, numWorkers int) {
    // Create worker pool
    jobs := make(chan []byte, numWorkers)
    results := make(chan []byte, numWorkers)
    
    // Start workers
    for i := 0; i < numWorkers; i++ {
        go worker(jobs, results)
    }
    
    // Read and distribute
    scanner := bufio.NewScanner(input)
    scanner.Split(bufio.ScanLines)
    
    go func() {
        for scanner.Scan() {
            jobs <- scanner.Bytes()
        }
        close(jobs)
    }()
    
    // Collect results
    for i := 0; i < numWorkers; i++ {
        result := <-results
        // Process result
    }
}
```

### **Node.js (Worker threads)**
```javascript
const { Worker } = require('worker_threads');

async function processWithWorkers(inputStream) {
    const workers = [];
    
    // Create workers
    for (let i = 0; i < 4; i++) {
        const worker = new Worker('./worker.js');
        workers.push(worker);
    }
    
    // Round-robin distribution
    let workerIndex = 0;
    inputStream.on('data', (chunk) => {
        workers[workerIndex].postMessage(chunk);
        workerIndex = (workerIndex + 1) % workers.length;
    });
    
    // Much more complex error handling needed
}
```

## **KEY TAKEAWAYS FROM CODE**

### **Go's Advantages in Code:**
1. **Native composition**: `io.TeeReader()`, `io.MultiReader()`, `io.MultiWriter()`
2. **Automatic backpressure**: Blocking reads = no buffer explosions
3. **Clean error handling**: Returns errors, can't ignore them
4. **Simple concurrency**: Goroutines + channels just work

### **Node.js Advantages in Code:**
1. **Non-blocking I/O**: Thousands of concurrent streams
2. **HTTP integration**: Built-in HTTP streaming
3. **Event-driven**: Fits web/network patterns naturally
4. **Ecosystem**: Many pre-built stream utilities

### **When to Choose Based on Code Patterns:**

**Use Go when you see:**
- `io.TeeReader(reader, writer)` needed
- `io.MultiReader(file1, file2, file3)` pattern
- CPU-intensive transformations
- Need to avoid memory blow-ups

**Use Node.js when you see:**
- `response.pipe(transform).pipe(res)` (HTTP streaming)
- Many async I/O operations
- Real-time data (WebSockets, Server-Sent Events)
- Quick prototyping with npm packages

## **One File Comparison**

### **Go (Complete Example)**
```go
package main

import (
    "io"
    "strings"
    "fmt"
    "compress/gzip"
    "bytes"
)

func main() {
    // Create source
    src := strings.NewReader("Hello, World!")
    
    // Tee to log
    var logBuf bytes.Buffer
    tee := io.TeeReader(src, &logBuf)
    
    // Process
    processed := process(tee)
    
    // Output
    data, _ := io.ReadAll(processed)
    fmt.Println("Output:", string(data))
    fmt.Println("Logged:", logBuf.String())
}

func process(r io.Reader) io.Reader {
    pr, pw := io.Pipe()
    
    go func() {
        gz := gzip.NewWriter(pw)
        io.Copy(gz, r)
        gz.Close()
        pw.Close()
    }()
    
    return pr
}
```

### **Node.js (Complete Example)**
```javascript
const { pipeline, Transform, PassThrough } = require('stream');
const zlib = require('zlib');

async function main() {
    const src = require('stream').Readable.from(['Hello, World!']);
    
    // Manual tee
    const logStream = new PassThrough();
    const processStream = new PassThrough();
    
    src.pipe(logStream);
    src.pipe(processStream);
    
    // Process
    const processed = await process(processStream);
    
    // Collect results
    const chunks = [];
    processed.on('data', chunk => chunks.push(chunk));
    processed.on('end', () => {
        console.log('Output:', Buffer.concat(chunks).toString());
    });
}

function process(input) {
    return pipeline(
        input,
        new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk.toString().toUpperCase());
                callback();
            }
        }),
        zlib.createGzip(),
        (err) => {
            if (err) throw err;
        }
    );
}
```

**Final Code Verdict**: Go's streaming is **simpler, safer, and more composable** for data processing. Node.js streaming is **more async, web-friendly, and ecosystem-rich** for network applications. Choose based on your specific needs, not just language preference.