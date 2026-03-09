WEBVTT

00:04.110 --> 00:05.250
Meet Beatrice.

00:05.370 --> 00:10.800
So Beatrice is a balanced data structure for fast traversal.

00:10.800 --> 00:15.060
So the goal is to minimize the search space.

00:15.120 --> 00:18.510
I don't want to do all these io's to find my rows.

00:18.600 --> 00:19.080
Right.

00:19.290 --> 00:20.240
Did that rhyme?

00:20.250 --> 00:21.240
I think it did.

00:22.320 --> 00:24.180
So what?

00:24.210 --> 00:25.980
B-tree has a.

00:26.010 --> 00:27.870
B-tree has a set of nodes.

00:27.870 --> 00:30.240
And I want you to focus on this word nodes.

00:30.240 --> 00:30.570
Right.

00:30.840 --> 00:36.810
I'm going to reference the paper, the B3 paper written by those two folks in 1970.

00:36.890 --> 00:38.130
A b-tree consists of nodes.

00:38.130 --> 00:38.510
Okay.

00:38.520 --> 00:40.110
And a b-tree have a degree.

00:40.110 --> 00:46.200
We call this degree M by default, and you can choose what degree your tree is right.

00:46.230 --> 00:51.870
And the choice of how how big, how small really changes the whole equation.

00:51.870 --> 00:55.500
And databases pick that automatically, by the way, for you.

00:55.500 --> 00:58.530
You don't have to do and you can't configure this, to be honest.

00:58.740 --> 01:06.040
So this degree is basically correspond to the number of child nodes each node can have.

01:06.880 --> 01:12.850
I said some in this case because not all nodes can have children and I don't really care about these

01:12.850 --> 01:13.240
details.

01:13.240 --> 01:14.830
These are all theoretical stuff.

01:14.830 --> 01:16.660
We don't really care about it, to be honest.

01:16.690 --> 01:19.420
We really care about the essence of the tree.

01:19.450 --> 01:29.320
To me, the traversal aspect of this node and a node has up to n minus one elements.

01:29.320 --> 01:39.850
So if if your node has M children, then the, the it has what we call M minus one elements, right?

01:39.850 --> 01:42.910
So if it have five children it must have four.

01:42.940 --> 01:46.000
If it have three children must have two elements.

01:46.000 --> 01:48.040
So you might say what is an element?

01:48.070 --> 01:49.600
This is a good question.

01:49.870 --> 01:55.330
So each element has a key and a value, very critical thing.

01:55.330 --> 01:56.500
So we have nodes.

01:56.530 --> 02:03.940
Nodes have child nodes and each node in in it inside it has elements.

02:03.940 --> 02:09.050
And these elements correspond of keys and a value, a key value.

02:09.870 --> 02:14.700
The value here is usually the pointer to the row.

02:14.730 --> 02:16.200
It's called a data pointer.

02:16.230 --> 02:17.250
They call it the value.

02:17.250 --> 02:23.610
Sometimes in the in the paper it's referred to as Alpha I.

02:23.880 --> 02:24.360
Right.

02:24.360 --> 02:29.370
So if you read the paper, I've referenced the paper in the show notes here for you to check it out.

02:29.370 --> 02:34.800
And the slides will be in the show notes as well, guys, So you can take a look at that in the description.

02:34.830 --> 02:40.440
The value has the data pointer to the row, and the key itself is what you're searching for.

02:40.440 --> 02:43.120
And we're going to show an example to clarify all that stuff.

02:43.140 --> 02:47.910
So the data pointer, this is this is where databases can shine.

02:47.940 --> 02:50.520
Each database system does this differently.

02:50.860 --> 02:55.670
A data pointer, which is the value here, can either point to the primary key.

02:55.680 --> 03:05.040
If you have a secondary index or a point directly to the tuple secondary indexes in a.B in MySQL and

03:05.040 --> 03:08.430
Oracle I believe point to the primary key.

03:08.460 --> 03:18.130
Well, while in Postgres all secondary indexes point to the tuple directly and just that I talked about

03:18.130 --> 03:25.810
the this in my YouTube channel discussing how Uber moved from Postgres to MySQL.

03:25.810 --> 03:27.940
And that is one of the reasons.

03:27.940 --> 03:29.410
One tiny reasons.

03:29.800 --> 03:31.890
Uh, check out that video if you're interested.

03:31.900 --> 03:36.850
Just just type in YouTube, Uber, Uber, MySQL.

