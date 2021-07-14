// Mosca MQTT broker
var mosca = require('mosca')
var settings = {port: 3005}
var broker = new mosca.Server(settings)
const mongoose = require('mongoose'); 

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/iotBroker').then(() => console.log('MongoDB Connected!')).catch(err =>{
    console.log(err);
});

broker.on('ready', ()=>{
    console.log('Broker is ready!')
})

function parsePayload (payload) {
    if (payload instanceof Buffer) {
      payload = payload.toString('utf8')
    }
  
    try {
      payload = JSON.parse(payload)
    } catch (e) {
      payload = {}
    }
  
    return payload
  }

// broker.on('connect',()=>{
//   console.log();
// })

broker.on('published', (packet)=>{
    // message =  JSON.stringify(packet.payload.toString());
    // message =  JSON.parse(JSON.stringify(packet.payload.toString('utf-8')));
    message = parsePayload(packet.payload);
    var deviceData = message;
    console.log(deviceData);

    const DeviceModel = require('./Model/deviceModel');

    const device = new DeviceModel({
        deviceId:deviceData.deviceId,
        deviceParameter: deviceData.deviceParameter,
        deviceValue: deviceData.deviceValue,
        dateTime:deviceData.dateTime
   });

    device.save().then(result=> {
        console.log(result);
    }).catch(err=> {
        console.log(err.message);
    });

})