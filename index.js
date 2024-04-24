// Import required libraries
const mqtt = require('mqtt'); // MQTT client library
const cbor = require('cbor'); // CBOR encoding library
const moment = require('moment'); // Moment.js for handling dates
require('dotenv').config(); // Load environment variables from .env

// MQTT broker connection options
const brokerUrl = process.env.MQTT_BROKER_URL; // e.g., mqtt://test.mosquitto.org
const options = {
  clientId: process.env.MQTT_CLIENT_ID || 'default-client-id', // e.g., 'mqtt-client-1'
  username: process.env.MQTT_USERNAME, // optional
  password: process.env.MQTT_PASSWORD, // optional
  clean: true, // clean session
};

// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, options);

// Define topic and message data
const topic = 'my/test/topic';
//const data = [1, 2, 3, 'hello', { key: 'value' }]; // Example data
const dataDumy = [
  [
    'D 1234 AA',
    8,
    5
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  [
    'D 1234 AA',
    8,
    4
  ],
  
]
let idx = 0;

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  const sendData = () => {
    // Encode data into CBOR format
    idx = idx + 1;
    const data = [...dataDumy[idx]];
    const utcDatetime = moment().utc().format('DD-MM-YYYY HH:mm:ss');
    data.splice(3, 0, utcDatetime);
    console.log(data)
    const cborData = cbor.encode(data);
    console.log(cborData);

    // Publish CBOR data to the specified topic
    // client.publish(topic, cborData, (err) => {
    //   if (err) {
    //     console.error('Failed to publish:', err);
    //   } else {
    //     console.log(`Data published to topic "${topic}"`);
    //   }
    // });
  }
  // Publish every 2 seconds
  const interval = setInterval(() => {
    sendData();
  }, 2000); // 2000 milliseconds = 2 seconds

  // Handle clean up on exit
  process.on('SIGINT', () => {
    clearInterval(interval); // Clear the interval
    client.end(); // Disconnect from the MQTT broker
    console.log('MQTT client disconnected');
    process.exit(0); // Exit the process
  });
});

client.on('error', (error) => {
  console.error('MQTT connection error:', error);
});
