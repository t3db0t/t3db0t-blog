---
templateKey: blog-post
title: How to access MongoDB Atlas using Stitch and Node.js
date: 2018-11-11T23:46:34.741Z
description: >-
  Writing a local command-line script to access your MongoDB Atlas database via
  Stitch
tags:
  - mongodb
  - script
  - programming
---
I recently realized I needed to switch a project from Google's [Firestore](https://firebase.google.com/docs/firestore/) to a Mongo database because Firestore can't do inequality queries on more than one field at the same time. That sucks, and it meta-sucks because everything else about Firestore is top-notch!

What originally brought me to Firestore was its dead-simple ease of setup and use, as well as its ability to be used directly in a browser, with no intermediate server (I'm now totally on the serverless bandwagon!).

So I needed a new, hosted Mongo solution that I can use direct-to-the-browser. There are two that I'm aware of: [mLab](https://mlab.com/) and MongoDB's own [Atlas](https://www.mongodb.com/cloud/atlas).

I did some comparisons and was suddenly concerned that I wouldn't be able to skip having a server—and then I discovered [Stitch](https://www.mongodb.com/cloud/stitch).

Stitch is an entire serverless platform (I've seen it described as a "backend-as-a-service", hah) that provides the usual lambdas but also a way to connect "directly" to your Mongo database!

I was thrilled, and got an in-browser test working *almost* as quickly as I did Firestore. It was a bit rockier, but not too bad.

All right, great. Then I needed to transfer my Firestore data to Atlas (via Stitch). You can import this via a straight file upload as JSON or CSV/TSV, but I'm going to need to do other operations from a local script anyway.

This is where things got sticky, and I'll be honest with you, it took me a good 2 hours to figure it out. All of the Stitch examples are for clients such as browsers, iOS, Android etc., but *none* of them are for a simple local command-line script!

I did find [this article](https://medium.com/@ethaneus99/how-to-connect-to-mongo-db-stitch-from-node-js-server-781435fe706f), which definitely kick-started me, but it didn't explain a few things, so I'm expanding on it.

First, follow the instructions at the beginning of that article about creating an API key and Stitch role.

Then you can just go ahead and start your script with this:

```
const { Stitch, ServerApiKeyCredential, RemoteMongoClient } = require('mongodb-stitch-server-sdk');
const{ RemoteUpdateOptions } = require("mongodb-stitch-core-services-mongodb-remote");
const stitchClient = Stitch.initializeDefaultAppClient('yourStitchAppID');
const mongoClient = stitchClient.getServiceClient(RemoteMongoClient.factory, "yourStitchServiceName");
const mongoAPIKey = "yourAPIKey"

const credential = new ServerApiKeyCredential(mongoAPIKey);

stitchClient.auth.loginWithCredential(credential).then(user => 
	mongoClient
	.db("yourDatabaseName")
	.collection("yourCollectionName")
	.find()
	.asArray()
)
.then(a => console.log(a))
.catch(err => {
	console.log(err);
	process.exit(1);
});
```

The critical thing with Atlas/Stitch is that `collection`'s methods are _Remote_ operations that sometimes have their own special methods such as `asArray()` that actually execute the operation. This part, I believe, is the same with any client, so the other Stitch tutorials should be able to carry you the rest of the way.
