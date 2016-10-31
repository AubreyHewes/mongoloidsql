[![Build Status](https://travis-ci.org/AubreyHewes/mongoloidsql.svg?branch=master)](https://travis-ci.org/AubreyHewes/mongoloidsql)

# Mongo selector SQL builder (WIP)

Build an SQL selector (`WHERE`) from a Mongo selector.

**NOTE: Currently the produced SQL is [mysql](http://dev.mysql.com/doc/refman/en/select.html) opinionated**

# Install

    npm install mongoloidsql

# Usage

## Example 1
````javascript

var builder = require('mongoloidsql');

console.log('SELECT * FROM `table` WHERE ' + builder({id: 1});
````

Output:

````sql
SELECT * FROM `table` WHERE `id` = 1
````

## Example 2
````javascript

var builder = require('mongoloidsql');

console.log('SELECT * FROM `table` WHERE ' + builder({id: 1, 'test' : { '$gt': 1}});
````

Output:

````sql
SELECT * FROM `table` WHERE `id` = 1 AND `test` > 1
````

## etc...

### what what
````javascript

var builder = require('mongoloidsql');

console.log('SELECT * FROM `table` WHERE ' + builder({
        'col1': 1,
        "$and": [
          {
            $or: [
              {'col2': 2},
              {'col3': 3}
            ]
          },
          {
            'col4': {
              '$eq': 4
            }
          },
          {
            'col5': {
              '$ne': 5
            }
          },
          {
            '$and': [
              {'col6': {'$gt': 6}},
              {'col7': {'$lte': 7}},
              {'$or': [
                {'col8': {'$gt': 6}},
                {'col9': {'$lte': 7}}
              ]}
            ]
          }
        ],
        '$or': [
          {
            $or: [
              {'col2': 2},
              {'col3': 3}
            ]
          },
          {
            'col4': {
              '$eq': 4
            }
          },
          {
            'col5': {
              '$ne': 5
            }
          },
          {
            '$and': [
              {'col6': {'$gt': 6}},
              {'col7': {'$lte': 7}},
              {'$or': [
                {'col8': {'$gt': 6}},
                {'col9': {'$lte': 7}}
              ]}
            ]
          }
        ],
      })
    );
  }));

````

Output:

````sql
SELECT * FROM `table` WHERE (`col1` = 1 AND ((`col2` = 2 OR `col3` = 3) AND `col4` = 4 AND `col5` != 5 AND (`col6` > 6 AND `col7` <= 7 AND (`col8` > 6 OR `col9` <= 7))) AND ((`col2` = 2 OR `col3` = 3) OR `col4` = 4 OR `col5` != 5 OR (`col6` > 6 AND `col7` <= 7 AND (`col8` > 6 OR `col9` <= 7))))
````

# Reference

 * https://docs.mongodb.org/manual/tutorial/query-documents/
 * https://docs.mongodb.org/manual/reference/operator/query/

# What is not (yet) implemented/supported

 * [Logical Query Operators](https://docs.mongodb.org/manual/reference/operator/query-logical/)
    * [$not](https://docs.mongodb.org/manual/reference/operator/query/not/#op._S_not)
    * [$nor](https://docs.mongodb.org/manual/reference/operator/query/nor/#op._S_nor)
 * [Evaluation Query Operators](https://docs.mongodb.org/manual/reference/operator/query-evaluation/)
    * [$mod](https://docs.mongodb.org/manual/reference/operator/query/mod/#op._S_mod)
    * [$text](https://docs.mongodb.org/manual/reference/operator/query/text/#op._S_text)
    * [$where](https://docs.mongodb.org/manual/reference/operator/query/where/#op._S_where)
    * [$regexp](https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_regex)
