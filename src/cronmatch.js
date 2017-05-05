

function getRange(a, b) {
  a = parseInt(a);
  b = parseInt(b);
  return Array.apply(null, Array(b-a+1)).map((x, i) => i + a);
}

module.exports = function cronmatch(cronExpression, dateArg) {
  var dateObj;

  // If passed a Date, use that, if passed a string, use to make a Date,
  // otherwise, assume we just want now.
  if (Object.prototype.toString.call(dateArg) === '[object Date]') {
    dateObj = dateArg;
  } else if (typeof(dateArg) == 'string') {
    dateObj = new Date(dateArg);
  } else {
    dateObj = new Date();
  }

  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date arg passed to cron matcher: ', dateArg);
    return false;
  }

  var match = true;

  var expr = cronExpression.split(' ');
  var cron = [
    { type: 'minute', expr: expr[0], range: [0, 59], match: dateObj.getMinutes() },
    { type: 'hour', expr: expr[1], range: [0, 23], match: dateObj.getHours() },
    { type: 'day', expr: expr[2], range: [1, 31], match: dateObj.getDate() },
    { type: 'month', expr: expr[3], range: [1, 12], match: dateObj.getMonth() },
    { type: 'dayOfWeek', expr: expr[4], range: [0, 6], match: dateObj.getDay() }
  ];

  cron
    .forEach((t) => {
      var step, range;
      let values = [];
      if (t.expr == '?' || t.expr == '*') return;
      if (t.expr.indexOf('/') !== -1) {
        let parts = t.expr.split('/');
        range = parts[0] == '*' ? t.range : parts[0];
        range = typeof(range) == 'string' ? range.split('-') : range;
        step = parseInt(parts[1]) || 1;
        for (let i=parseInt(range[0]); i<=parseInt(range[1]); i+=step) {
          values.push(i);
        }
      } else {
        let parts = t.expr.split(',');
        parts.forEach((i) => {
          if (i.indexOf('-') !== -1) {
            let splitExpr = i.split('-');
            getRange(splitExpr[0], splitExpr[1]).forEach((j) => {
              values.push(j);
            });
          } else {
            values.push(parseInt(i));
          }
        });
      }
      // console.log(values);
      if (values.indexOf(t.match) == -1) {
        match = false;
      }
    });
  return match;
};