03:37.030 --> 03:39.330
Hussein you're going to find the video.

03:39.340 --> 03:40.750
It's very, very interesting read.

03:40.750 --> 03:45.430
So there's also this concept of root node and internal node and a leaf.

03:45.790 --> 03:47.230
An a leaf node as well.

03:47.260 --> 03:47.800
Right?

03:47.920 --> 03:51.280
And we're going to describe what all these means.

03:51.340 --> 03:54.670
Like the root node is, is very self descriptive, right?

03:54.670 --> 03:56.320
It's the first node at the top.

03:56.320 --> 04:03.100
Internal nodes are below it and the leaf nodes that are the at the end, right, there is no child,

04:03.100 --> 04:04.390
they don't have children.

04:05.500 --> 04:11.260
A very important concept here and note is equal a disk page here in databases.

04:11.260 --> 04:18.760
Most databases I know in computer science, they give you this, this, this contrived example where,

04:18.760 --> 04:24.610
oh, a degree of three or degree of five and they have some put some values here that doesn't really

04:24.610 --> 04:27.550
correspond to anything practical.

04:27.550 --> 04:27.820
Right.

04:27.820 --> 04:31.690
But practically a node is a complete page.

04:31.690 --> 04:40.870
So if a page is eight K, you better find a way to fit eight k worth of elements in it, right?

04:40.870 --> 04:42.880
So that's what we try to think here.



this is the youtube video link can you show it here:https://www.youtube.com/watch?v=K1a2Bk8NrYQ 

This video explains B-trees, a data structure often used in databases and file systems (0:00).

The video covers the following:

Binary Search Trees (0:09): The video begins by explaining binary search trees, where each node has a key and points to left (lesser) and right (greater) child nodes. This allows for efficient searching by halving the search space at each step (0:24).
Introduction to B-Trees (2:28): It then introduces B-trees, which are designed to be more efficient when dealing with large datasets where fetching new nodes is the most expensive operation. B-tree nodes can store multiple keys (2:31).
B-Tree Search Process (2:48): Searching in a B-tree involves checking the search key against keys in the current node. Based on the comparison, the search proceeds to the appropriate child node (2:51).
B-Tree Rules and Properties (3:59): The video details important rules for B-trees, such as all leaf nodes being at the same level (4:04) and each node having a maximum and minimum number of keys (4:18). The root node is an exception to the minimum key rule (4:50).
Inserting Keys into a B-Tree (5:00): When inserting a key, it's added to the bottom level. If a node becomes full, it splits into two nodes, and the middle key is pushed up to the parent (5:16). This splitting process is recursive (6:48).
Deleting Keys from a B-Tree (7:41): Deletion starts with searching for the key. If deleting a key causes a node to fall below the minimum key count, keys can be borrowed from sibling nodes (8:30) or nodes can be merged (9:54). Deleting a key from the middle of the tree requires replacing it with the largest value from the left subtree or the smallest from the right subtree (10:29).
Efficiency of B-Trees (11:32): The video concludes by highlighting that B-trees are highly efficient for large datasets because they minimize the number of node accesses required during operations, leading to substantial time savings (11:32).







WEBVTT

00:04.560 --> 00:05.880
So let's take an example.

00:06.810 --> 00:13.890
So here's my table here and you can see that I added another column here to correspond to the internal

00:14.160 --> 00:22.950
tuple ID or sometimes some people call it our ID row ID, The page number sometimes is baked into the

00:22.950 --> 00:25.590
tuple ID for for simplicity reasons.

00:25.590 --> 00:29.190
But here's here's the tuple ID, It's an internal.

00:29.190 --> 00:30.090
It doesn't show it.

00:30.090 --> 00:30.660
Right.

00:31.020 --> 00:38.280
This is the physical, not the logical primary key or logical field that you have.

00:38.280 --> 00:39.470
And this is just the name.

00:39.480 --> 00:47.310
So now one choice and this is what Postgres does, is actually that, right?

00:47.430 --> 00:49.230
This is my b-tree here.

00:49.350 --> 00:51.840
Let's look at the definitions here.

00:51.870 --> 00:59.310
The node is this red thing, so this is one node and it has two elements and this node has three children.

00:59.310 --> 01:02.730
And because it has three children, how many elements should it have?

01:02.860 --> 01:05.230
Three minus one, which is two, right?

01:05.230 --> 01:07.480
So if it has M, that's M minus one.

