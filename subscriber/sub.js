// MQTT subscriber
const converter = require('json-2-csv');
const fs = require('fs');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:3005')
const mysql = require('mysql');
var topics = ['/sbs/devicedata/flow', '/sbs/devicedata/temperature', 
              '/sbs/devicedata/humidity', '/sbs/devicedata/sound'];

//Defining MySQL connection for Grafana integration
const db = require('./mysqlconnection');

function saveCsv (file, message){
    let json2csvCallback = function (err, csv) {
        if (err) throw err;

              fs.appendFile(file, csv+'\r\n', 'utf8', function(err) {
                if (err) {
                  console.log('Some error occured - file either not saved or corrupted file saved.');
                } else {
                  console.log('It\'s saved!');
                }
          });
    };

    //File existence check for header creation
    fs.stat(file, (err, stat)=>{
        if(err==null){
            converter.json2csv(JSON.parse(message), json2csvCallback, {prependHeader: false});
        }else{
            converter.json2csv(JSON.parse(message), json2csvCallback);
        }
    });
}

client.on('message', (topic, message)=>{
    message = JSON.parse(JSON.stringify(message.toString('utf-8')));
    let file = 'readings/readings.csv';

    saveCsv(file, message);

    let newMessage = JSON.parse(message);

    //Data saved in a MySQL database due to the non free integration of MongoDB with Grafana
    let sql = 'INSERT INTO subscriber VALUES (null,?,?,?,?)';
    let deviceId = newMessage.deviceId;
    let deviceParameter = newMessage.deviceParameter;
    let deviceValue = Number((newMessage.deviceValue).toFixed(3));
    let dateTime = newMessage.dateTime;

    // console.log(deviceValue + ' ' + deviceParameter  + ' ' + deviceId + ' ' + dateTime);
    db.query(sql, [deviceValue, deviceParameter, deviceId, dateTime], (err, result)=>{ // salvando o histórico de pedidos dentro do MySQL
        if(err) throw (err);
        console.log('MySQL Saved InsertId');
    });
});

client.on('connect', ()=>{
    client.subscribe(topics[0])
});

client.on('connect', ()=>{
    client.subscribe(topics[1])
});