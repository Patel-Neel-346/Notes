WEBVTT

00:00.090 --> 00:06.250
The Internet protocol or as I like to call it, the vehicle of the Internet.

00:06.270 --> 00:08.790
You see, guys, anything you do.

00:10.290 --> 00:18.090
When you send a request to the back end from the client or the back end responds back, any protocol

00:18.270 --> 00:25.770
eventually, regardless, what's the protocol is that data will eventually sit into something called

00:25.770 --> 00:27.150
an IP packet.

00:27.180 --> 00:33.250
The destination is the IP address for the destination and the source is where it come from.

00:33.270 --> 00:35.940
At that layer, we don't know anything about ports.

00:35.940 --> 00:41.490
We don't know anything about headers, HDTV headers, or encryption, nothing.

00:42.060 --> 00:44.770
The job is, Hey, here's a bunch of data.

00:44.790 --> 00:51.240
The data can be encrypted, could be gRPC, it could be UDP, could be TCP IP.

00:52.330 --> 00:56.560
Could be a post Chris response from a sequel.

00:56.830 --> 00:59.500
All will fit into an IP packet.

00:59.770 --> 01:03.880
So and this is this will be the topic of this lecture.

01:03.880 --> 01:11.050
So this lecture is basically taken a collection of lectures from my networking course and then combined

01:11.050 --> 01:17.260
them into a single lecture for your four for ease of consumption.

01:17.260 --> 01:19.510
Effectively, I hope you enjoy it.

01:19.930 --> 01:20.830
Let's get into it.

01:20.830 --> 01:32.620
The IP building blocks and I named it this way because I think these are the basic building blocks that

01:32.620 --> 01:35.590
we need to understand in order to understand the IP protocol.

01:35.590 --> 01:38.530
You know, trying to demystify this as much as possible.

01:38.530 --> 01:41.020
What happened when you actually wrote the packet?

01:41.020 --> 01:46.210
What happened when I send it back and now I'm mentioning the word packet here, guys, and I want you

01:46.210 --> 01:51.190
in your brains to think about what a packet is, is the layer three.

01:51.190 --> 01:58.510
Now when I say packet is layer three, that means it's a bunch of data with destination, IP address,

01:58.510 --> 02:01.810
with source IP address, that's it with other headers.

02:01.810 --> 02:02.860
But we don't care now.

02:03.400 --> 02:03.480
Right.

02:03.550 --> 02:04.300
But that's it.

02:04.450 --> 02:06.460
Ports I don't care.

02:06.490 --> 02:06.810
Port.

02:06.820 --> 02:07.060
Yeah.

02:07.060 --> 02:13.120
There is ports inside it, There is the JSON, the data, the http, all this stuff inside this IP packet.

02:13.120 --> 02:16.060
But to the routers it's just an IP packet.

02:16.060 --> 02:20.800
And that's the beauty of this whole all this, I think, you know, if you think about it, let's jump

02:20.800 --> 02:21.310
into it.

02:21.340 --> 02:24.790
IP address, It's a layer three property.

02:24.790 --> 02:25.840
We talked about this.

02:25.990 --> 02:30.010
It can be set automatically or static statically statically.

02:30.010 --> 02:30.520
Right.

02:30.670 --> 02:32.730
And this is the DHCP thing.

02:32.730 --> 02:36.190
I'm going to talk about it, but the idea is the IP address can be assigned.

02:36.190 --> 02:42.970
You know, this is where a network engineering course, actual course detail ID will be valuable talking

02:42.970 --> 02:45.970
about, okay, how is the DHCP work, how is assigning?

02:45.970 --> 02:52.660
This is a network level thing, you know, networking, network engineering kind of a thing.

02:52.660 --> 02:58.540
You know, it's a little bit more detail so I won't go into that level of detail because hey, as long

02:58.540 --> 02:59.800
as I have an IP address, I'm good.

02:59.800 --> 03:02.110
I'm not troubleshooting my network.

03:02.120 --> 03:08.860
You know, there are the network engineers who are, you know, well versed and adept in that particular

03:08.860 --> 03:14.890
thing, you know, troubleshooting and IP DHCP and how the work it's a protocol.

03:14.890 --> 03:19.450
And so all right, maybe I will change my mind and add a lecture for it in the future.

03:19.450 --> 03:20.020
Who knows?

03:21.220 --> 03:29.440
But the IP address can be assigned automatically or you can statically fix it on your machine.

03:29.440 --> 03:30.640
No, and it has.

03:30.640 --> 03:31.540
I will talk about this.

03:31.540 --> 03:34.630
It has a network port and a host portion.

03:34.750 --> 03:40.750
The IP address is a four bytes and it's going to be v four and it's more than that IPV six.

03:40.750 --> 03:42.820
I'm going to talk about IPV six in this course.

03:42.850 --> 03:44.620
Maybe in the future I'm going to add more.

03:45.040 --> 03:47.290
Let's just keep it lower a little bit, right?

03:47.620 --> 03:51.490
There's so much content as is, we'll add more stuff in the future.

03:51.670 --> 03:53.770
But yeah, there is do a bit right?

03:54.580 --> 03:55.990
And there's two.

03:56.640 --> 04:04.440
Portion, the A, B, C, D, or the A, B, c, D is this is the first by second, by third, by fourth

04:04.440 --> 04:06.030
by and slash X.

04:06.030 --> 04:08.850
And I want you to understand the slash x, right?

04:08.850 --> 04:13.470
The x here is the network bits and the what remains or the host.

04:13.470 --> 04:14.520
And here is an example.

04:14.910 --> 04:20.040
If I say 12192168.254.0 slash 24.

04:20.070 --> 04:25.110
That means the first 24 bit, which is 888, that's 24.

04:25.140 --> 04:29.250
These puppies are the network portion.

04:29.250 --> 04:36.480
And this left byte alone, the fourth byte in this case is the host.

04:36.480 --> 04:41.040
That means I can have up to two, five, three, five host Right.

04:41.040 --> 04:45.480
Well I can have up to whatever two to the 424 networks.

04:45.900 --> 04:50.250
The first 24 bit, three bytes are networks, the rest are eight for the host.

04:50.250 --> 04:51.420
Just talk about this.

04:51.420 --> 04:56.340
This means we can have up to to the power 24 look out over the course you want.

04:56.370 --> 04:58.470
Do you really need this much networks?

04:58.470 --> 05:00.990
Ask yourself again if you're a network administrator.

05:00.990 --> 05:02.880
That's that's one part of your job.

05:02.880 --> 05:04.620
And this is not something we usually do.

05:04.620 --> 05:09.000
As we build applications, we need to understand how the packets are delivered.

05:09.000 --> 05:15.330
But configuring the network is something really is better left to the network engineer who this is their

05:15.330 --> 05:16.530
bread and butter, as they say.

05:16.550 --> 05:16.890
Right?

05:16.960 --> 05:18.240
Like how many network do I need?

05:18.240 --> 05:20.250
Oh, do I need slash 24?

05:20.360 --> 05:21.240
A little bit too much?

05:21.240 --> 05:22.770
Let me let me reduce that.

05:22.770 --> 05:25.650
I need more host than networks, actually.

05:25.650 --> 05:27.060
And you can play with that.

05:27.090 --> 05:29.250
This is a ward by itself.

05:29.250 --> 05:36.510
That's why I really mentioned that this course is really for a depth network in general won't teach

05:36.510 --> 05:41.070
you all these low level stuff, you know CCNA and passing all these exams.

05:41.070 --> 05:47.040
No, this is actually decided designed for us software engineers who want to understand the network.

05:47.040 --> 05:47.940
It's a bridge.

05:47.940 --> 05:53.070
Now, after that, if you're really interested in networking, you might take an actual networking course

05:53.070 --> 05:58.950
and you might have actually a better, you know, better luck with it if you want, if you think about

05:58.950 --> 06:01.140
it, because now you get to understand the high level stuff.

06:03.980 --> 06:08.960
And each of these network will have 2 to 55 hosts.

06:09.260 --> 06:10.990
And this is also called a subnet.

06:11.000 --> 06:16.770
If you ever heard about this subnet because of subnet subnet mask, very critical concept.

06:16.790 --> 06:25.490
So if I do 19216 8 to 2 54 to 0 24, this is also called a subnet and the subnet must have a subnet

06:25.490 --> 06:26.120
mask.

06:26.120 --> 06:32.570
So if the subnet mask is used, if you're sending an IP packet, you know, and you have an IP address

06:32.570 --> 06:41.750
and you want to know that is this IP address that I'm about to send to belong to my subnet or not to

06:41.750 --> 06:46.700
answer that particular question because that question will.

06:47.580 --> 06:51.010
Will be forked into two logics.

06:51.010 --> 06:55.730
It's like if it's in my subnet to do this, if it's not on my assignment, do that right.

06:55.740 --> 07:01.430
If it's in my subnet, you can use the MAC address to send it directly back to the host to host communication.

07:01.440 --> 07:06.970
Just use the MAC address to send it directly because it's literally in the same network as you know,

07:07.080 --> 07:09.600
while if it's not in your subnet, all bets are off.

07:10.380 --> 07:18.210
You need to talk to someone who knows how to route this and usually this is usually called a router

07:18.210 --> 07:19.170
or a gateway.

07:19.290 --> 07:21.270
That's why you have a gateway IP address.

07:21.270 --> 07:24.840
In every network you assign, there is a gateway IP address.

07:25.200 --> 07:27.390
That's when things are unclear.

07:27.390 --> 07:29.940
Hey, what do I know that I don't know.

07:29.940 --> 07:31.110
Send it to the gateway.

07:31.620 --> 07:35.730
Some of that mess is used to determine whether an IP is in the same subnet or not.

07:36.600 --> 07:37.320
Default Gateway.

07:37.320 --> 07:39.570
We just talk about this default gateway.

07:39.570 --> 07:43.680
Most networks consist of host and a default gateway.

07:43.680 --> 07:50.520
So you have a network and you have a bunch of hosts right in that network up to whatever the host bets

07:50.520 --> 07:52.500
you are allowed to have that network.

07:52.890 --> 07:57.030
And there must be one of those hosts must be a gateway.

07:57.060 --> 07:57.450
Why?

07:57.450 --> 08:01.980
Because those hosts, they want to talk to something outside of their subnet.

08:02.370 --> 08:04.200
They need to talk to the gateway.

08:04.200 --> 08:10.440
The gateway is just another device that happened to have two network interfaces, one network that is

08:10.440 --> 08:16.260
assigned to belong to this network and another network that belongs to another network, or maybe three

08:16.260 --> 08:17.730
or four or five or six.

08:17.940 --> 08:21.570
These border routers have hundreds of networks.

08:21.570 --> 08:23.910
You know, they can talk to many other networks, so.

08:23.910 --> 08:28.560
Host They can actually talk to host B directly if they are both in the same network, you know, same

08:28.560 --> 08:32.160
subnet effectively, and they use the MAC address for that, right?

08:33.120 --> 08:40.380
Otherwise, if a doesn't know how to talk to B, if its B is not in a subnet and it can find out by

08:40.380 --> 08:42.030
using the subnet mask, we're going to give an example.

08:42.280 --> 08:42.660
Don't worry.

08:42.690 --> 08:43.350
No wait a minute.

08:43.620 --> 08:47.460
Otherwise a sends it to someone who might know the gateway.

08:47.460 --> 08:49.710
The gateway might not know, by the way.

