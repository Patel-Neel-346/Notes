WEBVTT

00:00.050 --> 00:04.130
So we talked about why do we need an operating system.

00:04.370 --> 00:15.950
And I tried to plant the idea that you don't really need an operating system, but it is very useful

00:15.950 --> 00:20.090
for convenience because of the things we talked about.

00:20.090 --> 00:28.970
So that creates certain, you know, level of appreciation to the operating system because of the work

00:28.970 --> 00:30.170
that is doing.

00:30.170 --> 00:37.250
That doesn't mean that you, you know, lock yourself in to.

00:37.720 --> 00:40.480
You have to absolutely use an operating system.

00:40.480 --> 00:49.510
Have that in the back of your mind that you can absolutely write an application that directly is communicating

00:49.510 --> 00:50.800
with with hardware.

00:50.800 --> 00:54.010
It is just very, very difficult.

00:54.040 --> 01:02.410
But it can give you a lot of benefits, especially if you want low latency, you know, high efficiency

01:03.430 --> 01:04.180
software.

01:05.200 --> 01:12.430
But that being said, we need to talk about the unit of execution in operating systems.

01:12.430 --> 01:15.370
And that's this section, the anatomy of the process.

01:15.370 --> 01:23.350
So the processes are so critical in the kernel, to be specific, that I actually split it into two

01:23.350 --> 01:23.920
halves.

01:24.310 --> 01:27.340
The this section, which is the anatomy of the process.

01:27.340 --> 01:36.220
We'll talk about what is in a process, you know, uh, categorically, uh, in a standard manner.

01:36.220 --> 01:40.900
Operating systems often break the process into sections.

01:40.900 --> 01:47.800
And these sections you don't really have a system, have to have these sections, but most of them do.

01:47.800 --> 01:48.130
Right.

01:48.850 --> 01:50.710
So we're going to talk about these sections.

01:50.710 --> 01:51.820
And where do they live.

01:51.820 --> 01:53.260
Of course they live in memory.

01:53.260 --> 01:53.560
Right.

01:53.560 --> 02:03.730
But knowing each section and its properties, it lets you understand when code executes versus if you

02:03.730 --> 02:11.470
store a variable versus if you store an array versus how you really execute, not just functions, how

02:11.470 --> 02:12.340
functions run.

02:12.910 --> 02:16.630
And that is basically the anatomy of the process.

02:16.630 --> 02:19.480
Moreover, I'll talk also about.

02:20.330 --> 02:27.230
How the kernel actually execute instructions in each of these, uh, you know, scenarios.

02:27.740 --> 02:35.480
So for spoilers, uh, the process will have something called a stack, you know, and it will also

02:35.930 --> 02:37.280
have something called the heap.

02:37.280 --> 02:41.990
And it will also have the most important thing that will never work without it.

02:42.140 --> 02:49.520
Basically the the text area or the code section where the machine code that we talked about, the native

02:49.520 --> 02:54.740
machine code instructions for that CPU actually lives now.

02:55.070 --> 03:02.960
And then we're going to take examples of how, um, each process in each section actually behaves.

03:02.960 --> 03:05.660
So we'll write this like a small C program.

03:05.660 --> 03:08.270
I chose C because it's funny enough.

03:08.270 --> 03:11.300
It's actually the simplest one to actually illustrate.

03:11.300 --> 03:20.900
If I picked like NodeJS it will be so difficult because their node and Python is not directly executed

03:20.900 --> 03:23.270
on the CPU, it's interpreter.

03:23.450 --> 03:29.180
The actual native code of node is actually node dot x, right?

03:29.180 --> 03:31.250
Or or the node binary.

03:31.250 --> 03:33.170
That's machine code.

03:33.170 --> 03:39.980
That's the program that that you run that has its own code section and it has its own stack.

03:39.980 --> 03:46.310
And then it actually executes your JavaScript or your Python.

03:46.310 --> 03:46.820
Right.

03:47.180 --> 03:49.280
That's what's how it works basically.

03:49.790 --> 03:53.120
But so I pick I pick a very small C program.

03:53.120 --> 03:57.320
We compile it and then we say, all right, this is how it looks like.

03:57.320 --> 04:01.970
This program will only work with this particular stack.

04:02.210 --> 04:03.080
Very simple thing.

04:03.080 --> 04:04.790
Call a function, see what happens.

04:04.790 --> 04:05.360
You know.

04:05.840 --> 04:10.850
And then we'll look uh, in the practical session we'll look at the debugger.

04:11.090 --> 04:16.970
We'll introduce, uh, you know, the GNU debugger and look at that, all the registers and what happens?

04:16.970 --> 04:22.340
Believe me, this section will make you appreciate how things work because it was like, oh my God,

04:22.340 --> 04:27.380
I had no idea that all of this happening for just one single line of code.

04:27.380 --> 04:28.250
So.

04:28.250 --> 04:32.000
So forget about if you have like JavaScript code or Python.

04:32.000 --> 04:34.910
Much, much more stuff happens there, you know?

04:34.910 --> 04:40.040
And that's why naturally people say, uh, Python is slower than C.

04:40.070 --> 04:40.490
No.

04:42.100 --> 04:43.780
And of course, uh, it depends.

04:43.780 --> 04:44.500
Like what?

04:44.500 --> 04:45.400
Coding.

04:45.400 --> 04:47.470
What what what are you doing?

04:47.470 --> 04:47.920
Right.

04:48.190 --> 04:56.800
I mean, if in a, in a, in a looking at a high level, you know, if you're not really building like,

04:56.800 --> 05:03.670
performant applications, you're gonna miss out on, you know, a few milliseconds here and there,

05:03.670 --> 05:05.380
a few hundred milliseconds.

05:05.380 --> 05:10.840
But if you really care about every single, if you're if you're optimizing on the microseconds, then

05:10.840 --> 05:13.300
language switches actually happen.

05:13.300 --> 05:17.680
And that's what we're going to talk about languages and want to switch languages.

05:17.680 --> 05:19.330
And that's also another thing right.

05:19.330 --> 05:24.820
Like one example I know it's like this is this is not in exactly a topic, but it's kind of related.

05:24.820 --> 05:33.160
And uh, one reason, uh, uh, linker D the company which built proxy, they switched, they had to

05:33.160 --> 05:41.590
switch from Java to Rust because they had a didn't they actually hit an actual dead end because the

05:41.590 --> 05:47.710
proxy, the job of the proxy is to take a request, read it from the front end and then write it to

05:47.710 --> 05:49.870
a back end, that's the job of the proxy.

05:49.870 --> 05:54.610
And then do some rules, you know, so any delay adds up.

05:54.610 --> 06:01.060
You don't want those delays and Java being uh, first and interpreted language.

06:01.060 --> 06:02.710
Well, it's a runtime.

06:02.710 --> 06:03.670
It has a runtime.

06:03.670 --> 06:03.940
Right.

06:03.940 --> 06:06.850
So there is this overhead okay.

06:07.480 --> 06:08.680
What is this Java machine.

06:08.680 --> 06:13.360
Then there is the overhead of the garbage collection, which adds up and adds up, you know, so they

06:13.360 --> 06:17.620
move to rust which is native machine language.

06:17.620 --> 06:22.330
When you compile it you get a native machine code and there's no garbage collection.

06:22.330 --> 06:22.690
Right.

06:22.690 --> 06:28.510
So I told this story just to let you know that there are so much of the stuff happening, and just because

06:28.510 --> 06:30.850
we don't see it doesn't mean it doesn't exist.

06:30.850 --> 06:31.240
Right.

06:31.240 --> 06:39.940
And this section hopefully kind of shed some light into what exactly happening when we execute a process,

06:39.940 --> 06:43.240
when we run a process, let's jump into this section.




=================

secound video

WEBVTT

00:00.050 --> 00:05.360
Okay, let's start with the first lecture of this section.

00:05.540 --> 00:08.120
The program versus the process.

00:08.120 --> 00:15.650
You know, we sometimes interchange these, uh, two words and concepts, but they mean different things.

00:15.650 --> 00:22.760
When we often say a program, we mean the actual executable file on disk, you know, uh, which has

00:22.760 --> 00:28.220
specific format that tells the kernel that, hey, here's my code.

00:28.220 --> 00:30.290
Here is my some of my data.

00:30.290 --> 00:35.900
Here's, um, where, where, uh, my global variables are and here are some pointers.

00:35.900 --> 00:37.670
And then there's format.

00:37.940 --> 00:44.210
Otherwise if you don't know where things are, you don't really you cannot really run the program,

00:44.480 --> 00:44.930
you know.

00:44.930 --> 00:46.160
So you need that.

00:46.160 --> 00:51.380
And then there's the process, which is, uh, literally a program in motion.

00:51.380 --> 00:56.390
You know, you spin up a process from scratch and you get.

00:57.200 --> 01:00.980
Its own, as I said, like personality, if you will.

01:01.010 --> 01:07.640
You know, process will start and it will will start executing instructions immediately.

01:07.640 --> 01:10.250
And it depends on the nature of the program.

01:10.520 --> 01:17.360
Uh, the the processes may completely diverge in different locations, in different areas, you know,

01:17.540 --> 01:20.150
based on the input it receives.

01:20.180 --> 01:27.920
It might it might start jumping and execute different instructions, you know, and they will have different

01:27.920 --> 01:28.700
states.

01:28.700 --> 01:32.240
They will have different completely different variables and values.

01:32.740 --> 01:43.390
You know, so that those will actually have these values stored in memory, you know, and a process

01:43.390 --> 01:46.030
will also have a pointer that's very critical.

01:46.030 --> 01:48.100
We're going to talk about it's called the program counter.

01:48.100 --> 01:52.270
Where am I right now executing code now.

01:52.270 --> 01:54.700
So in summary a program.

01:55.430 --> 01:57.230
A process is a program in motion.

