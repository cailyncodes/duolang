# Duolang

Duolang is an esoteric meta programming language. You use the Duolingo app as your code editor and the progress in a course is the source code.

## How does it work?

At its core, Duolang is a stack-based, single-cell tape, interpreted language, largely adopting JS-semantics (when applicable).

### Philosophy

The goal with designing this language around Duolingo was to make it such that anyone's progress in a course would successfully execute (perhaps infinitely, but no runtime errors). Thus, one of the core principles is that when encountering values that would be otherwise undefined and normally cause runtime issues, the language itself will use trivial defaults (e.g. 0, '', etc). I also wanted invocations of an arbitrary program to have a high likelihood of at least some (perhaps meaningless) output. As part of this, whatever is on the top of the stack when the program completes (if it completes) will be printed to the registered output interface (e.g. terminal window).

Additionally, since completing Legendary skills requires gems (formerly Lingots) (or a plus plan), I wanted to make it such that Legendary was not a core part of the semantics of the language but could provide syntactic sugar/simplifications to the writing of programs.

Fun (and mathematically [or computationally] interesting) things happen at the limit(s of infinity). However, in our world of finite-ness, our capacity for fun/interesting is limited. In recognizing this, I wanted to make sure that at least simple programs were expressable in the length of standard Duolingo courses. In other words, I wanted to make sure at least "Hello world" was able to be written in a Spanish from English course.

