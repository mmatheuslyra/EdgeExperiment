// MQTT subscriber
var mqtt = require('mqtt')
// const { Console } = require('node:console')
var EdgeClient = mqtt.connect('mqtt://localhost:3005')
var CloudClient = mqtt.connect('mqtt://localhost:3010')
const CloudTopic = ['monitoringOrder'];

// CRIAR ARRAY COM MENSAGEM DA NUVEM E PASSAR NA MENSAGEM PARA OS SUBSCRIBERS DA EDGE
// VER COMO SE INSCREVER EM VÁRIOS TÓPICOS DE ARRAY 
//   CloudClient.on('message', (Array, message)=>{    ???

// FAZER OUTRO DIRETÓRIO PARA O LOG WATCHDOG, A PARTIR DESSE ARQUIVO CRIAR O CLOUDCLIENT E EDGE SUB + DATAMANEGER
// NESSE CASO TEMOS UM EQUIPAMENTO QUE TEM PODER DE PROCESSAMENTO, 
// NÃO ENVIA MENSAGEM PRA OUTRO MAS ELE MESMO EXECUTA

//      ATUALIZAR DIAGRAMA DO CASO DO WHATCHDOG PRA MOSTRAR PRO DE ROSE NA QUARTA

//Edge Publisher
var EdgeTopic = 'EdgeAlive'
var EdgeMessage = {
    'deviceId':'SmartDevice',
    'deviceParameter':'I am Alive'
}

CloudClient.on('connect',()=>{
    CloudClient.subscribe(CloudTopic); 
})

EdgeClient.on('connect', (ƒ)=>{
    setInterval(()=>{
        EdgeClient.publish(EdgeTopic, JSON.stringify(EdgeMessage))
        console.log('Message sent!', EdgeMessage)
    }, 5000)
})

// MQTT Cloud subscriber
// var CloudTopic = 'monitoringOrder'

CloudClient.on('message', (topic, message)=>{
    message = message.toString()
    let newMessage = JSON.parse(message);
    // console.log(newMessage);
    let newmessage = JSON.parse(JSON.stringify(message.toString('utf-8')));
    console.log(JSON.parse(newmessage));

    if (topic == 'monitoringOrder'){
        //  console.log(newMessage.monitoringOrder.words);

        newMessage.monitoringOrder.words.forEach((element, index) => {
            if(!CloudTopic.includes(element)){
                // console.log(element);
                CloudTopic.push(element);
                // CloudClient.subscribe(element);
            }    
            });

        CloudTopic.forEach(function (element, indice) {
            CloudClient.subscribe(element);
            EdgeClient.subscribe(element);
        });
    }
})


EdgeClient.on('message', (topic, message)=>{
    let newmessage = JSON.parse(JSON.stringify(message.toString('utf-8')));
    console.log(JSON.parse(newmessage));
    // message = JSON.parse(JSON.stringify(message.toString('utf-8')));
    // let file = 'readings/readings.csv';

    // saveCsv(file, message);
    
    // let newMessage = JSON.parse(message);
    // console.log(newMessage);
});



// CloudClient.on('connect', (topic)=>{
//     console.log('Edge subscriber linked to cloud' + topic);
//     CloudClient.subscribe(CloudTopic);
//     if(!CloudTopic.includes(element)){
//         CloudTopic.forEach(function (element, indice) {
//             CloudClient.subscribe(element);
//         });
//     }
// })