01:57.230 --> 01:59.060
So let's see how this actually works.

02:00.240 --> 02:09.690
So as I talked about this a little bit, you know, a program, uh, is nothing but a compiled and linked

02:09.840 --> 02:13.500
code for a particular CPU.

02:14.190 --> 02:27.780
No compiling is the process of translating a language like C or Java or Rust, or go into native machine

02:27.780 --> 02:30.840
code for the CPU.

02:30.870 --> 02:39.930
You know then that by itself compiling just give you basic binaries, you know, because you see in

02:39.930 --> 02:43.590
your code, you know, when you write code, you have libraries, right?

02:43.590 --> 02:45.600
You often not have like one single file.

02:45.600 --> 02:46.920
You have many files.

02:46.920 --> 02:51.600
You're using the standard library to, I don't know, like printf.

02:51.600 --> 02:57.870
Doing printf you might use some system calls like read, which there is like a standard library for

02:57.870 --> 02:58.200
that.

02:58.200 --> 03:03.270
And see of course you don't have to use those libraries, but most people do.

03:03.270 --> 03:07.710
And as a result you'll end up with this library TLS, you're you're doing encryption.

03:07.710 --> 03:08.910
Here's the TLS library.

03:08.910 --> 03:12.630
Here's the here's the, you know, curl.

03:13.200 --> 03:13.950
What is it called?

03:13.950 --> 03:18.000
Curl I o you know, the the I think it's called lib curl lib.

03:18.000 --> 03:26.010
The ability to make requests in all of these C library or any other libraries are their own compiled

03:26.010 --> 03:28.440
for this particular CPU.

03:28.440 --> 03:30.480
So you end up with many.

03:32.050 --> 03:33.670
Object files.

03:33.670 --> 03:34.750
Sometimes they call them.

03:34.750 --> 03:36.400
Yeah, compiled.

03:36.670 --> 03:42.400
But then you need all of these suckers to be a single file for it to actually execute.

03:42.400 --> 03:44.110
And that's the job of the linker.

03:44.470 --> 03:45.040
Right.

03:45.040 --> 03:50.860
And boy, I've seen so many, you know, you know, advancement in in linking.

03:50.860 --> 03:55.270
Because if you think about linking is actually a very fantastic problem to solve.

03:55.330 --> 03:55.990
Right.

03:55.990 --> 03:57.010
As you're.

03:58.010 --> 04:02.390
You have your input, you have to look up all these objects files.

04:02.390 --> 04:09.110
Looking up is not straightforward in in massive sets of trees, you know.

04:09.110 --> 04:14.060
So you have to look up and find all this thing and check the version of these libraries and see if they

04:14.060 --> 04:16.220
are you're supposed to link them or not.

04:16.220 --> 04:22.370
And then you bring every single thing into one big file and then.

04:22.520 --> 04:23.750
Bip bip bip bip bip bip bip.

04:23.900 --> 04:26.720
You throw all of them into a single file.

04:26.960 --> 04:28.640
Yeah, that's one way to do it.

04:28.700 --> 04:34.520
The other way is just to put, you know, hints like, hey, this is the object files right there,

04:34.520 --> 04:39.380
you know, and you link everything at compile time.

04:39.380 --> 04:45.140
So hey, here's one file and you get a beautiful execution like this one, right.

04:45.140 --> 04:45.860
Execute a file.

04:45.860 --> 04:48.320
So there's a program header file Alef header.

04:48.320 --> 04:51.650
This is a Elf is basically the Linux format right.

04:51.650 --> 04:56.150
The dot data, the text which is the code and then section.

04:56.150 --> 04:58.130
And then of course.

04:59.560 --> 05:04.570
Uh, there is the concept of dynamic linking, where, you know what, I don't want to link everything

05:04.570 --> 05:09.520
at runtime, which is it has benefit to link everything in a static time, just like bring everything

05:09.520 --> 05:10.210
into this file.

05:10.210 --> 05:12.400
So I don't really care about other files.

05:12.400 --> 05:14.500
It's going to become a huge file, right?

05:14.500 --> 05:23.530
The other approach is to do dynamic linking to get pointers, to put pointers with versions in the Elf

05:23.530 --> 05:29.320
file says, hey, uh, this program is using this version of this particular library.

05:29.320 --> 05:37.240
So you only have a lightweight executable, but if you run it, you might have seen that you put an

05:37.240 --> 05:41.380
exe file like this I used to do this back in the what?

05:42.370 --> 05:43.360
Late 90s.

05:43.360 --> 05:45.490
You know, I have one Excel file.

05:45.490 --> 05:47.650
I see it in my friend computer.

05:47.650 --> 05:51.610
I was like, oh, this used to, oh, this is like a screensaver or some game, right?

05:51.610 --> 05:57.070
I would copy only that X and I, I would throw it in in a floppy disk.

05:57.070 --> 05:59.140
We didn't have flash back then.

05:59.470 --> 06:01.150
Flash you know, thumb drives.

06:01.150 --> 06:03.940
So we'll throw in a floppy disk and then go into my machine.

06:03.940 --> 06:06.730
I put it there and I run the program and I get an error.

06:06.730 --> 06:07.660
It's like, what?

06:07.990 --> 06:09.400
Why is it failing?

06:09.400 --> 06:11.230
And my machine I want that game.

06:11.230 --> 06:13.840
I'm I made sure that x I copied it.

06:13.840 --> 06:18.490
First of all I of course I was very young.

06:18.490 --> 06:24.310
I used to copy the shortcut instead of the actual program that that's dumb right?

06:24.310 --> 06:26.650
So the short of copying the shortcut will do not do.

06:26.890 --> 06:27.730
It will give you anything.

06:27.730 --> 06:28.150
Of course.

06:28.150 --> 06:28.660
Right.

06:28.750 --> 06:31.570
Then I actually figured out that, oh, this is not the actual program.

06:31.570 --> 06:32.500
There is a pointer.

06:32.500 --> 06:34.600
The actual X is somewhere there.

06:34.600 --> 06:42.790
So I will, uh, look for it and then get that executable and then put it in a, in a disk like uh,

06:42.790 --> 06:48.250
on, uh, on, on the floppy disk and then go on my machine, run it and it still fails.

06:48.250 --> 06:50.290
And this time it fails with a different error.

06:50.410 --> 06:55.270
It's like, uh, dynamic link library not found because DLLs, right?

06:55.270 --> 07:00.460
Microsoft uses DLLs where to dynamically link things.

07:00.460 --> 07:08.920
You know, that's why a lot of programs back then, you know, were created uh, to, to compile, to

07:08.920 --> 07:11.920
bring all the DLLs and all the eggs into one file.

07:11.920 --> 07:13.180
And people love that.

07:13.180 --> 07:17.650
You know, people love to work with a single file that run the programs.

07:17.650 --> 07:18.670
Very convenient.

07:18.820 --> 07:20.950
Uh, my father in law actually loves this.

07:20.950 --> 07:23.560
He he took he took all his applications.

07:23.560 --> 07:25.270
As you know, I don't want all these DLLs.

07:25.270 --> 07:26.680
I don't want too many files.

07:26.680 --> 07:32.620
And he had, like, a program built as, like a actual linker, a static linker that will link all the

07:32.620 --> 07:35.080
DLLs into a single file and executable.

07:35.080 --> 07:42.130
So, so like his has all his programs, you know, I don't know, uh, Winamp and all that stuff will

07:42.130 --> 07:43.270
run into a single apps.

07:43.270 --> 07:46.210
I know some of you will have like, what are you talking about?

07:46.690 --> 07:47.710
Winamp.

07:47.710 --> 07:53.320
It's a player that used to, you know, run media classic and all that stuff.

07:53.320 --> 07:59.260
He likes to have everything in one file, but that's essentially the idea, you know, uh, of of linking

07:59.260 --> 08:00.040
and compiling.

08:00.040 --> 08:01.720
It's critical to understand both.

08:01.720 --> 08:02.020
Right.

08:02.020 --> 08:04.450
You have sometimes you need static linking.

08:04.450 --> 08:05.980
You get large files.

08:05.980 --> 08:13.240
That's why we have to do dynamic linking for smaller files and hope that when we bring this executable

08:13.240 --> 08:17.830
on the other machine, those libraries actually exist in the target machine.

08:17.830 --> 08:18.310
All right.

08:18.700 --> 08:23.590
So this is very very good introduction about executables and linkers and compilers I'm going to talk

08:23.590 --> 08:28.240
about that also in the final section actually of the of this course.

08:28.240 --> 08:30.760
But it uses executable file program.

08:30.760 --> 08:31.780
We talked about that.

08:31.810 --> 08:34.180
It only works on the CPU architecture.

08:34.180 --> 08:35.290
Very critical guys.

08:35.320 --> 08:37.030
Very critical to understand that.

08:37.090 --> 08:37.600
Right.

08:37.960 --> 08:45.670
Uh, because when you compile something for ARM, it won't work on Intel.

08:46.690 --> 08:50.800
You see, that is because you're going to produce a risk.

08:50.830 --> 08:52.000
Instructions.

08:52.000 --> 08:54.010
Reduced instruction sets.

08:54.610 --> 09:01.210
These simple, lightweight ones that Intel have no idea how to execute Intel CPUs.

09:01.210 --> 09:01.600
Right.

09:02.170 --> 09:06.670
So I really need to compile things for that particular architecture.

09:06.700 --> 09:08.860
That's why CPU architecture is own thing.

09:09.190 --> 09:12.040
You know, it's a beautiful thing.

09:12.040 --> 09:16.810
And I what I want you to, you know, don't feel overwhelmed, guys, because you don't have to learn

09:16.810 --> 09:18.040
any of this stuff.

09:18.070 --> 09:23.800
You know, feel yourself as a magnet, you know, let's expand this a little bit and talk about feel