08:50.010 --> 08:50.470
Right.

08:50.580 --> 08:54.720
Because the gateway eventually might talk to another gateway that might know.

08:54.750 --> 08:56.520
You know, you get the point, right.

08:56.520 --> 08:58.020
It's an elegant design.

08:58.170 --> 08:59.430
I absolutely love it.

08:59.850 --> 09:06.090
The Gateway has an IP address on each, and each host should know its gateway, right?

09:06.090 --> 09:11.340
And also have multiple IP addresses depending on how many networks it talks to.

09:11.700 --> 09:15.090
Hey, find an example and I'm going to disappear here so you can see the whole picture.

09:15.090 --> 09:19.800
All right, so host 192168.123.

09:19.800 --> 09:25.530
Wants to talk to 19216821, two two to talk.

09:25.530 --> 09:26.850
I use the word talk here.

09:26.850 --> 09:34.530
I really literally mean sending data, sending packets which to translate it to application client,

09:34.530 --> 09:36.330
front end, back end speak.

09:36.330 --> 09:38.700
We're sending an HTTP request, for example.

09:38.700 --> 09:40.440
You know that's talking, right?

09:40.710 --> 09:47.970
Assuming .1.2 is actually a server and one, two, three is actually a client in this case, or you

09:47.970 --> 09:51.300
want to send a curl request or you do an SSH server.

09:51.300 --> 09:53.010
That's what talks really mean.

09:53.010 --> 10:01.290
At the end of the day, as I said or not, HTTP, DNS, all of these fits into a nicely tucked in IP

10:01.290 --> 10:05.040
packet which has a destination IP and the source IP.

10:05.040 --> 10:06.210
And that's the beauty of this.

10:06.390 --> 10:08.370
Routers don't care about the protocol.

10:08.370 --> 10:10.470
Some routers of fortunately do.

10:10.470 --> 10:15.540
They look at the content, they block certain protocols but most don't you.

10:15.870 --> 10:19.320
But look let's take a look 192168.1231.

10:19.320 --> 10:20.700
To talk to one on two.

10:21.960 --> 10:25.440
First a question tries to answer Are you and my subnet?

10:26.370 --> 10:30.060
It applies a subnet mask to itself and the destination IP address.

10:30.060 --> 10:31.140
What subnet mask?

10:31.170 --> 10:33.360
It's own subnet mask.

10:33.360 --> 10:33.960
Right.

10:34.110 --> 10:35.790
Because that's the only thing it has.

10:35.790 --> 10:37.440
It doesn't have the subject matter with the other machine.

10:37.440 --> 10:41.610
It doesn't need it actually it needs the subnet mask of you which you have.

10:41.610 --> 10:41.880
Right.

10:41.880 --> 10:47.130
You can go to your network, you're going to have three things the your IP address, your subnet mask

10:47.130 --> 10:48.330
and your gateway.

10:48.660 --> 10:51.840
Without these your you cannot do anything.

10:51.840 --> 10:53.910
You're basically dead in the water.

10:53.910 --> 10:55.740
You cannot connect with anyone, right?

10:55.740 --> 10:57.150
You need these three pieces.

10:57.300 --> 11:03.090
So you take this guy, do the 255255255.0.

11:03.120 --> 11:10.080
Apply that right if you do the normal and operator you know this is ones all of these are ones two or

11:10.090 --> 11:10.270
five.

11:10.290 --> 11:11.490
Five are the ones.

11:11.550 --> 11:12.090
Right.

11:12.090 --> 11:18.840
And this is zero one then anything one if you end anything with a one it becomes the same value.

11:18.840 --> 11:24.960
So when you add these bits, right, this is simple byte operations.

11:24.960 --> 11:28.200
Anything that you end with the one becomes the same value, right?

11:28.200 --> 11:35.850
So 192 becomes remains 192168 with 255 becomes one nine.

11:35.850 --> 11:37.860
Because at the end of the day these are one one.

11:37.860 --> 11:42.890
I wish I, I built a bitmap for you guys but you get an idea right 111111.

11:42.900 --> 11:45.750
And these are actual bits like one zero whatever.

11:45.750 --> 11:46.080
Right.

11:46.080 --> 11:46.710
So anything.

11:46.910 --> 11:51.380
You and is going to become the same value right to five, five and one becomes one.

11:51.380 --> 11:55.400
And there's the most important thing, zero and anything is zero.

11:55.880 --> 11:58.460
If you add anything with zero, just nulls it out.

11:58.460 --> 11:58.970
Right?

11:58.970 --> 12:01.490
So zero and three is zero.

12:02.060 --> 12:02.450
All right.

12:02.450 --> 12:07.370
Let's apply to the second IP address two and Z two and zero is zero.

12:07.550 --> 12:09.250
And this is the output from this.

12:09.320 --> 12:16.160
The second IP address, this is the output 4192168101920601110.

12:16.280 --> 12:24.230
These are the same subnet and that question leads to the first branch that we talked about which no

12:24.230 --> 12:25.100
need to root.

12:25.640 --> 12:27.260
I don't need to root it.

12:27.260 --> 12:28.910
I don't need you guys.

12:29.420 --> 12:30.620
I don't need this guy.

12:30.620 --> 12:32.780
I actually do because it's a switch.

12:32.780 --> 12:34.520
In this case, it's playing as a switch.

12:34.520 --> 12:35.780
We're going to talk about it in a minute.

12:35.960 --> 12:41.540
So I'm sending this data to my router, but the router is just going up to layer two.

12:41.540 --> 12:43.490
In this case, it doesn't need the IP address.

12:43.490 --> 12:43.820
But why?

12:43.820 --> 12:47.000
Because it isn't the same subnet, right?

12:47.360 --> 12:52.610
I believe maybe the router will go to the layer and looks at the IP address, but it is the same IP

12:52.610 --> 12:52.880
address.

12:52.880 --> 12:53.360
Right.

12:53.480 --> 12:56.570
So in this case it will just look at the MAC address.

12:56.600 --> 12:57.470
This is all right.

12:57.980 --> 13:00.800
This MAC address is actually on this port boom.

13:00.800 --> 13:01.850
Let's send it right here.

13:01.850 --> 13:04.700
So the router will act as a switch in this case.

13:04.700 --> 13:06.830
So we'll look it really neat.

13:06.830 --> 13:09.020
Just layer two on this particular case.

13:09.020 --> 13:10.520
And this is, by the way, the second network.

13:10.520 --> 13:11.540
We're going to come to that.

13:12.460 --> 13:14.440
All right, let's spice things up a little bit.

13:14.470 --> 13:17.890
19222168.1.3.

13:17.890 --> 13:21.490
Wants to talk to 192221682, two, two.

13:21.760 --> 13:25.120
This guy, this guy wants to talk to this guy.

13:25.150 --> 13:27.190
Well, it's a different network, right?

13:27.220 --> 13:28.180
How did I know?

13:28.210 --> 13:33.900
Well, apply the mask and all of a sudden, you know that this is 192160120.

13:33.960 --> 13:36.550
I, I been one, two, three.

13:36.550 --> 13:36.750
I.

13:36.760 --> 13:37.660
Am I right?

13:39.100 --> 13:40.680
This is my network.

13:40.690 --> 13:45.150
The guy I want to talk to is 2 to 0 different subnet.

13:45.160 --> 13:47.200
I don't know what to do.

13:47.350 --> 13:48.850
This is different subnet.

13:48.940 --> 13:51.610
I need to route it to someone who does.

13:51.610 --> 13:54.100
The packet is sent to the default gateway.

13:54.130 --> 13:57.670
My default gateway is 192168 1.100.

13:58.900 --> 14:04.480
Now you need to send the packet to the router and guess what you need.

14:04.720 --> 14:09.580
This is now loops back to the first scenario.

14:10.310 --> 14:12.890
What you're sending horse to horse directly.

14:13.070 --> 14:19.700
Now you are as if sending the package itself destined to this guy.

14:19.760 --> 14:24.770
But the Mac address, right, is the router.

14:24.800 --> 14:29.420
And here is where every attack possible happens.

14:29.690 --> 14:31.340
This is called our poisoning.

14:31.460 --> 14:37.610
If someone here pretend to be the router, then all the packets can go through it.

14:37.610 --> 14:39.560
And that's how our poisoning happened.

14:39.650 --> 14:41.240
That's another topic for another day.

14:41.240 --> 14:41.660
Right.

14:42.170 --> 14:48.140
Because the Mac addresses is I need to know what is the Mac address of my router because now I need

14:48.140 --> 14:51.020
to send the packet to my router.

14:51.020 --> 14:51.530
Right.

14:51.530 --> 14:54.800
And my router is in my the same subnet as I am.

14:55.490 --> 15:01.970
I send this to the router and the router turns around and understand that Hey OC, where is this guy?

15:01.970 --> 15:02.510
192.

15:02.870 --> 15:06.560
So the router has actually another IP address on the other end.

15:06.560 --> 15:08.680
1921682 200.

15:08.690 --> 15:08.920
Right.

15:08.990 --> 15:14.150
So router lives, double lives, you know it lives two lives.

15:14.150 --> 15:19.070
You know, that's that's what it does, you know, so it's living two lives effectively.

15:19.070 --> 15:21.830
It's a it's an it's an address here and it's an address here.

15:21.830 --> 15:25.880
So it's living it really has two representations.

15:25.880 --> 15:28.610
So this can talk to this and this kind of address.

15:28.610 --> 15:32.630
And that's how that's how basically it is done.

15:33.170 --> 15:34.550
All right, let's summarize.

15:34.550 --> 15:37.340
So talked about what an IP address is talked about.

15:37.340 --> 15:40.070
What is the difference between a network portion and the host portion?

15:40.070 --> 15:47.150
And you can know what is your network today if you want and you can know how many hosts can possibly

15:47.150 --> 15:51.530
happen and you can configure your router to assign more or less host.

15:51.530 --> 15:51.930
Right.

15:51.950 --> 15:57.830
Based on that and we talk about the subnet, we talk about the subnet mask, very, very critical concept

15:57.830 --> 15:58.730
to understand.

15:59.870 --> 16:06.620
We're going to talk about more why this is a critical and in the final section actually where if your

16:06.620 --> 16:16.340
database is actually in a different subnet, then you're back in application, then IP packets that

16:16.340 --> 16:23.300
are in form of TCP connection request from your backend application to the database is going through

16:23.300 --> 16:24.140
the router.

16:24.500 --> 16:29.030
And if this router is congested, then you're going to see delays.

16:29.800 --> 16:34.510
So this is a little bit of a tease and spoiler alert, you know, to that section.

16:34.510 --> 16:38.070
But that's one of the things that just makes sense.

16:38.080 --> 16:40.680
Do not put your database in a different subnet.

16:40.690 --> 16:43.210
You know, sometimes it's not that bad, to be honest.

16:43.230 --> 16:46.090
It's it's okay to put it in a different subnet.

16:46.090 --> 16:53.530
But what happened if this router is so congested, if it's if it's talking to thousands of the networks.

16:53.560 --> 16:53.970
Right.

16:54.340 --> 17:01.030
Or so many networks and so many hosts, it's routing packets, then there might be chances where the

17:01.030 --> 17:08.730
router will buffer will fill down and your beautiful SQL statement request, which will transmit to

17:08.740 --> 17:15.880
multiple segments, will be posed in the router and will never reach the database until a few milliseconds

