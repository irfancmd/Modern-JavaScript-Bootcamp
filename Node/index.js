// If we import content from another file through "require", that file will only be
// executed once and its content will be cached. Anytime we try to require that file
// later, the cached content will be returned
const counterObject = require("./myScript.js");

console.log(counterObject.getCounter());
counterObject.incrementCounter();
console.log(counterObject.getCounter());

// Importing the other file again
const newCounterObject = require("./myScript.js");

// The value will be 1 instead of 0 as this new counter uses cached value from
// the previously imported object. So, they're actually pointing to 
// the same cached object
console.log(newCounterObject.getCounter());