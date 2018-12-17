var express = require('express');
var app = express();
var bodyParser = require('body-parser')
//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/shipwaves';
mongoose.connect(mongoDB, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.callback = function (err, data) {
        res.send({
            err: err,
            data: data
        })
    };
    next();
});
var shipment = require('./routers/shipmentRouters.js');
app.use('/shipment', shipment);

var container = require('./routers/containerRouters.js');
app.use('/container', container);

app.listen(3000);
console.log("##########");