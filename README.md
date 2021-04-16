# Web ping
This module is a web pinger for simplify the monitoring, and creation of status page.

## Usage
Create a new Pinger with an URL (string) as a parameter.
#### Options :
Type : Object


| PARAMETER | TYPE   |OPTIONAL| DEFAULT |DESCRIPTION
|-----------|--------|--------|---------|-----------|
| interval  | number |    ✓   |  3000ms | Interval for check site | 
| retries   | number |    ✓   |    3    | Retries before create an outage | 
| timeout   | number |    ✓   |  3000ms | Maximum waiting time before creating an outage | 

#### Methods :
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