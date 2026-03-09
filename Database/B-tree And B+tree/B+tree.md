WEBVTT

00:04.310 --> 00:05.600
So B plus threes.

00:06.620 --> 00:13.430
It's exactly like B three, but only stores the keys in internal nodes and obviously the root as well

00:13.520 --> 00:13.820
right.

00:14.660 --> 00:20.300
For some reason I think internal nodes also kind of include the root.

00:20.330 --> 00:25.280
I believe there is there is a little bit of a nuance of difference, but who cares.

00:25.280 --> 00:27.200
It's the same thing right?

00:28.160 --> 00:33.590
Uh, if we think about this, values are only stored in leaf nodes.

00:33.620 --> 00:35.120
Very critical here.

00:35.120 --> 00:47.690
So now these internal nodes and the root node are slim, which means I can fit more keys in my nodes.

00:47.720 --> 00:47.960
Right.

00:47.960 --> 00:52.470
Because I don't need this stinking data pages and values anymore.

00:52.490 --> 00:56.510
I just need to store my beautiful keys.

00:56.510 --> 00:56.930
Right?

00:56.930 --> 01:00.950
So 1IO to fetch one node, right?

01:00.950 --> 01:11.750
Which is one single page will give me way more elements, way more keys than it would have gave me if

01:11.750 --> 01:20.300
it was a simple B-tree, because I had to burden, I have the burden of the actual, plus the values

01:20.300 --> 01:26.150
and the data pointer, which most of them will be tossed unfortunately, during this traversal.

01:27.020 --> 01:34.100
So internal nodes are smaller since they only store keys and and they can fit more elements as I as

01:34.100 --> 01:34.820
I discussed.

01:34.850 --> 01:36.470
Here's another important things.

01:36.470 --> 01:40.940
But not not all databases actually implement this, but it's very interesting.

01:41.210 --> 01:43.010
Leaf nodes are linked.

01:43.040 --> 01:45.470
That's what help range queries by the way.

01:45.950 --> 01:47.630
They are linked each.

01:47.630 --> 01:51.610
So because all the values are stored in the leaf nodes they are also linked.

01:51.620 --> 01:57.740
Each one points to the next leaf node, each one points to the next leaf node, and so on.

01:57.770 --> 02:04.640
So once you find a key, you just found everything after it and everything before it.

02:05.360 --> 02:08.720
That helps range queries so much.

02:08.900 --> 02:11.570
Great for it's great for range queries.

02:12.740 --> 02:15.110
Here is a B-tree of a degree three.

02:15.140 --> 02:16.240
So look at that.

02:16.250 --> 02:20.990
So you can see now we only storing the key truly just the keys here.

02:20.990 --> 02:21.560
Right.

02:21.560 --> 02:24.620
And the page pointers right.

02:24.620 --> 02:26.900
Which is these white arrows.

02:28.420 --> 02:30.640
So here's the value of five.

02:30.640 --> 02:37.870
To the left is three, to the right is anything greater than five, which is a beautiful node which

02:37.870 --> 02:39.910
has a value of seven and nine.

02:39.940 --> 02:40.570
Right.

02:40.720 --> 02:43.900
Seven to the left is six, to the right is ten.

02:44.110 --> 02:46.210
In between there is eight and so on.

02:46.210 --> 02:51.700
So you can see that the values the keys are kind of duped.

02:51.730 --> 02:52.960
They are duplicated.

02:52.960 --> 02:58.120
And we have to do it because the leaf nodes should have everything we need.

02:58.270 --> 03:03.610
We need everything in the leafs including the values.

03:03.610 --> 03:06.400
So there are duplicates all the time.

03:06.400 --> 03:08.640
Not all of them are duplicated, right?

03:08.650 --> 03:11.440
Like 11 is not up here, right?

03:12.010 --> 03:14.770
But some of them are and that's okay.

03:14.770 --> 03:18.460
So that's a cost that have been proven to be very minimum.

03:19.090 --> 03:19.900
Right.

03:20.470 --> 03:24.790
To the to the, to the, to the value we get out of this structure.

03:25.180 --> 03:28.750
So now look at this.

03:28.780 --> 03:35.740
If I find value one, if I find the key one I can find the value.

03:35.740 --> 03:43.180
And there is a nice leaf pointer that pointing me to the next sorted key directly.

03:43.180 --> 03:47.110
So you can just jump directly to the next one and the next one.