09:23.800 --> 09:32.950
yourself as an actual magnet, you know, and then you will gravitate towards some know something.

09:32.950 --> 09:40.780
Some of you will, will will enjoy this, uh uh, talk about linkers and they will end up building their

09:40.780 --> 09:41.650
own linker.

09:41.650 --> 09:49.300
So, uh, I spent my, my mom, you know, a year or two researching all the linkers and they all suck,

09:49.660 --> 09:53.710
although there is a new linker called mold, which is apparently people moving to.

09:53.710 --> 09:54.520
They love it.

09:54.520 --> 09:54.910
So.

09:54.910 --> 09:55.240
Yeah.

09:56.340 --> 09:58.530
I actually can do it better.

09:58.680 --> 10:05.460
And I or none of the linkers that are available is for me because I want a specific thing.

10:05.520 --> 10:06.840
So we're going to build your own.

10:07.080 --> 10:07.350
Right.

10:08.040 --> 10:13.770
Or some some of you might gravitate towards CPU architectures like all these CPU architectures I don't

10:13.770 --> 10:17.340
know what is it saying talking about what is it mean about CPU architecture, you know.

10:17.790 --> 10:19.590
And people would dive into that.

10:19.590 --> 10:23.070
So you would you would find some topics interesting.

10:23.070 --> 10:24.330
Some topics are not.

10:24.630 --> 10:27.660
And then you would naturally gravitate towards.

10:27.660 --> 10:30.570
And it's okay if you don't understand one concept or another.

10:30.570 --> 10:34.260
I don't understand everything that is about operating system.

10:34.260 --> 10:41.550
I just find myself interested to kind of scratch the surface about this, this topics, you know, just

10:41.550 --> 10:42.810
like that's that's my interest.

10:42.810 --> 10:49.320
Just slowly sculpturing, you know, like a big stone and then you slowly sculpturing.

10:49.560 --> 10:53.070
So let's get back to actual course.

10:53.610 --> 10:57.780
So at rest it follows a specific executable file format.

10:57.780 --> 10:59.520
Executable file format.

10:59.520 --> 11:02.460
This is how it's supposed to look like.

11:02.460 --> 11:11.640
You know you compile it and the hope is whoever the linker or the executable, uh, you know, the program

11:11.640 --> 11:15.750
that runs stuff that's called the launcher, I believe.

11:16.610 --> 11:21.470
Yeah, because I'm not pretty sure if the Colonel actually is the one responsible for running.

11:21.470 --> 11:26.090
I'm pretty sure there is another entity that you you can build yourself as well.

11:26.090 --> 11:27.470
That's how colonels are.

11:27.650 --> 11:35.390
It's like they always rely on other pieces to actually do the thing, you know, so that that launcher

11:35.390 --> 11:41.840
will launch a program and it knows how to deal with executable format.

11:41.840 --> 11:46.610
It knows that, oh, the first few bytes is the header, you know, and I've been I've been told some

11:46.610 --> 11:54.410
people actually, you know, look at the, the executable and figure out where the code is based on

11:54.410 --> 12:01.760
that, you know, and they can, you know, do certain things with the code in the executable format

12:01.760 --> 12:02.990
that I'm not going to mention.

12:02.990 --> 12:07.280
You know what I'm talking about to actually make it do something else, you know.

12:07.670 --> 12:15.260
So and while I don't condone some of these stuff, it's actually interesting if you think about it,

12:15.260 --> 12:17.510
because people who did that does that.

12:17.510 --> 12:21.080
Actually they're very they know how things work.

12:21.170 --> 12:21.560
Know.

12:22.340 --> 12:24.620
And of course it lives on disk.

12:24.620 --> 12:26.060
Well, it doesn't have to be on disk.

12:26.060 --> 12:28.640
It can be on any, you know, media.

12:29.830 --> 12:31.960
Spoke about the process.

12:31.960 --> 12:36.670
So the process lives in memory and it's often.

12:37.600 --> 12:41.350
Uh, there is a minimum address associated with it and a maximum address.

12:41.350 --> 12:45.460
So here on in this section I'm going to only use physical addresses.

12:45.460 --> 12:49.030
I'm not going to talk about virtual memory at all for simplicity.

12:49.030 --> 12:56.320
But of course almost none no operating system now uses physical addresses.

12:56.320 --> 13:00.190
You know they all I think I take back back.

13:00.190 --> 13:05.380
I'm pretty sure some IoT devices don't use virtual memory for performance reasons, you know.

13:05.590 --> 13:12.610
But we essentially physical memory that is the memory itself is addressed directly.

13:12.610 --> 13:20.080
So address seven is actually hey address seven go give me this value from the actual Ram.

13:20.080 --> 13:21.970
There's something called address seven.

13:21.970 --> 13:23.860
Well I also take that back.

13:23.860 --> 13:26.470
There is no addresses in memory.

13:26.470 --> 13:27.910
There is this address.

13:27.910 --> 13:30.250
This physical address has bits in it.

13:30.250 --> 13:38.290
And you chop these bits up and it will say oh, the first fee is actually this group of banks.

13:38.290 --> 13:41.470
And the second one is this column in the row.

13:41.590 --> 13:43.540
And it's this row in the ram.

13:43.540 --> 13:45.610
And the third part is actual column.

13:45.610 --> 13:49.810
So because that's how Ram is, is divided just like disk.

13:49.810 --> 13:50.170
Right?

13:50.380 --> 13:58.720
I mean at least the old one where we have the, the head and the cylinder, we have the tracks which

13:58.720 --> 14:03.430
basically are the cylinders, you know, because we look at them this way.

14:03.430 --> 14:07.450
And then there is the actual track and there is a section.

14:07.450 --> 14:07.960
Right.

14:07.960 --> 14:10.990
And, and this complexity is not exposed.

14:10.990 --> 14:12.760
It used to be exposed in operating systems.

14:12.760 --> 14:14.020
It's gone now.

14:14.170 --> 14:14.650
Right.

14:14.650 --> 14:17.320
So or S learned their lesson.

14:17.320 --> 14:21.700
But uh, the Ram also has an address called a Dram address.

14:21.700 --> 14:27.430
And and this is encoded as a physical address which we basically reference.

14:27.430 --> 14:31.030
And even that is now virtualized to a virtual address.

14:31.030 --> 14:31.240
Right.

14:31.240 --> 14:34.660
But essentially you have a minimum, uh, minimum, maximum address.

14:34.660 --> 14:42.010
What I want you to understand is a process lives in this and often um, I also simplified here.

14:42.010 --> 14:44.800
There is part of this is reserved for the kernel.

14:44.800 --> 14:47.650
I try to make things simple to start with.

14:47.650 --> 14:50.230
And then I introduce complexity as we go.

14:50.230 --> 14:55.480
But essentially we have the stack that grows down and we have the heap that grows up.

14:55.480 --> 14:58.990
I'm sure you heard this many times and it's a little bit confusing.

14:58.990 --> 15:01.330
We'll, we'll, we'll illustrate that.

15:01.330 --> 15:03.220
And we have the data section and the static.

15:03.220 --> 15:10.120
And we have the actual code section where the actual code of the program, the machine code instruction

15:10.120 --> 15:14.950
get loaded here, because we can't do anything with stuff on disk that doesn't work.

15:15.670 --> 15:18.820
Now to execute something we need to fetch it into memory.

15:18.820 --> 15:21.760
And from the memory we put it directly into the CPU.

15:22.950 --> 15:24.420
Ought it to be executed?

15:24.600 --> 15:27.510
And the heap grows upwards.

15:27.510 --> 15:30.060
That goes downwards.

15:30.090 --> 15:30.510
Okay.

15:31.170 --> 15:35.850
So when a program is run, we get a beautiful process.

15:35.850 --> 15:37.890
It's an instance.

15:38.610 --> 15:42.360
So hey, go into the world and explore.

15:42.930 --> 15:43.740
Do your thing.

15:43.770 --> 15:45.120
Be you, be you.

15:45.120 --> 15:49.500
And the process will just look at itself and it will says, oh, this is an instruction.

15:49.500 --> 15:50.460
Let me execute.

15:50.460 --> 15:51.150
It didn't.

15:51.480 --> 15:58.530
And then this instruction mutate mutates itself says, oh, something has changed.

15:58.530 --> 16:03.690
A light bulb has one oh, a variable has been set or a memory allocated has happened.

16:03.810 --> 16:07.530
And as you execute this action, you will basically evolve.

16:07.530 --> 16:13.380
It's like a video game and you're an RPG character and you're just interacting.

16:14.680 --> 16:18.310
Based on a sets of execution instructions.

16:18.430 --> 16:25.450
Know now not to get philosophical all these instructions put by someone else?

16:25.450 --> 16:29.710
Or did you have the choice to execute these instructions are.

16:31.100 --> 16:36.380
The very deep question, but the process essentially looks at these processes instructions and and execute

16:36.380 --> 16:37.340
one by one, one by one.

16:37.340 --> 16:43.970
And then it things gets lit up, memory gets allocated, a functions get created, stack frames get

16:43.970 --> 16:44.390
created.

16:44.750 --> 16:48.050
And then of course no two processes will be identical.

16:49.340 --> 16:55.850
Well, except if the processes have no exposure to the outside world, they are completely isolated

16:55.850 --> 16:59.870
and they are given complete one sets of instruction.

17:00.350 --> 17:04.610
But if this instruction is like depending on an outside.

17:05.340 --> 17:10.800
Variable like time, for example, which changes, then you're going to get different results, right?

17:10.800 --> 17:14.130
If it's like let's say if it's 7:00, do this.

17:14.130 --> 17:16.080
If it's 8:00, do that right.

17:16.710 --> 17:18.900
There's an if statement, then you just branched out.

17:18.900 --> 17:25.170
And the moment there is a branch you will get different processes with different personalities.

17:26.500 --> 17:29.290
And processes, process levels and memory.

