var builder = require("mongoloidsql");

console.log('SELECT * FROM `table` WHERE ' + builder({id: 1}));