01:07.480 --> 01:10.900
If it has K children, it has K minus one.

01:10.930 --> 01:11.800
That's the definition.

01:11.800 --> 01:14.440
And each element has two things.

01:15.370 --> 01:19.360
It has a key, which is what you search for.

01:19.360 --> 01:22.000
In this case, you're creating.

01:22.000 --> 01:23.680
Let's think about this as an index.

01:23.680 --> 01:26.020
You're creating an index on this ID field, right?

01:26.020 --> 01:29.830
So we store the keys as these values, right?

01:30.790 --> 01:38.890
As these keys in the key space of things, while the value becomes the tuple that points directly to

01:38.890 --> 01:41.020
the row here.

01:41.020 --> 01:44.410
So key value also called as data pointer.

01:44.830 --> 01:49.510
And you might say I'm saying I never actually seen this before.

01:50.470 --> 01:53.080
All the b-trees I looked at there is no pair.

01:53.080 --> 01:54.460
There's only one value.

01:54.640 --> 01:58.210
And I blame the author of this, of this paper, to be honest.

01:58.230 --> 02:06.850
So like when they originally just drew the keys, although the values or the data pointer are inside,

02:06.850 --> 02:08.530
but they chose not to.

02:08.530 --> 02:11.440
And here is a blurb of that proving this.

02:11.440 --> 02:16.090
And the figure, the A which is the value pointer are not shown.

02:16.120 --> 02:17.230
Why?

02:17.260 --> 02:18.150
Beats me.

02:18.160 --> 02:23.470
It just all the papers, all the books, nobody talks about this.

02:23.470 --> 02:32.170
They just show this and it it confuses B trees from B plus B plus trees, which is very confusing because

02:32.170 --> 02:35.110
that's not the actual representation of the tree.

02:35.140 --> 02:35.920
To me.

02:35.920 --> 02:40.750
That is the actual representation of the actual tree on disk, if you think about it.

02:40.750 --> 02:41.200
Right.

02:42.190 --> 02:50.410
So anyway, because why am I why am I hammering on this point is because it's very critical to understand

02:50.410 --> 02:57.700
that the keys and the values exist in all nodes in a B tree structure.

02:57.700 --> 03:00.730
And that is important for memory efficiency.

03:00.940 --> 03:03.280
So let's read through all this stuff right here.

03:03.310 --> 03:04.990
So one more thing here.

03:05.920 --> 03:13.600
So this root node has a value, has has a two elements, two and four.

03:13.600 --> 03:14.290
Right.

03:14.290 --> 03:15.160
And.

03:15.920 --> 03:16.880
Elements.

03:16.910 --> 03:22.250
Nodes that is less than two goes to the left of the that element.

03:22.250 --> 03:22.790
Right.

03:22.790 --> 03:23.870
This is the children.

03:23.870 --> 03:27.080
Child nodes between the two and four goes here.

03:27.110 --> 03:30.640
Child nodes greater than four goes to the right.

03:30.650 --> 03:31.070
Right.

03:31.070 --> 03:36.880
And that's that's why the trick is that it has to be n minus one for this to work.

03:36.890 --> 03:39.350
Let's search for ID number three.

03:39.350 --> 03:41.480
So first searching for ID number three.

03:41.510 --> 03:45.860
You're going to read this node, which is almost one single on disk.

03:45.860 --> 03:50.150
And think of this really on a real production database.

03:50.150 --> 03:53.210
This is going to have a lot of elements, to be honest.

03:53.210 --> 03:54.980
It's not just one, okay?

03:55.100 --> 04:01.130
So it's just going to have thousands of elements because we want to fit it in single page.

04:01.130 --> 04:03.950
So there's so much stuff we can put here.

04:04.160 --> 04:04.670
Okay.

04:05.360 --> 04:11.630
And then I'm going to read this and I'm going to ask my question, Where is ID number three?

04:11.630 --> 04:13.520
Well, three is between 2 and 4.

04:13.520 --> 04:16.860
So I just eliminated this and I just eliminated this.

04:16.860 --> 04:24.570
So I'm only going to pull the pointer, the page pointer or the something called the child pointer to

04:24.570 --> 04:25.170
this row.

04:25.200 --> 04:25.470
Right.

04:25.470 --> 04:29.880
So I'm going to take so there is another thing that I didn't show here, but it's shown as a graphic

04:29.880 --> 04:30.840
here, right?