17:29.290 --> 17:30.100
We talked about that.

17:30.790 --> 17:37.210
Uniquely identified with an ID are very critical this one.

17:37.210 --> 17:41.110
So each process that you execute gets an An identifier.

17:41.110 --> 17:44.470
So that just it gets so much other stuff.

17:44.470 --> 17:47.680
There is a bunch of data structures over here.

17:49.320 --> 17:50.100
All right.

17:50.100 --> 17:51.030
Is it here?

17:52.250 --> 17:52.760
Yes.

17:52.760 --> 17:56.090
Over here there will be that will tell you that.

17:56.090 --> 17:59.660
Oh, this is the process ID this is the page table.

17:59.660 --> 18:03.800
This is the list of file descriptors that this process has.

18:04.070 --> 18:05.660
This is the statistics.

18:05.660 --> 18:07.160
This is how much CPU it used.

18:07.160 --> 18:08.990
This is how much memory are allocated.

18:09.440 --> 18:10.850
And the list goes on.

18:10.850 --> 18:15.290
And the ID is critical to uniquely identify what process did.

18:15.290 --> 18:16.340
What even.

18:16.340 --> 18:17.480
Do you see these IDs?

18:17.480 --> 18:24.950
These IDs belong I know this is a little bit early, but how do we, the kernel assign IDs?

18:24.950 --> 18:27.620
You know, it's just you can think of it monotonically.

18:27.620 --> 18:32.360
It's like, okay, oh, for a new process, you get seven, you process, you get eight, new process,

18:32.360 --> 18:33.110
you get nine.

18:33.110 --> 18:34.490
You can think of it this way.

18:34.490 --> 18:35.510
Oh you're dead.

18:35.900 --> 18:37.490
Oh eight is now available.

18:37.490 --> 18:39.890
You can assign it to something else or some kernels.

18:39.890 --> 18:47.720
Don't use old stuff again because this could cause problems like, uh, because if a process dies,

18:47.720 --> 18:51.440
you have to clean up its stuff, and that's expensive.

18:51.440 --> 18:56.120
So some kernels leave those stuff and clean it up later.

18:56.120 --> 19:02.480
So if you immediately assigned the process ID that is dead to some new process, it might have access

19:02.480 --> 19:05.720
to the old stuff that the old process has access.

19:05.720 --> 19:09.530
And it's it's a recipe for bugs.

19:09.770 --> 19:10.220
All right.

19:10.220 --> 19:11.030
Essentially.

19:11.750 --> 19:12.380
Right.

19:12.650 --> 19:15.680
That's what we have to deal with with programming guys and kernels.

19:15.680 --> 19:17.540
Nothing but a big program.

19:17.540 --> 19:25.040
And so then the list of processes IDs is defined by something called the name space.

19:25.430 --> 19:25.730
Okay.

19:25.730 --> 19:28.490
Because take this for example.

19:28.490 --> 19:33.680
What if I am in my own Docker container and I spin up processes.

19:34.100 --> 19:36.440
I'm not going to get unique IDs.

19:36.440 --> 19:38.120
I'm going to get my own views.

19:38.120 --> 19:44.540
There will be a process 700 and container one and process 700 in container two and process 700, container

19:44.540 --> 19:48.170
three and process 700 in the host, the.

19:48.200 --> 19:51.290
That's why because every container is the kernel.

19:51.290 --> 19:53.690
Just hey, you are in your own jail.

19:53.690 --> 19:55.940
That's the old name for container jail.

19:55.940 --> 19:56.630
And you.

19:56.630 --> 19:58.730
This is the list of IDs you get to get.

19:58.970 --> 20:03.350
Hey, you can assign this IDs only, and you're not supposed to see any other IDs.

20:03.350 --> 20:07.100
And there is another unique identifier that's the namespace.

20:07.100 --> 20:11.540
And I'm going to use the namespace to actually uniquely identify a process that's a little bit out of

20:11.540 --> 20:13.550
this topic, but it's kind of related.

20:13.550 --> 20:15.410
I want you to see what's coming.

20:15.410 --> 20:17.570
I want you to have some, you know.

20:18.450 --> 20:24.480
Some of this stuff, but it's a fascinating thanks this namespace for containerization.

20:25.020 --> 20:30.960
Containerization you need namespace and there's like a bunch of namespaces, like a file descriptor,

20:30.960 --> 20:35.100
namespaces or storage namespaces to be specific.

20:35.310 --> 20:35.730
Nick.

20:35.730 --> 20:37.200
Namespaces, right?

20:37.200 --> 20:40.500
You're not supposed to see any network except these.

20:40.560 --> 20:45.180
You're not supposed to do any storage, any partition, or any mounts except these.

20:47.290 --> 20:51.070
So let's talk about the most important thing.

20:51.850 --> 20:53.710
So there are two names for it.

20:54.650 --> 20:56.630
And you pick whatever you like.

20:57.740 --> 21:00.980
Uh, I like program counter.

21:00.980 --> 21:03.260
Some people like instruction pointer.

21:04.070 --> 21:12.050
Right and both are the same and essentially represent the current.

21:13.100 --> 21:14.600
Execution.

21:15.830 --> 21:18.920
The current instruction to be executed.

21:18.920 --> 21:21.800
Or actually, let's be more specific, the next.

21:23.230 --> 21:28.960
Uh, instruction to be executed because the current one is already being executed, you know, by the

21:28.960 --> 21:29.440
CPU.

21:29.440 --> 21:32.890
It's just like, hey, what's what's next is the program counter.

21:32.890 --> 21:39.460
So the program counter is nothing but a pointer to the physical, actually the virtual memory.

21:39.460 --> 21:47.980
But we're going to use physical for now to the virtual address of where that code exists, where instruction.

21:48.250 --> 21:49.960
So to increment you just okay.

21:49.960 --> 21:50.860
Next okay.

21:50.860 --> 21:51.730
Next okay.

21:51.730 --> 21:52.570
Next okay.

21:52.570 --> 21:53.020
Next.

21:53.020 --> 21:54.160
So boop boop boop.

21:54.160 --> 21:55.420
And you go to the next one.

21:55.630 --> 21:57.220
Same thing with instruction pointer.

21:57.220 --> 21:58.540
And this is live.

21:58.690 --> 22:04.810
So every process has in its metadata which we didn't talk about.

22:04.810 --> 22:08.050
There is like another metadata place where this stuff is stored.

22:08.050 --> 22:11.950
The ID the program counter is stored in memory.

22:12.700 --> 22:16.180
And every time this is a lie by the way.

22:16.180 --> 22:17.920
But I'm going to correct it in a minute.

22:18.070 --> 22:22.300
Every time you execute an instruction, this counter is incremented, you know.

22:23.580 --> 22:26.340
In memory that points to the next one.

22:26.340 --> 22:27.810
So the liars.

22:27.810 --> 22:30.780
It's very expensive to execute an instruction and update memory.

22:30.780 --> 22:33.120
It's like, oh, I just executed this instruction.

22:33.120 --> 22:35.100
It's now pointing to instruction handler.

22:35.130 --> 22:35.640
Okay.

22:35.640 --> 22:38.490
Update memory your your process.

22:38.490 --> 22:40.650
Hey you're actually pointing to 100 now.

22:40.830 --> 22:41.490
All right.

22:41.520 --> 22:42.300
Next okay.

22:42.300 --> 22:44.040
What am I pointing to down here.

22:44.040 --> 22:48.840
Oh 104 because then the instruction size is usually four bytes.

22:48.840 --> 22:50.700
So you increment by four.

22:50.700 --> 22:51.390
It's like all right.

22:51.390 --> 22:55.320
Oh I'm now pointing here 100 and 104.

22:55.800 --> 22:56.850
All right let's update the memory.

22:56.850 --> 22:57.690
That's very expensive.

22:57.690 --> 22:59.550
So we updated actually in register.

22:59.550 --> 23:06.270
And then once we switch out the context of the process to another process or.

23:07.790 --> 23:12.440
Uh, we bring in, we switch up the kernel mode.

23:12.440 --> 23:14.810
Because kernel instructions are different.

23:14.810 --> 23:17.420
We don't they don't point the same code at all.

23:17.840 --> 23:22.880
And so we switch out and we save the program counter for the process.

23:22.880 --> 23:24.440
Oh, process.

23:24.440 --> 23:27.350
By the way, last time we checked you were here.

23:27.680 --> 23:29.750
And I'm going to switch you out.

23:29.840 --> 23:30.650
It's like a save.

23:30.770 --> 23:32.090
We're going to save now.

23:32.090 --> 23:35.330
And now it's like a save point in games, right.

23:35.450 --> 23:36.350
Oh checkpoint.

23:36.440 --> 23:37.670
Save this stuff.

23:37.670 --> 23:40.040
Next time we're going to switch you back on.

23:40.040 --> 23:42.920
You remember remember you were here okay.

23:42.920 --> 23:43.910
And this instruction.

23:43.910 --> 23:47.000
So when you come back you know what instruction to pick up from.

23:47.000 --> 23:48.530
It's a beautiful design.

23:49.250 --> 23:53.090
And all this stuff is stored in something called process control block.

23:53.090 --> 23:54.290
I want you to memorize this.

23:54.290 --> 23:57.710
I don't like you to memorize anything, but this is something you need to know.

23:57.710 --> 23:59.360
Process control block.

23:59.750 --> 24:01.220
This is a block in memory.

24:01.220 --> 24:06.650
Lives in the kernel that tells you that this process id number seven.

24:06.740 --> 24:08.420
Here is the metadata about it.

24:08.420 --> 24:15.860
There is information about the the actual process tells you the file descriptors.

24:15.860 --> 24:19.760
It tells you the program counter tells you, hey, here's a bunch of other registers.

24:20.690 --> 24:22.280
So many other things.

24:22.280 --> 24:23.480
Where does it live?

