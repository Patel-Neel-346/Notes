# Vim Substitution Practice Exercises

## Exercise 1: Basic Substitution
Original text:
```javascript
const colors = {
    red
    blue
    green
    yellow
}
```
Tasks:
1. Add colons (:) after each color name
   - Command to use: `:s/\(\w\+\)/\1:/`
2. Add quotes around each color name
   - Command to use: `:%s/\(\w\+\):/\1: "\1"/g`
3. Add commas at the end of each line
   - Command to use: `:%s/$/,/g`

Expected result:
```javascript
const colors = {
    red: "red",
    blue: "blue",
    green: "green",
    yellow: "yellow",
}
```

## Exercise 2: Multiple File Imports
Original text:
```javascript
import { fetchUserData } from '@/api/user';
import { fetchOrderData } from '@/api/order';
import { fetchProductData } from '@/api/product';
import { fetchCartData } from '@/api/cart';
```
Tasks:
1. Convert each import to a mock constant
   - Command to use: `:%s/import { \(.*\) } from.*/const \1Mock = \1 as jest.Mock<Promise<any>>;/g`

Expected result:
```javascript
const fetchUserDataMock = fetchUserData as jest.Mock<Promise<any>>;
const fetchOrderDataMock = fetchOrderData as jest.Mock<Promise<any>>;
const fetchProductDataMock = fetchProductData as jest.Mock<Promise<any>>;
const fetchCartDataMock = fetchCartData as jest.Mock<Promise<any>>;
```

## Exercise 3: Phone Number Formatting
Original text:
```
1234567890
9876543210
5551234567
```
Tasks:
1. Format as (XXX) XXX-XXXX
   - Command to use: `:%s/\(\d\{3}\)\(\d\{3}\)\(\d\{4}\)/(\1) \2-\3/g`

Expected result:
```
(123) 456-7890
(987) 654-3210
(555) 123-4567
```

## Exercise 4: Mixed Case Correction
Original text:
```
firstName: john smith
lastName: JANE DOE
email: ADMIN@EXAMPLE.com
username: TechUser123
```
Tasks:
1. Make the field names camelCase
   - Command to use: `:%s/\(\w\+\):/\L\1:/g`
2. Capitalize first letter of names
   - Command to use: `:%s/: \(\w\+\)\( \w\+\)\?/: \u\1\L\2/g`

Expected result:
```
firstName: John Smith
lastName: Jane Doe
email: ADMIN@EXAMPLE.com
username: TechUser123
```

## Exercise 5: HTML Tag Transformation
Original text:
```html
<div>Hello World</div>
<span>Click me</span>
<p>Some text</p>
<div>Another div</div>
```
Tasks:
1. Add a class to specific tags (div and span only)
   - Command to use: `:%s/<\(div\|span\)/<\1 class="highlight"/g`
2. Change all div tags to article tags
   - Command to use: `:%s/<\/\?div/<\/\?article/g`

Expected result:
```html
<article class="highlight">Hello World</article>
<span class="highlight">Click me</span>
<p>Some text</p>
<article class="highlight">Another div</article>
```

## Exercise 6: Variable Declaration Conversion
Original text:
```javascript
var name = "John";
var age = 25;
var city = "New York";
var isStudent = true;
```
Tasks:
1. Convert var to const
   - Command to use: `:%s/var/const/g`
2. Add type annotations (: string for text, : number for numbers, : boolean for true/false)
   - Command to use: `:%s/const \(\w\+\) = \("\([^"]*\)"\)/const \1: string = \2/g`
   - Command to use: `:%s/const \(\w\+\) = \(\d\+\)/const \1: number = \2/g`
   - Command to use: `:%s/const \(\w\+\) = \(true\|false\)/const \1: boolean = \2/g`

Expected result:
```javascript
const name: string = "John";
const age: number = 25;
const city: string = "New York";
const isStudent: boolean = true;
```

## Exercise 7: URL Transformation
Original text:
```
http://example.com/path
https://test.com/another/path
http://localhost:3000/api
https://dev.site.com/test
```
Tasks:
1. Add trailing slashes to URLs
   - Command to use: `:%s/\([^/]\)$/\1\//g`