04:30.840 --> 04:32.100
Which is this pointer.

04:32.100 --> 04:36.150
So there is there is another value that we store here, which takes space.

04:36.420 --> 04:37.830
I'm putting it all the way here.

04:37.830 --> 04:41.880
So pull, go there and I just found three.

04:41.910 --> 04:46.380
Now I'm not finding three for the sake of three, I really want 7 or 3.

04:46.410 --> 04:46.860
Right?

04:46.860 --> 04:56.250
So if I find 7 or 3, I jump and get the value and even even we're not really 7 or 3 is useless here

04:56.250 --> 04:59.610
because you're going to do a full table scan to find 7 or 3.

04:59.610 --> 05:06.510
There is more information in 7 or 3 that tells the database which page actually to pull.

05:06.540 --> 05:07.350
Pull.

05:07.350 --> 05:10.320
It's not it's not going to fetch the entire table.

05:10.320 --> 05:15.360
It's going to fetch the exact page, which has 7 or 3.

05:15.360 --> 05:22.200
So it can have more than seven or it can have 7 or 2, 7 or 1 anything nearby.

05:22.410 --> 05:22.830
Right?

05:23.700 --> 05:28.680
So finding one similar one is less than two goes to the left.

05:28.680 --> 05:32.910
I cancel these right and then get 701 jump there.

05:32.910 --> 05:34.380
Five very simple.

05:34.380 --> 05:38.250
Go here, jump and then go to seven and five.

05:38.280 --> 05:42.420
We can add and delete keys very similarly.

05:42.420 --> 05:46.440
And I took this from University of San Francisco.

05:46.470 --> 05:49.530
I just animated this with a JavaScript, right?

05:49.650 --> 05:51.600
Just adding elements, right?

05:51.600 --> 05:58.620
I'm adding elements from 1 to 11 and you can see value one, add two, and this is a degree of three

05:58.620 --> 05:59.280
by the way.

05:59.280 --> 05:59.580
Right?

05:59.580 --> 06:06.640
Which means it can have up to three children and up to three minus one, two elements.

06:06.640 --> 06:07.140
Sorry.

06:07.350 --> 06:09.290
So we have one and two add three.

06:09.300 --> 06:11.610
We split the root and then go here.

06:11.850 --> 06:15.540
As you as we add, we can see we're splitting the pages.

06:15.570 --> 06:19.590
And that split also has a cost, right?

06:19.890 --> 06:23.070
That's why you want you don't want to split pages so often.

06:23.070 --> 06:28.860
That's why the value should be so large that you don't really need to split as often.

06:29.670 --> 06:30.180
Okay.

06:30.510 --> 06:36.660
And and these the order of elements here also matter.

06:36.660 --> 06:38.730
If they are these are random.

06:38.880 --> 06:48.510
The inserts will be slower if you think about it because you will the randomness will will cause the

06:48.510 --> 06:52.530
pages to be stored in an unordered manner.

06:52.530 --> 06:59.220
And if you added a new element that is has to go into the page or in an order fashion, then you have

06:59.220 --> 07:00.090
to split the page.

07:00.090 --> 07:01.470
Split the page is expensive.

07:01.470 --> 07:03.330
So this is just a side effect of things.

07:03.330 --> 07:04.770
So this is how you add it.

07:05.250 --> 07:05.470
All right?

07:05.490 --> 07:12.180
And I'm not going to go through the actual theory of adding and deleting and splitting.

07:12.450 --> 07:12.900
Really.

07:12.900 --> 07:13.350
It's not.

07:13.350 --> 07:15.300
It's not I'm not interested in that.

07:15.300 --> 07:20.130
So here is the same tree that we're looking at that we just added animated.

07:20.130 --> 07:24.870
And it's very critical to understand this is the internal nodes right in the middle.

07:24.900 --> 07:29.370
These are leaf nodes and these are root nodes, right?

07:29.370 --> 07:30.810
We can follow this tree.

07:30.810 --> 07:31.300
Essentially.

07:31.300 --> 07:33.990
It was like, okay, the ten is greater than then.

07:33.990 --> 07:36.870
That's why you see the values of ten here, right?

07:36.870 --> 07:41.640
And then nine is less than ten and 11 is greater than ten.

07:41.640 --> 07:44.610
So so you can search very efficiently here.

07:44.610 --> 07:50.340
And imagine this is expanded to thousands and thousands and thousands of nodes.

