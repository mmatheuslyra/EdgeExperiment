/*
    MQTT publisher that generates simulated IoT device parameters data.

    This script is a transcription to javascript MQTT publisher based on the IoT simulated device source code available at: https://github.com/aws-samples/sbs-iot-data-generator.
    It is noteworthy that the mentioned source aimes to be similar to the Simple Beer Service v5.0, available at https://github.com/awslabs/simplebeerservice.
*/
var dateFormat = require('dateformat');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:3010')
var topic = 'monitoringOrder'
var message = 'Hello World!'

data = {
    'monitoringOrder':{'words':[
        'Overload', 'error'
    ]}, 
    'dateTime':dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
};

client.on('connect', ()=>{
    setInterval(()=>{
        message = JSON.stringify(data);
        client.publish(topic, message)
        console.log('Message sent!', JSON.parse(message));
    }, 5000)
})