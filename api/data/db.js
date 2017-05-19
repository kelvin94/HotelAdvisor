//Firsly, require Moongoose into the file
var mongoose = require('mongoose');

var dburl = 'mongodb://kelvin:123456@ds147421.mlab.com:47421/hoteladvisor';//this is a connection string.


//To connect to DB, like the native drive, Mongoose uses conenct method
mongoose.connect(dburl);//When using native driver, we can have a call back function to inform when DB is connected or there is an err

mongoose.connection.on('connected', function(){
    console.log("Mongoose connected to " + dburl);
});
//disconnected event listener
mongoose.connection.on('disconnected', function(){
    console.log("Mongoose disconnected to ");
});
mongoose.connection.on('error', function(err){
    console.log("Mongoose connection error:  " + err );
});

//event 'SIGINT' === user terminates the app from terminal 
//下面的一个event listener，当一个用户想要terminates这个app就do w/e is programed in the call back function
process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log("moongoose disconnected through app termination (SIGINT)")
        process.exit(0);
    });//close function is Async function so that we need a call back function
});

//in Heroku, the event that an app is terminated is SIGTERM
process.on('SIGTERM', function(){
    mongoose.connection.close(function(){
        console.log("moongoose disconnected through app termination (SIGTERM)")
        process.exit(0);
    });//close function is Async function so that we need a call back function
});

//the event that restarts the app is SIGUSR2
process.once('SIGUSR2', function(){
    mongoose.connection.close(function(){
        console.log("moongoose disconnected through app termination (SIGUSR2)");
        process.kill(process.pid, 'SIGUSR2');
    });//close function is Async function so that we need a call back function
});

//bring in schemas and models
require('./hotels.model.js');
require('./users.model.js');



