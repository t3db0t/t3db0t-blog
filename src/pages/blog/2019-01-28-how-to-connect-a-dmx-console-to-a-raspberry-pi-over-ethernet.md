---
templateKey: blog-post
title: How to connect a DMX console to a Raspberry Pi over ethernet
date: 2019-01-28T18:38:11.286Z
description: 'It took about 4 days to figure it out, but I got it to work.'
tags:
  - raspberry-pi
  - dmx
---
First off, here's the signal chain:

<img src="https://docs.google.com/drawings/d/e/2PACX-1vRqblexRjft7WEdITe7eWxx0m3tGrxPXhc_OV2v4QwkLEYtBv0Kz1QOQ2d1gl2HdXIi7_qc6DPH9BDP/pub?w=362&amp;h=366">

- DMX Console (Simulated by [Lightkey](https://lightkeyapp.com) on my laptop)
- DMX physical connector (Connected to my laptop via [UltraDMX Micro](https://dmxking.com/usbdmx/ultradmxmicro) USB adapter)
- DMX-Ethernet Adapter ([eDMX I Pro](https://dmxking.com/artnetsacn/edmx1-pro))
- Raspberry Pi 3 B+

# Get the Pi and the eDMX talking

The Pi and the eDMX are going to be on their own subnet together, essentially their own LAN (nothing to do with the internet).

## Configure the eDMX device

By default, the eDMX is supposed to use DHCP, so in principle you could connect your Pi to the eDMX via ethernet and not have to do anything special. However, for whatever reasons, that didn't work for me, so I used static IPs.

Download the eDMX Config utility. Connect the eDMX via ethernet to your computer (i.e. using a USB ethernet jack). In your network settings, set your ethernet interface to use a static IP of `192.168.0.50` (for instance), subnet `255.255.255.0`, gateway `192.168.0.254`. The eDMX by default has a static IP of `192.168.0.111`, so you should now be on the same subnet and be able to ping it. Run the eDMX Config util, and it should find the device on its automatic scan.

In the device settings, on the Port A tab, set its mode to `DMX In sACN` (I tried Artnet but never got it to work for OLA. sACN works great). The "In" refers to the 3/5-pin connector port, but it also means that the ethernet port will transmit sACN packets.

## Configure the Pi

If using static IPs as I did, I have [notes here](https://www.tedbot.com/blog/2019-01-23-how-to-use-multiple-network-interfaces-on-a-raspberry-pi/). Then make sure you can ping the eDMX.

# Send and Receive DMX packets

## Send packets with Lightkey

Since I'm using my laptop to act as a DMX console, I needed software to send DMX messages. First I tried [QLC+](https://www.qlcplus.org/) but it was janky, near-incomprehensible, and didn't work anyway. Then I was told about [Lightkey](https://lightkeyapp.com) and it's GREAT, and the basic functions are free.

In Lightkey, select the output device to be the UltraDMX Micro USB. Note that it won't recognize it if the eDMX config util is still running. Then add any fixture to the channel grid, all I needed is something to prove that messages were being received by the Pi.

Dragging the dimmer for the fixture in Lightkey should now be sending DMX messages into and out of the eDMX adapter.

## Check for packets on the Pi

To check this, install `tcpdump` and run `tcpdump -A -i eth0` on the Pi to get a raw ascii stream of bytes coming into the ethernet interface. You should see something like this:

```
14:34:36.879395 IP 192.168.0.111.5568 > 239.255.0.1.5568: UDP, length 638
E...^......s...o...........<....ASC-E1.17...rn......W..,'W.....( .rX....A:eDMX1 PRO 282018.................................................[...r..........................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
```

`E1.17` is the DMX network protocol. Now start dragging the dimmer in Lightkey and watch the tcpdump stream carefully; you should see some of the characters changing as the value changes.

OK, now you've proved that the messages are getting to the Pi. Next step is to decode them into something useful.

## OLA

The Open Lighting Architecture is the standard Linux suite of libraries and tools to interface with DMX. As you'd expect of that description, it's bewildering, confusing, poorly documented, and hard to set up and use.

But it's what we've got, and I figured it out so you don't have to! First, [install OLA](http://opendmx.net/index.php/The_Newbie_Guide_for_OLA_on_Ubuntu#The_Easy_Way).

Then open `localhost:9090` and you should see an OLA web UI. Click "Add Universe" and enter Universe ID `1`, Universe Name `DMXking`, and select input port `E1.31 (DMX over ACN)`. Then, in the "DMX Monitor" tab, you should be able to see the value for channel 1 change as you drag the dimmer in Lightkey. Woohoo! I really hope these instructions work for you, because it took me 4 days to figure all that out.

# What next?

One of the super useful things about OLA is the Python bindings, which let you write scripts to interact with the DMX packets you're getting. A basic setup that prints out channel 1 values looks like this:

```
from ola.ClientWrapper import ClientWrapper

def gotData(data):
  print data[0]

wrapper = ClientWrapper()
client = wrapper.Client()
client.RegisterUniverse(1, client.REGISTER, gotData)
wrapper.Run()
```

Pretty straightforward stuff after the grueling work of getting it all set up!
