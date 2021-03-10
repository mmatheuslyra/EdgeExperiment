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
// app.use(express.static("./landingPage/"));


//TODO: Implement the most reasonable query to the MongoDB IoTBroker database
//TODO: Considerar de enviar da cloud para a edge o nome de cada device pelo body

deviceNames = ['SBS01', 'SBS02', 'SBS03', 'SBS04', 'SBS05'];
publishTopic = ['Flow','Temperature','Humidity', 'Sound'];


setInterval(()=>{

  deviceNames.forEach(device => {
    publishTopic.forEach(topic=>{
      axios.get('http://localhost:3001/devices/'+device+'/'+topic) // Request for the dataManeger
        .then(response => {
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