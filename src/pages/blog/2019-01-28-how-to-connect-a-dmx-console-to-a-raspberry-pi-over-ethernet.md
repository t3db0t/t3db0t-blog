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

<img src="https://docs.google.com/drawings/d/e/2PACX-1vRqblexRjft7WEdITe7eWxx0m3tGrxPXhc_OV2v4QwkLEYtBv0Kz1QOQ2d1gl2HdXIi7_qc6DPH9BDP/pub?w=960&amp;h=720">

- DMX Console (Simulated by [Lightkey](https://lightkeyapp.com) on my laptop)
- DMX physical connector (Connected to my laptop via [UltraDMX Micro](https://dmxking.com/usbdmx/ultradmxmicro) USB adapter)
- DMX-Ethernet Adapter ([eDMX I Pro](https://dmxking.com/artnetsacn/edmx1-pro))
- Raspberry Pi 3 B+

# Get the Pi and the eDMX talking

The Pi and the eDMX are going to be on their own subnet together, essentially their own LAN (nothing to do with the internet).

## Configure the eDMX device

First, configure the eDMX by connecting it via ethernet to your computer (i.e. using a USB ethernet jack). In your network settings, set your ethernet interface to use a static IP of 192.168.0.50 (for instance). Then download and run the 
