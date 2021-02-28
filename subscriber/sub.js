// MQTT subscriber
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:3000')
var topic = '/sbs/devicedata/temperature'

client.on('message', (topic, message)=>{
    message = message.toString()
    console.log(message)
})

//TODO: Use multiple subscribers on the same container

client.on('connect', ()=>{
    client.subscribe('/sbs/devicedata/temperature')
});

client.on('connect', ()=>{
    client.subscribe('/sbs/devicedata/flow')
})