// MQTT subscriber
const converter = require('json-2-csv');
const fs = require('fs');
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:3000')
var topics = ['/sbs/devicedata/flow', '/sbs/devicedata/temperature', 
              '/sbs/devicedata/humidity', '/sbs/devicedata/sound'];

client.on('message', (topic, message)=>{
    message = JSON.parse(JSON.stringify(message.toString('utf-8')));
    let file = 'readings/readings.csv';

    //Data saved in a CSV file. PS: Option made due to the non free integration of MongoDB with Grafana
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

    fs.stat(file, (err, stat)=>{
        if(err==null){
            converter.json2csv(JSON.parse(message), json2csvCallback, {prependHeader: false});
        }else{
            converter.json2csv(JSON.parse(message), json2csvCallback);
        }
    })
})


client.on('connect', ()=>{
    client.subscribe(topics[0])
});

client.on('connect', ()=>{
    client.subscribe(topics[1])
})