17:15.880 --> 17:18.100
later and you will see those delays.

17:18.100 --> 17:21.790
Anyone knows why I do have delays in my back end application.

17:22.300 --> 17:24.550
That's just tiny, something tiny.

17:24.550 --> 17:30.280
And this is immediately you understand it because now they understand what is actually happening.

17:30.280 --> 17:32.170
Now go check your back and configuration.

17:32.170 --> 17:36.400
Do you have your database different than your your application?

17:36.430 --> 17:39.190
Put in the subnet because it costs you nothing.

17:39.190 --> 17:39.670
Right.

17:39.670 --> 17:41.530
In this case, put a switch.

17:41.800 --> 17:42.880
Put an actual switch.

17:42.880 --> 17:46.270
This is where a network configuration comes into the picture, actually, right where you're going to

17:46.270 --> 17:54.100
put an actual network switch and you talk a high performing network switch and you put the database

17:54.100 --> 17:55.240
and the application.

17:55.240 --> 17:56.290
Talk to this switch.

17:56.890 --> 18:00.400
The application has no business talking to the router, right?

18:00.400 --> 18:05.680
Don't use the router to route application packets to your as a switch.

18:05.680 --> 18:08.410
You know, that's just a cheap switch at this end.

18:08.410 --> 18:08.740
Right.

18:09.040 --> 18:15.040
Router is not are not designed to be switches that's why those high performance switches are cost a

18:15.040 --> 18:16.600
lot of money enterprise switches.

18:16.600 --> 18:24.760
You know again, I'm not very versed on this but if you really want to go to that level, that's a network

18:24.760 --> 18:28.720
engineering bread and butter you know that's where.

18:29.480 --> 18:30.830
And that's what I want.

18:30.860 --> 18:32.110
I want to bridge that gap.

18:32.120 --> 18:33.470
That's what I'm talking about, guys.

18:34.040 --> 18:36.530
Back in the moment.

18:36.530 --> 18:37.760
You understand this.

18:38.420 --> 18:44.900
You will ask the network engineer to do this configuration for you because you have no idea what you

18:44.900 --> 18:45.400
want, right?

18:45.410 --> 18:49.480
Because they know everything, but they don't know what you want, right?

18:49.490 --> 18:51.860
So if you are a network engineer, you talk the course.

18:51.860 --> 18:52.430
Thank you.

18:52.430 --> 18:57.080
But you now understand the requirements, Right?

18:57.530 --> 18:59.900
But now we're bridging this gap.

18:59.900 --> 19:02.690
We're closing the wound, as they say.

19:02.870 --> 19:08.570
But yeah, and the default gateway, the concept of the default gateway is also has been explained in

19:08.570 --> 19:09.410
this lecture.

19:09.590 --> 19:15.290
How about we jump into it and move to the next lecture over the first lecture of the IP packet?

19:15.860 --> 19:20.000
Harvey, think you know, there is there is so much, so much to discuss here.

19:20.960 --> 19:22.040
Let's jump into it.

19:22.070 --> 19:28.790
Now that we have discussed the building blocks of the Internet protocol itself, I'd like to go and

19:28.790 --> 19:31.010
take a moment to.

19:32.070 --> 19:38.760
Take the lid off of this and dive into the IP packet itself.

19:38.790 --> 19:42.180
This is the anatomy of the IP packet.

19:42.300 --> 19:43.340
Let's jump into it.

19:43.350 --> 19:43.990
All right.

19:44.010 --> 19:49.610
The IP packet, the anatomy of the IP packet itself.

19:49.620 --> 19:52.550
You know, we're now we're going a little bit deeper.

19:52.560 --> 19:59.970
We've always as backend engineers and as engineers, we always look at the IP packet as just a bunch

19:59.970 --> 20:04.050
of data with a target IP address and a source IP address.

20:04.050 --> 20:11.400
As at least I always visualize it this way, but it's critical to understand certain pieces, not all

20:11.400 --> 20:12.090
really.

20:12.120 --> 20:13.260
What I believe.

20:13.260 --> 20:17.550
There are certain important information about the IP packet itself, and this is what this lecture is

20:17.550 --> 20:17.970
about.

20:18.270 --> 20:19.980
So what is the IP about IP?

20:20.130 --> 20:25.050
It has headers and data sections, two sections, the data and the header.

20:25.080 --> 20:27.090
Most of the time we really care about the data.

20:27.090 --> 20:36.030
We don't really care about the headers, but if you want to debug certain problems or understand certain

20:36.030 --> 20:39.000
situations, you need to dive into this thing.

20:39.630 --> 20:45.360
One more important thing to understand is the size of the packet and headers come into the picture.

20:45.360 --> 20:52.980
If you add a 20 extra byte, that's the IP header by the way, 20 byte extra to your data.

20:52.980 --> 20:56.400
That is a 20 bar that you that's not really your data.

20:56.400 --> 21:00.090
It's it's the cost of doing business effectively.

21:00.330 --> 21:01.290
And guess what?

21:01.290 --> 21:05.850
This can go up to 60 bytes if there are certain options are enabled.

21:05.850 --> 21:14.250
So I believe those options are not always in it, but if they are, you can go up to 60 bytes for a

21:14.250 --> 21:14.880
certain packet.

21:14.880 --> 21:23.220
So it is really important for these certain algorithms to kick in to save on sending like a single byte

21:23.220 --> 21:27.060
of packet, you know, with 20 header at 20 bytes header.

21:27.060 --> 21:32.520
It's just a waste of time, you know, it's just a waste of resources to send a single wide and then

21:32.520 --> 21:35.520
attach a 20 byte header to it.

21:35.520 --> 21:42.060
So that's what goes like Nigel I them and delayed acknowledgement try to solve effectively you know

21:42.060 --> 21:47.250
trying not to send your LS command through such as a single packet.

21:47.250 --> 21:52.560
It's just a waste you know, but sometimes you kind of scared that, you know, that's why we have the

21:52.560 --> 22:02.550
data section can go up to 65 536, you know, and that's because the length of the data itself is 16

22:02.550 --> 22:02.850
bit.

22:02.850 --> 22:09.270
So you can only address up to 16 bit worth of content that's equal equivalent to 65,000.

22:09.270 --> 22:17.100
And to be honest, I never seen an IP packet that large at all because if you think about it right,

22:17.100 --> 22:23.760
and we're going to talk about this in later sections, there is something called the MTU, right, which

22:23.760 --> 22:25.530
is the maximum transmission unit.

22:25.980 --> 22:29.280
So maximum transmission in the internet is 1500.

22:29.400 --> 22:38.370
So what packet and avoid all the ideas of fragmentations, you can't really shove more than 1500 water

22:38.370 --> 22:40.350
in IP packet without fragmentation.

22:40.350 --> 22:47.340
So seeing that maybe in a cloud and Amazon, whereas the custom made hardware with MTU is I don't know,

22:48.540 --> 22:55.110
a gigabyte gigabit and to use that, I don't know if that's even possible, but that will reach that.

22:55.110 --> 23:04.140
But to me you will never reach that in single IP packets is almost the average is 5500 bytes, maybe

23:04.140 --> 23:08.770
9000 certain situation, but that's in jumbo frames, but that's pretty much it.

23:08.850 --> 23:13.410
So yeah, I always like to add this IP packet to a back end engineer.

23:14.040 --> 23:16.470
It's a bunch of data destination IP address.

23:16.470 --> 23:23.070
So the IP address I for the longest time I always look at the IP packet like this, you know, and effectively

23:23.070 --> 23:28.020
like this, the right hand side has the destination and this left hand side is the source IP address.

23:28.050 --> 23:30.600
It doesn't look like this on.

23:31.360 --> 23:32.480
On paper.

23:32.510 --> 23:32.830
Right.

23:32.830 --> 23:39.480
But I personally like to it this way because it fits like a Petrushka doll, if you will.

23:39.490 --> 23:42.370
You know, I package based on their frame.

23:42.400 --> 23:45.160
The segment fits into the data and so on.

23:45.160 --> 23:45.550
Right.

23:45.550 --> 23:47.110
I just like it to it this way.

23:47.110 --> 23:51.910
But here is how the actual IP packet looked like.

23:52.060 --> 23:53.620
Scary, isn't it?

23:53.650 --> 23:58.960
So this is how it actually looks like, you know, the IP packet itself and these are the references

23:58.960 --> 24:04.240
you can use that at this, the RFC of the IP protocol, you know, the Internet protocol.

24:04.240 --> 24:09.490
And this is the Wikipedia that explains you have a summary of all that stuff.

24:09.850 --> 24:11.350
What are we looking at here?

24:12.250 --> 24:20.740
This is, you know, horizontally from 0 to 31 is that is is four bytes, you know, so this is eight

24:20.740 --> 24:23.320
bits, eight bits, eight bits a bit.

24:23.500 --> 24:25.780
You know, this is how it's organized.

24:25.780 --> 24:33.070
So four bytes in the first row, four bytes on the second row for byte in the third row for by the fifth

24:33.070 --> 24:35.950
row and fourth byte on the final one.

24:35.950 --> 24:43.540
So if you multiply by four by five rows that gives you 20 bytes that we talked about.

24:43.540 --> 24:46.870
So this is the options and this is determined by the Internet headline.

24:46.900 --> 24:48.250
We're going to talk about it in a minute.

24:48.550 --> 24:53.590
By default, this is five which which explains these five bytes, you know, five rows.

24:53.590 --> 24:58.390
And if it goes more than that, then that will define the length of the options effectively.

24:58.390 --> 25:00.250
And this goes up to 60.

25:00.280 --> 25:04.060
Now, we're going to talk about it so we can add stuff to these options.

25:04.060 --> 25:05.440
You know, and this is good.

25:05.950 --> 25:13.030
Those guys, whoever decide define the IP protocol, they define it in a way to make it extensible.

25:13.120 --> 25:19.420
Unfortunately, from what I read is some routers effectively block the options for some reason, you

25:19.420 --> 25:21.970
know, because it's dangerous or whatever.

25:21.970 --> 25:24.310
So this is sometimes getting blocked.

25:24.310 --> 25:27.220
You know, that's the sad thing about the Internet.

25:27.220 --> 25:32.050
Not everybody follows the rules and as a result, you don't get predictable.

25:32.050 --> 25:38.470
So otherwise I as I back it up, I would have definitely used the IP packet to try to sneak in data,

25:38.470 --> 25:40.630
my own data in the packet itself.

25:41.020 --> 25:42.880
Imagine that how cool this is.

25:42.880 --> 25:49.900
You know, we always build on top of, you know, protocols on top of TCP, on top of CDB two, we build

25:49.900 --> 25:54.940
protocols on top of protocols and we forget how that this is available for us.

25:54.940 --> 26:00.800
You know, as programmers, we can write a packet and we can send options, right?

26:01.180 --> 26:05.770
Unfortunately, we guarantee that these options are arrived safely.

26:06.310 --> 26:06.850
I don't know.

26:06.850 --> 26:08.170
Apparently not.

26:08.170 --> 26:14.620
You know, because these options sometimes are dropped, but it's pretty cool if you think about it.

26:15.040 --> 26:20.380
I don't know if these are user set or not, but regardless, this is the data portion we talked about.

26:20.380 --> 26:25.480
This goes up to 65 kilobytes, you know, 64 kilobytes to be specific.

26:26.380 --> 26:28.720
And let's go through this version.

