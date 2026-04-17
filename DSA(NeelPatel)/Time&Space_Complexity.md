# Time & Space Complexity

> [!info] Overview
> This note covers the foundations of Time and Space complexity, which are critical for evaluating data structures, algorithms, and overall code performance beyond simple execution time.

## 1. Fundamentals

> [!note] Time Complexity
> The rate at which the execution time increases relative to the input size ($n$).

> [!note] Space Complexity
> The memory space required by a program to execute. It's the sum of:
> - **Auxiliary Space:** Extra space used to solve the problem (e.g., temporary variables, arrays).
> - **Input Space:** Space taken by the input data itself.
> 
> *Best Practice: Avoid manipulating input data purely to save space unless specifically instructed or required by the problem.*

### Asymptotic Notations

- **Big O Notation ($\mathcal{O}$)**: Upper bound. Represents the **worst-case scenario**. This is the primary focus in scaling.
- **Theta Notation ($\Theta$)**: Tight bound. Represents both upper and lower bounds (average or exact performance).
- **Omega Notation ($\Omega$)**: Lower bound. Represents the **best-case scenario**.
- **Little o and little $\omega$**: Strict upper bound (grows strictly slower) and strict lower bound (grows strictly faster).

### Three Rules for Big O
1. **Always assume the worst-case scenario**.
2. **Drop constants**: e.g., $\mathcal{O}(2n + 5)$ simplifies to $\mathcal{O}(n)$.
3. **Drop lower-order terms**: e.g., $\mathcal{O}(n^2 + n)$ simplifies to $\mathcal{O}(n^2)$. 

---

## 2. Common Orders of Growth

![Big O Complexity Graph](./img/image.png)

From slowest (most efficient) to fastest growing (least efficient) time complexity:
$\mathcal{O}(1) < \mathcal{O}(\log \log n) < \mathcal{O}(\log n) < \mathcal{O}(\sqrt[3]{n}) < \mathcal{O}(\sqrt{n}) < \mathcal{O}(n) < \mathcal{O}(n \log n) < \mathcal{O}(n^2) < \mathcal{O}(n^3) < \mathcal{O}(2^n) < \mathcal{O}(n!)$

> [!example] Common Complexities in Code
> - **$\mathcal{O}(1)$ (Constant)**: Operations not dependent on input (math operations, basic assignments).
> - **$\mathcal{O}(\log n)$ (Logarithmic)**: Input size is repeatedly divided (e.g., Binary Search).
> - **$\mathcal{O}(n)$ (Linear)**: Iterating through an array sequentially.
> - **$\mathcal{O}(n \log n)$ (Linearithmic)**: Divide and conquer algorithms (e.g., Merge Sort, Quick Sort).
> - **$\mathcal{O}(n^2)$ (Quadratic)**: Nested loops that both scale with input size $n$.
> - **$\mathcal{O}(2^n)$ (Exponential)**: Brute force recursion; exploring all combinations.
> - **$\mathcal{O}(n!)$ (Factorial)**: Generating all permutations.

---

## 3. Complexities of Data Structures & Algorithms

### Common Data Structures

| Data Structure | Access | Search | Insert | Delete | Space | Mnemonic |
|----------------|--------|--------|--------|--------|-------|----------|
| **Array** | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | *"Arrays peek fast, but tweaking takes a blast"* |
| **Linked List** | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | *"Lists link easily, but searching is tricky"* |
| **Stack** | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | *"Stacks pop and push with ease"* |
| **Queue** | $\mathcal{O}(n)$ | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | *"Queues are ready, but searches are unsteady"* |
| **BST** | $\mathcal{O}(\log n)$| $\mathcal{O}(\log n)$| $\mathcal{O}(\log n)$| $\mathcal{O}(\log n)$| $\mathcal{O}(n)$ | *"Binary Trees divide swiftly, conquer neatly"* |
| **Heap** | $\mathcal{O}(n)$ | $\mathcal{O}(\log n)$| $\mathcal{O}(\log n)$| $\mathcal{O}(\log n)$| $\mathcal{O}(n)$ | *"Heaps are heavy for access, but prioritize well"* |
| **Hash Table** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(n)$ | *"Hash Tables are fast, searching doesn’t last"* |
| **Graph** | - | $\mathcal{O}(V+E)$ | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(V+E)$| *"Graphs traverse far, edges travel stars"* |

