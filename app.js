//require('./api/data/dbconnection.js').open();//this code is to open connection to the DB using Mongo native driver

require('./api/data/db.js');
var express = require('express');
var app = express();//init express to create the app. The app object is instantiated on creation of the Express server.
var path = require('path');//pass the path of the file that we want to send


var bodyParser = require('body-parser');

var routes = require('./api/routes');



app.set('port',(process.env.PORT || 5000));


app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});

/**
 * we need to tell Express to treat this folder as a static folder.

The skeleton for this applies an express.static method as Express middleware via app.use, looking like this.
 */
app.use(express.static(path.join(__dirname,'public')));//wt static method does is when express receives a request for a root, first thing it is going to check to see whether that root is matched by any of the files within that public folder. If it finds a match, it'll deliver that files correctly to the browser without any need to add in any extra root.
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/fonts', express.static(__dirname + '/fonts'));

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use('/api', routes);


// app.get('/',function(req, res){
//     console.log("GET the homepage");
//     res
//         .status(200)
//         .sendFile(path.join(__dirname,'public','index.html'));//每一个folder名字都是分开的， 这样可以避免不同的OS都能用这个server file
// });


// app.get 是用来应对一个get method的http request
// app.get('/json',function(req, res){
//     console.log("GET the json");
//     res
//         .status(200)
//         .json({ "jsonData" : true});
// });
// //send a file 
// app.get('/file',function(req, res){
//     console.log("GET the file");
//     res
//         .status(200)
//         .sendFile(path.join(__dirname, 'app.js'));//"__" double underscore == find the current directory
// });


//app.listen() is async function
var server = app.listen(app.get('port'),function(){
    var port = server.address().port;
    console.log("port 3000 read" + port);

}); // retrieve port variable




