// MQTT subscriber
var mqtt = require('mqtt')
// const { Console } = require('node:console')
var EdgeClient = mqtt.connect('mqtt://localhost:3005')
var CloudClient = mqtt.connect('mqtt://localhost:3010')


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