26:29.290 --> 26:31.990
What's the version of this is either four or six.

26:31.990 --> 26:34.510
We don't have either versions of the IP protocol, right?

26:34.600 --> 26:41.650
So this is either for a specific bits, we have zero one, two, three, we have four bits to describe

26:41.650 --> 26:42.100
that.

26:42.610 --> 26:44.830
A little bit of an overkill if you think about it, right.

26:44.860 --> 26:45.370
Four bits.

26:45.370 --> 26:46.510
How much is that?

26:46.540 --> 26:48.280
Is that 16 numbers.

26:48.280 --> 26:48.760
Right.

26:48.970 --> 26:49.690
Because to the bar.

26:49.720 --> 26:50.350
Eight.

26:50.380 --> 26:50.950
Exactly.

26:50.950 --> 26:51.670
15.

26:51.970 --> 26:52.420
Right.

26:53.170 --> 26:54.220
That's a lot.

26:54.520 --> 27:01.510
So they envisioned like hey, we will go up to version 15 of the IP protocol, but sadly these bits

27:01.510 --> 27:08.290
are never used, you know, because we only use for our six now so we never lose the other bits.

27:08.290 --> 27:09.220
So it's a waste.

27:09.520 --> 27:10.900
But that's what we have today.

27:12.460 --> 27:13.510
Internet header length.

27:13.510 --> 27:14.290
We talked about this.

27:14.290 --> 27:19.300
This defines how long is the options and by default it is five I believe.

27:19.300 --> 27:19.810
Right.

27:19.810 --> 27:21.400
And you can add more.

27:21.400 --> 27:21.700
So yeah.

27:21.700 --> 27:21.850
Okay.

27:21.910 --> 27:29.110
I need, I don't know, 20 bytes write of options and that will that will allow the router to read the

27:29.110 --> 27:29.860
options or not.

27:29.890 --> 27:38.280
If this is five it will read one, two, three four, five with these five rows if you will, a total

27:38.290 --> 27:38.920
length.

27:39.190 --> 27:39.700
Right.

27:39.700 --> 27:43.120
This describes the total length of the whole thing.

27:43.120 --> 27:45.400
You know, this includes the data and the header.

27:45.400 --> 27:49.420
So and this is 16 bit as we talked about, so eight plus eight.

27:49.690 --> 27:52.630
So you can go up to two to the power

27:54.520 --> 28:01.570
16, which gives you the 65,000 bytes and that describes not just the data, just serve the whole header

28:01.570 --> 28:08.440
which is could be 20 you know, do do the math 20 to up to 60 based on the options if you have options

28:08.440 --> 28:08.770
there.

28:08.920 --> 28:09.580
But yeah.

28:11.210 --> 28:12.550
Fragmentation.

28:12.560 --> 28:16.010
This is really a powerful concept.

28:16.280 --> 28:25.280
Sadly, this is very hard to get right, and from what I know, most implementations actually

28:28.250 --> 28:29.540
are frowned upon.

28:29.540 --> 28:32.120
Fragmentation quick is a good example.

28:33.560 --> 28:35.360
Quick Every packet and quick.

28:35.360 --> 28:41.420
The protocol, you know, disables IP fragmentation because it causes so all sorts of things, you know,

28:41.420 --> 28:46.600
because now if the packet is so large, first of all, let's talk about what fragmentation really is.

28:46.880 --> 28:48.650
We talked about M2, right?

28:48.650 --> 28:50.630
The maximum transmission unit.

28:51.470 --> 28:55.460
And you don't really need this, so we can talk about it right here.

28:55.760 --> 28:57.450
So we talk about the M2, right?

28:57.530 --> 29:00.560
The maximum transmission unit, which is the frame size.

29:00.890 --> 29:02.840
And we talked about the IP packet.

29:03.380 --> 29:08.810
By default, the IP package, IP package should fit nicely into a single frame.

29:10.090 --> 29:16.780
And if it doesn't fit, that means if the IP packet is large for some reason, let's say the MTU is

29:16.780 --> 29:20.770
1500 and the IP packet is 2000.

29:21.600 --> 29:26.010
Then that is called you have two options here.

29:26.640 --> 29:28.640
The IP packet won't fit in the frame.

29:28.650 --> 29:29.640
You have two options.

29:30.000 --> 29:35.550
You can either tell the client whoever sent this packet, hey, empty you to too small.

29:35.550 --> 29:41.280
I can't fit this large packet that you sent in in that rm2 fail.

29:41.310 --> 29:42.960
It will send a message.

29:42.990 --> 29:44.220
How does it send a message?

29:44.220 --> 29:47.880
We talked about the ICMP protocol, the internet control message protocol.

29:47.880 --> 29:53.640
Messages are sent through this protocol paying traceroute things like that through the IP vehicle.

29:53.640 --> 29:54.990
We'll say, Hey, I can't.

29:55.500 --> 29:57.510
This packet is too large, right?

29:58.230 --> 30:01.080
That is only if you set that don't fragment bit.

30:01.170 --> 30:04.050
But the other option is.

30:06.400 --> 30:07.690
Fragment this thing.

30:07.720 --> 30:10.000
The IP packet, 2000.

30:10.030 --> 30:14.530
All right, let's put 1501 frame and the 500 goes to another frame.

30:14.530 --> 30:20.170
So you have one IP packet that have been fragmented into two frames.

30:20.170 --> 30:23.290
So those frames will be sent as two frames.

30:23.290 --> 30:27.250
So one packet, two frames, the two frames will arrive.

30:27.280 --> 30:27.770
Guess what?

30:27.800 --> 30:29.500
No, not necessarily in order.

30:29.500 --> 30:36.100
So the host has to understand that this frame belongs to something that is fragmented and try to assemble.

30:36.100 --> 30:39.550
So there is assemblage that needs to require assembling.

30:39.550 --> 30:42.700
The fragment is one of the most dangerous things, right?

30:42.700 --> 30:43.840
Security wise.

30:44.320 --> 30:52.240
And just because people can fake fragmentation, you know, and I won't go into details on this, but

30:52.840 --> 30:55.850
plus it's its cost that is on the whole site.

30:55.870 --> 30:59.050
So you can fragment if you want.

30:59.080 --> 30:59.410
Right.

30:59.410 --> 31:00.390
And this is how you do it.

31:00.400 --> 31:01.450
We're going to talk about it.

31:01.450 --> 31:08.140
But if you do understand the consequences, one frame might fail.

31:08.140 --> 31:09.280
You have to resend it.

31:09.280 --> 31:11.890
And how do you send just part of the fragment?

31:12.460 --> 31:14.110
It's very complicated, right?

31:14.380 --> 31:15.100
That's why.

31:15.970 --> 31:16.510
You know what?

31:17.170 --> 31:18.520
Let's not let's not fragment.

31:18.520 --> 31:19.120
Let's not.

31:19.510 --> 31:23.950
Hey, if you don't fit into a frame, just fail.

31:23.950 --> 31:31.480
So that's the responsibility of the client to send a that they know the should fit in all the empty

31:31.480 --> 31:33.970
use that the network will pass through.

31:34.540 --> 31:35.560
Back to the slides.

31:38.020 --> 31:39.220
Well, actually, I can talk like this.

31:39.520 --> 31:40.870
Yeah, because there's nothing here.

31:41.620 --> 31:41.860
So.

31:41.860 --> 31:46.060
Yeah, well, the ID, this is the idea of the fragment.

31:46.060 --> 31:48.750
So if you have one packet that fragments into four.

31:48.760 --> 31:50.650
So this is one, two, three, four.

31:50.680 --> 31:58.230
Effectively write the ID of the frat flags like, Hey, should I fragment or should I not fragment?

31:58.240 --> 32:04.630
So this is a flag that literally tells the the client which are outer or not.

32:05.350 --> 32:12.220
Am I supposed to break this big packet if the empty is too small or not?

32:12.220 --> 32:18.850
So there is a DF I believe here a flag will say okay, you can, you can, you can fragmented fragment

32:19.120 --> 32:26.620
offset is the 0123 and this is the ID which is the unique identifier of the fragment itself.

32:26.620 --> 32:33.670
Now so all of these are just using four four for fragmentation jumbo packets.

32:33.700 --> 32:39.490
You can get into this as well if you have a large IP packet effectively time to live.

32:39.490 --> 32:40.900
We're going to talk about this as well.

32:40.900 --> 32:41.320
Right.

32:41.890 --> 32:50.620
Every IP packet has a bit actually eight bits, you know, a single byte that represent a counter.

32:52.570 --> 32:54.220
And this is very interesting.

32:54.340 --> 33:00.730
Before we talk about time to live, we're going to talk about a problem because what are we doing this?

33:00.730 --> 33:03.550
Cause we we always ask the question of why?

33:03.550 --> 33:05.140
Why does something exist?

33:05.440 --> 33:08.290
Why do we need to fragment that is too large?

33:08.320 --> 33:09.790
Why do we have time to live?

33:10.750 --> 33:14.440
Because of the idea of routing that we talked about in a while.

33:15.250 --> 33:19.290
The packet can go into different routes, right?

33:19.330 --> 33:23.650
And they can end up into a situation where they will go into an infinite loop.

33:23.680 --> 33:27.490
We'll go to this route, this route, and the theories are out there and this route and then back to

33:27.490 --> 33:35.320
the same router and the packet can go infinitely and you have no idea if you visit this because routers

33:35.320 --> 33:38.110
are not stateful, you know, they don't save the state.

33:38.110 --> 33:39.820
IP protocol is stateless.

33:39.820 --> 33:44.410
You know, they don't save the state of that protocol.

33:44.410 --> 33:51.040
Like, oh, this package was visited before, unlike the layer layer for where we have states, we have

33:51.040 --> 33:52.300
session, we have all that stuff.

33:52.300 --> 33:55.960
IP is just stateless, no IP packets just passing through.

33:55.960 --> 33:57.100
So there is no state.

33:57.100 --> 34:02.890
So how do I prevent packets from roaming around the internet forever?

34:03.460 --> 34:04.600
Meet time to live.

34:04.640 --> 34:09.130
Tell you when you send a packet, you say, okay.

34:09.130 --> 34:14.730
I estimate that this packet will live for 100 routes, right?

34:14.830 --> 34:16.240
So we put 100 here.

34:17.780 --> 34:19.100
I say go.

34:20.420 --> 34:24.990
This packet goes from u L reaches the host.

34:25.010 --> 34:26.150
You know the gateway.

34:26.150 --> 34:26.480
Of course.

34:26.480 --> 34:29.570
If you sending it to the Internet, it will go to your gateway, which is your router.

34:30.140 --> 34:32.630
The router will do minus one to the packet.

34:32.630 --> 34:32.990
So.

34:33.290 --> 34:39.710
Well, the the IP packet will arrive at the physical layer will be converted to a data link, will be

34:39.710 --> 34:41.990
converted to frame the frames.

34:41.990 --> 34:42.490
Right.

34:42.590 --> 34:44.720
Will be converted to IP packets.

34:44.720 --> 34:47.870
You know, one frame, let's assume simplicity.

34:47.870 --> 34:49.700
One frame goes into a single IP packet.

34:49.700 --> 34:51.680
That's best best case scenario.

34:51.680 --> 34:57.410
We have the IP packet and the router takes that IP packet, takes the time to live decrement by one

34:57.410 --> 34:58.700
and send it again.