03:47.110 --> 03:53.830
And when you look at this, this looks really terrible in a database perspective, because a single

03:53.830 --> 03:55.600
node is a single page, right?

03:55.600 --> 03:59.320
As we discussed and in a single page we have one element only.

03:59.320 --> 04:01.030
That's a complete waste.

04:01.630 --> 04:05.290
Our pages in actual database speak or large.

04:05.290 --> 04:10.030
So you're going to see so many things here, not just one element.

04:10.060 --> 04:16.720
This is a terrible example, but I can't draw a B-tree of a degree, I don't know, 1024.

04:16.750 --> 04:19.480
It's very, very hard to draw, right.

04:19.480 --> 04:20.740
It's just doesn't fit here.

04:20.740 --> 04:21.760
But think of this.

04:21.760 --> 04:23.650
This have a lot of elements.

04:23.650 --> 04:27.760
And as a result, one read gives you one a lot of elements and their values.

04:27.760 --> 04:34.930
And also you get a pointer to the next one, which has a rich set of other elements that are next to

04:34.930 --> 04:35.520
each other.

04:35.530 --> 04:36.550
Let's take an example.

04:36.700 --> 04:37.870
Find rows.

04:37.960 --> 04:41.830
Same example that we did for the B-tree, but this is for the B+ tree.

04:42.040 --> 04:44.170
Find all the rows between 4 and 9.

04:44.920 --> 04:46.960
So okay, let's find four.

04:46.960 --> 04:48.040
We start for four.

04:48.070 --> 04:50.260
Just start for 111 of them okay.

04:50.260 --> 04:54.430
For I'm going to read this row 1I0 right okay.

04:54.460 --> 04:57.160
Four is less than five.

04:57.160 --> 05:00.130
So I'm going to take this I just eliminated half the tree.

05:00.730 --> 05:03.880
More than that really I can find three okay.

05:03.880 --> 05:06.460
Three is four is greater than three.

05:06.460 --> 05:08.320
So I'm going to take this then okay.

05:08.320 --> 05:09.650
Here is four right.

05:09.730 --> 05:13.090
But really this is still an internal node.

05:13.090 --> 05:15.820
So I have to take four is equal to four.

05:15.820 --> 05:17.650
So I also go to the right.

05:17.650 --> 05:19.720
That's one of the condition I forgot to mention.

05:19.720 --> 05:25.480
If it's greater or equal go to the right then we just reached here four.

05:25.720 --> 05:26.740
But guess what.

05:26.770 --> 05:27.850
You find four.

05:27.880 --> 05:28.870
You find five.

05:28.900 --> 05:29.770
You find six.

05:29.770 --> 05:32.140
You can seven and eight and nine.

05:32.140 --> 05:38.710
And if you're lucky, all of this is just a single I o right.

05:38.980 --> 05:41.110
Because this is just five elements.

05:41.590 --> 05:48.430
Even if it's like most of the time, like four, 400 or 500 can fit in a single page.

05:48.490 --> 05:51.730
It really depends on the data pointer.

05:51.730 --> 05:52.810
What is this type?

05:52.810 --> 05:58.270
If it's a short integer like I don't know, four bytes, right?

05:58.720 --> 05:59.860
Then it can fit.

06:00.130 --> 06:02.380
You can fit a lot of elements there.

06:02.380 --> 06:10.900
If it's a good or a Uuid or a string or a blob, I don't know why would you index a blob, but that

06:10.900 --> 06:12.100
would be really terrible.

06:12.100 --> 06:13.750
You can't fit much stuff there.



youtube video link can you show it here:https://www.youtube.com/watch?v=o_2psWN8k_c


This video provides a detailed explanation of the B+ tree, a crucial data structure used in databases and file systems.

Here's a breakdown of the key concepts:

