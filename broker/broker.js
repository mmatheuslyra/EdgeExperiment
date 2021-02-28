// Mosca MQTT broker
var mosca = require('mosca')
var settings = {port: 3000}
var broker = new mosca.Server(settings)
// const mongoose = require('mongoose');


// //MongoDB connection
// mongoose.connect('mongodb://localhost:27017/iotBroker').then(() => console.log('MongoDB Connected!')).catch(err =>{
//     console.log(err);
// });

broker.on('ready', ()=>{
    console.log('Broker is ready!')
})

broker.on('published', (packet)=>{
    message = packet.payload.toString()
    console.log(message)

    // comparar o tópico, criar o modelo mongo e salvar no banco
})