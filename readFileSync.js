var fs = require('fs'); //fs is a native node module
console.log("going to get a file");
var file = fs.readFileSync('readFileSync.js'); //readfileSync is a method in 'fs' module 
console.log("got file");

console.log("app contin...");