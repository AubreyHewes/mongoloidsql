/*global describe, it*/
"use strict";

var assert = require("assert");

var builder = require("../src/builder.js");

describe("builder.js", function() {

  describe('SPEC', function () {

    describe("Comparison Query Operators", function () {

      it("$eq", function () {
        assert.equal(builder({"test": "test"}), '`test` = "test"');
        assert.equal(builder({"test": {"$eq": "test"}}), '`test` = "test"');
      });

      it("$gt", function () {
        assert.equal(builder({"test": {"$gt": 1}}), "`test` > 1");
      });

      it("$gte", function () {
        assert.equal(builder({"test": {"$gte": 1}}), "`test` >= 1");
      });

      it("$lt", function () {
        assert.equal(builder({"test": {"$lt": 1}}), "`test` < 1");
      });

      it("$lte", function () {
        assert.equal(builder({"test": {"$lte": 1}}), "`test` <= 1");
      });

      it("$ne", function () {
        assert.equal(builder({"test": {"$ne": 1}}), "`test` != 1");
      });

      it("$in", function () {
        assert.equal(builder({"test": {"$in": [1]}}), "`test` IN (1)");
      });

      it("$nin", function () {
        assert.equal(builder({"test": {"$nin": [1]}}), "`test` NOT IN (1)");
      });

    });

    describe("Logical Query Operators", function () {

      it("$or", function () {
        assert.equal(builder({"$or": [{"col1": 1}, {"col2": 2}]}), "(`col1` = 1 OR `col2` = 2)");
      });

      it("$and", function () {
        assert.equal(builder({"$and": [{"col1": 1}, {"col2": 2}]}), "(`col1` = 1 AND `col2` = 2)");
      });

      it("$not"); // not yet implemented

      it("$nor"); // not yet implemented

    });

    describe("Evaluation Query Operators", function () {

      it("$regex", function () {
        assert.equal(builder({"test": /value.*/}), '`test` REGEXP BINARY "value.*"');
        assert.equal(builder({"test": /value.*/i}), '`test` REGEXP "value.*"');
        assert.equal(builder({"test": {"$regex": "value.*"}}), '`test` REGEXP BINARY "value.*"');
        assert.equal(builder({"test": {"$regex": "value.*", $options: 'i'}}), '`test` REGEXP "value.*"');
      });

    });

  });

  describe("Comparison and Logical Query Operators on same level", function () {

    it("single comparison and single logical $and", function () {
      assert.equal(
        builder({'col1': 1, "$and": [{"col2": 2}, {"col3": 3}]}),
        "(`col1` = 1 AND (`col2` = 2 AND `col3` = 3))"
      );
    });

    it("multiple comparison and single logical $and", function () {
      assert.equal(
        builder({'col1': 1, 'col2': 2, "$and": [{"col3": 3}, {"col4": 4}]}),
        "(`col1` = 1 AND `col2` = 2 AND (`col3` = 3 AND `col4` = 4))"
      );
    });

    it("multiple comparison and single logical $and and single logical $or", function () {
      assert.equal(
        builder({'col1': 1, 'col2': 2, "$and": [{"col3": 3}, {"col4": 4}], "$or": [{"col5": 5}, {"col6": 6}]}),
        "(`col1` = 1 AND `col2` = 2 AND (`col3` = 3 AND `col4` = 4) AND (`col5` = 5 OR `col6` = 6))"
      );
    });

  });

  describe("Comparison and Logical Query Operators with nested Comparison and Logical Query Operators", function () {

    it("extreme nesting", function () {
      assert.equal(
        builder({
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
        }),
        /*jshint -W101*/
        /*jscs:disable maximumLineLength*/
        "(" +
        "`col1` = 1 " +
        "AND (" +
        "(`col2` = 2 OR `col3` = 3) AND `col4` = 4 AND `col5` != 5 AND (`col6` > 6 AND `col7` <= 7 AND (`col8` > 6 OR `col9` <= 7))) " +
        "AND (" +
        "(`col2` = 2 OR `col3` = 3) OR `col4` = 4 OR `col5` != 5 OR (`col6` > 6 AND `col7` <= 7 AND (`col8` > 6 OR `col9` <= 7)))" +
        ")"
        /*jscs:enable maximumLineLength*/
       /*jshint +W101*/
      );
    });

  });

  describe("Value Casting", function () {

    it("should return integer", function () {
      assert.equal(builder({"test": 1}), "`test` = 1");
    });

    it("should return is_null", function () {
      assert.equal(builder({"test": null}), "`test` IS NULL");
    });

    it("should return boolean", function () {
      assert.equal(builder({"test": true}), "`test` = true");
    });

  });

});
