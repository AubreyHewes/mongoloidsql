"use strict";

/**
 * value/column quoter..
 *
 * @opinionated mysql
 *
 * current is value as "value" and column as `column`
 *
 * with value if it is a boolean or number then will be boolean or number (in sql)
 * if value is not a string (or above) then will be null.. this is opinionated and subject to change.
 *
 * @todo remove translation (i.e. date) to translator
 */

var _ = require("lodash");
var moment = require("moment");

var DATETIME_FORMAT = 'YYYY-MM-DD H:mm:ss';

//http://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
//http://php.net/manual/en/function.mysql-real-escape-string.php
function escape(str) {
  if (!str.replace) {
    return str;
  }

  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char; // prepends a backslash to backslash, percent, and double/single quotes
    }
  });
}

function value(val) {

  if (_.isArray(val)) {
    return val.map(value);
  }

  // introspect...
  switch (typeof val) {

    case "number":
      return val;

    case "Date":
      return val;

    case "boolean":
      return val ? "true" : "false";
  }

  if (val instanceof Date) {
    //http://dev.mysql.com/doc/refman/5.7/en/date-and-time-literals.html
    val = moment(val).format(DATETIME_FORMAT);
  }

  if (!val || !val.replace) {
    return "NULL";
  }

  return "\"" + escape(val) + "\"";
}

function column(val) {
  if (_.isArray(val)) {
    return val.map(column);
  }
  return "`" + escape(val) + "`";
}

module.exports = {value: value, column: column, table: column};
