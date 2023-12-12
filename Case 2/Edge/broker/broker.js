// Mosca MQTT broker
var mosca = require('mosca')
var settings = {port: 3005}
var broker = new mosca.Server(settings)
const mongoose = require('mongoose'); 
const os = require('os');
const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads');


broker.on('ready', async ()=>{
  await mongoose.connect('mongodb://mongodb:27017/iotBroker').then(() => console.log('MongoDB Connected!')).catch(err =>{
      console.log(err);
  });

    console.log('Broker is ready!')
});

broker.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});  

broker.on('published', (packet)=>{
    // message =  JSON.stringify(packet.payload.toString());
    // message =  JSON.parse(JSON.stringify(packet.payload.toString('utf-8')));
    message = parsePayload(packet.payload);
    var deviceData = message;
    // console.log(deviceData);

    const DeviceModel = require('./Model/deviceModel');

    const device = new DeviceModel({
        deviceId:deviceData.deviceId,
        deviceParameter: deviceData.deviceParameter,
        deviceValue: deviceData.deviceValue,
        dateTime:deviceData.dateTime
   });

    // // Caling factorial just to generate a CPU overhead
    // if (isMainThread) {
    //   // This is the main thread

    //   // Get the number of CPU cores
    //   const numCores = os.cpus().length;

    //   // Create a worker for each core
    //   for (let i = 0; i < numCores; i++) {
    //     const worker = new Worker(__filename, {
    //       workerData: { start: i * 10 + 1, end: (i + 1) * 10 }, // Adjust the range as needed
    //     });

    //     // Listen for messages from the worker thread
    //     worker.on('message', (result) => {
    //       console.log(`Factorial result from thread ${worker.threadId}: ${result}`);
    //     });
    //   }
    // } else {
    //   // This is a worker thread

    //   const { start, end } = workerData;
    //   console.log(`Worker_thread ${workerData}`);

    //   // Calculate the factorial for the specified range
    //   let result = 1;
    //   for (let i = start; i <= end; i++) {
    //     result *= factorial(20);
    //   }

    //   // Send the result back to the main thread
    //   parentPort.postMessage(result);
    // }



    device.save().then(result=> {
        console.log(result);
    }).catch(err=> {
        console.log(err.message);
    });
})

function parsePayload (payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf8')
  }

  try {
    payload = JSON.parse(payload)
  } catch (e) {
    payload = {}
  }

  return payload
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}