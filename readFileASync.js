var fs = require('fs'); //fs is a native node module

var onFileLoad = function(err,file){ //named callback function
    console.log("got file");

};

console.log("going to get a file");
fs.readFile('readFileSync.js', onFileLoad); //readfile is a method in 'fs' module that got the file asynchronusly 

console.log("app contin...");