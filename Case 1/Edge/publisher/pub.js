/*
    MQTT publisher that generates simulated IoT device parameters data.

    This script is a transcription to javascript MQTT publisher based on the IoT simulated device source code available at: https://github.com/aws-samples/sbs-iot-data-generator.
    It is noteworthy that the mentioned source aimes to be similar to the Simple Beer Service v5.0, available at https://github.com/awslabs/simplebeerservice.
*/

const { Console } = require("console");
var dateFormat = require('dateformat');

// MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:3005')
var topic = ''
var message = 'Hello World!'

deviceNames = ['SBS01', 'SBS02', 'SBS03', 'SBS04', 'SBS05'];
publishTopic = [['/sbs/devicedata/flow', 'getFlowValues' ], ['/sbs/devicedata/temperature', 'getTemperatureValues'], 
                ['/sbs/devicedata/humidity', 'getHumidityValues'], ['/sbs/devicedata/sound', 'getSoundValues']];

function Random(min, max) {
    return Math.random() * (max - min) + min;
}

function RandomItem(array){
    return array[Math.floor(Math.random()*array.length)];
}

// Generate Flow values
function getFlowValues(){
    data = {
        'deviceValue':Random(60, 100), 
        'deviceParameter':'Flow', 
        'deviceId':RandomItem(deviceNames),
        'dateTime':dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
    };

    // console.log(data);
    return data;
}

// Generate Temperature values
function getTemperatureValues(){
    data = {
        'deviceValue':Random(15, 35), 
        'deviceParameter':'Temperature', 
        'deviceId':RandomItem(deviceNames),
        'dateTime':dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
    };

    // console.log(data);
    return data;
}

// Generate Humidity values
function getHumidityValues(){
    data = {
        'deviceValue':Random(50, 90), 
        'deviceParameter':'Humidity', 
        'deviceId':RandomItem(deviceNames),
        'dateTime':dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
    };

    // console.log(data);
    return data;
}

// Generate Sound values
function getSoundValues(){
    data = {
        'deviceValue':Random(100, 140), 
        'deviceParameter':'Sound', 
        'deviceId':RandomItem(deviceNames),
        'dateTime':dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
    };

    // console.log(data);
    return data;
}

function getMessage(option){
    let result;
    switch (option){
        case 'getFlowValues' : result = getFlowValues(); break;
        case 'getTemperatureValues' : result = getTemperatureValues(); break;
        case 'getHumidityValues' : result = getHumidityValues(); break;
        case 'getSoundValues' : result = getSoundValues(); break;
    }


    return result
}

    setInterval(()=>{
    rnd = Math.random();
        // client.on('connect', ()=>{
                topic=RandomItem(publishTopic);
                message = JSON.stringify(getMessage(topic[1]));                
                client.publish(topic[0], message)
                console.log('Message sent!', message);
        // });
}, 2000);

