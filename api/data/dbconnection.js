
//This file is made for managing our DB's connection with the MongoDB native driver
//重点： 我们只会选择用Mongoose 或者mongodb native driver来建立server与DB的connection
var MongoClient = require('mongodb').MongoClient;


//before we try and open a connection is we need to build up a connection string for the DB.
//This way the drive will know what going to try and connect to.
 
//The connected string will contain the protocol , in this case it will be 'mongodb//'
var dburl = 'mongodb://kelvin:123456@ds147421.mlab.com:47421/hoteladvisor';//this is a connection string.




var _connection = null;//variable to hold the connection

//下面这个fct会open the connection and store it in a variable  
var open = function(){
    //set _connection
    //下面的callback function will run when a connection is made  
    MongoClient.connect(dburl, function(err, db){
        //err,db这两个obj： err是当connection fails，db是connection obj
        if(err){
            console.log("DB failed");
            return;
        }
        _connection = db;
        console.log("DB open",db);
    });

};//set connection

//function to get connection
var get =function(){
    return _connection;
};

module.exports = {
    open:open,
    get:get
};