07:50.340 --> 07:51.000
Right.

07:51.180 --> 07:53.100
You can see the value of them.





limitaion of b-tree

WEBVTT

00:04.470 --> 00:04.830
Okay.

00:04.830 --> 00:06.810
What's the limitations of B-trees?

00:07.170 --> 00:17.880
B-trees are not perfect and that's why they was a variation was created to solve these limitations.

00:18.090 --> 00:18.810
So.

00:18.810 --> 00:25.680
Well, the first problem is elements and all nodes store both the keys and the values.

00:25.890 --> 00:26.340
Right.

00:27.240 --> 00:36.600
And because we store the key and the value in every single node, then you can only store so many elements.

00:36.600 --> 00:39.450
Because let's go back here and see here's why.

00:40.200 --> 00:43.290
If I'm reading this node right.

00:44.200 --> 00:49.960
From reading this note or this page because they are effectively the same thing in a database, then

00:49.960 --> 00:55.370
you're going to put pull keys for and eight and their corresponding values.

00:55.390 --> 01:01.040
So if you're searching for the key one you really just use the key.

01:01.040 --> 01:06.850
You didn't use the values so you wasted precious memory space.

01:07.860 --> 01:11.250
That you didn't really use if you think about it.

01:11.640 --> 01:13.650
So alternatively.

01:14.740 --> 01:15.670
I can.

01:15.700 --> 01:24.040
If I'm storing the values in the page in the node, then these values are not just this is this.

01:24.040 --> 01:26.260
This could be up to 64 bit.

01:26.260 --> 01:29.530
So or some people store goods.

01:29.650 --> 01:39.040
So think twice when you create an index on a on a Uuid or a string because that puppy exists right here.

01:39.040 --> 01:39.640
Right.

01:40.540 --> 01:50.140
Like if you create, for example, a primary key right on a string field, then this string values are

01:50.140 --> 01:53.320
stored on everyone B plus three.

01:53.320 --> 01:54.340
Store them on a lifter.

01:54.370 --> 01:55.240
Which are we going to discuss?

01:55.240 --> 01:57.430
But but they are stored.

01:57.430 --> 02:00.010
And when they are stored, they take more space.

02:00.010 --> 02:04.660
More space means I can fit less elements.

02:05.660 --> 02:08.320
In a page or in a note.

02:08.330 --> 02:11.390
And if I felt this element, I mean, I need to read more.

02:12.720 --> 02:13.020
Right?

02:13.020 --> 02:13.800
Because I need to.

02:13.800 --> 02:15.480
I need to put more nodes.

02:15.480 --> 02:17.700
More nodes mean more pages.

02:17.700 --> 02:20.310
More pages means more IO.

02:20.340 --> 02:23.310
More IO means slow.

02:24.180 --> 02:28.480
So that's the trickier elements in all nodes.

02:28.500 --> 02:29.470
So both key and well.

02:29.490 --> 02:36.540
So they take more space, thus require more IO and can slow down the traversal.

02:36.540 --> 02:36.840
Right.

02:37.350 --> 02:38.970
So that's the trick here.

02:38.970 --> 02:40.920
So we might say say well what else.

02:40.920 --> 02:43.980
If we don't store the value you need to store the value at some point.

02:43.980 --> 02:44.580
Right.

02:44.670 --> 02:47.010
Well we're we're going to talk about that.

02:47.010 --> 02:51.210
Another limitation of the B-tree is range.

02:51.210 --> 02:54.480
Queries are slow because of the random access.

02:54.660 --> 02:54.960
Right.

02:55.380 --> 03:02.100
Because you're jumping back and forth if you can if you if you if you ask, you give me all the values

03:02.100 --> 03:03.120
between 1 and 5.

03:03.120 --> 03:05.130
And I'm going to show you an example in a minute.

03:05.520 --> 03:11.340
Then we're going to jump all over the place to find one, and then find two and find three and find

03:11.340 --> 03:12.360
four, and then five.

03:12.360 --> 03:12.990
Five.

03:13.020 --> 03:13.800
Right.

03:13.800 --> 03:17.880
I have to do five different traversals to find these values.

03:17.880 --> 03:18.780
Not necessarily.

03:18.780 --> 03:23.160
It might be a little bit less if you were lucky, but that's that's what I need to go.

03:23.160 --> 03:24.930
It's almost random, right?

03:24.960 --> 03:30.030
Despite them being very tight tucked next to each other, the the keys.

