// MQTT subscriber
var mqtt = require('mqtt')
// const { Console } = require('node:console')
var EdgeClient = mqtt.connect('mqtt://localhost:3005')
var CloudClient = mqtt.connect('mqtt://localhost:3010')


//Edge Publisher
var EdgeTopic = 'EdgeAlive'
var EdgeMessage = {
    'deviceId':'SmartDevice',
    'deviceParameter':'I am Alive'
}

EdgeClient.on('connect', (ƒ)=>{
    setInterval(()=>{
        EdgeClient.publish(EdgeTopic, JSON.stringify(EdgeMessage))
        console.log('Message sent!', EdgeMessage)
    }, 5000)
})

// MQTT Cloud subscriber
var CloudTopic = 'monitoringOrder'

CloudClient.on('message', (topic, message)=>{
    message = message.toString()
    console.log(JSON.parse(message));
})

CloudClient.on('connect', ()=>{
    CloudClient.subscribe(CloudTopic)
})