Lastly, I wanted any course (not just a specific one) (and indeed not just any specific rendering of a user's tree for a given course) to be able to encode a program. Thus, (and while other solutions might exist), I decided to make it a meta programming language.

### What makes it a meta language, exactly?

Duolang programs are different based on the underlying tree used. Let's dig into that a bit.

Every Duolingo course includes a tree, which is an ordered collection of skills in which each row contains one to three skills. Each skill has a level associated with it: from zero to 6 (i.e. 5 + a legendary state). Users cannot start a new row until all skills in the previous row have at least a level of one. With this in mind, I decided to make 0 denote a program end token, which left five potential states for each skill. 

A total of five tokens doesn't leave a lot of room for potential logic. It probably is enough for the most simple tape-based language that simulates a Turing machine but that would make programs verbose (moreso than they ended up being) and isn't interesting since Turing machines emulators already exist.

Instead, I decided to leverage the fact that within a row there may be one to three skills. This enables up to 155 (5 + 5^2 + 5^3) different tokens. However, the frequency of rows of three skills was very uncommon for my trees, so I decided to exclude any core (and eventually any whatsoever) tokens of length three. This gave me 30 potential tokens, more than enough for a meaningful stack-based language grammar.

However, this means that the tree structure itself influences the actual execution logic. Each course has a different tree structure, and further, each user in a given course might have a different tree depending on when they started the course and if they are in any experiments. All of this makes Duolang a meta programming language such that it defined a family of programming languages based on given Duolingo trees.

(Any inaccuracies on how Duolingo courses work are exclusively my own and the understanding that I do have is thanks to [Jenna Tishler](https://github.com/jtishler) who graciously let me bug her with a series of questions when I was formulating the Duolang idea and its feasability).

## And how do I know what the program is supposed to do before running it?

See the end of this README for a detailed list of the grammar. Nonetheless, like reading any program, but especially true for stack-based languages, it will take time to actually understand what the specific actions of the program cause the execution to do.

When running programs in the web UI, all code is run in the browser's JS engine, so it shouldn't do any damange to your machine to the extent that the JS engine is sandboxed.

### But like how do I actually write programs?

Well the official code editor is [Duolingo](https://www.duolingo.com/) (either the web app or mobile apps). However, I recognize writing programs by completing Duolingo lessons is not the most efficient (But I might have a contractual obligation to get people to spend more time on the app, so you can just stop reading here), so I created [https://duolang-web.vercel.app/](https://duolang-web.vercel.app/) on online editor and interpreter for more easily writing and executing programs. After you log in to import your courses and progress, you will be shown a screen with a Duolingo course tree on the left and a emulation of a program terminal on the right with two textarea inputs above that. You can cycle through skill progress by clicking on the skill circles. You can also bulk edit more easily be changing the text encoding in the textareas. To run your updated program (or re-run the current program), click the green "Run" button on the lower right-hand side. You may be prompted to input data with the browser's native prompt window and/or continue whether to continue execution when it looks like you have an infinite loop.

## Okay, sounds cool (kinda), but why?

Mostly because why not. More accurately, I had just watched a Youtube video on the origins of esoteric programming languages and wanted to explore it in more depth. Designing my own programming language has been something that's intereted me since college and wasn't able to take my school's Compilers and Program Analaysis course due to scheduling issues. In between my previous job and starting work at Duolingo, I had some free time and decided that I would learn how to write an interpreter and design a language using Duolingo as my inspiration. (Also, I needed a fun fact about myself to share on my first day, and like what isn't fun about this haha).

## Gotcha. But what can I do with it?

I haven't fully thought through everything so I hesitate to make a claim on its Turing-completeness. That being said, it does support arbitrary jump/goto statements and the stack also supports switching the first and second items on the stack, which I tentatively think is equivalent to a proper stack with an infinite tape (which would be Turing-complete). Thus, theoretically, it is a powerful language. Notwithstanding, it has no core modules/standard library for interacting with anything other than simple non-file-based I/O. Additionally, programs are rather verbose (and difficult to read/understand). Think of it as a worse version of assembly.

## So I shouldn't expect Duolang to take over the development community?

No.

The one "practical" (insofar as one defines practical as usable/useful towards a particular end goal) application I can see for Duolang is in the realm of Code Golf ([https://code.golf/](https://code.golf/), [https://codegolf.stackexchange.com/](https://codegolf.stackexchange.com/)). And even then, it's not that Duolang programs would be short but rather they are golf-able and depending on the given tree used for writing the program may in fact be an exceptionally difficult problem to write it in a "short" way. All in all, it's as useful to programming as Sudoku is to mathematics.

## I'm sold on at least the memetic or aesthetic value and want to help grow it!

Personally, I think that's a mistake and not the best use of time, although I won't stop you (also since I spent like a week of my life on this already).

Areas for future improvement I see are:
* Implementing the floating point stuff I couldn't be bothered to try to meaningfully solve
* Add more lexems by utilizing the cracked golden skills as a different semantic than uncracked golden skills.
* Add Legendary syntatic sugar
* Support bonus skills in determining the program code (currently they are skipped since I forgot about their existence)
* Improve the Duolang Web UI
* Make the Duolang Web UI mobile friendly

You are welcome to make a PR to this repo, but I make no warranty towards the speed I will review it (and or even if I will review it at all).

## Detailed Grammar

* **Row of size 1**
* 1 - Boolean
* 2 - 8-bit integer
* 3 - 8-bit decimal
* 4 - String (Ascii)
* 5 - Continue / Stop data input and push current tape value / Denote end of jump label
* 6 - UTF-8
* **Row of size 2**
* 11 - Pop Stack
* 12 - Pop and save to current value
* 13 - Switch first and second values on stack
* 14 - Duplicate current top of stack
* 15 - Push current value to stack
* 21 - Concatenation or addition (type depending)
* 22 - Subtraction
* 23 - Multiplication
* 24 - Division (integer)
* 25 - Floating point division (currently unimplemented, a noop)
* 31 - Xor (bitwise)
* 32 - Nand (bitwise)
* 33 - Mark jump label
* 34 - Jump to label on stack when current value is Undefined/0/* False/'' and pop stack, otherwise continue (Do not jump when * stack is empty nor label is not found)
* 35 - Jump to label on stack when current value is NOT 0/True/!'' * and pop stack, otherwise continue (Do not jump when stack is * empty nor when label is not found)
* 41 - Reserved / noop
* 42 - Read from input (as integer)
* 43 - Read from input (as decimal)
* 44 - Read from input (as string)
* 45 - Print current value or top of stack
* 5* - Ignore the start (i.e. 5) and do the 1-row action
* 6* - Reserved / noop
* **Row of size 3**
* No special semantics: either used for continuing data initialization or noop