Introduction to B+ Trees (0:00): B+ trees are self-balancing search trees that store data only in leaf nodes, which are linked together for efficient sequential access. They are particularly useful for large datasets that need to be fetched from disk, like those in MySQL and NTFS.
Structure of a B+ Tree (0:57): The tree consists of two types of nodes:
Internal nodes (1:06): These act as signposts, storing only keys and child pointers to guide searches.
Leaf nodes (1:17): These store all the actual data or pointers to data and are linked in a chain, enabling fast range queries.
An order 'M' (1:57) defines the maximum number of children an internal node can have. All leaf nodes are at the same level, ensuring balanced search times.
Search Operation (2:42): Searches always start at the root, comparing the search key with node keys to follow the correct path down to a leaf node. The balanced structure ensures every search takes the same number of steps, resulting in logarithmic time complexity.
Insertion (3:29): New values are inserted by finding the correct leaf node and adding the key in sorted order. If a leaf overflows, it's split, and the middle key is promoted to the parent. This process can continue upwards to the root, maintaining the tree's balance.
Deletion (4:37): To delete a key, first find it in the leaf node and remove it. If the node underflows (has too few keys), the tree attempts to borrow from a sibling node. If borrowing isn't possible, it merges the underflowing node with a sibling. The goal is to maintain the tree's balance and B+ tree properties.
Summary & Key Takeaways (6:37): B+ trees offer efficient log(n) time for searching, inserting, and deleting operations due to their self-balancing nature, splits when full, and borrowing/merging strategies when empty.





WEBVTT

00:03.850 --> 00:06.970
So blustery and considerations.

00:07.000 --> 00:08.230
Take a sip of tea.

00:08.260 --> 00:10.510
Take a sip of coffee, relax a little bit.

00:10.510 --> 00:14.140
I know it's a long video, guys, but I think.

00:14.140 --> 00:17.230
I think we need to discuss these in details.

00:17.230 --> 00:19.450
You can pause the video and come back later.

00:19.450 --> 00:20.320
It's all right.

00:20.530 --> 00:21.040
Right.

00:21.040 --> 00:23.920
This is there's there's a lot of content there.

00:23.920 --> 00:24.970
Ask me questions.

00:24.970 --> 00:28.510
Ask questions as you as you encounter them.

00:28.510 --> 00:32.170
But this is very, very interesting to understand now.

00:32.170 --> 00:34.780
So B+ trees and Dbms considerations.

00:35.020 --> 00:43.390
There is an additional cost here, which is the leaf pointer again for, for instance, MySQL, a.B

00:43.720 --> 00:52.270
and Postgres, SQL Server all have this leaf pointers that points to the next of the the to the next

00:52.300 --> 00:58.810
leaf point in the B+ tree leaf leaf nodes wiredtiger in MongoDB.

00:59.050 --> 01:07.820
Yes, MongoDB does use B+ trees through this wiredtiger database engine which I have.

01:07.820 --> 01:12.800
I have a lecture about database database engines, right.

01:13.760 --> 01:14.840
Talk about that.

01:14.840 --> 01:19.820
And Wiredtiger is a B+ tree based engine.

01:19.820 --> 01:24.080
And also they have a variant log structure merge tree.

01:24.820 --> 01:31.030
That that doesn't have this pointer, right, for for design decisions.

01:31.060 --> 01:32.710
Those guys are smart.

01:32.740 --> 01:35.750
They only include things where they absolutely need it.

01:35.780 --> 01:38.630
So it's like, okay, range queries, who cares?

01:38.650 --> 01:42.100
You're not going to do a range queries in Mongo for instance.

01:42.100 --> 01:42.480
Okay.

01:42.490 --> 01:47.050
You're not going to search for a range of keys.

01:47.080 --> 01:48.130
Don't do that.

01:48.130 --> 01:48.850
Right.

01:49.240 --> 01:53.650
One node fits a Dbms page as I discussed most Dbms do.

01:53.650 --> 02:01.510
That can also fit internal nodes easily in memory for fast traversal because the nodes are now tinier

02:01.540 --> 02:02.230
I guess.

02:02.230 --> 02:02.490
Right?

02:02.500 --> 02:06.970
You can fit a lot, a lot, a lot of elements, right?

02:06.970 --> 02:12.610
In these internal nodes you can fit these internal nodes in memory easier.

02:12.610 --> 02:22.770
So the traversal a single IO will give you way more elements as a result, it's way faster, right?

02:22.780 --> 02:28.940
Plus this again really depends on what are you indexing on.

02:29.510 --> 02:31.130
This can fit in memory.

02:31.250 --> 02:37.670
If it's a grade or Uuid, it's not as easy to fit in memory, but still can.

02:37.970 --> 02:42.530
Usually the the internal nodes are not as busy as the leaf nodes in a B+.

02:42.530 --> 02:46.400
Trees leaf nodes can live in the data files in the heap.

02:46.400 --> 02:48.140
That's absolutely fine.

