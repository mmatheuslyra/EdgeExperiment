# Edge Experiment

This project intends to emulate and explore an edge computing scenario. Therefore, our project counts with five components interacting in the edge through the MQTT protocol and, from time to time, a client in a cloud server interacts with the edge.

* Edge: 
  * Publisher: MQTT publisher that generates simulated IoT device parameters data. This script is a transcription to javascript MQTT publisher based on the IoT simulated device source code available at https://github.com/aws-samples/sbs-iot-data-generator. It is noteworthy that the mentioned source aims to be similar to the Simple Beer Service v5.0, available at https://github.com/awslabs/simplebeerservice.

  * Broker: MQTT broker responsible for receiving the simulated IoT devices messages and send them to the subscribers. Also, in this service, we store the data in a MongoDB database in order to be preprocessed in the edge before being sent to the cloud.
  
  * Subscriber: Data consumer that interacts with the IoT broker.
   
  * Data Manager: Component responsible for after some computation, send the preprocessed to the cloud client.
  * 
  
* Cloud client: Final component of this scenario. Requests data from the edge services.

![Edge Environment Simulator Model 2 (4)](https://github.com/mmatheuslyra/EdgeExperiment/assets/22990008/9e731b9e-0d72-469e-9555-66718020bb34)


Network distribution chart:

![Edge Environment Simulator Model 2-Page-5](https://github.com/mmatheuslyra/EdgeExperiment/assets/22990008/adf6a3c0-93f4-4392-bc21-24fcc207c6b0)