03:30.210 --> 03:30.990
Right.

03:30.990 --> 03:33.330
Give me all the should be keys, not values.

03:33.330 --> 03:34.290
But you get my point.

03:34.320 --> 03:37.950
I'm searching for these values, these keys effectively.

03:37.950 --> 03:38.220
Right.

03:39.240 --> 03:42.870
But B+ tree solved both these problems.

03:42.900 --> 03:49.710
Another problem with this is like, uh, it's hard to fit internal nodes in memory when you have all

03:49.710 --> 03:59.700
these values right in, in, in each element because you have all these values, then, uh, I can't

03:59.700 --> 04:04.320
really fit stuff in memory, especially like, I don't know if I have like a primary key on a, on a

04:04.320 --> 04:08.250
Uuid field or on a string field, right.

04:08.280 --> 04:15.660
Then it becomes very expensive to store this index or this B-tree in memory because it costs a lot right

04:15.780 --> 04:16.860
to traverse.

04:16.860 --> 04:20.730
Let's take an example of why B-trees can be bad for range queries.

04:20.730 --> 04:29.190
So I'm going to now find all the rows ID between 4 and 9 in this in this particular B-tree.

04:29.190 --> 04:32.010
So I'm looking for four and nine.

04:32.010 --> 04:38.810
I'm, I want I want to pull all these rows so I can look up Pete, Edmund, Ian, Edmund, Sarah.

04:38.820 --> 04:42.060
And so what I'm going to do is, okay, let's search number four.

04:42.060 --> 04:44.040
Oh, we're lucky we found number four.

04:44.040 --> 04:44.310
Okay.

04:44.310 --> 04:46.050
Let's find let's find number five.

04:46.050 --> 04:46.800
Where is five?

04:46.800 --> 04:48.510
Well, five is between 4 and 8.

04:48.510 --> 04:55.900
So we jump to this data pointer a child pointer and find to this page page pointer and get this six

04:55.920 --> 04:58.680
or well five is actually less than six.

04:58.680 --> 05:00.330
So let's jump another io.

05:00.330 --> 05:02.670
So one io two three io.

05:02.700 --> 05:03.990
We found five okay.

05:03.990 --> 05:08.370
Let's find let's go ahead and find a six.

05:08.400 --> 05:09.060
Well six.

05:09.060 --> 05:10.950
We just actually read it in a minute ago.

05:10.950 --> 05:13.440
So it's in memory hot right.

05:13.470 --> 05:22.590
Unless we had to throw it back into the disk for, uh, for LRU reasons.

05:22.710 --> 05:24.150
Least recently used cache.

05:24.150 --> 05:26.940
Like if we throw it back, but it's there.

05:26.940 --> 05:27.880
Okay, we found six.

05:27.880 --> 05:29.040
So how about seven?

05:29.070 --> 05:30.300
Go and find seven.

05:30.300 --> 05:31.170
We found it.

05:31.950 --> 05:32.220
All right.

05:32.220 --> 05:33.150
How about eight?

05:33.420 --> 05:35.100
Uh, eight is.

05:35.100 --> 05:36.180
Oh, there you go.

05:36.190 --> 05:37.650
It's up on the road.

05:37.650 --> 05:38.250
How about nine?

05:38.250 --> 05:39.720
Nine is in this side.

05:39.720 --> 05:40.620
Go here.

05:40.620 --> 05:42.820
We read this page and then go on.

05:42.840 --> 05:45.270
And then to the left this is nine.

05:45.270 --> 05:47.130
And then we find the value of nine.

05:47.130 --> 05:51.030
So look at how what how what we have done to find this.

05:51.030 --> 05:59.010
And you might look at this and say it's not that bad, but we thrashed the index to look for these five

05:59.010 --> 05:59.640
values.

05:59.640 --> 06:02.490
Despite them technically being next to each other.

06:02.490 --> 06:03.600
They are sorted.

06:03.630 --> 06:05.880
They are next to each other.

06:05.880 --> 06:06.300
Right.

06:06.870 --> 06:10.410
And that's another thing that the B+ trees solved.

06:10.440 --> 06:18.870
Another thing B+ tree solve is like it tries not to put values in these kind of hot searches.

06:18.870 --> 06:26.160
It tries to to make this as slim as possible, to search and pushes all this, all the data to the leaves,

06:26.160 --> 06:27.690
as we can see in the minute.