34:58.700 --> 35:05.720
So it goes back to the same model and goes off to the internet and every one of the routers and hosts

35:05.720 --> 35:08.090
that sees this packet decrements it.

35:08.090 --> 35:10.760
That's the responsibility, that's the contract.

35:10.790 --> 35:15.770
This way we kind of add the state right to the packet.

35:15.770 --> 35:21.380
You know if your program before you know the concept of stateless versus state for stateless we have

35:21.380 --> 35:26.640
to send the information with the with the request right there.

35:26.660 --> 35:28.040
Of course in this case the IP packet.

35:28.040 --> 35:28.400
Right.

35:28.430 --> 35:29.480
Send it with it.

35:29.480 --> 35:34.490
So the state always follows the data itself now instead of saving it in the host.

35:34.490 --> 35:34.910
Right.

35:35.330 --> 35:44.300
So now if this time to live rich zero, whoever decrement it to zero must stop, you know.

35:45.200 --> 35:50.220
Must drop the packet and must send back an ICMP message.

35:50.240 --> 35:51.590
ICMP shows again.

35:51.590 --> 35:52.750
That's why I explained it.

35:52.760 --> 35:53.830
Very critical.

35:53.840 --> 36:00.970
The ICMP protocol shows up again, say packet timed out, whatever.

36:00.980 --> 36:08.870
No, I don't remember that exact message and we'll say it will send it back to whomever was the source

36:08.870 --> 36:09.680
IP address.

36:09.890 --> 36:12.590
And that is exactly how traceroute works.

36:12.920 --> 36:16.340
Traceroute works or router route, same thing.

36:16.430 --> 36:18.740
Trace tracer out or trace route.

36:18.830 --> 36:22.840
You know I believe the British call the router.

36:22.850 --> 36:23.270
Yeah.

36:23.270 --> 36:26.870
So routers, you know the routers.

36:26.960 --> 36:27.560
Right.

36:27.560 --> 36:32.720
Will decrement that until it reaches zero and then send a message to the source and says hey, it's

36:32.720 --> 36:33.110
done.

36:33.110 --> 36:35.420
So the trace route actually does it this way.

36:35.420 --> 36:39.320
It will set a very small time to live and it will increment it.

36:39.320 --> 36:44.510
And every time we pass a hop, we reach the next hop.

36:44.660 --> 36:48.950
That router will tell us about its source IP address.

36:48.950 --> 36:52.370
So we know effectively we trace the entire route.

36:52.580 --> 36:58.970
Obviously some routers disable ICMP altogether, some firewalls disable ICMP, and if that is the case,

36:58.970 --> 37:01.810
that's where you get the dot, dot, dot, dot and trace route.

37:01.820 --> 37:05.330
You cannot basically trace it in that particular case.

37:05.600 --> 37:08.600
So that's time to let very, very important concept.

37:08.600 --> 37:15.550
How many hops can this packet survive And this is usually 128 number or whatever you said it is a large

37:15.560 --> 37:20.720
number, not too large because eventually the packet will live for a long time.

37:20.720 --> 37:26.600
You know, I believe that whatever the default number is enough, if you see your packet takes more,

37:26.600 --> 37:35.570
maybe longer path and they are dying, maybe the client will increase that number protocol you might

37:35.630 --> 37:35.740
say.

37:35.750 --> 37:38.300
I'm saying what we know we are in the IP address.

37:39.320 --> 37:44.240
No, this is the protocol of what is the content that is inside this data.

37:44.270 --> 37:51.230
No, I always find this when I first saw this is like, why that's kind of moot.

37:51.950 --> 37:55.640
I have to define the protocol and you have to know about my protocol.

37:55.730 --> 37:57.320
I want to send this to random data.

37:57.320 --> 37:58.940
It doesn't have to be a protocol.

37:58.970 --> 38:00.350
I want to invent my own protocol.

38:00.350 --> 38:03.470
Are you going to block me then?

38:03.620 --> 38:06.050
I thought about this, right?

38:06.050 --> 38:09.950
It's like, say, hey, just read the data and figure out the protocol.

38:09.950 --> 38:13.640
That's why that's what that's the first thought that came to my mind.

38:13.640 --> 38:18.140
Why do you need an extra eight bits waste?

38:18.140 --> 38:20.090
You know, Then I thought about it.

38:20.840 --> 38:21.770
You know what?

38:22.780 --> 38:24.160
There's actually a good idea.

38:24.280 --> 38:28.160
This way, the routers don't have to pass the entire data.

38:28.180 --> 38:35.260
They can just read the 20 bytes header and immediately figure out what is inside this and whether they

38:35.260 --> 38:37.580
should pull the data or not.

38:37.600 --> 38:39.550
You know, that's ingenious.

38:39.550 --> 38:41.770
Effectively, we always do this.

38:41.770 --> 38:46.150
You know, this is metadata, metadata to save performance.

38:46.150 --> 38:52.300
And obviously it's probably decided to block or want to do anything else.

38:52.300 --> 38:53.640
You can just read this protocol.

38:53.650 --> 39:00.640
So our protocol could be ICMP is part of whether it is TCP, whether UDP, whatever the content of the

39:00.640 --> 39:04.330
IP, the IP data itself, that's the protocol here.

39:04.360 --> 39:11.020
There is a list in in Wikipedia, but if I can share it as well, showing you all every single protocol

39:11.020 --> 39:16.720
that protocol server and specify just I think that is like miscellaneous or something like that, you

39:16.720 --> 39:18.220
can put all that stuff here.

39:18.220 --> 39:20.560
There's there's obviously a bay eight bit.

39:20.560 --> 39:21.640
So how many do we have?

39:21.730 --> 39:26.440
You can have up to 255 protocols but that's it.

39:27.790 --> 39:29.320
Source and destination IP.

39:29.650 --> 39:36.670
By far the most important pieces of metadata here, the header, where are you going and where are you

39:36.670 --> 39:37.560
coming from.

39:37.570 --> 39:39.910
Very important piece of information.

39:40.030 --> 39:42.280
Everybody can fake source IP address.

39:42.280 --> 39:44.350
You know, you can try.

39:44.380 --> 39:48.820
That's why it's like, okay, all my IP address has been spoofed.

39:48.940 --> 39:54.240
You know, here a lot of people it's like it's like, Hey, oh, this is not this.

39:54.700 --> 39:57.250
We've seen your IP address on our forums.

39:58.360 --> 40:00.280
No, that was not me.

40:00.280 --> 40:02.380
My IP address was spoofed.

40:02.950 --> 40:06.280
I was like, Yeah, like spoofing is something easy to do, huh?

40:07.270 --> 40:09.940
Spoofing is the idea of changing the source.

40:09.940 --> 40:16.540
Every packet that you send right from your machine, you effectively changed the source IP address to

40:16.540 --> 40:17.560
be something else.

40:17.560 --> 40:19.110
You can do that, right?

40:19.180 --> 40:20.530
But guess what?

40:20.560 --> 40:25.810
Your ISP, the packet, the IP will go through the routers and the first router.

40:25.810 --> 40:27.100
It hits the major router.

40:27.100 --> 40:29.260
What is what's, what's the first major router?

40:29.260 --> 40:36.070
It's your ISP because that's your link to the internet and it will say say, hey, my source IP address

40:36.070 --> 40:42.220
is actually whatever that guy, you know, you can put any number you want, you can you can write simple

40:42.220 --> 40:46.210
code that do that, does that rewrite every single IP packet.

40:46.720 --> 40:47.200
Right.

40:47.260 --> 40:51.190
The source IP to be something else, but your ISP ISP will call you out.

40:51.190 --> 40:54.400
It's like, wait a minute, that's not your source of IP address.

40:54.400 --> 40:56.380
I know your IP address.

40:56.380 --> 41:02.270
I assigned it to you so you would always be actually blocks said No, you cannot do that right.

41:02.350 --> 41:03.340
Unless.

41:03.880 --> 41:07.510
Yeah, every single internet provider will have this block.

41:07.650 --> 41:09.130
You cannot spoof anymore.

41:09.130 --> 41:15.040
You know, it's not easy to spoof IP addresses, you know, unless you build your own ISP, which is

41:15.040 --> 41:16.390
I don't think it's impossible.

41:16.390 --> 41:22.510
You can do it and then you run your own ISP, you pay money to link yourself to the Internet.

41:22.510 --> 41:28.540
Yeah, you can spoof all you want then, but even if you spoof, then how how would you get responses

41:28.540 --> 41:28.840
back?

41:28.840 --> 41:32.470
Because that's what is used to get responses, you know.

41:33.310 --> 41:37.000
So yeah, destination IP is where are you going, source is where you're coming from.

41:37.840 --> 41:38.800
Very critical.

41:38.950 --> 41:45.790
And these are, as we talked about for bytes because this is what this is the IPV four write explicit

41:45.790 --> 41:47.080
congestion notification.

41:47.080 --> 41:50.920
We're going to talk about this more on the TCP section.

41:51.190 --> 41:58.060
But this bit is effectively is is from an so from a lower layer or an upper layer from an upper layer.

41:58.240 --> 42:01.090
This bit is set by the router.

42:02.570 --> 42:10.160
And this is what it means explicit congestion notification before we talk about congestion notification.

42:11.840 --> 42:16.010
And again, we're talking about this in details in the future, but it doesn't hurt to talk about it

42:16.010 --> 42:16.550
now.

42:18.260 --> 42:22.850
Congestion is when packets start to drop.

42:22.880 --> 42:27.560
You know, IP packets will be arrived at routers like floods.

42:27.560 --> 42:29.700
You know, everybody's sending data.

42:29.720 --> 42:32.210
Everybody I am as I speak, I'm sending data.

42:32.480 --> 42:34.270
This is not life threatening, but you get the point.

42:34.400 --> 42:37.460
And if you're playing this, packets are coming through routers.

42:37.460 --> 42:44.030
You know, at the end of the day, routers to process this packet, they need a certain amount of memory

42:44.030 --> 42:46.040
called the buffer to put the packets in.

42:46.670 --> 42:48.920
This memory fills up.

42:49.100 --> 42:55.070
If it fills up, if you have too many packets or your router is slower, like it does a lot of stuff

42:55.070 --> 42:56.030
to pass.

42:56.570 --> 42:58.850
More work means more time.

42:58.850 --> 43:03.350
More time means queue will go longer and the buffer will fail.

43:03.950 --> 43:07.740
If the buffer fails, that means you cannot accept more packets.

43:07.760 --> 43:10.250
That means you have to drop incoming packets.

43:10.250 --> 43:15.740
Any package that comes the controller of the router will drop the packet and when that happens, that

43:15.740 --> 43:17.900
indicates something called congestion.

43:17.900 --> 43:24.380
That means, hey, the network is congested or these routers are having a having a hard time processing

43:24.380 --> 43:26.000
packets stop.

43:26.030 --> 43:32.390
So there is a whole solution to congestion control, control the traffic in the Internet, and that's

43:32.390 --> 43:35.540
called congestion control for the longest time.

43:35.960 --> 43:37.610
Routers always dropped the packets.

43:37.620 --> 43:38.980
Hey, drop the packet.

43:38.990 --> 43:42.980
I don't care that it doesn't even send any message or anything like that.

43:42.980 --> 43:44.750
Just drop it and leave it alone.

43:45.410 --> 43:48.290
You know, it doesn't even send an ICMP message.

43:48.300 --> 43:49.820
I don't think so.

