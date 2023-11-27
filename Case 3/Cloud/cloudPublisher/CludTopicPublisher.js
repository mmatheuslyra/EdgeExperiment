/*
    MQTT publisher that generates simulated IoT device parameters data.

    This script is a transcription to javascript MQTT publisher based on the IoT simulated device source code available at: https://github.com/aws-samples/sbs-iot-data-generator.
    It is noteworthy that the mentioned source aimes to be similar to the Simple Beer Service v5.0, available at https://github.com/awslabs/simplebeerservice.
*/
var dateFormat = require('dateformat');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://cloudBroker:3010')
var topic = 'monitoringOrder'
var message = 'Hello World!'

// '/sbs/devicedata/flow', '/sbs/devicedata/temperature', '/sbs/devicedata/humidity', '/sbs/devicedata/sound'


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
    }, 5000);

    setInterval(()=>{
        message = JSON.stringify({message: 'ERROR MONITORING TEST'});
        client.publish('error', message)
        console.log('Message sent!', JSON.parse(message));
    }, 5000);
    // setInterval(()=>{
    //     client.publish('error', 'Hello Edge')
    //     console.log('Message sent!', 'Hello Edge')
    // }, 5000)
});

// client.on('connect', ()=>{
//     setInterval(()=>{
//         client.publish('error', 'Hello Edge')
//         console.log('Message sent!', 'Hello Edge')
//     }, 5000)
// })