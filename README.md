<div align="center">
  <h1> Web-Pinger </h1>
<img src="https://nodei.co/npm/website-pinger.png"> <br>
  <a href="https://www.npmjs.com/package/website-pinger"> <img src="https://badge.fury.io/js/website-pinger.svg"> </a> 
  <a href="https://github.com/SmaugDev/web-pinger/blob/master/LICENSE"> <img src="https://img.shields.io/github/license/SmaugDev/web-pinger.svg"> </a>
  <a href="http://makeapullrequest.com"> <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"> </a>

</div>



This module is a web pinger for simplify the monitoring, and creation of status page.

## Usage
Create a new WebMonitor with an URL (string) as a parameter : new WebMonitor("https://website.com", options)
### Options :
Type : Object


| PARAMETER | TYPE   |OPTIONAL| DEFAULT |DESCRIPTION
|-----------|--------|--------|---------|-----------|
| interval  | number |    ✓   |  3000ms | Interval for check site | 
| retries   | number |    ✓   |    3    | Retries before create an outage | 
| timeout   | number |    ✓   |  3000ms | Maximum waiting time before creating an outage | 

### Events
`up` Emitted when site is online <br>
Parameter : status   <br>

| PROPERTIES | TYPE  | DESCRIPTION                                     | 
|------------|--------|------------------------------------------------|
| statusCode | number | The response status code                       |
| statusText | string | The response status text                       |
| url        | string | The url of website                             |
| ping       | number | The ping latency (in ms)                       |
| Uptime     | number | Availability time (in ms)                      |

`outage` Emitted when site is have an outage <br>
Parameter : status   <br>

| PROPERTIES | TYPE  | DESCRIPTION                                     | 
|------------|--------|------------------------------------------------|
| statusCode | number | The response status code                       |
| statusText | string | The response status text                       |
| url        | string | The url of website                             |
| ping       | number | The ping latency (in ms)                       |
| unavailability | number | Unavailability time (in ms)                |

`error` Emitted when an error occurred <br>
Parameter : error   <br>

### Properties :

`available` return true if site is available else return false <br>
Type : Boolean

`ping` return the last ping (in ms) or null if it doesn't exist <br>
Type : Number or Null

`uptime` return the uptime (in ms) or null if it doesn't exist <br>
Type : Number or Null

`unavailability` return the unavailability or null if it doesn't exist <br>
Type : Number or Null

### Methods :
`start()` start the monitoring of website <br>
Type : Boolean

`restart()` restart the monitoring of website <br>
Type : Boolean

`stop()` stop the monitoring of website <br>
Type : Boolean

`setInterval(newInterval)` change the interval check <br>
Type : Boolean

`setURL(newURL)` change the ping url <br>
Type : Boolean

## Example
```js
const {WebMonitor} = require('web-pinger')

const Monitor = new WebMonitor("https://website.com", {
    interval: 3000,
    timeout: 5000
})

Monitor.start()
console.log(Monitor.infos);

Monitor.on('outage', (outage) => {
    console.log(outage);
})

Monitor.on('up', (up) => {
    console.log(up);
})
Monitor.on('error', (error) => {
    console.log(error);

})
```