43:49.820 --> 43:54.050
The client have to guess is okay, my packet had timed out.

43:54.050 --> 43:55.790
I don't see an acknowledgement.

43:55.820 --> 43:59.270
I'm going to assume it's gone, it's dropped, and I'm going to assume congestion.

43:59.270 --> 44:00.320
That's what happens.

44:00.320 --> 44:05.690
It's a waste because that timeout is so long and we're wait.

44:05.720 --> 44:07.790
We need better communication.

44:07.820 --> 44:13.010
Meet explicit congestion notification, the router.

44:13.010 --> 44:18.440
When their buffer fills up because they are IP packets, they only deal with layer three packets.

44:18.440 --> 44:20.150
They will take this packet and say.

44:20.980 --> 44:22.350
I'm about to drop this on my bucket.

44:22.390 --> 44:23.070
It's beautiful.

44:23.080 --> 44:23.950
But wait a minute.

44:23.950 --> 44:27.370
I'm going to actually, I'm going to actually not drop it.

44:28.150 --> 44:30.550
My buffer is about to fail.

44:30.700 --> 44:33.130
I know it's going to feel easy.

44:33.130 --> 44:35.310
N said the bit to one right?

44:35.320 --> 44:35.770
Whatever.

44:35.770 --> 44:38.590
Set it to true Boom notification.

44:38.920 --> 44:41.770
I'm about to get filled and then it will actually process.

44:41.770 --> 44:44.200
So the receiver will see that bit.

44:44.830 --> 44:46.060
Oh oh.

44:46.060 --> 44:49.080
Someone actually some of the routers experience congestion.

44:49.090 --> 44:53.740
I better tell the I better tell the receiver.

44:53.740 --> 45:00.850
And so the TCP layer text controls is where we experience congestion and then the client will start

45:00.850 --> 45:02.830
communicating at the higher levels.

45:02.830 --> 45:06.040
And the TCP transport layer is okay, we experience congestion.

45:06.040 --> 45:13.330
So the beauty here is with this small change, we manage to notify the both the client and the server,

45:13.720 --> 45:14.200
right?

45:15.160 --> 45:20.620
The server will reply back to the client with the same bit, so everybody will know eventually and and

45:20.620 --> 45:25.990
they just manage to know that there's congestion without any packets getting dropped.

45:26.080 --> 45:27.340
Beautiful design.

45:27.820 --> 45:33.010
I absolutely love how elegant such small to bits can do.

45:33.250 --> 45:34.300
And to be honest, I don't know.

45:34.300 --> 45:38.350
Why do we have to better we can go into more detail, but this is the gist of it.

45:38.770 --> 45:39.550
Beautiful.

45:39.550 --> 45:41.710
I absolutely love this stuff.

45:41.740 --> 45:48.490
You know, we can learn so much as backend engineer from these elegant designs, you know, because

45:48.490 --> 45:58.090
we waste so much when we build applications, we build all sorts of, you know, we allocate arrays

45:58.090 --> 46:02.800
like thousands and thousands of by Jason Bloated Jason.

46:02.800 --> 46:05.680
We duplicate keys all around.

46:05.680 --> 46:08.980
We took duplicate responses from the database.

46:08.980 --> 46:10.720
We put it everywhere.

46:10.720 --> 46:12.820
We send information we don't need.

46:12.820 --> 46:21.430
So all of this stuff really hurts me when I see a response from an API that that we just got back up.

46:21.430 --> 46:25.060
You know, we send the same value over and over again.

46:25.540 --> 46:33.850
These kind of things makes me know back in the old days they had a limit to work with and they appreciate

46:33.850 --> 46:34.720
this limit.

46:35.110 --> 46:35.980
Today.

46:36.610 --> 46:38.710
Engineers We don't have a limit.

46:38.710 --> 46:41.050
Ram, what is Ram?

46:41.050 --> 46:41.800
I don't care.

46:41.800 --> 46:45.130
I have 700 gigabyte ram.

46:45.250 --> 46:46.510
I don't care.

46:46.510 --> 46:48.550
Let me look at everything I want.

46:48.820 --> 46:52.930
And unfortunately, we lost that, you know, source of scarcity.

46:53.710 --> 46:59.380
This is just me ranting and that's pretty much this is the most important thing that I like to explain.

46:59.380 --> 47:02.410
And when it comes to the header, the IP of the header.

47:02.410 --> 47:05.290
All right, I've always summarize this IP packet.

47:05.290 --> 47:11.440
The IP packet is one of the more elegant, you know, anatomy there is.

47:11.440 --> 47:18.610
You know, the packet has headers, it's 20 bytes can go up to 60 if you have options and I'll is enabled,

47:18.610 --> 47:22.090
the data section can go to 65,000 bytes.

47:22.300 --> 47:28.900
I never seen such such a IP packet that large because there is no MTU that fits it.

47:28.900 --> 47:34.570
First of all, you know, so you can argue that hey 16 bit is actually too much, but you never know.

47:34.600 --> 47:42.910
Maybe in Amazon Cloud Cloud, Amazon Cloud or Microsoft Azure or Google, they build their own network

47:42.910 --> 47:47.980
interface with a large MTU that can effectively be 65,000.

47:48.010 --> 47:48.670
Who knows?

47:48.670 --> 47:50.590
They don't share this information with us.

47:50.590 --> 47:59.380
So if you have such a large frame, you can send one IP, large IP packet and then fits it in a single

47:59.380 --> 47:59.680
frame.

47:59.680 --> 48:04.410
Now I don't know the limitations of that and what can what can go wrong with that?

48:04.420 --> 48:09.130
Probably people will try them but definitely will decrease the latency, right?

48:09.370 --> 48:15.520
If you have your own network that all of these devices have tightly high bandwidth network, I'm not

48:15.520 --> 48:16.360
going to the internet.

48:16.360 --> 48:17.740
It's just between me.

48:17.740 --> 48:19.000
It's on my own back.

48:19.000 --> 48:26.650
End the database, connect to the to the back end application and all they are, I don't know, 100

48:26.650 --> 48:33.640
gigabit Ethernet and MTU 65 K MTU use, and I'm going to use that.

48:34.090 --> 48:36.220
Sure, you're not going to the Internet.

48:36.220 --> 48:43.870
So this is tightly local area network, so you're optimizing the heck out of everything.

48:43.870 --> 48:45.910
So I'd like to see this one day.

48:45.910 --> 48:51.310
So if someone, if there is an article or something I would love to read someone actually taking advantage

48:51.310 --> 48:59.080
or if there is any limitation that comes to him, to you sizes we talked about packets need to be fragmented

48:59.080 --> 49:05.260
if it doesn't fit a frame, unless you set the bet that says, Hey, don't fragment my the flag that

49:05.260 --> 49:06.670
we talked about, hey, don't fragment.

49:06.670 --> 49:12.490
And if you don't fragment, then if that packet is too large for them to you, we fail, we drop the

49:12.490 --> 49:17.350
packet and we tell the client that, Hey, we couldn't fragment your stuff because you told us, don't

49:17.350 --> 49:17.770
fragment.

49:17.770 --> 49:18.160
Right.

49:18.520 --> 49:20.260
And that's where ICMP.

49:20.770 --> 49:24.850
Uh, actually, this is where a black hole connection can happen.

49:24.860 --> 49:26.560
We're going to talk about this as well in the future.

49:27.190 --> 49:28.450
Black hole TCP connection.

49:28.450 --> 49:29.080
Google that.

49:29.830 --> 49:30.280
All right.

49:30.290 --> 49:31.360
That was the IP packet.

49:31.360 --> 49:31.590
How?

49:31.590 --> 49:33.470
I'm moving to the next lecture.

49:33.490 --> 49:34.420
All right, guys.

49:34.720 --> 49:42.070
ICMP is one of the most critical protocols that lives in layer three, and we talked about it a lot.

49:42.280 --> 49:45.370
But this is where we actually explain it.

49:45.670 --> 49:48.250
If you ever used Ping, that's ICMP.

49:48.280 --> 49:50.690
If you ever use traceroute, that's ICMP.

49:50.710 --> 49:55.600
We're going to demystify this protocol and talk about how critical this thing is.

49:55.900 --> 49:56.920
How about we jump into it?

49:57.770 --> 50:03.280
So ICMP stands for the Internet Control Message protocol and lives in layer three.

50:03.290 --> 50:05.090
That means what does that mean?

50:06.260 --> 50:09.900
It means only there is a destination and source IPA.

50:09.920 --> 50:12.890
There is no concept of ports at that layer.

50:12.920 --> 50:13.880
There is no ports.

50:13.880 --> 50:15.970
There are no ports, you know.

50:16.010 --> 50:17.240
So it's just for information.

50:17.240 --> 50:18.530
Messages between host.

50:19.280 --> 50:20.150
Beautiful.

50:20.400 --> 50:21.710
No, just very critical.

50:21.710 --> 50:25.010
That's why when I Now we have the same language, we talk the same language.

50:25.010 --> 50:30.980
When I say layer three, we You understand what that means When I say layer four, immediately ports.

50:30.980 --> 50:31.820
Think of ports.

50:31.820 --> 50:33.080
You know, think of TCP.

50:33.110 --> 50:34.190
Think of congestion control.

50:34.190 --> 50:35.140
Think of that stuff.

50:35.150 --> 50:38.990
We're going to become more clear as the course goes.

50:39.590 --> 50:42.680
Designed for informational messages hosted, unreachable.

50:42.710 --> 50:46.910
Hey, you send a message to a host that doesn't exist.

50:47.480 --> 50:49.940
ICMP port unreachable.

50:50.270 --> 50:57.200
Although port is a layer four concept, the ICMP is a layer three concept that is sent back from the

50:57.200 --> 50:57.800
server.

50:57.890 --> 51:06.680
So if you try to reach a port on a server that doesn't exist, it will send a ICMP message back if that's

51:06.680 --> 51:08.990
enabled and we'll say, Hey port unreachable.

51:09.260 --> 51:11.660
Host unreachable fragmentation needed.

51:11.660 --> 51:15.620
We spent 5 minutes talking about that fragmentation.

51:15.620 --> 51:20.300
Hey, you need to fragment your packet because it's too large for them to you.

51:20.900 --> 51:27.590
Packet expiry infinite loop and routers like hey, this is the time to live things that we talked about,

51:27.590 --> 51:28.040
right?

51:28.220 --> 51:33.680
Until if we keep a decrement and they decrement thing until it's reached the hit and then hey, packet

51:33.680 --> 51:35.840
expired, it's zero, it's dead.

51:36.110 --> 51:43.180
You send an ICMP message so all the time uses IP directly, ping and TRACEROUTE uses it.

51:43.850 --> 51:48.470
We talked about that doesn't it doesn't require listeners or port to be opened.

51:48.470 --> 51:50.560
I love to add this kind of concept.

51:50.570 --> 51:52.910
You'll never find anything else.

51:52.910 --> 51:54.860
That's because a lot of people take this for granted.

51:54.860 --> 51:57.110
But I like to kind of emphasize this point.

51:57.110 --> 52:00.350
There is no port to listen to get the ICMP messages.

52:00.350 --> 52:03.470
You know, you can send an ICMP message any time you want.

52:03.620 --> 52:12.020
As long as the host itself enables ICMP, that means IP packets with IP packets, with the protocol

52:12.020 --> 52:14.900
set to ICMP, no ports, nothing like that.

