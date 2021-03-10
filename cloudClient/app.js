const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser') 
const axios = require('axios');
const mongoose = require('mongoose'); 

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/egdeReduce').then(() => console.log('MongoDB Connected!')).catch(err =>{
    console.log(err);
});

app.use(morgan('dev')); //log the operations through the server
app.use(bodyParser.urlencoded({extended: false})); //Receive body requests, the extend iqual to false means that only suport simple bodies
app.use(bodyParser.json());     //The body parser allows the body property inside the requests
app.use(cors());


deviceNames = ['SBS01', 'SBS02', 'SBS03', 'SBS04', 'SBS05'];
publishTopic = ['Flow','Temperature','Humidity', 'Sound'];

const DeviceModel = require('./Model/reportModel');


// This app also can be used to request data from the "cloud" database
app.get('/',(req,res,next)=>{
  DeviceModel.find().lean().then(result=>{
      res.status(200).json(result);
  }).catch(err=>{
      res.status(404).json(err);
  });
});

// Requests to the dataMenager API
setInterval(()=>{
  deviceNames.forEach(device => {
    publishTopic.forEach(topic=>{
      axios.get('http://localhost:3001/devices/'+device+'/'+topic) // Request for the dataManeger
        .then(response => {

          const device = new DeviceModel({
            deviceId:response.data.deviceId,
            deviceParameter: response.data.deviceParameter,
            deviceValue: response.data.result[0].average,
            dateTime:response.data.dateTime
        });

        device.save().then(result=> {
          console.log(result);
        }).catch(err=> {
            console.log(err.message);
        });

          console.log(response.data);
          // console.log(response.data.url);
          // console.log(response.data.explanation);
        })
        .catch(error => {
          console.log(error);
      });
    });
  });

}, 30000);

module.exports = app;