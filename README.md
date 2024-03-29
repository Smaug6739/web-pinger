# Web ping

[![NPM](https://nodei.co/npm/website-pinger.png)](https://www.npmjs.com/package/website-pinger)

[![NPM](https://badge.fury.io/js/website-pinger.svg)](https://www.npmjs.com/package/website-pinger)
[![LICENSE](https://img.shields.io/github/license/Smaug6739/web-pinger.svg)](https://github.com/Smaug6739/web-pinger/blob/master/LICENSE)
[![PR-welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

This module is a web pinger for simplify the monitoring, and creation of status page.

## Getting started

### Instalation

With npm (node packages manager) :

```sh-session
npm install website-pinger
```

With yarn :

```sh-session
yarn add website-pinger
```

## Usage

Import the module :

CommonJS syntax :

```js
const { WebMonitor } = require("website-pinger");
```

Module ES syntax :

```js
import { WebMonitor } from "website-pinger";
```

Create a new WebMonitor with an URL (string) as a parameter :

```js
const Monitor = new WebMonitor("https://website-example.com", options);
```

### Options

Object

| PARAMETER      | TYPE                        | OPTIONAL  | DEFAULT | DESCRIPTION                                                             |
|----------------|-----------------------------|-----------|---------|-------------------------------------------------------------------------|
| interval       | number                      | ✓         | 3000ms  | Interval for check site                                                 |
| retries        | number                      | ✓         | 3       | Retries before create an outage                                         |
| timeout        | number                      | ✓         | 3000ms  | Maximum waiting time before creating an outage                          |
| headers        | { [key: string]: string } \ | undefined | ✓       | Additional headers to be attached to requests                           |
| catchAllErrors | boolean                     | ✓         | false   | When enabled, all errors will count towards outages, not just timeouts. |

## Events

---

### up

Emitted when site is online

Parameter : status

| PROPERTIES | TYPE   | DESCRIPTION               |
| ---------- | ------ | ------------------------- |
| statusCode | number | The response status code  |
| statusText | string | The response status text  |
| url        | string | The url of website        |
| ping       | number | The ping latency (in ms)  |
| Uptime     | number | Availability time (in ms) |

### outage

Emitted when site is have an outage

Parameter : status

| PROPERTIES     | TYPE   | DESCRIPTION                 |
| -------------- | ------ | --------------------------- |
| statusCode     | number | The response status code    |
| statusText     | string | The response status text    |
| url            | string | The url of website          |
| ping           | number | The ping latency (in ms)    |
| unavailability | number | Unavailability time (in ms) |

### error

Emitted when an error occurred

Parameter : error

## Properties

---

### available

Return true if site is available else return false

Return :

Boolean

### ping

Return the last ping (in ms) or null if it doesn't exist

Return :

Number or Null

### uptime

Return the uptime (in ms) or null if it doesn't exist

Return :

Number or Null

### unavailability

Return the unavailability or null if it doesn't exist

Return :

Number or Null

## Methods

---

## start()

Start the monitoring of website

Return :

Boolean

```js
Monitor.start();
```

## restart()

Restart the monitoring of website

Return :

Boolean

```js
Monitor.restart();
```

## stop()

Stop the monitoring of website

Return :

Boolean

```js
Monitor.stop();
```

## setInterval(newInterval)

Change the interval check

Params :

newInterval : The new interval in ms (number)

Return :

Boolean

```js
Monitor.setInterval(200);
```

## setURL(newURL)

Change the ping endpoint

Params :

newURL : The new url (string).

Return :

Boolean

```js
Monitor.setURL("https://www.exempla-website.com");
```

## Example

```js
const { WebMonitor } = require("website-pinger");

const Monitor = new WebMonitor("https://website-example.com", {
  interval: 3000,
  timeout: 5000,
});

Monitor.start();
console.log(Monitor.infos);

Monitor.on("outage", (outage) => {
  console.log(outage);
});

Monitor.on("up", (up) => {
  console.log(up);
});
Monitor.on("error", (error) => {
  console.log(error);
});
```