52:15.230 --> 52:18.380
You can send these echo messages all you want.

52:18.380 --> 52:21.770
You know, this is how the ICMP header looks like.

52:21.800 --> 52:25.850
This is basically I took this from the RFC 792.

52:25.900 --> 52:27.860
Can look at the ICMP message.

52:27.890 --> 52:28.670
It's very simple.

52:28.670 --> 52:32.690
You know, it's a four byte, four octet as they say.

52:32.690 --> 52:33.560
ID right?

52:33.560 --> 52:36.320
The one poor, one by two, by three by.

52:36.320 --> 52:38.060
So there is a white for the code.

52:38.090 --> 52:44.030
Obviously you can have up to 255 code, write a type of the message.

52:44.030 --> 52:47.450
So the thing goes is this is the type, this is the subtype, if you will.

52:47.810 --> 52:53.450
And there is like a list of everything here and all the list is here effectively checksum, whether

52:53.450 --> 52:58.490
this message was corrupted or not, the rest of the headers, you know, some firewalls block ICMP for

52:58.490 --> 53:02.750
security reasons, you know, a lot of you know, that's the sad thing about the Internet.

53:02.750 --> 53:04.100
You know, you build something cool.

53:04.250 --> 53:06.440
We can't have nice things in the Internet.

53:06.470 --> 53:11.810
You build nice things and attackers find an exploit to use ICMP for bad thing.

53:11.810 --> 53:18.560
You know, some people use that to do flooding attacks, to flood ICMP messages to certain server.

53:18.570 --> 53:21.980
Some use it some some some used it for back channel attacks.

53:21.980 --> 53:30.350
To kind of probe the server has to find certain ports that are enabled you know just some firewalls

53:30.350 --> 53:38.750
actually block ICMP or some some some firewalls timeout ICMP messages like hey you can't you're doing

53:38.750 --> 53:42.490
a lot of ICMP requests right now, so I'm going to time you out for a sec.

53:42.620 --> 53:48.080
For for example, this is why Pink might not work in this case.

53:48.080 --> 53:54.080
So ever wonder that you're pinging a machine that you absolutely know it's alive, but your pain is

53:54.080 --> 53:54.920
not going through?

53:55.340 --> 53:58.700
It could be that it's not going through because the host is not available.

53:58.700 --> 54:04.730
But most of the time think one of the packets, right?

54:04.730 --> 54:08.660
The routers that you're going your ping is going through your IP packet because the thing is just an

54:08.660 --> 54:10.640
IP packet that has ICMP.

54:10.790 --> 54:14.990
It's really nothing, nothing fancy there.

54:15.350 --> 54:22.850
And what it does is, is like, hey, one of those routers drop the IP because IP packet because ICMP

54:22.850 --> 54:23.450
is blocked.

54:24.830 --> 54:29.360
So disabling ICMP can also cause real damage with connection establishment.

54:30.980 --> 54:33.820
This is called the TCP blackhole effectively.

54:33.830 --> 54:36.280
So you would establish the connection, right?

54:36.290 --> 54:37.400
But then you start.

54:37.490 --> 54:41.540
So a TCP three way handshake is we're going to talk about it, but it's tiny.

54:41.540 --> 54:45.220
You know, the data you're sending is so send and sent back and Ach.

54:45.230 --> 54:45.770
Right.

54:45.770 --> 54:50.060
But then so so that passes because your IP packet is so tiny.

54:50.180 --> 54:52.730
But the moment you start sending real data.

54:52.760 --> 54:53.330
Right.

54:53.720 --> 54:54.050
Right.

54:54.050 --> 54:55.610
And you say, don't fragment.

54:56.630 --> 54:58.880
And then one of the MTA's in.

54:58.880 --> 55:05.090
The devices are so small and you need to fragment the router will send will try to send you a message

55:05.090 --> 55:13.310
ICMP message saying hey your your your IP packet is so large for my MM2, please make it smaller.

55:13.310 --> 55:14.090
But guess what?

55:14.090 --> 55:16.370
ICMP is blocked, right?

55:16.370 --> 55:20.330
If it's blocked, you will never reach you will never get the ICMP message.

55:20.330 --> 55:25.640
So all of a sudden you see the TCP connection open, but your data is not going through what the heck

55:25.640 --> 55:26.170
is going on?

55:26.180 --> 55:27.500
It's like you open a black hole.

55:27.500 --> 55:29.690
That's literally what is called TCP IP black hole.

55:29.720 --> 55:34.820
Google it, you know, and we're going to do a panic demo a little bit in a minute here.

55:34.820 --> 55:36.560
Let me let me ping something here.

55:36.560 --> 55:37.760
I'm going to ping.

55:37.790 --> 55:40.370
Ping is available on literally every operating system.

55:40.370 --> 55:45.470
So let's pick something that's ping 192168.254.2 54.

55:45.500 --> 55:46.700
This is actually my router.

55:47.090 --> 55:54.830
So if you see this ping, we'll send an ICMP sequence message, you know, and it will specify a title.

55:54.860 --> 55:57.770
Hey, we know the stuff now, right?

55:57.770 --> 56:00.230
TTL Time to Live 64.

56:01.090 --> 56:06.430
Titled Time to Live Iterations and ascending 64 bytes.

56:06.730 --> 56:07.270
Right.

56:07.270 --> 56:15.310
And this is the time it takes from for the ICMP to reach this router and from the router back to me

56:15.310 --> 56:16.640
and it's six millisecond.

56:16.660 --> 56:18.160
If you think about this a little bit slow.

56:18.160 --> 56:19.700
My daughter is right over there.

56:19.720 --> 56:22.450
Why is it taking me maybe through the wi fi?

56:22.480 --> 56:23.830
Because I'm connect to the wi fi.

56:24.370 --> 56:25.090
But look at this.

56:25.090 --> 56:27.850
Sometimes 11 milliseconds, sometimes 12.

56:28.300 --> 56:29.750
That is nuts, you know?

56:29.770 --> 56:31.070
But this is the ICMP sequence.

56:31.100 --> 56:33.490
It's beautiful to understand this stuff.

56:33.490 --> 56:33.940
Right?

56:34.060 --> 56:34.900
So let's.

56:34.990 --> 56:36.170
Let's bring Google.com.

56:36.190 --> 56:36.580
Ping.

56:36.610 --> 56:37.510
Google.com.

56:37.630 --> 56:41.870
So what ping does is like, first of all, ping only works with IP addresses.

56:41.890 --> 56:43.300
Google.com is not IP address.

56:43.300 --> 56:45.550
So it does a DNS finds the IP address.

56:45.940 --> 56:46.210
Right.

56:46.210 --> 56:47.950
So Bing does more work here.

56:48.040 --> 56:55.290
Give me the IP address and now we ping and notice that it decided to do a larger deal.

56:55.330 --> 57:00.360
Now, just because the Google I guess, is farther so it will estimate.

57:00.730 --> 57:05.470
Let me put a larger title and this is like, look at this.

57:05.770 --> 57:08.620
Google is almost as close to my router.

57:08.980 --> 57:12.500
It's like 12 million, nine millisecond and my router is six millisecond.

57:12.520 --> 57:20.200
I really need to check like why is my router is so slow and I need maybe to upgrade my router now.

57:20.200 --> 57:21.700
But this is really interesting stuff.

57:22.000 --> 57:22.930
Back to the slides.

57:26.030 --> 57:27.560
All right, Ping.

57:28.130 --> 57:33.170
This is how ping works and this is the destination server.

57:33.530 --> 57:33.980
All right.

57:33.980 --> 57:39.680
Let's explain what this beautiful diagram that I spent so much time trying to draw because I'm not a

57:39.680 --> 57:40.880
very good animator.

57:41.740 --> 57:42.110
Right.

57:42.140 --> 57:44.150
As you might have noticed already.

57:44.300 --> 57:50.150
So 19216 100 is the first router that 3800 is the second router.

57:50.150 --> 57:52.090
So this is a network.

57:52.100 --> 57:53.270
This is a network.

57:53.270 --> 57:57.140
And these are their puppy devices for that network.

57:57.530 --> 57:59.780
1.2.68 The 5800.

57:59.810 --> 58:04.040
These are the network and these are the devices, 10.100.

58:04.070 --> 58:04.930
This is another network.

58:04.940 --> 58:06.230
So we're connected.

58:06.230 --> 58:08.120
We're connecting many networks together.

58:08.120 --> 58:11.700
So as we talked about, this router belongs to two networks, right?

58:11.720 --> 58:14.810
This guy and this guy, this router belong to two networks.

58:14.840 --> 58:16.430
There's another block to do network.

58:16.430 --> 58:18.710
This router two belong to one network.

58:18.710 --> 58:19.150
Right.

58:19.160 --> 58:21.170
And this is just one of the devices.

58:21.470 --> 58:28.240
So if I send a packet, what do we do is like I send a 200 ICMP echo request.

58:28.250 --> 58:29.440
That's what it means, right?

58:29.450 --> 58:32.510
Hey, I want to go to 192168 or 10.3.

58:32.510 --> 58:33.560
So this guy.

58:33.890 --> 58:36.220
192.168.123.

58:36.230 --> 58:38.750
We do all the shebang that we talked about.

58:38.780 --> 58:42.110
You know, do the subnet mask or you and my subnet.

58:42.150 --> 58:43.390
No, you're not.

58:43.400 --> 58:44.960
Let me send it right.

58:45.290 --> 58:49.970
And with the message, the packet will reach there and we're going to decrement all the TLS.

58:49.970 --> 58:50.300
Right.

58:50.360 --> 58:52.700
So from 100 we reach 96.

58:52.700 --> 58:53.930
So one, two, three, four.

58:53.930 --> 58:54.270
Right.

58:54.290 --> 58:54.770
Makes sense.

58:54.770 --> 58:55.040
Right.

58:55.040 --> 58:57.710
And I'm not sure if the host actually decrement that or not.

58:57.740 --> 59:03.440
We can we can we can study that and make sure that ALK is at 95 or 96.

59:03.450 --> 59:04.970
I really don't know.

59:04.970 --> 59:08.450
But I know the router is decrement that it goes Yeah so we reached that.

59:08.450 --> 59:12.740
So that's that's how ping worked so we got the echo the server.

59:12.740 --> 59:20.540
If it supports ICMP it will respond back with an ICMP echo reply again reset the title the source.

59:20.540 --> 59:29.090
The destination is 1921682123 and the source is 10 to 3 and do all the subnet mask shebang and then

59:29.090 --> 59:32.150
boom, send it over and we get it.

59:32.240 --> 59:33.380
That's how ping works.

59:34.100 --> 59:34.880
Let's go.

59:34.880 --> 59:36.680
A ping that is unreachable.

59:38.000 --> 59:44.450
I'm sending to 192168 or ten two three, which is right there and 161 1.123.

59:44.630 --> 59:44.990
Right.

59:44.990 --> 59:46.340
But look at the title.

59:46.340 --> 59:52.550
I just set it to three specifically just to time it out for for testing reasons here.

59:52.550 --> 59:54.410
So it reaches here.

59:54.560 --> 1:00:01.610
It becomes two, the packet reaches here, the router determines that becomes one, right reaches here,

1:00:01.610 --> 1:00:03.350
the other determines it becomes zero.

1:00:03.830 --> 1:00:07.580
This is wait a minute, it's not reachable.

1:00:07.580 --> 1:00:11.660
I have to drop it so the router before it drops it.

