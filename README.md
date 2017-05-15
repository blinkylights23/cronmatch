# cronmatch

`Cronmatch` is a simple cron expression parser. It compares a provided date string or `Date` object with a cron expression to see if it matches.

## Installation

For use in Node:
```
npm install @paulsmith/cronmatch
```

For use in the browser:
```
<script src="https://unpkg.com/@paulsmith/cronmatch/dist/cronmatch.min.js"></script>
```

## Usage

```

const cronmatch = require('cronmatch');

var cronExpr = '*/2 * * * *'; // Every even minute
var date1 = new Date('January 20, 2020 12:00:00');
var date2 = new Date('January 20, 2020 12:01:00');

cronmatch(cronExpr, date1);   // true
cronmatch(cronExpr, date2);   // false

```

minute: [0, 59]
hour: [0, 23]
day: [1, 31]
month: [1, 12]
dayOfWeek: [0, 6]



## Limitations

* `cronmatch` does not yet understand 6-field cron expressions with seconds
* It does not yet validate cron expressions
* Does not yet support JAN-DEC for month or MON-SUN for dayOfWeek