24:23.870 --> 24:29.150
You know, where is the pointer, the start of the pointer, the page table, so much other information

24:29.150 --> 24:29.750
about this.

24:29.750 --> 24:32.060
And once you understand that this exists.

24:32.760 --> 24:36.930
You will start linking about.

24:36.930 --> 24:37.980
Oh.

24:38.880 --> 24:43.800
Updating the PCB is actually costly.

24:43.830 --> 24:49.530
Reading the PCB every time I say hey, go and read this information.

24:50.320 --> 24:50.740
You will get.

24:50.740 --> 24:52.150
You're gonna have to ask me.

24:52.150 --> 24:52.480
Hussein.

24:52.480 --> 24:54.100
Where do I read it from?

24:54.100 --> 24:55.660
You read it from the Cpcb.

24:55.690 --> 24:56.530
Where does it live?

24:56.530 --> 24:57.700
It lives in memory.

24:57.700 --> 25:00.790
And what do we do with memory?

25:01.000 --> 25:01.810
There is a cost.

25:01.810 --> 25:05.830
It's like, again, think of it like a front end calling a back end, an API.

25:05.830 --> 25:12.100
If you if you're in a CPU, calling a memory, that's an API call to you that's expensive, you know.

25:12.610 --> 25:16.060
Well, it's not as expensive, of course, but it adds up.

25:16.060 --> 25:21.610
We don't want to go to memory unless we absolutely have to, but every time, sometimes we have to pay

25:21.610 --> 25:22.360
the cost.

25:23.270 --> 25:28.970
And good developers try to be efficient with their chattiness.

25:29.210 --> 25:29.660
Okay.

25:30.380 --> 25:33.170
Very critical concept PCB process control block.

25:34.130 --> 25:34.760
All right.

25:34.760 --> 25:35.570
Let's continue.

25:35.600 --> 25:37.730
Program versus process.

25:37.730 --> 25:40.550
So we have this executable file.

25:41.060 --> 25:43.700
And I want to execute three programs here.

25:44.630 --> 25:49.910
Process process one Postgres two port PID two and PID three.

25:49.940 --> 25:58.520
This is a lie PID one will never be postgres Ram, but I just added it for simplicity because PID one

25:58.520 --> 26:05.480
is usually reserved for something that the initial process and this is the program counter this point

26:05.480 --> 26:05.990
here.

26:05.990 --> 26:09.410
This program counter points here, the program counter points here.

26:09.410 --> 26:11.690
That's a hexadecimal for that.

26:11.720 --> 26:12.020
Yeah.

26:12.650 --> 26:19.760
So that's an example where three different applications Postgres like think of these as like I don't

26:19.760 --> 26:23.000
know, the wall writers of Postgres.

26:23.000 --> 26:23.300
Right.

26:23.300 --> 26:28.130
Or the back end processes that executes your SQL queries.

26:28.130 --> 26:33.860
Each one will have its own worker and each one will have its own process ID.

26:34.040 --> 26:39.230
The reason is because Postgres use processes and not threads.

26:39.230 --> 26:40.760
That's one reason for it.

26:41.360 --> 26:44.180
And each of course program counter will be completely different.

26:44.360 --> 26:48.980
So here is an example of how Com producing machine code.

26:49.130 --> 26:53.810
So usually when we take a C program like this one right.

26:53.810 --> 26:56.960
We're pulling from the standard library.

26:57.140 --> 27:05.510
We have a function main assigning some variable adding them printing f which uses this function that

27:05.510 --> 27:07.220
is stored here.

27:07.220 --> 27:19.190
This function prints to the screen which is actually uh the the a specific standard output, you know,

27:19.190 --> 27:20.060
results.

27:20.060 --> 27:23.240
It will print something to the screen in this particular case.

27:23.240 --> 27:24.920
And then we're going to return.

27:24.920 --> 27:29.330
And then this code you can compile it to assembly.

27:29.930 --> 27:38.360
Now an assembly is the closest version to what is an abstract abstraction language that works on many

27:38.360 --> 27:47.000
CPUs, which is also not the case, but it's very close that you can move assembly code to another instructions,

27:47.750 --> 27:52.490
uh uh, to another machine code instructions by doing almost 1 to 1.

27:52.490 --> 27:59.690
So this, this instruction says, hey, move the value of one into R0 which is a register.

27:59.720 --> 28:00.080
Right.

28:00.080 --> 28:03.860
And then this one says okay, move three into R1.

28:03.860 --> 28:12.890
And then uh, this instruction says okay, add R0 and n1 and store it in R3.

28:13.070 --> 28:18.200
Another register in the CPU, because it's very fast to work with CPU registers.

28:18.200 --> 28:23.540
And if we didn't talk about registers, these are very tiny small.

28:24.840 --> 28:28.470
You know, lightning fast way of storing things in the CB.

28:28.470 --> 28:29.790
That's the closest way.

28:29.790 --> 28:32.400
You know, we talked about L3 and L2 and L1.

28:32.460 --> 28:34.110
L2 registers are the fastest thing.

28:34.110 --> 28:36.030
It doesn't get any faster than that.

28:36.030 --> 28:40.830
So so we almost do all our work in the scratchpad that's called registers.

28:41.190 --> 28:42.570
So we added the values.

28:42.570 --> 28:46.020
And then final one we use this structure called store.

28:46.020 --> 28:52.230
We're going to store this value into this address which essentially this C thing you might say why didn't

28:52.230 --> 28:54.570
we store one in and three in.

28:54.570 --> 28:55.290
And B.

28:55.290 --> 29:02.040
Well that's one optimization that the compiler does like hey, why do you even want A and B?

29:02.040 --> 29:04.860
You never used them technically here right?

29:04.950 --> 29:05.730
At all.

29:05.730 --> 29:11.460
If you like printed A and B, I would believe you, but you didn't do that right.

29:11.460 --> 29:13.500
So you just took one and three.

29:13.500 --> 29:14.880
You just added them.

29:14.880 --> 29:19.020
So I'm not going to waste memory.

29:19.020 --> 29:25.560
And, uh, you know, this particular thing stack space to store your a and B in memory.

29:25.560 --> 29:28.770
If I can hard code them in the register.

29:28.860 --> 29:35.400
And you're going to find thousands and thousands of these optimizations done by the compiler, you know,

29:35.520 --> 29:38.490
otherwise we'll be needing to store.

29:38.730 --> 29:42.000
So that's what compiler actually is is clever right.

29:42.000 --> 29:45.690
It will actually tries to avoid, you know, dumb mistakes like this.

29:45.690 --> 29:54.180
Like if we actually translated this code one by one, we would physically store, uh, one into the

29:54.180 --> 29:54.570
memory.

29:54.570 --> 29:56.760
So that's a write to the memory.

29:56.760 --> 29:59.310
Then three are write to memory slow.

29:59.310 --> 29:59.730
Right.

29:59.730 --> 30:05.460
Then this are write to memory versus hey, you never use this.

30:05.460 --> 30:09.180
So I'm not going to even bother storing those in memory.

30:09.180 --> 30:12.030
So that's uh, that's one of the things that can happen.

30:12.030 --> 30:18.000
Of course, this can have side effect and do have side effect because sometimes you expect things to

30:18.000 --> 30:19.200
be in memory.

30:19.290 --> 30:22.380
But the compiler had a bug and it didn't put it.

30:22.380 --> 30:26.820
And you saw some weird behavior as a result.

30:27.510 --> 30:32.850
So then the simple code is then converted into machine code.

30:32.850 --> 30:34.650
This step is actually can be skipped.

30:34.650 --> 30:43.140
You can directly go from code to a machine code, but you can produce assembly, uh, with with with

30:43.140 --> 30:45.870
a compiler, you know, you can compile into assembly.

30:45.870 --> 30:53.670
So now this code is looks like this in, in, uh, in the compiler and I of course I made it up, but

30:53.670 --> 31:00.000
machine code is nothing but a, you know, specific code that means move.

31:00.000 --> 31:02.010
This instruction means move.

31:02.010 --> 31:03.900
This instruction means add.

31:03.900 --> 31:05.970
You know, 46 means store.

31:05.970 --> 31:08.130
So that's what the CPU looks for.

31:08.130 --> 31:16.080
And the CPU, as we can see in the CPU section, uh, we're going to have um, uh, it's going to have

31:16.080 --> 31:18.030
steps like fetch and decode.

31:18.030 --> 31:24.690
Decode is understanding that this code actually means this stuff is going to do an add operation.

31:24.690 --> 31:27.030
So there is a decoding that needs to happen.

31:27.030 --> 31:27.360
Right.

31:27.360 --> 31:32.430
But adding uh, all the structures, most of the structures are 1 to 1 in this machine in assembly.

31:32.430 --> 31:34.950
Here is an example of an executable file.

31:34.950 --> 31:39.060
Of course I'm missing the headers and all that stuff.

31:39.060 --> 31:43.710
I'm showing you just the code, but there is other content that tells you.

31:43.710 --> 31:48.180
Oh by the way, here is where like like how do you this is the code.

31:48.180 --> 31:48.570
But.

31:49.510 --> 31:49.930
One.

31:49.930 --> 31:52.060
One example is how do you know?

31:52.060 --> 31:56.320
How does the launcher or the kernel know which instruction to start with?

31:57.650 --> 31:59.750
Ah, right.

31:59.930 --> 32:01.820
The initial instruction.

32:01.820 --> 32:04.430
Because the processors will execute the first instruction.

32:04.430 --> 32:05.000
How does it know?

32:05.000 --> 32:07.190
What's the first instruction to to have.

32:07.190 --> 32:08.270
It's not the zero.

32:08.270 --> 32:08.660
No.

32:08.660 --> 32:09.530
Absolutely not.

32:10.220 --> 32:10.520
Right.

32:10.520 --> 32:12.980
Which one should I start with here.