1:00:11.780 --> 1:00:16.340
It drops it and then sends an ICMP destination.

1:00:16.340 --> 1:00:20.150
Unreachable ICMP message because just an IP packet.

1:00:20.150 --> 1:00:21.200
It's just an IP packet.

1:00:21.200 --> 1:00:22.070
That's a beauty.

1:00:22.100 --> 1:00:28.130
Everything is just an IP packet to the layer three routers here, we're sending all this beautiful stuff.

1:00:28.130 --> 1:00:29.990
MAN 1921688.

1:00:29.990 --> 1:00:30.770
One, two, three.

1:00:31.460 --> 1:00:35.330
Target is where I want you to send it back to.

1:00:35.750 --> 1:00:36.650
Yeah, Look at this.

1:00:36.680 --> 1:00:37.370
We're sending.

1:00:37.370 --> 1:00:39.440
We're sending to whoever the source was.

1:00:39.440 --> 1:00:41.330
But who is the source here?

1:00:41.330 --> 1:00:44.780
Now the source becomes this router $160.

1:00:44.780 --> 1:00:45.800
500.

1:00:46.190 --> 1:00:48.140
So now look at this.

1:00:48.350 --> 1:00:58.280
So now we got the machine, got back another packet, but it knows who sent it.

1:00:59.050 --> 1:01:08.350
This is the whole implementation of traceroute because the because the tail dies right here and because

1:01:08.350 --> 1:01:13.480
the router sends back and ICMP destination unreachable or whatever.

1:01:14.560 --> 1:01:20.530
What happens here is effectively the we know who sent this, right?

1:01:20.680 --> 1:01:25.960
We know where the packet dies and that's beautiful.

1:01:26.320 --> 1:01:28.900
Trace traceroute or route.

1:01:29.470 --> 1:01:33.640
Can you identify the entire path your IP packet takes?

1:01:34.350 --> 1:01:37.980
That's the question Trace right answer level use of.

1:01:38.940 --> 1:01:39.220
Right.

1:01:39.250 --> 1:01:46.530
And now I probably understand explain it a lot incremental slowly and you will get the router IP address

1:01:46.530 --> 1:01:47.520
for each hop.

1:01:48.000 --> 1:01:50.790
So start with the one you're going to get immediate, right?

1:01:50.790 --> 1:01:56.040
Because that will decrement, reach zero and will immediately respond back with an ICMP message.

1:01:56.040 --> 1:01:56.400
Right.

1:01:56.460 --> 1:01:59.370
Doesn't always work as the path changes.

1:01:59.370 --> 1:01:59.970
Right.

1:01:59.970 --> 1:02:01.740
And ICMP might be blocked.

1:02:01.740 --> 1:02:02.100
Right.

1:02:02.310 --> 1:02:07.020
That's the problem here because if ICMP is blocked, you're done.

1:02:07.020 --> 1:02:09.330
You cannot do anything but.

1:02:10.250 --> 1:02:17.540
The other thing is your packet might take one route, but the second title that you send might take

1:02:17.540 --> 1:02:20.090
another route, so you might get the wrong result.

1:02:20.090 --> 1:02:22.580
So traceroute is not really 100% correct.

1:02:23.210 --> 1:02:25.910
And here's an animation I did for the traceroute.

1:02:26.090 --> 1:02:28.490
So what do you do is we send a TTL.

1:02:28.520 --> 1:02:30.290
You saw this animation.

1:02:30.830 --> 1:02:34.400
I'm going to do it again because I want you to appreciate my beautiful animation.

1:02:34.610 --> 1:02:36.530
Look at this TTL one.

1:02:36.530 --> 1:02:42.980
We send it one echo, send it to that destination, and then immediately we get a response from who

1:02:43.070 --> 1:02:47.630
the one 800 says and destination unreachable man.

1:02:48.590 --> 1:02:49.010
Why?

1:02:49.010 --> 1:02:52.460
Because we set it as one immediately documented and we're done.

1:02:52.460 --> 1:02:55.580
So now we know that my packet passed through this guy.

1:02:57.270 --> 1:03:00.140
All right, Let me make it to now.

1:03:00.150 --> 1:03:03.450
It survives the first router minus one.

1:03:03.840 --> 1:03:10.620
It doesn't survive the second because minus one and then minus one becomes zero because you send two

1:03:10.620 --> 1:03:12.180
and then it dies right here.

1:03:12.330 --> 1:03:14.490
And now we get the second router.

1:03:14.490 --> 1:03:15.900
So we have the first.

1:03:16.560 --> 1:03:17.900
This is how traceroute works.

1:03:17.910 --> 1:03:19.590
We know the first hop.

1:03:19.590 --> 1:03:21.300
Is this the second hop is this.

1:03:21.510 --> 1:03:22.800
All right, What's the third hop?

1:03:22.830 --> 1:03:23.910
That's three.

1:03:24.180 --> 1:03:25.890
Then boom, boom, boom.

1:03:26.400 --> 1:03:26.760
Right.

1:03:26.760 --> 1:03:32.010
We get this four, we get it here, and then finally five.

1:03:32.040 --> 1:03:34.590
We're going to get an echo reply from the actual one.

1:03:34.590 --> 1:03:36.960
That means, Hey, we actually found the destination, right?

1:03:37.260 --> 1:03:40.000
And that's pretty much it.

1:03:40.020 --> 1:03:41.970
You know, how about we do a demo?

1:03:43.660 --> 1:03:44.650
Could it clear?

1:03:46.420 --> 1:03:48.840
Uh, Trace, Artie.

1:03:49.270 --> 1:03:51.370
I believe it's in windows called Trace.

1:03:51.380 --> 1:03:54.530
Artie in Mac and Linux called trace root.

1:03:54.530 --> 1:03:56.930
So trace, root out Google.com.

1:03:57.080 --> 1:03:58.520
Let's do something else.

1:03:58.550 --> 1:04:00.530
Do I have another network here?

1:04:00.560 --> 1:04:04.750
If I traced out my router, that's kind of pointless because there is only one help.

1:04:04.760 --> 1:04:05.780
But let's do it.

1:04:06.230 --> 1:04:06.740
Exactly.

1:04:06.740 --> 1:04:08.820
So my gateway is immediately that right?

1:04:08.840 --> 1:04:09.440
So that's.

1:04:09.440 --> 1:04:09.920
That's.

1:04:09.920 --> 1:04:11.660
That's kind of pointless.

1:04:12.260 --> 1:04:13.940
But let's try this route.

1:04:14.330 --> 1:04:15.950
Yeah, let's try another machine.

1:04:15.950 --> 1:04:18.290
Do I have another machine?

1:04:18.320 --> 1:04:19.400
I believe I do.

1:04:19.630 --> 1:04:20.570
All right, let's try this.

1:04:20.720 --> 1:04:24.740
I'm going to trace route my other Mac book right here.

1:04:24.770 --> 1:04:26.950
254 to 10, I believe.

1:04:26.960 --> 1:04:27.440
Right.

1:04:27.680 --> 1:04:29.300
And immediately look at this beauty.

1:04:29.300 --> 1:04:32.060
So traceroute to this, right?

1:04:32.060 --> 1:04:34.730
We immediately go to that.

1:04:34.730 --> 1:04:35.150
Right?

1:04:35.150 --> 1:04:41.030
There is no other hop despite us actually going through the router because that's what we have to go

1:04:41.030 --> 1:04:43.280
through the router to reach my packet.

1:04:43.280 --> 1:04:46.940
But my router here acted like a switch, right?

1:04:47.270 --> 1:04:50.300
If it acts like a switch, it goes all up to what layer two?

1:04:51.020 --> 1:04:53.090
So it never actually reaches a layer three.

1:04:53.090 --> 1:04:54.830
So there is no TTL.

1:04:54.860 --> 1:04:58.880
The TTL doesn't get affected if you're sending something to the same network.

1:04:58.880 --> 1:05:00.250
Very critical to understanding.

1:05:00.260 --> 1:05:00.680
Right.

1:05:00.920 --> 1:05:02.570
Very, very, very important.

1:05:03.140 --> 1:05:04.970
Let's try out something, I guess.

1:05:04.970 --> 1:05:06.590
And another network.

1:05:06.650 --> 1:05:07.430
Can you hear me?

1:05:07.430 --> 1:05:07.820
All right.

1:05:08.390 --> 1:05:09.100
Google dot com.

1:05:09.110 --> 1:05:11.340
Sure, definitely.

1:05:11.360 --> 1:05:13.100
The first hop now is the gateway.

1:05:13.100 --> 1:05:13.820
Because what?

1:05:14.390 --> 1:05:20.270
142 252 72.142 is definitely not in my subnet.

1:05:20.270 --> 1:05:20.720
Why?

1:05:20.750 --> 1:05:24.350
Because my subnet is 25525 out of five is not me.

1:05:24.350 --> 1:05:30.530
So immediately we got to this is probably I'm going to block all this stuff because all of this is my

1:05:30.530 --> 1:05:32.600
ISP and I don't want to show any of this stuff.

1:05:32.840 --> 1:05:33.350
Right.

1:05:34.370 --> 1:05:35.060
But.

1:05:36.070 --> 1:05:38.690
It shows probably everything here, right?

1:05:38.710 --> 1:05:43.180
It shows you all the path that it took or until it reaches Google.

1:05:43.180 --> 1:05:43.580
Right.

1:05:43.630 --> 1:05:48.160
So I'm going to block part of this here for security reasons.

1:05:48.370 --> 1:05:51.700
But so I'm going to block part of this stuff.

1:05:51.700 --> 1:05:57.610
But you can see that eventually we reached the Google network here.

1:05:57.710 --> 1:05:58.090
Right.

1:05:58.270 --> 1:05:59.050
All right.

1:05:59.050 --> 1:06:00.640
How about we summarize?

1:06:00.730 --> 1:06:02.470
So what is ICMP?

1:06:02.500 --> 1:06:08.560
It's an IP level protocol that is used to send information back and forth.

1:06:08.590 --> 1:06:09.910
Very critical protocol.

1:06:09.910 --> 1:06:14.260
Fortunately, some browsers, some firewalls block it.

1:06:14.260 --> 1:06:18.740
And if it blocked, that means you cannot ping, you cannot send critical information messages.

1:06:18.780 --> 1:06:21.010
You can get into weird situations.

1:06:21.220 --> 1:06:28.210
A ping and trace route uses it, don't fragment fragmentation needed all these messages around.

1:06:28.540 --> 1:06:35.170
It will use to tell you that whether your host is reachable or not, you know port is reachable or not,

1:06:35.170 --> 1:06:41.800
you know, and that's basically that very critical infrastructure, fundamental first principle protocol

1:06:41.800 --> 1:06:48.910
that really need just to understand it so that you can explain things better when when it happens,

1:06:48.910 --> 1:06:54.820
you know, and in the future, who knows, maybe we can extend this ICMP messages because we have so

1:06:54.820 --> 1:06:59.170
much tools in our, you know, as they could shed.

1:06:59.770 --> 1:07:01.780
But we never use this thing.

1:07:01.780 --> 1:07:04.770
We always build on top of other stuff.

1:07:04.780 --> 1:07:09.190
You know, I wonder if we can use the ICMP for our own purposes.

1:07:09.280 --> 1:07:09.640
All right.

1:07:10.590 --> 1:07:12.490
Onto the next lecture.
