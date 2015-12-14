"use strict";

var _ = require("lodash");

var quote = require("./quoter.js");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Query and Projection Operators
//
// https://docs.mongodb.org/manual/reference/operator/query/

//
// Comparison Query Operators
//
// https://docs.mongodb.org/manual/reference/operator/query-comparison/

/**
 * Matches values that are equal to a specified value.
 *
 * Syntax: { <field>: { $eq: <value> } }
 *
 * The $eq expression is equivalent to { field: <value> }.
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_eq
 *
 * @param {String} field
 * @param {*} value
 *
 * @returns {string}
 */
function c$eq(field, value) {
  return quote.column(field) + " = " + quote.value(value);
}

/**
 * Matches values that are greater than a specified value.
 *
 * Syntax: {field: {$gt: value} }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_gt
 *
 * @param {String} field
 * @param {*} value
 *
 * @returns {string}
 */
function c$gt(field, value) {
  return quote.column(field) + " > " + quote.value(value);
}

/**
 * Matches values that are greater than or equal to a specified value.
 *
 * Syntax: {field: {$gte: value} }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_gte
 *
 * @param {String} field
 * @param {*} value
 *
 * @returns {string}
 */
function c$gte(field, value) {
  return quote.column(field) + " >= " + quote.value(value);
}

/**
 * Matches values that are less than a specified value.
 *
 * Syntax: {field: {$lt: value} }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_lt
 *
 * @param {String} field
 * @param {*} value
 *
 * @returns {string}
 */
function c$lt(field, value) {
  return quote.column(field) + " < " + quote.value(value);
}

/**
 * Matches values that are less than or equal to a specified value.
 *
 * Syntax: {field: {$lte: value} }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_lte
 *
 * @param {String} field
 * @param {*} value
 *
 * @returns {string}
 */
function c$lte(field, value) {
  return quote.column(field) + " <= " + quote.value(value);
}

/**
 * Matches all values that are not equal to a specified value.
 *
 * Syntax: {field: {$ne: value} }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_ne
 *
 * @param {String} field
 * @param {*} value
 *
 * @returns {string}
 */
function c$ne(field, value) {
  return quote.column(field) + " != " + quote.value(value);
}

/**
 * Matches any of the values specified in an array.
 *
 * Syntax: { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_in
 *
 * @param {String} field
 * @param {Array} value
 *
 * @returns {string}
 */
function c$in(field, value) {
  return quote.column(field) + " IN (" + quote.value(value) + ")";
}

/**
 * Matches none of the values specified in an array.
 *
 * Syntax: { field: { $nin: [<value1>, <value2>, ... <valueN> ] } }
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/eq/#op._S_nin
 *
 * @param {String} field
 * @param {Array} value
 *
 * @returns {string}
 */
function c$nin(field, value) {
  return quote.column(field) + " NOT IN (" + quote.value(value) + ")";
}

//
// Logical Query Operators
//
// https://docs.mongodb.org/manual/reference/operator/query-logical/

/**
 * Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/or/#op._S_or
 *
 * @param {Array} expressions
 *
 * @returns {string}
 */
function l$or(expressions) {
  //return handleObjectOfClauses(value, _field, "OR");
  return logical(expressions, 'OR');
}

/**
 * Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/or/#op._S_and
 *
 * @param {Array} expressions
 *
 * @returns {string}
 */
function l$and(expressions) {
  //return handleObjectOfClauses(value, _field, "AND");
  return logical(expressions, 'AND');
}

/**
 * Inverts the effect of a query expression and returns documents that do not match the query expression.
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/or/#op._S_not
 *
 * @param {Array} expressions
 *
 * @returns {string}
 */
function l$not(expressions) {
  //@todo ...
  return '$not is NOT IMPLEMENTED';
}

/**
 * Joins query clauses with a logical NOR returns all documents that fail to match both clauses.
 *
 * @see https://docs.mongodb.org/manual/reference/operator/query/or/#op._S_nor
 *
 * @param {Array} expressions
 *
 * @returns {string}
 */
function l$nor(expressions) {
  //@todo ...
  return '$nor is NOT IMPLEMENTED';
}

function handleWhereNullClause(field) {
  return quote.column(field) + " IS NULL";
}

function logical(clauses, type) {

  var expr = clauses.map(function (value) {
    return handleExpression(value);
  }).join(' ' + type + ' ');

  return "(" + expr + ")";
}

function handleObjectOfClauses (clauses, _field, joiner) {

  var expr = [];

  Object.keys(clauses).forEach(function (field) {
    expr.push(handleExpression(clauses[field], field, _field));
  });

  if (expr.length > 1) {
    return "(" + expr.join((joiner ? " " + joiner + " " : " AND ")) + ")";
  }

  return expr.join("");
}

function handleExpression(value, field, _field) {

  if (!_field) {
    _field = field;
  }

  //
  // Comparison Query Operators
  //

  if (field === "$eq") {
    return c$eq(_field, value);
  }

  if (field === "$gt") {
    return c$gt(_field, value);
  }

  if (field === "$gte") {
    return c$gte(_field, value);
  }

  if (field === "$lt") {
    return c$lt(_field, value);
  }

  if (field === "$lte") {
    return c$lte(_field, value);
  }

  if (field === "$ne") {
    return c$ne(_field, value);
  }

  if (field === "$in") {
    return c$in(_field, value);
  }

  if (field === "$nin") {
    return c$nin(_field, value);
  }

  //
  // Logical Query Operators
  //

  if (field === "$or") {
    return l$or(value);
  }

  if (field === "$and") {
    return l$and(value);
  }

  if (field === "$not") {
    return l$not(value);
  }

  if (field === "$nor") {
    return l$nor(value);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Other / Helpers
  //
  if (value === null) {
    return handleWhereNullClause(field);
  }

  if (_.isObject(value)) {
    return handleObjectOfClauses(value, field, _field);
  }

  //if (_.isArray(value)) {
  //  return handleArrayOfClauses(value, field);
  //}

  // DEFAULT... $eq...

  return c$eq(field, value);
}

module.exports = handleExpression;