02:48.530 --> 02:49.670
Uh, it is.

02:49.670 --> 02:57.800
Obviously you can try to put them in memory, but if the values right, the value that points to is

02:57.800 --> 03:01.520
expensive, then sometimes it's not possible.

03:02.210 --> 03:04.310
Most Dbms uses B+ trees.

03:05.420 --> 03:08.330
So here's an example of the storage cost here.

03:08.360 --> 03:12.980
This really I said should between quotes here, but it doesn't have to.

03:12.980 --> 03:13.700
Right?

03:13.730 --> 03:18.260
The B3 index works best when it's in memory, right?

03:18.290 --> 03:25.400
So when you load up your database, let's say you have a table with five indexes, you can try to put

03:25.400 --> 03:30.230
all the indexes in memory and you can check the sizes of the indexes by doing a query on the database

03:30.230 --> 03:33.740
and say, See, can I fit this entire index in memory?

03:33.770 --> 03:40.340
Most of the times the indexes are tiny, like if you have don't have large files, but if it's if it's

03:40.340 --> 03:47.120
large, then some databases make the choice, okay, I'm going to only put the internal nodes in memory

03:47.120 --> 03:52.670
so that my traversals are so fast because I cache the page.

03:52.670 --> 03:55.310
And these are tiny, right?

03:55.700 --> 04:03.440
And not very not necessarily tiny because these are pages the same size, but I have way more elements

04:03.440 --> 04:05.690
and as a result I can traverse way more.

04:06.950 --> 04:13.790
And this could fit in disk, but you can definitely put in memory nothing that stops you from doing

04:13.790 --> 04:14.960
that, right?

04:15.920 --> 04:20.780
If they fit again, it really depends on on this on this pointer.

04:20.780 --> 04:22.910
And also it depends on what you're keying on.

04:22.910 --> 04:23.390
Right.



WEBVTT

00:04.020 --> 00:06.300
Okay, let's talk about this is the final thing.

00:06.300 --> 00:09.770
I think the storage cost between Postgres and MySQL.

00:09.780 --> 00:17.850
So B plus three secondary index values and I talked about secondary indexes versus a primary index difference

00:17.850 --> 00:21.570
is very important to know this differences the two difference between the two.

00:21.960 --> 00:22.350
Right.

00:23.100 --> 00:27.810
And can either point directly to the tuple.

00:28.170 --> 00:31.440
This is an example of Postgres or to the primary key.

00:31.440 --> 00:35.610
And this is one of the reasons that Uber moved from Postgres to MySQL.

00:35.610 --> 00:36.390
So they.

00:37.220 --> 00:40.120
Balskus points directly to pool as a result.

00:40.130 --> 00:40.400
Right.

00:40.400 --> 00:47.270
Amplifications implode and have a right amplification lecture goes to the go to the section where you

00:47.270 --> 00:49.520
have like a various database discussion.

00:49.520 --> 00:50.930
You're going to see the right amplification.

00:50.930 --> 00:53.930
Very critical to understand that, right?

00:54.440 --> 01:02.660
So if you if you have a secondary index and the secondary index point to the tuple, then the tuple

01:02.660 --> 01:05.000
size is really not that large.

01:05.300 --> 01:05.540
Right.

01:05.540 --> 01:12.290
Because it's a fit I believe it's a 32 bit, might be wrong, might be 64 bit.

01:12.470 --> 01:13.310
But.

01:14.100 --> 01:15.690
That is the pointer.

01:16.050 --> 01:20.100
While the MySQL seconder indexes points to the primary key.

01:20.130 --> 01:25.770
So if the primary key is large, if it's an integer, you don't have a problem.

01:25.770 --> 01:27.300
Really it's just tiny.

01:27.600 --> 01:41.430
But if it's a good or a Uuid, that is a really bad idea to put a good or a Uuid as the primary key

01:41.550 --> 01:51.570
in a.B MySQL because any secondary key unfortunately will point to the primary key.

01:51.690 --> 01:53.730
And plus the whole thing is clustered.

01:53.730 --> 01:58.730
So inserts are so slow because of the randomness of the Uuid.

01:59.040 --> 02:00.900
It's just not worth it at all.

02:01.950 --> 02:10.110
Okay, so as a result the secondary indexes will be so large because they have all these values that

02:10.110 --> 02:17.740
points to two primary keys which are effectively uuids, which are these large things, right?