2. Convert http to https
   - Command to use: `:%s/^http:/https:/g`
3. Add api version to paths
   - Command to use: `:%s|\(/[^/]*\)$|/v1\1|`

Expected result:
```
https://example.com/v1/path/
https://test.com/another/v1/path/
https://localhost:3000/v1/api/
https://dev.site.com/v1/test/
```

## Exercise 8: Comment Transformation
Original text:
```javascript
// TODO: fix this bug
// TODO: implement feature
// TODO: update docs
// TODO: add tests
```
Tasks:
1. Convert to JSDoc-style comments
   - Command to use: `:%s/\/\/ TODO: \(.*\)$/\/\** @todo \1 *\//g`
2. Add priority levels (P1, P2, etc.)
   - Command to use: `:%s/@todo \(.*\) \*\//@todo [P\=line('.')] \1 *\//g`

Expected result:
```javascript
/** @todo [P1] fix this bug */
/** @todo [P2] implement feature */
/** @todo [P3] update docs */
/** @todo [P4] add tests */
```

## Tips for Practice:
1. Create a new file with the "Original text" for each exercise
2. Try the commands one by one
3. If something goes wrong, you can undo with `u`
4. Use `:%s///n` to preview matches before making changes
5. Use `:%s///gc` to confirm each change
6. Practice creating your own patterns for similar transformations

## Commands

Basic Special Characters:
1. `\w` - matches any word character (letter, number, underscore)
   ```
   hello123_world  -> \w matches each of h,e,l,l,o,1,2,3,_,w,o,r,l,d
   ```

2. `.` - matches ANY single character (including spaces!)
   ```
   hello world!  -> . matches each of h,e,l,l,o, ,w,o,r,l,d,!
   ```

3. `+` - means "one or more of the previous character"
   ```
   helllllo -> l+ matches llllll (all consecutive l's)
   ```

Modifiers:
1. `\u` - Uppercase next letter
   ```
   :%s/john/\ujohn/  -> John
   ```

2. `\L` - Lowercase all following characters
   ```
   :%s/HELLO/\Lhello/  -> hello
   ```

3. `\d` - matches any digit
   ```
   phone: 123  -> \d matches 1,2,3
   ```

Quantifiers:
1. `{n}` - exactly n times
   ```
   \d{3}  matches exactly 3 digits: 123
   ```

2. `[]` - character class (match any character inside brackets)
   ```
   [abc]  matches either a, b, or c
   [0-9]  matches any digit (same as \d)
   ```

Let's practice with simple examples:

1. Match three-letter words:
```
cat dog rat
:%s/\(\w\{3}\)/[\1]/g
Result: [cat] [dog] [rat]
```

2. Capitalize first letter of each word:
```
john smith
:%s/\<\w/\u&/g
Result: John Smith
```

3. Match phone numbers:
```
1234567890
:%s/\(\d\{3}\)\(\d\{3}\)\(\d\{4}\)/(\1) \2-\3/
Result: (123) 456-7890
```

Ah, let's break down the `\<\w` pattern!

`\<` is a special marker in Vim that matches the start of a word. Think of it as "word boundary at the beginning". So:

```
john smith

\< matches:
- position before 'j'
- position before 's'

It doesn't match:
- position before 'o', 'h', 'n'
- position before 'm', 'i', 't', 'h'
```

So in the command `:%s/\<\w/\u&/g`:
1. `\<\w` means "find a single letter (\w) that's at the start of a word (\<)"
2. `\u` means "make uppercase"
3. `&` means "the whole thing we matched"
4. `/g` means do this for all matches in each line

Let's see it work step by step:
```
john smith

1. First match:
   \<\w finds 'j' (because it's at start of word)
   \u& makes it 'J'
   
2. Second match:
   \<\w finds 's' (because it's at start of word)
   \u& makes it 'S'

Result: John Smith
```

If we didn't use `\<` and just used `\w`:
```
:%s/\w/\u&/g
john smith → JOHN SMITH  
(because it would capitalize every letter!)
```

Would you like to try some variations of this pattern to better understand word boundaries?