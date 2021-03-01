var cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser') 
const mongoose = require('mongoose');

//This app redirect specific routes for the proper files
const DeviceModel = require('./Model/deviceModel');

//comando brew services start mongodb-community
mongoose.connect('mongodb://localhost:27017/iotBroker').then(() => console.log('dataManager MongoDB Connected!'))
.catch(err => {
    console.log(Error, 'Not Connected' + err.message);
});

app.use(morgan('dev')); //log the operations through the server
app.use(bodyParser.urlencoded({extended: false})); //Receive body requests, the extend iqual to false means that only suport simple bodies
app.use(bodyParser.json());     //The body parser allows the body property inside the requests
app.use(cors());

app.get('/',(req,res,next)=>{
    DeviceModel.find().lean().then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(404).json(err);
    });
});

app.get('/:deviceId', (req, res, next)=>{
    DeviceModel.findById(req.params.deviceId).exec().then(doc=>{
        res.status(200).json(doc);
    }).catch(err=>{
        res.status(200).json({
            message:"Data doesn't exists"
        });
    });
});

app.post('/',(req, res, next)=>{
    res.status(200).json({
        message: 'Adress not valid'
    });
});

//Error handle, if reach this line means that the previous  wasn't enough
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error); // Pass the error to the function bellow
});
 
//handles all kinds of error that may occur in the whole project 
app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({ // general errors will get status 500
        error:{
            message: error.message
        }
    });
});

module.exports = app;