32:12.980 --> 32:14.660
Who tells you I have to start from zero?

32:14.660 --> 32:16.370
No, there's no thing that's called.

32:16.370 --> 32:18.440
Hey, you have to start from zero at all.

32:18.440 --> 32:25.100
So there is a specific, you know, header file as hey, instruction in this position is the first instruction.

32:25.100 --> 32:29.570
And usually this is yes the main function.

32:29.570 --> 32:30.890
That is correct.

32:30.890 --> 32:32.000
Good job.

32:33.200 --> 32:34.820
All right.

32:34.910 --> 32:38.090
Let's dive a little bit deeper.

32:38.090 --> 32:39.050
Deeper.

32:39.750 --> 32:45.510
So here's a process in the wild is how it looks like, you know.

32:46.690 --> 32:48.880
Uh, tried to draw this stuff.

32:48.880 --> 32:50.590
This is the CPU.

32:50.620 --> 32:53.890
A very bad drawing of the CPU.

32:53.890 --> 32:56.110
I tried my best here.

32:56.350 --> 32:58.510
Uh, this, uh, what do you call them?

32:59.370 --> 33:00.000
Hexa.

33:00.690 --> 33:01.500
Hexa.

33:01.530 --> 33:02.640
That's not even hexa.

33:03.060 --> 33:05.430
Hexa got this pink tag on.

33:05.430 --> 33:06.570
I don't know what it's called.

33:06.570 --> 33:08.040
I don't know what's this shape is.

33:08.040 --> 33:09.060
I know it in Arabic.

33:09.060 --> 33:10.710
I don't know what's in English.

33:11.070 --> 33:12.840
So this shape, this specific shape.

33:12.840 --> 33:13.290
Diamond.

33:13.290 --> 33:18.300
That's not a diamond okay r0 R1 these are registers okay.

33:18.300 --> 33:21.690
And these are the program counter which is the instruction register.

33:21.690 --> 33:24.330
And you have the process.

33:24.570 --> 33:26.610
This is the process in memory.

33:26.820 --> 33:27.600
You see this.

33:28.450 --> 33:30.820
That's a beautiful instruction, this process.

33:30.820 --> 33:32.230
And this is the stack.

33:32.650 --> 33:33.880
Hey, look at our variable.

33:33.910 --> 33:36.880
See, that's the one we saved, right?

33:37.360 --> 33:39.220
That's the only thing we stored.

33:39.220 --> 33:42.070
Only see, because we're smart.

33:42.100 --> 33:44.440
Well, the compiler is smart.

33:44.440 --> 33:45.130
We're dumb.

33:51.250 --> 33:51.610
All right.

33:51.610 --> 34:00.910
Heap people who wrote compilers are very, very smart because they look at the code and they find ways.

34:00.910 --> 34:06.700
So so people who write compilers, I think they make the best programmers, to be honest, you know,

34:07.390 --> 34:08.500
because if.

34:08.680 --> 34:14.740
But they also going to be the slowest to write anything because every single line of code is like,

34:14.740 --> 34:21.400
oh my God, I can't write it this way because that will that will basically initiate, you know, memory

34:21.400 --> 34:25.360
access or this will actually invalidate the cache line, the CPU.

34:25.360 --> 34:26.560
I can't write that.

34:26.680 --> 34:28.150
Oh, maybe I have to do it this way.

34:28.150 --> 34:29.440
Oh no, that won't work.

34:29.440 --> 34:30.790
That will be slow.

34:31.270 --> 34:32.800
Oh, they're going to be stuck.

34:32.800 --> 34:36.970
They won't write any code because every code they will write is going to be bad.

34:37.990 --> 34:41.500
Or maybe the final code they produce is going to be really efficient.

34:41.500 --> 34:46.840
You know, it's just, uh, I'm fascinated by all of this stuff, guys.

34:46.840 --> 34:52.840
I absolutely love, you know, of course I didn't write a compiler in my life at all.

34:52.840 --> 34:54.460
Even in university.

34:54.460 --> 34:55.480
They didn't teach us that.

34:55.480 --> 35:01.660
I know some of you might have taken a computer science, and I know some computer science.

35:01.660 --> 35:06.430
You know, especially the good universities actually teach you how to write a simple compiler which

35:06.430 --> 35:07.840
which shows you all this stuff.

35:07.840 --> 35:12.430
I'm not going to show you any of this stuff, of course, in this course, but I will just make you

35:12.430 --> 35:13.270
appreciate it.

35:13.270 --> 35:18.100
Essentially, an appreciation sometimes is better than actually doing it.

35:18.670 --> 35:21.100
Heap and the static area.

35:21.100 --> 35:21.490
Heap.

35:21.490 --> 35:23.830
We're not going to talk about heap in the next lecture.

35:24.490 --> 35:26.320
And then we have the text code.

35:26.320 --> 35:28.240
Is our text right.

35:28.240 --> 35:31.330
I'm showing here the actual machine code.

35:31.480 --> 35:39.520
And you can see that we're jumping by four bytes here because this itself has a length of four bytes.

35:39.520 --> 35:42.460
Every instruction has four bytes, which is what, 32?

35:42.460 --> 35:42.670
Uh.

35:43.910 --> 35:44.930
32 bit.

35:44.930 --> 35:45.380
Yeah.

35:45.410 --> 35:46.250
32 bit.

35:46.250 --> 35:50.720
And of course the some instructions might be long larger.

35:51.320 --> 35:55.760
I don't think so to be honest because that would be like that's another thing you have to watch out

35:55.760 --> 35:56.000
for.

35:56.000 --> 36:00.800
Like when you're building all this stuff, the instruction has a specific size and you have it stored

36:00.800 --> 36:01.760
in memory.

36:02.270 --> 36:05.060
Can you be efficient in installing instructions?

36:06.220 --> 36:06.940
No.

36:07.720 --> 36:10.150
And I'm just thinking of this for the first time, to be honest with you.

36:10.150 --> 36:14.860
Like, as I'm making this video, I'm thinking about that because if I imagine four bytes of instruction,

36:14.860 --> 36:16.540
that's a lot, right?

36:17.110 --> 36:18.850
But sometimes you cannot escape it.

36:18.850 --> 36:21.640
But yeah, that's so that's like a structure of what's happening here.

36:21.640 --> 36:23.680
We have one and three in this registers.

36:23.680 --> 36:27.040
We have four in this uh registers.

36:27.040 --> 36:32.140
But I might even tell you that even some CPUs will say, you know what?

36:32.140 --> 36:34.360
I stored one and three here.

36:35.050 --> 36:39.640
Uh, I might just, uh, use I'm not going to use three.

36:39.640 --> 36:42.670
I'm just going to store one and three and store it in our zero.

36:43.260 --> 36:45.990
Like it because I'm not going to waste another register.

36:45.990 --> 36:48.300
I'm going to use my the same register.

36:48.450 --> 36:50.880
Yeah, I'm going to leave this register for something else.

36:51.420 --> 36:51.930
Yeah.

36:53.990 --> 36:54.680
Okay, let's.

36:54.680 --> 36:56.120
How about you do a demo?

36:56.120 --> 36:57.320
We've been talking a lot.

36:57.320 --> 36:58.190
Right, guys?

36:58.190 --> 36:58.940
Let's do something.

36:58.940 --> 37:01.280
Let's actually show you something here.

37:01.280 --> 37:07.010
And I didn't really want you to have any requirements to start this course.

37:07.010 --> 37:08.870
I'm going to use my Raspberry Pi.

37:08.870 --> 37:11.840
Go and spin up any VM in Linux.

37:11.840 --> 37:13.970
Uh, I might do something on windows as well.

37:13.970 --> 37:21.080
I have a windows box over there, but, uh, working with Linux, I think being it, I have a mac as

37:21.080 --> 37:21.710
well.

37:22.130 --> 37:22.940
Um, oh.

37:23.240 --> 37:25.790
Which is, um, the one I'm recording all this stuff in.

37:25.790 --> 37:27.080
We'll we'll experiment.

37:27.080 --> 37:30.920
We'll do something with Mac, something with windows, something with Linux.

37:30.920 --> 37:32.450
We'll play with different things.

37:32.450 --> 37:33.980
But let's do that now.

37:33.980 --> 37:42.830
Raspberry Pi, the operating system that we're raspberry in, which is basically a Debian distro.

37:42.830 --> 37:49.850
Which, which is what, which is what ubuntu uses, which is also a distro on top of the Linux kernel.

37:49.850 --> 37:55.100
And all of this stuff is just, you know, it's just, you know, layers on top of layers.

37:55.100 --> 37:58.970
What we care about is actually the kernel kernel itself.

37:58.970 --> 37:59.420
No.

37:59.420 --> 38:01.550
So we're going to spin up a process in Linux.

38:01.550 --> 38:04.430
I'm going to make sure to show you the compiling process as well.

38:04.430 --> 38:07.670
And we're going to use the debugger to attach a process.

38:08.300 --> 38:13.250
And we're going to show the program counter of that process.

38:13.250 --> 38:13.490
Huh.

38:13.790 --> 38:15.830
We're going to show the rest of the registers as well.

38:15.830 --> 38:16.730
How about we do that.

38:16.730 --> 38:17.600
All right.

38:17.600 --> 38:20.210
So I have I'm here in my Raspberry Pi.

38:20.210 --> 38:23.150
And let me show you how to show the Linux kernel.

38:23.150 --> 38:24.110
By the way version.

38:24.110 --> 38:29.330
You do the Unix name because everything pretty much all this stuff is switched.

38:29.330 --> 38:31.670
Uh, you know, it came from Unix originally.

38:31.670 --> 38:34.970
If you do Unix or you get the kernel version.

38:34.970 --> 38:37.160
So this kernel is 5.10.

38:37.160 --> 38:38.330
That's the Linux kernel.

