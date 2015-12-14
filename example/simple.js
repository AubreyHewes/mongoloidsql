var builder = require("monogloidsql");

console.log('SELECT * FROM `table` WHERE ' + builder({id: 1}));
