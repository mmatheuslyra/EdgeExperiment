/*
    MQTT publisher that generates simulated IoT device parameters data.

    This script is a transcription to javascript MQTT publisher based on the IoT simulated device source code available at: https://github.com/aws-samples/sbs-iot-data-generator.
    It is noteworthy that the mentioned source aimes to be similar to the Simple Beer Service v5.0, available at https://github.com/awslabs/simplebeerservice.
*/
var dateFormat = require('dateformat');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://cloudBroker:3010')
var topic = 'error'
var message = 'Hello Edge!'
var EdgeMessage = {
    'deviceId':'SmartDevice',
    'deviceParameter':'I am Alive'
}

client.on('connect', ()=>{
    setInterval(()=>{
        client.publish(topic, JSON.stringify(EdgeMessage))
        console.log('Message sent!', EdgeMessage)
    }, 5000)
})