38:38.330 --> 38:41.750
I think if you say you name alone, it tells you this is Linux.

38:41.750 --> 38:46.190
And there's like other commands, it tells you like what is the exec file name.

38:47.000 --> 38:47.630
How do you do that.

38:47.630 --> 38:50.270
Like that help.

38:51.190 --> 38:52.240
Just do, man.

38:52.840 --> 38:54.040
Yeah, man.

38:54.070 --> 38:54.940
You name?

38:56.010 --> 38:56.580
Yes.

38:56.580 --> 39:02.310
So if you do dash a print, all information S is actually the kernel name.

39:02.310 --> 39:03.000
Sorry about that.

39:03.000 --> 39:07.920
So you name dash S is the kernel name which is Linux.

39:07.920 --> 39:16.140
Of course the kernel version is r dash a print everything please are pi kernel and I have no idea what's

39:16.140 --> 39:17.370
1403.

39:17.370 --> 39:19.290
When was it compiled?

39:21.030 --> 39:23.250
Uh, arm.

39:23.840 --> 39:24.620
See.

39:25.580 --> 39:28.640
It's based on ARM Gentoo Linux.

39:28.940 --> 39:31.640
So that's my CPU Armv7.

39:31.670 --> 39:32.510
All right.

39:32.540 --> 39:33.890
Because it's a Raspberry Pi.

39:34.220 --> 39:34.790
All right.

39:34.790 --> 39:36.770
So now that we did this stuff.

39:37.430 --> 39:39.650
Um, let's write a small program.

39:39.650 --> 39:41.780
You guys write in C.

39:42.890 --> 39:44.450
Uh, I'm going to call Test.c.

39:45.500 --> 39:54.740
Um, and then I'm going to just going to do include, uh, standard io.h.

39:55.290 --> 39:57.030
Integer main.

39:58.410 --> 39:59.790
Going to return zero.

39:59.790 --> 40:05.520
And I'm going to do just I'm going to declare a variable here integer a equal one, integer b equal

40:05.520 --> 40:06.330
two.

40:06.330 --> 40:11.550
And then I'm going to print uh, a equal.

40:11.550 --> 40:13.080
Uh let's just do.

40:14.360 --> 40:16.250
A plus.

40:17.360 --> 40:19.520
Be equal.

40:20.150 --> 40:20.570
Uh.

40:22.370 --> 40:22.730
Uh.

40:23.480 --> 40:24.560
So how you do it?

40:28.080 --> 40:29.430
Equal A plus B.

40:29.460 --> 40:30.030
No.

40:30.030 --> 40:31.890
So I'm just going to add those two.

40:31.890 --> 40:34.260
Then actually I'm going to store.

40:35.060 --> 40:36.920
Uh, because we use them.

40:36.920 --> 40:37.700
Let's do this.

40:37.700 --> 40:47.570
Integer c equal a plus b, then I, I'm going to do uh c here.

40:47.810 --> 40:51.860
Then maybe I'm going to just do c equals C plus one.

40:51.860 --> 40:53.960
You know doing some stuff here.

40:53.960 --> 40:54.440
You know.

40:54.860 --> 41:01.610
And let's start with compiling this program into assembly so I can show you.

41:01.610 --> 41:08.000
So GCC is one of the compilers that is ubiquitous and available for us.

41:08.090 --> 41:17.930
And we're going to do basically compiling this test C and we're going to use Dash S I think.

41:17.930 --> 41:26.720
So dash capital S I have to look that up because I couldn't remember test dot s which generates for

41:26.720 --> 41:30.380
us the assembly code.

41:30.740 --> 41:33.440
And I have to do dash.

41:33.440 --> 41:35.330
Oh this is the output file.

41:36.230 --> 41:39.620
So I want to compile to generate the assembly.

41:39.620 --> 41:41.660
By default you get machine code.

41:41.930 --> 41:46.880
If you compile this code program I want the output to be an assembly code.

41:47.330 --> 41:50.390
And we're getting an error because I.

41:50.540 --> 41:51.470
Oh look at that.

41:51.470 --> 41:55.130
Oh how useful it's actually telling you that you made a mistake.

41:56.770 --> 41:58.870
Yeah, it's actually not print.

41:58.870 --> 42:00.760
It's print f.

42:00.760 --> 42:01.120
All right.

42:01.390 --> 42:02.680
So do that.

42:02.680 --> 42:03.730
Boom.

42:03.730 --> 42:06.610
Now we do cat test dot c.

42:06.610 --> 42:08.500
That's my original code.

42:08.500 --> 42:15.760
Cat test S you can see that this is my.

42:17.650 --> 42:18.760
Assembly code.

42:19.360 --> 42:23.320
It's critical in sports that we talked about text section.

42:23.440 --> 42:24.430
You know.

42:26.780 --> 42:28.190
All of this stuff.

42:28.190 --> 42:31.280
That's the actual assembly code argument.

42:31.280 --> 42:36.590
This is the one, the main function, what we're going to do pushing some registers the link register.

42:36.590 --> 42:39.140
We're going to talk about that add.

42:40.540 --> 42:41.710
By the way you read them.

42:41.710 --> 42:45.430
I think you read this from, you know, below to top.

42:47.650 --> 42:50.440
It's a little different and I'm going to show that.

42:52.560 --> 42:57.570
Okay, that's a PC program counter.

42:58.110 --> 43:05.670
But these are essentially this is what happens, you know, uh, this is how we playing with the memory.

43:05.670 --> 43:07.110
We're going to talk about all that stuff.

43:07.110 --> 43:10.590
It's just it is really interesting to go through all of that.

43:10.590 --> 43:17.190
So you don't have to understand every single line, of course, but just appreciate how much stuff it's

43:17.190 --> 43:17.430
doing.

43:17.460 --> 43:20.970
See, this is, this is where we're moving the value two.

43:20.970 --> 43:21.780
Right.

43:21.960 --> 43:24.450
And eventually we're going to do an ad.

43:24.450 --> 43:26.730
And that's the ad that's happening.

43:26.880 --> 43:27.210
Right.

43:27.420 --> 43:28.380
Here's another ad.

43:28.380 --> 43:31.320
That's the adding of the two registers.

43:32.150 --> 43:32.690
All right.

43:32.690 --> 43:36.350
So now let's actually do a full compilation.

43:37.100 --> 43:43.070
Uh, to do a debug so we can show you step by step or the program counters how they, how they change

43:43.070 --> 43:44.150
the process itself.

43:44.150 --> 43:47.690
Because the process we didn't actually run anything yet.

43:47.690 --> 43:48.260
Right.

43:48.710 --> 43:50.150
We're just compiling.

43:50.150 --> 43:51.740
So let's actually run something here.

43:51.740 --> 43:57.920
We're going to compile it again test dot dash g to enable debugging.

43:57.920 --> 44:01.910
So it creates all the symbols and allow us to step in and do all that stuff.

44:03.110 --> 44:07.100
And the output I want the output to be test dot.

44:08.280 --> 44:10.890
Literally just test because it's an executable, right?

44:11.580 --> 44:13.560
You can call it anything you want, just the bin.

44:13.560 --> 44:16.410
But usually there are no extensions, right?

44:16.710 --> 44:17.520
When it comes to that.

44:17.520 --> 44:22.020
Now if I do cat test, of course you're not going to understand any of this stuff.

44:22.020 --> 44:23.760
It's all binary, right?

44:23.760 --> 44:28.140
That's basically the elf, you know.

44:30.010 --> 44:31.720
We talked about that a little bit.

44:32.080 --> 44:38.710
Elf is this is the Linux portable format on the on disk, right.

44:38.770 --> 44:42.310
And we have of course all the links to the linker did.

44:42.310 --> 44:44.470
So hey this is the link.

44:44.470 --> 44:46.000
Go find this library.

44:46.000 --> 44:50.290
Go find this library, go find this library and all the other stuff.

44:50.290 --> 44:51.370
Very interesting.

44:51.370 --> 44:58.690
So of course to run you do the test and then just like that you got you have a plus B equals three.

44:58.690 --> 45:01.810
I run this program and it immediately terminates.

45:01.810 --> 45:05.470
You know, you cannot even see it in top because it's done.

45:05.470 --> 45:06.220
It's closed.

45:06.220 --> 45:06.790
Right.

45:07.420 --> 45:10.540
Top is something we're going to talk about this list all the processes.

45:10.540 --> 45:20.110
It's it's a utility in the OS that reads all the processes and prints out this pretty UI.

45:20.680 --> 45:22.480
So this is not done by the kernel.

45:22.480 --> 45:22.900
Right.

45:22.900 --> 45:29.320
It's it's someone who decided, ah, it's very tedious to list all the processes, you know, from the

45:29.320 --> 45:30.580
proc folder.

45:30.910 --> 45:32.440
So let me build a nice UI.

45:32.440 --> 45:36.130
So they built this and now even this is considered tedious right.

45:36.130 --> 45:38.740
So people build stop.

45:38.950 --> 45:40.330
Hey I have it installed here.

45:40.330 --> 45:44.290
That about that I didn't know I have it installed, so it's even prettier right?

45:44.470 --> 45:46.570
Htop is like, ah, I'm going to show you the progress.

45:46.570 --> 45:53.650
I'm going to read every five seconds, um, from the kernel and then display all this beautiful stuff.

45:53.650 --> 45:57.100
So, so, so all of this stuff so interesting.

45:57.100 --> 45:57.700
Quit.

45:57.910 --> 45:58.750
So.

45:59.610 --> 46:02.400
That's why basically the difference between operating system and a kernel.

46:02.400 --> 46:02.700
Right?

46:02.700 --> 46:06.420
I gotta remember how do how do we start the program?

46:06.420 --> 46:12.240
And instead of actually I want to start and pose it, I want to I want to tell you, hey, please start

46:12.240 --> 46:16.320
from as a debugger, like attach something to a debugger to to debug.

