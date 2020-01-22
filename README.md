# redis-sscan-with-generator

See my blog post about this [here](https://simonprickett.dev/exploring-javascript-generators-with-redis-sets/).

## Description

Example using a [JavaScript generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) to retrieve members from a Redis set using the [SSCAN](https://redis.io/commands/sscan) command.

## Setup

You will need to be running Redis at 127.0.0.1:6379, or change `index.js` to point at your Redis server.

## Usage

```
$ npm install
$ npm start
```

## Expected Output

The generator should fire three times before Redis has no more set members to return:

```
Retrieved: shark,viper,herbie,phoenix,sierra,geordie,bear,rocky,ghost,mcqueen,iceman,maverick
Retrieved: vader,crockett,mule,tiger,charlie,panther,rico,wolf,tubbs,astronaut
Retrieved: shepherd,phantom,ripley
```
