
var child_process = require('child_process');
console.log(1);

//child_process.spawn('node',['_fibonacci.js']);//if we run it, this child process does not share the same console as the main node process,
// to address this, see next line

child_process.spawn('node',['_fibonacci.js'],{
    stdio : 'inherit'
});

//require('./_fibonacci.js');//this function blocks the flow of the main process

//spawn a child process to deal with heavy computational functions


console.log(2);