// MQTT subscriber
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:3000')
var topics = ['/sbs/devicedata/flow', '/sbs/devicedata/temperature', 
              '/sbs/devicedata/humidity', '/sbs/devicedata/sound'];

client.on('message', (topic, message)=>{
    message = message.toString()
    console.log(message)
})

//TODO: Angular charts for each topic considering the different devices
//TODO: subscribe to all topics

client.on('connect', ()=>{
    client.subscribe(topics[0])
});

client.on('connect', ()=>{
    client.subscribe(topics[1])
})