> [!tip] Ultimate Mnemonic
> *"Arrays peek fast, lists last, trees grow slow, heaps know,*
> *Sort divides quick, Bubble’s thick, merge half the trick."*

### Sorting Algorithms

| Algorithm | Best | Average | Worst | Auxiliary Space |
|-----------|------|---------|-------|-----------------|
| **Bubble Sort** | $\mathcal{O}(n)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(n^2)$ | $\mathcal{O}(1)$ |
| **Merge Sort** | $\mathcal{O}(n \log n)$| $\mathcal{O}(n \log n)$| $\mathcal{O}(n \log n)$| $\mathcal{O}(n)$ |
| **Quick Sort** | $\mathcal{O}(n \log n)$| $\mathcal{O}(n \log n)$| $\mathcal{O}(n^2)$ | $\mathcal{O}(\log n)$ |
| **Binary Search**| $\mathcal{O}(1)$ | $\mathcal{O}(\log n)$| $\mathcal{O}(\log n)$| $\mathcal{O}(1)$ |

### Coding Patterns

| Pattern | Time Complexity | Space Complexity | Mnemonic |
|---------|-----------------|------------------|----------|
| **Sliding Window** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | *"Slide across, solve with ease, in constant space, please!"* |
| **Two Pointers** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | *"Two Pointers glide like wings, linear time brings"* |
| **Divide & Conquer**| $\mathcal{O}(n \log n)$| $\mathcal{O}(\log n)$ | *"Divide to Conquer, multiply the power"* |
| **Dynamic Programming**| Typically $\mathcal{O}(n^2)$ | $\mathcal{O}(n)$ | *"Save subproblems, don’t double the trouble"* |

---

## 4. Analyzing Loops & Recursion

### Loop Patterns

1. **Incremental Loop**: Adding/subtracting by a constant.
   ```cpp
   for (i = 0; i < n; i += c) // O(n)
   ```
2. **Multiplicative Loop**: Multiplying/dividing by a constant.
   ```cpp
   for (i = 1; i < n; i *= 2) // O(log n)
   ```
3. **Power Loop**: Scaling iteratively by powers.
   ```cpp
   for (i = 2; i <= n; i = i * i) // O(log log n)
   ```
4. **Dependent Nested Loops**: The inner loop limit depends on the outer loop.
   ```cpp
   for (i = 1; i <= n; i++)
       for (j = 1; j <= i; j++) // O(n^2) 
   ```
   *(Calculation: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2} = \mathcal{O}(n^2)$)*

### Recursion (Tree Method)

> [!PDF|] [[GeeksForGeeks: How to solve time complexity Recurrence Relations using Recursion Tree method?]]
> To estimate the complexity of recursive functions:
> 1. Express the cost in terms of a **Recurrence Relation**.
> 2. **Draw a recursion tree**: visualize the split across levels.
> 3. Apply the formula: **Total Work = Sum of all levels' cost**.

> [!example] Binary Branching Recursion (e.g. Fibonacci, finding all subsets)
> Recurrence: $T(n) = 2T(n-1) + c$
> - Level 0: $c$
> - Level 1: $2c$
> - Level k: $2^k \cdot c$
> 
> *Summation*: $c(1 + 2 + \dots + 2^{n-1}) = \Theta(2^n)$ 

> [!example] Merge Sort Division
> Recurrence: $T(n) = 2T(n/2) + \mathcal{O}(n)$
> - Level 0: $\mathcal{O}(n)$
> - Level 1: $2 \cdot \mathcal{O}(n/2) = \mathcal{O}(n)$
> 
> *Summation*: There are $\log_2 n$ levels. Summing $\mathcal{O}(n)$ across $\log_2 n$ levels yields **$\mathcal{O}(n \log n)$**.

---

## 5. Practical Checklist for Estimation
- **Additive steps**: Keep the highest dominant term (e.g. $\mathcal{O}(n) + \mathcal{O}(n^2) \rightarrow \mathcal{O}(n^2)$).
- **Independent Nested Loops**: Multiply the bounds of independent loops (e.g., $N$ passes of an inner loop capping at $M$ gives $\mathcal{O}(N \times M)$).
- **Recursion Space Complexity**: Remember that recursion consumes memory on the Call Stack. Depth matters just as much as variables instantiated.
- **Constants Don't Matter (Usually)**: In asymptotic analysis, large constants are ignored, but in competitive programming or latency-critical applications, large constant overheads *can* cause TLE (Time Limit Exceeded).