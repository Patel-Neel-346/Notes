### The Basic Tricks
#### Swap two numbers
```python
a = a ^ b #  → 0101 ^ 0111 = 0010 = 2
b = a ^ b #  → 0010 ^ 0111 = 0101 = 5
a = a ^ b #  → 0010 ^ 0101 = 0111 = 7
```
#### Check if Ith bit is set or not
```python fold
def first_way(n, i):
    # n = 10 → 1010
    # 1 << i = 1 << 1 = 0010
    # n & (1 << i) = 1010 & 0010 = 0010 → True
    return bool(n & (1 << i))

def second_way(n, i):
    # n = 10 → 1010
    # n >> i = 1010 >> 1 = 0101
    # (n >> i) & 1 = 0101 & 0001 = 0001 → True
    return bool((n >> i) & 1)

print(second_way(10, 1))  # Output: True
```
#### Set the  Ith bit
```python fold
num = 13            # 00001101
i = 1
# 1 << 1 = 00000010
# 00001101 | 00000010 = 00001111
num = num | (1 << i)
print(num)          # 15
```
#### Clean the Ith bit (if  it is 1 make it 0 or if it is 0 leave it as it is)
```python fold
#NOTE: only 1 & 1 is evauluated to 1 and apart from this everything will be evalulated 
# to 0. Remeber that we are not using any kind of `!` here so false going to converted into truthy 
# value. print(False and False) this is also going to return false
num = 15            # 00001111
i = 1
# 1 << 1 =        00000010
# ~(1 << 1) =     11111101
# 00001111 & 11111101 = 00001101
num = num & ~(1 << i)
print(num)          # 13
```
#### Toggle the Ith bit
```python fold
num = 15            # 00001111
i = 1
# 1 << 1 =        00000010
# 00001111 ^ 00000010 = 00001101
num = num ^ (1 << i)
print(num)          # 13
```
#### Rmove the last set bit
```python fold
num = 15            # 00001111
# num - 1 =        00001110
# 00001111 & 00001110 = 00001110
num = num & (num - 1)
print(num)          # 14
```
#### Check if the number is power of 2
```python fold
def is_power_of_2(n):
    if n <= 0:
        return False

    # Binary property:
    # A number is a power of 2 if it has only one '1' in its binary representation.
    # Example: 8 -> 1000, 4 -> 100, 2 -> 10

    # Calculation:
    # n & (n - 1) removes the lowest set bit from n.
    # If n is a power of 2, then n & (n - 1) == 0
    # Example: 
    # n = 8 (1000)
    # n - 1 = 7 (0111)
    # 1000 & 0111 = 0000

    return (n & (n - 1)) == 0

# Example usage
print(is_power_of_2(8))   # True
print(is_power_of_2(10))  # False
```