02:18.130 --> 02:26.050
And, and you can you can do all sorts of tricks to to, to convert Uuid into instead of using a string

02:26.050 --> 02:31.630
which is I forgot what's the lingo for the Uuid but so many bytes.

02:31.630 --> 02:32.230
Right?

02:32.530 --> 02:33.850
128 I believe.

02:33.880 --> 02:41.970
But you can trick it to use 64 bytes or less than that using the binary representation of Uid.

02:41.980 --> 02:44.260
But still you will.

02:44.500 --> 02:45.850
It is still large.

02:45.850 --> 02:46.310
Right.

02:46.330 --> 02:48.280
And if it's large it takes space.

02:48.430 --> 02:50.470
Takes space, can't fit the memory.

02:50.500 --> 02:51.010
Right.

02:51.010 --> 02:52.690
Your memory is precious.

02:52.720 --> 02:57.970
You might say, Hey, I'm going to add a one terabyte worth of memory for my primary database.

02:58.570 --> 02:59.380
Sure.

02:59.380 --> 03:01.210
But do you have to.

03:01.330 --> 03:01.790
Right.

03:01.810 --> 03:03.100
Think about this, right?

03:03.400 --> 03:10.600
Scaling and database engineering is not something that you take lightly.

03:10.600 --> 03:16.350
You have to think about all this stuff and it all makes sense when you understand these basic fundamentals.

03:16.360 --> 03:19.810
That is what I want to convey in this lecture.

03:20.170 --> 03:24.130
The b-trees are not something you do math on.

03:24.430 --> 03:28.330
Every decision you make costs you.

03:28.980 --> 03:29.520
Right.

03:29.520 --> 03:37.050
And it's important to understand how these different dbms's make these design choices.

03:37.080 --> 03:45.450
Because every design choice can lead to a completely different outcome if the primary key data type

03:45.450 --> 03:46.410
is expensive.

03:46.440 --> 03:49.620
This can cause bloat in all the secondary indexes.

03:49.620 --> 03:56.940
As I talked about, leaf nodes in MySQL and ODB contains the full row since it's an index organized

03:56.940 --> 03:59.850
table or a clustered index too.

04:00.270 --> 04:01.920
So that's another thing, right?

04:02.340 --> 04:08.970
Clustered indexes in general, SQL Server also have this idea of clustered indexes, clustered index

04:08.970 --> 04:13.080
or clustered tables, sometimes called index organized table.

04:13.080 --> 04:19.940
So this is an this is an index where the index is the table itself.

04:19.940 --> 04:22.770
If you think about it, it's just the whole thing.

04:22.800 --> 04:30.130
The leaf node has the whole row and all the columns in it, right?

04:30.280 --> 04:34.960
So that everything is is really clustered nicely.

04:34.960 --> 04:37.600
It has disadvantages and advantages, right?

04:37.720 --> 04:41.980
I'm just not going to go through it, but it's very important to understand that.



WEBVTT

00:04.130 --> 00:05.180
Summary.

00:05.180 --> 00:07.230
So it is the end of the video.

00:07.250 --> 00:09.050
So we discussed full table scans.

00:09.050 --> 00:11.510
This is where the problem originates.

00:12.560 --> 00:18.380
I'm searching for a thing and there's this table, so large, index it for me.

00:18.410 --> 00:19.730
We created B-trees.

00:19.760 --> 00:21.420
It has some limitations.

00:21.440 --> 00:23.900
We fix this limitation with B plus trees.

00:23.900 --> 00:24.410
But.

00:24.410 --> 00:30.680
But there are some considerations obviously with B plus trees because it depends on what you put the

00:30.680 --> 00:32.990
value on and memory consumption.

00:32.990 --> 00:39.980
And based on that, the MySQL Postgres and other databases make a better design choice.

00:41.390 --> 00:43.550
And it all comes back to you.

00:43.550 --> 00:48.050
There is no right or wrong in any of these databases.

00:48.290 --> 00:54.350
It depends on what you're trying to do and pick the database that fits your use case.

00:54.560 --> 00:55.400
As a result.

00:55.730 --> 00:58.010
All right, guys, that's it for me today.

00:58.040 --> 01:00.070
Hope you enjoyed this video.

01:00.080 --> 01:01.460
I'm going to see you in the next one.

01:01.520 --> 01:02.360
Guys, stay Awesome.

01:02.840 --> 01:03.440
Goodbye.
