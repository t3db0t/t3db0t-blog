---
templateKey: blog-post
title: How to use multiple network interfaces on a Raspberry Pi
date: 2019-01-23T20:40:38.677Z
description: 'It''s a bit of work, but totally doable.'
tags:
  - raspberry-pi
  - networking
  - linux
---
Today I needed to use a Raspberry Pi 3 B+ in a very specific configuration: connected to an ethernet device with a static IP while still connected to the internet via WiFi with a hidden SSID. Oy!

After a couple hours of hacking, I figured out how to make this work (on Raspbian Stretch as of this post date).

# Wifi with Hidden SSID
Raspbian does a great job of radically simplifying things, but slightly less common requirements—like a hidden wifi SSID—become a pain in the ass. Never fear, here's all you need to do:

- Get up in ya terminal
- `sudo nano /etc/wpa_supplicant/wpa_supplicant.conf`
- Add the following:
```
country=US
network={
    scan_ssid=1
    ssid="insert_your_hidden_SSID_here"
    psk="insert_your_wifi_password_here"
}
```
- `reboot`

And that should be it. Make sure the wifi connection is working once the Pi comes back up. Then:

# Ethernet with Static IP

[DMX (Digital Multiplex)](https://en.wikipedia.org/wiki/DMX512) is a lighting control protocol—think stage lighting. Big-ass consoles with tons of faders and stuff. Cool! One of the more common ways of transmitting those control messages is over IP with one of the various DMX protocols (one of them is called Artnet, so that I like).

But DMX traditionally came over its own 3- or 5-pin cable that looks a little like XLR. My project was to get a traditional physical DMX connection talking to a Raspberry Pi. To do that, I'm using this [DMX-Ethernet adapter](https://dmxking.com/artnetsacn/edmx1-pro) to 'convert' the physical connection to ethernet.

The adapter has a pre-configured static IP of 192.168.0.111. To talk to that thing from my Pi, I need a static IP of my own on the same subnet. So:

- `sudo nano /etc/network/interfaces.d/eth0`
- Put this in there:
```
auto eth0
iface eth0 inet static
address 192.168.0.(whatever, like 100)
netmask 255.255.255.0
gateway 192.168.0.254 (from the adapter's manual)
```
- `reboot`

Now you should be able to ping the adapter from your Pi. Excellent! **BUT WAIT** I just lost my internet connection, name resolution fails on my browser!

Dammit, one last thing. The `eth0` interface is taking priority over the `wlan0` interface. Easy fix:

`ip route del default`

That's it! Yay! This took me about 2.5 hours to figure out and the assistance of a coworker, so hopefully this saves you some time :)
