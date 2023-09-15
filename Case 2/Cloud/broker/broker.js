// Mosca MQTT broker
var mosca = require('mosca')
var settings = {port: 3010}
var broker = new mosca.Server(settings)
const mongoose = require('mongoose'); 

//MongoDB connection
// mongoose.connect('mongodb://localhost:27017/iotBroker').then(() => console.log('MongoDB Connected!')).catch(err =>{
//     console.log(err);
// });

broker.on('ready', async ()=>{
  await mongoose.connect('mongodb://mongodb:27017/iotBroker').then(() => console.log('MongoDB Connected!')).catch(err =>{
      console.log(err);
  });

    console.log('Broker is ready!')
});

broker.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

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

  
// //TODO: Personalizar pra conversar com o PubE_subC
// broker.on('published', (packet)=>{
//     // message =  JSON.stringify(packet.payload.toString());
//     // message =  JSON.parse(JSON.stringify(packet.payload.toString('utf-8')));
//     message = parsePayload(packet.payload);
//     var order = message;
//     // console.log(deviceData);

//     const MonitorOrder = require('./Model/monitorOrder');

//     console.log(order);

//   //   const monitorOrder = new MonitorOrder({
//   //       monitoringOrder: {words:[order.words[0], order.words[1]]},
//   //       dateTime:deviceData.dateTime
//   //  });

//     // monitorOrder.save().then(result=> {
//     //     console.log(result);
//     // }).catch(err=> {
//     //     console.log(err.message);
//     // });
// });

broker.on('published', (packet)=>{
  message = parsePayload(packet.payload);
  console.log(message)
})



