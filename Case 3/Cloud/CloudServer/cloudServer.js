var cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser') 
const mongoose = require('mongoose');
var dateFormat = require('dateformat');

//This app redirect specific routes for the proper files
const DeviceModel = require('./Model/deviceModel');

//comando brew services start mongodb-community
// mongoose.connect('mongodb://localhost:27017/iotBroker').then(() => console.log('dataManager MongoDB Connected!'))
// .catch(err => {
//     console.log(Error, 'Not Connected' + err.message);
// });

// const dbConn = async ()=>{
//     await mongoose.connect('mongodb://localhost:27017/iotBroker').then(() => console.log('MongoDB Connected!')).catch(err =>{
//         console.log(err);
//     });
// };

mongoose.connect('mongodb://mongodb:27017/iotBroker', { useNewUrlParser: true }).then(() => console.log('MongoDB Connected!')).catch(err =>{
        console.log(err);
});

app.use(morgan('dev')); //log the operations through the server
app.use(bodyParser.urlencoded({extended: false})); //Receive body requests, the extend iqual to false means that only suport simple bodies
app.use(bodyParser.json());     //The body parser allows the body property inside the requests
app.use(cors());

// All database
app.get('/',(req,res,next)=>{
    // DeviceModel.find().lean().then(result=>{
    //     res.status(200).json(result);
    // }).catch(err=>{
    //     res.status(404).json(err);
    // });
});

// All from specific device
app.get('/:deviceId', (req, res, next)=>{
    // DeviceModel.find({'deviceId':req.params.deviceId}).exec().then(doc=>{
    //     res.status(200).json(doc);
    // }).catch(err=>{
    //     res.status(200).json({
    //         message:"Data doesn't exists"
    //     });
    // });
});

// Return the avarege for an specific device and topic 
app.get('/devices/:deviceId/:deviceParameter',(req,res,next)=>{

    // DeviceModel.aggregate([{$match:{'deviceId':req.params.deviceId, 
    //                         'deviceParameter':req.params.deviceParameter}},
    //                       {$group: {_id:null, average: {$avg: '$deviceValue'}}}
    // ]).exec().then(result=>{;
    //     res.status(200).json(({deviceId:req.params.deviceId,
    //                            deviceParameter: req.params.deviceParameter,
    //                            dateTime:dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"), 
    //                            result}));
    // }).catch(err=>{
    //     res.status(404).json(err);
    // });   
});

// AJUSTAR PRA OUVIR SOMENTE O ENDPONINT QUE O DATAMANEGER MANDA AS MÉDIAS
app.post('/',(req, res, next)=>{
    res.status(200).json({
        message:'Data received'
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