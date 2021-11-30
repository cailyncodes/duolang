# Duolang

Duolang is an esoteric meta programming language. You use the Duolingo app as your code editor and the progress in a course is the source code.

## How does it work?

At its core, Duolang is a stack-based with a single-cell tape interpreted language, largely adopting JS-semantic (when applicable).

### Philosophy

The goal with designing this language around Duolingo was to make it such that anyone's progress in a course would successfully execute (perhaps infinitely, but no runtime errors). Thus, one of the core principles is that when encountering values that would be otherwise undefined and normally cause runtime issues, the language itself will use trivial defaults (e.g. 0, '', etc). I also wanted invocations of an arbitrary program to have a high likely hood of at least some (perhaps meaningless) output. As part of this, whatever is on the top of the stack when the program completes (if it completes) will be printed to the registered output interface (e.g. terminal window).

### What makes it a meta language?

Coming soon

### Grammar / Syntax

## Okay, sounds cool, but why?

Mostly because why not. More accurately, I had just watched a Youtube video on the origins of esoteric programming languages and wanted to explore it in more depth. Designing my own programming language has been something that's intereted me since college and wasn't about to take my school's Compilers and Program Analaysis course due to scheduling issues. In between my previous job and starting work at Duolingo, I had some free time and decided that I would learn how to write an interpreter and design a language using Duolingo as my inspiration. (Also, I needed a fun fact about myself to share on my first day, and like what isn't fun about this haha).

## Gotcha. But what can I do with it?

I haven't fully thought through everything so I hesitate to make a claim on its turing-completeness. That being said, it does support arbitrary jump/goto statements and the stack also supports switching the first and second items on the stack, which I tentatively think is equivalent to a proper stack with an infinite tape (which would be turing-complete). Thus, theoretically, it is a powerful language. That being said, it has no core modules/standard library for interacting with anything other than simple non-file-based I/O. Additionally, programs are rather verbose (and difficult to read/understand).

## 

## Philosophy

Any reached Duolingo tree can execute (no undefined behavior), just maybe not meaningful

Legendary makes coding programs easier, but anything can be written without it

Hello world should be achievable in the Spanish from English tree

Duolang is a meta language, and programs are different based on the underlying language (language pair tree)

## Grammar

* **Row of size 1**
* 1 - Boolean
* 2 - 8-bit integer
* 3 - 8-bit decimal
* 4 - String (Ascii)
* 5 - Continue / Stop and Push CV / End jump label
* 6 - UTF-8
* **Row of size 2**
* 11 - Pop Stack
* 12 - Pop and Save
* 13 - Switch first and second on stack
* 14 - Duplicate current top of stack
* 15 - Push CV to stack
* 21 - Concat/addition
* 22 - Subtraction
* 23 - Multiplication
* 24 - Division (integer)
* 25 - Floating point division (unimplemented)
* 31 - Xor (bitwise)
* 32 - Nand (bitwise)
* 33 - Mark jump label
* 34 - Jump to label on stack when current value is Undefined/0/* False/'' and pop stack, otherwise continue (Do not jump when * stack is empty nor label is not found)
* 35 - Jump to label on stack when current value is !0/True/!'' * and pop stack, otherwise continue (Do not jump when stack is * empty nor when label is not found)
* 41 - Reserved / noop
* 42 - Read from input (as integer)
* 43 - Read from input (as decimal)
* 44 - Read from input (as string)
* 45 - Print current value or top of stack
* 46 - Read from input (as utf-8 string)
* 5* - Ignore the start and do the 1-row action
* **Row of size 3**
* No special semantics: either used for continuing data initialization or noop
