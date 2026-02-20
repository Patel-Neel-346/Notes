## Bit Manipulation
> [!PDF|] [[Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed.pdf#page=37&selection=132,0,165,1|Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed, p.37]]
> > Writing a program to count the number of bits that are set to 1 in a positive integer 
#### Computing the parity of a word
> [!PDF|] [[Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed.pdf#page=38&selection=365,0,371,4|Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed, p.38]]
> > Cot'lpuuNc rlrE pARITy oF A woRD
> 
>  link to  the question

> [!PDF|] [[Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed.pdf#page=39&selection=768,9,788,10|Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed, p.39]]
> > The right shift does not remove the leading (11)-it results in (00001110)
> 
>**Shifting by 4** results in `00001110` (which is `14` in decimal), but the leading bits are not cleared. To isolate just the last two bits (10), the author uses **bitwise AND** with a mask like `00000011` to extract just the lower 2 bits. This avoids the problem of "out-of-bounds" access. 
#### Swap bits
> [!PDF|] [[Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed.pdf#page=41&selection=124,16,179,1|Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed, p.41]]
> > For example, as described on Page 23, the expression r & (x - 1) clears the lowest set bit in x, and x & -(x - 1) extracts thelowestsetbitof r. 
> 
> 
#### Reverse bits
> [!PDF|] [[Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed.pdf#page=42&selection=16,0,20,4|Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed, p.42]]
> > 4.3 Rrvrxsn utrs
> 
> 
- The brute force will be starting swapping bits at the start with the end one by one and the end we will have all the bits reversed

---

> [!PDF|] [[Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed.pdf#page=52&selection=467,0,471,15|Elements of Programming Interviews in Python_ The Insiders’ Guide - PDF Room_compressed, p.52]]
> > Know yow array libraries