46:16.320 --> 46:19.890
You do gdb and then immediately test I think.

46:20.930 --> 46:23.930
And that starts up the program.

46:23.930 --> 46:28.610
Read the symbols, which is very critical to tell you, okay, this function exists here.

46:28.610 --> 46:31.400
This function exists here right now.

46:31.520 --> 46:35.540
I think if you do info registers.

46:36.410 --> 46:39.980
You say the program has no registers now because it's not rich?

46:40.070 --> 46:40.490
It's not.

46:40.490 --> 46:41.900
It's not a process.

46:41.900 --> 46:47.390
Yet we didn't technically run it, but this command is actually displays the current registers.

46:47.540 --> 46:48.830
Isn't that fascinating.

46:48.830 --> 46:51.050
So I think you call start.

46:52.810 --> 46:58.000
And just like the start, we'll start the program and stop in the first breakpoint by default, which

46:58.000 --> 46:59.680
is int a equal one.

46:59.680 --> 47:00.070
Right.

47:00.760 --> 47:03.130
So, uh.

47:04.970 --> 47:10.310
And the funny part even tells you the address, which is so fascinating.

47:10.310 --> 47:16.190
And then the symbols you see, you see, you keep telling you keep me saying like, oh, symbols.

47:16.190 --> 47:16.970
What does that mean?

47:16.970 --> 47:19.280
Well, we know our instructions, right?

47:19.280 --> 47:27.320
We talked about instructions which are just literally something that has the actual machine code instruction.

47:27.320 --> 47:29.900
This is where the machine code instruction lives.

47:29.900 --> 47:38.480
But to you in in in in code that has no meaning at all because we lost the knowledge of the mapping

47:38.480 --> 47:44.300
between your C code or your JavaScript code to the low level machine code.

47:44.300 --> 47:45.320
We talked about this, right.

47:45.320 --> 47:51.830
You have massive or a little bit of small code, but generally it's like, I don't know, 100 instructions.

47:51.830 --> 47:52.970
How do you know that?

47:52.970 --> 47:54.470
Oh, I'm instruction seven.

47:54.470 --> 47:57.020
How do you know that this actually is printf.

47:57.230 --> 47:59.660
The symbol does this mapping for you.

47:59.660 --> 48:00.200
Okay.

48:00.590 --> 48:07.760
So now there is actually a symbol that says oh this instruction is actually file test dot c.

48:07.790 --> 48:12.410
Line four in the C code will actually generate all the symbols.

48:12.410 --> 48:16.070
That's why symbols the debugging symbols are, are fat.

48:16.640 --> 48:18.170
There's so much stuff in them.

48:18.410 --> 48:19.610
It's actually mapping.

48:19.610 --> 48:23.870
You know not really a rocket science info registers.

48:23.870 --> 48:25.550
Show me what do we have.

48:25.550 --> 48:26.300
Look at that.

48:26.300 --> 48:30.890
We have our zero with the value of one because we already run.

48:30.890 --> 48:32.600
Did we run a equal one?

48:32.600 --> 48:33.440
I think we did.

48:34.580 --> 48:36.830
Because otherwise how do we have a value of one here?

48:37.610 --> 48:39.590
Okay, now let's do n.

48:39.590 --> 48:40.940
What's the program counter.

48:40.940 --> 48:44.420
That's my very critical program counter.

48:44.420 --> 48:51.590
Is the program register in the CPU that points.

48:51.590 --> 48:56.750
It's a special register in the CPU that points to the instruction in memory.

48:56.750 --> 48:58.970
So this is actually an instruction in memory.

48:59.810 --> 49:01.730
And this is a virtual address, by the way.

49:01.730 --> 49:02.060
Right.

49:02.600 --> 49:06.830
So soccer boom that's your that's your next instruction.

49:06.830 --> 49:07.220
Maybe.

49:07.220 --> 49:08.780
So that means maybe we didn't execute.

49:08.780 --> 49:10.820
So n hey.

49:10.820 --> 49:12.380
All right I'm right here.

49:13.160 --> 49:15.260
So let's do info registers again.

49:17.300 --> 49:18.560
And all of a sudden.

49:19.660 --> 49:22.480
With a programme counter has changed, my friends.

49:22.870 --> 49:25.570
Right for one, four becomes one.

49:25.600 --> 49:25.960
See?

49:25.960 --> 49:26.740
It's not even one.

49:26.740 --> 49:27.040
One.

49:27.220 --> 49:30.790
Luckily, not even as we said, like a four jump.

49:30.940 --> 49:32.260
It's more than that.

49:33.730 --> 49:34.150
Right.

49:35.950 --> 49:36.790
How do you what is see?

49:36.790 --> 49:37.630
Let's say so.

49:37.630 --> 49:38.260
Five.

49:38.260 --> 49:39.670
Six seven.

49:39.670 --> 49:40.330
Eight.

49:40.330 --> 49:41.530
Nine.

49:42.200 --> 49:43.190
Right.

49:44.580 --> 49:49.560
A, B, c, so we added five, six seven, eight.

49:52.130 --> 49:53.030
Yikes.

49:54.080 --> 49:55.160
Hey, it's not for.

49:55.400 --> 49:56.360
So is this.

49:56.540 --> 49:57.410
Is that so?

49:57.410 --> 50:00.170
This tells me that this is a 64 bit machine, right?

50:00.410 --> 50:00.860
And like.

50:00.860 --> 50:03.290
So see, here is something I didn't know.

50:03.290 --> 50:08.540
I really didn't know that we actually that seems like a little bit of a waste if you ask me.

50:08.540 --> 50:12.470
64 bit machines have to use 64 bit instructions.

50:12.620 --> 50:15.320
Why can't we be a little bit more efficient?

50:15.590 --> 50:17.030
Maybe that's just me, but yeah.

50:17.030 --> 50:17.270
See?

50:17.270 --> 50:18.140
It's eight.

50:18.230 --> 50:18.470
Huh?

50:19.520 --> 50:21.560
I love this stuff, guys.

50:22.080 --> 50:22.710
But yeah.

50:22.710 --> 50:24.330
See, that's the program counter.

50:24.330 --> 50:25.350
Next.

50:27.080 --> 50:28.850
We next.

50:28.850 --> 50:32.270
We are now doing an addition.

50:34.210 --> 50:39.310
We have stored this register the value of two.

50:39.340 --> 50:42.970
This register the value of one.

50:44.050 --> 50:47.980
And then we're now plus eight.

50:48.470 --> 50:51.980
We're pointing to the next instruction now.

50:51.980 --> 50:53.000
Next.

50:55.090 --> 50:55.870
We're going to print it.

50:55.870 --> 51:01.720
That means we're going to read the value of C, which means we have to store the value of C and for

51:01.720 --> 51:02.470
registers.

51:04.410 --> 51:06.150
Look at all this stuff, man.

51:06.880 --> 51:07.960
Three.

51:07.960 --> 51:10.720
So we did start in three, right?

51:11.540 --> 51:13.640
One, two, three.

51:15.330 --> 51:15.570
All right.

51:15.570 --> 51:20.220
Maybe we should use, like, a different number so we can figure out what's one, what's two and three

51:20.220 --> 51:20.520
like.

51:20.850 --> 51:22.770
Because one could be anything else, right.

51:22.770 --> 51:23.400
Who knows.

51:24.510 --> 51:24.990
Right.

51:27.490 --> 51:28.930
Interesting.

51:28.930 --> 51:30.010
Do next.

51:30.040 --> 51:33.820
Now we're incrementing the key itself info registers.

51:33.820 --> 51:34.990
Now it should be.

51:36.380 --> 51:39.170
So there should be a four somewhere here, right?

51:39.890 --> 51:40.550
This is a nine.

51:40.550 --> 51:43.250
I have no idea what nine is here, to be honest, guys.

51:43.610 --> 51:44.150
Right.

51:45.310 --> 51:45.790
I forgot.

51:45.790 --> 51:50.260
What's my code now looks like completely forgot how my code looks like.

51:51.550 --> 51:52.210
All right.

51:54.530 --> 51:55.550
But you get the point.

51:55.550 --> 51:59.690
If you if you actually follow, you know these steps clearly.

51:59.690 --> 52:01.430
You'll find that your code here.

52:01.940 --> 52:02.240
All right.

52:02.240 --> 52:03.590
But you get the point guys.

52:03.590 --> 52:07.190
So we showed the compile we compiled.

52:07.190 --> 52:08.810
We showed the Linux version.

52:08.810 --> 52:11.330
We showed how to compile to an assembly.

52:11.330 --> 52:18.500
We also showed how to, you know, how to how to step into the program and show you the program counters

52:18.500 --> 52:19.310
increasing.

52:19.310 --> 52:21.140
And we showed some of the registers value.

52:21.140 --> 52:24.620
But we're focusing on that in another lecture.

52:25.010 --> 52:26.090
Hope you enjoyed this one.

52:26.090 --> 52:27.920
Let's move to the next lecture.

52:28.640 --> 52:35.480
And, um, if you feel a little bit overwhelmed, take a break and come back tomorrow and come back

52:35.480 --> 52:35.990
fresh.

52:35.990 --> 52:38.390
Because I know there's a lot of information here.

52:38.390 --> 52:43.400
If you feel motivated, if you feel, you know, motivated to continue, just go ahead and continue.

52:43.400 --> 52:46.880
But if you feel a little bit tired, don't never force yourself to continue.

52:46.880 --> 52:47.930
You know, just relax.

52:47.930 --> 52:54.050
You can always come back tomorrow or we have a few time just, uh, and, uh, watch the next lectures,

52:54.050 --> 52:55.670
you know, take it easy.

52:55.970 --> 52:56.840
Slowly.

52:57.260 --> 52:58.280
There's no rush.

52:58.670 --> 52:59.510
See you in the next one.
